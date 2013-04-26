function runWork() {

var offsets = {
    "codeq": {
        "scroll": 0,
        "delay": 1000,
        callback: function () {
            masonry();
            $("#codeq").animate({
                scrollTop: 800
            }, {
                duration: 5000,
                done: function () {
                    $("#codeq .body").removeClass("current");
                    $("#codeq #about").addClass("current");

                    var people = $(".person");

                    (function shuffle(array) {
                        var p, n, tmp;
                        for (p = array.length; p;) {
                            n = Math.random() * p-- | 0;
                            tmp = array[n];
                            array[n] = array[p];
                            array[p] = tmp;
                        }
                    })(people);

                    people.each(function (i, el) {
                        setTimeout(function () {
                            $(el).addClass("loaded").css("opacity", "1").promise().done(function () {
                                setTimeout(function () {
                                    $(el).removeClass("loaded").addClass("ready");
                                }, 1000);
                            });
                        }, i * 200);
                    });

                    setTimeout(function () {
                        $("#about .person:first-child").addClass("hover").promise().done(function () {
                            setTimeout(function () {
                                $("#about .person:first-child").removeClass("hover");
                            }, 1000);
                        });
                    }, 1500);
                }
            });
},
"done": false
},
"site": {
    "scroll": 50,
    callback: function () {
    },
    "done": false
}
};

/** Listeners **/

var loc = window.location.href;

if (loc.substr(loc.length - 9, loc.length) === "index.html" || loc.substr(loc.length - 1, loc.length) === "/"  || loc.substr(loc.length - 2, loc.length) === ".tk" || loc.substr(loc.length - 2, loc.length) === ".com") {
    load = "#output #body";
    win = "#output";
    scrollListener();
} else {
    win = window;
}

$(window).on("load", function () {
    $("html").addClass("show");
    $(win).scroll();
});

$(win).on("scroll", scrollListener);

function scrollListener() {
    var _scroll = $(win).scrollTop();
    for (var key in offsets) {
        var _obj = offsets[key];
        if (_obj.scroll <= _scroll) {
            $("#" + key).addClass("show");
            if (!_obj.done) {
                _obj.done = true;
                window.setTimeout(_obj.callback, _obj.delay || 600);
            }
        }
    }
}

/** Codeq **/

function masonry() {
    $("#codeq #work .cell.r1").height($("#work").width()/3 - 16);
    $("#codeq #work .cell.r2").height($("#work").width()/3*2 - 16);
}

window["masonry"] = masonry;

$("#codeq").scroll(function () {
    var scrollTop = $("#codeq").scrollTop();
    if (scrollTop > 24 && scrollTop < $("#codeq")[0].scrollHeight - $("#codeq").height() - 50) {
        $('#codeq header').addClass('hidden');
    } else {
        $('#codeq header').removeClass('hidden');
    }

    $("#codeq header").css("bottom", -$("#codeq").scrollTop() / 0.7);
});

$("#codeq").ready(masonry);
$("#codeq").resize(masonry);

}