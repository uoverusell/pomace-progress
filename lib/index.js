'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pomaceBase = require('pomace-base');

var _pomaceTap = require('pomace-tap');

var _pomaceTap2 = _interopRequireDefault(_pomaceTap);

var _pomaceCabinet = require('pomace-cabinet');

var _pomaceCabinet2 = _interopRequireDefault(_pomaceCabinet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (group) {
  var progress = (0, _pomaceBase.buildDOM)('<div class="pomace-progress">');
  var container = (0, _pomaceCabinet2.default)({ rows: 1, cols: group.length });
  var animaTime = 500;
  var element = {
    squares: [],
    squareMasks: [],
    squareMaskDely: [],
    squareBottoms: [],
    lines: [],
    lineMasks: [],
    lineMaskDely: [],
    taps: [],
    marks: []
  };

  var animation = function animation(animaTime, delay) {
    return {
      transition: 'margin-left ' + animaTime + 'ms linear ' + delay + 'ms',
      webkitTransition: 'margin-left ' + animaTime + 'ms linear ' + delay + 'ms',
      mozTransition: 'margin-left ' + animaTime + 'ms linear ' + delay + 'ms',
      oTransition: 'margin-left ' + animaTime + 'ms linear ' + delay + 'ms'
    };
  };

  var build = function build() {
    group.map(function (data, k) {
      var item = (0, _pomaceTap2.default)(data);
      var mark = (0, _pomaceBase.buildDOM)('<div class="progress-mark">');
      var square = (0, _pomaceBase.buildDOM)('<div class="progress-square">');
      var squareBottom = (0, _pomaceBase.buildDOM)('<div class="progress-square-bottom">');
      var squareMask = (0, _pomaceBase.buildDOM)('<div class="progress-square-mask">');
      var line = (0, _pomaceBase.buildDOM)('<div class="progress-line">');
      var lineMask = (0, _pomaceBase.buildDOM)('<div class="progress-line-mask">');

      element.lines.push(line);
      element.lineMasks.push(lineMask);
      element.squares.push(square);
      element.squareMasks.push(squareMask);
      element.squareBottoms.push(squareBottom);
      element.taps.push(item);
      element.marks.push(mark);

      square.$$.last(squareBottom);
      square.$$.last(squareMask);
      line.$$.last(lineMask);
      mark.$$.last(square);
      mark.$$.last(line);

      container.$$.col(0, k).$$.css({ position: 'relative', overflow: 'hidden' });
      container.$$.col(0, k).$$.last(mark);
      container.$$.col(0, k).$$.last(item);

      mark.$$.css({ overflow: 'hidden', position: 'relative' });
      lineMask.$$.css({ marginLeft: '0%' });
      squareMask.$$.css({ marginLeft: '0%' });

      if (k === 0) {
        line.$$.css({
          position: 'relative',
          left: '50%'
        });
      }
    });
  };

  var reset = function reset() {
    var lines = element.lines,
        lineMasks = element.lineMasks,
        lineMaskDely = element.lineMaskDely,
        squares = element.squares,
        squareMasks = element.squareMasks,
        squareMaskDely = element.squareMaskDely;


    lineMasks.map(function (lineMask, k) {
      var delay = animaTime * k;

      lineMaskDely[k] = delay;
      lineMask.$$.css(animation(animaTime, delay));
    });

    squareMasks.map(function (squareMask, k) {
      var delay = animaTime * k;

      switch (k) {
        case 0:
          squareMaskDely[k] = 0;
          squareMask.$$.css(animaTime / 3, 0);
          break;
        case squareMasks.length - 1:
          squareMaskDely[k] = delay + animaTime * (3 / 4);
          squareMask.$$.css(animation(animaTime / 3, delay + animaTime * (3 / 4)));
          break;
        default:
          squareMaskDely[k] = delay + animaTime / 3;
          squareMask.$$.css(animation(animaTime / 3, delay + animaTime / 3));
      }
    });
  };

  build();
  progress.$$.css({ display: 'none' });
  progress.$$.last(container);
  progress.$$.extends({
    play: function play() {
      var lines = element.lines,
          lineMasks = element.lineMasks,
          squares = element.squares,
          squareMasks = element.squareMasks,
          squareBottoms = element.squareBottoms;

      var autoSquare = function autoSquare() {

        lines.map(function (line, i) {
          if (i === 0 || i === lines.length - 1) {
            line.$$.css({
              width: '50%'
            });
          }
          line.$$.css({
            marginTop: '1.25rem',
            marginBottom: '1.25rem',
            height: '0.15rem'
          });
          lineMasks[i].$$.css({
            height: '0.15rem'
          });
        });

        squares.map(function (sqr, i) {
          sqr.$$.css({
            overflow: 'hidden',
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 1,
            marginTop: -lines[i].offsetWidth / (i === 0 || i === lines.length - 1 ? 3 : 6) + 'px',
            marginLeft: -lines[i].offsetWidth / (i === 0 || i === lines.length - 1 ? 3 : 6) + 'px',
            width: parseInt(lines[i].offsetWidth / 3 * (i === 0 || i === lines.length - 1 ? 2 : 1)) + 'px',
            height: parseInt(lines[i].offsetWidth / 3 * (i === 0 || i === lines.length - 1 ? 2 : 1)) + 'px'
          });
          squareBottoms[i].$$.css({
            width: parseInt(lines[i].offsetWidth / 3 * (i === 0 || i === lines.length - 1 ? 2 : 1)) + 'px',
            height: parseInt(lines[i].offsetWidth / 3 * (i === 0 || i === lines.length - 1 ? 2 : 1)) + 'px'
          });
          squareMasks[i].$$.css({
            position: 'absolute',
            zIndex: 1,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          });
        });
      };

      reset();

      container.$$.autoWidth();

      window.addEventListener('resize', function () {
        autoSquare();
      }, false);

      progress.$$.css({ display: 'block' });
      autoSquare();
    },
    get: function get(name) {
      return element[name];
    },


    isUp: 0,

    up: function up(code) {
      var _this = this;

      reset();

      var lines = element.lines,
          lineMasks = element.lineMasks,
          lineMaskDely = element.lineMaskDely,
          squares = element.squares,
          squareMasks = element.squareMasks,
          squareMaskDely = element.squareMaskDely,
          taps = element.taps;


      if (code - this.isUp === 1) {
        (function () {
          //progress 1 step
          var lineM = lineMasks[code - 1];
          var squareM = squareMasks[code - 1];
          var square = squares[code - 1];
          var tap = taps[code - 1];

          setTimeout(function () {
            lineM.$$.css(animation(animaTime, code - 1 === 0 ? animaTime / 3 : 0));
            lineM.$$.css({
              marginLeft: '100%'
            });
          }, 0);

          setTimeout(function () {
            squareM.$$.css(animation(animaTime / 3, code - 1 === 0 ? 0 : animaTime / 3));
            squareM.$$.css({
              marginLeft: '100%'
            });
          }, 0);

          tap.$$.addClass('progress-up');
          _this.isUp++;
        })();
      } else if (code - this.isUp === -1) {
        (function () {
          //back 1 step
          var lineM = lineMasks[code];
          var squareM = squareMasks[code];
          var square = squares[code];
          var tap = taps[code];

          setTimeout(function () {
            lineM.$$.css(animation(animaTime, 0));
            lineM.$$.css({
              marginLeft: '0%'
            });
          }, 0);

          setTimeout(function () {
            squareM.$$.css(animation(animaTime / 3, animaTime / 3));
            squareM.$$.css({
              marginLeft: '0%'
            });
          }, 0);

          tap.$$.removeClass('progress-up');

          if (_this.isUp > 0) {
            _this.isUp--;
          }
        })();
      } else {
        var _loop = function _loop(i) {
          var lm = lineMasks[lineMasks.length - i - 1];
          var sm = squareMasks[squareMasks.length - i - 1];

          if (lineMasks[i] && lines[i]) {
            setTimeout(function () {
              lm.$$.css(animation(animaTime, lineMaskDely[i]));
              sm.$$.css(animation(animaTime / 3, squareMaskDely[i]));
              lm.$$.css({ marginLeft: '0%' });
              sm.$$.css({ marginLeft: '0%' });
              taps[i].$$.removeClass('progress-up');
            }, 0);

            if (_this.isUp > 0) {
              _this.isUp--;
            }
          }
        };

        //back multi step
        for (var i = lineMaskDely.length - 1; i >= 0; i--) {
          _loop(i);
        }

        //progress multi step

        var _loop2 = function _loop2(_i) {
          if (_i >= code) {
            return 'break';
          }

          var lm = lineMasks[_i];
          var sm = squareMasks[_i];

          if (lineMasks[_i] && lines[_i]) {
            setTimeout(function () {
              lm.$$.css(animation(animaTime, lineMaskDely[_i]));
              sm.$$.css(animation(animaTime / 3, squareMaskDely[_i]));
              lm.$$.css({ marginLeft: '100%' });
              sm.$$.css({ marginLeft: '100%' });
              taps[_i].$$.addClass('progress-up');
            }, 0);

            _this.isUp++;
          }
        };

        for (var _i = 0; _i < lineMaskDely.length; _i++) {
          var _ret4 = _loop2(_i);

          if (_ret4 === 'break') break;
        }
      }
    }
  });

  return progress;
};