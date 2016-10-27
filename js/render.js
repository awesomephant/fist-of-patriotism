var render = function () {
  c.clearRect(0, 0, c.canvas.width, c.canvas.height);
  var scene = scenes[game.currentScene]
  var p1 = scenes[1].actors.find(findPlayer);
  c.drawImage(scene.background, 0, 0, c.canvas.width, c.canvas.height)
  c.fillStyle = 'black'
  c.font = '25px "Press Start 2p"'

  var healthImg = new Image();
  healthImg.src = '/assets/health.png';
  if (game.status === 'running') {
    c.fillStyle = 'black';
    c.fillRect(14, 14, 31 * p1.health + 10, 64)
    for (var a = 0; a < p1.health; a++) {
      var w = 31;
      c.drawImage(healthImg, w * a + 20, 20, 30, 52.5);
    }
  }

  c.fillStyle = 'white';
  c.fillText(game.score, 20, c.canvas.height - 30);
  for (var i = 0; i < scene.actors.length; i++) {
    var actor = scene.actors[i];
    actor.render(c);
  }
  if (game.status === 'gameover') {
    c.fillStyle = 'white';

    c.font = '45px "Press Start 2p"'
    c.fillText('GAME OVER', c.canvas.width / 2, c.canvas.height / 2)
    if (game.status === 'gameover') {
   
    c.font = '35px "Press Start 2p"'
    c.fillText('Score:' + game.score, c.canvas.width / 2, c.canvas.height / 2 + 50)
  }
  }
}
