import config from "./config";

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
        if (this.collide(object, this)) return true;
        if (this.collide(object, {
            x: this.x,
            y: config.world.height - this.height,
            width: this.width,
            height: this.height
        })) return true;
        return false;
    }

    collide(objectOne, objectTwo) {
        return (objectOne.y >= objectTwo.y && objectOne.y <= (objectTwo.y + objectTwo.height)) && (objectOne.x >= objectTwo.x && objectOne.x <= objectTwo.x + objectTwo.width);
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