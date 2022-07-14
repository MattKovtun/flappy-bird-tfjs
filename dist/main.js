!function(t){var e={};function i(s){if(e[s])return e[s].exports;var r=e[s]={i:s,l:!1,exports:{}};return t[s].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(s,r,function(e){return t[e]}.bind(null,r));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";i.r(e);var s={world:{height:400,width:400,refreshRate:13,blocksFrequency:200,shift:3,heightRandomness:50,widthRandomness:30,nextBlockX:125},bird:{width:20,height:20,jumpSpeed:11,fallingSpeed:3,jumpLength:8,startX:35,startY:200},block:{width:78,height:140,blockInitialX:320,blockInitialY:0},agent:{saveStates:5e3,explorationRate:.005,explorationRateDecay:.35,batch:2e3,learningRate:.01,epochs:3,numberOfEpisodesBeforeRetrain:3,rewards:{alive:10,dead:-300}},img:"https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png"};const r=t=>Math.floor(Math.random()*Math.floor(t)),h=(t,e)=>t.x+t.width>=e.x&&t.x+t.width<=e.x+e.width&&(t.y+t.height>=e.y&&t.y+t.height<=e.y+e.height||t.y>=e.y&&t.y<=e.y+e.height);var o=class{constructor(){this.img=new Image,this.img.src=s.img;const t=r(s.world.heightRandomness)-.5*s.world.heightRandomness;this.upperBlock={height:s.block.height-t,width:s.block.width,x:s.block.blockInitialX,y:s.block.blockInitialY},this.lowerBlock={y:s.world.height-s.block.height-t,height:s.block.height+t,width:s.block.width,x:s.block.blockInitialX}}collision(t){return h(t,this.upperBlock)||h(t,this.lowerBlock)}shiftBlocks(t){return this.lowerBlock.x-=t,this.upperBlock.x-=t,this}render(t){return t.beginPath(),t.drawImage(this.img,432+this.lowerBlock.width,108,this.lowerBlock.width,this.lowerBlock.height,this.lowerBlock.x,this.lowerBlock.y,this.lowerBlock.width,this.lowerBlock.height),t.drawImage(this.img,432,588-this.upperBlock.height,this.upperBlock.width,this.upperBlock.height,this.upperBlock.x,this.upperBlock.y,this.upperBlock.width,this.upperBlock.height),this}};var n=class{constructor(){this.renderFrame=0,this.y=s.bird.startY,this.x=s.bird.startX,this.height=s.bird.height,this.width=s.bird.width,this.fallingSpeed=s.bird.fallingSpeed,this.jumpSpeed=s.bird.jumpSpeed,this.jumpLength=s.bird.jumpLength,this.color=s.bird.color,this.jump=new Array(this.jumpLength).fill(-this.jumpSpeed),this.jump.push(0),this.img=new Image,this.img.src=s.img,this.birdOnImg=[51,36]}render(t){return this.renderFrame++,t.drawImage(this.img,432,Math.floor(this.renderFrame%9/3)*this.birdOnImg[1],...this.birdOnImg,this.x,this.y,this.height,this.width),this}};var a=class{constructor(t){this.canvas=t,this.ctx=this.canvas.getContext("2d"),this.birdJump=!1,this.img=new Image,this.img.src=s.img}startNewGame(){return this.bird=new n,this.blocks=[new o],this.currentState=this.bird.jump.length-1,this.score=0,this.tick=0,this}gameIsOver(){if(this.bird.y+this.bird.height>=s.world.height)return!0;if(this.bird.y<=0)return!0;for(let t=0;t<this.blocks.length;++t)if(this.blocks[t].collision(this.bird))return!0;return!1}performAction(t){t&&(this.currentState=0)}moveBlocks(){this.spawnBlock(),this.blocks=this.blocks.filter(t=>{const e=t.upperBlock.x>=-s.block.width;return e||this.score++,e}).map(t=>t.shiftBlocks(s.world.shift))}spawnBlock(){this.blocks[0].lowerBlock.x<=s.world.nextBlockX+r(s.world.widthRandomness)&&this.blocks.length<2&&this.blocks.push(new o)}moveBird(){this.bird.y+=this.bird.jump[this.currentState],this.bird.y+=this.bird.fallingSpeed,this.birdJump=this.currentState!==this.bird.jump.length-1,this.currentState=Math.min(this.bird.jump.length-1,this.currentState+1)}getFrame(){this.moveBird(),this.moveBlocks();const t=this.gameIsOver();return this.tick++,{bird:this.bird,blocks:this.blocks,gameIsOver:t,score:this.score,birdJump:this.birdJump}}renderFrame(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.drawImage(this.img,0,0,this.canvas.width,this.canvas.height+350,-this.tick/s.world.refreshRate*50%this.canvas.width+this.canvas.width,0,this.canvas.width,this.canvas.height),this.ctx.drawImage(this.img,0,0,this.canvas.width,this.canvas.height+350,-this.tick/s.world.refreshRate*50%this.canvas.width+1,0,this.canvas.width,this.canvas.height),this.bird.render(this.ctx),this.blocks.map(t=>t.render(this.ctx))}};var c=class{constructor(t){this.inputShapeLength=3,this.history=[],this.stateIndex=0,this.losses=[],this.explorationRate=s.agent.explorationRate,this.saveStates=s.agent.saveStates,this.rewards=s.agent.rewards,this.batch=s.agent.batch,this.epochs=s.agent.epochs,this.numberOfEpisodesBeforeRetrain=s.agent.numberOfEpisodesBeforeRetrain,this.initModel()}initModel(){this.model=tf.sequential(),this.model.add(tf.layers.dense({units:4,inputShape:[this.inputShapeLength]})),this.model.add(tf.layers.dense({units:2})),this.model.compile({loss:"meanSquaredError",optimizer:tf.train.adam(s.agent.learningRate)})}modelPredict(t){const e=this.model.predict(tf.tensor2d(t,[1,this.inputShapeLength]));return{action:e.argMax(1).dataSync()[0],predictedReward:e.max(1).dataSync()[0]}}async retrainModel(t){if(this.history.length>=this.saveStates&&(this.history=this.history.slice(Math.floor(this.history.length/2))),t%this.numberOfEpisodesBeforeRetrain!=0)return;let e=[],i=[];for(let t=Math.min(this.batch,this.history.length-1);t>=0;--t){const s=this.history[this.history.length-1-t];e.push(s.state);let r=[0,0];r[s.action]=s.reward,i.push(r)}e=tf.tensor2d(e,[e.length,this.inputShapeLength]),i=tf.tensor2d(i,[i.length,2]);const s=await this.model.fit(e,i,{epochs:this.epochs});this.losses.push(Math.round(s.history.loss[0]))}calculateReward(t){const e=this.formModelInputs(t.bird,t.blocks);return e[0]<e[2]&&e[1]>e[2]?100:-100}formModelInputs(t,e){let i;for(let s of e)if(s.lowerBlock.x+s.lowerBlock.width>=t.x){i=s;break}return[i.upperBlock.y+i.upperBlock.height,i.lowerBlock.y,t.y]}act(t){this.stateIndex++;const{bird:e,blocks:i,gameIsOver:s}=t,r=this.calculateReward(t),h=this.formModelInputs(e,i),{action:o,predictedReward:n}=this.getActionReward(h,t.score);return this.updatePrevState(s,r,h),s||this.history.push({state:h,predictedReward:n,action:o,reward:-1,gameIsOver:-1,nextState:-1}),o}getActionReward(t,e){return e<=10&&Math.random()<=this.explorationRate?{action:r(2),predictedReward:-1}:this.modelPredict(t)}updatePrevState(t,e,i){if(!this.history.length)return;let s=this.history.length-1;this.history[s].reward=e,this.history[s].nextState=i,this.history[s].gameIsOver=t}};var l=class{constructor(){this.information=document.getElementById("information"),this.lossInfo=document.getElementById("losses"),this.ctx=document.getElementById("losses-chart").getContext("2d"),this.chart=this.setupLossesChart()}setupLossesChart(){return new Chart(this.ctx,{type:"line",data:{datasets:[{label:"Last 10 losses",data:[],fill:!1,borderColor:"rgb(75, 192, 192)"}]},options:{responsive:!0,maintainAspectRatio:!1},yAxes:[{ticks:{beginAtZero:!0}}]})}renderInformation(t,e){const i=t.length,s=t.reduce((t,e)=>t+e,0),r=s/i;this.information.innerHTML=`\n                        <span>Avg Episode Length: ${r}</span>\n                        <span>Number of episodes: ${i}</span>\n                        <span>Current state: ${s}</span>\n                        <span>Exploration rate: ${e}</span>`}renderLosses(t){this.lossInfo.innerHTML="";const e=document.createElement("div");t.map(t=>{const i=document.createElement("span");i.innerHTML=`Loss: ${t}`,e.appendChild(i)}),this.lossInfo.appendChild(e),this.lossInfo.scrollTop=this.lossInfo.scrollHeight,this.chart.data.datasets[0].data=t.slice(-10),this.chart.data.labels=[...Array(10).keys()],this.chart.update()}renderScore(t){document.getElementById("score").innerHTML=`Score: ${t}`}};const d=new class{constructor(){this.info=new l,this.canvas=document.getElementById("entry-point"),this.game=new a(this.canvas),this.agent=new c(s.agent.saveStates),this.episodes=[],this.playGame=!0,this.scores=[],this.refreshRate=s.world.refreshRate}async playOneEpisode(t){for(this.game.startNewGame();;){const e=this.game.getFrame();this.game.renderFrame();const{score:i,gameIsOver:s,birdJump:r}=e;let h;if(this.info.renderScore(i),r||(h=this.agent.act(e),this.game.performAction(h)),s){this.episodes.push(this.game.tick),this.scores.push(i);break}t&&await new Promise((t,e)=>setTimeout(t,this.refreshRate))}}async graphicMode(t){await this.playOneEpisode(t),await this.agent.retrainModel(this.episodes.length),this.info.renderLosses(this.agent.losses),this.info.renderInformation(this.episodes,this.agent.explorationRate)}};let p=0,u=!0;(async t=>{for(;t.playGame;)u=!(p>0),await t.graphicMode(u),p--})(d),document.addEventListener("keypress",t=>{32===t.keyCode&&d.game.performAction(1)}),document.addEventListener("keyup",t=>{27===t.keyCode&&gg}),document.getElementById("buttons").addEventListener("click",t=>{switch(t.target.id){case"buttonskip-1":p=5;break;case"buttonskip-2":p=10;break;case"buttonskip-3":p=20}})}]);