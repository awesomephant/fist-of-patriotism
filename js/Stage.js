var Stage = function(height) {
  var laneCount = 10;
  this.lanes = []
  var laneHeight = height / laneCount;

  for (var i = 0; i < laneCount; i++) {
    var lane = []
    lane[0] = i * laneHeight;
    lane[1] = (i + 1) * laneHeight
    this.lanes.push(lane)
  }
}
