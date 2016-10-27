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