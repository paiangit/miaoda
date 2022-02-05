# 项目工作笔记：

## 一、通过 create-react-app 创建项目

```sh
npm i -g create-react-app
cd <some_path>
create-react-app miaoda
```

如果你要初始化一个 TypeScript 项目，则需要 create-react-app miaoda --template typescript

CRA 的文档见：https://create-react-app.bootcss.com/

初始化得到的项目中，public/manifest.json 是用于 PWA 的。
而 public/robots.txt 是用于控制搜索引擎行为的：

```
# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:
```

比如，其中的 Disallow 字段用来设置不允许搜索引擎访问那些目录，比如 Disallow:/secret 就是不允许访问/secret 目录。

修改 README.md 的第一行为：

```
# miaoda
```

如果需要修改 npm start 时的启动端口（默认是 3000），可以在 package.json 中修改环境变量 PORT，如下所示：

```js
"scripts": {
-  "start": "react-scripts start",
+  "start": "cross-env PORT=4000 react-scripts start",
```

因为 CRA 创建的项目只有很基础的功能，很多配置的工作还需要自己来添加。下面我们一步步将项目搭建起来。

## 二、添加对 Less 打包的支持

首先一个问题是，为什么选用 Less？

其实我也认为 Sass 挺好的。考虑使用 Less 的原因在于，计划会需要用到 Ant Design，而它的样式目前是用 Less 实现的，所以，后续在引用其抛出的一些文件的时候（如颜色主题变量），会比较方便。

通过 React 默认脚手架(create-react-app)创建出的项目默认是不支持 Less 打包的。

如需支持有两种方式：

1）通过执行命令 npm eject 将脚手架预先封闭的 Webpack 等配置工具的源文件暴露出来自行修改。

2）使用 customize-cra、react-app-rewired 对配置进行扩展。

3）采用@craco/craco 对配置进行扩展。

我们最好不用第一种方式，因为不 eject，比较容易更新构建工具。当新版本的 Create React App 发布后，只需运行如下命令即可升级：

```sh
npm install react-scripts@latest
```

因为第二种比较熟知，之前也用过，于是首先采用第二种方式。不料这种方式存在问题跑不起来。所以各位读者如果看到这里，只是想往下顺利进行的话，请直接跳到使用第三种方式（用@craco 和 craco）配置的部分。

因为第二种方式太过常见，我暂且先记录一下。

### 1、失败的尝试——用 customize-cra 和 react-app-rewired

具体操作是这样的：

```sh
npm i customize-cra react-app-rewired less less-loader -D
```

具体做法为：

参见：https://github.com/arackaf/customize-cra/blob/HEAD/api.md#addlessloaderloaderoptions

在项目根目录下创建 config-overrides.js 文件：

```js
const { override, addLessLoader } = require('customize-cra');
module.exports = override(
  addLessLoader({
    // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
    lessOptions: {
      javascriptEnabled: true,
      ModifyVars: { '@primary-color': '#eee' },
      sourceMap: true,
    },
  })
);
```

然后将 package.json 中的 scripts 节点中 start 和 build 改成：

```
"start": "react-app-rewired start",
"build": "react-app-rewired build",
```

然而，发现跑不起来，报错如下：

> options has an unknown property 'plugins'. These properties are valid:
> object { postcssOptions?, execute?, sourceMap?, implementation? }
> 查了多个方法，比如将 less-loader 限制在 5.0.0 版本，或者将 postcss-loader 降低至 3.0.0 版本，均有不同的报错，无奈放弃。

所以，将这一步的动作全部回滚，即：

删除 package-lock.json；

删除 package.json 中新加的 customize-cra react-app-rewired、less、less-loader 等依赖。并重新执行 `npm i` 。

### 2、回到正确的道路上——用@craco 和 craco

参见：
https://ant.design/docs/react/use-with-create-react-app-cn#%E9%AB%98%E7%BA%A7%E9%85%8D%E7%BD%AE

```sh
npm i @craco/craco craco-less -D
```

修改 package.json：

```js
"scripts": {
-  "start": "react-scripts start",
-  "build": "react-scripts build",
-  "test": "react-scripts test",
+  "start": "craco start",
+  "build": "craco build",
+  "test": "craco test",
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

然后我们将 src 目录下的 index.css 和 App.css 的后缀都修改成.less。并在 App.less 中做如下修改，以验证配置是否生效：

```css
.App-header {
-  background-color: #282c34;
+  @color: red;
+  background-color: red;
```

然后执行 `npm start` 即可见到界面的背景色被修改成了红色。

真是分分钟搞定，回过来看上面使用 customize-cra react-app-rewired 时的各种报错，还 Google 不到答案，Github 上有人提了相关的问题也没解决，真是太浪费时间了。因此，值得给 craco 和 Ant Design 一个大大的赞（我是在 Ant Design 的官网上看到用 craco 的）。

## 三、添加 typescript 打包支持

根据 CRA 官方的相关文档（https://create-react-app.bootcss.com/docs/adding-typescript/），可用如下命令添加：

```sh
npm install --save typescript @types/node @types/react @types/react-dom @types/jest
```

做完这一步之后，会发现 index.js、App.js 文件转变成了 index.jsx、App.jsx 文件。

我们接着想把它修改成.tsx 文件，但是看了 CRA 的文档（https://create-react-app.bootcss.com/docs/folder-structure/）居然说不能改：

> For the project to build, these files must exist with exact filenames:
> public/index.html is the page template;
> src/index.js is the JavaScript entry point.
> You can delete or rename the other files.

不应该啊，这么简单的东西也不让改！

这时想起一开始我们配置 Less 打包时引入过的 craco。果然很快就在其文档中找到了：

https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration

这样，我们对 craco.config.js 做如下修改：

```js
module.exports = {
+  webpack: {
+    configure: {
+      entry: path.resolve(__dirname, './src/index.tsx')
+    },
+  },
```

类似的，在 configure 这个属性下，估计是可以做各种各样的属性（https://webpack.js.org/configuration）的修改的。

添加完这个配置之后，我们就可以将项目中那些.jsx 文件悉数改成.tsx 了。

`npm run start`查看，发现构建成功。

为了支持在 import .ts 和 .tsx 文件时不用写后缀，需要修改 Webpack 的配置，在 craco.config.js 文件中添加下面这几行：

```js
const CracoLessPlugin = require('craco-less');
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '~': path.resolve(__dirname, './src/'),
    },
    configure: {
      entry: path.resolve(__dirname, './src/index.tsx'),
    },
    configure: (webpackConfig, { env, paths }) => {
       webpackConfig.entry = path.resolve(__dirname, './src/index.tsx'),
+      webpackConfig.resolve.extensions = [
+        '.tsx',
+        '.ts',
+        ...webpackConfig.resolve.extensions,
+      ];
+      // console.log('webpackConfig', webpackConfig);
+      return webpackConfig;
    },
  },
};
```

## 四、解决 'printPatternCaret' not found 问题

但是，在执行`npm run test`的时候，却遇到了如下报错：

> import { PatternPrompt, printPatternCaret, printRestoredPatternCaret } from 'jest-watcher';
> ^^^^^^^^^^^^^^^^^
> SyntaxError: Named export 'printPatternCaret' not found. The requested module 'jest-watcher' is a CommonJS module, which may not support all module.exports as named exports.
> CommonJS modules can always be imported via the default export, for example using:
> import pkg from 'jest-watcher';
> const { PatternPrompt, printPatternCaret, printRestoredPatternCaret } = pkg;

经过一番查找，在这里（https://github.com/facebook/create-react-app/issues/11792#issue-1083291936 以及 https://github.com/facebook/create-react-app/issues/11043#issuecomment-942472592）找到了答案，原因是跟Node.js版本有关系，我所采用的是14.15.0版本的Node.js（这个版本不支持native ESM，而新版本的 jest-watch-typeahead 是用 native ESM 编写的，所以会报错）。其中介绍说升级到 Node.js 16 版本就没问题了。但是，因为升级可能带来其它的问题，所以我暂时不升级，而是采用了其中提到的如下方法：

```sh
npm i --exact jest-watch-typeahead@0.6.5
```

## 五、引入 react-router-dom，初步配置路由

react-router-dom 比 react-router 多了 `<Link>` 、 `<BrowserRouter>` 这样的 DOM 类组件。因此，我们只需引用 react-router-dom 这个包就行了。而且，从版本 5 开始，官方已经放弃对 react-router 的维护，而只维护 react-router-dom。

例如：

`<Link>` 组件，会渲染一个 a 标签。

`<BrowserRouter>` 和 `<HashRouter>`组件，前者使用 popState 事件和 pushState 构建路由，后者使用 hashchange 事件和 window.location.hash 构建路由。

### 1. 安装 react-router-dom：

```
npm i react-router-dom -S
```

这里我们安装的是最新版本，6.2.1。

关于 react-router-dom 的使用，可以参考这篇文章：https://zhuanlan.zhihu.com/p/431389907

#### react-router-dom 6 中常用的组件和 hook

这里介绍下 react-router-dom 6 中常用的组件和 hooks。

常用的组件：

- <Routes>：是一组路由，用于代替原有<Switch>，所有子路由都用基础的<Route>作为 children 来表示。
- <Route>：基础路由，<Route>内部还可以嵌套<Route>。

比如，

```ts
function App() {
  return (
    <Routes>
      <Route path="projects" element={<Projects />}>
        <Route path=":id" element={<Project />} />
      </Route>
    </Routes>
  );
}
```

当访问 projects/123 时，组件树将是渲染成这样：

```
<App>
  <Projects>
    <Project/>
  </Projects>
