import config from "./config";
import {areColliding} from './utils';

class Block {
    constructor() {
        this.upperHeight = config.block.height;
        this.lowerHeight = config.block.height;

        this.x = 320;
        this.y = 0;
        this.width = config.block.width;
        this.height = config.block.height;
    }

    collision(object) {
        return areColliding(object, this) ||
            areColliding(object, {
                x: this.x,
                y: config.world.height - this.height,
                width: this.width,
                height: this.height
            })
    }


    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = config.block.color;
        ctx.fillRect(this.x, this.y, this.width, this.upperHeight);
        ctx.fillRect(this.x, config.world.height - this.lowerHeight, this.width, this.lowerHeight);
        return this;
    }
}

export default Block;