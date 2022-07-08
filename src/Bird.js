import config from "./config.js";

class Bird {
    constructor() {
        this.renderFrame = 0;
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
        this.birdOnImg = [51, 36];

    }

    render(ctx) {
        this.renderFrame++;
        // ctx.beginPath();
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x,this.y,this.height,this.width);
        // ctx.fill();
        ctx.drawImage(this.img, 432,  Math.floor((this.renderFrame % 9) / 3) * this.birdOnImg[1], ...this.birdOnImg,  this.x, this.y, this.height, this.width);
        return this;
    }
}


export default Bird;