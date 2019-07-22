const download = require('image-downloader')
 
// Download to a directory and save with the original filename
//https://www.npmjs.com/package/image-downloader
const options = {
  url: 'https://raw.githubusercontent.com/adam-p/markdown-here/master/src/common/images/icon48.png',
  dest: '../images'                  // Save to /path/to/dest/image.jpg
}
 
download.image(options)
  .then(({ filename, image }) => {
    console.log('File saved to', filename)
  })
  .catch((err) => {
    console.error(err)
  })