'use strict';

var _index = require('./index');

describe('hapi-auth-firebase', () => {
  it('should register auth scheme', async () => {
    // plugin.register(server, options)
    const server = {
      auth: {
        scheme: jest.fn()
      }
    };
    await _index.plugin.register(server, {});
    expect(server.auth.scheme).toHaveBeenCalled();
  });
});