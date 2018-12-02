import config from "./config.js";
import Block from "./Block.js";
import Bird from "./Bird.js";


class Game {
    constructor(canvas, ctx) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.score = 0;
    }

    startNewGame() {
        this.bird = new Bird().render(this.ctx);
        this.blocks = [new Block().render(this.ctx)];
        this.current_state = this.bird.jump.length - 1;
        this.ticks = 1;

    }

    gameIsOver() {
        if (this.bird.y >= config.world.height) return true;
        if (this.bird.y <= 0) return true;
        for (let i = 0; i < this.blocks.length; ++i)
            if (this.blocks[i].collision(this.bird)) return true;
        return false;
    }

    performAction(action) {
        if (action) this.current_state = 0;
    }


    moveBlocks() {
        if (this.ticks % config.world.blocksFrequency === 0) this.blocks.push(new Block());
        this.blocks =
            this.blocks
                .filter((el) => {
                    const del = el.x >= 0 - config.block.width;
                    if (!del) this.score++;
                    return del;
                })
                .map((el) => {
                    el.render(this.ctx);
                    el.x--;
                    return el;
                });
    }

    moveBird() {
        this.bird.render(this.ctx);
        this.bird.y += this.bird.jump[this.current_state];
        this.bird.y += config.bird.fallingSpeed;
        this.current_state = Math.min(this.bird.jump.length - 1, this.current_state + 1);
    }

    nextFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.moveBird();
        this.moveBlocks();

        this.ticks++;
        const gameStatus = this.gameIsOver();
        return {
            bird: this.bird,
            blocks: this.blocks,
            gameIsOver: gameStatus,
            ticks: this.ticks,
        }
    };
}


export default Game;