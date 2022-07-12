import World from './World';


const world = new World();

let skip = 0;
let renderEpisode = true;


const main = async (world) => {
    while (world.playGame) {
        renderEpisode = skip > 0 ? false: true;

        await world.graphicMode(renderEpisode);
        skip--;
           
    }
    
};

main(world);


document.addEventListener('keypress', (ev) => {
    if (ev.keyCode === 32) world.game.performAction(1);
});
document.addEventListener('keyup', (ev) => {
    if (ev.keyCode === 27) gg; // escape 
});

document
    .getElementById('buttonskip3')
    .addEventListener('click', () => {
    skip = 10;
})