</App>
```

- <Link>：导航组件，在页面中做为跳转链接使用。只能在Router内部使用。
- <Outlet/>：自适应渲染组件，根据实际路由 URL 自动匹配上不同的组件进行渲染，相当于 Vue.js 中的<router-view>。

常用 hooks：

- useParams：返回当前路由 URL 参数。

例如，

```ts
// 注册路由(相当于声明了有什么params参数)：
<Route path="/project/:id/:title" component={Project} />
```

```ts
// 接收params参数：
const params = useParams();
// params参数 => {id: "xxx", title: "yyy"}
```

- useNavigate：返回当前路由，相当于 5.0 版本中的 useHistoryuse。
- Outlet：返回根据路由自动生成的 element。
- useLocation：返回当前的 location 对象。
- useRoutes：同 Routes 组件一样，只不过是在 JavaScript 中用。
- useSearchParams：用来匹配 URL 中?后面的 query 参数。

#### react-router-dom 6 与 版本 5 的区别

- <Routes> 替代 <Switch>

  5.0 写法：

```ts
<Switch>
  <Route exact path="/">
    <Home />
  </Route>
  <Route path="/projects/:id" children={<Project />} />
  <Route path="/Editor">
    <Editor />
  </Route>
</Switch>
```

6.0 写法：

```ts
<Routes>
  <Route index path="/" element={<Home />} />
  <Route path="/projects/:id" element={<Project />} />
  <Route path="Editor" element={<Editor />} />
</Routes>
```

- 移除掉了 Switch 中的<Redirect>，6.0 版本中可以用 <Navigate> 实现

  5.0 写法：

```ts
<Switch>
  <Redirect from="xxx" to="yyy" />
</Switch>
```

6.0 写法：

```ts
<Route path="xxx" render={<Navigate to="yyy"/>}
```

- <Link>的to属性支持相对路径，而5.0版中只支持绝对路径。在6.0中，to如果路径是/开头的则是绝对路由，否则为相对路由，即相对于“当前URL”进行改变。

- useNavigate 代替了 useHistory

### 2. 新建 Root.js

全局路由有常用两种路由模式可选：HashRouter 和 BrowserRouter。HashRouter：URL 中采用的是 hash 去创建路由。这里我们采用 BrowserRouter 来创建路由。

```js
import React from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';

import App from './App.tsx';
import Projects from './Projects.tsx';
import Project from './Project.tsx';
import Editor from './Editor.tsx';

function Root() {
  return (
    <BrowserRouter>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/projects">Projects</Link>
        </li>
        <li>
          <Link to="/project/1">Project 1</Link>
        </li>
        <li>
          <Link to="/editor">Editor</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Root;
```

### 3. 修改 index.tsx

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
-  import './App.less';
-  import App from './App.tsx';
+  import Root from './Root.tsx';
import reportWebVitals from './reportWebVitals';

/**
 * StrictMode 是一个用以标记出应用中潜在问题的工具。
 * 就像 Fragment ，StrictMode 不会渲染任何真实的UI。
 * 它为其后代元素触发额外的检查和警告。
 * 注意: 严格模式检查只在开发模式下运行，不会与生产模式冲突。
 */
ReactDOM.render(
  <React.StrictMode>
-   <App />
+   <Root />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

### 4. 添加 Projects.tsx

```ts
function Projects() {
  return <div className="projects">projects</div>;
}

export default Projects;
```

### 5. 添加 Project.tsx

```ts
import { useParams } from 'react-router-dom';

function Project() {
  const params = useParams();
  return <div className="project">project {params.id}</div>;
}

export default Project;
```

### 6. 添加 Editor.tsx

```
function Editor() {
  return (
    <div className="editor">
      editor
    </div>
  );
}

export default Editor;
```

然后执行 `npm start`，可以看到页面可以成功访问。

## 六、用 `useRoutes` 将路由改造成数据配置形式

```ts
import React from 'react';
import { BrowserRouter, Link, useRoutes } from 'react-router-dom';

import App from './App.tsx';
import Projects from './Projects.tsx';
import Project from './Project.tsx';
import Editor from './Editor.tsx';

function Root() {
  const mainRoutes = {
    path: '/',
    element: '',
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'project/:id',
        element: <Project />,
      },
      {
        path: 'editor',
        element: <Editor />,
      },
    ],
  };
  const routing = useRoutes([mainRoutes]);

  return (
    <BrowserRouter>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/projects">Projects</Link>
        </li>
        <li>
          <Link to="/project/1">Project 1</Link>
        </li>
        <li>
          <Link to="/editor">Editor</Link>
        </li>
      </ul>
      {routing}
    </BrowserRouter>
  );
}

