'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _keyMapping;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var w = document.documentElement.clientWidth * .98;
var h = document.documentElement.clientHeight * .98;

var keyMapping = (_keyMapping = {}, _defineProperty(_keyMapping, 38, 'DOWN'), _defineProperty(_keyMapping, 40, 'UP'), _keyMapping);

var keyStream = Rx.Observable.fromEvent($(document), 'keydown').map(function (_ref) {
  var keyCode = _ref.keyCode;
  return keyCode;
}).map(function (keyCode) {
  return keyMapping[keyCode] ? keyMapping[keyCode] : keyCode;
});
var delayStream = Rx.Observable.interval(50).timeInterval().map(function (_ref2) {
  var interval = _ref2.interval;
  return interval;
}).map(function (t) {
  return t - 50;
}).map(function (t) {
  return t < 0 ? 0 : t;
});
var mouseMoveStream = Rx.Observable.fromEvent($('html'), 'mousemove');
var mouseClickStream = Rx.Observable.fromEvent($('html'), 'click').withLatestFrom(delayStream).filter(function (_ref3) {
  var _ref4 = _slicedToArray(_ref3, 2);

  var event = _ref4[0];
  var delay = _ref4[1];
  return delay === 0;
}).map(function (_ref5) {
  var _ref6 = _slicedToArray(_ref5, 1);

  var event = _ref6[0];
  return event;
});

var powStream = keyStream.filter(function (keyCode) {
  return keyCode === 'DOWN' || keyCode === 'UP';
}).startWith('UP').map(function (keyName) {
  return keyName === 'UP' ? 0.1 : -0.1;
}).scan(function (pow, powDiff) {
  var newPow = pow + powDiff;
  return newPow < .1 ? .1 : newPow;
}, 1);

var treePropsStream = mouseClickStream.startWith('click').scan(function (tree) {
  return treeCreator.grow(tree);
}, treeCreator.initNode());

var angleStream = mouseMoveStream.map(function (_ref7) {
  var clientX = _ref7.clientX;
  var clientY = _ref7.clientY;
  return {
    theta1: 2 * Math.PI * clientX / w - Math.PI,
    theta2: 2 * Math.PI * clientY / h - Math.PI
  };
}).startWith({ theta1: 0, theta2: 0 });

var finalStream = Rx.Observable.combineLatest(treePropsStream, angleStream, powStream, delayStream);

finalStream.subscribe(function (_ref8) {
  var _ref9 = _slicedToArray(_ref8, 4);

  var tree = _ref9[0];
  var _ref9$ = _ref9[1];
  var theta1 = _ref9$.theta1;
  var theta2 = _ref9$.theta2;
  var powStream = _ref9[2];
  var delay = _ref9[3];

  treeCreator.draw(tree, theta1, theta2, powStream, delay);
}, function (err) {
  return console.log('Error: ' + err);
}, function () {
  return console.log('Completed');
});