var base64 = require('node-base64-image'); // ES5

/***
https://www.npmjs.com/package/node-base64-image

https://github.com/riyadhalnur/node-base64-image
https://github.com/riyadhalnur/node-base64-image/tree/48ccb3a785ba53841dc0821548dff8177da7bfb0
https://github.com/riyadhalnur/node-base64-image/blob/48ccb3a785ba53841dc0821548dff8177da7bfb0/src/node-base64-image.js#L13-L13
https://github.com/riyadhalnur/node-base64-image/blob/master/docs/docs.md

https://stackoverflow.com/questions/5135566/javascript-callbacks-and-optional-params
***/



var href = 'https://raw.githubusercontent.com/adam-p/markdown-here/master/src/common/images/icon48.png';
var href2 = '../images/icon.png';
//var buff = new Buffer(href)

function base64_img(href){
    var pat = /^https?:\/\//i;
    base64.encode(href,{string:true, local:!pat.test(href)},function(err, data) {
        if(!err){
            console.log(data)
        } else {
          console.log(err.message);
        }
    })
}
base64_img(href);
base64_img(href2);