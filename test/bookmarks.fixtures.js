function makeBookmarksArray() {
  return [
    {
      id: 1,
      title: 'Google', 
      url: 'http://wwww.google.com', 
      description: 'Search Engine', 
      rating: '5'
    },
    {
      id: 2,
      title: 'Twitter', 
      url: 'http://wwww.twitter.com', 
      description: 'Social Media', 
      rating: '4'
    },
    {
      id: 3,
      title: 'Pinterest', 
      url: 'http://wwww.pinterest.com', 
      description: 'Social Media Board', 
      rating: '3'
    },
    {
      id: 4,
      title: 'StumbleUpon', 
      url: 'http://wwww.stumbleupon.com', 
      description: 'Social Media Toolbar', 
      rating: '2'
    },
  ];
}

module.exports = {
  makeBookmarksArray,
}