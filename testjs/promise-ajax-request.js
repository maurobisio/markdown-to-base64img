var request = require('ajax-request');

function requestBase64Promise(url) {
    return new Promise((resolve, reject) => {
      request({
        url: url,
        isBuffer: false
      }, function (err, res, body) {
        if (err) return reject(err);
  
        var data = 'data:' + res.headers['content-type'] + ';base64,' + body.toString('base64');
        resolve({ res, body });
      });
    });
  }
var href = 'https://raw.githubusercontent.com/adam-p/markdown-here/master/src/common/images/icon48.png'
requestBase64Promise(href).then(res=> console.log(res)).then(data=> console.log(data))