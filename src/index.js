import config from "./config.js";
import Game from "./Game.js";
import Agent from "./Agent";

const canvas = document.getElementById("entry-point");
const ctx = canvas.getContext('2d');

const game = new Game(canvas, ctx).startNewGame();
const agent = new Agent(config.agent.saveStates);

const movementIndicator = document.getElementById("action");
const lossInfo = document.getElementById("losses");
const information = document.getElementById("information");
const scoreInfo = document.getElementById("score");

let episodes = [];
let playGame = true;

const main = async () => {
    while (playGame) {
        const worldState = game.nextFrame.bind(game)();
        const action = agent.act(worldState);
        const {score, gameIsOver, ticks} = worldState;

        if (action) {
            movementIndicator.classList.remove("arrow_down");
            movementIndicator.classList.add("arrow_up");
        } else {
            movementIndicator.classList.add("arrow_down");
            movementIndicator.classList.remove("arrow_up");
        }

        game.performAction(action);

        renderScore(score);

        if (gameIsOver) {
            episodes.push(ticks);
            game.startNewGame();

            if (episodes.length % config.agent.retrainEpisodes === 0) {
                agent.retrainModel();
                renderLosses(agent.losses);
                renderInformation();
            }


        }
        await new Promise((resolve, reject) => setTimeout(resolve, config.world.speed));

    }

};


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

const renderInformation = () => {
    const numOfEpisodes = episodes.length;
    const currentState = episodes.reduce((a, b) => a + b, 0);
    const avgEpisodeLength = currentState / numOfEpisodes;
    information.innerHTML = `
                    <span>Avg Episode Length: ${avgEpisodeLength}</span>
                    <span>Number of episodes: ${numOfEpisodes}</span>
                    <span>Current state: ${currentState}</span>`;

};


const renderScore = (score) => scoreInfo.innerHTML = `Score: ${score}`;

main();