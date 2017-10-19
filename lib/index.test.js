'use strict';

var _index = require('./index');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

describe('hapi-auth-firebase', function () {
  it('should register auth scheme', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var server, next;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // register(server, options, next)
            server = {
              auth: {
                scheme: jest.fn()
              }
            };
            next = jest.fn();
            _context.next = 4;
            return (0, _index.register)(server, {}, next);

          case 4:
            expect(server.auth.scheme).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));
});