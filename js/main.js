function main(tFrame) {
  game.stopMain = window.requestAnimationFrame(main);
  update(tFrame); //Call your update method. In our case, we give it rAF's timestamp.
  render();
}
document.addEventListener('DOMContentLoaded', function() {
  init();
  main(); // Start the cycle
}, false);
