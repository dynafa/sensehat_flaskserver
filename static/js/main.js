var timeout1, timeout2;
const time = 800;
var sb_top = document.getElementById('sb_top');
var menubtn = document.getElementById('menubtn');
var maindiv = document.getElementById('maindiv');


function loadingGraphic() {
    timeout1 = setTimeout(function () {
        $("#loader2").animate({}).hide('slow');
    }, 250);
    timeout2 = setTimeout(function() {
        $("#loader").animate({}).hide('fast');
    }, 330);
}

var framework = createElement();
var articles = createElement();

function showEle(e) {
    var var1 = $('#menu_hidden_1');
    var var2 = $('#menu_hidden_2');
    if (e) {
        if (!framework.bs) {
            var1.animate({}).show('fast');
            framework.bs = 1;
        } else {
            var1.animate({}).hide('slow');
            framework.bs = 0;
        }
    }
    else if (!e) {
        if (!articles.bs) {
            var2.animate({}).show('fast');
            articles.bs = 1;
        } else {
            var2.animate({}).hide('slow');
            articles.bs = 0;
        }
    }

}
function toggleOff() {
    if (!obj.bs) {
        var var1 = $('#menu_hidden_1');
        var var2 = $('#menu_hidden_2');
        var2.animate({}).hide('fast');
        articles.bs = 0;
        var1.animate({}).hide('fast');
        framework.bs = 0;
        setTimeout(function () {
            maindiv.style.display = 'block';
        }, 300);
    }
}

var obj = createElement();

function createElement(){
    var newObject = {};
    newObject.bs = 0;
    return newObject;
}

function main(){
    $(".navbar2").animate({
        width: "toggle",
    }, time, 'easeInOutExpo');
    if (windowSize() < 900) {
        maindiv.style.display = 'none';
    }
    obj.bs = 1 - obj.bs;
    toggleMenu();
}

menubtn.addEventListener('click', sidebartitle);
menubtn.addEventListener('click', toggleOff);


function sidebartitle() {
    if (obj.bs) {
        setTimeout(function () {
            $('#sb_top').animate({}).show('slow');
        }, 300);
    } else {
        setTimeout(function () {
            $('#sb_top').animate({}).hide('slow')
        }, 10);
    }
}

function clickMenubtn(){
    document.getElementById('menubtn').click();
}
// function toggleMenu() {
//     menubtn.classList.toggle('change');
// }
function windowSize() {
    return window.innerWidth ? window.innerWidth : $(window).width();
}
function changeContactimg() {
    var img = document.getElementById('contact_img');
    img.src = 'resources/qrcode.jpeg';
    document.getElementById('contact_img').style.borderRadius = '10%';
}
