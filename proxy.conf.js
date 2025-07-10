// proxy.conf.js
const PROXY_TARGET = 'http://www.flexihire.me';

module.exports = {
  '/api': {
    target: PROXY_TARGET,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    onProxyRes: function(proxyRes, req, res) {
      // Remove duplicate CORS headers
      delete proxyRes.headers['access-control-allow-origin'];
      proxyRes.headers['access-control-allow-origin'] = 'http://localhost:4200';
      
      // Ensure other CORS headers are properly set
      proxyRes.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      proxyRes.headers['access-control-allow-headers'] = 'Content-Type, Authorization';
    }
  }
};