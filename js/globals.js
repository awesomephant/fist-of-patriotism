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