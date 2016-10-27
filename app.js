class Ai {
    constructor() {
    }
    tick(e) {
        var instructions = {}
        var p1 = scenes[1].actors.find(findPlayer);
        if (p1) {
            if (e.x < p1.x) {
                e.x += e.speedX;
                e.facing = 'right'
            } else {
                e.x -= e.speedX;
                e.facing = 'left'
            }
            if (e.y < p1.y) {
                e.y += e.speedY;
            } else {
                e.y -= e.speedY;
            }
            var d = Math.abs(p1.x - e.x);
            if (e.lane === p1.lane && d < 100) {
                e.attacks.jab.execute(e);
            }
        } else {
            e.setStatus('dance');
        }
    } 
}
class Animation {
  constructor(id, spritesheet, width, height, frameCount, fps) {
    this.id = id;
    this.spritesheet = this.loadAssets(spritesheet);
    this.fps = fps;
    this.width = width;
    this.height = height;
    this.frameCount = frameCount;
    this.currentFrameIndex = 0;
    this.currentFrameX = 0;
    this.loop;
  }
  render(c, w, h, x, y, facing) {
    if (facing === 'left') {
      c.drawImage(this.spritesheet, this.currentFrameX, 0, this.width, this.height, x, y, w, h)
    } else if (facing === 'right') {
      c.drawImage(this.spritesheet, this.currentFrameX,this.height, this.width, this.height, x, y, w, h)
    }
  }
  loadAssets(path) {
    var img = new Image();
    img.src = path;
    return img;
  }
  tick() {
      // console.log('index: ' + this.currentFrameIndex + ' x: ' + this.currentFrameX)
    if (this.currentFrameIndex < this.frameCount - 1) {
      this.currentFrameIndex += 1;
      this.currentFrameX = this.width * this.currentFrameIndex;
    } else {
      this.currentFrameIndex = 0;
      this.currentFrameX = 0;
    }
  }
  playOnce(){
    var self = this;
    self.currentFrameIndex = 0;
    self.currentFrameX = 0;
    clearInterval(this.loop);
    this.loop = setInterval(function () {
      self.tick()
    }, (1000 / self.fps))
   // setTimeout(function(){clearInterval(this.loop)}, 300)
  }
  start() {
    var self = this;
    self.currentFrameIndex = 0;
    self.currentFrameX = 0;

    clearInterval(this.loop);
    this.loop = setInterval(function () {
      self.tick()
    }, (1000 / self.fps))
  }
  stop() {
    clearInterval(this.loop)
  }
  getCurrentFrame() {
    console.log(this.currentFrameIndex)
    return this.frames[this.currentFrameIndex]
  }

}
class Attack {
  constructor(id, hitbox, duration, cooldown, damage) {
    this.id = id;
    this.hitbox = hitbox;
    this.duration = duration;
    this.cooldown = cooldown;
    this.liveHitbox = [];
    this.damage = damage;
    this.onCooldown = false;
  }
  execute(e) {
    if (e.facing === 'left') {
      this.liveHitbox = [
        e.x + this.hitbox[0],
        e.y + this.hitbox[1],
        this.hitbox[2],
        this.hitbox[3],
      ]
    } else {
        this.liveHitbox = [
        e.x + e.width - this.hitbox[0],
        e.y + this.hitbox[1],
        this.hitbox[2],
        this.hitbox[3],
      ] 
    }
    var a = this;

    if (this.onCooldown === false) {
      e.setStatus('jab');
      checkHit(e, a);
      this.onCooldown = true;
      setTimeout(function () {
        e.reset();
        a.onCooldown = false;
      }, a.cooldown)

    }
  }
}
var checkHit = function (attacker, attack) {
    var scene = scenes[1];
    for (var i = 0; i < scene.actors.length; i++) {
        var hb = attack.liveHitbox;
        var oa = scene.actors[i];
        if (oa.id != attacker.id) {
            if (hb[0] < oa.x + oa.width &&
                hb[0] + hb[2] > oa.x &&
                hb[1] < oa.y + oa.height &&
                hb[3] + hb[1] > oa.y &&
                oa.lane === attacker.lane) {
                oa.health -= attack.damage;
                if (attacker.facing === 'left') {
                    oa.x -= 20;
                } else { oa.x += 20 }
                oa.setStatus('hit');
                oa.setStatus('walking')
                if (oa.id != 'p1') {
                    game.score += 125;

                }
                if (oa.health <= 0) {
                    console.log('got him')
                    scene.deadActors.push(oa);
                    scene.actors.splice(i, 1);
                    if (oa.id === 'p1') {
                        game.status = 'gameover';
                        console.log('over')
                    }
                }
            }
        }
    }
}
var game = {
    currentScene: 1,
    score: 0,
    status: 'paused',
    spawnInterval: 5000
}
var keysUp = {};
var keysDown = {};
var c, p1, stage;

