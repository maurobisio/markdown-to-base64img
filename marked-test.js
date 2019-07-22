const marked = require("marked");
/***
https://github.com/markedjs/marked
https://marked.js.org/demo/?text=Marked%20-%20Markdown%20Parser%0A%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%0A!%5Balt%20text%5D(https%3A%2F%2Fraw.githubusercontent.com%2Fadam-p%2Fmarkdown-here%2Fmaster%2Fsrc%2Fcommon%2Fimages%2Ficon48.png%20%22icon%22)%0A%0A%5BMarked%5D%20lets%20you%20convert%20%5BMarkdown%5D%20into%20HTML.%20%20Markdown%20is%20a%20simple%20text%20format%20whose%20goal%20is%20to%20be%20very%20easy%20to%20read%20and%20write%2C%20even%20when%20not%20converted%20to%20HTML.%20%20This%20demo%20page%20will%20let%20you%20type%20anything%20you%20like%20and%20see%20how%20it%20gets%20converted.%20%20Live.%20%20No%20more%20waiting%20around.%0A%0AHow%20To%20Use%20The%20Demo%0A-------------------%0A%0A1.%20Type%20in%20stuff%20on%20the%20left.%0A2.%20See%20the%20live%20updates%20on%20the%20right.%0A%0AThat%27s%20it.%20%20Pretty%20simple.%20%20There%27s%20also%20a%20drop-down%20option%20in%20the%20upper%20right%20to%20switch%20between%20various%20views%3A%0A%0A-%20**Preview%3A**%20%20A%20live%20display%20of%20the%20generated%20HTML%20as%20it%20would%20render%20in%20a%20browser.%0A-%20**HTML%20Source%3A**%20%20The%20generated%20HTML%20before%20your%20browser%20makes%20it%20pretty.%0A-%20**Lexer%20Data%3A**%20%20What%20%5Bmarked%5D%20uses%20internally%2C%20in%20case%20you%20like%20gory%20stuff%20like%20this.%0A-%20**Quick%20Reference%3A**%20%20A%20brief%20run-down%20of%20how%20to%20format%20things%20using%20markdown.%0A%0AWhy%20Markdown%3F%0A-------------%0A%0AIt%27s%20easy.%20%20It%27s%20not%20overly%20bloated%2C%20unlike%20HTML.%20%20Also%2C%20as%20the%20creator%20of%20%5Bmarkdown%5D%20says%2C%0A%0A%3E%20The%20overriding%20design%20goal%20for%20Markdown%27s%0A%3E%20formatting%20syntax%20is%20to%20make%20it%20as%20readable%0A%3E%20as%20possible.%20The%20idea%20is%20that%20a%0A%3E%20Markdown-formatted%20document%20should%20be%0A%3E%20publishable%20as-is%2C%20as%20plain%20text%2C%20without%0A%3E%20looking%20like%20it%27s%20been%20marked%20up%20with%20tags%0A%3E%20or%20formatting%20instructions.%0A%0AReady%20to%20start%20writing%3F%20%20Either%20start%20changing%20stuff%20on%20the%20left%20or%0A%5Bclear%20everything%5D(%2Fdemo%2F%3Ftext%3D)%20with%20a%20simple%20click.%0A%0A%5BMarked%5D%3A%20https%3A%2F%2Fgithub.com%2Fmarkedjs%2Fmarked%2F%0A%5BMarkdown%5D%3A%20http%3A%2F%2Fdaringfireball.net%2Fprojects%2Fmarkdown%2F%0A&options=%7B%0A%20%22baseUrl%22%3A%20null%2C%0A%20%22breaks%22%3A%20false%2C%0A%20%22gfm%22%3A%20true%2C%0A%20%22headerIds%22%3A%20true%2C%0A%20%22headerPrefix%22%3A%20%22%22%2C%0A%20%22highlight%22%3A%20null%2C%0A%20%22langPrefix%22%3A%20%22language-%22%2C%0A%20%22mangle%22%3A%20true%2C%0A%20%22pedantic%22%3A%20false%2C%0A%20%22sanitize%22%3A%20false%2C%0A%20%22sanitizer%22%3A%20null%2C%0A%20%22silent%22%3A%20false%2C%0A%20%22smartLists%22%3A%20false%2C%0A%20%22smartypants%22%3A%20false%2C%0A%20%22xhtml%22%3A%20false%0A%7D&version=master
https://marked.js.org/#/USING_PRO.md#renderer

***/

