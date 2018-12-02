import config from "./config.js";
import Game from "./Game.js";
import Agent from "./Agent";

const canvas = document.getElementById("entry-point");
const ctx = canvas.getContext('2d');

const game = new Game(canvas, ctx);
const agent = new Agent(config.agent.saveStates);

const movementIndicator = document.getElementById("action");
const lossInfo = document.getElementById("losses");
const information = document.getElementById("information");

let episodes = [];

const main = () => {
    game.startNewGame();
    setInterval(async () => {
        const worldState = game.nextFrame.bind(game)();
        const action = agent.act(worldState);

        if (action) {
            movementIndicator.classList.remove("arrow_down");
            movementIndicator.classList.add("arrow_up");
        } else {
            movementIndicator.classList.add("arrow_down");
            movementIndicator.classList.remove("arrow_up");
        }

        game.performAction(action);

        if (worldState.gameIsOver) {
            episodes.push(worldState.ticks);
            game.startNewGame();

            if (episodes.length % config.agent.retrainEpisodes === 0) {
                await agent.retrainModel();
                renderLosses(agent.losses);
                renderInformation();
            }
        }


    }, config.world.speed); // 200
};
main();


// const agentTest = () => {
//     game.startNewGame();
//
//     const worldState = game.nextFrame.bind(game)();
//     const action = agent.act(worldState);
//
//     console.log(action);
//     // game.performAction(action);
//
//
//
// };
// agentTest();


document.body.addEventListener("keypress", (ev) => {
    if (ev.charCode === 32) game.performAction(true);
    if (ev.charCode === 0) game.startNewGame();
});


const renderLosses = (losses) => {
    let innerHTML = ``;
    losses.map((el) => {
        innerHTML += `<span>Loss: ${el}</span>`;
    });
    lossInfo.innerHTML = innerHTML;
    lossInfo.scrollTop = lossInfo.scrollHeight;
};

const renderInformation = (score) => {
    const numOfEpisodes = episodes.length;
    const currentState = episodes.reduce((a, b) => a + b, 0);
    const avgEpisodeLength = currentState / numOfEpisodes;
    information.innerHTML = `
                    <span>Avg Episode Length: ${avgEpisodeLength}</span>
                    <span>Number of episodes: ${numOfEpisodes}</span>
                    <span>Current state: ${currentState}</span>`;

};

