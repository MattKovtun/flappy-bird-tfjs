!function(t){var e={};function i(r){if(e[r])return e[r].exports;var s=e[r]={i:r,l:!1,exports:{}};return t[r].call(s.exports,s,s.exports,i),s.l=!0,s.exports}i.m=t,i.c=e,i.d=function(t,e,r){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)i.d(r,s,function(e){return t[e]}.bind(null,s));return r},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";i.r(e);var r={world:{height:400,width:400,speed:10,blocksFrequency:200},bird:{width:15,height:15,color:"red",jumpSpeed:7,fallingSpeed:3,jumpLength:25},block:{width:85,height:105,color:"green"},agent:{retrainEpisodes:200}};var s=class{constructor(){this.upperHeight=r.block.height,this.lowerHeight=r.block.height,this.x=320,this.y=r.world.height-this.lowerHeight,this.width=r.block.width}collision(t){return t.y<=this.upperHeight&&t.x>=this.x&&t.x<=this.x+this.width||t.y>=r.world.height-this.lowerHeight&&t.x>=this.x&&t.x<=this.x+this.width}render(t){return t.beginPath(),t.fillStyle=r.block.color,t.fillRect(this.x,0,this.width,this.upperHeight),t.fillRect(this.x,this.y,this.width,this.lowerHeight),this}};var h=class{constructor(){this.y=200,this.x=35,this.jump=new Array(r.bird.jumpLength).fill(-r.bird.jumpSpeed);for(let t=0;t<10;++t)this.jump.push(-r.bird.fallingSpeed);this.jump.push(0)}render(t){return t.beginPath(),t.fillStyle=r.bird.color,t.arc(this.x,this.y,r.bird.height,0,2*Math.PI),t.fill(),this}};var o=class{constructor(t,e){this.ctx=e,this.canvas=t}startNewGame(){this.bird=(new h).render(this.ctx),this.blocks=[(new s).render(this.ctx)],this.current_state=this.bird.jump.length-1,this.ticks=1}gameIsOver(){if(this.bird.y>=r.world.height)return!0;if(this.bird.y<=0)return!0;for(let t=0;t<this.blocks.length;++t)if(this.blocks[t].collision(this.bird))return!0;return!1}performAction(t){t&&(this.current_state=0)}moveBlocks(){this.ticks%r.world.blocksFrequency==0&&this.blocks.push(new s),this.blocks.filter(t=>t.x>=0-r.block.width).map(t=>{t.render(this.ctx),t.x--})}moveBird(){this.bird.render(this.ctx),this.bird.y+=this.bird.jump[this.current_state],this.bird.y+=r.bird.fallingSpeed,this.current_state=Math.min(this.bird.jump.length-1,this.current_state+1)}nextFrame(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.moveBird(),this.moveBlocks(),this.ticks++;const t=this.gameIsOver();return{bird:this.bird,blocks:this.blocks,gameIsOver:t,ticks:this.ticks}}};const n=(t,e)=>Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2));var l=class{constructor(){this.initModel(),this.history=[],this.retrainEpisodes=r.agent.retrainEpisodes,this.episode=1}initModel(){this.model=tf.sequential(),this.model.add(tf.layers.dense({units:2,inputShape:[2]})),this.model.compile({loss:(t,e)=>t.sub(e).square().mean(),optimizer:"sgd"})}modelPredict(t){return this.model.predict(t)}async retrainModel(){let t=[],e=[];for(let i=0;i<this.history.length;++i){const r=this.history[i];t.push([r[0],r[1]]),e.push([r[3],r[3]])}t=tf.tensor2d(t,[this.history.length,2]),e=tf.tensor2d(e,[this.history.length,2]);const i=await this.model.fit(t,e);console.log("Loss after Epoch  : "+i.history.loss[0])}formatInputs(t,e){return tf.tensor2d([t,e],[1,2])}act(t){this.episode++;const{bird:e,blocks:i,ticks:s,gameIsOver:h}=t;let o=s;h&&(o=-1e3);const l=n(e,i[0]),c=n(e,{x:e.x,y:r.world.height}),d=this.formatInputs(l,c),a=this.modelPredict(d),u=a.argMax(1).dataSync()[0],p=a.max(1).dataSync()[0];return this.history.push([l,c,p,o]),this.episode%this.retrainEpisodes==0&&this.retrainModel(),u}};const c=document.getElementById("entry-point"),d=new o(c,c.getContext("2d")),a=new l;d.startNewGame(),setInterval(()=>{const t=d.nextFrame.bind(d)(),e=a.act(t);d.performAction(e),t.gameIsOver&&d.startNewGame()},r.world.speed),document.body.addEventListener("keypress",t=>{32===t.charCode&&d.performAction(!0),0===t.charCode&&d.startNewGame()})}]);