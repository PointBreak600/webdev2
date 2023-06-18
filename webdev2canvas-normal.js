let canvas = document.querySelector('canvas');
let endOverlay=document.querySelector('.endOverlay');
let scoreText=document.querySelector('.scoreText');
let windowWidth = 1534, windowHeight = 713;
canvas.width = windowWidth;
canvas.height = windowHeight;
let c = canvas.getContext('2d');
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
let keyD, keyS, keyA, keyW, bulletRadius = 10, bot, myInterval, score=0, gameState=false, playerRadius=30;
let bulletArray = [], botArray = [];
function onKeyDown(event) {
  let keyCode = event.keyCode;
  if(!gameState){
    switch (keyCode) {
      case 68: //d
        keyD = true;
        break;
      case 83: //s
        keyS = true;
        break;
      case 65: //a
        keyA = true;
        break;
      case 87: //w
        keyW = true;
        break;
    }
  }
}
function onKeyUp(event) {
  let keyCode = event.keyCode;
  switch (keyCode) {
    case 68: //d
      keyD = false;
      break;
    case 83: //s
      keyS = false;
      break;
    case 65: //a
      keyA = false;
      break;
    case 87: //w
      keyW = false;
      break;
  }
}
function writeText(){
  c.font='30px Arial';
  c.fillStyle='#848787';
  c.fillText("Base", 733, 510);
  c.fillText(`Score: ${score}`, 1390, 40);
}
class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    c.fillStyle = 'rgb(255,0,0)';
    c.fill();
  }
  update() {
    if (this.x + this.radius > windowWidth || this.x - this.radius < 0) {
      circle = new Circle(windowWidth / 2, 680, 30);
      turret= new Turret(circle, 40, -Math.PI/2);

    }
    if (this.y - this.radius < 0 || this.y + this.radius > windowHeight) {
      circle = new Circle(windowWidth / 2, 680, 30);
      turret= new Turret(circle, 40, -Math.PI/2);
    }
    if (keyD === true) {
      this.x = this.x + 5;
    }
    if (keyA === true) {
      this.x = this.x - 5;
    }
    if (keyS === true) {
      this.y = this.y + 5;
    }
    if (keyW === true) {
      this.y = this.y - 5;
    }
    this.draw();
  }
}
let circle = new Circle(windowWidth / 2, 680, playerRadius);
document.addEventListener('click', function(event) {
  if (!gameState && event.button === 0) {
    let mouseClickPos = {
      x: event.clientX,
      y: event.clientY
    };
    let tdx = mouseClickPos.x - circle.x;
    let tdy = mouseClickPos.y - circle.y;
    let angle = Math.atan2(tdy, tdx);
    let bullet = new Bullet(circle.x, circle.y, mouseClickPos, angle);
    turret = new Turret(circle, 40, angle)
    bulletArray.push(bullet);
  }
});
class Turret{
  constructor(player, length, angle) {
    this.player = player;
    this.length = length;
    this.angle = angle;
  }
  draw() {
    c.beginPath();
    c.lineWidth=10;
    c.strokeStyle='white';
    c.moveTo(this.player.x,this.player.y);
    c.lineTo(
      this.player.x + Math.cos(this.angle) * this.length,
      this.player.y + Math.sin(this.angle) * this.length
    );
    c.stroke();
  }
}
let turret= new Turret(circle, 40, -Math.PI/2);
class Bullet extends Circle {
  constructor(x, y, mouseClickPos, angle) {
    super(x, y, bulletRadius);
    this.mouseClickPos = mouseClickPos;
    this.angle = angle;
  }
  shoot() {
    if (this.mouseClickPos.x && this.mouseClickPos.y) {
      let cost = Math.cos(this.angle);
      let sint = Math.sin(this.angle);
      let bulletSpeed = 7;
      this.x += cost * bulletSpeed;
      this.y += sint * bulletSpeed;
    }
    this.draw();
  }
}
class Home {
  constructor(x, y, h, w) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
  }
  draw() {
    c.fillStyle = 'yellow';
    c.fillRect(this.x, this.y, this.w, this.h);
  }
}
let home = new Home(620, 400, 200, 300);
class Bot {
  constructor() {
    this.x = Math.floor(Math.random() * windowWidth);
    this.y = 0;
    this.h = 25;
    this.w = 25;
    this.startX = this.x;
    this.startY = this.y;
  }
  draw() {
    c.fillStyle = 'red';
    c.fillRect(this.x, this.y, this.w, this.h);
  }
  move() {
    let tdx = home.x + home.w / 2 - this.startX;
    let tdy = home.y + home.h / 2 - this.startY;
    let angle = Math.atan2(tdy, tdx);
    let cost = Math.cos(angle);
    let sint = Math.sin(angle);
    let botSpeed = 2;
    this.x += cost * botSpeed;
    this.y += sint * botSpeed;
  }
}
class Health{
    constructor(){
        this.lives = 10;
        this.x = 10;
        this.y = 10;
        this.w = 400;
        this.h = 25;
    }
    fullDraw(){
        c.fillStyle='white';
        c.fillRect(this.x,this.y,this.w,this.h);
    }
    healthDraw(){
        this.health=40*this.lives;
        if(this.lives>=7){
            c.fillStyle='green';
        }
        else if(this.lives>=4){
            c.fillStyle='#7d7905';
        }
        else{
            c.fillStyle='#8c1204';
        }
        c.fillRect(this.x,this.y,this.health,this.h);
    }
}
let healthBar=new Health();
function botCall(){
  clearInterval(myInterval);
  bot = new Bot();
  botArray.push(bot);
  myInterval=setInterval(botCall,1000);
}
botCall();
function checkBulletCollision(bullet, bot) {
  let dx = bullet.x - bot.x;
  let dy = bullet.y - bot.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  return distance < bullet.radius + bot.w;
}
function checkHomeCollision(bot, home){
    if(bot.x + bot.w >= home.x && bot.x <= home.x + home.w && bot.y + bot.h >= home.y && bot.y <= home.y + home.h){
      healthBar.lives--;
      if(healthBar.lives<=0){
        botArray.splice(0, botArray.length);
        gameState=true;
        gameOver();
        return;
      }
      return true;
    }
    else{
        return false;
    }
}
function playerAnimate() {
  requestAnimationFrame(playerAnimate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  home.draw();
  healthBar.fullDraw();
  healthBar.healthDraw();
  for (let i = 0; i < bulletArray.length; i++) {
    bulletArray[i].shoot();
    for (let j = 0; j < botArray.length; j++) {
      if (checkBulletCollision(bulletArray[i], botArray[j])) {
        bulletArray.splice(i, 1);
        botArray.splice(j, 1);
        i--;
        score+=20;
      }
    }
  }
  for (let j = 0; j < botArray.length; j++) {
    if(checkHomeCollision(botArray[j], home)) {
        botArray.splice(j, 1);
    }
  }
  turret.draw();
  circle.update();
  botArray.forEach((bot) => {
    bot.draw();
    bot.move();
  });
  writeText();
}
function gameOver(){
  clearInterval(myInterval);
  endOverlay.style.display='block';
  scoreText.innerHTML=`Score: ${score}`;
}
playerAnimate();