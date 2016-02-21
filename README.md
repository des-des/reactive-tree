# ES2015 boilerplate

##### Run your tests *fast*

### What
 * Boilerplate for testing and building es6 projects.

### Why
 * Tests can be slow to run when you need to traspile your code.
 * Bored of setting up the same build scripts.

### How
 * Using babel to watch and build source and tests.
 * Using nodemon to test the built code.


 1. Put your code into `./src/`.
 2. Put your tests in `./test/`. give your tests the extension. `.test.js`
 3. Use the scripts below (from `package.json`).

Command | Description
---|---
`dev:test` | Watch you source `./src` and your tests `./test`, and test on file change. **Fast**.
`test` | Run tests and check for 100% coverage. **Slow**.
`build` | Build `./src` to `./lib`
`dev:build` | Build `./src` to `./lib` on file change.
