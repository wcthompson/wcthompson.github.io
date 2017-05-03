function Rectangle(x, y, w, h, color) {
  this.x = x;
  this.y = y;
  this.theta = 0
  this.w = w;
  this.h = h;
  this.color = color;
}

Rectangle.prototype.display = function(graphics) {
  angleMode(DEGREES);
  graphics.push();
  graphics.translate(this.x, this.y);
  graphics.rotate(this.theta);
  graphics.fill(this.color);
  //graphics.stroke(127, 63, 120);
  graphics.rect(0, 0, this.w, this.h)
  graphics.pop();
}

Rectangle.prototype.displayMainCanvas = function() {
  fill(this.color);
  stroke(127, 63, 120);
  rect(0, 0, this.w, this.h)
}

Rectangle.prototype.randomPoint = function () {
  return [Math.random() * this.w, Math.random() * this.h];
}

Rectangle.prototype.shatter = function(shards) {
  shards = shards ? shards : num_shards;
  console.log('shattering rect')
  // using d3.js voronoi layout to calculate voronoi polygons
  var rect = this;
  var sites = d3.range(shards)
    .map(function () {
      return rect.randomPoint()}
    );
  var voronoi = d3.voronoi()
    .extent([[0, 0], [this.w, this.h]]);
  return [voronoi.polygons(sites), sites];
}

function Shard(x, y, center, points, color) {
  this.x = x;
  this.y = y;
  this.center = center;
  this.theta = 0;
  this.points = points;
  this.color = color;
}

Shard.prototype.longestDist = function() {
  return max()
}

Shard.prototype.display = function(graphics, no_rotation=false) {
  if (graphics == null) {
    fill(this.color)
    beginShape();
    for(var k=0; k<this.points.length; k++) {
      // one vertex at a time
      var v = this.points[k];
      vertex(v[0], v[1]);
    }
    endShape(CLOSE);
    return;
  }
  graphics.fill(this.color);
  graphics.push();
  graphics.translate(this.x, this.y);
  if(!no_rotation){
    angleMode(DEGREES);
    graphics.rotate(this.theta, this.center);
    graphics.translate(-this.center[0] , -this.center[1]);
  }

  graphics.beginShape();
  for(var k=0; k<this.points.length; k++) {
    // one vertex at a time
    var v = this.points[k];
    graphics.vertex(v[0], v[1]);
  }
  graphics.endShape(CLOSE);
  graphics.pop();
};

Shard.prototype.displayOutline = function(centerX, centerY) {
  noFill()
  push();
  translate(centerX , centerY);
  rotate(this.theta, this.center);
  translate(-this.center[0] , -this.center[1]);
  beginShape();
  for(var k=0; k<this.points.length; k++) {
    // one vertex at a time
    var v = this.points[k];
    vertex(v[0], v[1]);
  }
  endShape(CLOSE);
  pop();
}

Shard.prototype.inside = function(point) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    var x = point[0], y = point[1];

    var vs = this.points;
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0] + this.x, yi = vs[i][1] + this.y;
        var xj = vs[j][0] + this.x, yj = vs[j][1] + this.y;

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    pop();
    return inside;
};



