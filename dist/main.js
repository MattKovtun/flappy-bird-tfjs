!function(t){var e={};function i(s){if(e[s])return e[s].exports;var r=e[s]={i:s,l:!1,exports:{}};return t[s].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(s,r,function(e){return t[e]}.bind(null,r));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";i.r(e);var s={world:{height:400,width:400,refreshRate:10,blocksFrequency:200,shift:2,heightRandomness:50,widthRandomness:30,nextBlockX:125},bird:{width:20,height:20,color:"red",jumpSpeed:11,fallingSpeed:3,jumpLength:10},block:{width:85,height:170,color:"green",blockInitialX:320,blockInitialY:0},agent:{saveStates:2500,explorationRate:.001,explorationRateDecay:.35,batch:2e3,learningRate:.1,numberOfEpisodesBeforeRetrain:100,rewards:{alive:10,dead:-300}}};const r=t=>Math.floor(Math.random()*Math.floor(t)),o=(t,e)=>Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)),n=(t,e)=>t.y>=e.y&&t.y<=e.y+e.height&&t.x>=e.x&&t.x<=e.x+e.width,h=(t,e)=>{e.innerHTML="";const i=document.createElement("div");t.map(t=>{const e=document.createElement("span");e.innerHTML=`Loss: ${t}`,i.appendChild(e)}),e.appendChild(i),e.scrollTop=e.scrollHeight},a=(t,e,i)=>{const s=t.length,r=t.reduce((t,e)=>t+e,0),o=r/s;i.innerHTML=`\n                    <span>Avg Episode Length: ${o}</span>\n                    <span>Number of episodes: ${s}</span>\n                    <span>Current state: ${r}</span>\n                    <span>Exploration rate: ${e}</span>`},l=(t,e)=>e.innerHTML=`Score: ${t}`;var c=class{constructor(){const t=r(s.world.heightRandomness)-.5*s.world.heightRandomness;this.upperBlock={height:s.block.height-t,width:s.block.width,x:s.block.blockInitialX,y:s.block.blockInitialY},this.lowerBlock={y:s.world.height-s.block.height-t,height:s.block.height+t,width:s.block.width,x:s.block.blockInitialX}}collision(t){return n(t,this.upperBlock)||n(t,this.lowerBlock)||n(this.lowerBlock,t)||n(this.upperBlock,t)}shiftBlocks(t){return this.lowerBlock.x-=t,this.upperBlock.x-=t,this}render(t){return t.beginPath(),t.fillStyle=s.block.color,t.fillRect(this.upperBlock.x,this.upperBlock.y,this.upperBlock.width,this.upperBlock.height),t.fillRect(this.lowerBlock.x,this.lowerBlock.y,this.lowerBlock.width,this.lowerBlock.height),this}};var d=class{constructor(){this.y=200,this.x=35,this.height=s.bird.height,this.width=s.bird.width,this.fallingSpeed=s.bird.fallingSpeed,this.jumpSpeed=s.bird.jumpSpeed,this.jumpLength=s.bird.jumpLength,this.color=s.bird.color,this.jump=new Array(this.jumpLength).fill(-this.jumpSpeed),this.jump.push(0),this.drawing=new Image,this.drawing.src="92c6p4k4ky311.png"}render(t){return t.beginPath(),t.fillStyle=this.color,t.arc(this.x,this.y,this.height/2,0,2*Math.PI),t.fill(),this}};var u=class{constructor(t,e){this.ctx=e,this.canvas=t,this.score=0,this.birdJump=!1}startNewGame(){return this.bird=(new d).render(this.ctx),this.blocks=[(new c).render(this.ctx)],this.currentState=this.bird.jump.length-1,this.score=0,this}gameIsOver(){if(this.bird.y+this.bird.height>=s.world.height)return!0;if(this.bird.y<=0)return!0;for(let t=0;t<this.blocks.length;++t)if(this.blocks[t].collision(this.bird))return!0;return!1}performAction(t){t&&(this.currentState=0)}moveBlocks(){this.spawnBlock(),this.blocks=this.blocks.filter(t=>{const e=t.upperBlock.x>=-s.block.width;return e||this.score++,e}).map(t=>t.shiftBlocks(s.world.shift))}spawnBlock(){this.blocks[0].lowerBlock.x<=s.world.nextBlockX+r(s.world.widthRandomness)&&this.blocks.length<2&&this.blocks.push(new c)}moveBird(){this.bird.y+=this.bird.jump[this.currentState],this.bird.y+=this.bird.fallingSpeed,this.currentState=Math.min(this.bird.jump.length-1,this.currentState+1),this.birdJump=this.currentState!==this.bird.jump.length-1}getFrame(){this.moveBird(),this.moveBlocks();const t=this.gameIsOver();return{bird:this.bird,blocks:this.blocks,gameIsOver:t,score:this.score,birdJump:this.birdJump}}renderFrame(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.bird.render(this.ctx),this.blocks.map(t=>t.render(this.ctx))}};var p=class{constructor(t){this.initModel(),this.history=[],this.saveStates=t,this.state=0,this.losses=[],this.explorationRate=s.agent.explorationRate,this.rewards=s.agent.rewards,this.batch=s.agent.batch}initModel(){this.model=tf.sequential(),this.model.add(tf.layers.dense({units:4,inputShape:[2]})),this.model.add(tf.layers.dense({units:4})),this.model.add(tf.layers.dense({units:2})),this.model.compile({loss:"meanSquaredError",optimizer:tf.train.adam(s.agent.learningRate)})}modelPredict(t){const e=this.model.predict(tf.tensor2d(t,[1,2]));return{action:e.argMax(1).dataSync()[0],predictedReward:e.max(1).dataSync()[0]}}async retrainModel(){this.history.length>=2*this.saveStates&&(this.history=this.history.slice(this.history.length-this.saveStates));let t=[],e=[];for(let i=Math.min(this.batch,this.history.length-1);i>=0;--i){const s=this.history[this.history.length-1-i];t.push(s.state);let r=[0,0];r[s.action]=s.reward,e.push(r)}t=tf.tensor2d(t,[t.length,2]),e=tf.tensor2d(e,[e.length,2]);const i=await this.model.fit(t,e,{epochs:1});this.losses.push(i.history.loss[0])}calculateReward(t){let e=this.rewards.alive;return t&&(e=this.rewards.dead),e}formModelInputs(t,e){let i;for(let s of e)if(s.lowerBlock.x+s.lowerBlock.width>=t.x){i=s;break}return[t.y-i.lowerBlock.y,o(t,{x:i.lowerBlock.x+i.lowerBlock.width,y:t.y})]}act(t){this.state++;const{bird:e,blocks:i,gameIsOver:s}=t,r=this.calculateReward(s),o=this.formModelInputs(e,i),n=o,{action:h,predictedReward:a}=this.getActionReward(o);return s||this.history.push({state:n,predictedReward:a,action:h,reward:-1,gameIsOver:-1,nextState:-1}),this.updatePrevState(s,r,n),h}getActionReward(t){return this.randomMove()?{action:r(2),predictedReward:-1}:this.modelPredict(t)}randomMove(){return Math.random()<=this.explorationRate}updatePrevState(t,e,i){if(this.state<=1)return;let s=this.history.length-2;t&&(s=this.history.length-1),this.history[s].reward=e,this.history[s].nextState=i,this.history[s].gameIsOver=t}};const m=new class{constructor(){this.canvas=document.getElementById("entry-point"),this.ctx=this.canvas.getContext("2d"),this.game=new u(this.canvas,this.ctx).startNewGame(),this.agent=new p(s.agent.saveStates),this.movementIndicator=document.getElementById("action"),this.lossInfo=document.getElementById("losses"),this.information=document.getElementById("information"),this.scoreInfo=document.getElementById("score"),this.episodes=[],this.playGame=!0,this.scores=[],this.refreshRate=s.world.refreshRate}async graphicMode(){const t=this.game.getFrame();this.game.renderFrame();const{score:e,gameIsOver:i,birdJump:s}=t;i&&this.game.startNewGame(),this.agent.state>this.agent.numberOfEpisodesBeforeRetrain&&i&&await this.agent.retrainModel(),this.renderWorldVerbose(e,0,i),await new Promise((t,e)=>setTimeout(t,this.refreshRate))}renderWorldVerbose(t,e,i){this.movementIndicator.classList=e?["arrow arrow_up"]:["arrow arrow_down"],i&&(h(this.agent.losses,this.lossInfo),a(this.episodes,this.agent.explorationRate,this.information),this.scores.push(t)),l(t,this.scoreInfo)}};(async t=>{for(;t.playGame;)await t.graphicMode(t.mode)})(m),document.addEventListener("keypress",t=>{32===t.keyCode&&m.game.performAction(1)})}]);