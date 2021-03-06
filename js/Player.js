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