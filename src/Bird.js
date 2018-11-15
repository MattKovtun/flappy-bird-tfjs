import config from "./config.js";

class Bird {
    constructor() {
        this.y = 200;
        this.x = 35;

        this.jump = new Array(config.bird.jumpLength).fill(-config.bird.jumpSpeed);
        for (let i = 0; i < 10; ++i)
            this.jump.push(-config.bird.fallingSpeed);
        this.jump.push(0);
    }

    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = config.bird.color;
        ctx.arc(this.x, this.y, config.bird.height, 0, 2 * Math.PI);
        ctx.fill();
        return this;
    }
}


export default Bird;