export default Root;
```

发现报错了：

> Uncaught Error: useRoutes() may be used only in the context of a <Router> component.

意思是说，`useRoutes()` 只能用在一个 Router 组件内，而现在我们是用在 `<BrowserRouter>` 组件之外的，而不是之内。

所以，我们需要将 `useRoutes()` 降低到 `<BrowserRouter>`的子组件中去使用。

### 1. 首先对 Root.tsx 做如下修改

```ts
import React from 'react';
import {
  BrowserRouter,
- Link,
- Routes,
- Route
} from 'react-router-dom';

import App from './App.tsx';
- import Projects from './Projects.tsx';
- import Project from './Project.tsx';
- import Editor from './Editor.tsx';

function Root() {
  return (
    <BrowserRouter>
-     <ul>
-       <li><Link to="/">Home</Link></li>
-       <li><Link to="/projects">Projects</Link></li>
-       <li><Link to="/project/1">Project 1</Link></li>
-       <li><Link to="/editor">Editor</Link></li>
-     </ul>
-     <Routes>
-       <Route path="/" element={<App />} />
-       <Route path="/projects" element={<Projects />} />
-       <Route path="/project/:id" element={<Project />} />
-       <Route path="/editor" element={<Editor />} />
-     </Routes>
+     <App/>
    </BrowserRouter>
  );
}

export default Root;
```

### 2. 将 App.tsx 修改成如下

useRoutes 的使用主要降到了这个文件中。

可以参考：https://typescript.tv/react/upgrade-to-react-router-v6/

```ts
import { useRoutes } from 'react-router-dom';

import Projects from './Projects.tsx';
import Project from './Project.tsx';
import Editor from './Editor.tsx';
import Layout from './Layout.tsx';
import Home from './Home.tsx';
import './App.less';

function App() {
  const mainRoutes = {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'project/:id',
        element: <Project />,
      },
      {
        path: 'editor',
        element: <Editor />,
      },
    ],
  };
  const routing = useRoutes([mainRoutes]);

  return <div className="App">{routing}</div>;
}

export default App;
```

### 3. 新建 Layout.tsx

原来在 Root.tsx 中的那些路由跳转链接移到了这里，当然，这些链接放在 Root.tsx 中也是可以的。

注意这里的<Outlet/>（该单词的英文意思是出口），相当于挖了个窟窿，用来渲染子路由对应的内容的。也即上面 App.tsx 文件中 mainRoutes 对应的 children。它会根据实际路由 URL 自动匹配渲染哪个组件。有点像 Vue.js 中的<router-view>。

```tsx
import { Link, Outlet } from 'react-router-dom';
import './Layout.less';

export default function Layout() {
  return (
    <div className="layout">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/projects">Projects</Link>
        </li>
        <li>
          <Link to="/project/1">Project 1</Link>
        </li>
        <li>
          <Link to="/editor">Editor</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
```

### 4. 新建 Layout.less

```css
.layout {
  ul {
    display: flex;
  }
  li {
    list-style: none;
    margin: 10px;
  }
}
```

### 5. 新建 Home.tsx

```ts
export default function Home() {
  return <div className="home">home</div>;
}
```

### 6. 新建 home.less

```css
.home {
}
```

## 七、让路由未匹配成功的时候展示 404 页面

### 1. 新建 PageNotFound.tsx

```ts
import './PageNotFound.less';

export default function PageNotFound() {
  return <div>Page not found.</div>;
}
```

### 2. 新建 PageNotFound.less

```css
.page-not-found {
}
```

### 3. 在 App.tsx 中对路由配置做如下修改

```ts
import {
  useRoutes,
  Navigate,
} from 'react-router-dom';

import Layout from './Layout.tsx';
import Home from './Home.tsx';
import Projects from './Projects.tsx';
import Project from './Project.tsx';
import Editor from './Editor.tsx';
+  import PageNotFound from './PageNotFound.tsx';
import './App.less';

function App() {
  const mainRoutes = {
    path: '/',
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "projects",
        element: <Projects />
      },
      {
        path: "project/:id",
        element: <Project />
      },
      {
        path: "editor",
        element: <Editor />
      },
+     {
+       path: "404",
+       element: <PageNotFound />
+     },
+     {
+       path: '*',
+       element: <Navigate to='/404' />
+     },
    ],
  };
  const routing = useRoutes([mainRoutes]);

  return (
    <div className="App">
      { routing }
    </div>
  );
}

