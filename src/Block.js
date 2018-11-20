import config from "./config";

class Block {
    constructor() {
        this.upperHeight = config.block.height;
        this.lowerHeight = config.block.height;

        this.x = 320;
        this.y = config.world.height - this.lowerHeight;
        this.width = config.block.width;
    }

    collision(object) {
        if (object.y <= this.upperHeight && (object.x >= this.x && object.x <= this.x + this.width)) return true;
        if (object.y >= config.world.height - this.lowerHeight && (object.x >= this.x && object.x <= this.x + this.width)) return true;
        return false;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = config.block.color;
        ctx.fillRect(this.x, 0, this.width, this.upperHeight);
        ctx.fillRect(this.x, this.y, this.width, this.lowerHeight);
        return this;
    }
}

export default Block;