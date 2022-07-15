export default {
    //TODO: optimize, remove old vars
    world: {
        height: 400,
        width: 400,
        refreshRate: 13,
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
        jumpLength: 8,
        startX: 35,
        startY: 200,
    },
    block: {
        width: 78,
        height: 140,
        blockInitialX: 320,
        blockInitialY: 0
    },

    agent: {
        saveStates: 10000,
        explorationRate: 0.005,
        explorationRateDecay: 0.35,
        learningRate: 0.1,
        epochs: 3,
        numberOfEpisodesBeforeRetrain: 5,
        rewards: {
            alive: 10,
            dead: -300
        }
    },
    img: 'https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png'

};
