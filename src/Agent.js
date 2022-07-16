import {getRandomInt} from "./utils";
import config from "./config";

class Agent {
    constructor(saveStates) {
        this.inputShapeLength = 3;
        this.history = [];
        this.stateIndex = 0;
        this.losses = [];

        this.explorationRate = config.agent.explorationRate;
        this.saveStates = config.agent.saveStates;
        this.rewards = config.agent.rewards;
        this.batch = config.agent.batch;
        this.epochs = config.agent.epochs;
        this.numberOfEpisodesBeforeRetrain = config.agent.numberOfEpisodesBeforeRetrain;

        this.initModel();
    }

    initModel() {
        //TODO: test different losses, architectures
        // const lossFn = (pred, label) => pred.sub(label).square().mean();
        this.model = tf.sequential();
        this.model.add(tf.layers.dense({units: 4, kernelInitializer: tf.initializers.randomNormal(1), inputShape: [this.inputShapeLength]}));
        // this.model.add(tf.layers.dense({units: 4, activation: 'relu'}));
        this.model.add(tf.layers.dense({units: 4, useBias: false}));

        this.model.add(tf.layers.dense({units: 2}));
        this.model.compile({loss: 'meanSquaredError', optimizer: tf.train.adam(config.agent.learningRate)});
    }

    modelPredict(input) {
        const prediction = this.model.predict((tf.tensor2d(input, [1, this.inputShapeLength])));
        const action = prediction.argMax(1).dataSync()[0];
        const predictedReward = prediction.max(1).dataSync()[0];
        console.log(prediction.dataSync());
        return {action: action, predictedReward: predictedReward};
    }

    async retrainModel(numOfEpisodes) {
        if (this.history.length >= this.saveStates)
            this.history = this.history.slice(1000);

        if (numOfEpisodes % this.numberOfEpisodesBeforeRetrain != 0) return;

        let xs = [];
        let ys = [];
        for (let i = Math.min(this.history.length - 1); i >= 0; --i) {
            const element = this.history[this.history.length - 1 - i];
            xs.push(element.state);

            let y = [0, 0];
            y[element.action] = element.reward;


            ys.push(y);
        }

        xs = tf.tensor2d(xs, [xs.length, this.inputShapeLength]);
        ys = tf.tensor2d(ys, [ys.length, 2]);


        const h = await this.model.fit(xs, ys, {epochs: this.epochs});
        this.losses.push(Math.round(h.history.loss[0]));

        // for (let i = 0; i < this.model.getWeights().length; i++) {
        //     console.log(this.model.getWeights()[i].dataSync());
        // }

    }


    calculateReward(worldState) {
        // const {gameIsOver} = worldState;
        // let reward = this.rewards.alive;
        // if (gameIsOver) reward = this.rewards.dead;

        const inputs = this.formModelInputs(worldState.bird, worldState.blocks);

        let reward = inputs[0] < worldState.bird.y && inputs[1] > worldState.bird.y + worldState.bird.height ? 100 : -100;

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
        const {action, predictedReward} = this.getActionReward(input, worldState.score);

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

    getActionReward(state, score) {
        if (score <= 10 && Math.random() <= this.explorationRate)
            return {action: getRandomInt(2), predictedReward: -1};

        return this.modelPredict(state);
    }


    updatePrevState(gameIsOver, reward, state) {
        if (!this.history.length) return;

        let prevState = this.history.length - 1;

        this.history[prevState].reward = reward;
        this.history[prevState].nextState = state;
        this.history[prevState].gameIsOver = gameIsOver;
        console.log(this.history[prevState].reward, gameIsOver, state);

    }

}


export default Agent;