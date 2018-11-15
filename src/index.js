import config from "./config.js";
import Game from "./Game.js";

const canvas = document.getElementById("entry-point");
const ctx = canvas.getContext('2d');

const game = new Game(canvas, ctx);


const main = () => {
    game.startNewGame();
    setInterval(game.nextFrame.bind(game), config.world.speed);
};
main();


document.body.addEventListener("keypress", (ev) => {
    if (ev.charCode === 32) game.current_state = 0;
    if (ev.charCode === 0) game.startNewGame();
});


