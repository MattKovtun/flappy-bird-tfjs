!function(t){var e={};function i(s){if(e[s])return e[s].exports;var r=e[s]={i:s,l:!1,exports:{}};return t[s].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(s,r,function(e){return t[e]}.bind(null,r));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";i.r(e);var s={world:{height:400,width:400,refreshRate:13,blocksFrequency:200,shift:3,heightRandomness:50,widthRandomness:30,nextBlockX:125},bird:{width:20,height:20,jumpSpeed:11,fallingSpeed:3,jumpLength:8,startX:35,startY:200},block:{width:78,height:140,blockInitialX:320,blockInitialY:0},agent:{saveStates:100,explorationRate:.01,explorationRateDecay:.35,batch:2e3,learningRate:.1,numberOfEpisodesBeforeRetrain:10,rewards:{alive:10,dead:-300}},img:"https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png"};const r=document.getElementById("action"),h=document.getElementById("losses"),o=document.getElementById("information"),n=document.getElementById("score"),a=t=>Math.floor(Math.random()*Math.floor(t)),l=(t,e)=>t.x+t.width>=e.x&&t.x+t.width<=e.x+e.width&&(t.y+t.height>=e.y&&t.y+t.height<=e.y+e.height||t.y>=e.y&&t.y<=e.y+e.height),d=(t,e,i,s,a,l)=>{r.classList=e?["arrow arrow_up"]:["arrow arrow_down"],i&&(((t,e)=>{e.innerHTML="";const i=document.createElement("div");t.map(t=>{const e=document.createElement("span");e.innerHTML=`Loss: ${t}`,i.appendChild(e)}),e.appendChild(i),e.scrollTop=e.scrollHeight})(a,h),((t,e,i)=>{const s=t.length,r=t.reduce((t,e)=>t+e,0),h=r/s;i.innerHTML=`\n                    <span>Avg Episode Length: ${h}</span>\n                    <span>Number of episodes: ${s}</span>\n                    <span>Current state: ${r}</span>\n                    <span>Exploration rate: ${e}</span>`})(l,s,o)),((t,e)=>e.innerHTML=`Score: ${t}`)(t,n)};var c=class{constructor(){this.img=new Image,this.img.src=s.img;const t=a(s.world.heightRandomness)-.5*s.world.heightRandomness;this.upperBlock={height:s.block.height-t,width:s.block.width,x:s.block.blockInitialX,y:s.block.blockInitialY},this.lowerBlock={y:s.world.height-s.block.height-t,height:s.block.height+t,width:s.block.width,x:s.block.blockInitialX}}collision(t){return l(t,this.upperBlock)||l(t,this.lowerBlock)}shiftBlocks(t){return this.lowerBlock.x-=t,this.upperBlock.x-=t,this}render(t){return t.beginPath(),t.drawImage(this.img,432+this.lowerBlock.width,108,this.lowerBlock.width,this.lowerBlock.height,this.lowerBlock.x,this.lowerBlock.y,this.lowerBlock.width,this.lowerBlock.height),t.drawImage(this.img,432,588-this.upperBlock.height,this.upperBlock.width,this.upperBlock.height,this.upperBlock.x,this.upperBlock.y,this.upperBlock.width,this.upperBlock.height),this}};var p=class{constructor(){this.renderFrame=0,this.y=s.bird.startY,this.x=s.bird.startX,this.height=s.bird.height,this.width=s.bird.width,this.fallingSpeed=s.bird.fallingSpeed,this.jumpSpeed=s.bird.jumpSpeed,this.jumpLength=s.bird.jumpLength,this.color=s.bird.color,this.jump=new Array(this.jumpLength).fill(-this.jumpSpeed),this.jump.push(0),this.img=new Image,this.img.src=s.img,this.birdOnImg=[51,36]}render(t){return this.renderFrame++,t.drawImage(this.img,432,Math.floor(this.renderFrame%9/3)*this.birdOnImg[1],...this.birdOnImg,this.x,this.y,this.height,this.width),this}};var u=class{constructor(t,e){this.ctx=e,this.canvas=t,this.birdJump=!1}startNewGame(){return this.bird=(new p).render(this.ctx),this.blocks=[(new c).render(this.ctx)],this.currentState=this.bird.jump.length-1,this.score=0,this.tick=0,this}gameIsOver(){if(this.bird.y+this.bird.height>=s.world.height)return!0;if(this.bird.y<=0)return!0;for(let t=0;t<this.blocks.length;++t)if(this.blocks[t].collision(this.bird))return!0;return!1}performAction(t){t&&(this.currentState=0)}moveBlocks(){this.spawnBlock(),this.blocks=this.blocks.filter(t=>{const e=t.upperBlock.x>=-s.block.width;return e||this.score++,e}).map(t=>t.shiftBlocks(s.world.shift))}spawnBlock(){this.blocks[0].lowerBlock.x<=s.world.nextBlockX+a(s.world.widthRandomness)&&this.blocks.length<2&&this.blocks.push(new c)}moveBird(){this.bird.y+=this.bird.jump[this.currentState],this.bird.y+=this.bird.fallingSpeed,this.birdJump=this.currentState!==this.bird.jump.length-1,this.currentState=Math.min(this.bird.jump.length-1,this.currentState+1)}getFrame(){this.moveBird(),this.moveBlocks();const t=this.gameIsOver();return this.tick++,{bird:this.bird,blocks:this.blocks,gameIsOver:t,score:this.score,birdJump:this.birdJump}}renderFrame(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.bird.render(this.ctx),this.blocks.map(t=>t.render(this.ctx))}};var m=class{constructor(t){this.initModel(),this.history=[],this.stateIndex=0,this.losses=[],this.explorationRate=s.agent.explorationRate,this.saveStates=s.agent.saveStates,this.rewards=s.agent.rewards,this.batch=s.agent.batch,this.numberOfEpisodesBeforeRetrain=s.agent.numberOfEpisodesBeforeRetrain}initModel(){this.model=tf.sequential(),this.model.add(tf.layers.dense({units:4,inputShape:[2]})),this.model.add(tf.layers.dense({units:2})),this.model.compile({loss:"meanSquaredError",optimizer:tf.train.adam(s.agent.learningRate)})}modelPredict(t){const e=this.model.predict(tf.tensor2d(t,[1,2]));return{action:e.argMax(1).dataSync()[0],predictedReward:e.max(1).dataSync()[0]}}async retrainModel(){this.history.length>=2*this.saveStates&&(this.history=this.history.slice(this.history.length-this.saveStates));let t=[],e=[];for(let i=Math.min(this.batch,this.history.length-1);i>=0;--i){const s=this.history[this.history.length-1-i];t.push(s.state);let r=[0,0];r[s.action]=s.reward,e.push(r)}t=tf.tensor2d(t,[t.length,2]),e=tf.tensor2d(e,[e.length,2]);const i=await this.model.fit(t,e,{epochs:1});console.log("Loss after Epoch  : "+i.history.loss[0]),this.losses.push(i.history.loss[0])}calculateReward(t){let e=this.rewards.alive;return t&&(e=this.rewards.dead),e}formModelInputs(t,e){let i;for(let s of e)if(s.lowerBlock.x+s.lowerBlock.width>=t.x){i=s;break}return[t.y-i.lowerBlock.y,i.lowerBlock.x+i.lowerBlock.width-t.x]}act(t){this.stateIndex++;const{bird:e,blocks:i,gameIsOver:s}=t,r=this.calculateReward(s),h=this.formModelInputs(e,i),{action:o,predictedReward:n}=this.getActionReward(h);return this.updatePrevState(s,r,h),s||this.history.push({state:h,predictedReward:n,action:o,reward:-1,gameIsOver:-1,nextState:-1}),o}getActionReward(t){return this.randomMove()?{action:a(2),predictedReward:-1}:this.modelPredict(t)}randomMove(){return Math.random()<=this.explorationRate}updatePrevState(t,e,i){if(!this.history.length)return;let s=this.history.length-1;this.history[s].reward=e,this.history[s].nextState=i,this.history[s].gameIsOver=t}};const g=new class{constructor(){this.canvas=document.getElementById("entry-point"),this.ctx=this.canvas.getContext("2d"),this.game=new u(this.canvas,this.ctx).startNewGame(),this.agent=new m(s.agent.saveStates),this.episodes=[],this.playGame=!0,this.scores=[],this.refreshRate=s.world.refreshRate}async graphicMode(){const t=this.game.getFrame();this.game.renderFrame();const{score:e,gameIsOver:i,birdJump:s}=t;let r=0;s||(r=this.agent.act(t),this.game.performAction(r)),i&&(this.episodes.push(this.game.tick),this.game.startNewGame(),this.scores.push(e)),this.agent.history.length>this.agent.numberOfEpisodesBeforeRetrain&&i&&(console.log("Retraining"),await this.agent.retrainModel()),await new Promise((t,e)=>setTimeout(t,this.refreshRate)),d(e,r,i,this.agent.explorationRate,this.agent.losses,this.episodes)}};(async t=>{for(;t.playGame;)await t.graphicMode(t.mode)})(g),document.addEventListener("keypress",t=>{32===t.keyCode&&g.game.performAction(1)}),document.addEventListener("keyup",t=>{27===t.keyCode&&gg})}]);