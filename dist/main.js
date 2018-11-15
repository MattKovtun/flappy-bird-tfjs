!function(t){var e={};function i(r){if(e[r])return e[r].exports;var s=e[r]={i:r,l:!1,exports:{}};return t[r].call(s.exports,s,s.exports,i),s.l=!0,s.exports}i.m=t,i.c=e,i.d=function(t,e,r){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)i.d(r,s,function(e){return t[e]}.bind(null,s));return r},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";i.r(e);var r={world:{height:400,width:400,speed:10,blocksFrequency:200},bird:{width:15,height:15,color:"red",jumpSpeed:7,fallingSpeed:3,jumpLength:25},block:{width:85,height:105,color:"green"}};var s=class{constructor(){this.x=320,this.upperHeight=r.block.height,this.lowerHeight=r.block.height,this.width=r.block.width}collision(t){return t.y<=this.upperHeight&&t.x>=this.x&&t.x<=this.x+this.width||t.y>=r.world.height-this.lowerHeight&&t.x>=this.x&&t.x<=this.x+this.width}render(t){return t.beginPath(),t.fillStyle=r.block.color,t.fillRect(this.x,0,this.width,this.upperHeight),t.fillRect(this.x,r.world.height-this.lowerHeight,this.width,this.lowerHeight),this}};var h=class{constructor(){this.y=200,this.x=35,this.jump=new Array(r.bird.jumpLength).fill(-r.bird.jumpSpeed);for(let t=0;t<10;++t)this.jump.push(-r.bird.fallingSpeed);this.jump.push(0)}render(t){return t.beginPath(),t.fillStyle=r.bird.color,t.arc(this.x,this.y,r.bird.height,0,2*Math.PI),t.fill(),this}};var n=class{constructor(t,e){this.ctx=e,this.canvas=t}startNewGame(){this.bird=(new h).render(this.ctx),this.blocks=[(new s).render(this.ctx)],this.current_state=this.bird.jump.length-1,this.ticks=1}gameIsOver(){if(this.bird.y>=r.world.height)return!0;for(let t=0;t<this.blocks.length;++t)if(this.blocks[t].collision(this.bird))return!0;return!1}nextFrame(){this.ticks%r.world.blocksFrequency==0&&this.blocks.push(new s),this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.bird.render(this.ctx),this.bird.y+=this.bird.jump[this.current_state],this.bird.y+=r.bird.fallingSpeed,this.current_state=Math.min(this.bird.jump.length-1,this.current_state+1),this.blocks.filter(t=>t.x>=0-r.block.width).map(t=>{t.render(this.ctx),t.x--}),this.ticks++,this.gameIsOver()&&this.startNewGame()}};const o=document.getElementById("entry-point"),l=new n(o,o.getContext("2d"));l.startNewGame(),setInterval(l.nextFrame.bind(l),r.world.speed),document.body.addEventListener("keypress",t=>{32===t.charCode&&(l.current_state=0),0===t.charCode&&l.startNewGame()})}]);