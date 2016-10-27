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