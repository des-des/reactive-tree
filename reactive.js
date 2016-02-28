'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var w = document.documentElement.clientWidth * .995;
var h = document.documentElement.clientHeight * .995;

var mouseMoveStream = Rx.Observable.fromEvent($('html'), 'mousemove');
var mouseClickStream = Rx.Observable.fromEvent($('html'), 'click');

var treePropsStream = mouseClickStream.scan(function (tree) {
  return treeCreator.grow(tree);
}, treeCreator.initNode());

var angleStream = mouseMoveStream.map(function (_ref) {
  var clientX = _ref.clientX;
  var clientY = _ref.clientY;
  return {
    theta1: Math.PI * clientX / w - Math.PI / 2,
    theta2: Math.PI * clientY / h - Math.PI / 2
  };
});

var finalStream = Rx.Observable.combineLatest(treePropsStream, angleStream);

finalStream.subscribe(function (_ref2) {
  var _ref3 = _slicedToArray(_ref2, 2);

  var tree = _ref3[0];
  var _ref3$ = _ref3[1];
  var theta1 = _ref3$.theta1;
  var theta2 = _ref3$.theta2;
  return treeCreator.draw(tree, theta1, theta2);
}, function (err) {
  return console.log('Error: ' + err);
}, function () {
  return console.log('Completed');
});