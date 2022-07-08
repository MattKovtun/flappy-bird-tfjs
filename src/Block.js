import config from "./config";
import {areColliding, getRandomInt} from './utils';


class Block {
    constructor() {
        this.img = new Image();
        this.img.src = config.img;

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

        ctx.drawImage(this.img,  432 + this.lowerBlock.width, 108, this.lowerBlock.width, this.lowerBlock.height, this.lowerBlock.x, this.lowerBlock.y, this.lowerBlock.width, this.lowerBlock.height);
        ctx.drawImage(this.img,  432, 588 - this.upperBlock.height, this.upperBlock.width, this.upperBlock.height, this.upperBlock.x, this.upperBlock.y, this.upperBlock.width, this.upperBlock.height);
        return this;
    }
}

export default Block;