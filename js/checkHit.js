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