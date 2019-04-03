!function(t){var e={};function s(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=t,s.c=e,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)s.d(i,r,function(e){return t[e]}.bind(null,r));return i},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=0)}([function(t,e,s){"use strict";s.r(e);var i={world:{height:400,width:400,speed:5,blocksFrequency:200},bird:{width:15,height:15,color:"red",jumpSpeed:7,fallingSpeed:3,jumpLength:25},block:{width:85,height:105,color:"green"},agent:{retrainEpisodes:10,saveStates:4e3,explorationRate:.001,explorationRateDecay:.35}};var r=class{constructor(){this.upperHeight=i.block.height,this.lowerHeight=i.block.height,this.x=320,this.y=0,this.width=i.block.width,this.height=i.block.height}collision(t){return!!this.collide(t,this)||!!this.collide(t,{x:this.x,y:i.world.height-this.height,width:this.width,height:this.height})}collide(t,e){return t.y>=e.y&&t.y<=e.y+e.height&&t.x>=e.x&&t.x<=e.x+e.width}render(t){return t.beginPath(),t.fillStyle=i.block.color,t.fillRect(this.x,this.y,this.width,this.upperHeight),t.fillRect(this.x,i.world.height-this.lowerHeight,this.width,this.lowerHeight),this}};var o=class{constructor(){this.y=200,this.x=35,this.jump=new Array(i.bird.jumpLength).fill(-i.bird.jumpSpeed);for(let t=0;t<10;++t)this.jump.push(-i.bird.fallingSpeed);this.jump.push(0)}render(t){return t.beginPath(),t.fillStyle=i.bird.color,t.arc(this.x,this.y,i.bird.height,0,2*Math.PI),t.fill(),this}};var n=class{constructor(t,e){this.ctx=e,this.canvas=t,this.score=0}startNewGame(){return this.bird=(new o).render(this.ctx),this.blocks=[(new r).render(this.ctx)],this.currentState=this.bird.jump.length-1,this.ticks=1,this.score=0,this}gameIsOver(){if(this.bird.y>=i.world.height)return!0;if(this.bird.y<=0)return!0;for(let t=0;t<this.blocks.length;++t)if(this.blocks[t].collision(this.bird))return!0;return!1}performAction(t){t&&(this.currentState=0)}moveBlocks(){this.ticks%i.world.blocksFrequency==0&&this.blocks.push(new r),this.blocks=this.blocks.filter(t=>{const e=t.x>=0-i.block.width;return e||this.score++,e}).map(t=>(t.x--,t))}moveBird(){this.bird.y+=this.bird.jump[this.currentState],this.bird.y+=i.bird.fallingSpeed,this.currentState=Math.min(this.bird.jump.length-1,this.currentState+1)}getFrame(){this.moveBird(),this.moveBlocks(),this.ticks++;const t=this.gameIsOver();return{bird:this.bird,blocks:this.blocks,gameIsOver:t,ticks:this.ticks,score:this.score}}renderFrame(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.bird.render(this.ctx),this.blocks.map(t=>t.render(this.ctx))}};const h=t=>Math.floor(Math.random()*Math.floor(t)),a=(t,e)=>Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)),d=(t,e)=>{e.innerHTML="";const s=document.createElement("div");t.map(t=>{const e=document.createElement("span");e.innerHTML=`Loss: ${t}`,s.appendChild(e)}),e.appendChild(s),e.scrollTop=e.scrollHeight},l=(t,e,s)=>{const i=t.length,r=t.reduce((t,e)=>t+e,0),o=r/i;s.innerHTML=`\n                    <span>Avg Episode Length: ${o}</span>\n                    <span>Number of episodes: ${i}</span>\n                    <span>Current state: ${r}</span>\n                    <span>Exploration rate: ${e}</span>`},c=(t,e)=>e.innerHTML=`Score: ${t}`;var u=class{constructor(t){this.initModel(),this.history=[],this.saveStates=t,this.state=0,this.losses=[],this.explorationRate=i.agent.explorationRate,this.rewards=[100,-500]}initModel(){this.model=tf.sequential(),this.model.add(tf.layers.dense({units:4,inputShape:[2]})),this.model.add(tf.layers.dense({units:2})),this.model.compile({loss:"meanSquaredError",optimizer:tf.train.adam()})}modelPredict(t){return this.model.predict(t)}async retrainModel(){this.history.length>=2*this.saveStates&&(this.history=this.history.slice(this.history.length-this.saveStates));let t=[],e=[];for(let s=0;s<this.history.length;++s){const i=this.history[s];t.push([i.xOne,i.xTwo]);let r=[i.reward,i.reward];r[i.action]=i.reward,e.push(r)}t=tf.tensor2d(t,[this.history.length,2]),e=tf.tensor2d(e,[this.history.length,2]);const s=await this.model.fit(t,e,{epochs:2});this.losses.push(s.history.loss[0])}calculateReward(t){let e=this.rewards[0];return t&&(e=this.rewards[1]),e}formModelInputs(t,e){return[a(t,e[0]),a(t,{x:t.x,y:i.world.height})]}act(t){this.state++;const{bird:e,blocks:s,ticks:i,gameIsOver:r}=t,o=this.calculateReward(r),n=this.formModelInputs(e,s),{action:h,predictedReward:a}=this.getActionReward(n);return this.history.push({xOne:n[0],xTwo:n[1],predictedReward:a,reward:-1,action:h}),this.updateRewards(r,o,i),h}getActionReward(t){let e,s;if(this.randomMove())e=h(2),s=100;else{const i=this.modelPredict(tf.tensor2d(t,[1,2]));e=i.argMax(1).dataSync()[0],s=i.max(1).dataSync()[0]}return{action:e,predictedReward:s}}randomMove(){return Math.random()<=this.explorationRate}updateRewards(t,e,s){if(this.state>1&&(this.history[this.history.length-1].reward=e),t)for(let t=1;t<=s-2;++t)if(this.history[this.history.length-t].action){this.history[t].reward=e;break}}};const p=new class{constructor(){this.canvas=document.getElementById("entry-point"),this.ctx=this.canvas.getContext("2d"),this.game=new n(this.canvas,this.ctx).startNewGame(),this.agent=new u(i.agent.saveStates),this.movementIndicator=document.getElementById("action"),this.lossInfo=document.getElementById("losses"),this.information=document.getElementById("information"),this.scoreInfo=document.getElementById("score"),this.episodes=[],this.playGame=!0,this.mode=1}async graphicMode(){const t=this.game.getFrame();this.game.renderFrame();const e=this.agent.act(t),{score:s,gameIsOver:r,ticks:o}=t;this.game.performAction(e),r&&(this.episodes.push(o),this.game.startNewGame(),this.episodes.length%i.agent.retrainEpisodes==0&&await this.agent.retrainModel()),this.renderWorldVerbose(s,e,r),await new Promise((t,e)=>setTimeout(t,i.world.speed))}renderWorldVerbose(t,e,s){this.movementIndicator.classList=e?["arrow arrow_up"]:["arrow arrow_down"],s&&this.episodes.length%i.agent.retrainEpisodes==0&&(d(this.agent.losses,this.lossInfo),l(this.episodes,this.agent.explorationRate,this.information)),c(t,this.scoreInfo)}};(async t=>{for(;t.playGame;)await t.graphicMode(t.mode)})(p),document.addEventListener("keypress",t=>{32==t.keyCode&&p.game.performAction(1)})}]);