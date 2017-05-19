'use strict';

var raiseError = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(errorFunc, errorContext) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return applyErrorFunc(errorFunc, errorContext);

          case 2:
            errorContext = _context.sent;
            return _context.abrupt('return', Boom[errorContext.errorType](errorContext.message, errorContext.scheme, errorContext.attributes));

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function raiseError(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var applyErrorFunc = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(errorFunc, errorContext) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!errorFunc) {
              _context2.next = 4;
              break;
            }

            _context2.next = 3;
            return errorFunc(errorContext);

          case 3:
            errorContext = _context2.sent;

          case 4:
            return _context2.abrupt('return', errorContext);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function applyErrorFunc(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Boom = require('boom');

module.exports = {
  register: register,
  raiseError: raiseError,
  applyErrorFunc: applyErrorFunc,
  firebaseAuthScheme: firebaseAuthScheme,
  authenticateRequest: authenticateRequest,
  unauthorizedError: unauthorizedError,
  verifyToken: verifyToken,
  extractTokenFromRequest: extractTokenFromRequest,
  getCredentialFromAuthHeader: getCredentialFromAuthHeader
};

function register(server, options, next) {
  server.auth.scheme('firebase', firebaseAuthScheme);
  return next();
}

function firebaseAuthScheme(server, options) {
  return {
    authenticate: authenticateRequest(server, options)
  };
}

function authenticateRequest(server, options) {
  var _this = this;

  return function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(request, reply) {
      var token, credentials;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              token = extractTokenFromRequest(request);

              if (token) {
                _context3.next = 3;
                break;
              }

              return _context3.abrupt('return', reply(unauthorizedError(options.errorFunc)));

            case 3:

              request.auth.token = token;

              _context3.prev = 4;
              _context3.next = 7;
              return verifyToken(options.firebaseAdmin, token);

            case 7:
              credentials = _context3.sent;

              reply.continue({
                credentials: credentials,
                artifacts: token
              });
              _context3.next = 14;
              break;

            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3['catch'](4);
              return _context3.abrupt('return', reply(unauthorizedError(options.errorFunc, {
                message: _context3.t0.message || _context3.t0
              })));

            case 14:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this, [[4, 11]]);
    }));

    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }();
}

function unauthorizedError(errorFunc) {
  var errorParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return raiseError(errorFunc, Object.assign({}, errorParams, {
    errorType: 'unauthorized',
    scheme: 'firebase'
  }));
}

function verifyToken(firebaseAdmin, token) {
  return firebaseAdmin.auth().verifyIdToken(token);
}

function extractTokenFromRequest(request) {
  return getCredentialFromAuthHeader('Bearer', request.headers.authorization || '');
}

function getCredentialFromAuthHeader(scheme, header) {
  return (header.match(new RegExp(scheme + ' (.*)')) || [])[1];
}

register.attributes = {
  pkg: require('../package.json')
};