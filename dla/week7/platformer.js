var CANVAS_HEIGHT;
var CANVAS_WIDTH;
var backgroundGif

var GRAVITY = .4
var JUMP = 8
var MAX_JUMPS = 2;

var lastPlatformCorner
var platforms;
var player;
var playerImg

var PLATFORM_SPEED = 5;
var PLATFORM_INTERVAL = 10;

var track
var analyzer;
var fft;
var peak;

var playbutton;

var currentLevel = 0; 
var keepText = 5;

function preload() {
  track = loadSound("lean_on.mp3");

}

function setup() {
  CANVAS_HEIGHT = windowHeight;
  CANVAS_WIDTH = windowWidth;

  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  backgroundGif = loadGif('img/lights.gif');

  playerImg = loadGif('img/runner.gif');

  playbutton = createButton('Play');
  playbutton.position(25, 25);
  playbutton.mousePressed(startStory);
  playbutton.hide();

  //player 
  player = createSprite(100, height - 200, 75, 75);
  player.velocity.x = 0;
  player.setCollider('rectangle', 0, 0, 75, 75);
  player.addImage(playerImg);
  player.position.x = 200;
  player.position.y = 200;
  player.jumps = 0;

  // music visualizer
  analyzer = new p5.Amplitude();
  analyzer.setInput(track);
  fft = new p5.FFT();

  platforms = new Group();

  while(!backgroundGif.loaded) {}
  playbutton.show()
}

var story = ["I'm not sure how it started.", "it doesn't seem real anymore...", "...", "really wanna know, huh?", "me too. There isn't any plot yet."]
var txt;
function draw() {
  background(255, 255, 255, 0);
  image(backgroundGif, 0, 0, width, height);
  textSize(36);
  textAlign(CENTER);
  fill(200, 200, 200)

  // draw the waveform of the playing audio in the background
  peak = 0
  stroke(201, 12, 109)
  noFill();
  var waveform = fft.waveform();  // analyze the waveform
  beginShape();
  strokeWeight(5);
  for (var i = 0; i < waveform.length; i++){
    peak+= abs(waveform[i])
    var x = map(i, 0, waveform.length, 0, width);
    var y = map(waveform[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();
  peak = (peak/waveform.length) * 10;

  //change the level based on recent amplitude
  if (currentLevel < floor(peak)) {
    if(!keepText){
      currentLevel++;
      keepText = 3;
    }
  }

//basically the 'main loop'
if (track.isPlaying()) {
  // change and draw the text
  if (currentLevel < story.length) {
      txt = story[currentLevel];
  }
  stroke(0);
  fill(255,255,255);
  text(txt, CANVAS_WIDTH/2, CANVAS_HEIGHT/4);
  text(parseInt(currentLevel), CANVAS_WIDTH-100, 0);
  // delete and draw platforms
  for (var i = 0; i < platforms.length; i++) {
    platform = platforms[i];
    if (platform.position.x + platform.width < 0) {

      platforms[i].remove();
    }
  }

  //keep text onscreen
  if(frameCount % 60 == 0) {
    if(keepText) {
      keepText--;
    }
  }

  // spawn new platform
  if(frameCount % PLATFORM_INTERVAL == 0) {
    var p = createPlatformAtAmp();
    platforms.add(p);
  }

  // top and bottom of screen
  if (player.position.y < 0) {
    player.position.y = 0;
  }

  if (player.position.y > CANVAS_HEIGHT) {
    player.position.y = CANVAS_HEIGHT;
  }

  // set up collisions with platforms
  if (platforms.displace(player)){
  }

  if(platforms.overlap(player)) {
    player.velocity.x = -PLATFORM_SPEED;
    player.jumps = 0;

  }

  // gravity on player
  player.velocity.y += GRAVITY;

  //player motion
  if(keyDown('a')) {
    player.velocity.x = -5;
  } else if (keyDown('d')) {
    player.velocity.x = 5;
  }

  if (keyWentDown('w')) {
    if (player.jumps < 2) {
      player.velocity.y = -JUMP;
      player.jumps++;
    } 
  }

  stroke(255);
  strokeWeight(5);
  drawSprites();
}
}

function createPlatformAtAmp() {
  var vol = analyzer.getLevel();
  var y = map(vol, 0, 1, 10, height-100)

  platform = createSprite(width, height-y, 50, 20);
  platform.rotateToDirection = true;
  platform.velocity.x = -PLATFORM_SPEED;
  platform.setCollider('rectangle', 0, 0, 50, 20);

  colorMode(HSB, 255)
  var h, b;
  h = map(peak, 0, 2, 0, 255);
  b = map(vol, 0, 1, 100, 255);
  platform.shapeColor = color(h, 150, b);
  colorMode(RGB, 255);
  
  return platform;
}

function startStory() {
  if(!track.isPlaying()) {
    track.play();
    playbutton.remove();
  }
}


