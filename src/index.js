import World from './World';


const world = new World();


const main = async (world) => {
    while (world.playGame)
        await world.graphicMode(world.mode);
};

main(world);


document.addEventListener('keypress', (ev) => {
    if (ev.keyCode == 32) world.game.performAction(1);
});