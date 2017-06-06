'use strict';

var _index = require('./index');

describe('hapi-auth-firebase', () => {
  it('should register auth scheme', async () => {
    // register(server, options, next)
    const server = {
      auth: {
        scheme: jest.fn()
      }
    };
    const next = jest.fn();
    await (0, _index.register)(server, {}, next);
    expect(server.auth.scheme).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});