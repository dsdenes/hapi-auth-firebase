'use strict';

const { version } = require('../package.json');
const Boom = require('boom');

exports.plugin = {
  name: 'hapiAuthFirebase',
  once: true,
  pkg: require('../package.json'),
  register: async (server, options) => {
    return await server.auth.scheme('firebase', firebaseAuthScheme);
  },
  version: version,
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
  return async (request, hapi) => {
    const token = extractTokenFromRequest(request);

    if (!token) {
      return hapi.unauthenticated(unauthorizedError(options.errorFunc));
    }

    request.auth.token = token;

    try {
      const credentials = await verifyToken(options.firebaseAdmin, token);
      return hapi.authenticated({ credentials: credentials, artifacts: token });
    } catch (error) {
      return hapi.unauthenticated(unauthorizedError(options.errorFunc, {
        message: error.message || error
      }));
    }
  };
}

function unauthorizedError(errorFunc, errorParams = {}) {
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
  return (header.match(new RegExp(`${scheme} (.*)`)) || [])[1];
}