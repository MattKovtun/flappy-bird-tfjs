import {calcDistance, getRandomInt} from "./utils";
import config from "./config";

class Agent {
    constructor(saveEpisodes) {
        this.initModel();
        this.history = [];
        this.saveEpisodes = saveEpisodes;
        this.episode = 0;
        this.losses = [];

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
        if (this.history.length >= 2 * this.saveEpisodes) this.history.splice(this.history.length - this.saveEpisodes);


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
        this.losses.push(h.history.loss[0]);

    }


    calculateReward(gameIsOver) {
        let reward = 100;
        if (gameIsOver) reward = -500;
        return reward

    }

    formModelInputs(bird, blocks) {
        const distanceToBlock = calcDistance(bird, blocks[0]);
        const distanceToGround = calcDistance(bird, {x: bird.x, y: config.world.height});
        return [distanceToBlock, distanceToGround];
    }

    act(worldState) {
        this.episode++;
        const {bird, blocks, ticks, gameIsOver} = worldState;

        const reward = this.calculateReward(gameIsOver);

        const input = this.formModelInputs(bird, blocks);
        const prediction = this.modelPredict(tf.tensor2d(input, [1, 2]));

        // prediction.print();
        const action = prediction.argMax(1).dataSync()[0];
        const predictedReward = prediction.max(1).dataSync()[0];


        this.history.push([...input, predictedReward, 0, action]);


        if (this.episode > 1) this.history[this.history.length - 1][3] = reward;
        if (gameIsOver) {
            for (let i = this.history.length - 1; i >= 0; --i) {
                this.history[i][3] = reward;
                if (this.history[i][4] === 1) break
            }
        }


        return action;

    }

}


export default Agent;