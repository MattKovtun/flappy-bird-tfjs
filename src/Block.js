import config from "./config";
import {areColliding, getRandomInt} from './utils';


class Block {
    constructor() {
        const heightRandomness = getRandomInt(config.world.heightRandomness) - config.world.heightRandomness * 0.5;
        this.upperBlock = {
            height: config.block.height - heightRandomness,
            width: config.block.width,
            x: config.block.blockInitialX,
            y: config.block.blockInitialY
        };
        this.lowerBlock = {
            y: config.world.height - config.block.height - heightRandomness,
            height: config.block.height + heightRandomness,
            width: config.block.width,
            x: config.block.blockInitialX
        };
    }

    collision(object) {
        return areColliding(object, this.upperBlock) ||
            areColliding(object, this.lowerBlock);
    }

    shiftBlocks(step) {
        this.lowerBlock.x -= step;
        this.upperBlock.x -= step;
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