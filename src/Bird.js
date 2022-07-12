import config from "./config.js";

class Bird {
    constructor() {
        this.renderFrame = 0;
        this.y = config.bird.startY;
        this.x = config.bird.startX;

        this.height = config.bird.height;
        this.width = config.bird.width;
        this.fallingSpeed = config.bird.fallingSpeed;
        this.jumpSpeed = config.bird.jumpSpeed;
        this.jumpLength = config.bird.jumpLength;
        this.color = config.bird.color;

        this.jump = new Array(this.jumpLength).fill(-this.jumpSpeed);
        this.jump.push(0);

        this.img = new Image();
        this.img.src = config.img;
        this.birdOnImg = [51, 36]; // sprite

    }

    render(ctx) {
        this.renderFrame++;
        ctx.drawImage(this.img, 432,  Math.floor((this.renderFrame % 9) / 3) * this.birdOnImg[1], ...this.birdOnImg,  this.x, this.y, this.height, this.width);
        return this;
    }
}


export default Bird;