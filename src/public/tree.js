const treeCreator = (() => {
  const w = $(window).width()*.995;
  const h = $(window).height()*.995;

  const getId = ((id) => () => id++)(0);

  const flatten1 = (arrs) =>
    arrs.reduce((flatArr, arr) => flatArr.concat(arr), []);

  const createNodes = (nodePropsTree, theta1, theta2, pow, lastNode, i) => {
    const dir = nodePropsTree.dir;
    const dTheta = !dir
      ? 0
      : dir === 'left'
        ? theta1 : theta2;
    const len = 1.5/Math.pow(i+1, pow);
    const theta = lastNode.theta + dTheta;
    const x1 = lastNode.x2;
    const y1 = lastNode.y2;
    const x2 = x1 + 2*nodePropsTree.r*Math.cos(theta)*len;
    const y2 = y1 + 2*nodePropsTree.r*Math.sin(theta)*len;
    const id = nodePropsTree.id;
    const node = {theta, x1, y1, x2, y2, id};
    const children = nodePropsTree.children;
    return [node].concat(children.length ?
      flatten1(children.map(nodePropsTree =>
        createNodes(nodePropsTree, theta1, theta2, pow, node, i+1)
      )) : []
    ); // concating may be to slow (use immutable.js?)
  };

  const testNodes = {
    id: getId(),
    theta: 0,
    r: 1,
    children: []
  };

  const grow = tree => {
    // let children = tree.children;
    if (tree.children.length != 0) {
      tree.children.forEach(child => grow(child));
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

  const svg = d3.select("body").append("svg")
  .attr("width", w)
  .attr("height", h)
  .append("g")

  const diagonal = d3.svg.diagonal()
    .source(function(d) {
      var out = {
        "x" : d.x1,
        "y" : d.y1
      };
      return out;
    })
    .target(function(d) {
      return {
        "x" : d.x2,
        "y" : d.y2
      };
    })
    .projection(function(d) {
      return [w*.5 + d.y*50, h-d.x*50 + 10];
    });

  return {
    draw: (tree, theta1, theta2, pow, delay) => {
      const links = createNodes(
        tree,
        theta1,
        theta2,
        pow,
        {x2:3, y2:0, theta:0},
        0
      );

      const selection = svg.selectAll('.branch')
        .data(links, d => {
          return d.id
        })//.attr('d', diagonal)

      selection.transition().duration(50+delay*2)
        .ease("linear").attr('d', diagonal)

      selection.enter()
        .append('path')
        .attr("stroke-width", 2)
        .attr("fill", 'none')
        .attr('class', 'branch')
        .attr("stroke", "black")
        .attr('d', diagonal);
    },
    grow: (testNodes) => {
      grow(testNodes); // mutative
      return testNodes;
    },
    initNode: () => testNodes
  }
})()
