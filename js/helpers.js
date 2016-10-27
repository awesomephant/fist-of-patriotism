var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var sortByLane = function(a, b) {
  if (a.y < b.y)
    return -1;
  if (a.y > b.y)
    return 1;
  return 0;
}
var findPlayer = function(actor) {
  return actor.id === 'p1';
}
var isEmpty = function(obj) {
    return Object.keys(obj).length === 0;
}