export default App;
```

如此一来，你在访问页面不存在路由的时候，就会跳转到/404 这个路由。这里我们用到了 `Navigate` 组件。

## 八、将 test 文件移到根目录下的 test 目录，修改对应 jest 配置

调整后需要对应修改 craco.config.js 文件，以支持 npm run test 能正确运行。主要是 roots、testMatch、setupFilesAfterEnv 这三项。

```ts
   module.exports = {
     webpack: {
 +     alias: {
 +       "~": path.resolve(__dirname, './src/')
 +     },
       configure: {
         entry: path.resolve(__dirname, './src/index.tsx')
       },
     },
 +   jest: {
 +     configure: {
 +       moduleNameMapper: {
 +         "^~(.*)$": "<rootDir>/src$1",
 +       },
 +       roots: ['<rootDir>/src', '<rootDir>/test'],
 +       testMatch: ['<rootDir>/test/**/*.{spec,test}.{js,jsx,ts,tsx}'],
 +       setupFilesAfterEnv: "<rootDir>/test/setupTests.ts"
 +     },
 +   },

```

## 九、按 feature 规整目录，配置动态路由、嵌套路由

1. 按 feature 规整目录，对应调整路由

规整后目录如下：

.\miaoda
├─.gitignore
├─craco.config.js
├─package-lock.json
├─package.json
├─README.md
├─test
| ├─App.test.tsx
| └setupTests.ts
├─src
| ├─App.tsx
| ├─index.tsx
| ├─reportWebVitals.js
| ├─Root.tsx
| ├─styles
| ├─images
| ├─features
| | ├─settings
| | | ├─AppSettingsPage.less
| | | ├─AppSettingsPage.tsx 应用设置
| | | ├─index.ts
| | | └route.tsx
| | ├─publish
| | | ├─AppPublishPage.less
| | | ├─AppPublishPage.tsx 应用发布
| | | ├─index.ts
| | ├─preview
| | | ├─index.ts
| | | ├─PreviewPage.less
| | | ├─PreviewPage.tsx 页面预览
| | ├─myApps
| | | ├─AppListPage.less
| | | ├─AppListPage.tsx 我的应用
| | | ├─index.ts
| | ├─management
| | | ├─AdminLayout.less
| | | ├─AdminLayout.tsx
| | | ├─index.ts
| | | ├─ManagementPage.less
| | | ├─ManagementPage.tsx 页面管理
| | ├─home
| | | ├─index.ts
| | | ├─MainLayout.less
| | | ├─MainLayout.tsx
| | | ├─MainPage.less
| | | ├─MainPage.tsx 首页
| | ├─design
| | | ├─DesignerPage.less
| | | ├─DesignerPage.tsx 页面设计器
| | | ├─index.ts
| | ├─common
| | | ├─index.ts
| | | ├─PageNotFound.less
| | | ├─PageNotFound.tsx 404 页面
| ├─common
├─public
| ├─favicon.ico
| ├─index.html
| ├─logo192.png
| ├─logo512.png
| ├─manifest.json
| └robots.txt

改造后的路由文件如下：

```
// src/App.tsx
import {
  useRoutes,
  Navigate,
} from 'react-router-dom';

import MainLayout from './features/home/MainLayout.tsx';
import MainPage from './features/home/MainPage.tsx';
import AppListPage from './features/myApps/AppListPage.tsx';
import AdminLayout from './features/management/AdminLayout.tsx';
import ManagementPage from './features/management/ManagementPage.tsx';
import AppSettingsPage from './features/settings/AppSettingsPage.tsx';
import AppPublishPage from './features/publish/AppPublishPage.tsx';
import DesignerPage from './features/design/DesignerPage.tsx';
import PreviewPage from './features/preview/PreviewPage.tsx';
import PageNotFound from './features/common/PageNotFound.tsx';
// import routeConfig from './common/routeConfig.tsx';

function App() {
  const mainRoutes = {
    path: '/',
    element: <MainLayout/>,
    children: [
      {
        path: '*',
        element: <Navigate to='/404' />
      },
      {
        path: "/",
        element: <MainPage/>
      },
      {
        path: '404',
        element: <PageNotFound />
      },
      {
        path: 'myApps',
        element: <AppListPage />
      },
      {
        path: 'app/:appId/admin',
        element: <Navigate to=':pageId' />
      },
      {
        path: 'app/:appId/design',
        element: <DesignerPage />
      },
      {
        path: 'app/:appId/preview',
        element: <PreviewPage />
      },
    ],
  };
  const adminRoutes = {
    path: 'app/:appId/admin/',
    element: <AdminLayout/>,
    children: [
      {
        path: '*',
        element: <Navigate to='/404'/>
      },
      {
        path: ':pageId',
        element: <ManagementPage />
      },
      {
        path: 'appPublish',
        element: <AppPublishPage />
      },
      {
        path: 'appSettings',
        element: <AppSettingsPage />
      },
    ]
  };
  const routing = useRoutes([mainRoutes, adminRoutes]);
  // const routing = useRoutes([routeConfig]);

  return (
    <div className="app">
      { routing }
    </div>
  );
}

export default App;
```

## 十、集成 redux，并实战演示如何组织 action、reducer、hooks 等

### 1. 先安装 redux：

```
npm i redux react-redux -S
```

### 2. 引入 Provider，挂上 store

然后修改 src/common/Root.tsx 如下：

```tsx
   import {
     BrowserRouter,
   } from 'react-router-dom';
 + import { Provider } from 'react-redux';

   import App from './App.tsx';
 + import store from './common/store';

   function Root() {
     return (
 -     <BrowserRouter>
 -       <App/>
 -     </BrowserRouter>
 +     <Provider store={store}>
 +       <BrowserRouter>
 +         <App/>
 +       </BrowserRouter>
 +     </Provider>
     );
   }
```

### 3. 创建 src/common/store.ts

```ts
import { createStore } from 'redux';
import rootReducer from './rootReducer.ts';

function initStore() {
  const store = createStore(rootReducer);

  return store;
}

export default initStore();
```

### 4. 创建 src/common/rootReducer.ts：

```ts
import { combineReducers } from 'redux';
import homeReducer from '../features/examples/redux/reducer.ts';

const reducerMap = {
  home: homeReducer,
};

export default combineReducers(reducerMap);
```

### 5. 创建 src\features\examples\redux 文件夹，其中放置如下七个文件

#### reducer.ts

这个目录下 reducer 的聚合出口。它会把分别放在这个目录的各个文件中的 reducer 收集集合到一起。

```ts
import initialState from './initialState.ts';
import { reducer as counterPlusOne } from './counterPlusOne.ts';
import { reducer as counterMinusOne } from './counterMinusOne.ts';

const reducers = [counterPlusOne, counterMinusOne];

export default function reducer(state = initialState, action) {
  let newState;

  switch (action.type) {
    // 在这里放置全局reducer
    default:
      newState = state;
      break;
  }

  // reduce((acc, cur), initialAcc)
  return reducers.reduce(
    (previousState, reducer) => reducer(previousState, action),
    newState
  );
}
```

#### actions.ts

这个目录下 action 的聚合出口。

```ts
import { counterPlusOne } from './counterPlusOne.ts';
import { counterMinusOne } from './counterMinusOne.ts';

export default {
  counterPlusOne,
  counterMinusOne,
};
```

#### hooks.ts

这个目录下 hooks 的聚合出口

```ts
export { useCounterPlusOne } from './counterPlusOne.ts';
export { useCounterMinusOne } from './counterMinusOne.ts';
```

#### counterMinusOne.ts

一个文件只放做一件事情的 action、reducer 等。这样一个个文件分别拆开。

```ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HOME_COUNTER_MINUS_ONE } from './constants.ts';

export function counterMinusOne() {
  return {
    type: HOME_COUNTER_MINUS_ONE,
  };
}

export function useCounterMinusOne() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.home.count);
  const boundAction = useCallback(
    () => dispatch(counterMinusOne()),
    [dispatch]
  );

  return {
    count,
    counterMinusOne: boundAction,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_COUNTER_MINUS_ONE:
      return {
        ...state,
        count: state.count - 1,
      };

    default:
      return state;
  }
}
```

#### counterPlusOne.ts

```ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HOME_COUNTER_PLUS_ONE } from './constants.ts';

export function counterPlusOne() {
  return {
    type: HOME_COUNTER_PLUS_ONE,
  };
}

export function useCounterPlusOne() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.home.count);
  const boundAction = useCallback(() => dispatch(counterPlusOne()), [dispatch]);

  return {
    count,
    counterPlusOne: boundAction,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_COUNTER_PLUS_ONE:
      return {
        ...state,
        count: state.count + 1,
      };

    default:
      return state;
  }
}
```

#### constants.ts

```ts
export const HOME_COUNTER_PLUS_ONE = 'HOME_COUNTER_PLUS_ONE';
export const HOME_COUNTER_MINUS_ONE = 'HOME_COUNTER_MINUS_ONE';
```

#### initialState.ts

```ts
const initialState = {
  count: 0,
};

