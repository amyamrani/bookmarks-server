const express = require('express')
const { isWebUri } = require('valid-url')
const logger = require('../logger')
const xss = require('xss')
const path = require('path')
const BookmarksService = require('./bookmarks-service')

const bookmarksRouter = express.Router()
const jsonParser = express.json()

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: bookmark.url,
  description: xss(bookmark.description),
  rating: Number(bookmark.rating),
})

bookmarksRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks.map(serializeBookmark))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    // get the data from the body
    const { title, url, description, rating } = req.body;

    // validation
    if (!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .send({
          error: { message: 'Title is required' } 
        })
    }
    
    if (!url || !isWebUri(url)) {
      logger.error(`Invalid URL entered: '${url}'`);
      return res
        .status(400)
        .send({
          error: { message: 'Must enter a valid URL' } 
        });
    }

    if (!rating || !Number.isInteger(rating) || (rating < 1 || rating > 5)) {
      logger.error(`Invalid rating entered: '${rating}'`);
      return res
        .status(400)
        .send({
          error: { message: 'Rating must be a number between 1 and 5' } 
        });
    }

    const newBookmark = { title, url, description, rating }

    BookmarksService.insertBookmark(req.app.get('db'), newBookmark)
      .then(bookmark => {
        logger.info(`Bookmark with id ${bookmark.id} created`)
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${bookmark.id}`))
          .json(serializeBookmark(bookmark))
      })
      .catch(next)
  })
  
bookmarksRouter 
  .route('/:bookmark_id')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarksService.getById(knexInstance, req.params.bookmark_id)
      .then(bookmark => {
        if (!bookmark) {
          return res.status(404).json({
            error: { message: `Bookmark doesn't exist` }
          })
        }
        res.bookmark = bookmark // save the bookmark for the next middleware
        next() 
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeBookmark(res.bookmark))
  })  
  .delete((req, res, next) => {
    const { bookmark_id } = req.params
    BookmarksService.deleteBookmark(req.app.get('db'), bookmark_id)
      .then(() => {
        logger.info(`Bookmark with id ${bookmark_id} deleted.`)
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, url, description, rating } = req.body
    const bookmarkToUpdate = { title, url, description, rating }

    const numberOfValues = Object.values(bookmarkToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'title', 'url', 'description' or 'rating'`
        }
      })
    }

    BookmarksService.updateBookmark(
      req.app.get('db'),
      req.params.bookmark_id,
      bookmarkToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = bookmarksRouter