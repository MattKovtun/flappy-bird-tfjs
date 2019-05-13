export default {
    world: {
        height: 400,
        width: 400,
        speed: 1,
        blocksFrequency: 200,
    },
    bird: {
        width: 15,
        height: 15,
        color: "red",
        jumpSpeed: 7,
        fallingSpeed: 3,
        jumpLength: 25,
    },
    block: {
        width: 85,
        height: 105,
        color: "green"
    },

    agent: {
        retrainEpisodes: 10,
        saveStates: 3000,
        explorationRate: 0.001,
        explorationRateDecay: 0.35,
        batch: 128,
    }

};
