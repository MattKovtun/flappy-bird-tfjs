export default {
    //TODO: optimize, remove old vars
    world: {
        height: 400,
        width: 400,
        speed: 1,
        blocksFrequency: 200,
        ms: 2,
        heightRandomness: 50,
        widthRandomness: 30,
        nextBlockX: 125
    },
    bird: {
        width: 15,
        height: 15,
        color: "red",
        jumpSpeed: 7,
        fallingSpeed: 6,
        jumpLength: 25,
    },
    block: {
        width: 85,
        height: 170,
        color: "green"
    },

    agent: {
        saveStates: 2500,
        explorationRate: 0.001,
        explorationRateDecay: 0.35,
        batch: 2000,
        learningRate: 0.1
    }

};
