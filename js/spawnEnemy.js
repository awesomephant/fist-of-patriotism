var spawnEnemyLoop = function () {
    if (game.status === 'running') {
        spawnEnemy();
        setTimeout(spawnEnemyLoop, game.spawnInterval)
    }
}
var spawnEnemy = function () {
    var side = getRandomInt(0, 1);
    if (side === 0) {
        scenes[1].actors.push(new Player('enemy', 1200, getRandomInt(0, 800)))
    }
    if (side === 1) {
        scenes[1].actors.push(new Player('enemy', -100, getRandomInt(0, 800)))
    }
    //console.log('Spawned Enemy at position' + side);
    console.log('Spawn interval:' + game.spawnInterval)
    if (game.spawnInterval > 600) {
        game.spawnInterval -= 500;
    }
}