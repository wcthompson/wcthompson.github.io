var DEBUG = true;

var CANVAS_HEIGHT = 600;
var CANVAS_WIDTH = 600;

var SELECTOR_WIDTH = 200;
var SELECTOR_HEIGHT = 280;

var centerX = 0;
var centerY = 0;

var main_canvas = null;
var tile_select = null;
var inner_canvas = null;
var gui = null;
var tile_color = '#06D6A0';
var bg_color = '#FFFFFF';
var coloring_only = false;
var crack_size = 1;
var num_shards = 5;

var activeTile = null;
var bgShards = [];
var mixColor = [330,330,330];
var bgHue;

function setup() {
  angleMode(DEGREES)
  // set up the main window for the app including toolbar and system options
  canvas_left = (windowWidth - CANVAS_WIDTH) / 2;
  canvas_top = max((windowHeight - CANVAS_HEIGHT) / 4, 50);

  main_canvas = createCanvas(windowWidth, windowHeight);
  // make background tiling
  bgHue = random(360);
  draw_bg_tiles();
  main_canvas.parent('main');
  //main_window_draw();
  //add tile select
  tile_select = new tile_selector(SELECTOR_WIDTH, SELECTOR_HEIGHT);
  tile_select.setup(select('#tile-select'), SELECTOR_WIDTH, SELECTOR_HEIGHT);
  // add the drawing canvas
  inner_canvas = new Canvas(select('#inner-canvas'));
  inner_canvas.div.mousePressed(function () {
    inner_canvas.selectTile(mouseX, mouseY);
  })
  saveBtn = select('#save-btn');
  saveBtn.mousePressed(function () {
    inner_canvas.save();
  });

  // Create the GUI
  gui = createGui('Settings', windowWidth-270);
  sliderRange(0, 5);
  gui.addGlobals('tile_color', 'bg_color', 'coloring_only');
  sliderRange(1, 30);
  gui.addGlobals('num_shards');
  //noLoop();

}

function draw() {
  // rotate active shape
  if ( keyIsDown(LEFT_ARROW) && activeTile) {
    activeTile.theta -= 3;
  } else if (keyIsDown(RIGHT_ARROW) && activeTile) {
    activeTile.theta += 3;
  }
  // draw main + inner canvas
  main_window_draw();

  inner_canvas.background = bg_color;
  inner_canvas.draw();
  // position inner canvas
  canvas_left = (windowWidth - CANVAS_WIDTH) / 2;
  inner_canvas.div.position(canvas_left, 10)
  inner_canvas.display();
  tile_select.display();
  if (activeTile) {
    activeTile.displayOutline(mouseX, mouseY);
  }
}

function rotateActive(event) {
  if (!activeTile) {
    return;
  }

  if (event.deltaY > 0) {
    activeTile.theta -= 5;
  } else {
    activeTile.theta += 5;
  }
}

function mouseWheel(event) {
  rotateActive(event);
}

function draw_bg_tiles() {
  blendMode(SOFT_LIGHT);
  this.bgShards = [];
  var bgRect = new Rectangle(0, 0, windowWidth, windowHeight, "#95e5ff");
  var result = bgRect.shatter(50);
  var polygons = result[0];
  var centers = result[1];
  colorMode(HSB);
  var h = bgHue;
  var s = 50;
  var b = 90
  for (var i = polygons.length - 1; i >= 0; i--) {
    var c = color(h, s, b);
    h = (h + 1) % 360;
    //var c = color((r + mixColor[0])/2, (g + mixColor[1])/2, (b + mixColor[2])/2, 50);
    this.bgShards.push(new Shard(0, 0, centers[i], polygons[i], c));
  };
  colorMode(RGB);
  blendMode(BLEND);
}

function clear_canvas() {
  inner_canvas.gb.clear();
}

function save() {
  this.inner_canvas.save();
}

function main_window_draw() {
  //main_canvas.background('#ff');
  strokeWeight(2);
  for (var i = this.bgShards.length - 1; i >= 0; i--) {
    this.bgShards[i].display(null, true); // no rotation
  }
  strokeWeight(1);
}

window.onresize = function() {
  main_canvas.size(window.innerWidth, window.innerHeight);
  draw_bg_tiles();
  main_window_draw();
}




