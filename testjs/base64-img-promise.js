var base64Img = require('base64-img-promise');
/***
 https://www.npmjs.com/package/base64-img-promise
 https://github.com/e-e/base64-img-promise
***/

var url = 'https://raw.githubusercontent.com/adam-p/markdown-here/master/src/common/images/icon48.png';
base64Img.requestBase64(url).then(function({ res, data }) {console.log(data)});
//base64Img.requestBase64(url, function(err, res, data) {console.log(data)});