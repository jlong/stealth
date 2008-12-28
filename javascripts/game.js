function image(src) {
  var img = new Image();
  img.src = src;
  return img;
}

var Sprite = Class.create({
  setPosition: function(x, y) {
    this.x = x;
    this.y = y;
  }
});

var Star = Class.create(Sprite, {
  initialize: function(x, y, velocity) {
    this.setPosition(x, y)
    this.setVelocity(velocity);
  },
  
  draw: function(context) {
    context.drawImage(Game.starImage, this.frameStartX, 0, 5, 5, this.x, this.y, 5, 5);
  },
  
  setVelocity: function(velocity) {
    this.velocity = velocity;
    this.frameStartX = (this.velocity - 1) * 5;
  }
});

var Ship = Class.create(Sprite, {
  initialize: function(x, y) {
    this.setPosition(x, y);
  },
  
  draw: function(context) {
    context.drawImage(Game.shipImage, this.x - 50, this.y - 38);
  }
});

var Game = Class.create({
  initialize: function(canvas) {
    this.paused = true;
    this.timeout = 1000 / Game.frameRate;
    this.setCanvas(canvas);
    this.ship = new Ship(50, 50);
    this.stars = [];
    for (var i = 0; i < 100; i++) this.stars.push(new Star());
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
  
  drawShip: function() {
    this.ship.draw(this.context);
  },
  
  drawStars: function() {
    for (var i = 0; i < this.stars.size(); i++) this.stars[i].draw(this.context);
  },
  
  main: function() {
    this.clearCanvas();
    this.animateStars();
    this.drawStars();
    this.drawShip();
    this.setTimeout();
  },
  
  pause: function() {
    this.paused = true;
  },
  
  randomizeStars: function() {
    var width = this.canvas.width - 5,  // subtract the width of the star
        height = this.canvas.height - 5;
    for (var i = 0; i < this.stars.size(); i++) {
      var star = this.stars[i];
      star.setPosition(Math.floor(Math.random() * width), Math.floor(Math.random() * height));
      star.setVelocity(Math.floor(Math.random() * 10) + 1);
    }
  },
  
  setCanvas: function(canvas) {
    this.canvas = canvas = $(canvas);
    this.canvas.setStyle({
      background: 'black',
      cursor: 'none',
      padding: 0
    });
    this.canvas.observe('mousemove', this.onmousemove.bind(this));
    this.context = canvas.getContext('2d');
  },
  
  setTimeout: function() {
    if (!this.paused) setTimeout(this.main.bind(this), this.timeout);
  },
  
  start: function() {
    this.paused = false;
    this.setTimeout();
  },
  
  onmousemove: function(event) {
    this.ship.setPosition(Event.pointerX(event), Event.pointerY(event));
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