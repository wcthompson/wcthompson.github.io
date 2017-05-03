var padding = 10;
var tile_width = 100;
var tile_height = 100;

function tile_selector(){
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.height = 0;
  this.gb;

  this.rect = null;
  this.shards = [];

  this.div;
  this.shatterBtn;
}

tile_selector.prototype.setup = function (div, w, h) {
  var self = this;
  this.div = div;
  this.div.mousePressed(function () {
    self.selectShard(mouseX, mouseY);
  })
  this.x = this.div.position().x;
  this.y = this.div.position().y;
  this.width = this.div.width;
  this.height = this.div.height;
  tile_width = this.width*.75;
  tile_height = tile_width
   angleMode(DEGREES)
  this.shatterBtn = select('#shatter-btn');
  this.shatterBtn.mousePressed(function () {
    self.shatter();
  });

  this.gb = createGraphics(w + 5, h + 5);
  this.new_tile();

}
// draw a new tile in the tile selection window
tile_selector.prototype.new_tile = function () {
  console.log('new_tile');
  this.shards = [];
  this.rect = new Rectangle(this.width/2 - tile_width/2, 55, tile_width, tile_height, tile_color);
}
// shatters a single rect and replaces it with shards in the tiles list
tile_selector.prototype.shatter = function(index) {
  var self = this;
  var result = self.rect.shatter();
  var polygons = result[0];
  var centers = result[1];
  this.shards = [];
  for (var i = polygons.length - 1; i >= 0; i--) {
    this.shards.push(new Shard(this.width/2 - tile_width/2, 55, centers[i], polygons[i], tile_color));
  }
  //this.rect = null;
}

tile_selector.prototype.display = function () {
  this.x = this.div.position().x;
  this.y = this.div.position().y;

  this.gb.background('#92D5E6')
  this.gb.strokeWeight(crack_size);
  if (this.shards.length == 0) {
    this.rect.color = tile_color;
    this.rect.display(this.gb);
  } else {
    for (var i = this.shards.length - 1; i >= 0; i--) {
      this.shards[i].color = tile_color;
      this.shards[i].display(this.gb, true); // no rotation
    }
  }
  image(this.gb, this.x, this.y);
}

// click handler for the tile selection window
tile_selector.prototype.selectShard = function() {
  if (this.shards.length < 1) {
    return;
  }
  console.log('selectShard')
  t_mouseX = mouseX - this.x;
  t_mouseY = mouseY - this.y;
  for (var i = 0; i < this.shards.length; i++) {
    if(this.shards[i].inside([t_mouseX, t_mouseY])) {
      var s = this.shards[i];
      //console.log('selected shard', i, s.center);
      activeTile = new Shard(0,0,s.center,s.points.slice(), s.color);
    }
  }
}


