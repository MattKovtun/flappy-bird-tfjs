import World from './World';


const world = new World();

let skip = 0;
let renderEpisode = true;


// const ctx = document.getElementById('losses-chart').getContext('2d');

// const data = {
//     datasets: [{
//       label: 'Loses',
//       data: [],
//       fill: false,
//       borderColor: 'rgb(75, 192, 192)',
//       tension: 0.1
//     }]
//   };
// const chart = new Chart(ctx, {
//     type: 'line',
//     data: data,
//     options: {
//         responsive: true,
//         maintainAspectRatio: false,
//     }
// });


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
    .getElementById('buttons')
    .addEventListener('click', (ev) => {
    switch (ev.target.id) {
        case 'buttonskip-1':
            skip = 20;
            break;
        case 'buttonskip-2':
            skip = 50;
            break;
        case 'buttonskip-3':
            skip = 100000000;
            break;
    }
})