import config from "./config";

class Block {
    constructor() {
        this.x = 320;
        this.upperHeight = config.block.height;
        this.lowerHeight = config.block.height;
        this.width = config.block.width;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = config.block.color;
        ctx.fillRect(this.x, 0, this.width, this.upperHeight);
        ctx.fillRect(this.x, config.world.height - this.lowerHeight, this.width, this.lowerHeight);
        return this;
    }
}

export default Block;