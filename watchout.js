// start slingin' some d3 here.

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};

var gameStats = {
  highScore: 0,
  currentScore: 0,
  collisions: 0
};

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var updateScore = function() {
  d3.select('.current')
    .select('span')
    .text(gameStats.currentScore.toString());
};

var updateHighScore = function() {
  if (gameStats.currentScore > gameStats.highScore) {
    gameStats.highScore = gameStats.currentScore;
    d3.select('.high')
    .select('span')
    .text(gameStats.currentScore.toString());
  }
};

var updateCollisions = function() {
  gameStats.collisions++;
  d3.select('.collisions')
    .select('span')
    .text(gameStats.collisions.toString());
};

var gameBoard = d3.select('.container').append('svg:svg')
                  .attr('width', gameOptions.width)
                  .attr('height', gameOptions.height);

var dragmove = function(d) {
  d3.select(this)
    .attr('cx', d3.event.x)
    .attr('cy', d3.event.y);
};

var drag = d3.behavior.drag()
    .on('drag', dragmove);

d3.select('svg')
  .append('svg:circle')
  .attr('class', 'player')
  .attr('cx', 50)
  .attr('cy', 50)
  .attr('r', 10)
  .attr('fill', 'gold')
  .call(drag);



var createEnemies = function() {
  var enemies = [];
  for (var i = 0; i < gameOptions.nEnemies; i++) {
    enemies.push({
      id : i,
      x : Math.random() * 100,
      y : Math.random() * 100
    });
  }
  return enemies;
};

var touchMap = {};
var render = function(enemy_data) {
  var enemies = gameBoard.selectAll('circle.enemy')
                         .data(enemy_data, function(d,i) {return i;} );

  enemies.enter()
         .append('svg:circle')
         .attr('class', 'enemy')
         .attr('cx', function(enemy) {return axes.x(enemy.x);})
         .attr('cy', function(enemy) {return axes.y(enemy.y);})
         .attr('id', function(enemy) {return enemy.id;})
         .attr('r',0);

  enemies.exit()
         .remove();



  var checkCollision = function(enemy, callback) {

    var player = gameBoard.selectAll('circle.player');
    var radiusSum = parseFloat(enemy.attr('r')) + parseFloat(player.attr('r'));
    var xDiff = parseFloat(enemy.attr('cx')) - parseFloat(player.attr('cx'));
    var yDiff = parseFloat(enemy.attr('cy')) - parseFloat(player.attr('cy'));
    var separation = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2));
    if (separation <= radiusSum && !touchMap[enemy.attr('id')]) {
      callback(enemy);
      touchMap[enemy.attr('id')] = true;
    }
    else if (touchMap[enemy.attr('id')] === true && separation > radiusSum) {
      touchMap[enemy.attr('id')] = false;
    }
  };

  var onCollision = function(enemy){
    updateHighScore();
    enemy.attr('fill', 'blue');
    gameStats.currentScore = 0;
    updateScore();
    updateCollisions();
  };

  var tweenWithCollisionDetection = function(endData) {
    var enemy = d3.select(this);

    var startPos = {
      x : parseFloat(enemy.attr('cx')),
      y : parseFloat(enemy.attr('cy'))
    };

    var endPos = {
      x : axes.x(endData.x),
      y : axes.y(endData.y)
    };

    return function(t) {

      checkCollision(enemy, onCollision);

      var enemyNextPos = {
        x : startPos.x + (endPos.x - startPos.x)*t,
        y : startPos.y + (endPos.y - startPos.y)*t
      };

      enemy.attr('cx', enemyNextPos.x)
           .attr('cy', enemyNextPos.y);
    };
  } ;

  enemies
    .transition()
      .duration(500)
      .attr('r',10)
    .transition()
      .duration(2000)
      .tween('custom', tweenWithCollisionDetection);


};

var play = function() {
  var gameTurn = function() {
    var newEnemyPositions = createEnemies();
    render(newEnemyPositions);
  };

  //gameTurn();
  setInterval(gameTurn, 2000);

  setInterval(function() {
    gameStats.currentScore++;
    updateScore();
  }, 50);

};

play();
