import {getRandomInt} from "./utils";
import config from "./config";

class Agent {
    constructor(saveStates) {
        this.inputShapeLength = 3;
        this.history = [];
        this.stateIndex = 0;
        this.losses = [];

        this.initModel();

        this.explorationRate = config.agent.explorationRate;
        this.saveStates = config.agent.saveStates;
        this.rewards = config.agent.rewards;
        this.batch = config.agent.batch;
        this.numberOfEpisodesBeforeRetrain = config.agent.numberOfEpisodesBeforeRetrain;



    }

    initModel() {
        //TODO: test different losses, architectures
        // const lossFn = (pred, label) => pred.sub(label).square().mean();
        this.model = tf.sequential();
        this.model.add(tf.layers.dense({units: 4, inputShape: [this.inputShapeLength]}));
        // this.model.add(tf.layers.dense({units: 4}));
        this.model.add(tf.layers.dense({units: 2}));
        this.model.compile({loss: 'meanSquaredError', optimizer: tf.train.adam(config.agent.learningRate)});
        // console.log(this.model);

    }

    modelPredict(input) {
        const prediction = this.model.predict((tf.tensor2d(input, [1, this.inputShapeLength])));
        const action = prediction.argMax(1).dataSync()[0];
        const predictedReward = prediction.max(1).dataSync()[0];
        return {action: action, predictedReward: predictedReward};
    }

    async retrainModel() {
        if (this.history.length >= 2 * this.saveStates)
            this.history = this.history.slice(this.history.length - this.saveStates);


        let xs = [];
        let ys = [];
        for (let i = Math.min(this.batch, this.history.length - 1); i >= 0; --i) {
            const element = this.history[this.history.length - 1 - i];
            xs.push(element.state);

            let y = [0, 0];
            y[element.action] = element.reward;


            ys.push(y);
        }

        xs = tf.tensor2d(xs, [xs.length, this.inputShapeLength]);
        ys = tf.tensor2d(ys, [ys.length, 2]);


        const h = await this.model.fit(xs, ys, {epochs: 1});
        console.log("Loss after Epoch " + " : " + h.history.loss[0]);
        this.losses.push(h.history.loss[0]);

    }


    calculateReward(worldState) {
        // const {gameIsOver} = worldState;
        // let reward = this.rewards.alive;
        // if (gameIsOver) reward = this.rewards.dead;

        const inputs = this.formModelInputs(worldState.bird, worldState.blocks);

        let reward = inputs[0] < inputs[2] && inputs[1] > inputs[2] ? 100 : -100;

        return reward;

    }

    formModelInputs(bird, blocks) {
        let frontBlock;
        for (let block of blocks) {
            if (block.lowerBlock.x + block.lowerBlock.width >= bird.x) {
                frontBlock = block;
                break
            }
        }

        const upperTunnel = frontBlock.upperBlock.y + frontBlock.upperBlock.height;
        const lowerTunnel = frontBlock.lowerBlock.y;

        return [upperTunnel, lowerTunnel, bird.y];
    }

    act(worldState) {
        this.stateIndex++;
        const {bird, blocks, gameIsOver} = worldState;

        const reward = this.calculateReward(worldState);

        const input = this.formModelInputs(bird, blocks);
        const {action, predictedReward} = this.getActionReward(input);

        this.updatePrevState(gameIsOver, reward, input);

        if (!gameIsOver) 
            this.history.push({
                state: input,
                predictedReward: predictedReward,
                action: action,
                reward: -1,
                gameIsOver: -1,
                nextState: -1
            });
        // if (this.history.length == 10) {
        //     console.log(this.history);
        // }
        return action;
    }

    getActionReward(state) {
        if (this.randomMove())
            return {action: getRandomInt(2), predictedReward: -1};

        return this.modelPredict(state);
    }


    randomMove() {
        return Math.random() <= this.explorationRate;
    }

    updatePrevState(gameIsOver, reward, state) {
        if (!this.history.length) return;

        let prevState = this.history.length - 1;

        this.history[prevState].reward = reward;
        this.history[prevState].nextState = state;
        this.history[prevState].gameIsOver = gameIsOver;
    }

}


export default Agent;