export default initialState;
```

其它每个 feature 下，都应该参照此种分类方式，创建对应的 redux 文件夹。

### 6. 创建一个 Counter 组件来使用 redux

#### Counter.ts

```ts
import { useCounterPlusOne, useCounterMinusOne } from './redux/hooks.ts';
import './Counter.less';

export default function Counter() {
  const { count, counterPlusOne } = useCounterPlusOne();
  const { counterMinusOne } = useCounterMinusOne();

  return (
    <div className="examples-counter">
      <div className="count">计数：{count}</div>
      <button className="minus-one" onClick={counterMinusOne}>
        -
      </button>
      <button className="plus-one" onClick={counterPlusOne}>
        +
      </button>
    </div>
  );
}
```

#### Counter.less

```ts
.examples-counter {
  margin: 20px;

  .count{
    margin: 10px 0;
  }

  .plus-one,
  .minus-one {
    background-color: #38b3e4;
    border: none;
    width: 50px;
    height: 30px;
    color: #fff;
  }
  .plus-one {
    margin-left: 10px;
  }
}
```

#### 引入 Counter 到 CounterPage 中

```ts
import Counter from './Counter.tsx';
import './CounterPage.less';

export default function CounterPage() {
  return (
    <div className="examples-counter-page">
      <Counter></Counter>
    </div>
  );
}
```

从 redux 的组织套路上来说，我们推荐：

- 按 feature 编写 action、reducer 和相关 hooks（每一组拆成一个文件），编写辅助文件 constants、initialState，将 action、reducer、hooks 集中到统一的出口。

- 编写 store 和将所有 reducer 收集成 rootReducer

参考：

redux 中文文档：https://www.redux.org.cn/docs/basics/Reducers.html

Rekit: http://rekit.js.org/docs/one-action-one-file.html

## 十一、用 redux-mock-store 创建 mock store 以进行自动化测试

先安装 redux-mock-store 模块，然后对 test/App.test.tsx 进行如下修改：

````ts
   import { render, screen } from '@testing-library/react';
 - import Home from '../src/Home/Home';
 + import App from '../src/App.tsx';
 + import { Provider } from 'react-redux';
 + import configureStore from 'redux-mock-store';
 + import { BrowserRouter } from 'react-router-dom';

   test('renders root', () => {
 -   render(<Home />);
 -   const rootElement = screen.getByText(/home/i);
 +   const initialState = { count: 10 };
 +   const mockStore = configureStore();
 +   let store = mockStore(initialState);
 +
 +   render(
 +     <Provider store={store}>
 +       <BrowserRouter>
 +         <App />
 +       </BrowserRouter>
 +     </Provider>
 +   );
 +
 +   const rootElement = screen.getByText(/examples/i);
     expect(rootElement).toBeInTheDocument();
   });
``

有了 redux-mock-store 所mock的数据，我们才能顺利继续测试。否则会报错。

## 十二、设计样式文件的组织结构

### 使用normalize.css进行样式初始化

从这里（https://necolas.github.io/normalize.css/latest/normalize.css）下载CSS文件放置入styles文件夹中。

注意：如果后续引入了ant-design库，需要注意样式是否覆盖的问题，因为它也使用了normalize.css，见：https://github.com/ant-design/ant-design/blob/master/components/style/core/global.less

将样式单独归口进行导出，不体现页面样式对组件样式的依赖关系的原因是什么呢？好像不是特别好，以后做组件懒加载的时候，可能不能做到样式懒加载，因此，这个处理有待进一步考虑清楚（TODO）。

### 新建styles/global.less文件

```css
@import './normalize.css';

body {
  margin: 0;
}

ul {
  padding: 0;
}

li {
  display: block;
}
````

### 新建 styles/index.less 作为样式的总出口文件，并把这个文件引入到 src/index.less 中

```css
/* 样式的总出口 */
@import './global';
```

### 在每个组件中，会有组件文件名同名的 less 文件来存放样式。features 中，每一个 feature 的文件夹名-组件名就是该组件的样式命名空间。因为 feature 都在同一个 features 文件夹下，所以可以保证 feature 不重名，又因为 feature 内部的功能都在 feature 文件夹下，所以可以保证 feature 内部组件不重名。这样一来，样式命名空间就不会重名。

比如，对于 examples 这个 feature 下的 Counter 组件，该组件最外层容器的 className 我们给它命名成 examples-counter，该组件所有的样式都写在这个命名空间下：

```css
.examples-counter {
  /* 这里写组件的具体样式 */
}
```

## 十三、引入 antd，进行样式引入，并修改语言包为中文

### 安装 antd

```sh
npm install antd --save
```

antd 默认支持基于 ES modules 的 tree shaking，对于 js 部分，直接引入 import { Button } from 'antd' 就会有按需加载的效果。

antd 具体使用请参照文档：https://ant.design/docs/react/getting-started-cn

### 接入图标

```sh
npm install --save @ant-design/icons
```

参照：https://ant.design/components/icon-cn/

### 新建 src/styles/themes.less，导入 antd 的色板 less

```
// import less of antd colors
// see: https://ant.design/docs/spec/colors-cn#%E5%9C%A8%E4%BB%A3%E7%A0%81%E4%B8%AD%E4%BD%BF%E7%94%A8%E8%89%B2%E6%9D%BF
@import '~antd/lib/style/themes/default.less';
```

其中，

@import 导入样式；～作为模块导入。

### 然后针对 src/index.tsx 做如下修改：

```sh
npm i moment -S
```

```ts
  import React from 'react';
  import ReactDOM from 'react-dom';
  import Root from './Root.tsx';
+ // 由于 antd 组件的默认文案是英文，所以需要修改为中文
+ import zhCN from 'antd/lib/locale/zh_CN';
+ import moment from 'moment';
+ import 'moment/locale/zh-cn';
+ import { ConfigProvider } from 'antd';
  import reportWebVitals from './reportWebVitals.ts';
+ import 'antd/dist/antd.css';
+ import './styles/index.less';
+
+ moment.locale('zh-cn');

/**
 * StrictMode 是一个用以标记出应用中潜在问题的工具。
 * 就像 Fragment ，StrictMode 不会渲染任何真实的UI。
 * 它为其后代元素触发额外的检查和警告。
 * 注意: 严格模式检查只在开发模式下运行，不会与生产模式冲突。
 */
ReactDOM.render(
  <React.StrictMode>
+   <ConfigProvider locale={zhCN}>
      <Root />
    </ConfigProvider>
+  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

## 十四、注意 React 中事件绑定时容易犯的一个错误

如果你将一个如下所示的普通传递给 JSX 的属性，会报错：

```ts
function clickHandler(index: number, e) {
  setActiveIndex(index, e);
}
```

```ts
onClick = { clickHandler(index); };
```

错误提示为：

> 不能将类型“void”分配给类型“MouseEventHandler<HTMLLIElement>”

这时，

第一种做法：

修改事件函数为：

```ts
function clickHandler(index: number) {
  return (e) => {
    setActiveIndex(index);
  };
}
```

第二种做法：

修改使用处为：

```ts
onClick={clickHandler.bind(null, index)}
```

第三种做法：

修改使用处为：

```ts
onClick={(e) => clickHandler(index, e)}
```

上面说的是函数式组件里面的写法，而类组件里面也类似，不过要注意 this 绑定的处理。

可参见：https://blog.csdn.net/weixin_41615439/article/details/110237818

# 环境变量配置与获取

安装依赖：

```sh
npm i dotenv -S
```

然后在入口文件 index.tsx 文件中引入：

```ts
import { config } from 'dotenv';

