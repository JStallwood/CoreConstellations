const CONTAINER = document.getElementById('scn');
const W = CONTAINER.offsetWidth * 0.8;
const H = CONTAINER.offsetHeight * 0.8;

const R = ((W + H) / 2) * 0.25;
const ORIGIN_X = 0;
const ORIGIN_Y = 0;
const ORIGIN_Z = 0;
const MAX_VAL = 4;

const POINT_SIZE = 20;
const AXES_POINT = 10;
const AXES_LINE = 2;

const HINT_TIME = 3;
let hintCounter = 0;
let hintOn = false;
let solutionOn = false;

const NAMES = ['Alpha', 'Beta', 'Gamma', 'Delta'];
const CORRECT = [
    [0, 1, 1],
    [1, 0, 1],
    [1, 1, 0],
    [2, 0, 0]
];

let active = {
    'Alpha' : [Math.floor(Math.random() * MAX_VAL), Math.floor(Math.random() * MAX_VAL), Math.floor(Math.random() * MAX_VAL)],
    'Beta' : [Math.floor(Math.random() * MAX_VAL), Math.floor(Math.random() * MAX_VAL), Math.floor(Math.random() * MAX_VAL)],
    'Gamma' : [Math.floor(Math.random() * MAX_VAL), Math.floor(Math.random() * MAX_VAL), Math.floor(Math.random() * MAX_VAL)],
    'Delta' : [Math.floor(Math.random() * MAX_VAL), Math.floor(Math.random() * MAX_VAL), Math.floor(Math.random() * MAX_VAL)],
};

function checkAnswers() {
    let answers = [];
    NAMES.forEach(n => {
        answers.push(active[n]);
    });

    let submitted = [];
    for(let i = 0; i < answers.length; i++) {
        for(let j = 0; j < CORRECT.length; j++) {
            let res = checkAnswer(answers[i], CORRECT[j]);
            let cont = checkSubmission(answers[i], submitted)
            if(res && !cont) {
                submitted.push(answers[i]);
            }
        }
    }

    let correctResults = document.getElementById('result');
    correctResults.innerHTML = "Correct: " + submitted.length.toString();
}

function checkAnswer(answer, correct) {
    return answer[0] === correct[0] && answer[1] === correct[1] && answer[2] === correct[2];
}

function checkSubmission(answer, submitted) {
    let contains = false;
    for(let i = 0; i < submitted.length; i++) {
        if(answer.every((val, index) => val === submitted[i][index])) { contains = true; }
    }
    return contains;
}

function increaseValue(name, index, el_id) {
    let current = active[name][index];
    let next = current + 1;
    if(next > MAX_VAL) { next = MAX_VAL; }
    active[name][index] = next;
    document.getElementById(el_id).innerHTML = next;
    checkAnswers();
}

function decreaseValue(name, index, el_id) {
    let current = active[name][index];
    let next = current - 1;
    if(next < 0) { next = 0; }
    active[name][index] = next;
    document.getElementById(el_id).innerHTML = next;
    checkAnswers();
}

function displayInitialValues() {
    NAMES.forEach(n => {
        let suffixes = ['_x', '_y', '_z'];
        for(let i = 0; i < suffixes.length; i++) {
            let el = document.getElementById(n + suffixes[i]);
            el.innerHTML = active[n][i];
        }
    })
}

function turnOnHints() {
    hintOn = true;
}

function revealToggle() {
    let solutionText = document.getElementById('sol_text');
    solutionOn = !solutionOn;
    if(solutionOn) {
        solutionText.style.display = 'flex';
    }
    else {
        solutionText.style.display = 'none';
    }
}

document.increaseValue = increaseValue;
document.decreaseValue = decreaseValue;
document.turnOnHints = turnOnHints;
document.revealToggle = revealToggle;

displayInitialValues();
checkAnswers();

let roboto;

