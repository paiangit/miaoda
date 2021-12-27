项目工作笔记：

# 一、通过create-react-app创建项目

```sh
npm i -g create-react-app
cd <some_path>
create-react-app miaoda
```

修改README.md的第一行为：

```
# miaoda
```

因为CRA创建的项目只有很基础的功能，很多配置的工作还需要自己来添加。下面我们一步步将项目搭建起来。

# 添加对Less打包的支持

首先一个问题是，为什么选用Less？

其实我也认为Sass挺好的。考虑使用Less的原因在于，计划会需要用到Ant Design，而它的样式目前是用Less实现的，所以，后续在引用其抛出的一些文件的时候（如颜色主题变量），会比较方便。

通过React默认脚手架(create-react-app)创建出的项目默认是不支持Less打包的。

如需支持有两种方式：

1）通过执行命令 npm eject 将脚手架预先封闭的Webpack等配置工具的源文件暴露出来自行修改。

2）使用customize-cra、react-app-rewired对配置进行扩展。

3）采用@craco/craco对配置进行扩展。

因为第二种比较熟知，之前也用过，于是首先采用第二种方式。不料这种方式存在问题跑不起来。所以各位读者如果看到这里，只是想往下顺利进行的话，请直接跳到使用第三种方式（用@craco和craco）配置的部分。

因为第二种方式太过常见，我暂且先记录一下。

## 1、失败的尝试——用customize-cra和react-app-rewired

具体操作是这样的：

```sh
npm i customize-cra react-app-rewired less less-loader -D
```

具体做法为：

参见：https://github.com/arackaf/customize-cra/blob/HEAD/api.md#addlessloaderloaderoptions

在项目根目录下创建config-overrides.js文件：

```js
const {
  override,
  addLessLoader,
} = require('customize-cra');
module.exports = override(
  addLessLoader({
    // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
    lessOptions: {
      javascriptEnabled: true,
      ModifyVars: { '@primary-color': '#eee' },
      sourceMap: true,
    }
  }),
);
```

然后将package.json中的scripts节点中start和build改成：

```
"start": "react-app-rewired start",
"build": "react-app-rewired build",
```

然而，发现跑不起来，报错如下：
> options has an unknown property 'plugins'. These properties are valid:
   object { postcssOptions?, execute?, sourceMap?, implementation? }
查了多个方法，比如将less-loader限制在5.0.0版本，或者将postcss-loader降低至3.0.0版本，均有不同的报错，无奈放弃。

所以，将这一步的动作全部回滚，即：

删除package-lock.json；

删除package.json中新加的customize-cra react-app-rewired、less、less-loader等依赖。并重新执行 `npm i` 。

## 2、回到正确的道路上——用@craco和craco

参见：
https://ant.design/docs/react/use-with-create-react-app-cn#%E9%AB%98%E7%BA%A7%E9%85%8D%E7%BD%AE

```sh
npm i @craco/craco craco-less -D
```

修改package.json：

```json
"scripts": {
-   "start": "react-scripts start",
-   "build": "react-scripts build",
-   "test": "react-scripts test",
+   "start": "craco start",
+   "build": "craco build",
+   "test": "craco test",
}
```

然后在项目根目录创建一个 craco.config.js 用于修改默认配置。

```js
const CracoLessPlugin = require('craco-less');

module.exports = {
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
```

然后我们将src目录下的index.css和App.css的后缀都修改成.less。并在App.less中做如下修改，以验证配置是否生效：

```css
.App-header {
-  background-color: #282c34;
+  @color: red;
+  background-color: red;
```

然后执行 `npm start` 即可见到界面的背景色被修改成了红色。

真是分分钟搞定，回过来看上面使用customize-cra react-app-rewired时的各种报错，还Google不到答案，Github上有人提了相关的问题也没解决，真是太浪费时间了。因此，值得给craco 和 Ant Design一个大大的赞（我是在Ant Design的官网上看到用craco的）。
