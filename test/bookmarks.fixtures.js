function makeBookmarksArray() {
  return [
    {
      id: 1,
      title: 'Google', 
      url: 'http://wwww.google.com', 
      description: 'Search Engine', 
      rating: 5
    },
    {
      id: 2,
      title: 'Twitter', 
      url: 'http://wwww.twitter.com', 
      description: 'Social Media', 
      rating: 4
    },
    {
      id: 3,
      title: 'Pinterest', 
      url: 'http://wwww.pinterest.com', 
      description: 'Social Media Board', 
      rating: 3
    },
    {
      id: 4,
      title: 'StumbleUpon', 
      url: 'http://wwww.stumbleupon.com', 
      description: 'Social Media Toolbar', 
      rating: 2
    },
  ];
}

function makeMaliciousBookmark() {
  const maliciousBookmark = {
    id: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    url: 'https://www.hackers.com',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    rating: 1,
  }
  const expectedBookmark = {
    ...maliciousBookmark,
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  }
  return {
    maliciousBookmark,
    expectedBookmark,
  }
}

module.exports = {
  makeBookmarksArray,
  makeMaliciousBookmark,
}