config({ path: '.dev' });
```

然而，发现并不好用，webpack 报如下错误：

> Module not found: Error: Can't resolve 'path' in '\miaoda\node_modules\dotenv\lib'
> 参见：https://github.com/motdotla/dotenv/issues/581

这是因为：
process.env is not polyfilled in Webpack 5+, leading to errors in environments where process is null (browsers).
https://github.com/mrsteele/dotenv-webpack/blob/master/README.md

最后，我发现其实 react-scripts 背后本身就已经使用了 dotenv 这个库的，我们只需要：

1）在项目的根目录中创建 xxx.env 文件
2）在 xxx.env 文件中配置以 REACT*APP*开头的环境变量
3）在项目中通过 process.env.REACT*APP*...访问它

所以根本不需要自己安装和配置 dotenv。
参见：https://stackoverflow.com/questions/42182577/is-it-possible-to-use-dotenv-in-a-react-project/56668716#56668716

在 create-react-app 中，除了内置的环境变量，如 NODE*ENV、PUBLIC_URL 外，其余环境变量需要用 REACT_APP*作为前缀。

env 文件的优先级如下：

优先级如下：

`npm start`: `.env.development.local` > `.env.development` > `.env.local` > `.env`

`npm run build`: `.env.production.local` > `.env.production` > `.env.local` > `.env`

`npm test`: `.env.test.local` > `.env.test` > `.env`

# 请求后台数据

```sh
npm i axios
```

## 封装 common/request.ts

```ts
import axios from 'axios';
import { message } from 'antd';

const axiosInstance = axios.create(getDefaultOptions());

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    token && (config.headers.common['x-midao-token'] = token);
    // config.headers.post['content-Type'] = 'application/x-www-form-urlencoded';
    config.headers['Content-Type'] = 'application/json';
    // 注意这里要return
    return config;
  },
  (err) => {
    console.log(err);
    // 注意这里要return
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  (res: any) => {
    // 注意这里要return
    return Promise.resolve(res.data);
  },
  (err) => {
    const showError = message.error;

    if (err.message) {
      const msg = err.response?.data?.message || err.message;
      showError(msg);
    }
    // 注意这里要return
    return Promise.reject(err);
  }
);

function getDefaultOptions() {
  // API基地址
  const baseURL = `${window.location.protocol}//${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_API_PREFIX}`;
  // 超时时间
  const timeout = 60000;

  return {
    baseURL,
    timeout,
  };
}

function getToken() {
  let token = '';
  // TODO
  return token;
}

export default axiosInstance;
```

这里因为忘记 return 的问题导致调试了好一会儿。所以特地都加上了注释，防止你忘记。

## 封装请求 API：features/auth/api.ts

```ts
import request from '../../common/request.ts';

export default {
  createUser(data) {
    return request({
      method: 'post',
      url: '/user/create',
      data,
    });
  },
  getUser(id) {
    return request({
      method: 'get',
      url: `/user/${id}`,
    });
  },
  login(data) {
    return request({
      method: 'post',
      url: '/auth/login',
      data,
    });
  },
};
```

## 在注册、登录等页面直接调用就好了

features/auth/RegisterPage.tsx

```ts
import { useRef } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from './api.ts';
import './RegisterPage.less';

