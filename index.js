var commonmark = require('commonmark');
var base64Img = require('base64-img');
var TurndownService = require('turndown')

var reader = new commonmark.Parser();
var writer = new commonmark.HtmlRenderer();
var parsed = reader.parse("![alt text](images/icon.png \"title\")"); // parsed is a 'Node' tree

console.log(writer.render(parsed)); // result is a String

//Transform dataURIs
var walker = parsed.walker();
var event, node;
var callback

while ((event = walker.next())) {
  node = event.node;
 
  if (event.entering && node.type === 'text') {
    //node.literal = node.literal.toUpperCase();
  }
  if (event.entering && node.type === 'image'){
    node.destination = base64Img.base64Sync(node.destination);
    
    //Remote URL
    //var url = "https://raw.githubusercontent.com/adam-p/markdown-here/master/src/common/images/icon48.png"
    //base64Img.requestBase64(url, function(err, res, body) {});
      
  }
  if(event.entering){
    console.log("Type:"+node.type+" Literal:"+node.literal +" Title:"+node.title+" Destination:"+node.destination);
  }

}


html = writer.render(parsed); //result in a String
console.log(html);

//Transform in Markdown
var turndownService = new TurndownService()
var markdown = turndownService.turndown(html)
console.log(markdown);

