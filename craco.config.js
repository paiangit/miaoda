const CracoLessPlugin = require('craco-less');
const path = require('path');

module.exports = {
  webpack: {
    configure: {
      entry: path.resolve(__dirname, './src/index.tsx')
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};