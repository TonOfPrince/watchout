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


var gameBoard = d3.select('.container').append('svg:svg')
                  .attr('width', gameOptions.width)
                  .attr('height', gameOptions.height);

// var playerDat = {
//   x: 50,
//   y: 50,
// };

// var playerData = [playerDat];

// var player = gameBoard.selectAll('circle.player')
//                       .data(playerData, function(d,i) {return i;});

// player.enter()
//       .append('svg:circle')
//       .attr('class', 'player')
//       .attr('cx', function(player) {return axes.x(player.x);})
//       .attr('cy', function(player) {return axes.y(player.y);})
//       .attr('r', 10)
//       .attr('fill', 'gold')
//       .call(drag);

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
      //id : i,
      x : Math.random() * 100,
      y : Math.random() * 100
    });
  }
  return enemies;
};

// var setupDragging = function() {
//   var that = this;
//   var drag = d3.behavior.drag().on('drag', function() {
//     that.moveRelative(d3.event.dx, d3.event.dy);
//   });
//   return this.el.call(drag);
// };



var render = function(enemy_data) {
  var enemies = gameBoard.selectAll('circle.enemy')
                         .data(enemy_data, function(d,i) {return i;} );
  // console.log(enemy_data);

  enemies.enter()
         .append('svg:circle')
         .attr('class', 'enemy')
         .attr('cx', function(enemy) {return axes.x(enemy.x);})
         .attr('cy', function(enemy) {return axes.y(enemy.y);})
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
      .duration(2000)
      .tween('custom', tweenWithCollisionDetection);


};

var play = function() {
  var gameTurn = function() {
    //debugger;
    var newEnemyPositions = createEnemies();
    render(newEnemyPositions);
  };

  //gameTurn();
  //debugger;
  setInterval(gameTurn, 2000);

};

play();



// var circle = d3.select('svg')
//                .append('svg:circle')
//                .attr('cx', 50)
//                .attr('cy', 50)
//                .attr('r', 10);

// var dot = d3.select('svg')
//                .append('svg:circle')
//                .attr('cx', 50)
//                .attr('cy', 50)
//                .attr('r', 5)
//                .style('fill', 'green');

// var player = d3.select('svg')
//                .append('svg:circle')
//                .attr('cx', 80)
//                .attr('cy', 80)
//                .attr('r', 5)
//                .style('fill', 'gold');
