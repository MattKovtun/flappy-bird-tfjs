import Game from "./Game";
import Agent from "./Agent";
import config from "./config";
import {renderWorldVerbose} from "./utils";

class World {
    constructor() {
        this.canvas = document.getElementById("entry-point");
        this.ctx = this.canvas.getContext('2d');

        this.game = new Game(this.canvas, this.ctx).startNewGame();
        this.agent = new Agent(config.agent.saveStates);


        this.episodes = [];
        this.playGame = true;
        this.scores = [];

        this.refreshRate = config.world.refreshRate;

    }


    async graphicMode(skipEpisode) {
        const worldState = this.game.getFrame();
        const {score, gameIsOver, birdJump} = worldState;

        if (!skipEpisode) {
            this.game.renderFrame();
            await new Promise((resolve, reject) => setTimeout(resolve, this.refreshRate));
        }

        let action;
        if (!birdJump) {
            action = this.agent.act(worldState);
            this.game.performAction(action);
        }


        if (gameIsOver) {
            this.episodes.push(this.game.tick);
            this.game.startNewGame();
            this.scores.push(score);
            await this.agent.retrainModel(this.episodes.length);
        }
        

        renderWorldVerbose(score, action, gameIsOver, this.agent.explorationRate, this.agent.losses, this.episodes);
    };


}


export default World;