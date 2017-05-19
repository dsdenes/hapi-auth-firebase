//@flow
const Boom = require('boom');

module.exports = {
  register,
  raiseError,
  applyErrorFunc,
  firebaseAuthScheme,
  authenticateRequest,
  unauthorizedError,
  verifyToken,
  extractTokenFromRequest,
  getCredentialFromAuthHeader
};

function register(server, options, next) {
  server.auth.scheme('firebase', firebaseAuthScheme);
  return next();
}

async function raiseError(errorFunc, errorContext) {
  errorContext = await applyErrorFunc(errorFunc, errorContext);
  return Boom[errorContext.errorType](errorContext.message, errorContext.scheme, errorContext.attributes);
}

async function applyErrorFunc(errorFunc, errorContext) {
  if (errorFunc) {
    errorContext = await errorFunc(errorContext);
  }
  return errorContext;
}

function firebaseAuthScheme(server, options) {
  return {
    authenticate: authenticateRequest(server, options)
  };
}

function authenticateRequest(server, options) {
  return async (request, reply) => {

    const token = extractTokenFromRequest(request);

    if (!token) {
      return reply(unauthorizedError(options.errorFunc));
    }

    request.auth.token = token;

    try {
      const credentials = await verifyToken(options.firebaseAdmin, token);
      reply.continue({
        credentials,
        artifacts: token
      });
    } catch (error) {
      return reply(unauthorizedError(options.errorFunc, {
        message: error.message || error
      }));
    }
  }
}

function unauthorizedError(errorFunc, errorParams={}) {
  return raiseError(errorFunc, Object.assign({}, errorParams, {
    errorType: 'unauthorized',
    scheme: 'firebase'
  }));
}

function verifyToken(firebaseAdmin, token: String) {
  return firebaseAdmin
    .auth()
    .verifyIdToken(token);
}

function extractTokenFromRequest(request) {
  return getCredentialFromAuthHeader('Bearer', request.headers.authorization || '');
}

function getCredentialFromAuthHeader(scheme, header) {
  return (header.match(new RegExp(`${scheme} (.*)`)) || [])[1];
}

register.attributes = {
  pkg: require('../package.json')
};

