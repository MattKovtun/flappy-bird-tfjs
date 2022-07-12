import Game from "./Game";
import Agent from "./Agent";
import config from "./config";
import {renderWorldVerbose, renderScore} from "./utils";

class World {
    constructor() {
        this.canvas = document.getElementById("entry-point");
        this.ctx = this.canvas.getContext('2d');

        this.game = new Game(this.canvas, this.ctx);
        this.agent = new Agent(config.agent.saveStates);


        this.episodes = [];
        this.playGame = true;
        this.scores = [];

        this.refreshRate = config.world.refreshRate;

    }

    async playOneEpisode(renderEpisode) {
        this.game.startNewGame();

        while (true) {
            const worldState = this.game.getFrame();
            this.game.renderFrame();

            const {score, gameIsOver, birdJump} = worldState;
            renderScore(score);

            let action;
            if (!birdJump) {
                action = this.agent.act(worldState);
                this.game.performAction(action);
            }

            
            if (gameIsOver) {
                this.episodes.push(this.game.tick);
                this.scores.push(score);
                break;
            }
            if (renderEpisode) await new Promise((resolve, reject) => setTimeout(resolve, this.refreshRate));

        }
    }

    async graphicMode(renderEpisode) {
        await this.playOneEpisode(renderEpisode);

        await this.agent.retrainModel(this.episodes.length);
        renderWorldVerbose(this.agent.explorationRate, this.agent.losses, this.episodes);
    };


}


export default World;