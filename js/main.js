////some general variables
var my_vars = {
    generated_queue: undefined,
    buttonCounter : undefined,
    newColorDelay : undefined,
    maxLevel : undefined,
    cmdLineArgs : getCommandLineArguments()
};
function getCommandLineArguments() {
    let result = {}
    if (window.location.search) {
        let paramStr = window.location.search.substring(1);
        let paramsArray = paramStr.split('&');
        for (let x of paramsArray) {
            let paramPair = x.split('=');
            if (paramPair.length>1) {
                result[paramPair[0]]=paramPair[1]
            }
        }
    }
    return result;
}
function readShowTime() {
    let showTimeLimit = 1000;
    let paramName = 'show';
    for (let key of Object.keys(my_vars.cmdLineArgs)) {
        if (paramName == key) {
            let tryParseValue = Number(my_vars.cmdLineArgs[key])
            showTimeLimit = (tryParseValue && tryParseValue>200) ? tryParseValue : showTimeLimit;
            break;
        }
    }
    return showTimeLimit;
}
function readMaxLevel() {
    let maxLevel = -1;
    let paramName = 'maxlev';
    for (let key of Object.keys(my_vars.cmdLineArgs)) {
        if (paramName == key) {
            let tryParseValue = Number(my_vars.cmdLineArgs[key])
            maxLevel = (tryParseValue && tryParseValue>1) ? tryParseValue : maxLevel;
            break;
        }
    }
    return maxLevel;
}
function initVars() {
    my_vars.generated_queue = [];
    my_vars.buttonCounter = 0;
    my_vars.newColorDelay = 500;
    my_vars.showTimeLimit = readShowTime();
    my_vars.maxLevel = readMaxLevel();
}
initVars();

////working with buttons
var btn0 = document.getElementById('button0');
var btn1 = document.getElementById('button1');
var btn2 = document.getElementById('button2');
var btn3 = document.getElementById('button3');
getButtonObject = function(buttonObject, propertyName, color1, color2) {
    return {
        "button" : buttonObject,
        "propertyName" : propertyName,
        "colorInactive" : color1,
        "colorActive" : color2
    };
}
var rootCss = getComputedStyle(document.querySelector(':root'));
var buttons = [
    getButtonObject(btn0, '--red', rootCss.getPropertyValue('--red-inactive'), rootCss.getPropertyValue('--red-active')),
    getButtonObject(btn1, '--green', rootCss.getPropertyValue('--green-inactive'), rootCss.getPropertyValue('--green-active')),
    getButtonObject(btn2, '--yellow', rootCss.getPropertyValue('--yellow-inactive'), rootCss.getPropertyValue('--yellow-active')),
    getButtonObject(btn3, '--blue', rootCss.getPropertyValue('--blue-inactive'), rootCss.getPropertyValue('--blue-active'))
];
var start_button = document.getElementById('start_button');

////some button logic 
function animateAsActive(btnNumber) {
    let btn = buttons[btnNumber]['button'];
    btn.style.setProperty(buttons[btnNumber]['propertyName'], buttons[btnNumber]['colorActive'])
}
function animateAsUnactive(btnNumber) {
    let btn = buttons[btnNumber]['button'];
    btn.style.setProperty(buttons[btnNumber]['propertyName'], buttons[btnNumber]['colorInactive']);
}
buttonPushFunction = function(x) {
    return function() {
        animateAsActive(x);
    }
}
buttonLiftFunction = function(x) {
    return function() {
        /* animate push-stop. Then do button logic */
        animateAsUnactive(x);
        if (my_vars.buttonCounter < my_vars.generated_queue.length) {
            if (my_vars.generated_queue[my_vars.buttonCounter] != x) {
                my_vars.buttonCounter = 0;            
                for (let i = 0 ; i<buttons.length; i++) {
                    (buttons[i]['button']).disabled = true;
                }
                alert('No. Try again');
                return;
            }
            my_vars.buttonCounter++;
        }
        if (my_vars.buttonCounter >= my_vars.generated_queue.length) {
            if (my_vars.maxLevel > 1 && my_vars.buttonCounter >= my_vars.maxLevel) {
                initVars();
            }
            startRound();
        }
    }
}
for (let i = 0; i<buttons.length; i++) {
    buttons[i]['button'].onmousedown = buttonPushFunction(i);
    buttons[i]['button'].onmouseup = buttonLiftFunction(i);
}

////"Active" logic
var startRound = function() {
    for (let i = 0 ; i<buttons.length; i++) {
        (buttons[i]['button']).disabled = true;
    }
    start_button.disabled = true;
    if (my_vars.generated_queue.length == 0 || my_vars.buttonCounter > 0) {
        my_vars.generated_queue.push(Math.round(Math.random() * (buttons.length-1)));
    }
    my_vars.buttonCounter = 0;

    setTimeout(startFlashFunc, 1000);
};
start_button.onclick = startRound

function startFlashFunc() {
    animateAsActive(my_vars.generated_queue[my_vars.buttonCounter]);
    setTimeout(stopFlashFunc, my_vars.showTimeLimit);
}

function stopFlashFunc(){
    animateAsUnactive(my_vars.generated_queue[my_vars.buttonCounter]);
    my_vars.buttonCounter++;
    if (my_vars.buttonCounter < my_vars.generated_queue.length) {
        setTimeout(startFlashFunc, my_vars.newColorDelay);
    }
    else {
        setTimeout(afterButtonFlashFunc, my_vars.newColorDelay);
    }
}

function afterButtonFlashFunc() {
    //
    my_vars.buttonCounter = 0;
    for (let i = 0 ; i<buttons.length; i++) {
        (buttons[i]['button']).disabled = false;
    }
    start_button.disabled = false;
}
