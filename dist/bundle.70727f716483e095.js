(()=>{window.requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)};var t=document.getElementById("canvas"),e=t.getContext("2d");document.getElementById("start-button").addEventListener("click",(function t(){M=new I,g=new B,q=new D,R=new b,tgames.gameStarted(),document.getElementById("start-menu").style.display="none",console.log("resize"),l();let h="left",s=0;const y=document.getElementById("left-btn"),r=document.getElementById("right-btn");function w(e){var i=e.keyCode;37==i?(h="left",g.isMovingLeft=!0):39==i&&(h="right",g.isMovingRight=!0),32==i&&(!0===E?t():z())}function f(t){var e=t.keyCode;37==e?(h="left",g.isMovingLeft=!1):39==e&&(h="right",g.isMovingRight=!1)}function x(t,e){t.preventDefault(),"left"===e?(y.style.background="red",h="left",g.isMovingLeft=!0):"right"===e&&(r.style.background="red",h="right",g.isMovingRight=!0)}function k(t,e){t.preventDefault(),"left"===e?(y.style.background="darkgrey",h="left",g.isMovingLeft=!1):"right"===e&&(r.style.background="darkgrey",h="right",g.isMovingRight=!1)}function F(){var t,y,r;e.clearRect(0,0,a,c),t=R,u.forEach((function(e,i){2==e.type&&((e.x<0||e.x+e.width>a)&&(e.vx*=-1),e.x+=e.vx),1==e.flag&&!1===t.appearance&&0===s&&(t.x=e.x,t.y=e.y,t.appearance=!0,s++),e.draw()})),!0===t.appearance&&(t.draw(),t.y+=8),t.y>c&&(t.appearance=!1),y=q,1==(r=u[0]).type||2==r.type?(y.x=r.x+r.width/2-y.width/2,y.y=r.y-r.height-10,y.y>c/1.1&&(y.state=0),y.draw()):(y.x=0-y.width,y.y=0-y.height),"left"==h?(g.dir="left",g.vy<-7&&g.vy>-15&&(g.dir="left_land")):"right"==h&&(g.dir="right",g.vy<-7&&g.vy>-15&&(g.dir="right_land")),document.onkeydown=w,document.onkeyup=f,!0===g.isMovingLeft?(g.x+=g.vx,g.vx-=.15):(g.x+=g.vx,g.vx<0&&(g.vx+=.1)),!0===g.isMovingRight?(g.x+=g.vx,g.vx+=.15):(g.x+=g.vx,g.vx>0&&(g.vx-=.1)),g.y+g.height>M.y&&M.y<c&&g.jump(),M.y>c&&g.y+g.height>c&&"lol"!=g.isDead&&(g.isDead=!0),g.x>a?g.x=0-g.width:g.x<0-g.width&&(g.x=a),Math.ceil(g.y)>=Math.floor(c/2-g.height/2)?(g.y+=g.vy,g.vy+=.2):(u.forEach((function(t,e){g.vy<0&&(t.y-=g.vy),t.y>c&&(u[e]=new L,u[e].y=t.y-c)})),M.y-=g.vy,g.vy+=.2,g.vy>=0&&(g.y+=g.vy,g.vy+=.2),Math.ceil(g.y+2)>=Math.floor(c/2-g.height/2)||p++),function(){u.forEach((function(t,e){if(g.vy>0&&0===t.state&&g.x+15<t.x+t.width&&g.x+g.width-15>t.x&&g.y+g.height>t.y&&g.y+g.height<t.y+t.height){if(3==t.type&&0===t.flag)return t.flag=1,void(s=0);if(4==t.type&&0===t.state)g.jump(),t.state=1;else{if(1==t.flag)return;g.jump()}}}));var t=q;g.vy>0&&0===t.state&&g.x+15<t.x+t.width&&g.x+g.width-15>t.x&&g.y+g.height>t.y&&g.y+g.height<t.y+t.height&&(t.state=1,g.jumpHigh())}(),!0===g.isDead&&(tgames.gameOver(p),i.style.display="none",u.forEach((function(t,e){t.y-=12})),g.y>c/2&&0===v?(g.y-=8,g.vy=0):g.y<c/2?v=1:g.y+g.height>c&&(o?(n.style.zIndex=1,n.style.display="flex",document.getElementById("line").style.display="block",d=setTimeout((()=>{H()}),8e3),o=!1):H(),document.getElementById("scoreBoard").style.zIndex=-1,g.isDead="lol")),g.draw(),M.draw(),document.getElementById("score").innerHTML=p}i.style.display="flex",E=!1,y.addEventListener("touchstart",(t=>x(t,"left"))),r.addEventListener("touchstart",(t=>x(t,"right"))),y.addEventListener("touchend",(t=>k(t,"left"))),r.addEventListener("touchend",(t=>k(t,"right"))),menuLoop=function(){},(m=function(){F(),requestAnimFrame(m)})(),A(),T()})),document.getElementById("reset").addEventListener("click",z),document.getElementById("skip-button").addEventListener("click",H),document.getElementById("watch-ads-button").addEventListener("click",(function(){try{tgames.showRewardedAd().then((()=>{z()})),o=!1,r=!0,clearTimeout(d)}catch(t){console.log(t),o=!1,r=!0,z(),clearTimeout(d)}y--}));const i=document.querySelector(".btn-container");var n=document.getElementById("continue-menu"),h=document.getElementById("gameOverMenu");let s,d,a=Math.min(window.innerWidth,500),c=window.innerHeight,o=!0,y=3,r=!1;function l(){e.canvas.width=window.innerWidth,e.canvas.height=window.innerHeight,a=Math.min(window.innerWidth,500),c=window.innerHeight,console.log("resize"),(M=new I).draw(),(q=new q).draw()}s=window.addEventListener("resize",l),t.width=a,t.height=c;var g,m,u=[],w=document.getElementById("sprite"),f=0,v=0,x=0,p=0,E=!0,I=function(){this.height=5,this.width=a,this.cx=0,this.cy=614,this.cwidth=100,this.cheight=5,this.moved=0,this.x=0,this.y=c-this.height,this.draw=function(){try{e.drawImage(w,this.cx,this.cy,this.cwidth,this.cheight,this.x,this.y,this.width,this.height)}catch(t){}}},M=new I,B=function(){this.vy=11,this.vx=0,this.isMovingLeft=!1,this.isMovingRight=!1,this.isDead=!1,this.width=55,this.height=40,this.cx=0,this.cy=0,this.cwidth=110,this.cheight=80,this.dir="left",this.x=a/2-this.width/2,this.y=c,this.draw=function(){try{"right"==this.dir?this.cy=121:"left"==this.dir?this.cy=201:"right_land"==this.dir?this.cy=289:"left_land"==this.dir&&(this.cy=371),e.drawImage(w,this.cx,this.cy,this.cwidth,this.cheight,this.x,this.y,this.width,this.height)}catch(t){}},this.jump=function(){this.vy=-8},this.jumpHigh=function(){this.vy=-16}};function L(){this.width=70,this.height=17,this.x=Math.random()*(a-this.width),this.y=f,f+=c/10,this.flag=0,this.state=0,this.cx=0,this.cy=0,this.cwidth=105,this.cheight=31,this.draw=function(){try{1==this.type?this.cy=0:2==this.type?this.cy=61:3==this.type&&0===this.flag?this.cy=31:3==this.type&&1==this.flag?this.cy=1e3:4==this.type&&0===this.state?this.cy=90:4==this.type&&1==this.state&&(this.cy=1e3),e.drawImage(w,this.cx,this.cy,this.cwidth,this.cheight,this.x,this.y,this.width,this.height)}catch(t){}},this.types=p>=5e3?[2,3,3,3,4,4,4,4]:p>=2e3&&p<5e3?[2,2,2,3,3,3,3,4,4,4,4]:p>=1e3&&p<2e3?[2,2,2,3,3,3,3,3]:p>=500&&p<1e3?[1,1,1,1,1,2,2,2,2,3,3,3,3]:p>=100&&p<500?[1,1,1,1,2,2]:[1],this.type=this.types[Math.floor(Math.random()*this.types.length)],3==this.type&&x<1?x++:3==this.type&&x>=1&&(this.type=1,x=0),this.moved=0,this.vx=1}g=new B;for(var k=0;k<10;k++)u.push(new L);var b=function(){this.height=30,this.width=70,this.x=0,this.y=0,this.cx=0,this.cy=554,this.cwidth=105,this.cheight=60,this.appearance=!1,this.draw=function(){try{if(!0!==this.appearance)return;e.drawImage(w,this.cx,this.cy,this.cwidth,this.cheight,this.x,this.y,this.width,this.height)}catch(t){}}},R=new b,D=function(){this.x=0,this.y=0,this.width=26,this.height=30,this.cx=0,this.cy=0,this.cwidth=45,this.cheight=53,this.state=0,this.draw=function(){try{0===this.state?this.cy=445:1==this.state&&(this.cy=501),e.drawImage(w,this.cx,this.cy,this.cwidth,this.cheight,this.x,this.y,this.width,this.height)}catch(t){}}},q=new D;function z(){i.style.display="flex",document.getElementById("reset-menu").style.display="none",tgames.gameStarted(),n.style.zIndex=-1,n.style.display="flex",h.style.zIndex=-1,h.style.visibility="hidden",T(),g.isDead=!1,v=0,f=0,r||(p=0),r=!1,M=new I,g=new B,q=new D,R=new b,u=[];for(var t=0;t<10;t++)u.push(new L)}function A(){document.getElementById("mainMenu").style.zIndex=-1}function H(){n.style.zIndex=-1,n.style.display="none",clearTimeout(d),o=!0,document.getElementById("line").style.display="none",document.getElementById("reset-menu").style.display="flex",document.getElementById("reset-button").addEventListener("click",z),(0===y||y<0)&&(tgames.showRewardedAd(),y=3),document.getElementById("go_score").innerHTML="Ваш результат "+p+" очков!",y--}function T(){document.getElementById("scoreBoard").style.zIndex=1}menuLoop=function(){e.clearRect(0,0,a,c),requestAnimFrame(menuLoop)},menuLoop(),A();let F=!1;function j(t){if(!F)return;let e=t.alpha,i=t.beta,n=t.gamma;console.log("device!"),document.getElementById("alpha").innerHTML=`alpha - ${e}`,document.getElementById("betta").innerHTML=`gamma - ${i}`,document.getElementById("gamma").innerHTML=`betta - ${n}`}window.DeviceOrientationEvent&&"undefined"!=typeof DeviceOrientationEvent&&"function"==typeof DeviceOrientationEvent.requestPermission&&document.getElementById("alpha").addEventListener("click",(function(){DeviceOrientationEvent.requestPermission().then((t=>{alert(t),"granted"==t&&(F=!0,window.addEventListener("deviceorientation",j,!1))})).catch((t=>console.log(t)))}))})();
//# sourceMappingURL=bundle.70727f716483e095.js.map