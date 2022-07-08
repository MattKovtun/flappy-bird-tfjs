export default {
    //TODO: optimize, remove old vars
    world: {
        height: 400,
        width: 400,
        refreshRate: 40,
        blocksFrequency: 200,
        shift: 3,
        heightRandomness: 50,
        widthRandomness: 30,
        nextBlockX: 125,

    },
    bird: {
        width: 20,
        height: 20,
        jumpSpeed: 11,
        fallingSpeed: 3,
        jumpLength: 10,
    },
    block: {
        width: 78,
        height: 140,
        blockInitialX: 320,
        blockInitialY: 0
    },

    agent: {
        saveStates: 100,
        explorationRate: 0.01,
        explorationRateDecay: 0.35,
        batch: 2000,
        learningRate: 0.1,
        numberOfEpisodesBeforeRetrain: 10,
        rewards: {
            alive: 10,
            dead: -300
        }
    }

};
