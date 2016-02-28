const w = document.documentElement.clientWidth*.995;
const h = document.documentElement.clientHeight*.995;

const mouseMoveStream = Rx.Observable.fromEvent($('html'), 'mousemove');
const mouseClickStream = Rx.Observable.fromEvent($('html'), 'click');

const treePropsStream = mouseClickStream
  .scan(tree => treeCreator.grow(tree), treeCreator.initNode())

const angleStream = mouseMoveStream
  .map(({clientX, clientY}) => ({
    theta1: Math.PI*clientX/w - Math.PI/2,
    theta2: Math.PI*clientY/h - Math.PI/2
  }));

const finalStream = Rx.Observable.combineLatest(treePropsStream, angleStream);

finalStream.subscribe(
  ([tree, {theta1, theta2}]) => treeCreator.draw(tree, theta1, theta2),
    err => console.log(`Error: ${err}`),
    () => console.log('Completed')
)
