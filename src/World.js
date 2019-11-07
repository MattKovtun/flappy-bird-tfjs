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


    async graphicMode() {
        const worldState = this.game.getFrame();
        this.game.renderFrame();

        const {score, gameIsOver, birdJump} = worldState;

        let action = 0;
        // if (!birdJump || gameIsOver) {
        //     action = this.agent.act(worldState);
        //     this.game.performAction(action);
        // }


        if (gameIsOver) {
            this.episodes.push(this.game.tick);
            this.game.startNewGame();
            this.scores.push(score);
        }


            if (this.agent.state > this.agent.numberOfEpisodesBeforeRetrain && gameIsOver)
            await this.agent.retrainModel();


        await new Promise((resolve, reject) => setTimeout(resolve, this.refreshRate));
        renderWorldVerbose(score, action, gameIsOver, this.agent.explorationRate, this.agent.losses, this.episodes);


    };


}


export default World;