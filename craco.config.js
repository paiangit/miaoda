const CracoLessPlugin = require('craco-less');
const CircularDependencyPlugin = require('circular-dependency-plugin')

const path = require('path');
// const fs = require('fs');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');

const smp = new SpeedMeasurePlugin({
  outputFormat: 'human',
  outputTarget: './build/speed-measure.md'
});

module.exports = {
  webpack: {
    alias: {
      '~': path.resolve(__dirname, './src/'),
    },
    configure: (webpackConfig, { env, paths }) => {
      // fs.writeFileSync('CRA的默认webpack配置.json', JSON.stringify(webpackConfig, null, 2));

      // 生产环境下用hidden-source-map让控制台中只能定位到编译后代码的位置，而不能map到源码，以提高安全性
      webpackConfig.devtool = process.env.NODE_ENV === 'development' ? 'eval-cheap-module-source-map' : 'hidden-source-map';
      webpackConfig.entry = path.resolve(__dirname, './src/index.tsx');
      webpackConfig.resolve.extensions = [
        '.tsx',
        '.ts',
        ...webpackConfig.resolve.extensions,
      ];

      return smp.wrap(webpackConfig);
      // return webpackConfig;
    },
    plugins: [
      new BundleAnalyzerPlugin({ generateStatsFile: true, openAnalyzer: false }),
      new ProgressBarWebpackPlugin(),
      // 循环依赖检测插件
      new CircularDependencyPlugin({
        exclude: /node_modules/,
      }),
    ],
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
