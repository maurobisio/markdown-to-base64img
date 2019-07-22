const getUrls = require('get-urls');

const text = 'Lorem ipsum dolor sit amet, //sindresorhus.com consectetuer adipiscing http://yeoman.io elit.';

console.log(getUrls(text));
//=> Set {'http://sindresorhus.com', 'http://yeoman.io'}