import config from "./config";
import {areColliding, getRandomInt} from './utils';


class Block {
    constructor() {
        // TODO: refactor
        const a = getRandomInt(50) - 35;
        this.upperBlock = {
            y: 0,
            height: config.block.height - a,
            width: config.block.width,
            x: 320
        };
        this.lowerBlock = {
            y: config.world.height - config.block.height - a,
            height: config.block.height + a,
            width: config.block.width,
            x: 320
        };
    }

    collision(object) {
        return areColliding(object, this.upperBlock) ||
            areColliding(object, this.lowerBlock)
    }

    shiftBlocks() {
        this.lowerBlock.x -= config.world.ms;
        this.upperBlock.x -= config.world.ms;
        return this;
    }


    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = config.block.color;
        ctx.fillRect(this.upperBlock.x, this.upperBlock.y, this.upperBlock.width, this.upperBlock.height);
        ctx.fillRect(this.lowerBlock.x, this.lowerBlock.y, this.lowerBlock.width, this.lowerBlock.height);
        return this;
    }
}

export default Block;