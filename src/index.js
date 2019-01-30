import config from "./config.js";
import Game from "./Game.js";
import Agent from "./Agent";
import {renderInformation, renderLosses, renderScore} from "./utils";

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
let fastForward = 0;
let mode = 1;

const main = async () => {
    while (playGame)
        if (episodes.length >= fastForward) await graphicMode(mode);
};


const graphicMode = async (mode) => {
    const worldState = game.nextFrame();
    const action = agent.act(worldState);
    const {score, gameIsOver, ticks} = worldState;
    game.performAction(action);


    if (gameIsOver) {
        episodes.push(ticks);
        game.startNewGame();

        if (episodes.length % config.agent.retrainEpisodes === 0)
            if (mode === 3) await agent.retrainModel();
            else agent.retrainModel();
    }

    if (mode === 1) renderWorldVerbose(score, action, gameIsOver);
    if (mode === 2) renderWorld(score);
    if (mode !== 3) await new Promise((resolve, reject) => setTimeout(resolve, config.world.speed));

};

const renderWorldVerbose = (score, action, gameIsOver) => {
    if (action) {
        movementIndicator.classList.remove("arrow_down");
        movementIndicator.classList.add("arrow_up");
    } else {
        movementIndicator.classList.add("arrow_down");
        movementIndicator.classList.remove("arrow_up");
    }

    if (gameIsOver && episodes.length % config.agent.retrainEpisodes === 0) renderInterface();
    renderWorld(score);


};

const renderInterface = () => {
    renderLosses(agent.losses, lossInfo);
    renderInformation(episodes, agent.explorationRate, information);
};


const renderWorld = (score) => {
    renderScore(score, scoreInfo);
    game.renderNextFrame();
};

main();


document.body.addEventListener("keypress", (ev) => {
    if (ev.charCode === 32) game.performAction(true);
    if (ev.charCode === 0) game.startNewGame();
    if (ev.charCode === 102) fastForward = episodes.length + 10;
    // if (ev.charCode === 51) mode = 3;
    if (ev.charCode === 49) {
        mode = 1;
        renderInterface();
    }

});