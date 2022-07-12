import config from "./config.js";
import Block from "./Block.js";
import Bird from "./Bird.js";
import {getRandomInt} from "./utils";


class Game {
    constructor(canvas, ctx) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.birdJump = false;
        this.startNewGame()
    }

    startNewGame() {
        this.bird = new Bird();
        this.blocks = [new Block()];
        this.currentState = this.bird.jump.length - 1;
        this.score = 0;
        this.tick = 0;
        return this;

    }

    gameIsOver() {
        if (this.bird.y + this.bird.height >= config.world.height) return true;
        if (this.bird.y <= 0) return true;
        for (let i = 0; i < this.blocks.length; ++i)
            if (this.blocks[i].collision(this.bird)) return true;
        return false;
    }

    performAction(action) {
        if (action) this.currentState = 0;
    }


    moveBlocks() {
        this.spawnBlock();
        this.blocks =
            this.blocks
                .filter((el) => {
                    const del = el.upperBlock.x >= -config.block.width;
                    if (!del) this.score++;
                    return del;
                })
                .map((el) => el.shiftBlocks(config.world.shift));
    }


    spawnBlock() {
        if (this.blocks[0].lowerBlock.x <= config.world.nextBlockX + getRandomInt(config.world.widthRandomness)
            && this.blocks.length < 2) this.blocks.push(new Block());
    }

    moveBird() {
        this.bird.y += this.bird.jump[this.currentState];
        this.bird.y += this.bird.fallingSpeed;

        this.birdJump = (this.currentState !== this.bird.jump.length - 1);
        this.currentState = Math.min(this.bird.jump.length - 1, this.currentState + 1);

    }

    getFrame() {
        this.moveBird();
        this.moveBlocks();
        const gameStatus = this.gameIsOver();
        this.tick++;
        return {
            bird: this.bird,
            blocks: this.blocks,
            gameIsOver: gameStatus,
            score: this.score,
            birdJump: this.birdJump
        }
    };

    renderFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.bird.render(this.ctx);
        this.blocks.map((el) => el.render(this.ctx));

    }
}


export default Game;