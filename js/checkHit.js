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