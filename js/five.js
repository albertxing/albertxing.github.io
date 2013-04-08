/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, window, document */

// Global variabls
var textCanvas = document.getElementById('body'),
	suggestions = ['work', 'portfolio', 'projects', 'about', 'info', 'contact', 'email'],
	suggested = '',
	currSuggest = '',
	current = '',
	i = 0,
	mLeft = 10,
	mTop = 20,
	rx = 0,
	ry = mTop - 13,
	tab = 0,
	line = 0,
	lineHeight = 18,
	ready = false;

// Temporary canvas variables
var ctx, blinkCanvas, bctx, suggCanvas, sctx;

// Keyword variables
var initial, work, portfolio, projects, about, info, contact, email;

initial = ['<div id="hold">', '\t<span id="text">', '\t\tThe end is where we start from.', '\t</span>', '</div>'];

work = portfolio = projects = ['<div id="work">WORK</div>', '<style>', '\t#work {', '\t\tposition: fixed;', '\t\tbackground: white;', '\t\twidth: 100px;', '\t\theight: 50px;', '\t\tfont: 1.5em/50px "DejaVu Sans Mono", Monaco, Consolas, monspace;', '\t\ttop: 50%;', '\t\tleft: 50%;', '\t\tmargin: -25px 0 0 -50px;', '}', '</style>'];

about = info = contact = email = ['<div id="about">ABOUT</div>', '<style>', '\t#about {', '\t\tposition: fixed;', '\t\tbackground: skyblue;', '\t\twidth: 100px;', '\t\theight: 50px;', '\t\tfont: 1.5em/50px "DejaVu Sans Mono", Monaco, Consolas, monspace;', '\t\ttop: 50%;', '\t\tleft: 50%;', '\t\tmargin: -25px 0 0 -50px;', '}', '</style>'];

var printInt, blinkAnim, blinkInt, cWidth, cHeight, ouput, charWidth, allWidth, winCharLength, numLines;

function parameters() {

	'use strict';

	cWidth = textCanvas.width = blinkCanvas.width = suggCanvas.width = window.innerWidth;
	cHeight = textCanvas.height = blinkCanvas.height = suggCanvas.height = window.innerHeight;
	ctx.font = sctx.font = '1em \'DejaVu Sans Mono\', Monaco, Consolas, Ubuntu Mono, monospace';
	sctx.fillStyle = "#478EAB";
	ctx.fillStyle = '#AAA';
	bctx.fillStyle = '#CCC';

	var all = '';
	for (var l in output) {
		all += output[l];
	}

	charWidth = ctx.measureText(' ').width;
	allWidth = ctx.measureText(all).width;
	winCharLength = Math.floor((cWidth - 2 * mLeft) / charWidth);

	numLines = Math.floor(window.innerHeight / lineHeight);
}

function reorder() {

	'use strict';

	var all = '';
	for (var l in output) {
		all += output[l];
	}

	line = 0;
	output = [all];
	while (output[line].length >= winCharLength) {
		output[line + 1] = output[line].substr(winCharLength,output[line].length);
		output[line] = output[line].substr(0,winCharLength);
		line++;
	}
}

function convertTab(array) {
	var newArray = [];
	for (var item in array) {
		newArray[item] = array[item].replace(/\t/g,'    ');
	}
	return newArray;
}

function go(input,loader,byLine) {
	ready = false;
	clearInterval(blinkInt);
	clearInterval(blinkAnim);
	bctx.globalAlpha = 1;
	output = convertTab(input);
	if (byLine) {
		var startingLine = 0;
		printInt = setInterval(function() {
			if (line < output.length) {
				render(output.slice(startingLine,line));
				line++;
				if (line - startingLine >= numLines) {
					startingLine++;
				}
			} else {
				clearInterval(printInt);
				writeCode(output);
				output[line] = "";
				render(output);
				suggest();
				blink();
				blinkInt = setInterval(blink,1200);
				ready = true;
				return false;
			}
		},20);
	} else {
		printInt = setInterval(function() {
			if (i > output[line].length && output[line + 1] !== undefined) {
				line++;
				i = 0;
			} else if (i > output[line].length) {
				clearInterval(printInt);
				// Add new line
				rx = 0;
				if (loader) {
					line++;
					output[line] = '';
				}
				else
					writeCode(output);
				if (input == initial) {
					go(['I am Albert Xing. I code. I design. I dream in color. Welcome to my world.'],true,false);
					return false;
				}
				render(output);
				suggest();
				blink();
				blinkInt = setInterval(blink,1200);
				ready = true;
				return false;
			} else {
				var type = [output[line].substr(0,i)];
				if (ctx.measureText(type).width > cWidth - 2 * mLeft) {
					var breakText = output[line].substr(i,output[line].length);
					output[line] = output[line].substr(0,i);
					output.splice(line + 1, 0, breakText);
					line++;
					i = 0;
				}
				var compile = output.slice(0,line);
				compile[line] = type;
				render(compile);
			}
			i++;
		}, 15);
	}
}

