const { version } = require('../../package.json');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'VNPASS API documentation',
    version,
  },
  servers: [
    {
      url: `http://localhost:3000/v1/vnpass`,
    },
    {
      url: `https://gtalkapi.vdtsecurity.vn/v1`,
    },
  ],
};

module.exports = swaggerDef;
