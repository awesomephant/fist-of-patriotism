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