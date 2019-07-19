/***
 https://www.npmjs.com/package/image-promise
 https://github.com/bfred-it/image-promise
 */
var loadImage = require('image-promise');
let base64Img = require('base64-img');

var image = 'https://raw.githubusercontent.com/adam-p/markdown-here/master/src/common/images/icon48.png';
// var image = $('img')[0]; // it can also be an <img> element
 
loadImage(image, { crossorigin: 'anonymous' })
.then(function (img) {
    console.log(base64Img.base64Sync(image));
    //ctx.drawImage(img, 0, 0, 10, 10);
    // now you can do this
    //canvas.toDataURL('image/png')
})
.catch(function () {
    console.error('Image failed to load :(');
});