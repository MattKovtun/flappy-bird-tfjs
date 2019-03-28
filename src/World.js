import Game from "./Game";
import Agent from "./Agent";
import config from "./config";
import {renderInformation, renderLosses, renderScore} from "./utils";

class World {
    constructor() {
        this.canvas = document.getElementById("entry-point");
        this.ctx = this.canvas.getContext('2d');

        this.game = new Game(this.canvas, this.ctx).startNewGame();
        this.agent = new Agent(config.agent.saveStates);

        this.movementIndicator = document.getElementById("action");
        this.lossInfo = document.getElementById("losses");
        this.information = document.getElementById("information");
        this.scoreInfo = document.getElementById("score");

        this.episodes = [];
        this.playGame = true;
        this.fastForward = 0;
        this.mode = 1;

    }


    async main() {
        while (this.playGame)
            if (this.episodes.length >= this.fastForward) await this.graphicMode(this.mode);

    }

    async graphicMode(mode) {
        const worldState = this.game.nextFrame();
        const action = this.agent.act(worldState);
        const {score, gameIsOver, ticks} = worldState;
        this.game.performAction(action);


        if (gameIsOver) {
            this.episodes.push(ticks);
            this.game.startNewGame();

            if (this.episodes.length % config.agent.retrainEpisodes === 0)
                if (mode !== 3) await this.agent.retrainModel();
                else this.agent.retrainModel();
        }

        if (mode === 1) this.renderWorldVerbose(score, action, gameIsOver);
        if (mode === 2) this.renderWorld(score);
        if (mode !== 3) await new Promise((resolve, reject) => setTimeout(resolve, config.world.speed));

    };

    renderWorldVerbose(score, action, gameIsOver) {
        if (action) {
            this.movementIndicator.classList.remove("arrow_down");
            this.movementIndicator.classList.add("arrow_up");
        } else {
            this.movementIndicator.classList.add("arrow_down");
            this.movementIndicator.classList.remove("arrow_up");
        }

        if (gameIsOver && this.episodes.length % config.agent.retrainEpisodes === 0)
            this.renderInterface();
        this.renderWorld(score);


    };

    renderInterface() {
        renderLosses(this.agent.losses, this.lossInfo);
        renderInformation(this.episodes, this.agent.explorationRate, this.information);
    };


    renderWorld(score) {
        renderScore(score, this.scoreInfo);
        this.game.renderNextFrame();
    };


}


export default World;