var scenes = [];
var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var sortByLane = function(a, b) {
  if (a.y < b.y)
    return -1;
  if (a.y > b.y)
    return 1;
  return 0;
}
var findPlayer = function(actor) {
  return actor.id === 'p1';
}
var isEmpty = function(obj) {
    return Object.keys(obj).length === 0;
}
var init = function () {
    var el = document.getElementById('world');
    el.width = window.
        c = el.getContext('2d')
    c.canvas.width = 1280 * .9;
    c.canvas.height = 720 * .9;
    c.imageSmoothingEnabled = false;

    document.addEventListener("fullscreenchange", function (e) {
        if (document.fullscreen) {
            c.canvas.width = 1280;
            c.canvas.height = 720;
        }
    });
    window.addEventListener("keydown", function (e) {
        var p1 = scenes[1].actors.find(findPlayer);

        keysDown[e.keyCode] = true;
        delete keysUp[e.keyCode];
        if (e.keyCode === 32) {
            if (game.status === 'paused') {
                var title = document.getElementById('titlescreen');
                title.style.display = 'none'
                game.status = 'running';
                spawnEnemyLoop();

            }
            p1.attacks.jab.execute(p1);
        }
    }, false);

    window.addEventListener("keyup", function (e) {

        keysUp[e.keyCode] = true;
        delete keysDown[e.keyCode];
    }, false);


    scenes.push(new Scene('title'))

    scenes[0].background = new Animation('rain', './assets/rain.png', 32, 32, 5, 10);
    scenes[0].tileBackground = true;

    scenes.push(new Scene('main'))
    scenes[1].actors.push(new Player('p1', 50, 50))

    var img2 = new Image();
    img2.src = './assets/background.png';
    scenes[1].background = img2;

    stage = new Stage(c.canvas.height)
}
function main(tFrame) {
  game.stopMain = window.requestAnimationFrame(main);
  update(tFrame); //Call your update method. In our case, we give it rAF's timestamp.
  render();
}
document.addEventListener('DOMContentLoaded', function() {
  init();
  main(); // Start the cycle
}, false);

class Player {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.status = ''
    this.height = 64 * 4;
    this.width = 39 * 4;
    this.speedX = 5;
    this.speedY = 2;
    this.lane = 0;
    this.health = 10;
    this.facing = 'right';
    this.animations = {}
    this.status = 'idle';
    this.setStatus('idle');
    this.shadow = new Image();
    this.shadow.src = './assets/shadow.png';

    if (this.id === 'p1') {
      this.animations.idle = new Animation('idle', './assets/hero-idle.png', 39, 64, 4, 2);
      this.animations.walking = new Animation('idle', './assets/hero-walking.png', 39, 64, 2, 6);
      this.animations.jab = new Animation('idle', './assets/HERO-jab.png', 39, 64, 2, 2);
      this.animations.hit = new Animation('hit', './assets/enemy-hit.png', 39, 64, 3, 6);

      this.attacks = {};
      this.attacks.jab = new Attack('jab', [-15, 100, 40, 40], 200, 100, 1);
    }
    if (this.id === 'enemy') {
      this.animations.idle = new Animation('idle', './assets/enemy-idle.png', 39, 64, 2, 2);
      this.animations.walking = new Animation('idle', './assets/enemy-walking.png', 39, 64, 2, 6);
      this.animations.jab = new Animation('idle', './assets/enemy-jab.png', 39, 64, 2, 2);
      this.animations.hit = new Animation('hit', './assets/enemy-hit.png', 39, 64, 3, 6);
      this.animations.dance = new Animation('hit', './assets/enemy-dance.png', 39, 64, 2, 3);
      this.attacks = {};
      this.attacks.jab = new Attack('jab', [-15, 100, 40, 40], 200, 100, 1);
      this.speedX = 1;
      this.speedY = 1;
      this.setStatus('walking');
      this.ai = new Ai();
    }



  }
  setStatus(status) {
    if (status != this.status) {
      this.animations[this.status].stop();
      this.status = status;
      this.animations[status].start();
    }
  }
  playAnimation(id) {
    this.animations[id].playOnce();
  }
  render(c) {

    this.animations[this.status].render(c, this.width, this.height, this.x, this.y, this.facing);
    c.drawImage(this.shadow, this.x + 30, this.y + this.height - 10, this.width - 10, 20)

    c.fillStyle = 'black'
    c.font = '14px helvetica'
    var text = 'lane: ' + this.lane + ' health: ' + this.health +
      ' Facing: ' +
      this.facing;
    //c.fillText(text, this.x, this.y);

  }
  cooldown(t) {
    // this.setStatus('idle');
  }
  reset() {
    this.setStatus('idle');
  }
}
var render = function () {
  c.clearRect(0, 0, c.canvas.width, c.canvas.height);
  var scene = scenes[game.currentScene]
  var p1 = scenes[1].actors.find(findPlayer);
  c.drawImage(scene.background, 0, 0, c.canvas.width, c.canvas.height)
  c.fillStyle = 'black'
  c.font = '25px "Press Start 2p"'

  var healthImg = new Image();
  healthImg.src = '/assets/health.png';
  if (game.status === 'running') {
    c.fillStyle = 'black';
    c.fillRect(14, 14, 31 * p1.health + 10, 64)
    for (var a = 0; a < p1.health; a++) {
      var w = 31;
      c.drawImage(healthImg, w * a + 20, 20, 30, 52.5);
    }
  }

  c.fillStyle = 'white';
  c.fillText(game.score, 20, c.canvas.height - 30);
  for (var i = 0; i < scene.actors.length; i++) {
    var actor = scene.actors[i];
    actor.render(c);
  }
  if (game.status === 'gameover') {
    c.fillStyle = 'white';

    c.font = '45px "Press Start 2p"'
    c.fillText('GAME OVER', c.canvas.width / 2, c.canvas.height / 2)
    if (game.status === 'gameover') {
   
    c.font = '35px "Press Start 2p"'
    c.fillText('Score:' + game.score, c.canvas.width / 2, c.canvas.height / 2 + 50)
  }
  }
}

