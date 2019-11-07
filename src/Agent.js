import {getRandomInt} from "./utils";
import config from "./config";

class Agent {
    constructor(saveStates) {
        this.initModel();
        this.history = [];
        this.saveStates = saveStates;
        this.state = 0;
        this.losses = [];

        this.explorationRate = config.agent.explorationRate;
        this.rewards = config.agent.rewards;
        this.batch = config.agent.batch;
        this.numberOfEpisodesBeforeRetrain = config.agent.numberOfEpisodesBeforeRetrain;

    }

    initModel() {
        //TODO: test different losses, architectures
        // const lossFn = (pred, label) => pred.sub(label).square().mean();

        this.model = tf.sequential();
        this.model.add(tf.layers.dense({units: 4, inputShape: [2]}));
        this.model.add(tf.layers.dense({units: 4}));
        this.model.add(tf.layers.dense({units: 2}));
        this.model.compile({loss: 'meanSquaredError', optimizer: tf.train.adam(config.agent.learningRate)});

    }

    modelPredict(input) {
        const prediction = this.model.predict((tf.tensor2d(input, [1, 2])));
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

        xs = tf.tensor2d(xs, [xs.length, 2]);
        ys = tf.tensor2d(ys, [ys.length, 2]);


        const h = await this.model.fit(xs, ys, {epochs: 1});
        // console.log("Loss after Epoch " + " : " + h.history.loss[0]);
        this.losses.push(h.history.loss[0]);

    }


    calculateReward(gameIsOver) {
        let reward = this.rewards.alive;
        if (gameIsOver) reward = this.rewards.dead;
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


        const distanceToBlockVert = bird.y - frontBlock.lowerBlock.y;
        const distanceToBlockHoriz = frontBlock.lowerBlock.x + frontBlock.lowerBlock.width - bird.x;

        //
        // const distanceToBlockHoriz = calcDistance(bird, {
        //     x: frontBlock.lowerBlock.x + frontBlock.lowerBlock.width,
        //     y: bird.y
        // });  // distances are ints

        return [distanceToBlockVert, distanceToBlockHoriz];
    }

    act(worldState) {
        this.state++;
        const {bird, blocks, gameIsOver} = worldState;

        const reward = this.calculateReward(gameIsOver);
        const input = this.formModelInputs(bird, blocks);
        const state = input;

        const {action, predictedReward} = this.getActionReward(input);

        if (!gameIsOver)
            this.history.push({
                state: state,
                predictedReward: predictedReward,
                action: action,
                reward: -1,
                gameIsOver: -1,
                nextState: -1
            });


        this.updatePrevState(gameIsOver, reward, state);
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
        if (this.state <= 1) return;

        let prevState = this.history.length - 2;
        if (gameIsOver) prevState = this.history.length - 1;


        this.history[prevState].reward = reward;
        this.history[prevState].nextState = state;
        this.history[prevState].gameIsOver = gameIsOver;

    }

}


export default Agent;