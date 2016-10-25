var render = function() {
  c.clearRect(0, 0, c.canvas.width, c.canvas.height);
  var scene = scenes[game.currentScene]
  
  c.drawImage(scene.background, 0, 0, c.canvas.width, c.canvas.height)
  
  for (var i = 0; i < scene.actors.length; i++) {
    var actor = scene.actors[i];
    actor.render(c);
  }
}
