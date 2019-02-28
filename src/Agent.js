import {calcDistance, getRandomInt} from "./utils";
import config from "./config";

class Agent {
    constructor(saveStates) {
        this.initModel();
        this.history = [];
        this.saveStates = saveStates;
        this.state = 0;
        this.losses = [];
        this.explorationRate = config.agent.explorationRate;
        this.explorationRateDecay = config.agent.explorationRateDecay;

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
        this.explorationRate = Math.max(this.explorationRate - this.explorationRate * this.explorationRateDecay, 0.01);
        if (this.history.length >= 2 * this.saveStates) this.history = this.history.slice(this.history.length - this.saveStates);


        let xs = [];
        let ys = [];
        for (let i = 0; i < this.history.length; ++i) {
            const element = this.history[i];
            xs.push([element[0], element[1]]);
            ys.push([element[3], element[3]]);
        }
        xs = tf.tensor2d(xs, [this.history.length, 2]);
        ys = tf.tensor2d(ys, [this.history.length, 2]);


        const h = await this.model.fit(xs, ys, {epochs: 2});
        // console.log("Loss after Epoch " + " : " + h.history.loss[0]);
        this.losses.push(h.history.loss[0]);

    }


    calculateReward(gameIsOver) {
        let reward = 100;
        if (gameIsOver) reward = -500;
        return reward

    }

    formModelInputs(bird, blocks) {

        // const distanceToBlock = calcDistance(bird, blocks[0]);
        const distanceToGround = calcDistance(bird, {x: blocks[0].x, y: bird.y});
        const distanceToBlock = calcDistance(bird, {x: bird.x, y: blocks[0].y});

        return [distanceToBlock, distanceToGround];
    }

    act(worldState) {
        this.state++;
        const {bird, blocks, ticks, gameIsOver} = worldState;

        const reward = this.calculateReward(gameIsOver);
        const input = this.formModelInputs(bird, blocks);

        const {action, predictedReward} = this.getActionReward(input);

        this.history.push([...input, predictedReward, reward, action]);

        this.updateRewards(gameIsOver, reward);

        return action;
    }

    getActionReward(input) {
        let action, predictedReward;
        if (this.randomMove()) {
            action = getRandomInt(2);
            predictedReward = 100;
        }
        else {
            const prediction = this.modelPredict(tf.tensor2d(input, [1, 2]));
            action = prediction.argMax(1).dataSync()[0];
            predictedReward = prediction.max(1).dataSync()[0];
        }
        return {action: action, predictedReward: predictedReward};
    }


    randomMove() {
        if (this.explorationRate <= 0.01) return false;
        return Math.random() <= this.explorationRate;
    }


    updateRewards(gameIsOver, reward) {
        if (this.state > 1) this.history[this.history.length - 1][3] = reward;
        if (gameIsOver) {
            for (let i = this.history.length - 1; i >= 0; --i) {
                if (this.history[i][4]) {
                    this.history[i][3] = reward;
                    break;
                }
            }
        }

    }

}


export default Agent;