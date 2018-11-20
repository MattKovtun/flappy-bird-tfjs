import {calcDistance, getRandomInt} from "./utils";
import config from "./config";

class Agent {
    constructor() {
        this.initModel();

    }

    initModel() {
        this.model = tf.sequential();
        this.model.add(tf.layers.dense({units: 1, inputShape: [2], activation: 'softmax'}));
        this.model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

    }

    modelPredict(input) {
        return this.model.predict(input);
    }

    formatInputs(distanceToBlock, distanceToGround) {
        return tf.tensor2d([distanceToBlock, distanceToGround], [1, 2])
    }

    act(worldState) {
        const {bird, blocks, gameIsOver} = worldState;
        const distanceToBlock = calcDistance(bird, blocks[0]);
        const distanceToGround = calcDistance(bird, {x: bird.x, y: config.world.height});

        const input = this.formatInputs(distanceToBlock, distanceToGround);

        const prediction = this.modelPredict(input);
        const action = prediction.dataSync()[0];

        return action;

    }

}


export default Agent;