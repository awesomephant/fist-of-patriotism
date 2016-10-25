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