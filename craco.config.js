const {
  loaderByName,
  getLoaders,
  removePlugins,
  whenDev,
  whenProd,
} = require('@craco/craco');
const CracoLessPlugin = require('craco-less');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
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

const threadLoader = require('thread-loader');

// https://webpack.docschina.org/loaders/thread-loader/#root
// https://github.com/webpack-contrib/thread-loader/blob/master/example/webpack.config.js
threadLoader.warmup(
  {
    workers: require('os').cpus().length - 1,
  },
  [
    'babel-loader',
  ]
);

const addThreadLoaderBeforeLoaders = (webpackConfig, loaderName) => {
  const { hasFoundAny, matches } = getLoaders(
    webpackConfig,
    loaderByName(loaderName),
  );
  if (!hasFoundAny) {
    console.error(`没有找到${loaderName}`);
  }

  matches.forEach(item => {
    const newItem = {
      test: item.loader.test,
      use: [
        {
          loader: 'thread-loader',
        },
        {
          loader: item.loader.loader,
          options: item.loader.options,
        }
      ]
    };
    item.loader.include && (newItem.include = item.loader.include);
    item.loader.exclude && (newItem.exclude = item.loader.exclude);

    item.parent[item.index] = newItem;
  });
}

module.exports = {
  webpack: {
    alias: {
      '~': path.resolve(__dirname, './src/'),
    },
    configure: (webpackConfig, { env, paths }) => {
      // fs.writeFileSync('CRA的默认webpack配置.json', JSON.stringify(webpackConfig, null, 2));

      // 生产环境下用hidden-source-map让控制台中只能定位到编译后代码的位置，而不能map到源码，以提高安全性
      webpackConfig.entry = {
        // 注意这里键main不能修改，这是webpack的标准配置，否则会造成应用启动不了
        // 此外，还要配套修改下面的output.filename
        // https://webpack.docschina.org/concepts/entry-points/#separate-app-and-vendor-entries
        main: path.resolve(__dirname, './src/index.tsx'),
        vendor: [
          'axios',
          'react',
          'react-dom',
          'react-error-boundary',
          'react-query',
          'react-router-dom',
          'redux',
          'react-redux',
          'redux-thunk',
          'moment'
        ],
      };
      whenDev(() => {
        webpackConfig.output.filename = '[name].bundle.js';
      });
      whenProd(() => {
        webpackConfig.output.filename = '[name].[contenthash].bundle.js';
      });

      webpackConfig.resolve.extensions = [
        '.tsx',
        '.ts',
        ...webpackConfig.resolve.extensions,
      ];

      addThreadLoaderBeforeLoaders(webpackConfig, 'babel-loader');

      // 删除case-sensitive-paths-plugin
      whenDev(() => removePlugins(webpackConfig, (plugin) => {
        if (plugin instanceof CaseSensitivePathsPlugin) {
          return plugin;
        }
      }));

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
