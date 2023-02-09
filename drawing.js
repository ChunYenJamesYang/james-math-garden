const BACKGROUND_COLOUR = '#000000';
const LINE_COLOR = '#FFFFFF';
// for checking
// const LINE_COLOR = '#BCFF00';
const LINE_WITDH = 15;

var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;

// var is_pressed = 0;
var isPainting = false;

// global
var canvas;
var context;


function prepareCanvas () {
    // console.log('Preparing Canvas');
    // const canvas = document.getElementById('my-canvas');
    // const context = canvas.getContext('2d');
    canvas = document.getElementById('my-canvas');
    context = canvas.getContext('2d');

    context.fillStyle = BACKGROUND_COLOUR;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    context.strokeStyle = LINE_COLOR;
    context.lineWidth = LINE_WITDH;
    context.lineJoin = 'round';

    // actions
    document.addEventListener('mousedown', function (event) {
        // console.log('X coordinate: ' + event.clientX);
        // console.log('Y coordinate: ' + event.clientY);
        // console.log('Mouse Pressed');
        // is_pressed = 1;
        isPainting = true;
        currentX = event.clientX - canvas.offsetLeft;
        currentY = event.clientY - canvas.offsetTop;
    })

    document.addEventListener('mouseup', function (event) {
        // console.log('Mouse Released');
        // is_pressed = 0;
        isPainting = false;
        
    })

    canvas.addEventListener('mouseleave', function (event) {
        isPainting = false;
        
    })



    document.addEventListener('mousemove', function (event) {
        if (isPainting) {
        
            previousX = currentX;
            currentX = event.clientX - canvas.offsetLeft;

            previousY = currentY;
            currentY = event.clientY - canvas.offsetTop;
        // currentY = event.clientY + canvas.offsetTop;

        // console.log(`Current X: ${currentX}`);

        // drawing
        // if (is_pressed == 1) {
        
            draw();
        }
    })

    // Touch Events
    canvas.addEventListener('touchstart', function (event) {
        // console.log('X coordinate: ' + event.clientX);
        // console.log('Y coordinate: ' + event.clientY);
        console.log('Touch Down!!');
        // is_pressed = 1;
        isPainting = true;
        currentX = event.touches[0].clientX;
        currentY = event.touches[0].clientY;
    })

    document.addEventListener('touchup', function (event) {
        console.log('Touch Up!!');
        // is_pressed = 0;
        isPainting = false;
        
    })

    canvas.addEventListener('touchleave', function (event) {
        isPainting = false;
        
    })



    canvas.addEventListener('touchmove', function (event) {
        if (isPainting) {
        
            previousX = currentX;
            currentX = event.touches[0].clientX - canvas.offsetLeft;

            previousY = currentY;
            currentY = event.touches[0].clientY - canvas.offsetTop;
        // currentY = event.clientY + canvas.offsetTop;

        // console.log(`Current X: ${currentX}`);

        // drawing
        // if (is_pressed == 1) {
        
            draw();
        }
    })
    
}

function draw() {
    context.beginPath();
    context.moveTo(previousX, previousY);
    context.lineTo(currentX, currentY);
    context.closePath();
    context.stroke();
}

function clearCanvas() {
    currentX = 0;
    currentY = 0;
    previousX = 0;
    previousY = 0;

    // make the canvas all black
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}