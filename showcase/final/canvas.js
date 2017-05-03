// implementation of main drawing canvas
var Canvas = function(div) {
  this.div = div;
  this.x = this.div.position().x;
  this.y = this.div.position().y;
  this.width = this.div.width;
  this.height = this.div.height;

  this.background = '#ff';
  this.gb = null;
  this.pixels;

  this.tiles = [];
  this.placingTile = false;
  this.activeTile = -1;

  this.gb = createGraphics(this.width, this.height);
  this.gb.angleMode(DEGREES);
  this.img;
    // make this work on retina?
  this.gb._pixelDensity = 2;
}
Canvas.prototype = {

  draw: function() {
    //this.gb.loadPixels();
    //this.pixels = this.gb.pixels;
    c_mouseX = mouseX - this.x;
    c_mouseY = mouseY - this.y;
    this.gb.background(this.background);
    this.gb.strokeWeight(crack_size);
    for(var i = 0; i < this.tiles.length; i++) {
      this.tiles[i].display(this.gb);
    }
  },

  display: function() {
    this.x = this.div.position().x;
    this.y = this.div.position().y;
    image(this.gb, this.x, this.y);
  },

  //click handler for inner canvas, allows picking up and placing of shards
  selectTile: function(mouseX, mouseY){
    c_mouseX = mouseX - this.x;
    c_mouseY = mouseY - this.y;
    if (activeTile) {
      //place the active tile down and clear the active tile
      activeTile.x = c_mouseX;
      activeTile.y = c_mouseY;

      this.tiles.push(activeTile);
      //console.log('adding tile at location', activeTile.x, activeTile.y);
      activeTile = null;
    } else {
      for (var i = this.tiles.length - 1; i >= 0; i--) {
        var center = this.tiles[i].center;
        push()
        rotate(this.tiles[i].theta, center);
        if(this.tiles[i].inside([c_mouseX + center[0], c_mouseY + center[1]])){
          if (coloring_only) {
            this.tiles[i].color = tile_color;
          } else {
            activeTile = this.tiles[i];
            this.tiles.splice(i, 1);
          }
        }
        pop();
      }
    }
  },

  save: function() {
    if (this.gb) {
      saveCanvas(this.gb, 'mosaic', 'png');
    }
  }

}


