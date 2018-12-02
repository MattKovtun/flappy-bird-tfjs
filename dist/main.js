!function(t){var e={};function s(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=t,s.c=e,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)s.d(i,r,function(e){return t[e]}.bind(null,r));return i},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=0)}([function(t,e,s){"use strict";s.r(e);var i={world:{height:400,width:400,speed:10,blocksFrequency:200},bird:{width:15,height:15,color:"red",jumpSpeed:7,fallingSpeed:3,jumpLength:25},block:{width:85,height:105,color:"green"},agent:{retrainEpisodes:8,saveStates:4e3}};var r=class{constructor(){this.upperHeight=i.block.height,this.lowerHeight=i.block.height,this.x=320,this.y=i.world.height-this.lowerHeight,this.width=i.block.width}collision(t){return t.y<=this.upperHeight&&t.x>=this.x&&t.x<=this.x+this.width||t.y>=i.world.height-this.lowerHeight&&t.x>=this.x&&t.x<=this.x+this.width}render(t){return t.beginPath(),t.fillStyle=i.block.color,t.fillRect(this.x,0,this.width,this.upperHeight),t.fillRect(this.x,this.y,this.width,this.lowerHeight),this}};var h=class{constructor(){this.y=200,this.x=35,this.jump=new Array(i.bird.jumpLength).fill(-i.bird.jumpSpeed);for(let t=0;t<10;++t)this.jump.push(-i.bird.fallingSpeed);this.jump.push(0)}render(t){return t.beginPath(),t.fillStyle=i.bird.color,t.arc(this.x,this.y,i.bird.height,0,2*Math.PI),t.fill(),this}};var o=class{constructor(t,e){this.ctx=e,this.canvas=t}startNewGame(){this.bird=(new h).render(this.ctx),this.blocks=[(new r).render(this.ctx)],this.current_state=this.bird.jump.length-1,this.ticks=1}gameIsOver(){if(this.bird.y>=i.world.height)return!0;if(this.bird.y<=0)return!0;for(let t=0;t<this.blocks.length;++t)if(this.blocks[t].collision(this.bird))return!0;return!1}performAction(t){t&&(this.current_state=0)}moveBlocks(){this.ticks%i.world.blocksFrequency==0&&this.blocks.push(new r),this.blocks.filter(t=>t.x>=0-i.block.width).map(t=>{t.render(this.ctx),t.x--})}moveBird(){this.bird.render(this.ctx),this.bird.y+=this.bird.jump[this.current_state],this.bird.y+=i.bird.fallingSpeed,this.current_state=Math.min(this.bird.jump.length-1,this.current_state+1)}nextFrame(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.moveBird(),this.moveBlocks(),this.ticks++;const t=this.gameIsOver();return{bird:this.bird,blocks:this.blocks,gameIsOver:t,ticks:this.ticks}}};const n=(t,e)=>Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2));var a=class{constructor(t){this.initModel(),this.history=[],this.saveStates=t,this.state=0,this.losses=[]}initModel(){this.model=tf.sequential(),this.model.add(tf.layers.dense({units:4,inputShape:[2]})),this.model.add(tf.layers.dense({units:2})),this.model.compile({loss:"meanSquaredError",optimizer:tf.train.adam()})}modelPredict(t){return this.model.predict(t)}async retrainModel(){this.history.length>=2*this.saveStates&&(this.history=this.history.slice(this.history.length-this.saveStates));let t=[],e=[];for(let s=0;s<this.history.length;++s){const i=this.history[s];t.push([i[0],i[1]]),e.push([i[3],i[3]])}t=tf.tensor2d(t,[this.history.length,2]),e=tf.tensor2d(e,[this.history.length,2]);const s=await this.model.fit(t,e);console.log("Loss after Epoch  : "+s.history.loss[0]),this.losses.push(s.history.loss[0])}calculateReward(t){let e=100;return t&&(e=-500),e}formModelInputs(t,e){return[n(t,e[0]),n(t,{x:t.x,y:i.world.height})]}act(t){this.state++;const{bird:e,blocks:s,ticks:i,gameIsOver:r}=t,h=this.calculateReward(r),o=this.formModelInputs(e,s),n=this.modelPredict(tf.tensor2d(o,[1,2])),a=n.argMax(1).dataSync()[0],l=n.max(1).dataSync()[0];return this.history.push([...o,l,h,a]),this.updateRewards(r,h),a}updateRewards(t,e){if(this.state>1&&(this.history[this.history.length-1][3]=e),t)for(let t=this.history.length-1;t>=0;--t)if(this.history[t][4]){this.history[t][3]=e;break}}};const l=document.getElementById("entry-point"),d=new o(l,l.getContext("2d")),c=new a(i.agent.saveStates),u=document.getElementById("action"),p=document.getElementById("losses"),m=document.getElementById("information");let g=[];d.startNewGame(),setInterval(async()=>{const t=d.nextFrame.bind(d)(),e=c.act(t);e?(u.classList.remove("arrow_down"),u.classList.add("arrow_up")):(u.classList.add("arrow_down"),u.classList.remove("arrow_up")),d.performAction(e),t.gameIsOver&&(g.push(t.ticks),d.startNewGame(),g.length%i.agent.retrainEpisodes==0&&(await c.retrainModel(),f(c.losses),y()))},i.world.speed),document.body.addEventListener("keypress",t=>{32===t.charCode&&d.performAction(!0),0===t.charCode&&d.startNewGame()});const f=t=>{let e="";t.map(t=>{e+=`<span>Loss: ${t}</span>`}),p.innerHTML=e,p.scrollTop=p.scrollHeight},y=()=>{const t=g.length,e=g.reduce((t,e)=>t+e,0),s=e/t;m.innerHTML=`\n                    <span>Avg Episode Length: ${s}</span>\n                    <span>Number of episodes: ${t}</span>\n                    <span>Current state: ${e}</span>`}}]);