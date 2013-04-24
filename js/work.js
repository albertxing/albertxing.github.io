/*jslint browser: true*/

var h,
/**/w,
/**/cCanvas = document.getElementById("codeq");

var cAnim = ["","header { bottom: -30px; } #hold { top: 99%; }"];

$(window).on("load", function () {
    $.ajax({
        url:"work/codeq.html",
        success: function (result) {
            var cBack = cCanvas.getContext("2d"),
            cFore = cCanvas.getContext("2d");

            draw({background: cBack, foreground: cFore}, result, cAnim);

            $(window).resize(function () {
                draw(cCtx, result);
            });
        }
    });
});


function draw(contexts, code, animation, i) {

    console.log(i);

    w = cCanvas.width = $("canvas").width();
    h = cCanvas.height = $("canvas").height();

    bg = contexts.background;
    fg = contexts.foreground;

    var fgHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='" + w + "' height='" + h + "'><foreignObject width='100%' height='100%'>" + code + ((animation !== undefined) ? ("<style xmlns='http://www.w3.org/1999/xhtml'>" + animation[i] + "</style>") : "") + "</foreignObject></svg>";

    var DOMURL = self.URL || self.webkitURL || self,
        fgImage = new Image(),
        fgSVG = new Blob([fgHTML], {type: "image/svg+xml;charset=utf-8"}),
        fgURL = DOMURL.createObjectURL(fgSVG);

    var bgImage = new Image();

    bgImage.onload = function() {
        var _iw, _ih;
        if (w * 297 / 448 < h) {
            _iw = h / 297 * 448;
            _ih = h;
        } else {
            _iw = w;
            _ih = w * 297 / 448;
        }

        bg.drawImage(bgImage, 0, 0, _iw, _ih);

        $("html").addClass("show");
    };

    bgImage.src = "work/codeq-bg.jpg";

    fgImage.onload = function() {
        fg.drawImage(fgImage, 0, 0);
    };

    fgImage.src = fgURL;

    if (animation && i === undefined) {
        window["anim"] = setInterval(function () {
            draw(contexts, code, animation, 0);
        }, 2000);
    } else if (i < animation.length - 1) {
        draw(contexts, code, animation, i + 1);
    } else {
        window.clearInterval(anim);
    }

}