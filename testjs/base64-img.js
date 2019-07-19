let base64Img = require('base64-img');
/***
https://www.npmjs.com/package/base64-img
***/

var href = 'https://raw.githubusercontent.com/adam-p/markdown-here/master/src/common/images/icon48.png';
var href2 = '../images/icon.png';
console.log(base64Img.base64Sync(href2));