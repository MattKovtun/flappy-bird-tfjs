export default {
    world: {
        height: 400,
        width: 400,
        speed: 3,
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
        retrainEpisodes: 8,
        saveStates: 4000
    }

};
