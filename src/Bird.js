import config from "./config.js";

class Bird {
    constructor() {
        this.y = 200;
        this.x = 35;

        this.height = config.bird.height;
        this.width = config.bird.width;
        this.fallingSpeed = config.bird.fallingSpeed;
        this.jumpSpeed = config.bird.jumpSpeed;
        this.jumpLength = config.bird.jumpLength;
        this.color = config.bird.color;

        this.jump = new Array(this.jumpLength).fill(-this.jumpSpeed);
        this.jump.push(0);



        this.drawing = new Image();
        this.drawing.src = "92c6p4k4ky311.png"; // can also be a remote URL e.g. http://


    }

    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.height / 2, 0, 2 * Math.PI);
        ctx.fill();

        // ctx.drawImage(this.drawing, this.x, this.y, this.height, this.width);

        return this;
    }
}


export default Bird;