export default function RegisterPage() {
  const registerForm = useRef();
  const navigate = useNavigate();

  function clickHandler(e) {
    e.preventDefault();
    const username = registerForm.current.username.value;
    const password = registerForm.current.password.value;
    const retypePassword = registerForm.current.retypePassword.value;
    const email = registerForm.current.email.value;

    if (retypePassword !== password) return;

    api
      .createUser({
        username,
        password,
        email,
      })
      .then((res) => {
        console.log(res);
        if (res.code === 0) {
          navigate('/auth/login');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="auth-register-page">
      <h2 className="title">Register</h2>
      <form ref={registerForm}>
        <label className="label" htmlFor="username">
          Username
        </label>
        <input type="text" name="username" id="username"></input>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input type="password" name="password" id="password"></input>
        <label className="label" htmlFor="retypePassword">
          Retype password
        </label>
        <input
          type="password"
          name="retypePassword"
          id="retypePassword"
        ></input>
        <label className="label" htmlFor="email">
          Email address
        </label>
        <input type="text" name="email" id="email"></input>

        <Button className="register" type="primary" onClick={clickHandler}>
          Register
        </Button>
      </form>
    </div>
  );
}
```

## 修改应用标题

修改 public/index.html 的 title 为：

```
<title>秒搭</title>
```

## 使用 JWT

在登录时访问 user/login 接口，接口会返回 token，我们将 token 存在 localStorage 中。为了让保存和读取时的值一致，我们在项目根目录下新建一个.env 文件来保存其键值。

```
# 各个环境公用的环境变量

## ======localStorage的键值======
# 登录token存储在localStorage中的key
REACT_APP_ACCESS_TOKEN_KEY=miaodaAccessToken
```

然后，在读和写的地方都通过 process.env.REACT_APP_ACCESS_TOKEN_KEY 来取得该键值。

在下次请求的时候，通过在请求头中设置 Authorization 这个请求头，其 value 就是 `Bearer ${token}` ，即把 localStorage 中存的 token 取出来，在前面拼上 Bearer 加空格。这是 JWT 要求的格式。

这样返回给服务器端之后，服务器就能正常地解析和验证 JWT 是否有效。

## 性能优化

因为 Layout 组件无参数，所以可以用 React.memo 第二个参数传 return false 的函数来直接优化。

export default React.memo(MainLayout, () => false);

## 将公共组件分成三类，在 common 目录下分目录管理

basic 基础组件
container 容器组件
hoc 高阶组件

## 编写检查登录的高阶组件

common/hoc/CheckLogin.tsx：

```tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './CheckLoginApi.ts';

// 登录高阶组件
export default function CheckLogin(Component) {
  const navigate = useNavigate();

  useEffect(() => {
    api
      .checkLogin()
      .then((res) => {
        console.log('已登录', res);
      })
      .catch((err) => {
        // console.log('未登录', err);
        navigate('/auth/login');
      });
  }, []);

  return function () {
    return <Component />;
  };
}
```

common/hoc/CheckLoginApi.ts：

```ts
import request from '../../../common/request.ts';

export default {
  checkLogin() {
    return request({
      method: 'post',
      url: '/auth/checkLogin',
    });
  },
};
```

这个组件将会检查是否登录（本质上是调用服务端接口，校验其 token 是否合法），如果发现没有登录，则会自动跳转到登录页面。

然后，我们就可以将这个高阶组件分别用于包裹每一个需要登录的页面，示例如下：

```tsx
+ import { CheckLogin } from '../common/index.tsx';
  import './MainPage.less';

  function MainPage() {
    return (
      <div className="home-main-page">
        home
      </div>
    );
  }

+  export default function() {
+    const WrappedMainPage = CheckLogin(MainPage);
+
+    return <WrappedMainPage/>;
+  }
```

## 配置 prettier，使得每次代码提交时自动用 prettier 格式化代码

我们的目的是希望每次提交之前，都用 prettier 对代码进行格式化。

参考文档：
https://www.prettier.cn/docs/install.html

首先安装 prettier：

```sh
pnpm add --save-dev --save-exact prettier
```

创建.prettierrc.json，配置格式化的格式：

```sh
{
  "singleQuote": true
}
```

创建.prettierignore，指定执行格式化时那些东西不用格式化：

```
build
coverage
```

为了能够在 git commit 之前自动执行，需要用到 git hooks，在 pre-commit 这个 git hook 里面去执行 prettier 格式化的动作。为了完成这一点，要用到两个 npm 包：husky 和 lint-staged。

husky 是一个方便的 git hook 助手。lint-staged 是一个只对 git 暂存文件运行 linters 检查的工具（用它可以避免每次修改一个文件就给所有文件执行一次 lint 检查）。

参见文档：https://www.npmjs.com/package/lint-staged

```sh
npx mrm@2 lint-staged
```

在 package.json 的刚刚自动生成的这段内容中：

```json
"lint-staged": {
  "*.{js,css,md}": "prettier --write"
}
```

我们增加两种文件类型，以支持对 ts 和 tsx 文件的格式化：

```json
"lint-staged": {
  "*.{js,css,md,tsx,ts}": "prettier --write"
}
```

create-react-app 创建的项目，是自动安装了 eslint 的，eslint 的配置在 package.json 中如下这段：

```json
"eslintConfig": {
  "extends": [
    "react-app",
    "react-app/jest"
  ]
},
```

因为 eslint 和 prettier 一起工作的时候，会有一些冲突，所有我们需要安装 eslint-config-prettier 来解决这种冲突。然后在上面代码中增加如下“prettier”那一行，意思是用 prettier 的配置覆盖部分 eslint 的配置：

```json
"eslintConfig": {
  "extends": [
    "react-app",
    "react-app/jest",
+   "prettier"
  ]
},
```

## 配置 commitlint，以支持对 commit message 进行标准化管理

参见文档：https://commitlint.js.org/#/guides-local-setup

安装 commitlint 和 commitlint-config-\*您选择的一个作为 devDependency 并配置 commitlint 为使用它。

```sh
# Install and configure if needed
pnpm add --save-dev @commitlint/{cli,config-conventional}
# For Windows:
pnpm add --save-dev @commitlint/config-conventional @commitlint/cli
```

新建 commitlint.config.js：

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

新建.husky/commit-msg 文件：

```
#!/bin/sh

npx --no -- commitlint --edit $1
```

## 想要合并或修改某几次提交的 commit message，怎么做？

```sh
git rebase -i HEAD~n
```

其中，n 替换成最近的几次。比如，如果你想合并最近的两次提交的 commit message，那么 n 就是 2。

然后，输入 i 才可进行输入。在合并时注意最顶上那个 commit 必须是 pick，不过其 commit message 的内容是可以修改的。其它的不需要的则可以是 squash。处理完成后按 esc 键，输入 wq 保存。如果发现操作错误，可以执行如下命令放弃，然后再重来一遍：

```sh
git rebase --abort
```

接着执行如下命令即完成合并：

```sh
git rebase --continue
```

## Mock 数据

### 方式 1：直接在代码中写死 Mock 数据或请求本地的 JSON 文件

缺点：与真实 Server 环境的切换非常麻烦，会侵入代码，不推荐

### 方式 2：请求拦截，代表是 Mock.js

```js
Mock.mock(/\/api\/visitor\/list/, 'get', {
  code: 200,
  msg: 'ok',
  'data|10': [
    'id|+1': 6,
    'name': 'csentence(5)',
    'tag': '@integer(6, 9)-integer(10, 14)岁 @cword('零有', 1)基础',
    'lesson_image': 'https://images.com/aaa.jpg',
    'lesson_package': 'L1基础课',
    'done': '@integer(10000, 99999)'
  ]
});
```

优点：与前端代码分离；可生成随机数据

缺点：数据都是动态生成的假数据，无法真实模拟增删改查的情况；只支持 ajax，不支持 fetch

### 方式 3：接口管理工具，代表：rap、swagger、moco、yapi

优点：配置功能强大，接口管理与 Mock 一体，后端修改接口 Mock 也跟着修改，可靠

缺点：配置复杂，依赖后端，可能会出现后端不愿出手，或者等配置完了，接口也开发出来了的情况；一般会作为大团队的基础建设而存在，没有这个条件的话慎重考虑

### 方式 4：本地 node 服务器，代表：json-server

优点：配置简单，json-server 甚至可以 0 代码 30 秒启动一个 REST API SERVER；自定义程度高，一切尽在掌握中；增删改查真实模拟
缺点：与接口管理工具相比，无法随着后端 API 的修改而自动修改

安装：

```sh
npm i json-server -g
```

然后在项目根目录新建一个文件:**json_server_mock**/db.json

```json
{
  "users": []
}
```

启动：

```sh
json-server __json_server_mock__/db.json --watch
```

然后，就可以按如下 RESTful API 的形式去访问了（比如用 postman 测试和前端调用使用）。真的是极其的方便。

### RESTful API

一句话总结：URI 代表资源/对象，METHOD 代表行为

- GET /users // 列表

- GET /users/1 // 详情

- POST /users // 增加

- PUT /users/1 // 整个替换

- PATCH /users/1 // 修改部分属性

- DELETE /users/1 // 删除

### 模拟非 RESTful 的 API

上面，json-server 只能模拟 RESTful 的 API，但是，实际使用中，并不是所有接口都能符合 RESTful 规范的。这时候，我们就需要给 json-server 添加中间件来实现模拟了。

```js
// middleware.js
module.exports = (req, res, next) => {
  if (req.method === 'POST' && req.path === '/login') {
    if (req.body.username === 'POST' && req.body.password === '111111') {
      return res.status(200).json({
        user: {
          token: '123',
        },
      });
    } else {
      return res.status(400).json({
        message: '用户名或密码错误',
      });
    }
  }
  next();
};
```

```sh
json-server __json_server_mock__/db.json --watch --port 3001 --middlewares ./__json_server_mock__/middleware.js
```

## 一个假的后端服务工具（仅供思路上作参考）

https://www.npmjs.com/package/jira-dev-tool

https://github.com/sindu12jun/imooc-jira

1）分布式，稳定可靠，控制方便：

传统教学项目后端服务的两大问题：

服务脆弱，请求次数有限，不稳定，如果老师的后端服务 down 掉，学员就没法使用了；

学员对后端数据库的控制有限，比如没法轻易地重置数据库；

这个开发者工具用 MSW 以 Service Worker 为原理实现了"分布式后端"。

即：

所有请求被 Service Worker 代理；

后端逻辑处理后，以 localStorage 为数据库进行增删改查操作；

这样每个同学的浏览器上都安装了一个独立的后端服务和数据库，再也不受任何中心化服务的影响。点击'清空数据库'便可以重置后端服务。

2）HTTP 请求精准控制

项目的健壮性被很多教学项目忽视，而作为一个最佳实践的项目，健壮性是一个被重点关注的点

这个开发者工具可以精准地控制 HTTP 请求的时间、失败概率、失败规则

安装：

```sh
pnpm add jira-dev-tool@next
```

接入：

```ts
import { loadDevtools } from 'jira-dev-tool';

loadDevtools(() =>
  ReactDOM.render(
    <React.strictMode>
      <App />
    </React.strictMode>,
    document.getElementById('root')
  )
);
```

这样页面运行之后，请求就被这个开发者工具接管了。

如果你在运行项目的时候出现了 [MSW] Detected outdated Service Worker 错误，则需要执行

```sh
npx msw init public
```

## 修改 Ant Design 的主题样式

关于这一点，Ant Design 的官网有详细的说明：
https://ant.design/docs/react/customize-theme-cn#header

因为我们这个项目是基于 create-react-app 创建的，所以主要参照这个部分的指引进行配置即可：
https://ant.design/docs/react/use-with-create-react-app-cn

此外，一个是需要将原来的：

import 'antd/dist/antd.css';

这一行改成：

import 'antd/dist/antd.less';

另一个是，在 craco.config.js 中配置下面这行：

```js
modifyVars: {
  'border-radius-base': '6px',
},
```

以达到我们想要修改主题中圆角大小的目的。

然后，我们在 styles/themes.less 文件中引入 default.less 这个文件：

@import '~antd/lib/style/themes/default.less';

就可以在组件的样式中引入

@import '../../styles/themes';

接下来我们就可以在组件中正常地使用@border-radius-base 这个来自主题的变量了。

## 自定义 Hook

```ts
import { useEffect } from 'react';

export const useMount = (callback) => {
  useEffect(() => {
    callback();
  }, []);
};
```

```ts
import { useEffect, useState } from 'react';

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
```

## 解决 lodash 没有.d.ts 文件的问题

```sh
pnpm add @types/lodash -D
```

## 标记事件的类型，以便 TS 进行类型检查

```ts
const handleEllipsisClick = (
  evt: React.MouseEvent<HTMLElement, MouseEvent>
) => {
  evt.preventDefault();
};
```

```ts
const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
  setTitle(evt.target.value);
};
```

## 发部正式环境的时候，别忘了配置环境变量

比如，如果你忘记了配置 API 接口地址和端口等环境变量，请求接口会报如下错误：

> Uncaught (in promise) DOMException: Failed to execute 'open' on 'XMLHttpRequest': Invalid URL

要想预览正式环境的效果，可以执行如下命令：

```sh
pnpm build
serve -s build --port 80
```

## 使用 react-error-boundary 处理错误

参见：https://github.com/bvaughn/react-error-boundary

```ts
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
+ import { ErrorBoundary } from 'react-error-boundary';
import { Button } from 'antd';

import App from './App';
import store from './common/store';
+ import { ErrorFallback } from './common/component/error-fallback';

function Root() {
+  const handleReset = () => {
+    window.location.reload();
+  };

  return (
+    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
+    </ErrorBoundary>
  );
}

export default Root;
```

error-fallback.tsx

```ts
import { Button, Card } from 'antd';
import './error-fallback.less';

export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="common-error-fallback">
      <Card className="inner">
        <p className="title">出错了</p>
        <pre className="message">{error.message}</pre>
        <Button className="button" type="primary" onClick={resetErrorBoundary}>
          重试
        </Button>
      </Card>
    </div>
  );
}
```

那么，如何自己实现一个类似 react-error-boundary 的组件呢？

可以参照官方文档：https://reactjs.org/docs/error-boundaries.html

下面是一个例子：

```tsx
import React from 'react';

