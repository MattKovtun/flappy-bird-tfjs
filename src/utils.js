export const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

export const calcDistance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));


export const renderLosses = (losses, entryPoint) => {
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
