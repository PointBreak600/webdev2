let canvas = document.querySelector('canvas');
let endOverlay=document.querySelector('.endOverlay');
let scoreText=document.querySelector('.scoreText');
let windowWidth = 1534, windowHeight = 713;
canvas.width = windowWidth;
canvas.height = windowHeight;
let c = canvas.getContext('2d');
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
let keyD, keyS, keyA, keyW, bulletRadius = 10, bot, myInterval, score=0, gameState=false, playerRadius=30, botBullet, powerUp, powerInterval=0;
let z, shieldInterval, shieldCounter = 7;
let bulletArray = [], botArray = [], botBulletArray = [], powerUpArray = [];

//wasd
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

//score updating
function writeText() {
  c.font='30px Arial';
  c.fillStyle='#848787';
  c.fillText("Base", 733, 510);
  c.fillText(`Score: ${score} `, 1370, 40);
  c.font='20px Arial';
  c.fillStyle='#b0b0ac';
  c.fillText('Base Health', 10, 30);
  c.fillText('Player Health', 510, 30);
}

//player
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

//clicking events
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

//player turret
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

//player bullets
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

//home base
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
let home = new Home(665, 400, 200, 200);

//bot
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
    this.draw();
  }
}

// bot bullets
class BotBullet {
  constructor(bot, circle) {
    this.x = bot.x;
    this.y = bot.y;
    this.startX = bot.x;
    this.startY = bot.y;
    this.endX = circle.x;
    this.endY = circle.y;
    this.angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);
    this.speed = 2;
  }
  draw() {
    c.beginPath();
    c.fillStyle = 'grey';
    c.arc(this.x, this.y, bulletRadius, 0, Math.PI * 2, false);
    c.fill();
  }
  move() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.draw();
  }
}

//power up
class PowerUp {
  constructor() {
    this.x = z * windowWidth - 40;
    this.y = z * windowHeight + 40;
    this.w = 20;
    this.h = 20;
  }
  draw() {
    c.fillStyle='blue';
    c.fillRect(this.x, this.y, this.w, this.h);
  }
}

//home shield drawing
class HomeShield{
  constructor(){
    this.x = home.x + home.w / 2;
    this.y = home.y + home.w / 2;
    this.radius = home.w / Math.sqrt(2);
    this.shieldState = false;
  }
  drawShield(){
    c.beginPath();
    c.fillStyle='rgba(99, 107, 224, 0.1)';
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fill();
    c.beginPath();
    c.strokeStyle='#b3e7e8';
    c.lineWidth=1;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.stroke();
    return true;
  }
}
let homeShield= new HomeShield();

//base health bar
class HomeHealth{
    constructor(homeX, homeY){
        this.lives = 10;
        this.x = homeX;
        this.y = homeY;
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

//player health bar
class PlayerHealth extends HomeHealth {
    constructor(homeX, homeY) {
        super(homeX, homeY);
    }
}
let homeHealthBar=new HomeHealth(10, 10);
let playerHealthBar=new PlayerHealth(510, 10);

//creating bots and their bullets
function botCall(){
  clearInterval(myInterval);
  bot = new Bot();
  botBullet = new BotBullet(bot, circle);
  botArray.push(bot);
  botBulletArray.push(botBullet);
  myInterval=setInterval(botCall,1000);
}
botCall();

//player bullets hitting bot/bots hitting home shield
function checkCircleRectangleCollision(bullet, bot) {
  let dx = bullet.x - bot.x;
  let dy = bullet.y - bot.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  return distance < bullet.radius + bot.w;
}

//bot bullets hitting player
function checkCircleCollision(botBullet, circle){
    let dx = circle.x - botBullet.x;
    let dy = circle.y - botBullet.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle.radius + bulletRadius;
}

//bots hitting base
function checkHomeCollision(bot, home){
    if(bot.x + bot.w >= home.x && bot.x <= home.x + home.w && bot.y + bot.h >= home.y && bot.y <= home.y + home.h){
      homeHealthBar.lives--;
      if(homeHealthBar.lives<=0){
        botBulletArray.splice(0, botBulletArray.length);
        botArray.splice(0, botArray.length);
        bulletArray.splice(0, bulletArray.length);
        powerUpArray.splice(0, powerUpArray.length);
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

//creating power-up
function callPowerUp() {
  clearInterval(powerInterval);
  z = Math.random();
  if(z < 0.1 || z > 0.8) {
    z = Math.random();
  }
  powerUp = new PowerUp();
  powerUpArray.push(powerUp);
  powerInterval = setInterval(callPowerUp, 25000);
}
if(!gameState) {
  callPowerUp();
}

//creating shield
function callShield() {
  clearInterval(shieldInterval);
  shieldCounter -= 1;
  if(shieldCounter <= 0) {
    homeShield.shieldState = false;
  }
  shieldInterval = setInterval(callShield, 1000);
}

//animation
function playerAnimate() {
  requestAnimationFrame(playerAnimate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  home.draw();
  homeHealthBar.fullDraw();
  homeHealthBar.healthDraw();
  playerHealthBar.fullDraw();
  playerHealthBar.healthDraw();
  turret.draw();
  circle.update();
  botArray.forEach((bot) => {
    bot.draw();
    bot.move();
  });
  botBulletArray.forEach((botBullet) => {
    botBullet.draw();
    botBullet.move();
  })
  powerUpArray.forEach((powerUp) => {
    powerUp.draw();
  })
  writeText();

  for (let i = 0; i < bulletArray.length; i++) {
    bulletArray[i].shoot();
    for (let j = 0; j < botArray.length; j++) {
      if (checkCircleRectangleCollision(bulletArray[i], botArray[j])) {
        bulletArray.splice(i, 1);
        botArray.splice(j, 1);
        i--;
        score+=20;
      }
    }
  }
  
  for (let j = 0; j < botArray.length; j++) {
  if(homeShield.shieldState) {
    break;
  }
    if (checkHomeCollision(botArray[j], home)) {
        botArray.splice(j, 1);
    }
  }

  if(homeShield.shieldState) {
    for(let j = 0; j < botArray.length; j++) {
      if(checkCircleRectangleCollision(homeShield, botArray[j])) {
        botArray.splice(j, 1);
      }
    }
  }

  for(let k = 0; k < botBulletArray.length; k++) {
    if (checkCircleCollision(botBulletArray[k], circle)) {
        playerHealthBar.lives--;
        if(playerHealthBar.lives<=0) {
            botBulletArray.splice(0, botBulletArray.length);
            botArray.splice(0, botArray.length);
            bulletArray.splice(0, bulletArray.length);
            powerUpArray.splice(0, powerUpArray.length);
            gameState=true;
            gameOver();
            break;
        }
        botBulletArray.splice(k, 1);
    }
  }

  if(homeShield.shieldState) {
    homeShield.drawShield();
  }

  for(let i = 0; i < powerUpArray.length; i++) {
    if(checkCircleRectangleCollision(circle, powerUpArray[i])) {
      shieldCounter = 7;
      homeShield.shieldState = true;
      callShield();
      powerUpArray.splice(i, 1);
    }
  }
}

playerAnimate();

//game over
function gameOver(){
  clearInterval(myInterval);
  endOverlay.style.display='block';
  scoreText.innerHTML=`Score: ${score} `;
}