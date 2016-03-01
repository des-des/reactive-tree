## [Demo Here](http://des-des.github.io/reactive-tree/)

# RxJS + D3 + Fractals

<!-- ### drawing a binary tree
First, we need to work out how to draw a fractal tree. The output of our tree drawing will be an array of branches, each will need a start position and an end position.

As we move our mouse around
Trying to find these positions relative to then origin leads to some nasty maths, much nicer we   -->

### RxJS
The inputs we are interested in (for now) are mouse move events and mouse clicks.

Each mouse move event will generate an x and y coordinate. We will map these to the angle change of branches from their parent at each split in the tree, x will define the angle of the left branch, while y will define the angle of the right branch.

We will map click events to growing the tree another iteration.

That is, the mouse events will reduce (actually scan, as we need the result after each click) to an object representing our trees structure, while the mouses position will map to pairs of angles defining how our branches bend in each split of the tree. Merged together, the combination of the latest output from these two streams will give us a complete representation of our binary tree.

<!--
### D3
Once we have our desired date we need to render our tree (outputted from our RxJS event stream) we can use D3 to render our tree.

We use a d3 diagonal generator to define how a links position maps to   

Command | Description
---|---
`dev:test` | Watch you source `./src` and your tests `./test`, and test on file change. **Fast**.
`test` | Run tests and check for 100% coverage. **Slow**.
`build` | Build `./src` to `./lib`
`dev:build` | Build `./src` to `./lib` on file change. -->