type FallbackRender = (props: { error: Error | null }) => React.ReactElement;

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallbackRender: FallbackRender }>,
  { error: Error | null }
> {
  state = { error: null };

  // 当子组件抛出异常，这里会接收到并且调用
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    const { fallbackRender, children } = this.props;
    if (error) {
      return fallbackRender({ error });
    }
    return children;
  }
}
```

## 实现页面标题（title）的变化

### 方式 1：使用 react-helmet 组件

```sh
pnpm add react-helmet -S
```

需要在每一个页面都加入类似下面的代码：

```tsx
import Helmet from 'react-helmet';

<Helmet>
  <title>这是页面标题</title>
</Helmet>;
```

### 方式 2：使用自定义 hook

useDocumentTitle.ts

```ts
import { useEffect, useRef } from 'react';

export function useDocumentTitle(title: string, keepOnUnmount: boolean = true) {
  // useRef(xxx).current可以在组件的整个生命周期中保证这个值是xxx传入useRef时的初始值，可以免受xxx更新带来的影响
  const oldTitle = useRef(document.title).current;

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    // 组件卸载时恢复原来的title
    return () => {
      // 如果useEffect的第二个参数不指定依赖，因为闭包的关系，oldTitle还是第一次执行const oldTitle = document.title所获得的document.title的值，这是使用useEffect的时候需要注意的一个大坑！！！
      // 如果useEffect的第二个参数指定了oldTitle这个依赖，就会一旦oldTitle发生变化，就重新执行这里的代码，从而使得document.title获得更新
      if (!keepOnUnmount) {
        document.title = oldTitle;
      }
    };
  }, [oldTitle, keepOnUnmount]);
}
```

## 用 why-did-you-render 排查是什么原因导致循环渲染的

开发中我们很容易遇到循环渲染的情况，怎么排查原因呢？

```sh
pnpm add @welldone-software/why-did-you-render -D
```

新建 wdyr.ts

```ts
import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: false, // 是否对所有组件进行追踪
  });
}
```

然后在 index.tsx 的最开头添加：

```ts
import './wdyr'; // <--- first import
```

然后在你想追踪的那个组件上挂上.whyDidYouRender = true

```ts
xxxComponent.whyDidYouRender = true;
```

这样，在控制台中就可以看到是什么原因导致无限循环了。

注意，对于简单数据类型 和 state（组件状态），加入到 hook 的第二个参数中作为依赖时，不会导致无限循环渲染，但是，对于普通的引用类型，加入到 hook 的第二个参数中作为依赖，则会导致循环渲染。

比如：

const a = {};
useEffect(() => {}, [a]);

这个就会导致无限循环渲染，因为 a 是个普通对象。
