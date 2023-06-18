let canvas = document.querySelector('canvas');
let endOverlay=document.querySelector('.endOverlay');
let scoreText=document.querySelector('.scoreText');
let windowWidth = 1534, windowHeight = 713;
canvas.width = windowWidth;
canvas.height = windowHeight;
let c = canvas.getContext('2d');
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
let keyD, keyS, keyA, keyW, bulletRadius = 10, bot, myInterval, score=0, gameState=false, playerRadius=30, botBullet, powerUp, powerInterval=0, bbInterval = 1;
let z, shieldInterval, shieldCounter = 7, botDir, homeTurret, homeBullet = null, botInterval = 1, homeBot, botBulletInterval = 1, bossInterval = 0;
let bulletArray = [], shootBotArray = [], botBulletArray = [], powerUpArray = [], homeBulletArray = [], homeBotArray = [], bossArray = [], bossBulletArray = [];

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
  c.fillText("Base", 733, 410);
  c.font = '25px Arial';
  c.fillText(`Score: ${score} `, 1370, 33);
  c.font='20px Arial';
  c.fillStyle='#b0b0ac';
  c.fillText('Base Health', 10, 30);
  c.fillText('Player Health', 510, 30);
  c.fillText('Boss Health', 950, 30);
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
      turret= new Turret(circle, 55, -Math.PI/2);

    }
    if (this.y - this.radius < 0 || this.y + this.radius > windowHeight) {
      circle = new Circle(windowWidth / 2, 680, 30);
      turret= new Turret(circle, 55, -Math.PI/2);
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
    turret = new Turret(circle, 55, angle);
    bulletArray.push(bullet);
  }
});

//player turret
class Turret{
  constructor(player, length, angle) {
    this.object = player;
    this.length = length;
    this.angle = angle;
  }
  draw() {
    c.beginPath();
    c.lineWidth=10;
    c.strokeStyle='white';
    c.moveTo(this.object.x,this.object.y);
    c.lineTo(
      this.object.x + Math.cos(this.angle) * this.length,
      this.object.y + Math.sin(this.angle) * this.length
    );
    c.stroke();
  }
}
let turret= new Turret(circle, 55, -Math.PI/2);

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
let home = new Home(665, 300, 200, 200);

//base turret
class HomeTurret {
  constructor(home, length, angle) {
    this.object = home;
    this.length = length;
    this.angle = angle;
  }
  draw() {
    c.beginPath();
    c.lineWidth=20;
    c.strokeStyle='white';
    c.moveTo(this.object.x + this.object.w / 2,this.object.y);
    c.lineTo(
      this.object.x + this.object.w / 2 + Math.cos(this.angle) * this.length,
      this.object.y + Math.sin(this.angle) * this.length
    );
    c.stroke();
  }
}
homeTurret = new HomeTurret(home, 60, -Math.PI/2);

class HomeBullet {
  constructor(bot) {
    this.x = home.x + home.w / 2;
    this.y = home.y;
    this.startX = home.x + home.w / 2;
    this.startY = home.y;
    this.radius = bulletRadius;
    this.endX = bot.x + bot.w / 2;
    this.endY = bot.y + bot.h / 2;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = 'grey';
    c.fill();
  }
  move() {
    let tdx = this.endX - this.startX;
    let tdy = this.endY - this.startY;
    let angle = Math.atan2(tdy, tdx);
    let baseSpeed = 4;
    this.x += Math.cos(angle) * baseSpeed;
    this.y += Math.sin(angle) * baseSpeed;
  }
}

class Boss {
  constructor() {
    this.x = Math.floor(Math.random() * (windowWidth - 100));
    this.y = 100;
    this.radius = 50;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = 'pink';
    c.fill();
  }
}

class BossBullet {
  constructor(boss) {
    this.boss = boss;
    this.x = this.boss.x;
    this.y = this.boss.y;
    this.radius = 20;
    this.endX = circle.x;
    this.endY = circle.y;
    this.angle = Math.atan2(this.endY - this.y, this.endX - this.x);
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = '#d663d2';
    c.fill();
  }
  move() {
    let bossSpeed = 3;
    this.x += Math.cos(this.angle) * bossSpeed;
    this.y += Math.sin(this.angle) * bossSpeed;
  }
}

