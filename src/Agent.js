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
        this.rewards = [100, -500];

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
        if (this.history.length >= 2 * this.saveStates)
            this.history = this.history.slice(this.history.length - this.saveStates);


        let xs = [];
        let ys = [];
        for (let i = 0; i < this.history.length; ++i) {
            const element = this.history[i];
            xs.push([element.xOne, element.xTwo]);
            // TODO: what is second reward?

            let y = [element.reward, element.reward];
            y[element.action] = element.reward;

            ys.push(y);
        }

        xs = tf.tensor2d(xs, [this.history.length, 2]);
        ys = tf.tensor2d(ys, [this.history.length, 2]);

        const h = await this.model.fit(xs, ys, {epochs: 2});
        // console.log("Loss after Epoch " + " : " + h.history.loss[0]);
        this.losses.push(h.history.loss[0]);

    }


    calculateReward(gameIsOver) {
        let reward = this.rewards[0];
        if (gameIsOver) reward = this.rewards[1];
        return reward

    }

    formModelInputs(bird, blocks) {

        const distanceToBlock = calcDistance(bird, blocks[0]);
        const distanceToGround = calcDistance(bird, {x: bird.x, y: config.world.height});
        // const distanceToBlock = calcDistance(bird, {x: bird.x, y: blocks[0].y});

        return [distanceToBlock, distanceToGround];
    }

    act(worldState) {
        this.state++;
        const {bird, blocks, ticks, gameIsOver} = worldState;

        const reward = this.calculateReward(gameIsOver);
        const input = this.formModelInputs(bird, blocks);

        const {action, predictedReward} = this.getActionReward(input);

        this.history.push({
            xOne: input[0],
            xTwo: input[1],
            predictedReward: predictedReward,
            reward: -1,
            action: action
        });

        this.updateRewards(gameIsOver, reward, ticks);

        return action;
    }

    getActionReward(input) {
        let action, predictedReward;
        if (this.randomMove()) {
            action = getRandomInt(2);
            predictedReward = 100;
        } else {
            const prediction = this.modelPredict(tf.tensor2d(input, [1, 2]));
            action = prediction.argMax(1).dataSync()[0];
            predictedReward = prediction.max(1).dataSync()[0];
        }
        return {action: action, predictedReward: predictedReward};
    }


    randomMove() {
        return Math.random() <= this.explorationRate;
    }


    updateRewards(gameIsOver, reward, ticks) {
        // TODO: fix if jump from previous session, which jumps prevent?
        if (this.state > 1) this.history[this.history.length - 1].reward = reward;
        if (gameIsOver) {
            for (let i = 1; i <= ticks - 2; ++i) {
                if (this.history[this.history.length - i].action) {
                    this.history[i].reward = reward;
                    break;
                }
            }
        }

    }

}


export default Agent;