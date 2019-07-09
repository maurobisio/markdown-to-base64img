const marked = require('marked');

class UnparserRenderer extends marked.Renderer { ///////////////////////////////

	static render(source, options) {
		return (new this(options)).render(source);
	}

	render(source) {
		let result = marked(source, { renderer: this });
		return result.trim()
			.replace(/\r/g, '\n')
			.replace(/\n{3,}/g, '\n\n');
	}

	code(code, infostring, escaped) {
		return '```'+ infostring +'\n'+ code +'\n```\n\n';
	}

	blockquote(quote) {
		return '> '+ quote.trim().replace(/\n/g, '\n> ') +'\n\n';
	}

	html(text) {
		// It is assumed HTML cannot be inline.
		return text.trim() +'\n\n';
	}
	
	heading(text, level, raw, slugger) {
		return '#'.repeat(level) +' '+ text +'\n\n';
	}

	hr() {
		return '---\n\n';
	}
 
	list(body, ordered, start) {
		let items = body.trim().split(/\n/g);
		if (ordered) {
			items = items.map((item) => {
				let r = start +'. '+ item;
				start++;
				return r;
			});
		} else {
			items = items.map((item) => '+ '+ item);
		}
		return '\n\n'+ items.join('\n\n').trim() +'\n\n';
	}

	listitem(text) {
		return '\n'+ text.replace(/\n+/g, 
				(g0) => '\r'.repeat(g0.length) +'\t').trim();
	}

	checkbox(checked) {
		return '['+ (checked ? 'x' : ' ') +']';
	}

	paragraph(text) {
		return text.trim() +'\n\n';
	}

	table(header, body) {
		let bar = '|'+ header.split('|').slice(1,-1).map((th, i) => {
				let result = '-'.repeat(Math.max(3, th.length));
				if (this._tablecols && this._tablecols[i]) {
					switch (this._tablecols[i]) {
						case 'left': return ':'+ result;
						case 'center': return ':'+ result +':';
						case 'right': return result +':';
					}
				}
				return result;
			}).join('|') +'|\n';
		let result = header + bar + body +'\n\n';
		this._tablecols = [];
		return result;
	}

	tablerow(content) {
		return content +'|\n';	
	}

	tablecell(content, flags) {
		// Uses property `_tablecols` to save the columns alignment.
		if (flags.header) {
			if (!this._tablecols) {
				this._tablecols = [];
			}
			this._tablecols.push(flags.align);
		}
		return '|'+ content;
	}

	strong(text) {
		return '**'+ text +'**';
	}

	em(text) {
		return '_'+ text +'_';
	}

	codespan(text) {
		return '`'+ text +'`';
	}

	br() {
		return '\n\n';
	}

	del(text) {
		return '~~'+ text +'~~';
	}

	link(href, title, text) {
		title = title ? ' "'+ title +'"' : '';
		return '['+ text +']('+ href + title +')';
	}

	image(href, title, text) {
		title = title ? ' "'+ title +'"' : '';
		return '!['+ text +']('+ href + title +')';
	}

	text(text) {
		return text.replace(/&#(\d+);/g, 
			(g0, g1) => String.fromCharCode(+g1)
		);
	}
}

const EXAMPLE1 = `
Marked - Markdown Parser
========================

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

console.log(UnparserRenderer.render(EXAMPLE1));