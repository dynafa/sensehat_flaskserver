var mainpanel = document.getElementById('mainpanel');
var sstatusdivx = document.getElementById('sstatusdivx');
var sstatusdivy = document.getElementById('sstatusdivy');
var tstatusdivx = document.getElementById('tstatusdivx');
var tstatusdivy = document.getElementById('tstatusdivy');
var fstatusdivx = document.getElementById('fstatusdivx');
var fstatusdivy = document.getElementById('fstatusdivy');
var statusdivl = document.getElementById('__statusdivx');
var statusdivr = document.getElementById('__statusdivy');
var statusdivt = document.getElementById('_statusdivx');
var statusdivb = document.getElementById('_statusdivy');

var vectorObj = {};
vectorObj.mode = " ";
window.addEventListener('load', function () {
    mainpanel.addEventListener('touchstart', function (e) {
        var touchobj = e.changedTouches[0];// reference first touch point (ie: first finger)
        vectorObj.startx = parseInt(touchobj.clientX); // get x position of touch point relative to left edge of browser
        vectorObj.starty = parseInt(touchobj.clientY); // get x position of touch point relative to left edge of browser
        sstatusdivx.innerHTML = 'Xpos: ' + vectorObj.startx + 'px';
        sstatusdivy.innerHTML = 'Ypos: ' + vectorObj.starty + 'px';
        e.preventDefault();
    }, false);
    mainpanel.addEventListener('touchmove', function (e) {
        var touchobj = e.changedTouches[0]; // reference first touch point for this event
        vectorObj.distx = parseInt(touchobj.clientX) - vectorObj.startx;
        vectorObj.disty = parseInt(touchobj.clientY) - vectorObj.starty;
        tstatusdivx.innerHTML = 'H dist traveled: ' + vectorObj.distx + 'px';
        tstatusdivy.innerHTML = 'V dist ttraveled: ' + vectorObj.disty + 'px';
        e.preventDefault();
    }, false);
    mainpanel.addEventListener('touchend', function (e) {
        var touchobj = e.changedTouches[0]; // reference first touch point for this event
        vectorObj.endx = touchobj.clientX;
        vectorObj.endy = touchobj.clientY;
        fstatusdivx.innerHTML = 'Final Xpos: ' + vectorObj.endx + 'px';
        fstatusdivy.innerHTML = 'Final Ypos' + vectorObj.endy + 'px';
        updatePixels(vectorObj.mode);
        e.preventDefault();
    }, false);
}, false);

function showVector() {
    alert(vectorObj.startx + "\n" + vectorObj.starty  + "\n" +  vectorObj.endx
    + "\n" + vectorObj.endy);

}
function toggleDrawmode() {
    if (vectorObj.mode) {
        vectorObj.mode = null;
        document.getElementById('modebtn').style.color = '#3CAFFF'
    }
    else {
        vectorObj.mode = " ";
        document.getElementById('modebtn').style.color = '#fff'
    }
}
function updatePixels(mode) {
    var elements = document.getElementsByClassName('pixelpanel');
    for (var i = 0; i < elements.length; i++) {
        var position = getelePos(elements[i]);
        if (mode != null) {
            if (position[0] < vectorObj.startx && vectorObj.startx < position[1]) {
                if (position[2] < vectorObj.starty && vectorObj.starty < position[3]) {
                    elements[i].click();
                }
            }
        }
        else {
            if (position[0] < vectorObj.starty && vectorObj.startx < position[1]) {
                if (position[2] < vectorObj.endy && vectorObj.endx < position[3]) {
                    elements[i].click();
                }
            }
        }
    }
}
var sliderr = document.getElementById("REDrange");
var sliderg = document.getElementById("GREENrange");
var sliderb = document.getElementById("BLUErange");
var outputr = document.getElementById("REDvalue");
var outputg = document.getElementById("BLUEvalue");
var outputb = document.getElementById("GREENvalue");
var coloroutput = document.getElementById("combined_color");
outputr.innerHTML = sliderr.value;
outputg.innerHTML = sliderg.value;
outputb.innerHTML = sliderb.value;

sliderr.oninput = function() {
    outputr.innerHTML = "RED: " + this.value;
    coloroutput.style.backgroundColor = 'rgb('+sliderr.value+","+sliderg.value+","+sliderb.value+')'
};
sliderg.oninput = function() {
    outputg.innerHTML = "GREEN: " + this.value;
    coloroutput.style.backgroundColor = 'rgb('+sliderr.value+","+sliderg.value+","+sliderb.value+')'
};
sliderb.oninput = function() {
    outputb.innerHTML = "BLUE: " + this.value;
    coloroutput.style.backgroundColor = 'rgb('+sliderr.value+","+sliderg.value+","+sliderb.value+')'
};

insertIcon('pixelpanel');
function getelePos(ele) {
    var element = $(ele);
    var l = element[0].getBoundingClientRect().left   + $(window)['scrollLeft']();
    var r = element[0].getBoundingClientRect().right  + $(window)['scrollLeft']();
    var t = element[0].getBoundingClientRect().top    + $(window)['scrollTop']();
    var b = element[0].getBoundingClientRect().bottom + $(window)['scrollTop']();
    return [l, r, t, b]
}

// function test111(ele) {
//     var pos = getelePos(ele);
//     for (var i = 0; i < 4; i++) {
//         console.log(pos[i]);
//     }
// }

function hideDebug() {
    $('#debugbox').toggle();
}

function Pixel(name){
    this.name = name;
    this.state = 0;
    this.r = 0;
    this.g = 0;
    this.b = 0;
}