function writeCode(input) {
	var all = '';
	for (var l in input) {
		all += input[l];
	}
	document.getElementById('output').innerHTML += all;
	ctx.clearRect(0, 0, cWidth, cHeight);
	line = 0;
	output = [''];
}

function fold(type,i) {
	if (ctx.measureText(type).width > cWidth - 2 * mLeft) {
		var breakText = output[line].substr(i,output[line].length);
		line++;
		output[line] = breakText;
	}
}

function render(type) {
	parameters();
	ctx.clearRect(0, 0, cWidth, cHeight);
	bctx.clearRect(0, 0, cWidth, cHeight);
	for (var a in type) {
		ctx.fillText(type[a], mLeft, mTop + lineHeight * a);
	}
	rx = ctx.measureText(type[line]).width + mLeft;
	bctx.fillRect(rx, ry + lineHeight * line, 9, 17);
}

function blink() {
	var a = 0;
	blinkAnim = setInterval(function() {
		if (a > Math.PI) {
			clearInterval(blinkAnim);
			return false;
		} else {
			bctx.clearRect(0, 0, cWidth, cHeight);
			bctx.globalAlpha = Math.abs(Math.cos(a));
			bctx.fillRect(rx, ry + line * lineHeight, 9, 17);
		}
		a += 0.2;
	}, 50);
}

// No shit, Sherlock
function detKey(e) {
	// Ready! Not.
	if (!ready) {
		return false;
	}
	else {
		// If there are witches, there must be vampires
		var keyID = e.which;

		// Ghosts, come forward.
		clearInterval(blinkInt);
		clearInterval(blinkAnim);
		bctx.globalAlpha = 1;

		// To be or not to be
		if (output[line].substr(output[line].length - 7,output[line].length) == dF('Rfwnxxf5')) {
			document.querySelector('body').style.background = dF('dsjntpo1');
			ctx.fillStyle = "#FFF";
			bctx.fillStyle = "#DDD";
			render(output);
		}

		blink();
		blinkInt = setInterval(blink, 1200);

		// Too lazy to change the function name?
		return retKey(keyID,e.shiftKey,e.ctrlKey);
	}
}

function retKey(keyID,shift,ctrl) {
	// Light switch
	switch (true)
	{
	// Functions
	case (keyID >= 112 && keyID <= 123):
		break;

	// Unlucky! (Return)
	case (keyID == 13):
		var all = '';
		for (var l in output) {
			all += output[l];
		}
		if (suggested.indexOf(output[line].toLowerCase()) !== -1) {
			line = 0;
			go(window[suggested],false,true);
			return;
		} else if (all.search(/^[^<]*<([A-z][A-z0-9]*).*>.*<\/\1>[^<]*$/) !== -1) {
			output[line] += mapKey(shift, keyID);
			line = 0;
			output = [all];
			writeCode(output,output[line].length);
		} else {
			output[line + 1] = "";
			rx = 0;
			line++;
		}
		render(output);
		suggest();
		break;

	// I've heard of a holiday called Easter
	case (keyID == 55 && shift):
		document.querySelector('body').style.background = "white";
		document.querySelector('#hold').style.color = "#333";
		bstyle.color = '#333';
		ctx.fillStyle = '#333';
		bctx.fillStyle = '#DDD';
		render(output);
		break;

	// Click - clack
	case (keyID == 82 && ctrl && shift):
		window.location.reload(true);
		break;

	// Click - clack
	case ((keyID == 82 && ctrl) || keyID == 116):
		window.location.reload();
		break;

	// Boom
	case (keyID == 46 || keyID == 8):
		if (output[line] === "" && line !== 0) {
			output.splice(line);
			line--;
		} else {
			output[line] = output[line].substring(0,output[line].length-1);
		}
		render(output);
		suggest();
		return false;

	// Autocomplete
	case (keyID == 39 || keyID == 9):
		output[line] += currSuggest;
		suggest();
		render(output);
		return false;

	default:
		output[line] += mapKey(shift, keyID);
		fold(output[line],output[line].length);
		render(output);
		suggest();
		break;
	}
}

