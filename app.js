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
    //   console.log('index: ' + this.currentFrameIndex + ' x: ' + this.currentFrameX)
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
  }
  execute(e) {
    this.liveHitbox = [
      e.x + this.hitbox[0],
      e.y + this.hitbox[1],
      this.hitbox[2],
      this.hitbox[3],
    ]
    e.setStatus('jab');
    var a = this;
    setTimeout(function () {
      checkHit(e, a);
      e.cooldown(a.cooldown);
    }, a.duration)
  }
}
var checkHit = function (attacker, attack) {
    var scene = scenes[1];
    var index = scene.actors.map(function (x) {
        return x.id;
    }).indexOf('p1');
    var attacker = scene.actors[index];
    for (var i = 0; i < scene.actors.length; i++) {
        var hb = attack.liveHitbox;
        var oa = scene.actors[i];
        if (i != index) {
            if (hb[0] < oa.x + oa.width &&
                hb[0] + hb[2] > oa.x &&
                hb[1] < oa.y + oa.height &&
                hb[3] + hb[1] > oa.y &&
                oa.lane === attacker.lane) {
                console.log('hit!')
                oa.health -= attack.damage;
                oa.x -= 20;
                oa.setStatus('hit');
                setTimeout(function () {
                    console.log('set back')
                    console.log(oa)
                    oa.setStatus('idle')
                }, 500)

            }
        }
    }
}
var game = {
    currentScene: 1
}
var keysUp = {};
var keysDown = {};
var c, p1, stage;

var scenes = [];
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
            p1.attacks.jab.execute(p1);
            if (game.currentScene === 0) {
                game.currentScene = 1;
            }
        }
    }, false);

    window.addEventListener("keyup", function (e) {

        keysUp[e.keyCode] = true;
        delete keysDown[e.keyCode];
    }, false);


    scenes.push(new Scene('title'))

    scenes[0].background = new Animation('rain', '../assets/rain.png', 32, 32, 5, 10);
    scenes[0].tileBackground = true;

    scenes.push(new Scene('main'))
    scenes[1].actors.push(new Player('p1', 50, 50))
    scenes[1].actors.push(new Player('enemy', 400, 250))
    //scenes[0].actors.push(new Player('enemy', 300, 550))

    var img2 = new Image();
    img2.src = '../assets/background.png';
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
    this.facing = 'left';
    this.animations = {}
    if (this.id === 'p1') {
      this.animations.idle = new Animation('idle', '../assets/hero-idle.png', 39, 64, 4, 2);
      this.animations.walking = new Animation('idle', '../assets/hero-walking.png', 39, 64, 2, 6);
      this.animations.jab = new Animation('idle', '../assets/hero-jab.png', 39, 64, 2, 2);
      this.attacks = {};
      this.attacks.jab = new Attack('jab', [-15, 100, 40, 40], 200, 100, 1);
    }
    if (this.id === 'enemy') {
      this.animations.idle = new Animation('idle', '../assets/enemy-idle.png', 39, 64, 2, 2);
      this.animations.walking = new Animation('idle', '../assets/hero-walking.png', 39, 64, 2, 6);
      this.animations.jab = new Animation('idle', '../assets/hero-jab.png', 39, 64, 2, 2);
      this.animations.hit = new Animation('hit', '../assets/enemy-hit.png', 39, 64, 3, 6);
      this.attacks = {};
      this.attacks.jab = new Attack('jab', [-15, 100, 40, 40], 200, 100, 1);
    }
    this.status = 'idle';
    this.setStatus('idle');
    this.shadow = new Image();
    this.shadow.src = '../assets/shadow.png';

  }
  setStatus(status) {
    this.animations[this.status].stop();
    this.status = status;
    this.animations[status].start();
  }
  playAnimation(id){
    this.animations[id].playOnce();
  }
  render(c) {
    if (this.status === 'idle') {
      c.fillStyle = "rgb(200,0,0)";
    } else if (this.status === 'jab') {
      c.fillStyle = "rgb(200,170,0)";
      c.fillRect(this.attacks.jab.liveHitbox[0], this.attacks.jab.liveHitbox[
        1], this
          .attacks.jab.liveHitbox[2], this.attacks.jab.liveHitbox[3]);
    } else if (this.status === 'cooldown') {
      c.fillStyle = "rgb(200,170,200)";
    }

    this.animations[this.status].render(c, this.width, this.height, this.x, this.y, this.facing);
    c.drawImage(this.shadow, this.x + 30, this.y + this.height - 10, this.width - 10, 20)

    c.fillStyle = 'black'
    c.font = '14px helvetica'
    var text = 'lane: ' + this.lane + ' health: ' + this.health +
      ' Facing: ' +
      this.facing;
    c.fillText(text, this.x, this.y);

  }
  cooldown(t) {
    this.setStatus('idle')
    //setTimeout(this.reset.bind(this), t)
  }

  reset() {
    this.setStatus('idle');
  }
}
var render = function() {
  c.clearRect(0, 0, c.canvas.width, c.canvas.height);
  var scene = scenes[game.currentScene]
  
  c.drawImage(scene.background, 0, 0, c.canvas.width, c.canvas.height)
  
  for (var i = 0; i < scene.actors.length; i++) {
    var actor = scene.actors[i];
    actor.render(c);
  }
}

class Scene {
  constructor(id) {
    this.id = id;
    this.actors = [];
    this.background = '';
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
    var scene = scenes[1];

    var p1 = scenes[1].actors.find(findPlayer);
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