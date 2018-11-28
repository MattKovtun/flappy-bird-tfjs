import {calcDistance, getRandomInt} from "./utils";
import config from "./config";

class Agent {
    constructor() {
        this.initModel();
        this.history = [];
        this.retrainEpisodes = config.agent.retrainEpisodes;
        this.saveEpisodes = config.agent.saveEpisodes;
        this.episode = 0;

    }

    initModel() {
        // const lossFn = (pred, label) => pred.sub(label).square().mean();

        this.model = tf.sequential();
        this.model.add(tf.layers.dense({units: 4, inputShape: [2]}));
        this.model.add(tf.layers.dense({units: 2}));
        this.model.compile({loss: 'meanSquaredError', optimizer: tf.train.adam()});

    }

    modelPredict(input) {
        return this.model.predict(input);
    }

    async retrainModel() {
        let xs = [];
        let ys = [];
        for (let i = 0; i < this.history.length; ++i) {
            const element = this.history[i];
            xs.push([element[0], element[1]]);
            ys.push([element[3], element[3]]);
        }
        xs = tf.tensor2d(xs, [this.history.length, 2]);
        ys = tf.tensor2d(ys, [this.history.length, 2]);


        const h = await this.model.fit(xs, ys);
        console.log("Loss after Epoch " + " : " + h.history.loss[0]);

    }

    formatInputs(distanceToBlock, distanceToGround) {
        return tf.tensor2d([distanceToBlock, distanceToGround], [1, 2])
    }

    act(worldState) {
        this.episode++;
        const {bird, blocks, ticks, gameIsOver} = worldState;
        let reward = 100;
        if (gameIsOver) reward = -500;

        const distanceToBlock = calcDistance(bird, blocks[0]);
        const distanceToGround = calcDistance(bird, {x: bird.x, y: config.world.height});


        const input = this.formatInputs(distanceToBlock, distanceToGround);
        const prediction = this.modelPredict(input);

        // prediction.print();
        const action = prediction.argMax(1).dataSync()[0];
        const predictedReward = prediction.max(1).dataSync()[0];



        this.history.push([distanceToBlock, distanceToGround, predictedReward, 0]);


        if (this.episode % this.retrainEpisodes === 0) {
            if (this.history.length >= 2 * this.saveEpisodes) this.history.splice(this.history.length - this.saveEpisodes);
            this.retrainModel();
        }
        if (this.episode > 1) this.history[this.history.length - 1][3] = reward;


        return action;

    }

}


export default Agent;