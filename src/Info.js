class Info {
    constructor () {
        this.information = document.getElementById("information");
        this.lossInfo = document.getElementById("losses");
        this.ctx = document.getElementById('losses-chart').getContext('2d');
        this.chart = this.setupLossesChart();
    }

    setupLossesChart() {
        const data = {
            datasets: [{
              label: 'Last 10 losses',
              data: [],
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
            }]
          };
        
        return new Chart(this.ctx, {
            type: 'line',
            data: data,
        
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        });
    }

    renderInformation(episodes, explorationRate) {
        const numOfEpisodes = episodes.length;
        const currentState = episodes.reduce((a, b) => a + b, 0);
        const avgEpisodeLength = currentState / numOfEpisodes;
        this.information.innerHTML = `
                        <span>Avg Episode Length: ${avgEpisodeLength}</span>
                        <span>Number of episodes: ${numOfEpisodes}</span>
                        <span>Current state: ${currentState}</span>
                        <span>Exploration rate: ${explorationRate}</span>`;
    
    };

    renderLosses(losses) {
        this.lossInfo.innerHTML = '';
        const container = document.createElement("div");
        losses.map((el) => {
            const elem = document.createElement("span");
            elem.innerHTML = `Loss: ${el}`;
            container.appendChild(elem);
        });
        this.lossInfo.appendChild(container);
        this.lossInfo.scrollTop = this.lossInfo.scrollHeight;
    
        this.chart.data.datasets[0].data = losses.slice(-10);
        this.chart.data.labels = [...Array(10).keys()];
        this.chart.update();
    
    };

    renderScore(score) {
        document.getElementById("score").innerHTML = `Score: ${score}`
    };

}

export default Info;