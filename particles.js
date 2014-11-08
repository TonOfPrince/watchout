// start slingin' some d3 here.

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 50,
  padding: 20
};

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};


var gameBoard = d3.select('.container').append('svg:svg')
                  .attr('width', gameOptions.width)
                  .attr('height', gameOptions.height);



var createEnemies = function() {
  var enemies = [];
  for (var i = 0; i < gameOptions.nEnemies; i++) {
    enemies.push({
      id : i,
      x : Math.random() * 100,
      y : Math.random() * 100,
      mass: Math.random() * 4 + 2,
    });
  }
  return enemies;
};

var forceX = function(enemyA, enemyB, theta) {
  var distX = Math.pow(enemyA.x, 2) - Math.pow(enemyB.x, 2);
  return (enemyA.mass*enemyB.mass*Math.cos(theta)/Math.pow(distX,2));
};

var forceY = function(enemyA, enemyB, theta) {
  var distY = Math.pow(enemyA.y, 2) - Math.pow(enemyB.y, 2);
  return (enemyA.mass*enemyB.mass*Math.sin(theta)/Math.pow(distY,2));
};

var theta = function(enemyA, enemyB) {
  var distX = Math.pow(enemyA.x, 2) - Math.pow(enemyB.x, 2);
  var distY = Math.pow(enemyA.y, 2) - Math.pow(enemyB.y, 2);
  return Math.atan(distY/distX);
};

var accX = function(enemy, forceXSum) {
  return forceXSum/enemy.mass;
};

var accY = function(enemy, forceYSum) {
  return forceYSum/enemy.mass;
};

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
      .duration(20)
      .tween('custom', tweenWithCollisionDetection);

  //update enemy_data with new x, y coordinates
  for (var i = 0; i < gameOptions.nEnemies; i++) {
    enemies[i].x = ;
    enemies[i].y = ;
  }

  return enemies;

};

var play = function() {
  var newEnemyPositions = createEnemies();

  var gameTurn = function() {
    newEnemyPositions = render(newEnemyPositions);
  };

  //gameTurn();
  setInterval(gameTurn, 20);

};

play();
