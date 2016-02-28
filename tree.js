'use strict';

var treeCreator = function () {
  var w = document.documentElement.clientWidth * .995;
  var h = document.documentElement.clientHeight * .995;

  var flatten1 = function flatten1(arrs) {
    return arrs.reduce(function (flatArr, arr) {
      return flatArr.concat(arr);
    }, []);
  };

  var createNodes = function createNodes(nodePropsTree, theta1, theta2, lastNode, i) {
    var dir = nodePropsTree.dir;
    var dTheta = !dir ? 0 : dir === 'left' ? theta1 : theta2;
    var len = 1 / Math.sqrt((i - 2) * (i - 2) + 1);
    var theta = lastNode.theta + dTheta;
    var x1 = lastNode.x2;
    var y1 = lastNode.y2;
    var x2 = x1 + 2 * nodePropsTree.r * Math.cos(theta) * len;
    var y2 = y1 + 2 * nodePropsTree.r * Math.sin(theta) * len;
    var node = { theta: theta, x1: x1, y1: y1, x2: x2, y2: y2 };
    var children = nodePropsTree.children;
    return [node].concat(children.length ? flatten1(children.map(function (nodePropsTree) {
      return createNodes(nodePropsTree, theta1, theta2, node, i + 1);
    })) : []); // concating may be to slow (use immutable.js?)
  };

  var testNodes = {
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
        r: 1,
        dir: 'left',
        children: []
      }, {
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
    draw: function draw(tree, theta1, theta2) {
      var links = createNodes(tree, theta1, theta2, { x2: 3, y2: 0, theta: 0 }, 0);

      var selection = svg.selectAll('.branch').data(links).attr('d', diagonal);

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