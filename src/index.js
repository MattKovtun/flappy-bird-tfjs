import config from "./config.js";
import Game from "./Game.js";
import Agent from "./Agent";

const canvas = document.getElementById("entry-point");
const ctx = canvas.getContext('2d');

const game = new Game(canvas, ctx);
const agent = new Agent();


const main = () => {
    game.startNewGame();
    setInterval(() => {
        const worldState = game.nextFrame.bind(game)();
        const action = agent.act(worldState);

        game.performAction(action);

        if (worldState.gameIsOver) game.startNewGame();


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


