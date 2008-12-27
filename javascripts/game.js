function image(src) {
  var img = new Image();
  img.src = src;
  return img;
}

var Game = Class.create({
  initialize: function(canvas) {
    this.setCanvas(canvas);
    this.stars = [];
    this.paused = true;
    this.timeout = 1000 / Game.frameRate
    for (var i = 0; i < 100; i++) this.stars.push(new Object());
  },
  
  animateStars: function() {
    for (var i = 0; i < this.stars.size(); i++) {
      var star = this.stars[i];
      star.y = star.y + star.velocity;
      if (star.y > this.canvas.height) star.y = 0;
    }
  },
  
  clearCanvas: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  
  main: function() {
    this.clearCanvas();
    this.animateStars();
    this.drawStars();
    this.setTimeout();
  },
  
  drawStars: function() {
    for (var i = 0; i < this.stars.size(); i++) {
      var star = this.stars[i];
      this.context.drawImage(Game.starImage, star.frameStartX, 0, 5, 5, star.x, star.y, 5, 5);
    }
  },
  
  pause: function() {
    this.paused = true;
  },
  
  randomizeStars: function() {
    var width = this.canvas.width - 5,  // subtract the width of the star
        height = this.canvas.height - 5;
    for (var i = 0; i < this.stars.size(); i++) {
      var star = this.stars[i];
      star.x = Math.floor(Math.random() * width);
      star.y = Math.floor(Math.random() * height);
      star.velocity = Math.floor(Math.random() * 10) + 1;
      star.frameStartX = (star.velocity - 1) * 5
    }
  },
  
  setCanvas: function(canvas) {
    this.canvas = canvas = $(canvas);
    this.canvas.setStyle({
      background: 'black',
      padding: 0
    })
    this.context = canvas.getContext('2d');
  },
  
  setTimeout: function() {
    if (!this.paused) setTimeout(this.main.bind(this), this.timeout);
  },
  
  start: function() {
    this.paused = false;
    this.setTimeout();
  }
});

Object.extend(Game, {
  starImage: image('/images/star.png'),
  shipImage: image('/images/ship.png'),
  frameRate: 24
});

$loaded = false;
Event.observe(document, 'dom:loaded', function() {
  if (!$loaded) {
    var game = new Game('canvas');
    var resize = function() {
      game.canvas.width = document.viewport.getWidth();
      game.canvas.height = document.viewport.getHeight();
      game.randomizeStars();
    }
    Event.observe(window, 'resize', resize);
    resize();
    game.start();
  }
});