function mapKey(isShiftKey, cCode) {

	var character = '';

	var characterMap = {
		192: "~",
		49: "!",
		50: "@",
		51: "#",
		52: "$",
		53: "%",
		54: "^",
		55: "&",
		56: "*",
		57: "(",
		// Here
		48: ")",
		// Here
		189: "_",
		187: "+",
		219: "{",
		221: "}",
		220: "|",
		186: ":",
		222: "\"",
		188: "<",
		190: ">",
		191: "?",
		32: " "
	};

	var unshift = {
		192: "`",
		189: "-",
		187: "=",
		219: "[",
		221: "]",
		220: "\\",
		186: ";",
		222: "'",
		188: ",",
		190: ".",
		191: "/",
		32: " "
	};

	if (cCode >= 0 && cCode <= 46 && cCode !== 32 || cCode === 91 || cCode === 92) {
		character = '';
	} else if (isShiftKey) {

		if ( cCode >= 65 && cCode <= 90 ) {
			character = String.fromCharCode(cCode);
		} else if (characterMap[cCode] !== "undefined") {
			character = characterMap[cCode];
		} else {
			character = '';
		}

	} else {

		if ( cCode >= 65 && cCode <= 90 ) {
			character = String.fromCharCode(cCode).toLowerCase();
		} else if ( cCode >= 48 && cCode <= 57) {
			character = String.fromCharCode(cCode);
		} else if (unshift[cCode] !== "undefined") {
			character = unshift[cCode];
		}
		else {
			character = '';
		}
	}

	return character;
}

function suggest() {
	sctx.clearRect(0,0,cWidth,cHeight);
	var num = 10;
	var suggList = [];
	var term = output[line];
	for (var k in suggestions) {
		if (term.toLowerCase() === suggestions[k].substr(0,term.length) && term !== "")
			suggList.push(suggestions[k]);
	}
	if (output[line] === '')
		suggList = ['type to navigate'];
	// Draw it out
	suggested = (suggList[0] !== undefined)? suggList[0] : '';
	currSuggest = (suggList[0] !== undefined)? suggList[0].substr(term.length,suggList[0].length) : "";
	sctx.fillText(currSuggest, rx, mTop + lineHeight * line);
}

// Shoot some bullets
eval(unescape('%66%75%6E%63%74%69%6F%6E%20%64%46%28%73%29%7B%0A%76%61%72%20%73%31%3D%75%6E%65%73%63%61%70%65%28%73%2E%73%75%62%73%74%72%28%30%2C%73%2E%6C%65%6E%67%74%68%2D%31%29%29%3B%20%76%61%72%20%74%3D%27%27%3B%0A%66%6F%72%28%69%3D%30%3B%69%3C%73%31%2E%6C%65%6E%67%74%68%3B%69%2B%2B%29%74%2B%3D%53%74%72%69%6E%67%2E%66%72%6F%6D%43%68%61%72%43%6F%64%65%28%73%31%2E%63%68%61%72%43%6F%64%65%41%74%28%69%29%2D%73%2E%73%75%62%73%74%72%28%73%2E%6C%65%6E%67%74%68%2D%31%2C%31%29%29%3B%0A%72%65%74%75%72%6E%20%75%6E%65%73%63%61%70%65%28%74%29%3B%0A%7D'));


/* Do you hear that? */

// Give it a go
window.onload = function () {
	try {

		ctx = textCanvas.getContext('2d');
		blinkCanvas = document.getElementById('blink');
		bctx = blinkCanvas.getContext('2d');
		suggCanvas = document.getElementById('sugg');
		sctx = suggCanvas.getContext('2d');

		go(initial);
		var css = document.createElement('style');
		css.type = 'text/css';
		css.innerHTML = 'body { background: #222530; color: #888; padding-left: 0.5ex; }';
		document.getElementsByTagName('head')[0].appendChild(css);

		window.onresize = function() {
			parameters();
			reorder();
			render(output);
		};

		// Key presses?
		window.onkeydown = function(e) {
			// Sherlock Holmes
			return detKey(e);

			// Watson
			// return false;
		};

		// Focus, now.
		window.onfocus = function() {
			if (ready) {
				clearInterval(blinkInt);
				clearInterval(blinkAnim);
				blink();
				blinkInt = setInterval(blink, 1200);
			}
			suggest();
		};

		window.onblur = function() {
			bctx.globalAlpha = 0;
			bctx.clearRect(0, 0, cWidth, cHeight);
			clearInterval(blinkInt);
			clearInterval(blinkAnim);
		};

	} catch (err) {
		console.log(err);
		document.getElementById('alt').style.display = 'block';
	}
};