class Scene {
  constructor(id) {
    this.id = id;
    this.actors = [];
    this.deadActors = [];
    this.background = '';
  }
}
var spawnEnemyLoop = function () {
    if (game.status === 'running') {
        spawnEnemy();
        setTimeout(spawnEnemyLoop, game.spawnInterval)
    }
}
var spawnEnemy = function () {
    var side = getRandomInt(0, 1);
    if (side === 0) {
        scenes[1].actors.push(new Player('enemy', 1200, getRandomInt(0, 800)))
    }
    if (side === 1) {
        scenes[1].actors.push(new Player('enemy', -100, getRandomInt(0, 800)))
    }
    //console.log('Spawned Enemy at position' + side);
    console.log('Spawn interval:' + game.spawnInterval)
    if (game.spawnInterval > 600) {
        game.spawnInterval -= 500;
    }
}
var Stage = function(height) {
  var laneCount = 10;
  this.lanes = []
  var laneHeight = height / laneCount;

  for (var i = 0; i < laneCount; i++) {
    var lane = []
    lane[0] = i * laneHeight;
    lane[1] = (i + 1) * laneHeight
    this.lanes.push(lane)
  }
}

var update = function (frame) {
    var scene = scenes[game.currentScene];
    var p1 = scenes[1].actors.find(findPlayer);

    for (var a = 0; a < scene.actors.length; a++) {
        var actor = scene.actors[a];
        if (actor.ai) {
            actor.ai.tick(actor, p1);
        }
    }
    if (game.status === 'running') {
        if (isEmpty(keysDown)) { // right arrow
            if (p1.status != 'idle') {
                p1.setStatus('idle')
            }
        }
        if (keysDown.hasOwnProperty(39)) { // right arrow
            if (p1.status != 'walking') {
                p1.setStatus('walking')
            }
            p1.x += p1.speedX;
            if (p1.facing === 'left') {
                p1.facing = 'right'
            }
        }
        if (keysDown.hasOwnProperty(37)) { // left arrow
            if (p1.status != 'walking') {
                p1.setStatus('walking')
            }
            p1.x -= p1.speedX;
            if (p1.facing === 'right') {
                p1.facing = 'left'
            }
        }
        if (keysDown.hasOwnProperty(38)) { // up arrow
            if (p1.status != 'walking') {
                p1.setStatus('walking')
            } p1.y -= p1.speedX;
        }
        if (keysDown.hasOwnProperty(40)) { // down arrow
            if (p1.status != 'walking') {
                p1.setStatus('walking')
            }
            p1.y += p1.speedX;
        }
    }
    //update player lane
    for (var i = 0; i < stage.lanes.length; i++) {
        var lane = stage.lanes[i];
        for (var j = 0; j < scene.actors.length; j++) {
            var actor = scene.actors[j]
            if (actor.y + actor.height > lane[0] && actor.y + actor.height <
                lane[1]) {
                actor.lane = i;
            }
        }
    }

    scene.actors.sort(sortByLane)
}