import {
  plugin
} from './index';

describe('hapi-auth-firebase', () => {
  it('should register auth scheme', async () => {
    // plugin.register(server, options)
    const server = {
      auth: {
        scheme: jest.fn()
      }
    };
    await plugin.register(server, {});
    expect(server.auth.scheme).toHaveBeenCalled();
  });
});
