import Game from "./Game";
import Agent from "./Agent";
import config from "./config";
import Info from "./Info";

class World {
    constructor() {
        this.info = new Info();

        this.canvas = document.getElementById("entry-point");

        this.game = new Game(this.canvas);
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
            this.info.renderScore(score);

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
            if (renderEpisode || score >= 10) await new Promise((resolve, reject) => setTimeout(resolve, this.refreshRate));

        }
    }

    async graphicMode(renderEpisode) {
        await this.playOneEpisode(renderEpisode);

        await this.agent.retrainModel(this.episodes.length);

        this.info.renderLosses(this.agent.losses);
        this.info.renderInformation(this.episodes, this.agent.explorationRate);
    };


}


export default World;