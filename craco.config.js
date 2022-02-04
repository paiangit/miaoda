const CracoLessPlugin = require('craco-less');
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '~': path.resolve(__dirname, './src/'),
    },
    configure: (webpackConfig, { env, paths }) => {
      (webpackConfig.entry = path.resolve(__dirname, './src/index.tsx')),
        (webpackConfig.resolve.extensions = [
          '.tsx',
          '.ts',
          ...webpackConfig.resolve.extensions,
        ]);
      // console.log('webpackConfig', webpackConfig);
      return webpackConfig;
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^~(.*)$': '<rootDir>/src$1',
      },
      roots: ['<rootDir>/src', '<rootDir>/test'],
      testMatch: ['<rootDir>/test/**/*.{spec,test}.{js,jsx,ts,tsx}'],
      setupFilesAfterEnv: '<rootDir>/test/setupTests.ts',
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              // '@primary-color': '#1DA57A',
              'border-radius-base': '6px',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
