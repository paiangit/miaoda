const CracoLessPlugin = require('craco-less');
const path = require('path');
// const fs = require('fs');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

module.exports = {
  webpack: {
    alias: {
      '~': path.resolve(__dirname, './src/'),
    },
    configure: (webpackConfig, { env, paths }) => {
      // fs.writeFileSync('CRA的默认webpack配置.json', JSON.stringify(webpackConfig, null, 2));

      webpackConfig.entry = path.resolve(__dirname, './src/index.tsx');
      webpackConfig.resolve.extensions = [
          '.tsx',
          '.ts',
          ...webpackConfig.resolve.extensions,
      ];

      return smp.wrap(webpackConfig);
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