let base64Img = require("base64-img");
//var base64 = require('node-base64-image');
//var request = require('request');
//const fetch = require("node-fetch");
//const fetch = require('isomorphic-fetch');
var request = require("ajax-request");
var base64ImgPromise = require("base64-img-promise");
const download = require("image-downloader");
const getUrls = require("get-urls");

class UnparserRenderer extends marked.Renderer {
  static render(source, options) {
    return new this(options).render(source);
  }

  render(source) {
    let result = marked(source, { renderer: this });
    return result
      .trim()
      .replace(/\r/g, "\n")
      .replace(/\n{3,}/g, "\n\n");
  }

  code(code, infostring, escaped) {
    return "```" + infostring + "\n" + code + "\n```\n\n";
  }

  blockquote(quote) {
    return "> " + quote.trim().replace(/\n/g, "\n> ") + "\n\n";
  }

  html(text) {
    // It is assumed HTML cannot be inline.
    return text.trim() + "\n\n";
  }

  heading(text, level, raw, slugger) {
    return "#".repeat(level) + " " + text + "\n\n";
  }

  hr() {
    return "---\n\n";
  }

  list(body, ordered, start) {
    let items = body.trim().split(/\n/g);
    if (ordered) {
      items = items.map(item => {
        let r = start + ". " + item;
        start++;
        return r;
      });
    } else {
      items = items.map(item => "+ " + item);
    }
    return "\n\n" + items.join("\n\n").trim() + "\n\n";
  }

  listitem(text) {
    return (
      "\n" + text.replace(/\n+/g, g0 => "\r".repeat(g0.length) + "\t").trim()
    );
  }

  checkbox(checked) {
    return "[" + (checked ? "x" : " ") + "]";
  }

  paragraph(text) {
    return text.trim() + "\n\n";
  }

  table(header, body) {
    let bar =
      "|" +
      header
        .split("|")
        .slice(1, -1)
        .map((th, i) => {
          let result = "-".repeat(Math.max(3, th.length));
          if (this._tablecols && this._tablecols[i]) {
            switch (this._tablecols[i]) {
              case "left":
                return ":" + result;
              case "center":
                return ":" + result + ":";
              case "right":
                return result + ":";
            }
          }
          return result;
        })
        .join("|") +
      "|\n";
    let result = header + bar + body + "\n\n";
    this._tablecols = [];
    return result;
  }

  tablerow(content) {
    return content + "|\n";
  }

  tablecell(content, flags) {
    // Uses property `_tablecols` to save the columns alignment.
    if (flags.header) {
      if (!this._tablecols) {
        this._tablecols = [];
      }
      this._tablecols.push(flags.align);
    }
    return "|" + content;
  }

  strong(text) {
    return "**" + text + "**";
  }

  em(text) {
    return "_" + text + "_";
  }

  codespan(text) {
    return "`" + text + "`";
  }

  br() {
    return "\n\n";
  }

  del(text) {
    return "~~" + text + "~~";
  }

  link(href, title, text) {
    title = title ? ' "' + title + '"' : "";
    return "[" + text + "](" + href + title + ")";
  }

  image(href, title, text) {
    title = title ? ' "' + title + '"' : "";
    return "![" + text + "](" + base64Img.base64Sync(href) + title + ")";

    /***
		var pat = /^https?:\/\//i;
		base64.encode(href,{string:true, local:!pat.test(href)},function(err, data) {
			if(!err){
				console.log(data)
				return '!['+ text +']('+ data + title +')';
			} else {
				console.log(err.message);
				return '!['+ text +']('+ err.message + title +')';
			}
		})
		***/
  }

