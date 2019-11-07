const movementIndicator = document.getElementById("action");
const lossInfo = document.getElementById("losses");
const information = document.getElementById("information");
const scoreInfo = document.getElementById("score");


export const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

export const calcDistance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export const areColliding = (objectOne, objectTwo) =>
    (objectOne.x + objectOne.width >= objectTwo.x && objectOne.x + objectOne.width <= objectTwo.x + objectTwo.width)
    && ((objectOne.y + objectOne.height >= objectTwo.y && objectOne.y + objectOne.height <= objectTwo.y + objectTwo.height)
    || (objectOne.y >= objectTwo.y && objectOne.y <= objectTwo.y + objectTwo.height));


export const renderLosses = (losses, entryPoint) => {
    entryPoint.innerHTML = '';
    const container = document.createElement("div");
    losses.map((el) => {
        const elem = document.createElement("span");
        elem.innerHTML = `Loss: ${el}`;
        container.appendChild(elem);
    });
    entryPoint.appendChild(container);
    entryPoint.scrollTop = entryPoint.scrollHeight;
};

export const renderInformation = (episodes, explorationRate, entryPoint) => {
    const numOfEpisodes = episodes.length;
    const currentState = episodes.reduce((a, b) => a + b, 0);
    const avgEpisodeLength = currentState / numOfEpisodes;
    entryPoint.innerHTML = `
                    <span>Avg Episode Length: ${avgEpisodeLength}</span>
                    <span>Number of episodes: ${numOfEpisodes}</span>
                    <span>Current state: ${currentState}</span>
                    <span>Exploration rate: ${explorationRate}</span>`;

};


export const renderScore = (score, entryPoint) => entryPoint.innerHTML = `Score: ${score}`;


export const renderWorldVerbose = (score, action, gameIsOver, explorationRate, losses, episodes) => {
    if (action)
        movementIndicator.classList = ["arrow arrow_up"];
    else
        movementIndicator.classList = ["arrow arrow_down"];


    if (gameIsOver) {
        renderLosses(losses, lossInfo);
        renderInformation(episodes, explorationRate, information);

    }


    renderScore(score, scoreInfo);
};
