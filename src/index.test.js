import {
  register,
  raiseError,
  applyErrorFunc,
  firebaseAuthScheme,
  authenticateRequest,
  unauthorizedError,
  verifyToken,
  extractTokenFromRequest,
  getCredentialFromAuthHeader
} from './index';

describe('hapi-auth-firebase', () => {
  it('should register auth scheme', async () => {
    // register(server, options, next)
    const server = {
      auth: {
        scheme: jest.fn()
      }
    };
    const next = jest.fn();
    await register(server, {}, next);
    expect(server.auth.scheme).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
