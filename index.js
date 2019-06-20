#!/usr/bin/env node

let commonmark = require('commonmark');
let base64Img = require('base64-img');
let TurndownService = require('turndown') 

let mdtoBase64img = () => {
  let reader = new commonmark.Parser();
  let writer = new commonmark.HtmlRenderer();
  let parsed = reader.parse("![alt text](images/icon.png \"title\")"); // parsed is a 'Node' tree

  console.log(writer.render(parsed)); // result is a String

  //Transform dataURIs
  let walker = parsed.walker();
  let event, node;

  while ((event = walker.next())) {
    node = event.node;
  
    if (event.entering && node.type === 'text') {
      //node.literal = node.literal.toUpperCase();
    }
    if (event.entering && node.type === 'image'){
      node.destination = base64Img.base64Sync(node.destination);
      
      //Remote URL
      //let url = "https://raw.githubusercontent.com/adam-p/markdown-here/master/src/common/images/icon48.png"
      //base64Img.requestBase64(url, function(err, res, body) {});
        
    }
    if(event.entering){
      console.log("Type:"+node.type+" Literal:"+node.literal +" Title:"+node.title+" Destination:"+node.destination);
    }

  }


  html = writer.render(parsed); //result in a String
  console.log(html);

  //Transform in Markdown
  let turndownService = new TurndownService()
  let markdown = turndownService.turndown(html)
  console.log(markdown);
}

module.exports = mdtoBase64img;