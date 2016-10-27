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