  text(text) {
    return text.replace(/&#(\d+);/g, (g0, g1) => String.fromCharCode(+g1));
  }
}

const EXAMPLE1 = `
Marked - Markdown Parser
========================

![alt text](images/icon.png "icon")

![alt text](https://raw.githubusercontent.com/adam-p/markdown-here/master/src/common/images/icon48.png "icon")

[Marked] lets you convert [Markdown] into HTML.  Markdown is a simple text format whose goal is to be very easy to read and write, even when not converted to HTML.  This demo page will let you type anything you like and see how it gets converted.  Live.  No more waiting around.

How To Use The Demo
-------------------

1. Type in stuff on the left.
	- nested list 1 item 1 with ~~deleted text~~.
	- nested list 1 item 2 with \`inline code\`.
2. See the live updates on the right.
	- nested list 2 item 1.

That's it.  Pretty simple.  There's also a drop-down option in the upper right to switch between various views:

- **Preview:**  A live display of the generated HTML as it would render in a browser.
- **HTML Source:**  The generated HTML before your browser makes it pretty.
- **Lexer Data:**  What [marked] uses internally, in case you like gory stuff like this.
- **Quick Reference:**  A brief run-down of how to format things using markdown.

\`\`\`{.javascript}
console.log("How about a magic trick? ;-)");
\`\`\`

<!-- This is an HTML comment -->

Why Markdown?
-------------

~~~haskell
putStrLn "Indeed, why?"
~~~

It's easy.  It's not overly bloated, unlike HTML.  Also, as the creator of [markdown] says,

<div>div</div>

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

|This | is | a | table|
|:----|:--:|---|-----:|
|Esto|es|una|tabla|
|Esta|e|uma|tabela|
|C'est|une|table||
|Dies|ist|eine|Tabelle|


Ready to start writing?  Either start changing stuff on the left or
[clear everything](/demo/?text=) with a simple click.

[Marked]: https://github.com/markedjs/marked/
[Markdown]: http://daringfireball.net/projects/markdown/
`;

const EXAMPLE2 = `
# 2.Empahasis
>![alt text](images/icon.png "icon")
>Emphasis, aka italics, with *asterisks* or _underscores_.
>>Inline-style: 
![alt text](https://raw.githubusercontent.com/adam-p/markdown-here/master/src/common/images/icon48.png "Logo Title Text 1")
>>Strong emphasis, aka bold, with **asterisks** or __underscores__.
>
>Combined emphasis with **asterisks and _underscores_**.
>
>Strikethrough uses two tildes. ~~Scratch this.~~
`;

const EXAMPLE3 = `
# heading

[link][1]

[1]: #heading "heading"
`;

async function main() {
  //console.log(UnparserRenderer.render(EXAMPLE2));

  //marked.setOptions({renderer:new UnparserRenderer.render()})
  const opt = { renderer: new UnparserRenderer() };

  const lexer = new marked.Lexer();
  const tokens = lexer.lex(EXAMPLE2, opt);
  console.log(tokens);
  console.log(lexer.rules);

  //Recorro los lexemas y obtengo las URL
  var set = new Set();
  for (i = 0; i < tokens.length; i++) {
    console.log(i);
    console.log(tokens[i]);
    if (tokens[i]["type"] == "paragraph") {
      text = tokens[i]["text"];
      var urlImg = /(https?:\/\/.*\.(?:png|jpg))/i;
      if (urlImg.test(text)) {
        console.log("True");
        const path = "images";
        var mySet = getUrls(text);
        var url;
        for (let item of mySet) {
          url = item;
          set.add(item);
        }
        console.log(url);
        set.add;
        console.log(url.substring(url.lastIndexOf("/") + 1));
        filename = path + "/" + url.substring(url.lastIndexOf("/") + 1);
        tokens[i]["text"] = text.replace(urlImg, filename);
        console.log(tokens[i]["text"]);
      }
    }
  }
  console.log(tokens);

  //Descargo las imagenes
  await Promise.all(
    [...set].map(url => {
      return download.image({
        url: url,
        dest: "./images"
      });
    })
  );

  //Parser y Unparser
  const markdown = marked.parser(tokens, opt);
  console.log(markdown);
  console.log(tokens);
}
main();

function downloadIMG(url, path) {
  const options = {
    url: url,
    dest: path // Save to /path/to/dest/image.jpg
  };
  return download
    .image(options)
    .then(({ filename, image }) => {
      console.log("File saved to", filename);
      return filename;
    })
    .catch(err => {
      console.error(err);
      return error(e);
    });
}

async function downloadIMGAsync(url, path) {
  const options = {
    url: url,
    dest: path // Save to /path/to/dest/image.jpg
  };
  try {
    const { filename, image } = await download.image(options);
    return filename.json(); // => /path/to/dest/image.jpg
  } catch (e) {
    return error(e);
  }
}
