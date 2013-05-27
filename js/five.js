/*jslint browser: true, vars: true*/
/*global $*/

// Global variabls
var textCanvas  = document.getElementById("body"),
    suggestions = ["work", "portfolio", "projects", "about", "info", "contact", "email"],
    suggested   = "",
    currSuggest = "",
    current     = "",
    i           = 0,
    mLeft       = 64,
    mTop        = 64,
    rx          = 0,
    ry          = mTop - 13,
    tab         = 0,
    line        = 0,
    lineHeight  = 18,
    ready       = false,
    five        = true,
    ctxFill     = "#000";

// Temporary canvas variables
var ctx, blinkCanvas, bctx, suggCanvas, sctx;

// Keyword variables
var initial, work, portfolio, projects, about, info, contact, email;

/**
 * The code to output and the callback associated with it
 * @param {Array}   input    The code to output, one line per array item
 * @param {Function} callback The callback function to call after code is written
 */
var Code = function (input, callback) {
    this.code = input;
    this.callback = callback;
};

initial = [""];

about = info = new Code(["<div id='about'>ABOUT</div>", "<style>", "\t#about {", "\t\tposition: fixed;", "\t\tbackground: skyblue;", "\t\twidth: 100px;", "\t\theight: 50px;", "\t\tfont: 1.5em/50px 'DejaVu Sans Mono', Monaco, Consolas, monspace;", "\t\ttop: 50%;", "\t\tleft: 50%;", "\t\tmargin: -25px 0 0 -50px;", "}", "</style>"]);

contact = email = new Code(["<div id='contact'>CONTACT</div>", "<style>", "\t#contact {", "\t\tposition: fixed; color: #FAFAFA;", "\t\tbackground: #222;", "\t\twidth: 100px;", "\t\theight: 50px;", "\t\tfont: 1.5em/50px 'DejaVu Sans Mono', Monaco, Consolas, monspace;", "\t\ttop: 50%;", "\t\tleft: 50%;", "\t\tmargin: -25px 0 0 -50px;", "}", "</style>"]);

var printInt, blinkAnim, blinkInt, cWidth, cHeight, ouput, charWidth, allWidth, winCharLength, numLines;

function parameters() {
    
    cWidth = textCanvas.width = blinkCanvas.width = suggCanvas.width = window.innerWidth;
    cHeight = textCanvas.height = blinkCanvas.height = suggCanvas.height = window.innerHeight;
    ctx.font = sctx.font = "10pt 'DejaVu Sans Mono', Monaco, Consolas, Ubuntu Mono, monospace";
    
    sctx.fillStyle = "#39D";
    ctx.fillStyle = ctxFill;
    bctx.fillStyle = "#666";
    
    var all = "";
    
    for (var l in output) {
        all += output[l];
    }
    
    charWidth = ctx.measureText(" ").width;
    allWidth = ctx.measureText(all).width;
    winCharLength = Math.floor((cWidth - 2 * mLeft) / charWidth);
    
    numLines = Math.floor(window.innerHeight / lineHeight);
}

function reorder() {
    
    var all = "";
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

/**
 * Converts tab character to four spaces for display
 * @param  {Array} array Array of code, one line per item
 * @return {Array}       The modified array
 */
function convertTab(array) {
    var newArray = [];
    for (var item in array) {
        newArray[item] = array[item].replace(/\t/g,"    ");
    }
    return newArray;
}

/**
 * Writes code into the console and handles callback
 * @param  {Array} input  The code to write, one line per array item
 * @param  {Boolean} loader Whether the function is called for init
 * @param  {Boolean} byLine Whether to write the code line by line
 * @param  {Function} callback The callback associated with the output
 * @return {Boolean}        Just in case somebody needs it
 */
function go(input,loader,byLine,callback) {
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
                (function (html) {
                    var imageloads = [];
                    $(html).find("img").each(function () {
                        var dfd = $.Deferred();
                        $(this).on('load', function () {
                            dfd.resolve();
                        });
                        if (this.complete) {
                            $(this).trigger('load');
                        }
                        imageloads.push(dfd);
                    });
                    $.when(undefined, imageloads).done(function () {
                        Hyphenator.run();
                        var styleCheck = window.setInterval(function () {
                            if ($("#output h1").css("font-family").indexOf("Museo") !== -1) {
                                $(html).removeClass("hidden").addClass("show");
                                if (callback && callback.constructor.toString().match("Function()")) {
                                    callback();
                                    console.log("Callback fired");
                                }
                                window.clearInterval(styleCheck);
                            }
                            console.log("In stylecheck");
                        }, 200);
                    });
                })("#output");
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
                    output[line] = "";
                }
                else
                    writeCode(output);
                if (input == initial) {
                    go(["I'm a web developer & designer."],true,false);
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
        }, 20);
    }
}

/**
 * Converts visible code to actual code in output element
 * @param  {Array} input The code as an array
 * @return {null}
 */
function writeCode(input) {
    var all = "";
    for (var l in input) {
        all += input[l];
    }
    document.getElementById("output").innerHTML += all;
    ctx.clearRect(0, 0, cWidth, cHeight);
    line = 0;
    output = [""];
}

/**
 * Breaks long text lines into multiple lines
 * @param  {String} type Current line
 * @param  {Number} i    Current character position
 * @return {null}
 */
