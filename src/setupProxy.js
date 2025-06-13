const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/v1',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_BASEURL,
      changeOrigin: true
    })
  );
};