Pixel.prototype = {
    constructor: Pixel,
    getName: function() {
        return this.name;
    },
    getState: function () {
        return this.state;
    }
};

function PixelAgg() {
    this.pixel0 = new Pixel('pixel0');
    this.pixel1 = new Pixel('pixel1');
    this.pixel2 = new Pixel('pixel2');
    this.pixel3 = new Pixel('pixel3');
    this.pixel4 = new Pixel('pixel4');
    this.pixel5 = new Pixel('pixel5');
    this.pixel6 = new Pixel('pixel6');
    this.pixel7 = new Pixel('pixel7');
    this.pixel8 = new Pixel('pixel8');
    this.pixel9 = new Pixel('pixel9');
    this.pixel10 = new Pixel('pixel10');
    this.pixel11 = new Pixel('pixel11');
    this.pixel12 = new Pixel('pixel12');
    this.pixel13 = new Pixel('pixel13');
    this.pixel14 = new Pixel('pixel14');
    this.pixel15 = new Pixel('pixel15');
    this.pixel16 = new Pixel('pixel16');
    this.pixel17 = new Pixel('pixel17');
    this.pixel18 = new Pixel('pixel18');
    this.pixel19 = new Pixel('pixel19');
    this.pixel20 = new Pixel('pixel20');
    this.pixel21 = new Pixel('pixel21');
    this.pixel22 = new Pixel('pixel22');
    this.pixel23 = new Pixel('pixel23');
    this.pixel24 = new Pixel('pixel24');
    this.pixel25 = new Pixel('pixel25');
    this.pixel26 = new Pixel('pixel26');
    this.pixel27 = new Pixel('pixel27');
    this.pixel28 = new Pixel('pixel28');
    this.pixel29 = new Pixel('pixel29');
    this.pixel30 = new Pixel('pixel30');
    this.pixel31 = new Pixel('pixel31');
    this.pixel32 = new Pixel('pixel32');
    this.pixel33 = new Pixel('pixel33');
    this.pixel34 = new Pixel('pixel34');
    this.pixel35 = new Pixel('pixel35');
    this.pixel36 = new Pixel('pixel36');
    this.pixel37 = new Pixel('pixel37');
    this.pixel38 = new Pixel('pixel38');
    this.pixel39 = new Pixel('pixel39');
    this.pixel40 = new Pixel('pixel40');
    this.pixel41 = new Pixel('pixel41');
    this.pixel42 = new Pixel('pixel42');
    this.pixel43 = new Pixel('pixel43');
    this.pixel44 = new Pixel('pixel44');
    this.pixel45 = new Pixel('pixel45');
    this.pixel46 = new Pixel('pixel46');
    this.pixel47 = new Pixel('pixel47');
    this.pixel48 = new Pixel('pixel48');
    this.pixel49 = new Pixel('pixel49');
    this.pixel50 = new Pixel('pixel50');
    this.pixel51 = new Pixel('pixel51');
    this.pixel52 = new Pixel('pixel52');
    this.pixel53 = new Pixel('pixel53');
    this.pixel54 = new Pixel('pixel54');
    this.pixel55 = new Pixel('pixel55');
    this.pixel56 = new Pixel('pixel56');
    this.pixel57 = new Pixel('pixel57');
    this.pixel58 = new Pixel('pixel58');
    this.pixel59 = new Pixel('pixel59');
    this.pixel60 = new Pixel('pixel60');
    this.pixel61 = new Pixel('pixel61');
    this.pixel62 = new Pixel('pixel62');
    this.pixel63 = new Pixel('pixel63');
}
var pixelMatrix = new PixelAgg();
var pixel;
function normalizePixelAgg() {
    for (pixel in pixelMatrix) {
        if (pixelMatrix[pixel].getState()) {
            document.getElementById(pixelMatrix[pixel].getName().toString()).click();
        }
    }
}

function pushChange(x, y, obj) {
    var state = obj.state;
    if (state !== 1) {
        var r = Number(sliderr.value);
        var g = Number(sliderg.value);
        var b = Number(sliderb.value);
        setp(x, y, r, g, b);
        obj.state = 1;
        obj.r = r;
        obj.g = g;
        obj.b = b;
    }
    else {
        setp(x, y, 0, 0, 0);
        obj.state = 0;
        obj.r = 0;
        obj.g = 0;
        obj.b = 0;
    }
    console.log(obj);
    togglecolor(obj);
}
function setp(x, y, r, g, b) {
    $.ajax({
        url: '/api/41293487123049/setpixel',
        method: 'POST',
        dataType: 'json',
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify({
            r: r,
            g: g,
            b: b,
            x: x,
            y: y
        }),
    });
}

// function clearsignal() {
//     $.ajax({
//         url: '/clear',
//         method: "GET",
//     });
// }

function invertpanel(x){
    var elements = document.getElementsByClassName(x);
    for (var i = 0; i < elements.length; i++) {
        elements[i].click();
    }
}

function insertIcon(x) {
    var elements = document.getElementsByClassName(x);
    for (var i = 0; i < elements.length; i++) {
        elements[i].innerHTML = "<i class='fa fa-arrow-circle-down fa-1x'></i>"
    }
}


function togglecolor(obj) {
    var elem = document.getElementById(obj.name.toString());
    if(typeof elem !== 'undefined' && elem !== null) {
        if (obj.state) {
            elem.innerHTML = "<i class='fa fa-arrow-circle-up fa-1x'></i>";
            elem.style.color = 'rgb('+sliderr.value+","+sliderg.value+","+sliderb.value+')';
        }
        else {
            elem.innerHTML = "<i class='fa fa-arrow-circle-down fa-1x'></i>";
            elem.style.color = '#fff';
        }
    }
}
