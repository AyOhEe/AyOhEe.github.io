let REDRAW_INTERVAL = 20; //draw at 50fps

function sampleFlow(screen_height, x, y){
    let g_y = ((screen_height/2) - y) / (screen_height/2);
    let g_x = 1 - Math.abs(g_y);

    return {
        x : g_x,
        y : g_y
    };
};


function makeFlowfield(canvas) {
    //handle drawing the contents every so often
    window.setInterval(drawFlowfield, REDRAW_INTERVAL);
    function createLineGradient(ctx, start, end, length){
        const gradient = ctx.createLinearGradient(0, 0, length, 0);

        //add the colours "start" and "end" at the start and end
        gradient.addColorStop(0, start);
        gradient.addColorStop(1, end);

        return gradient;
    };

    function drawAtAngle(ctx, x, y, theta, length){
        //create save to restore to after transformations
        ctx.save();

        //move origin to (x,y) and rotate by theta radians
        ctx.translate(x, y);
        ctx.rotate(theta);
        
        //draw the line of length px
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(length, 0);
        ctx.stroke();

        //undo the transformations
        ctx.restore();
    };
    function showFlowPaths(ctx){
        var length = 20;

        ctx.strokeStyle = createLineGradient(ctx, "red", "yellow", length);
        var start_x = 10;
        var start_y = 10;
        var inc_x =  20;
        var inc_y = 20;

        for(var i = 0; i < Math.floor(canvas.width / inc_x) - 1; i++){
            for(var j = 0; j < Math.floor(canvas.height / inc_y); j++){
                let x = start_x + i*inc_x;
                let y = start_y + j*inc_y;
                let grad = sampleFlow(canvas.height, x, y);
                drawAtAngle(ctx, x, y, Math.atan2(grad.y, grad.x), length);
            };
        };
    };

    function drawFlowfield(){
        //get the context and clear the drawing
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        showFlowPaths(ctx);
    };

    //resize the canvas on window resize dynamically
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    };

    //resize the canvas initially to ensure proper scaling, then redraw the contents properly
    resizeCanvas();
    drawFlowfield();
};

var canvases = document.getElementsByClassName('flowfield');
for(var i = 0; i < canvases.length; i++) {
    makeFlowfield(canvases[i]);
};