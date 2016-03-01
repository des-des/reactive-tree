const w = document.documentElement.clientWidth*.98;
const h = document.documentElement.clientHeight*.98;

const keyMapping = {
  [38]: 'DOWN',
  [40]: 'UP'
};

const keyStream = Rx.Observable.fromEvent($(document), 'keydown')
  .map(({keyCode}) => keyCode)
  .map(keyCode => keyMapping[keyCode] ? keyMapping[keyCode] : keyCode)
const delayStream = Rx.Observable
  .interval(40).timeInterval()
  .map(({interval}) => interval)
  .map(t => t - 40)
  .map(t => t < 0 ? 0 : t);
const mouseMoveStream = Rx.Observable.fromEvent($('html'), 'mousemove')
const mouseClickStream = Rx.Observable.fromEvent($('html'), 'click')
  .withLatestFrom(delayStream)
  .filter(([event, delay]) =>  delay === 0)
  .map(([event]) => event);

const powStream = keyStream
  .filter(keyCode => {
    return keyCode === 'DOWN' || keyCode === 'UP'
  }).startWith('UP')
  .map(keyName => keyName === 'UP' ? 0.1 : -0.1)
  .scan((pow, powDiff) => {
    const newPow = pow + powDiff;
    return newPow < .1 ? .1 : newPow;
  }, 1);

const treePropsStream = mouseClickStream.startWith('click')
  .scan(tree => treeCreator.grow(tree), treeCreator.initNode())

const angleStream = mouseMoveStream
  .map(({clientX, clientY}) => ({
    theta1: 2*Math.PI*clientX/w - Math.PI,
    theta2: 2*Math.PI*clientY/h - Math.PI
  })).startWith({theta1:0, theta2:0});


const finalStream = Rx.Observable.combineLatest(
  treePropsStream,
  angleStream,
  powStream,
  delayStream
);

finalStream.subscribe(
  ([tree, {theta1, theta2}, powStream, delay]) => {
    treeCreator.draw(tree, theta1, theta2, powStream, delay )
  },
  err => console.log(`Error: ${err}`),
  () => console.log('Completed')
)
