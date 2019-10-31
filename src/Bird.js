import config from "./config.js";

class Bird {
    constructor() {
        this.y = 200;
        this.x = 35;

        this.height = config.bird.height;
        this.width = config.bird.width;

        this.jump = new Array(config.bird.jumpLength).fill(-config.bird.jumpSpeed);
        for (let i = 0; i < 10; ++i)
            this.jump.push(-config.bird.fallingSpeed);
        this.jump.push(0);

        this.drawing = new Image();
        this.drawing.src = "92c6p4k4ky311.png"; // can also be a remote URL e.g. http://


    }

    render(ctx) {
        // ctx.beginPath();
        // ctx.fillStyle = config.bird.color;
        // ctx.arc(this.x, this.y, config.bird.height, 0, 2 * Math.PI);
        // ctx.fill();

        ctx.drawImage(this.drawing, this.x, this.y, this.height, this.width);

        return this;
    }
}


export default Bird;