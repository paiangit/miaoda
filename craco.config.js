const webpack = require('webpack');
const {
  // addAfterLoader,
  // addBeforeLoader,
  // addBeforeLoaders,
  // removeLoaders,
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

const handleBabelLoader = (webpackConfig, loaderName) => {
  const { hasFoundAny, matches } = getLoaders(
    webpackConfig,
    loaderByName(loaderName),
  );
  if (!hasFoundAny) {
    console.error(`没有找到${loaderName}`);
  }

  matches.forEach(item => {
    // 移除掉CRA默认提供的test为/\.(js|mjs)$/的babel-loader，因为项目中并没有此类型的文件
    if (item.loader.test.toString() === '/\\.(js|mjs)$/') {
      item.parent.splice(item.index, 1);
      return;
    }

    const newItem = {
      // 对于CRA默认提供的test为/\.(js|mjs|jsx|ts|tsx)$/的babel-loader，我们将它的test简化成/\.(tsx|ts)$/，因为项目中只有这两种类型的文件
      test: item.loader.test.toString().indexOf('tsx') > -1  ? /\.(tsx|ts)$/ : item.loader.test,
      use: [
        {
          loader: 'thread-loader',
        },
        {
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2015'
          },
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

      whenDev(() => {
        // 比默认的cheap-module-source-map打包速度更快
        webpackConfig.devtool = 'eval-cheap-module-source-map';
      });

      whenProd(() => {
        // 生产环境下用hidden-source-map让控制台中只能定位到编译后代码的位置，而不能map到源码，以提高安全性
        webpackConfig.devtool = 'hidden-source-map';
      });

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

      handleBabelLoader(webpackConfig, 'babel-loader');

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
        // 这里之所以要用[\\/]，它实际就是一个正则，是为了兼容Linux系统的/和windows系统给的\。
        // 当 webpack 处理文件路径时，它们始终包含 Unix 系统中的 / 和 Windows 系统中的 \。
        // 单纯滴使用 / 或 \ 会在跨平台使用时产生问题。
        // 参考：https://webpack.docschina.org/plugins/split-chunks-plugin/
        exclude: /[\\/]node_modules[\\/]/,
      }),
      // 换成esbuild-loader之后，
      // 不加这个插件页面会出现Uncaught ReferenceError: React is not defined错误
      new webpack.ProvidePlugin({
        'React': 'react',
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