function fold(type,i) {
    if (ctx.measureText(type).width > cWidth - 2 * mLeft) {
        var breakText = output[line].substr(i, output[line].length);
        line++;
        output[line] = breakText;
    }
}

/**
 * Renders code onto canvas
 * @param  {Array} type Content to write, one line per item
 * @return {null}
 */
function render(type) {
    parameters();
    ctx.clearRect(0, 0, cWidth, cHeight);
    bctx.clearRect(0, 0, cWidth, cHeight);
    for (var a in type) {
        ctx.fillText(type[a], mLeft, mTop + lineHeight * a);
    }
    rx = ctx.measureText(type[line]).width + mLeft;
    bctx.fillRect(rx, ry + lineHeight * line + 15, 8, 1);
}

/**
 * Blinks the cursor
 * @return {null}
 */
function blink() {
    var a = 0;
    blinkAnim = setInterval(function() {
        if (a > Math.PI) {
            clearInterval(blinkAnim);
            return false;
        } else {
            bctx.clearRect(0, 0, cWidth, cHeight);
            bctx.globalAlpha = Math.abs(Math.cos(a));
            bctx.fillRect(rx, ry + line * lineHeight + 15, 8, 1);
        }
        a += 0.2;
    }, 50);
}

/**
 * Handles keystrokes
 * @param  {Event} e Key event
 * @return {Boolean}   false if do nothing
 */
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
        if (output[line].substr(line === 0 && output[line].length - 7,output[line].length) == dF("Rfwnxxf5")) {
            document.querySelector("body").style.background = dF("dsjntpo1");
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

/**
 * Secondary keystroke management, by case
 * @param  {Number}  keyID   charCode of key pressed
 * @param  {Boolean} isShift Whether shift key was pressed
 * @param  {Boolean} isCtrl  Whether ctrl key was pressed
 * @return {Boolean}         false
 */
function retKey(keyID, isShift, isCtrl) {
    switch (true)
    {
        case (keyID >= 112 && keyID <= 123 || isCtrl):
            break;
            
        case (keyID == 13):
            var all = "";
            for (var l in output) {
                all += output[l];
            }
            if (suggested.indexOf(output[line].toLowerCase()) !== -1 && output[line] !== "") {
                line = 0;
                $("#output").html("").addClass("hidden");
                go(window[suggested].code, false, true, window[suggested].callback);
                return;
            } else if (all.search(/^[^<]*<([A-z][A-z0-9]*).*>.*<\/\1>[^<]*$/) !== -1) {
                output[line] += mapKey(isShift, keyID);
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

        case (keyID == 55 && isShift):
            document.querySelector("body").style.background = "#123";
            ctxFill = "#CCC";
            bctx.fillStyle = "red";
            render(output);
            break;

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
            output[line] += mapKey(isShift, keyID);
            fold(output[line],output[line].length);
            render(output);
            suggest();
            break;
    }
}

/**
 * Tertiary level for direct entry
 * @param  {Boolean} isShiftKey Whether shift key was pressed
 * @param  {Number}  cCode      charCode of key pressed
 * @return {String}             Character to write
 */
function mapKey(isShiftKey, cCode) {
    
    var character = "";
    
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
        48: ")",
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
    if (output[line] === "")
        suggList = ["type to navigate"];
    // Draw it out
    suggested = (suggList[0] !== undefined)? suggList[0] : "";
    currSuggest = (suggList[0] !== undefined)? suggList[0].substr(term.length,suggList[0].length) : "";
    sctx.fillText(currSuggest, rx, mTop + lineHeight * line);
}

// Shoot some bullets
eval(unescape("%66%75%6E%63%74%69%6F%6E%20%64%46%28%73%29%7B%0A%76%61%72%20%73%31%3D%75%6E%65%73%63%61%70%65%28%73%2E%73%75%62%73%74%72%28%30%2C%73%2E%6C%65%6E%67%74%68%2D%31%29%29%3B%20%76%61%72%20%74%3D%27%27%3B%0A%66%6F%72%28%69%3D%30%3B%69%3C%73%31%2E%6C%65%6E%67%74%68%3B%69%2B%2B%29%74%2B%3D%53%74%72%69%6E%67%2E%66%72%6F%6D%43%68%61%72%43%6F%64%65%28%73%31%2E%63%68%61%72%43%6F%64%65%41%74%28%69%29%2D%73%2E%73%75%62%73%74%72%28%73%2E%6C%65%6E%67%74%68%2D%31%2C%31%29%29%3B%0A%72%65%74%75%72%6E%20%75%6E%65%73%63%61%70%65%28%74%29%3B%0A%7D"));


/* Do you hear that? */

// Give it a go
$(document).ready(function () {
    try {

        if (window.mobilecheck()) {
            $("#alt").show();
            $("#output").hide();
            return;
        }
        
        ctx = textCanvas.getContext("2d");
        blinkCanvas = document.getElementById("blink");
        bctx = blinkCanvas.getContext("2d");
        suggCanvas = document.getElementById("sugg");
        sctx = suggCanvas.getContext("2d");
        
        go(initial);
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = "body { background: #fff; color: #888; padding-left: 0.5ex; }";
        document.getElementsByTagName("head")[0].appendChild(css);
        
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
        $("#alt").css("display", "block");
    }
});

// AJAX requests
$.get('work.html', function (data) {
    
    "use strict";
    
    var array = data.split("\n");
    work = portfolio = projects = new Code(array, runWork);
});

window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|android|playbook|tablet|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check; }