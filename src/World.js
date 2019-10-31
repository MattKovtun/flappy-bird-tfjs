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
        this.mode = 1;
        this.scores = [];

    }


    async graphicMode() {
        const worldState = this.game.getFrame();
        this.game.renderFrame();

        const {score, gameIsOver, ticks, birdJump} = worldState;
        //
        // let action = 0;
        // if (!birdJump || gameIsOver) {
        //     action = this.agent.act(worldState);
        //     this.game.performAction(action);
        // }


        if (gameIsOver) {
            this.episodes.push(ticks);
            this.game.startNewGame();

        }

        // TODO: move to config
        if (this.agent.state > 100 && gameIsOver) {
            await this.agent.retrainModel();
        }
        //
        // if (this.agent.state >= 2000) {
        //     console.log(this.agent.history);
        //     console.log(sad);
        // }


        this.renderWorldVerbose(score, action, gameIsOver);
        await new Promise((resolve, reject) => setTimeout(resolve, config.world.speed));

    };

    renderWorldVerbose(score, action, gameIsOver) {
        if (action)
            this.movementIndicator.classList = ["arrow arrow_up"];
        else
            this.movementIndicator.classList = ["arrow arrow_down"];


        if (gameIsOver) {
            renderLosses(this.agent.losses, this.lossInfo);
            renderInformation(this.episodes, this.agent.explorationRate, this.information);
            this.scores.push(score);
        }
        if (score === 50) {
            console.log(this.scores);
            console.log(this.agent.losses);
        }
        renderScore(score, this.scoreInfo);
    };

}


export default World;