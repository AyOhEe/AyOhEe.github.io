let REDRAW_INTERVAL = 20; //draw at 50fps

function makeAnim(canvas) {
    //handle drawing the contents every so often
    window.setInterval(drawAnim, REDRAW_INTERVAL);
    
    function drawAnim(){
        //get the context and clear the drawing
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    //resize the canvas on window resize dynamically
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    };

    //resize the canvas initially to ensure proper scaling, then redraw the contents properly
    resizeCanvas();
    drawAnim();
};

var canvases = document.getElementsByClassName('path_animation');
for(var i = 0; i < canvases.length; i++) {
    makeAnim(canvases[i]);
};