const SCN = function(p) {

    const PEACH = p.color("#FFCBA4"); 
    const PINK = p.color("#F7A19E"); 
    const BLUE = p.color("#504fa5"); 
    const AZZURE = p.color("#6f9de3");  
    const AQUA = p.color("#92dbed"); 

    const Y_MAX = p.createVector(ORIGIN_X, ORIGIN_Y - R, ORIGIN_Z);
    const X_MAX = p.createVector(ORIGIN_X + R, ORIGIN_Y, ORIGIN_Z);
    const Z_MAX = p.createVector(ORIGIN_X, ORIGIN_Y, ORIGIN_Z + R);

    p.setup = function() {
        p.createCanvas(W, H, p.WEBGL);
        p.angleMode(p.DEGREES);
        
    };

    p.draw = function() {
        p.background(PINK);

        p.push();

        p.rotateX(-25);
        p.rotateY(-45);

        drawAxes();
        drawXLines();
        drawYLines();
        drawZLines();

        if(hintOn) {
            displayCorrect();
            hintCounter += 1;
            if(hintCounter >= HINT_TIME * 60) {
                hintCounter = 0;
                hintOn = false;
            }
        }
        

        displayActive();

        p.pop();

    };

    let convertToSpace = function(x, y, z) {
        let spaceX = ORIGIN_X + ((X_MAX.x - ORIGIN_X) * (x/MAX_VAL));
        let spaceY = ORIGIN_Y + ((Y_MAX.y - ORIGIN_Y) * (y/MAX_VAL));
        let spaceZ = ORIGIN_Z + ((Z_MAX.z - ORIGIN_Z) * (z/MAX_VAL));
        return p.createVector(spaceX, spaceY, spaceZ);
    };

    let drawAxes = function() {
        p.stroke(0);
        p.strokeWeight(AXES_POINT);
        p.point(ORIGIN_X, ORIGIN_Y, ORIGIN_Z);
        p.stroke(BLUE);
        p.point(Y_MAX.x, Y_MAX.y, Y_MAX.z);
        p.point(X_MAX.x, X_MAX.y, X_MAX.z);
        p.point(Z_MAX.x, Z_MAX.y, Z_MAX.z);
        p.strokeWeight(AXES_LINE);
        p.line(ORIGIN_X, ORIGIN_Y, ORIGIN_Z, X_MAX.x, X_MAX.y, X_MAX.z);
        p.line(ORIGIN_X, ORIGIN_Y, ORIGIN_Z, Y_MAX.x, Y_MAX.y, Y_MAX.z);
        p.line(ORIGIN_X, ORIGIN_Y, ORIGIN_Z, Z_MAX.x, Z_MAX.y, Z_MAX.z);
    };

    let drawXLines = function() {
        p.stroke(BLUE);
        p.strokeWeight(2);
        for(let i = 0; i <= MAX_VAL; i++) {
            let u = convertToSpace(i, 0, 0);
            let v = convertToSpace(i, MAX_VAL, 0);
            let w = convertToSpace(i, 0, MAX_VAL);
            p.line(u.x, u.y, u.z, v.x, v.y, v.z);
            p.line(u.x, u.y, u.z, w.x, w.y, w.z);
        }
    };

    let drawYLines = function() {
        p.stroke(BLUE);
        p.strokeWeight(2);
        for(let i = 0; i <= MAX_VAL; i++) {
            let u = convertToSpace(0, i, 0);
            let v = convertToSpace(MAX_VAL, i, 0);
            let w = convertToSpace(0, i, MAX_VAL);
            p.line(u.x, u.y, u.z, v.x, v.y, v.z);
            p.line(u.x, u.y, u.z, w.x, w.y, w.z);
        }
    };

    let drawZLines = function() {
        p.stroke(BLUE);
        p.strokeWeight(2);
        for(let i = 0; i <= MAX_VAL; i++) {
            let u = convertToSpace(0, 0, i);
            let v = convertToSpace(MAX_VAL, 0, i);
            let w = convertToSpace(0, MAX_VAL, i);
            p.line(u.x, u.y, u.z, v.x, v.y, v.z);
            p.line(u.x, u.y, u.z, w.x, w.y, w.z);
        }
    };

    let displayCorrect = function() {
        //p.stroke(255);
        //p.strokeWeight(POINT_SIZE);
        CORRECT.forEach(c => {
            let v = convertToSpace(c[0], c[1], c[2]);
            //p.point(v.x, v.y, v.z);
            p.push();
            p.translate(v.x, v.y, v.z);
            p.fill(255);
            p.noStroke();
            p.sphere(POINT_SIZE/2);
            p.pop();
        });
    };

    let displayActive = function() {
        //p.stroke(PEACH);
        //p.strokeWeight(POINT_SIZE);
        NAMES.forEach(n => {
            let v = convertToSpace(active[n][0], active[n][1], active[n][2]);
            //p.point(v.x, v.y, v.z);
            p.push();
            p.translate(v.x, v.y, v.z);
            p.fill(PEACH);
            p.noStroke();
            p.sphere(POINT_SIZE/2);
            p.pop();

        });
    };
};

const SK = new p5(SCN, 'scn');
