const REDRAW_INTERVAL = 20; //draw at 50fps

function sampleFlow(x, y){
    let g_y = 0;
    let g_x = 0;

    return {
        x : g_x,
        y : g_y
    }
}

class Particle {
    constructor(x, y, x_vel, y_vel, size=1){
        this.x = x;
        this.y = y;
        this.x_vel = x_vel;
        this.y_vel = y_vel;
    
        this.size = size;
    }

    draw = (ctx, canvas) => {
        //draw the line of length px
        ctx.beginPath();
        ctx.arc((this.x % canvas.offsetWidth), (this.y % canvas.offsetHeight), this.size, 0, 2 * Math.PI);
        ctx.stroke();
    }
    update = () => {
        this.x += this.x_vel * (1 / REDRAW_INTERVAL);
        this.y += this.y_vel * (1 / REDRAW_INTERVAL);

        let flow = sampleFlow(this.x, this.y);
        this.x_vel += flow.x * (1 / REDRAW_INTERVAL);
        this.y_vel += flow.y * (1 / REDRAW_INTERVAL);
    }
}


function makeFlowfield(canvas) {
    //handle drawing the contents every so often
    window.setInterval(drawParticles, REDRAW_INTERVAL);
    function createLineGradient(ctx, start, end, length){
        const gradient = ctx.createLinearGradient(0, 0, length, 0);

        //add the colours "start" and "end" at the start and end
        gradient.addColorStop(0, start);
        gradient.addColorStop(1, end);

        return gradient;
    }
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
    }
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
    }
  
    let particles = []

    for(let i = 0; i < 500; i++){
        particles.push(
            new Particle(
                (Math.random() * canvas.offsetWidth),
                (Math.random() * canvas.offsetHeight),
                (Math.random() * 20) + 30,
                (Math.random() * 20) - 10,
                0.8    
            )
        );
    }

    function updateParticles(){
        for(let i = 0; i < particles.length; i++){
            particles[i].update();
        }
    }

    function drawParticles(){
        //get the context and clear the drawing
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#ff6666"
        
        //showFlowPaths(ctx);

        updateParticles();
        for(let i = 0; i < particles.length; i++){
            particles[i].draw(ctx, canvas);
        }
    }

    //resize the canvas on window resize dynamically
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }

    //resize the canvas initially to ensure proper scaling, then redraw the contents properly
    resizeCanvas();
    drawParticles();
}

var canvases = document.getElementsByClassName('flowfield');
for(var i = 0; i < canvases.length; i++) {
    makeFlowfield(canvases[i]);
}