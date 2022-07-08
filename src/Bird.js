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



        this.img = new Image();
        this.img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";


    }

    render(ctx) {
        // ctx.beginPath();
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x,this.y,this.height,this.width);
        // ctx.fill();

        const size = [this.height, this.width];
        ctx.drawImage(this.img, 432, 36, 51, 36,  this.x, this.y, ...size);

        return this;
    }
}


export default Bird;