//bot
class Bot {
  constructor() {
    if(botDir <= 0.33) {
        this.x = Math.floor(Math.random() * windowWidth);
        this.y = 20;
    }
    else if(botDir <= 0.66) {
        this.x = Math.floor(Math.random() * windowWidth);
        this.y = windowHeight - 20;
    }
    else if(botDir < 1) {
        let temp = Math.random();
        if(temp <= 0.5) {
            this.x = 20;
        }
        else if(temp < 1) {
            this.x = windowWidth - 20;
        }
        this.y = Math.floor(Math.random() * windowHeight); 
    }
    this.h = 25;
    this.w = 25;
    this.radius = 20;
    this.startX = this.x;
    this.startY = this.y;
  }
  draw() {
    c.fillStyle = 'red';
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fill();
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

//base hitting bot
class HomeBot extends Bot {
  constructor() {
    super();
  }
  draw() {
    c.fillStyle = 'red';
    c.fillRect(this.x, this.y, this.w, this.h);
  }
}


// bot bullets
class BotBullet {
  constructor(bot) {
    this.x = bot.x;
    this.y = bot.y;
    this.angle = Math.atan2(circle.y - this.y, circle.x - this.x);
    this.radius = bulletRadius;
    this.speed = 2;
    this.count = 0;
  }
  draw() {
    c.beginPath();
    c.fillStyle = '#cf8057';
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fill();
  }
  move() {
    this.angle = Math.atan2(circle.y - this.y, circle.x - this.x);
    this.count += 1;
    if(this.count % 500 === 0) {
      botBulletArray.splice(0, 1);
    }
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
      if(this.lives <= 0){
        this.lives = 0;
      }
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

class BossHealth extends HomeHealth {
  constructor(homeX, homeY) {
    super(homeX, homeY);
  }
}
let homeHealthBar=new HomeHealth(10, 10);
let playerHealthBar=new PlayerHealth(510, 10);
let bossHealthBar = new BossHealth(950, 10);

//creating bots and their bullets
function botCall() {
  clearInterval(myInterval);
  botDir = Math.random();
  bot = new Bot();
  homeBot = new HomeBot();
  botBullet = new BotBullet(bot);
  homeBotArray.push(homeBot);
  shootBotArray.push(bot);
  botBulletArray.push(botBullet);
  myInterval = setInterval(botCall,3000);
}
botCall();

function botBulletCall() {
  clearInterval(botBulletInterval);
  for(let i = 0; i < shootBotArray.length; i++) {
    botBullet = new BotBullet(shootBotArray[i]);
    botBulletArray.push(botBullet);
  }
  botBulletInterval = setInterval(botBulletCall, 5000);
}
botBulletCall();

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
    return distance < circle.radius + botBullet.radius;
}

//bots in range of base turret
function checkRectangleCollision(bot, home) {
  let dx = bot.x - home.x;
  let dy = bot.y - home.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  if(Math.floor(distance) - bot.w - home.w <= 100 && Math.floor(distance) - bot.w - home.w >= 96) {
    return true;
  }
  else {
    return false;
  }
}

//bots hitting base
function checkHomeCollision(bot, home){
    if(bot.x + bot.w >= home.x && bot.x <= home.x + home.w && bot.y + bot.h >= home.y && bot.y <= home.y + home.h){
      homeHealthBar.lives--;
      if(homeHealthBar.lives<=0){
        botBulletArray.splice(0, botBulletArray.length);
        shootBotArray.splice(0, shootBotArray.length);
        bulletArray.splice(0, bulletArray.length);
        powerUpArray.splice(0, powerUpArray.length);
        homeBotArray.splice(0, homeBotArray.length);
        bossBulletArray.splice(0, bossBulletArray.length);
        bossArray.splice(0, bossArray.length);
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
  if(gameState) {
    return;
  }
  powerUp = new PowerUp();
  powerUpArray.push(powerUp);
  powerInterval = setInterval(callPowerUp, 25000);
}

callPowerUp();

//creating shield
function callShield() {
  clearInterval(shieldInterval);
  shieldCounter -= 1;
  if(shieldCounter <= 0) {
    homeShield.shieldState = false;
  }
  shieldInterval = setInterval(callShield, 1000);
}

function baseBotProximity() {
  for(let i = 0; i < homeBotArray.length; i++) {
    if(checkRectangleCollision(homeBotArray[i], home)) {
      homeBullet = new HomeBullet(homeBotArray[i]);
      homeBulletArray.push(homeBullet);
      let dx = homeBotArray[i].x - home.x - home.w / 2;
      let dy = homeBotArray[i].y - home.y;
      let baseAngle = Math.atan2(dy, dx);
      homeTurret = new HomeTurret(home, 60, baseAngle);
    }
  }
}

function createBoss() {
  clearInterval(bossInterval);
  if(bossArray.length === 0) {
    let boss = new Boss();
    bossArray.push(boss);
    bossHealthBar = new BossHealth(950, 10);
  }
  if(gameState) {
    bossArray.splice(0, bossArray.length);
    return;
  }
  bossInterval = setInterval(createBoss, 30000);
}
createBoss();

function bossBulletCall() {
  clearInterval(bbInterval);
  for(let i = 0; i < bossArray.length; i++) {
    let bossBullet = new BossBullet(bossArray[i]);
    bossBulletArray.push(bossBullet);
  }
  if(gameState) {
    return;
  }
  bbInterval = setInterval(bossBulletCall, 2000);
}
bossBulletCall();

//animation
function playerAnimate() {
  requestAnimationFrame(playerAnimate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  home.draw();
  homeHealthBar.fullDraw();
  homeHealthBar.healthDraw();
  playerHealthBar.fullDraw();
  playerHealthBar.healthDraw();
  bossHealthBar.fullDraw();
  if(bossArray.length > 0) {
    bossHealthBar.healthDraw();
  }
  homeTurret.draw();
  baseBotProximity();
  turret.draw();
  circle.update();
  botBulletArray.forEach((botBullet) => {
    botBullet.draw();
    botBullet.move();
  });
  homeBotArray.forEach((homeBot) => {
    homeBot.draw();
    homeBot.move();
  });
  shootBotArray.forEach((bot) => {
    bot.draw();
    // bot.move();
  });
  powerUpArray.forEach((powerUp) => {
    powerUp.draw();
  });
  homeBulletArray.forEach((homeBullet) => {
    homeBullet.draw();
  });
  bossArray.forEach((boss) => {
    boss.draw();
  });
  bossBulletArray.forEach((bossBullet) => {
    bossBullet.draw();
    bossBullet.move();
  })
  writeText();

  for (let i = 0; i < bulletArray.length; i++) {
    bulletArray[i].shoot();
    for (let j = 0; j < shootBotArray.length; j++) {
      if (checkCircleCollision(bulletArray[i], shootBotArray[j])) {
        bulletArray.splice(i, 1);
        shootBotArray.splice(j, 1);
        i--;
        score += 20;
      }
    }
  }

  for (let i = 0; i < bulletArray.length; i++) {
    bulletArray[i].shoot();
    for (let j = 0; j < homeBotArray.length; j++) {
      if (checkCircleRectangleCollision(bulletArray[i], homeBotArray[j])) {
        bulletArray.splice(i, 1);
        homeBotArray.splice(j, 1);
        i--;
        score += 20;
      }
    }
  }

  for(let k = 0; k < botBulletArray.length; k++) {
    if (checkCircleCollision(botBulletArray[k], circle)) {
        playerHealthBar.lives--;
        if(playerHealthBar.lives<=0) {
            botBulletArray.splice(0, botBulletArray.length);
            shootBotArray.splice(0, shootBotArray.length);
            bulletArray.splice(0, bulletArray.length);
            powerUpArray.splice(0, powerUpArray.length);
            homeBotArray.splice(0, homeBotArray.length);
            bossBulletArray.splice(0, bossBulletArray.length);
            bossArray.splice(0, bossArray.length);
            gameState=true;
            gameOver();
            break;
        }
        botBulletArray.splice(k, 1);
    }
  }

  for (let j = 0; j < homeBotArray.length; j++) {
    if(homeShield.shieldState) {
      break;
    }
    if (checkHomeCollision(homeBotArray[j], home)) {
        homeBotArray.splice(j, 1);
    }
  }

  if(homeShield.shieldState) {
    for(let j = 0; j < homeBotArray.length; j++) {
      if(checkCircleRectangleCollision(homeShield, homeBotArray[j])) {
        homeBotArray.splice(j, 1);
      }
    }
  }

  if(homeShield.shieldState) {
    homeShield.drawShield();
  }

  for(let l = 0; l < bossBulletArray.length; l++) {
    if(checkCircleCollision(bossBulletArray[l], circle)) {
      playerHealthBar.lives -= 3;
      if(playerHealthBar.lives<=0) {
        botBulletArray.splice(0, botBulletArray.length);
        shootBotArray.splice(0, shootBotArray.length);
        bulletArray.splice(0, bulletArray.length);
        powerUpArray.splice(0, powerUpArray.length);
        homeBotArray.splice(0, homeBotArray.length);
        bossBulletArray.splice(0, bossBulletArray.length);
        bossArray.splice(0, bossArray.length);
        gameState=true;
        gameOver();
        break;
      }
      bossBulletArray.splice(l, 1);
    }
  }

  for(let i = 0; i < bossArray.length; i++) {
    for(let j = 0; j < bulletArray.length; j++) {
      if(checkCircleCollision(bulletArray[j], bossArray[i])) {
        bossHealthBar.lives--;
        if(bossHealthBar.lives <= 0) {
          bossArray.splice(i, 1);
        }
        bulletArray.splice(j, 1);
      }
    }
  }
  for(let i = 0; i < powerUpArray.length; i++) {
    if(checkCircleRectangleCollision(circle, powerUpArray[i])) {
      shieldCounter = 7;
      homeShield.shieldState = true;
      callShield();
      powerUpArray.splice(i, 1);
    }
  }

  for(let i = 0; i < homeBulletArray.length; i++) {
    homeBulletArray[i].move();
    for (let j = 0; j < homeBotArray.length; j++) {
      if (checkCircleRectangleCollision(homeBulletArray[i], homeBotArray[j])) {
        homeBulletArray.splice(i, 1);
        homeBotArray.splice(j, 1);
        i--;
      }
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