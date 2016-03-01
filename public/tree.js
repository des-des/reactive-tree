'use strict';

var treeCreator = function () {
  var w = $(window).width() * .995;
  var h = $(window).height() * .995;

  var getId = function (id) {
    return function () {
      return id++;
    };
  }(0);

  var flatten1 = function flatten1(arrs) {
    return arrs.reduce(function (flatArr, arr) {
      return flatArr.concat(arr);
    }, []);
  };

  var createNodes = function createNodes(nodePropsTree, theta1, theta2, pow, lastNode, i) {
    var dir = nodePropsTree.dir;
    var dTheta = !dir ? 0 : dir === 'left' ? theta1 : theta2;
    var len = 1.5 / Math.pow(i + 1, pow);
    var theta = lastNode.theta + dTheta;
    var x1 = lastNode.x2;
    var y1 = lastNode.y2;
    var x2 = x1 + 2 * nodePropsTree.r * Math.cos(theta) * len;
    var y2 = y1 + 2 * nodePropsTree.r * Math.sin(theta) * len;
    var id = nodePropsTree.id;
    var node = { theta: theta, x1: x1, y1: y1, x2: x2, y2: y2, id: id };
    var children = nodePropsTree.children;
    return [node].concat(children.length ? flatten1(children.map(function (nodePropsTree) {
      return createNodes(nodePropsTree, theta1, theta2, pow, node, i + 1);
    })) : []); // concating may be to slow (use immutable.js?)
  };

  var testNodes = {
    id: getId(),
    theta: 0,
    r: 1,
    children: []
  };

  var _grow = function _grow(tree) {
    // let children = tree.children;
    if (tree.children.length != 0) {
      tree.children.forEach(function (child) {
        return _grow(child);
      });
    } else {
      tree.children = [{
        id: getId(),
        r: 1,
        dir: 'left',
        children: []
      }, {
        id: getId(),
        dir: 'right',
        r: 1,
        children: []
      }];
    }
  };

  var svg = d3.select("body").append("svg").attr("width", w).attr("height", h).append("g");

  var diagonal = d3.svg.diagonal().source(function (d) {
    var out = {
      "x": d.x1,
      "y": d.y1
    };
    return out;
  }).target(function (d) {
    return {
      "x": d.x2,
      "y": d.y2
    };
  }).projection(function (d) {
    return [w * .5 + d.y * 50, h - d.x * 50 + 10];
  });

  return {
    draw: function draw(tree, theta1, theta2, pow, delay) {
      var links = createNodes(tree, theta1, theta2, pow, { x2: 3, y2: 0, theta: 0 }, 0);

      var selection = svg.selectAll('.branch').data(links, function (d) {
        return d.id;
      }); //.attr('d', diagonal)

      selection.transition().duration(50 + delay * 2).ease("linear").attr('d', diagonal);

      selection.enter().append('path').attr("stroke-width", 2).attr("fill", 'none').attr('class', 'branch').attr("stroke", "black").attr('d', diagonal);
    },
    grow: function grow(testNodes) {
      _grow(testNodes); // mutative
      return testNodes;
    },
    initNode: function initNode() {
      return testNodes;
    }
  };
}();