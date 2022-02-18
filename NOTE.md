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
       webpackConfig.entry = path.resolve(__dirname, './src/index.tsx');
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
import rootReducer from './rootReducer';

const store = createStore(rootReducer);

export type RootState = ReturnType<typeof store.getState>;

export default store;
```

### 4. 创建 src/common/rootReducer.ts：

```ts
import { combineReducers } from 'redux';
import todosReducer from '../features/examples/redux/reducer';

const reducerMap = {
  todos: todosReducer,
};

export default combineReducers(reducerMap);
```

### 5. 创建 src\features\examples\redux 文件夹，其中放置如下七个文件

#### reducer.ts

这个目录下 reducer 的聚合出口。它会把分别放在这个目录的各个文件中的 reducer 收集集合到一起。

```ts
import initialState from './initialState';
import { reducer as addTodo } from './addTodo';
import { reducer as removeTodo } from './removeTodo';

const reducers = [addTodo, removeTodo];

export default function reducer(state = initialState, action) {
  let newState;

  switch (action.type) {
    // 在这里放置全局reducer
    default:
      newState = state;
      break;
  }

  // reduce((acc, cur), initialAcc)
  const result = reducers.reduce(
    (previousState, reducer) => reducer(previousState, action),
    newState
  );

  // 得到的结果是 { todoList: xxx }
  return result;
}
```

#### hooks.ts

这个目录下 hooks 的聚合出口

```ts
// hook集合
export { useAddTodo } from './addTodo';
export { useRemoveTodo } from './removeTodo';
```

#### removeTodo.ts

一个文件只放做一件事情的 action、reducer 等。这样一个个文件分别拆开。

```ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../common/store';
import { TODOS_REMOVE_TODO } from './constants';

interface TodosState {
  todoList: string[];
}

// 单个action
export function removeTodo(index) {
  return {
    type: TODOS_REMOVE_TODO,
    payload: index,
  };
}

// 单个reducer
export function reducer(state: TodosState, action) {
  switch (action.type) {
    case TODOS_REMOVE_TODO:
      // 下面这样写会导致页面不更新，原因待研究
      // const newState = {...state};
      // newState.todoList.splice(action.payload, 1); // 主要是这句
      // return newState;
      return {
        ...state,
        todoList: state.todoList.filter((item, index) => index !== action.payload),
      };

    default:
      return state;
  }
}

// 单个hook
export function useRemoveTodo() {
  const dispatch = useDispatch();
  const todoList = useSelector((state: RootState) => state.todos.todoList);
  const boundAction = useCallback(
    (index) => dispatch(removeTodo(index)),
    [dispatch]
  );

  return {
    todoList,
    removeTodo: boundAction,
  };
}
```

#### addTodo.ts

```ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../common/store';
import { TODOS_ADD_TODO } from './constants';

// 单个action
export function addTodo(todo) {
  return {
    type: TODOS_ADD_TODO,
    payload: todo,
  };
}

// 单个reducer
export function reducer(state, action) {
  switch (action.type) {
    case TODOS_ADD_TODO:
      // 为什么下面这样写就洁界面不刷新呢
      // const newState = {...state};
      // newState.todoList.push(action.payload); // 主要是这一句所导致的
      // newState.todoList = [...newState.todoList, action.payload];
      // return newState;
      return {
        ...state,
        todoList: [...state.todoList, action.payload],
      };

    default:
      return state;
  }
}

// 单个hook
export function useAddTodo() {
  const dispatch = useDispatch();
  const todoList = useSelector((state: RootState) => state.todos.todoList);
  const boundAction = useCallback((todo) => dispatch(addTodo(todo)), [dispatch]);

  return {
    todoList,
    addTodo: boundAction,
  };
}
```

#### constants.ts

```ts
export const TODOS_REMOVE_TODO = 'TODOS_REMOVE_TODO';
export const TODOS_ADD_TODO = 'TODOS_ADD_TODO';
```

#### initialState.ts

```ts
// 初始状态
const initialState = {
  todoList: [],
};

export default initialState;
```

其它每个 feature 下，都应该参照此种分类方式，创建对应的 redux 文件夹。

### 6. 创建一个 TodoList 组件来使用 redux

#### TodoList.ts

```ts
import { Button, Form, Input, List, Typography } from 'antd';
import { useAddTodo, useRemoveTodo } from './redux/hooks';
import './TodoList.less';

export default function TodoList() {
  const { todoList, addTodo } = useAddTodo();
  const { removeTodo } = useRemoveTodo();
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log(values.todo, todoList);
    addTodo(values.todo);
    // 清空输入框
    form.setFieldsValue({todo: ''});
  };

  const handleRemove = (index) => {
    return () => removeTodo(index);
  };

  const handleChange = (e) => {

  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };

  const tailLayout = { ...layout.wrapperCol, offset: 8 };

  return (
    <div className="examples-todo-list">
      <Form form={form} {...layout} onFinish={handleFinish}>
        <Form.Item
          label="待办"
          name="todo"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input onChange={handleChange}/>
        </Form.Item>

        <Form.Item wrapperCol={tailLayout}>
          <Button type="primary" htmlType="submit">
            添加
          </Button>
        </Form.Item>
      </Form>

      <List
        className="list"
        header={<div>待办列表</div>}
        bordered
        dataSource={todoList}
        renderItem={
          (item, index) => (
            <List.Item key={index}>
              <Typography.Text>
                {item}
              </Typography.Text>
              <Button onClick={handleRemove(index)}>删除</Button>
            </List.Item>
          )
        }
      >
      </List>
    </div>
  );
}
```

#### TodoList.less

```ts
@import '../../common/styles/themes.less';
@import '../../common/styles/mixins.less';

.examples-todo-list {
  margin-top: 20px;
  .list {
    margin: 50px auto 0;
    width: 70%;
  }
}
```

#### 引入 TodoList 到 TodosPage 中

```ts
import { useDocumentTitle } from '../../common/hooks';
import TodoList from './TodoList';
import './TodosPage.less';

export default function TodosPage() {
  useDocumentTitle('例子：Todo List');

  return (
    <div className="examples-todos-page">
      <TodoList />
    </div>
  );
}
```

从 redux 的组织套路上来说，我们推荐：

- 按 feature 编写 action、reducer 和相关 hooks（每一组拆成一个文件），编写辅助文件 constants、initialState，将 reducer、hooks 集中到统一的出口。

- 编写 store 和将所有 reducer 收集成 rootReducer

参考：

redux 中文文档：https://www.redux.org.cn/docs/basics/Reducers.html

Rekit: http://rekit.js.org/docs/one-action-one-file.html

### 集成redux-thunk

pnpm add redux-thunk -D

store.ts

```ts
+ import { createStore, applyMiddleware } from 'redux';
+ import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

+ const store = createStore(rootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof store.getState>;

export default store;
```

todoList.tsx

```tsx
import { Button, Form, Input, List, Typography } from 'antd';
import { useAddTodo, useRemoveTodo, useAddTodoAsync } from './redux/hooks';
import './TodoList.less';

export default function TodoList() {
  const { todoList, addTodo } = useAddTodo();
  const { addTodoAsync } = useAddTodoAsync();
  const { removeTodo } = useRemoveTodo();
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log(values.todo, todoList);
    addTodo(values.todo);
    // 清空输入框
    form.setFieldsValue({todo: ''});
  };

  const validateAndSubmit = (e) => {
    const todo = form.getFieldValue('todo');
    addTodoAsync(todo);
    // 清空输入框
    form.setFieldsValue({todo: ''});
  };

  const handleRemove = (index) => {
    return () => removeTodo(index);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };

  const tailLayout = { ...layout.wrapperCol, offset: 8 };

  return (
    <div className="examples-todo-list">
      <Form form={form} {...layout} onFinish={handleFinish}>
        <Form.Item
          label="待办"
          name="todo"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input/>
        </Form.Item>

        <Form.Item wrapperCol={tailLayout}>
          <Button type="primary" htmlType="submit">
            添加
          </Button>
          <Button className="validateAndSubmit" type="primary" onClick={validateAndSubmit}>
            先校验再添加
          </Button>
        </Form.Item>
      </Form>

      <List
        className="list"
        header={<div>待办列表</div>}
        bordered
        dataSource={todoList}
        renderItem={
          (item, index) => (
            <List.Item key={index}>
              <Typography.Text>
                {item}
              </Typography.Text>
              <Button onClick={handleRemove(index)}>删除</Button>
            </List.Item>
          )
        }
      >
      </List>
    </div>
  );
}
```

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

比如，对于 examples 这个 feature 下的 TodoList 组件，该组件最外层容器的 className 我们给它命名成 examples-todo-list，该组件所有的样式都写在这个命名空间下：

```css
.examples-todo-list {
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

## 封装请求 API：features/auth/apis.ts

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
import apis from './api.ts';
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

    apis
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

## 将公共组件分成三类，在 common 目录下分目录管理

basic 基础组件
container 容器组件
hoc 高阶组件

## 编写检查登录的高阶组件

common/hocs/CheckLogin.tsx：

```tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apis from './CheckLoginApi.ts';

// 登录高阶组件
export default function CheckLogin(Component) {
  const navigate = useNavigate();

  useEffect(() => {
    apis
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

common/hocs/CheckLoginApi.ts：

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

@import '../../styles/themes.less';

接下来我们就可以在组件中正常地使用@border-radius-base 这个来自主题的变量了。

## 自定义 Hook

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
pnpm add serve -D
pnpm build
serve -s build --port 3000
```

## 使用 react-error-boundary 处理错误

参见：https://github.com/bvaughn/react-error-boundary

index.tsx

```ts
import './wdyr';
import React from 'react';
import ReactDOM from 'react-dom';
+ import { ErrorBoundary } from 'react-error-boundary';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { ConfigProvider } from 'antd';
// import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.less';
+ import { ErrorFallback } from './common/containers/ErrorFallback';
import Root from './Root';
import './styles/index.less';

moment.locale('zh-cn');

+ const handleReset = () => {
+   window.location.reload();
+ };

/**
 * StrictMode 是一个用以标记出应用中潜在问题的工具。
 * 就像 Fragment ，StrictMode 不会渲染任何真实的UI。
 * 它为其后代元素触发额外的检查和警告。
 * 注意: 严格模式检查只在开发模式下运行，不会与生产模式冲突。
 */
ReactDOM.render(
  <React.StrictMode>
+     <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset}>
        <ConfigProvider locale={zhCN}>
          <Root />
        </ConfigProvider>
+     </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
```

ErrorFallback.tsx

```ts
import { Button, Card } from 'antd';
import './ErrorFallback.less';

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

## 自定义 hook 返回 Url 中指定键的参数值的

```ts
import { useMemo } from 'react';
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom';
import { cleanObject } from '../utils';

/**
 * 返回Url中指定键的参数值
 */
export function useUrlQueryParams<T extends string>(keys: T[]) {
  const [searchParams, setSearchParams] = useSearchParams();

  return [
    useMemo(
      () =>
        keys.reduce((accumulator, currentValue) => {
          return {
            ...accumulator,
            [currentValue]: searchParams.get(currentValue),
          };
        }, {} as { [key in string]: string }),
      [searchParams]
    ),
    (params: Partial<{ [key in T]: unknown }>) => {
      // 下面的Object.forEntries(searchParams)是用来把实现了迭代器的对象，这里是searchParams，里面的键和值读取出来变成一个普通对象
      // 参见：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
      const o = cleanObject({
        ...Object.fromEntries(searchParams),
        ...params,
      }) as URLSearchParamsInit;
      return setSearchParams(o);
    },
  ] as const; // 这里的as const，即TypeScript中的const断言。const断言会告诉编译器为表达式推断最窄的*或最具体的类型。如果您不使用as const，编译器将使用其默认类型推断行为，这可能会导致更广泛或更通用的类型。
}
```

其实，有些跨组件的状态也可以用 useUrlQueryParams 来进行管理，在修改状态的地方通过 useUrlQueryParams 把参数写入 URL 中，并在需要用到的组件中通过 useUrlQueryParams 从 URL 中读取出来。

## 获取某组件上的属性的类型

```ts
React.ComponentProps<typeof xxx>
```

例如：

```ts
import { Select } from 'antd';

type SelectProps = React.ComponentProps<typeof Select>;
```

然后，我们就可以通过 extends 所获得的这个属性，从而实现在新封装的组件中对于原有组件的属性的透传。另外，因为我们新扩展上去的属性与原有的属性类型有冲突，所以我们可以用 Omit 过滤掉原组件那几个属性，从而直接使用我们新扩展的属性。

```tsx
IdSelect.tsx;
import React from 'react';
import { Raw } from './types';
import { Select } from 'antd';
import { toNumber } from 'lodash';

type SelectProps = React.ComponentProps<typeof Select>;

interface IdSelectProps
  extends Omit<SelectProps, 'value' | 'onChange' | 'options'> {
  value: Raw | null | undefined;
  onChange: (value?: number) => void;
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
}

/**
 * value可以传入多种类型的值
 * onChange只会回调number | undefined类型
 * 当isNaN(Number(value))为true的时候，代表选择默认类型
 * 当选择默认类型的时候，onChange会回调undefined
 * @param props
 * @constructor
 */
export function IdSelect({
  value,
  onChange,
  defaultOptionName,
  options,
}: IdSelectProps) {
  return (
    <Select
      value={toNumber(value)}
      onChange={(value) => onChange(toNumber(value) || undefined)}
    >
      {defaultOptionName ? (
        <Select.Option value={0}>{defaultOptionName}</Select.Option>
      ) : undefined}
    </Select>
  );
}
```

types.ts

```ts
export type Raw = 'number' | 'string';
```

## Url 中数字类型参数的治理

Url 中的 appId、pageId 等字段，因为从 Url 字符串中解析出来，就变成了字符串，但是，从后端接口中返回来的却通常是数字类型，这样，就有了类型不一致的情况。我们可以封装 hook 来解决这个问题：

```ts
// 下面两个hook分别将Url中的appId和pageId转成number类型
// url的格式为：http://localhost/app/${appId}/preview?pageId=${pageId}
const usePreviewParams = () => {
  const params = useParams();
  return { ...params, appId: Number(params.appId) || undefined };
};
const usePreviewSearchParams = () => {
  const [params] = useUrlQueryParams(['pageId']);
  return { ...params, pageId: Number(params.pageId) || undefined };
};

const params = usePreviewParams();
const searchParams = usePreviewSearchParams();
console.log(
  params.appId,
  typeof params.appId,
  searchParams.pageId,
  typeof searchParams.pageId
);
```

## react-query 的使用

```sh
pnpm add react-query -S
```

然后，我们引入 react-query 的的 QueryClientProvider 来包裹我们的应用：

root.tsx

```ts
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
+ import { QueryClientProvider, QueryClient } from 'react-query';

import App from './App';
import store from './common/store';

function Root() {
+ const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      {/* 将 queryClient 对象传递到下层组件 */}
+     <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
+     </QueryClientProvider>
    </Provider>
  );
}

export default Root;
```

首先来看一个简单的使用：

```tsx
import { useQuery } from 'react-query';
import axios from 'axios';

const fetchAppList = () => {
  return axios.get('http://localhost:4000/api/app/list');
};

export const AppList = () => {
  const { isLoading, data, isError, error } = useQuery('app-list', fetchAppList);

  if (isLoading) {
    return <div>loading</div>
  }

  if (isError) {
    return <div>{error.message}</div>
  }

  return (
    <>
      <h2>App List</h2>
      { data?.data.map(app => {
        return <div key={app.id}>{app.name}</div>
      }) }
    </h2>
  )
}
```

可见，它让请求不再需要写在 useEffect 中，而是完成了封装。另外，isLoading 等直接可用。省去 setIsLoading、setData、setError 等不用 react-query 时需要手工编码完成的操作。简化了我们的编码。

其中，useQuery 接收至少两个参数：

第一个参数是一个表示这个 Query 的唯一 key。这个唯一 key 可以是 string、array、object 类型。比如：
['todos']、['todo', 3]、['todo', 3, { preview: true }] 均可。Query key 唯一的要求就是可以被序列化。

第二个参数是一个真正执行请求并返回数据的异步方法，要求返回 then-able 的函数，通常来说就说要求返回 Promise。

使用唯一 key 还可以做一些其它的事情：

```ts
// 让某个缓存失效
queryClient.invalidateQueries('唯一key');

// 读取缓存
queryClient.getQueryData('唯一key');
```

请求时，如果有参数怎么传递呢？

当 Query 的唯一 key 是数组或对象时通常都包含了查询参数。

```ts
const queryInfo = useQuery(['todos', { status: 1, page: 1 }], fetchTodoList);

// 函数参数
// key -> “todos”
// status -> 1；page -> 1
function fetchTodoList(key, { status, page }) {
  return new Promise();
  // ...
}
```

另外，react-query 还为我们提供了非常好用的调试工具 react-query/devtools，通过如下方式引入：

```ts
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider, QueryClient } from 'react-query';
+ import { ReactQueryDevtools } from 'react-query/devtools';

import App from './App';
import store from './common/store';

function Root() {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
+       <ReactQueryDevtools initialIsOpen={false} position="bottom-right"/>
      </QueryClientProvider>
    </Provider>
  );
}

export default Root;
```

其中，initialIsOpen={false}参数表示默认不展开开发者调试工具面板，position="bottom-right"表示将在页面右下角显示一个调试工具的进入按钮。

react-query 给我们提供了请求 cache 功能，默认情况下，请求将会缓存 5 分钟。所以，初次请求的时候，isLoading 将会为 true，接下来在缓存失效之前，isLoading 将会一直是 false。这是因为，第一次请求之后，react-query 会将请求结果以我们在 useQuery 中指定的第一个参数（即 unique key）为 key 缓存起来，下次再失效之前再请求该接口时，会直接将缓存立即返回，所以就不会出现 isLoading 为 true 的状态，相应的用户也就不用每次都看到 Loading 状态，从而改善了用户体验。不过，这个时候 react-query 同时还是会向服务器发起真实的请求的，等请求结果回来，如果数据相比缓存有变化，则会用新数据更新前端展现。react-query 提供了另一个变量来表示是否真的在向服务器进行请求，即 isFetching。与 isLoading 不同，每次发起请求时，isFetching 都是 true，不管是不是第一次。

上面，我们提到，默认情况下，react-query 会将请求结果缓存 5 分钟。一般情况下，我们用这个默认值就好了，但如果你想改变这个缓存时间的话，只需要给 useQuery 传入第三个参数{cacheTime: 3000}，注意 cacheTime 是以毫秒为单位的。

当然，有的时候，你可能很清楚某个接口的数据变更不频繁，此时可以允许在某个时间段内，如果 react-query 有缓存没过期的话，就直接用缓存，而无需再向服务器发起请求，这个时候，你就可以通过在第三个参数传入{staleTime: xxx}来设定在一次请求之后的多长时间内直接用缓存，而无需向后台发起真实请求。这种情况下，二次请求时 isFetching 也就将是 false。staleTime 的单位也是毫秒。

常用的不仅上面两个参数，常用的参数有：

- retry 失败重试次数，默认 3 次。在请求发生错误时，默认会重试 3 次，如果请求还是不成功 isError 为真。可以通过 retry 配置项更改重试次数或者禁用重试 ( false )。重试次数会增加服务器的压力，这一点务必注意！
- refetchOnWindowFocus 当浏览器窗口重新获取焦点时，重新向服务器端发送请求同步最新状态。默认 false
- refetchOnReconnect 网络重新连接时进行数据重新获取
- refetchOnMount 组件挂载完成后进行数据重新获取
- enabled 如果为“false”的话，“useQuery”不会触发，需要使用其返回的“refetch”来触发操作。
- staleTime 状态的保质期。在同步状态时，如果状态仍然在保质期内，直接从缓存中获取状态，不会在后台发送真实的请求来更新状态缓存。
- placeholderData 在服务端状态没有加载完成前，可以使用占位符状态填充客户端缓存以提升用户体验。
- refetchInterval 指定轮询的间隔时间，false 为不轮询。

关于 enabled 的一个使用用例：

```ts
export function useGetApp(id: number) {
  return useQuery(
    ['getApp', id],
    async () => {
      return await getApp(id);
    },
    {
      enabled: !!id, // 表示当id为空的时候，就不要发起请求了
    }
  );
}
```

那么，如何对这些参数进行全局配置，使得对于整个应用的所有请求都生效呢？如下所示：

```ts
import { ReactQueryConfigProvider, ReactQueryProviderConfig } from 'react-query';

const queryConfig: ReactQueryProviderConfig = {
  queries: {
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
    retry: 0
  },
};

ReactDOM.render(
  <ReactQueryConfigProvider config={queryConfig}>
    <App />
  </ReactQueryConfigProvider>
  document.getElementById('root')
);
```

当然，这是一个非常简单的情况，更复杂的可以参考如下：

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    // 作用于useQuery（Get方法）
    queries: {
      // React 节点挂载时是否重新请求
      refetchOnMount: true,
      // 系统网络重连之后是否重新请求
      refetchOnReconnect: false,
      // 当浏览器窗口重新获取焦点时，重新向服务器端发送请求同步最新状态。
      refetchOnWindowFocus: false,
      // 请求是否需要在固定间隔时间内再次发起，默认false
      refetchInterval: false,
      // react-query中Get请求的缓存时间。在这个时间之内，再次执行这个Query请求时，会先直接返回缓存的结果，同时再向服务器发出真实请求（会不会向服务器，取决于下面的staleTime的配置），请求得到的新数据回来后，有更新的话会更新UI上的数据呈现。单位，毫秒。
      cacheTime: +process.env.REACT_APP_CACHE_TIME,
      // 请求结果的保质期。如果请求结果仍然在保质期内，直接从缓存中获取结果，不会在后台发送真实的请求来更新请求结果的缓存。单位，毫秒。
      staleTime: +process.env.REACT_APP_STALE_TIME,
      // 请求失败后重试次数。注意，修改此值时需要考虑重试次数对服务器QPS的影响！
      retry: +process.env.REACT_APP_RETRY_TIMES,
      // 请求失败后过多久再重试。单位，毫秒。
      retryDelay: +process.env.REACT_APP_RETRY_DELAY,
      /**
       * Query results by default are structurally shared to detect if data has actually changed and if not,
       * the data reference remains unchanged to better help with value stabilization with regards to
       * useMemo and useCallback. If this concept sounds foreign, then don't worry about it! 99.9%
       * of the time you will not need to disable this and it makes your app more performant at zero cost to you.
       */
      structuralSharing: true,
      // 统一报错入口
      onError(error) {
        if (error) {
          console.error(error as Error);
        }
        // 可以在这里做错误的统一拦截处理
      },
    },
    // 作用域useMutation（作用域Post、Put、Patch、Delete方法）
    mutations: {
      // 请求失败后重试次数。注意，修改此值时需要考虑重试次数对服务器QPS的影响！
      retry: +process.env.REACT_APP_RETRY_TIMES,
      // 请求失败后过多久再重试。单位，毫秒。
      retryDelay: +process.env.REACT_APP_RETRY_DELAY,
      // 统一报错入口
      onError(error) {
        if (error) {
          console.error(error as Error);
        }
        // 可以在这里做错误的统一拦截处理
      },
    },
  },
});
```

useQuery 返回的结果中还有更多的内容，可参考如下：

```ts
const query = useQuery('myAPIName', api.returnPromise, {
  // 初始化数据
  initialData: {},
  // 和上面初始化数据类似，但不会被引擎缓存
  placeholder: {},
});

// queryObject
const {
  status, // loading | error | success | idle
  isLoading,
  isError,
  // not start request yet
  isIdle,
  isSuccess,
  // In any state, if the query is fetching at any time (including background refetching) isFetching will be true
  isFetching,
  error, // reject error
  data,
} = query;

// queryCacheByKey
// Query Keys are hashed deterministically!
const q1 = useQuery('myAPIName', () => axios.get());
const q2 = useQuery(['myAPIName', reqParams, appState], () =>
  axios.get(reqParams, appState)
);
```

在 react-query 的 DevConsole 里面可以看到 Query 的四个状态：

- fresh：当前 Query 是「新鲜」的，重复命中 Query 不会重复发起请求
- fetching：当前 Query 是正在执行请求中
- stale：当前 Query 已然过期了，下次执行 Query 会发送请求
- inactive：当前 Query 没有激活，默认 5 分钟后会被回收掉（从内存中移除）

### 乐观更新（optimistic updates）

乐观更新是一种 UI 行为，它在服务端返回操作成功之前，就把 UI 的行为给改变了。

```ts
// 项目列表搜索的参数
export const useProjectSearchParams = () => {
  const [params, setParams] = useUrlQueryParams(['name', 'personId']);
  return [
    useMemo(
      () => ({ ...params, personId: Number(params.personId) || undefined }),
      [params]
    ),
    setParams,
  ] as const;
};
```

```ts
// const queryKey = ['projects', searchParams];

export const useEditProject = (queryKey) => {
  const client = useHttp();
  const queryClient = useQueryClient();
  const [searchParams] = useProjectsSearchParams();

  return useMutation(
    (params: Partial<Project>) => client(`projects/${params.id}`, {
      method: 'PATCH',
      data: params,
    }),
    {
      onSuccess: () => queryClient.invalidateQueries(queryKey),

      async onMutate(target) {

        const previousItems = queryClient.getQueryData(queryKey);
        queryClient.setQueryData(queryKey, (old?: Project[]) => {
          return old?.map(project  => project.id ? {...project, ...target} : project)
        });
        return {previousItems};
      },

      onError(error, newItem, context) {
        queryClient.setQueryData(queryKey, (context as {previousItems: Project[]}.previousItems)
      },
    }
  )
}
```

### 分页查询

react-query 让分页变得非常的简单，同时 Cache 了数据：

https://react-query.tanstack.com/guides/paginated-queries

```ts
function Todos() {
  const [page, setPage] = React.useState(0);
  const fetchProjects = (page: number) => axios.get('/todos');

  const { isLoading, isError, error, data, isFetching, isPreviousData } =
    useQuery(['projects', page], () => fetchProjects(page), {
      keepPreviousData: true,
    });

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          {data.projects.map((project) => (
            <p key={project.id}>{project.name}</p>
          ))}
        </div>
      )}
      <span>Current Page: {page + 1}</span>
      <button
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 0}
      >
        Previous Page
      </button>{' '}
      <button
        onClick={() => {
          if (!isPreviousData && data.hasMore) {
            setPage((old) => old + 1);
          }
        }}
        // Disable the Next Page button until we know a next page is available
        disabled={isPreviousData || !data?.hasMore}
      >
        Next Page
      </button>
      {isFetching ? <span> Loading...</span> : null}{' '}
    </div>
  );
}
```

### 无限滚动查询

https://react-query.tanstack.com/guides/infinite-queries

```ts
import { useInfiniteQuery } from 'react-query';

function Projects() {
  const fetchProjects = async (pg, limit) => {
    const offset = (pg - 1) * limit;
    const res = await axios.get(`/posts?offset=${offset}&limit=${limit}`);
    return res.data;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    'projects',
    ({ pageParam = 1 }) => fetchProjects(pageParam, id, 20),
    {
      getNextPageParam: (lastGroup, allGroups) => {
        return lastGroup?.nextPage || null;
      },
    }
  );

  return status === 'loading' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.projects.map((project) => (
            <p key={project.id}>{project.name}</p>
          ))}
        </React.Fragment>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Load More'
            : 'Nothing more to load'}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </>
  );
}
```

### **预取下一页：queryClient.prefetchQuery**

```ts
// Prefetch the next page!
React.useEffect(() => {
  if (data?.hasMore) {
    queryClient.prefetchQuery(['projects', page + 1], () =>
      fetchProjects(page + 1)
    );
  }
}, [data, page, queryClient]);
```

上面讲的 useQuery 只能用于 Get 请求，那么，其它类型的请求怎么办呢？可以用 useMutation 操作数据，如 Post、Delete、Patch、Put 都可以用 useMutation。

useMutation 的参数通常包含一个真正执行请求的异步方法，返回值第一项为逻辑完备的 mutate 异步方法。

```ts
export const useData = () => {
  // ......

  // 这是一个异步任务
  const asyncApi = useMutation(
    // 第一个参数为异步函数
    async () => {
      const res = await sleep();
      return res.data;
    },
    // 第二个参数是一个配置对象，在其中处理生命周期
    {
      // ↓ 请求前的处理
      onMutate: (variables) => {
        // ↑ variables 为执行该异步任务传入的参数

        // ...

        // ↓ 返回值将挂载到整个生命周期的 context 上下文中
        return { key: 'value' };
      },

      // ↓ 请求成功的处理
      onSuccess: (data, variables, context) => {
        // ↓ data 为异步函数的返回结果，即上文的 res.data 也就是 'result'
        const newData = setData({
          key2: data,
        });

        // ↓ variables 为执行该异步任务传入的参数
        console.log('variables: ', variables);

        // ↓ context 为贯穿于生命周期的上下文对象，我们在请求前的生命周期 onMutate 中给其挂载了 { key: 'value' }
        console.log('context: ', context.key);
      },

      // ↓ 发生错误时进入的生命周期
      onError: (err, variables, context) => {},

      // ↓ 无论结果如何最后都会进入的生命周期
      onSettled: (data, error, variables, context) => {},
    }
  );

  return {
    data,
    setData,
    asyncApi,
  };
};
```

### 应用实践

在使用时，注意将接口的封装和 hook 的封装分层处理，这样层次清晰。
第一层是对于 axios 或者 fetch 的封装；
第二层是基于第二层的封装所做的接口的封装；
第三层是基于第二层用 useQuery 或 useMutation 将接口封装成一个个的 hook。每个文件一个 hook。

#### useQuery 的使用

src\features\myApps\hooks\useGetAppList.ts

```tsx
import { useQuery } from 'react-query';
import { request } from '../../../common/utils';
import { prefix } from './prefix';

// 类型声明
export interface GetAppListParams {
  title: string;
  pageSize: number;
  offset: number;
}

export interface GetAppListResult {
  data: {
    title: string;
    description: string;
    icon: string;
    themeColor: number;
    status: number;
    id: number;
  }[];
  offset: number;
  pageSize: number;
}

// 接口封装层
export const getAppList = async (params: GetAppListParams) => {
  const res = await request({
    method: 'get',
    url: '/app/list',
    params,
  });

  return res.data as GetAppListResult | undefined;
};

// hook封装层
export const useGetAppList = (params: GetAppListParams) => {
  return useQuery([prefix('getAppList'), params], async () => {
    return await getAppList(params);
  });
};
```

src\features\myApps\hooks\useDeleteApp.ts

```tsx
import { message } from 'antd';
import { useMutation } from 'react-query';
import { request } from '../../../common/utils';

// 类型声明
export interface DeleteAppResult {
  data: {
    isSuccess: boolean;
  };
}

// 接口封装层
export const deleteApp = async (id: number) => {
  const result = await request({
    method: 'delete',
    url: `/app/${id}`,
  });

  return result.data as DeleteAppResult | undefined;
};

// hook封装层
export const useDeleteApp = () => {
  return useMutation((id: number) => deleteApp(id), {
    onSuccess(data, variables, context) {
      message.success('删除成功！');
    },
    onError(err: Error, variables, context) {
      console.error('删除失败', err.message);
      message.error('删除失败！');
    },
  });
};
```

调用：

```tsx
import { Dropdown, Menu, Button } from 'antd';
import {
  EllipsisOutlined,
  SettingOutlined,
  EyeOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDeleteApp } from './hooks';
import './AppOperationDropdown.less';

interface AppOperationDropDownProps {
  id: number;
  onDeleteSuccess: () => void;
}

const handleEllipsisClick = (
  evt: React.MouseEvent<HTMLElement, MouseEvent>
) => {
  evt.preventDefault();
};

export default function AppOperationDropDown({
  id,
  onDeleteSuccess,
}: AppOperationDropDownProps) {
  const deleteAppMutation = useDeleteApp();
  const { mutateAsync: deleteApp } = deleteAppMutation;
  const navigate = useNavigate();
  const handleMenuClick = (e) => {
    const { key } = e;

    switch (+key) {
      case 1:
        // 应用设置
        navigate(`/app/${id}/admin/appSettings`);
        break;
      case 2:
        // 访问应用 TODO: 替换pageId
        navigate(`/app/${id}/preview?pageId=123`);
        break;
      case 3:
        // TODO: 复制应用
        break;
      case 4:
        // 删除应用
        deleteApp(id).then(onDeleteSuccess);
        break;
      default:
        break;
    }
  };

  return (
    <Dropdown
      // 下面的overlay的内容不可以提取到单独的组件中，否则会导致Menu的部分样式丢失，如box-shadow、item的hover态等，这个问题比较奇怪
      overlay={
        <Menu
          className="my-apps-app-operation-dropdown"
          onClick={handleMenuClick}
        >
          <Menu.Item key={1}>
            <Button type="link" icon={<SettingOutlined />}>
              应用设置
            </Button>
          </Menu.Item>
          <Menu.Item key={2}>
            <Button type="link" icon={<EyeOutlined />}>
              访问应用
            </Button>
          </Menu.Item>
          {/* <Menu.Item key={3}>
          <Button type="link" icon={<CopyOutlined />}>复制应用</Button>
        </Menu.Item> */}
          <Menu.Item key={4}>
            <Button
              type="link"
              icon={<DeleteOutlined />}
              style={{ color: 'rgb(255, 82, 25)' }}
              loading={deleteAppMutation.isLoading}
            >
              删除应用
            </Button>
          </Menu.Item>
        </Menu>
      }
      placement="bottomCenter"
    >
      <EllipsisOutlined onClick={handleEllipsisClick} />
    </Dropdown>
  );
}
```

#### useMutation 的使用

src\features\myApps\hooks\useDeleteApp.ts

```ts
import { message } from 'antd';
import { useMutation } from 'react-query';
import { request } from '../../../common/utils';

// 类型声明
export interface DeleteAppParams {
  id: number;
}
export interface DeleteAppResult {
  data: {
    isSuccess: boolean;
  };
}

// 接口封装层
export const deleteApp = async (params: DeleteAppParams) => {
  const result = await request({
    method: 'delete',
    url: `/app/${params.id}`,
  });

  return result.data as DeleteAppResult | undefined;
};

// hook封装层
export const useDeleteApp = () => {
  return useMutation((params: DeleteAppParams) => deleteApp(params), {
    onSuccess(data, variables, context) {
      message.success('删除成功！');
      // 执行传入的成功回调
      variables.onSuccess && variables.onSuccess();
    },
    onError(err: Error, variables, context) {
      console.error('删除失败', err.message);
      message.error('删除失败！');
      // 执行传入的失败回调
      variables.onError && variables.onError();
    },
  });
};
```

src\features\myApps\AppOperationDropdown.tsx

```tsx
import { Dropdown, Menu, Button } from 'antd';
import {
  EllipsisOutlined,
  SettingOutlined,
  EyeOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDeleteApp } from './hooks';
import './AppOperationDropdown.less';

interface AppOperationDropDownProps {
  id: number;
  onDeleteSuccess: () => void;
}

const handleEllipsisClick = (
  evt: React.MouseEvent<HTMLElement, MouseEvent>
) => {
  evt.preventDefault();
};

export default function AppOperationDropDown({
  id,
  onDeleteSuccess,
}: AppOperationDropDownProps) {
  const deleteAppMutation = useDeleteApp();
  const { mutateAsync: deleteApp } = deleteAppMutation;
  const navigate = useNavigate();
  const handleMenuClick = (e) => {
    const { key } = e;

    switch (+key) {
      case 1:
        // 应用设置
        navigate(`/app/${id}/admin/appSettings`);
        break;
      case 2:
        // 访问应用 TODO: 替换pageId
        navigate(`/app/${id}/preview?pageId=123`);
        break;
      case 3:
        // TODO: 复制应用
        break;
      case 4:
        // 删除应用
        deleteApp({ id }).then(onDeleteSuccess);
        break;
      default:
        break;
    }
  };

  return (
    <Dropdown
      // 下面的overlay的内容不可以提取到单独的组件中，否则会导致Menu的部分样式丢失，如box-shadow、item的hover态等，这个问题比较奇怪
      overlay={
        <Menu
          className="my-apps-app-operation-dropdown"
          onClick={handleMenuClick}
        >
          <Menu.Item key={1}>
            <Button type="link" icon={<SettingOutlined />}>
              应用设置
            </Button>
          </Menu.Item>
          <Menu.Item key={2}>
            <Button type="link" icon={<EyeOutlined />}>
              访问应用
            </Button>
          </Menu.Item>
          {/* <Menu.Item key={3}>
          <Button type="link" icon={<CopyOutlined />}>复制应用</Button>
        </Menu.Item> */}
          <Menu.Item key={4}>
            <Button
              type="link"
              icon={<DeleteOutlined />}
              style={{ color: 'rgb(255, 82, 25)' }}
              loading={deleteAppMutation.isLoading}
            >
              删除应用
            </Button>
          </Menu.Item>
        </Menu>
      }
      placement="bottomCenter"
    >
      <EllipsisOutlined onClick={handleEllipsisClick} />
    </Dropdown>
  );
}
```

这里我们采用了 mutateAsync，因为需要进行回调处理。如果我们不需要进行回调处理的话，可以用 mutate。

### 对 queryKey 进行提取，方便引用

主要的思路是将获取 queryKey 的方法封装成一个 hook，方便各处饮用获取到 queryKey。因为 queryKey 是包含参数的，所以，需要采用前面封装的 useUrlQueryParams 这个 hook，本质是利用了 url 地址中的 query 来传递我们所需要的参数，方便在 hook 中无依赖地获取到。

src\common\utils\prefixKey.ts

```ts
// 给react-query的key加上模块前缀，保证全局唯一
export const prefixKey = (key, moduleName) => `__rq__${moduleName}__${key}`;
```

src\features\myApps\AppList.tsx

```tsx
import { useCallback, useEffect, useState } from 'react';
import { Empty, Tag, Tooltip, Spin, Pagination } from 'antd';
import { ChromeOutlined } from '@ant-design/icons';
import { useUrlQueryParams } from '../../common/hooks';
import AppOperationDropdown from './AppOperationDropdown';
import { useGetAppList } from './hooks';
+ import { useGetAppListQueryKey } from './keys';
+ import { defaultCurrentPage, defaultPageSize } from './const';
import './AppList.less';

interface AppListProps {
  keyword: string;
  setRefetch: (fetch) => void;
}

export default function AppList({ keyword, setRefetch }: AppListProps) {
+  const [urlQueryParams, setUrlQueryParams] = useUrlQueryParams(['keyword', 'page', 'pageSize']);

+  useEffect(() => {
    setUrlQueryParams({
      ...urlQueryParams,
      page: defaultCurrentPage,
      pageSize: defaultPageSize,
    });
  }, []);

  const appListQuery = useGetAppList(
+    useGetAppListQueryKey(),
    {
      keepPreviousData: true,
    }
  );
  const { isLoading, isError, data: appList, refetch } = appListQuery;

+  const handlePageChange = useCallback((pageNumber) => {
+    setUrlQueryParams({
      ...urlQueryParams,
      page: pageNumber,
    });
+  }, [setUrlQueryParams, urlQueryParams]);

+  const handlePageSizeChange = useCallback((pageSize) => {
+    setUrlQueryParams({
      ...urlQueryParams,
      pageSize,
    });
+  }, [setUrlQueryParams, urlQueryParams]);

  setRefetch(refetch);

  const generateApps = () => {
    if (isLoading) {
      return (
        <div className="loading">
          <Spin></Spin>
        </div>
      );
    }

    if (isError) {
      return <div className="error-tip">服务器开小差了，请稍后重试~</div>;
    }

    if (!appList || !appList.data.length) {
      return <Empty description="没有满足条件的应用"></Empty>;
    }

    return appList.data.map((item) => {
      const tagMap = {
        '0': <Tag className="deleted">已删除</Tag>,
        '1': <Tag className="offline">未启用</Tag>,
        '2': <Tag className="online">已启用</Tag>,
      };
      const tag = tagMap[item.status];

      const handleDeleteSuccess = () => {
        refetch();
      };

      return (
        <a
          className="app-card"
          key={item.id}
          href={`/app/${item.id}/admin/123`}
        >
          <div className="header">
            <div className="icon">
              <ChromeOutlined />
            </div>
            <div className="title">{item.title}</div>
          </div>
          <p className="description">
            <Tooltip
              title={item.description}
              placement="bottom"
              mouseEnterDelay={0.3}
            >
              {item.description}
            </Tooltip>
          </p>

          <div className="footer">
            {tag}
            <AppOperationDropdown
              id={item.id}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </div>
        </a>
      );
    });
  };

  const genPagination = () => {
    return (
      <Pagination
        showQuickJumper
        defaultCurrent={defaultCurrentPage}
        defaultPageSize={defaultPageSize}
        total={appList?.totalCount || 0}
        onChange={handlePageChange}
        onShowSizeChange={handlePageSizeChange}
      />
    );
  };

  return (
    <div className="my-apps-app-list">
      <div className="list">{generateApps()}</div>
      <div className="pagination">{genPagination()}</div>
    </div>
  );
}
```

src\features\myApps\keys.ts

```ts
/**
 * 汇总请求 key 的意义在于：
 * 1）调取全局 client 进行重复请求或者阻断、获取缓存都是会模糊匹配 key list 的，汇总 key 为可能的全局操作提供便利；
 * 2）一个有意义的 key 可以帮助你在 react-query/devtools 里快速分辨是什么请求。
 */
import { prefixKey } from '../../common/utils';
import { useUrlQueryParams } from '../../common/hooks';

const moduleName = '__myApps__';
const prefix = (key) => prefixKey(key, moduleName);

export type GetAppListQueryKey = [
  string,
  {
    title: string;
    pageSize: number;
    offset: number;
  }
];

export const useGetAppListQueryKey = () => {
  const [urlQueryParams] = useUrlQueryParams(['keyword', 'page', 'pageSize']);
  const pageSize = +urlQueryParams.pageSize;
  const page = +urlQueryParams.page;

  const params = {
    title: urlQueryParams.keyword,
    pageSize,
    offset: (page - 1) * pageSize,
  };

  return [prefix('getAppList'), params] as GetAppListQueryKey;
};
```

src\features\myApps\hooks\useGetAppList.ts

```ts
import { useQuery } from 'react-query';
import { request } from '../../../common/utils';
import { App } from '../../../common/types';
+ import { GetAppListQueryKey } from '../keys';
import { defaultCurrentPage, defaultPageSize } from '../const';

// 类型声明
export interface GetAppListResult {
  data: App[];
  offset: number;
  pageSize: number;
  totalCount: number;
}

// 接口封装层
export const getAppList = async (params) => {
  const res = await request({
    method: 'get',
    url: '/app/list',
    params,
  });

  return res.data as GetAppListResult | undefined;
};

// hook封装层
+ export const useGetAppList = (getAppListQueryKey: GetAppListQueryKey, options?) => {
+  const [key, params] = getAppListQueryKey;

  return useQuery(getAppListQueryKey, async () => {
    return await getAppList(params);
  }, {
+    ...options,
+    enabled: params.pageSize > 0 && params.offset >= 0,
  });
};
```

### 在账号退出登录的时候，需要清空一下 react-query 的缓存

以防止一个账号退出登录后立即换另一个账号登录时，还有接口能先看到上一个账号请求后缓存的数据，然后再跳变成新数据（通常是使用了{keepPreviousData: true}选项的接口中可见）。

```ts
const queryClient = useQueryClient();
const logout = () =>
  auth.logout().then(() => {
    setUser(null);
    queryClient.clear();
  });
```

### react-query 对于一段时间内（默认是 2 秒，可设置）的多个同一请求 key 的请求，会合并成一个，不会重复请求。所以，对于页面中有多个卡片，每个卡片中都使用了同一请求 key 的 Query 的情况，不用担心重复请求。

参考：
react-query 在项目中的架构封装设计（大量实践经验）
https://blog.csdn.net/qq_21567385/article/details/117408650?spm=1001.2014.3001.5502

react-query 请求服务器状态管理配置、query 查询请求、query 设置过期、预拉取、缓存读取等设置
https://blog.csdn.net/weixin_43294560/article/details/114856693?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522164416873916781683952154%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=164416873916781683952154&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_ecpm_v1~rank_v31_ecpm-1-114856693.pc_search_insert_ulrmf&utm_term=react-query&spm=1018.2226.3001.4187

https://www.yuque.com/cmint/grk2lw/qvhiaa#381589be
一个翻译文档（还没完全翻译完）
https://www.yuque.com/quanscheng/react-query/ifa2bi
https://zhuanlan.zhihu.com/p/261146977
https://www.bilibili.com/video/BV1qq4y1F7BM?spm_id_from=333.999.0.0
https://juejin.cn/post/6937833844837974053
Practical React Query
https://tkdodo.eu/blog/practical-react-query
https://codemachine.dev/things-i-learned-while-using-react-query-part-1

## export interface from xxx 的报错

我们在./create.ts 中定义了函数 createApp 和 接口 CreateAppParams、CreateAppResult，但在使用 export { createApp, CreateAppParams, CreateAppResult } from './createApp'; 进行导出的时候，出现了报错，与函数的导出不同，对接口需要用 export type 来单独进行重新导出。

```ts
export { createApp } from './createApp';
export type { CreateAppParams, CreateAppResult } from './createApp';
```

## ant design 的 Dropdown 组件中的 overlay 里面的 menu 标签，不可以单独提到另外一个组件中进行封装，否则会出现 Menu 部分样式丢失。

下面的 overlay 的内容不可以提取到单独的组件中，否则会导致 Menu 的部分样式丢失，如 box-shadow、item 的 hover 态等，这个问题比较奇怪

```tsx
<Dropdown
  overlay={
    <Menu className="my-apps-app-operation-dropdown" onClick={handleMenuClick}>
      <Menu.Item key={1}>
        <Button type="link" icon={<SettingOutlined />}>
          应用设置
        </Button>
      </Menu.Item>
      <Menu.Item key={2}>
        <Button type="link" icon={<EyeOutlined />}>
          访问应用
        </Button>
      </Menu.Item>
      {/* <Menu.Item key={3}>
      <Button type="link" icon={<CopyOutlined />}>复制应用</Button>
    </Menu.Item> */}
      <Menu.Item key={4}>
        <Button
          type="link"
          icon={<DeleteOutlined />}
          style={{ color: 'rgb(255, 82, 25)' }}
          loading={deleteAppMutation.isLoading}
        >
          删除应用
        </Button>
      </Menu.Item>
    </Menu>
  }
  placement="bottomCenter"
>
  <EllipsisOutlined onClick={handleEllipsisClick} />
</Dropdown>
```

## 以一个函数作为状态（state）

想要把一个函数作为状态，应该怎么做呢，首先你可能想到的是给 useState 传入一个函数作为初始值。

但是，其实直接给 useState() 传入函数是有特殊的意义，它的意义就是惰性初始化。什么是惰性初始化呢？就是当某一个初始化的动作耗时很长时，就需要惰性初始化。也就是说，传入 useState()的这个函数会立即执行一次，而不是我们所理解的给一个 state 设置初始值为这个函数。这就导致一个问题，如果我们就是想给某个状态初始值设置成一个函数，那应该怎么办呢？

有两个办法：

方法 1，给这个函数外面再套一层，函数，然后在函数内部返回这个函数，这样就可以在惰性初始化时，虽然被执行了一次，但得到的初始值仍然是一个函数。另外要注意的是，在 setXxx 设置状态的时候，对于传入的函数外面也要包裹一层，以真正想要设置的函数作为其返回值。

src\features\myApps\AppListPage.tsx

```tsx
import { useState, useRef } from 'react';
import AppList from './AppList';
import SearchPanel from './SearchPanel';
import CreateAppModal from './CreateAppModal';
import { useDocumentTitle } from '../../common/hooks';
import './AppListPage.less';

export default function AppListPage() {
  useDocumentTitle('应用列表', false);

  const [keyword, setKeyword] = useState('');
+  const [refetch, setRefetch] = useState(() => () => {}); // 注意这里不能直接传入目标函数（直接传入函数是惰性初始化），而是要传入一个返回目标函数的函数

  const handleCreateSuccess = () => {
    refetch();
  };

  return (
    <>
      <div className="my-apps-app-list-page">
        <CreateAppModal onSuccess={handleCreateSuccess} />
        <SearchPanel keyword={keyword} setKeyword={setKeyword} />
        <AppList keyword={keyword} setRefetch={setRefetch} />
      </div>
    </>
  );
}
```

src\features\myApps\AppList.tsx

```tsx
import { useState, useEffect } from 'react';
import { Empty, Tag, Tooltip, Spin, Pagination } from 'antd';
import { ChromeOutlined } from '@ant-design/icons';
import AppOperationDropdown from './AppOperationDropdown';
import { useGetAppList } from './hooks';
import './AppList.less';

interface AppListProps {
  keyword: string;
  setRefetch: (fetch) => void;
}

export default function AppList({ keyword, setRefetch }: AppListProps) {
  const defaultCurrentPage = 1;
  const defaultPageSize = 2;
  const [page, setPage] = useState(defaultCurrentPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const appListQuery = useGetAppList(
    {
      title: keyword,
      pageSize,
      offset: (page - 1) * pageSize,
    },
    {
      keepPreviousData: true,
    }
  );
  const { isLoading, isError, data: appList, refetch } = appListQuery;

  +useEffect(() => setRefetch(() => refetch), []); //  注意这里不能直接传入函数，而是要传入一个返回目标函数的函数

  const generateApps = () => {
    if (isLoading) {
      return (
        <div className="loading">
          <Spin></Spin>
        </div>
      );
    }

    if (isError) {
      return <div className="error-tip">服务器开小差了，请稍后重试~</div>;
    }

    if (!appList.data.length) {
      return <Empty description="没有满足条件的应用"></Empty>;
    }

    return appList.data.map((item) => {
      const tagMap = {
        '0': <Tag className="deleted">已删除</Tag>,
        '1': <Tag className="offline">未启用</Tag>,
        '2': <Tag className="online">已启用</Tag>,
      };
      const tag = tagMap[item.status];

      const handleDeleteSuccess = () => {
        refetch();
      };

      return (
        <a
          className="app-card"
          key={item.id}
          href={`/app/${item.id}/admin/123`}
        >
          <div className="header">
            <div className="icon">
              <ChromeOutlined />
            </div>
            <div className="title">{item.title}</div>
          </div>
          <p className="description">
            <Tooltip
              title={item.description}
              placement="bottom"
              mouseEnterDelay={0.3}
            >
              {item.description}
            </Tooltip>
          </p>

          <div className="footer">
            {tag}
            <AppOperationDropdown
              id={item.id}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </div>
        </a>
      );
    });
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handlePageSizeChange = (pageSize) => {
    setPageSize(pageSize);
  };

  const genPagination = () => {
    return (
      <Pagination
        showQuickJumper
        defaultCurrent={defaultCurrentPage}
        defaultPageSize={defaultPageSize}
        total={appList?.totalCount || 0}
        onChange={handlePageChange}
        onShowSizeChange={handlePageSizeChange}
      />
    );
  };

  return (
    <div className="my-apps-app-list">
      <div className="list">{generateApps()}</div>
      <div className="pagination">{genPagination()}</div>
    </div>
  );
}
```

方法 2，用 useRef 包裹这个函数，然后修改这个 Ref 的时候用 xxxRef.current = yyy。

注意，Ref 的改变是不会触发组件重新渲染的，所以会有下面这第 17 行标注的特别注意事项！

src\features\myApps\AppListPage.tsx

```tsx
import { useState, useRef } from 'react';
import AppList from './AppList';
import SearchPanel from './SearchPanel';
import CreateAppModal from './CreateAppModal';
import { useDocumentTitle } from '../../common/hooks';
import './AppListPage.less';

export default function AppListPage() {
  useDocumentTitle('应用列表', false);

  const [keyword, setKeyword] = useState('');
+  const refetchRef = useRef(null);
+  const setRefetchRef = (newRefetch) => {
+    refetchRef.current = newRefetch;
+  }

  const handleCreateSuccess = () => {
     // 注意！！！这里要现获取refetchRef.current，而不能在外面定义一个变量保存refetchRef.current，然后直接使用这个变量。这是因为，Ref的改变是不会触发重新渲染的，所以那个变量的值会一直是初次渲染的时候读到的refetchRef.current
+    refetchRef.current && refetchRef.current();
  };

  return (
    <>
      <div className="my-apps-app-list-page">
        <CreateAppModal onSuccess={handleCreateSuccess} />
        <SearchPanel keyword={keyword} setKeyword={setKeyword} />
+        <AppList keyword={keyword} setRefetch={setRefetchRef} />
      </div>
    </>
  );
}
```

src\features\myApps\AppListPage.tsx

```tsx
import { useState, useEffect } from 'react';
import { Empty, Tag, Tooltip, Spin, Pagination } from 'antd';
import { ChromeOutlined } from '@ant-design/icons';
import AppOperationDropdown from './AppOperationDropdown';
import { useGetAppList } from './hooks';
import './AppList.less';

interface AppListProps {
  keyword: string;
+  setRefetch: any;
}

+ export default function AppList({ keyword, setRefetch }: AppListProps) {
  const defaultCurrentPage = 1;
  const defaultPageSize = 2;
  const [page, setPage] = useState(defaultCurrentPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const appListQuery = useGetAppList(
    {
      title: keyword,
      pageSize,
      offset: (page - 1) * pageSize,
    },
    {
      keepPreviousData: true,
    }
  );
  const { isLoading, isError, data: appList, refetch } = appListQuery;

+  setRefetch(refetch);

  const generateApps = () => {
    if (isLoading) {
      return (
        <div className="loading">
          <Spin></Spin>
        </div>
      );
    }

    if (isError) {
      return <div className="error-tip">服务器开小差了，请稍后重试~</div>;
    }

    if (!appList.data.length) {
      return <Empty description="没有满足条件的应用"></Empty>;
    }

    return appList.data.map((item) => {
      const tagMap = {
        '0': <Tag className="deleted">已删除</Tag>,
        '1': <Tag className="offline">未启用</Tag>,
        '2': <Tag className="online">已启用</Tag>,
      };
      const tag = tagMap[item.status];

      const handleDeleteSuccess = () => {
        refetch();
      };

      return (
        <a
          className="app-card"
          key={item.id}
          href={`/app/${item.id}/admin/123`}
        >
          <div className="header">
            <div className="icon">
              <ChromeOutlined />
            </div>
            <div className="title">{item.title}</div>
          </div>
          <p className="description">
            <Tooltip
              title={item.description}
              placement="bottom"
              mouseEnterDelay={0.3}
            >
              {item.description}
            </Tooltip>
          </p>

          <div className="footer">
            {tag}
            <AppOperationDropdown
              id={item.id}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </div>
        </a>
      );
    });
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handlePageSizeChange = (pageSize) => {
    setPageSize(pageSize);
  };

  const genPagination = () => {
    return (
      <Pagination
        showQuickJumper
        defaultCurrent={defaultCurrentPage}
        defaultPageSize={defaultPageSize}
        total={appList?.totalCount || 0}
        onChange={handlePageChange}
        onShowSizeChange={handlePageSizeChange}
      />
    );
  };

  return (
    <div className="my-apps-app-list">
      <div className="list">{generateApps()}</div>
      <div className="pagination">{genPagination()}</div>
    </div>
  );
}
```

## 组件被卸载后，调用设置组件状态报错 Warning: Can't perform a React state update on an unmounted component

比如，我们发出一个请求，等 3S 后请求返回，但是这时用户已经切换到别的页面去了，原先请求数据的组件也就被卸载了，但数据请求成功后，还会去更新数据（比如，setData），这个时候，就会出现上面这个错误。该怎么解决呢，就是写一个 hook，维护一个组件是否已加载或已卸载的 Ref。

src\common\hooks\useMountedRef.ts

```ts
import { useEffect, useRef } from 'react';

/**
 * 返回组件的挂载状态，如果还没有挂载或者已经被卸载，则返回false，否则返回true
 */
export const useMountedRef = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  });

  return mountedRef;
};
```

然后，像如下这样使用：

```tsx
const mountedRef = useMountedRef();

// 在组件已经被卸载时，不再调用setData
mountedRef && setData(xxx);
```

## useCallback

一个非状态（即非 state）且非基本数据类型的数据，是不能放在 useEffect 的依赖（useEffect 的第二个参数）里的，否则会造成无限循环渲染。之所以会重新渲染，是因为每次渲染的时候，这个非状态且非基本数据类型的数据都会重新创建，从而在新旧两个变量在进行浅比较的时候不相等，从而就会重新渲染。

但是，当你在 useEffect 的第一个函数，在这个函数内部使用了某个非状态且非基本数据类型的变量，而这个变量却没有在 useEffect 的第二个参数里面的时候，Eslint 会报错。但是若将这个变量放进第二个参数中，则又会造成无线循环渲染。怎么办呢？

要想把这个变量加入到 useEffect 的第二个参数中，我们就需要把这个变量变成不是每次渲染都变化的变量。怎么变呢？可以用 useMemo 进行包裹，也可以用 useCallback 进行包裹。useCallback 是特殊版本的 useMemo。

其使用方法如下，仍然是第二个参数传入被依赖的项。这样，第二个参数就是依赖项。

```ts
const startEdit = useCallback(
  (id: number) => {
    setEditingTaskId({ editingTaskId: id });
  },
  [setEditingTaskId]
);
```

例如，上面这个函数，setEditingTaskId 是依赖项，这意味着，setEditingTaskId 变化时，startEdit 会被更新。其它时候，startEdit 不会被更新。

值得注意的是，如果你在 useCallback 的依赖项里面依赖了某个 state，而在 useCallback 的函数体内，又对这个 state 进行了设置，也会导致循环渲染，例如，下面这样：

```ts
const startEdit = useCallback(
  (id: number) => {
    setEditingTaskId({ editingTaskId: id });
    setState(...state, status: 'loading')
  },
  [setEditingTaskId, state]
);
```

那怎么办呢？可以用到 setState 接收函数的做法，接收一个函数，从而获得变更前的 state，这样就不再依赖于 state 了，所以也就没必要传入 state 这个依赖项了。

```ts
const startEdit = useCallback(
  (id: number) => {
    setEditingTaskId({ editingTaskId: id });
+    setState(prevState => ({
+      ...prevState,
+      status: 'loading',
+    }))
  },
+  [setEditingTaskId]
);
```

useMemo 的意思就是：不要每次渲染都重新定义，而是我让你重新定义的时候再重新定义(第二个参数，依赖列表里的依赖变化时，才重新定义)。useMemo 里的回调函数如果有用到变量的话，IDE 就会提醒加上依赖了。

这就是使用 useMemo 的原理，useMemo 适用于所有类型的值，假如这个值恰好是函数，那么用 useCallback 也可以。也就是说，useCallback 是一种特殊的 useMemo。

在这里再粗暴地给大家总结一下日常使用的场景：

如果你定义了一个变量，满足下面的条件就最好用 useMemo 和 useCallback 给包裹住：

1. 它不是状态，也就是说，不是用 useState 定义的(redux 中的状态实际上也是用 useState 定义的)
2. 它不是基本类型
3. 它会被放在 useEffect 的依赖列表里 || 自定义 hook 的返回值

说一下第 3 条，中间的两个竖线是 或，也就是两者满足其一第 3 条就成立。自定义 hook 的返回值也成立是因为，你不知道自定义 hook 的返回值将会被用在哪里，它可能会被用在依赖也可能不会，所以干脆都加上。

## 组件组合（composition component）

使用 Context 之前的考虑：

Context 主要应用场景在于很多不同层级的组件需要访问一些同样的数据。请谨慎使用，因为这会使得组件的复用性变差。

如果你只是想避免层层传递一些属性，组件组合（component composition， https://react.docschina.org/docs/composition-vs-inheritance.html）有时候是一个比 context 更好的解决方案。

当你在写的自定义 hook，返回的内容里面有函数的时候，大概率你是需要用 useCallback 给它包裹一层的，否则别人在 useEffect 里面使用你这个函数的时候，Eslint 就会报错说要把它加入到依赖之中，而如果对方按要求加入进去的话，就会导致循环渲染，而如果不加入的话，又会出现 Eslint 报错。

比如，考虑这样一个 Page 组件，它层层向下传递 user 和 avatarSize 属性，从而让深度嵌套的 Link 和 Avatar 组件可以读取到这些属性：

```tsx
<Page user={user} avatarSize={avatarSize} />
// ... 渲染出 ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... 渲染出 ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... 渲染出 ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

如果在最后只有 Avatar 组件真的需要 user 和 avatarSize，那么层层传递这两个 props 就显得非常冗余。而且一旦 Avatar 组件需要更多从来自顶层组件的 props，你还得在中间层级一个一个加上去，这将会变得非常麻烦。

一种 无需 context 的解决方案是将 Avatar 组件自身传递下去，因为中间组件无需知道 user 或者 avatarSize 等 props：

```tsx
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// 现在，我们有这样的组件：
<Page user={user} avatarSize={avatarSize} />
// ... 渲染出 ...
<PageLayout userLink={...} />
// ... 渲染出 ...
<NavigationBar userLink={...} />
// ... 渲染出 ...
{props.userLink}
```

**这种变化下，只有最顶部的 Page 组件需要知道 Link 和 Avatar 组件是如何使用 user 和 avatarSize 的。这种对组件的控制反转减少了在你的应用中要传递的 props 数量，这在很多场景下会使得你的代码更加干净，使你对根组件有更多的把控。但是，这并不适用于每一个场景：这种将逻辑提升到组件树的更高层次来处理，会使得这些高层组件变得更复杂，并且会强行将低层组件适应这样的形式，这可能不会是你想要的。**

而且你的组件并不限制于接收单个子组件。**你可能会传递多个子组件，甚至会为这些子组件（children）封装多个单独的“接口（slots）”，如下所示：**

```tsx
function Page(props) {
  const user = props.user;
  const content = <Feed user={user} />;
  const topBar = (
    <NavigationBar>
      <Link href={user.permalink}>
        <Avatar user={user} size={props.avatarSize} />
      </Link>
    </NavigationBar>
  );
  return <PageLayout topBar={topBar} content={content} />;
}
```

这种模式足够覆盖很多场景了，在这些场景下你需要将子组件和直接关联的父组件解耦。如果子组件需要在渲染前和父组件进行一些交流，你可以进一步使用 render props。

但是，有的时候在组件树中很多不同层级的组件需要访问同样的一批数据。Context 能让你将这些数据向组件树下所有的组件进行“广播”，所有的组件都能访问到这些数据，也能访问到后续的数据更新。使用 context 的通用的场景包括管理当前的 locale，theme，或者一些缓存数据，这比替代方案要简单的多。

## 处理 ant design form 的报错

```ts
useEffect(() => {
  // 会报一个错误，Warning: Instance created by `useForm` is not connected to any Form element.
  // 所以需要用setTimeout包裹一下，原因待研究
  // https://stackoverflow.com/questions/61056421/warning-instance-created-by-useform-is-not-connect-to-any-form-element/65641605
  setTimeout(() => {
    form.setFieldsValue(initialInfo);
  }, 0);
}, [initialInfo, form]);
```

## Ant Design 的当前页改变和 pageSize 改变都会触发 onChange

官方 API 可以看出，onShowSizeChange -> function(currentPage, pageSize) 回调的参数为当前页码和改变后的 pageSize；onChange -> function(currentPage, pageSize) 由回调的参数可以看出，当当前页码和 pageSize 发生改变时，均会触发 onChange 回调。这就是当改变 pageSize 时，会触发 onShowSizeChange 一次，然后触发 onChange。

综上：

当给分页设置了 currentPage 和 pageSize 两个属性值后，切换页码和 pageSize 时，只需要指定 onChange 回调就可以了。

## 开发一个页面的一般步骤

### 定义基础设施

定义 type

```ts
export interface Kanban {
  id: number;
  name: string;
  projectId: number;
}
```

定义接口请求 hook

```ts
import { useHttp } from 'utils/http';
import { QueryKey, useMutation, useQuery } from 'react-query';
import { Kanban } from 'types/kanban';

export const useKanbans = (param?: Partial<Kanban>) => {
  const client = useHttp();

  return useQuery<Kanban[]>(['kanbans', param], () =>
    client('kanbans', { data: param })
  );
};
```

### 创建页面

```tsx
import React, { useCallback } from 'react';
import { useDocumentTitle } from 'utils';
import {
  useKanbanSearchParams,
  useKanbansQueryKey,
  useProjectInUrl,
  useTasksQueryKey,
  useTasksSearchParams,
} from 'screens/kanban/util';
import { useKanbans } from 'utils/kanban';

export const KanbanScreen = () => {
  useDocumentTitle('看板列表');

  const { data: currentProject } = useProjectInUrl();
  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(
    useKanbanSearchParams()
  );
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams());
  const isLoading = taskIsLoading || kanbanIsLoading;

  return (
    <DragDropContext>
      <ScreenContainer>
        <h1>{currentProject?.name}看板</h1>
        <SearchPanel />
        {isLoading ? (
          <Spin size={'large'} />
        ) : (
          <ColumnsContainer>...</ColumnsContainer>
        )}
        <TaskModal />
      </ScreenContainer>
    </DragDropContext>
  );
};
```

### 定义请求页面中某个区块数据的 queryKey

```ts
export const useKanbanSearchParams = () => ({ projectId: useProjectIdInUrl() });
export const useKanbansQueryKey = () => ['kanbans', useKanbanSearchParams()];
```

### 然后定义请求更具体数据的 Hook

### 然后定义页面中的组件

## 拖拽：react-beautiful-dnd

// TODO：

## React 性能优化

### 使用 React.lazy 来异步加载组件，进行代码分割。

React.lazy 方法可以异步加载组件文件。

```tsx
const Foo = React.lazy(() => import('../componets/Foo));
```

注意，被导入的组件需要用 export default 导出组件。

React.lazy 不能单独使用，需要配合 React.Suspense 使用。React.Suspense 是用来包裹异步组件，添加 loading 效果等。
注意 lazy 的 l 是小写，而 Suspense 的 S 是大写！

```ts
<React.Suspense fallback={<div>loading...</div>}>
  <Foo />
</React.Suspense>
```

React.lazy 原理：

React.lazy 使用 import 来懒加载组件，import 在 webpack 中最终会调用 requireEnsure 方法，动态插入 script 来请求 js 文件，类似 jsonp 的形式。

比如，当一个页面中同时存在已登录和未登录组件，则可以对这两个组件用 React.Lazy 进行包裹，延迟加载：

```tsx
import React from 'react';
import './App.css';
import { useAuth } from 'context/auth-context';
import { ErrorBoundary } from 'components/error-boundary';
import { FullPageErrorFallback, FullPageLoading } from 'components/lib';

const AuthenticatedApp = React.lazy(() => import('authenticated-app'));
const UnauthenticatedApp = React.lazy(() => import('unauthenticated-app'));

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <ErrorBoundary fallbackRender={FullPageErrorFallback}>
        <React.Suspense fallback={<FullPageLoading />}>
          {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
```

React.lazy 用于路由懒加载：

```ts
import { lazy, Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { FullPageLoading } from './common/components/FullPageLoading';

const NotFoundPage = lazy(() => import('./features/exception/NotFoundPage'));
const MainLayout = lazy(() => import('./features/home/MainLayout'));
const MainPage = lazy(() => import('./features/home/MainPage'));
const AppListPage = lazy(() => import('./features/myApps/AppListPage'));
const AdminLayout = lazy(() => import('./features/management/AdminLayout'));
const ManagementPage = lazy(
  () => import('./features/management/ManagementPage')
);
const AppSettingsPage = lazy(
  () => import('./features/settings/AppSettingsPage')
);
const AppPublishPage = lazy(() => import('./features/publish/AppPublishPage'));
const DesignerPage = lazy(() => import('./features/design/DesignerPage'));
const PreviewPage = lazy(() => import('./features/preview/PreviewPage'));
const RegisterPage = lazy(() => import('./features/auth/RegisterPage'));
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const ProfilePage = lazy(() => import('./features/user/ProfilePage'));
const TodosPage = lazy(() => import('./features/examples/TodosPage'));
// import routeConfig from './common/routeConfig.js';

function App() {
  const mainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '*',
        element: <Navigate to="/404" />,
      },
      {
        path: '/',
        element: <MainPage />,
      },
      {
        path: '404',
        element: <NotFoundPage />,
      },
      {
        path: 'myApps',
        element: <AppListPage />,
      },
      {
        path: 'app/:appId/admin',
        element: <Navigate to=":pageId" />,
      },
      {
        path: 'app/:appId/design',
        element: <DesignerPage />,
      },
      {
        path: 'app/:appId/preview',
        element: <PreviewPage />,
      },
      {
        path: 'auth/register',
        element: <RegisterPage />,
      },
      {
        path: 'auth/login',
        element: <LoginPage />,
      },
      {
        path: 'user/:userId/profile',
        element: <ProfilePage />,
      },
      {
        path: 'examples/todos',
        element: <TodosPage />,
      },
    ],
  };
  const adminRoutes = {
    path: 'app/:appId/admin/',
    element: <AdminLayout />,
    children: [
      {
        path: '*',
        element: <Navigate to="/404" />,
      },
      {
        path: ':pageId',
        element: <ManagementPage />,
      },
      {
        path: 'appPublish',
        element: <AppPublishPage />,
      },
      {
        path: 'appSettings',
        element: <AppSettingsPage />,
      },
    ],
  };
  const routing = useRoutes([mainRoutes, adminRoutes]);
  // const routing = useRoutes([routeConfig]);

  return (
    <div className="app">
      <Suspense fallback={<FullPageLoading></FullPageLoading>}>
        {routing}
      </Suspense>
    </div>
  );
}

export default App;
```

### React.memo

在 React 中，改变父组件的状态，对父组件进行渲染，无论这个状态子组件是否用到，子组件都会重新渲染。假设某个子组件的渲染非常耗性能，我们就可以用 React.memo 来包裹这个组件，减少这种不必要的渲染。

```ts
function Child(props) {
  return <div>...</div>;
}

function areEqual(prevProps, nextProps) {
  if (prevProps.someProp === nextProps.someProp) {
    return true;
  } else {
    return false;
  }
}

export default React.memo(Child, areEqual);
```

React.memo()可接受 2 个参数，第一个参数为纯函数的组件，第二个参数用于对比 props 来控制是否重渲染组件，与 shouldComponentUpdate()功能类似。

当不传入第二个参数的时候，被 React.memo 包裹的这个组件在其自身的 prevProps 和 nextProps 浅比较之后若不等 或者 这个组件使用了 redux 等中的全局状态时，才会重新渲染。不受其它外部传入状态的影响。

那是不是每个组件都要用 React.memo 包裹起来呢？实际上不需要。要用到 React.memo 的机会其实不太多。只用在重新渲染比较耗性能的组件上。另外，React.memo 本身要进行浅比较，也是有成本的。

React.memo 是用在一个组件上的，useMemo 是用来包裹一个值的。

比如，下面的 Layout 组件因为无参数，也没有用到 redux 等全局状态，所以可以用 React.memo 第二个参数传 return false 的函数来直接优化。

```tsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './MainLayout.less';

function MainLayout() {
  return (
    <div className="home-main-layout">
      <ul className="demo-nav">
        <li>
          <Link to="/">首页</Link>
        </li>
        <li>
          <Link to="/myApps">我的应用</Link>
        </li>
        <li>
          <Link to="/app/1/admin/123">Page Management for app 1 page 123</Link>
        </li>
        <li>
          <Link to="/app/1/admin/appPublish">Publish app 1</Link>
        </li>
        {/* <li><Link to="/app/1/admin/appSettings">Settings for app 1</Link></li> */}
        <li>
          <Link to="/app/1/design?pageId=123">Design app 1 page 123</Link>
        </li>
        <li>
          <Link to="/app/1/preview?pageId=123">Preview app 1 page 123</Link>
        </li>
        <li>
          <Link to="/auth/register">注册</Link>
        </li>
        <li>
          <Link to="/auth/login">登录</Link>
        </li>
        <li>
          <Link to="/user/1/profile">我的档案</Link>
        </li>
        <li>
          <Link to="/examples/todos">计数器例子</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}

export default React.memo(MainLayout, () => false);
```

## React 性能追踪：用 React 的 Profiler 来进行性能追踪

Profiler 测量渲染一个 React 应用多久渲染一次以及渲染一次的“代价”。它的目的是识别出应用中渲染较慢的部分，或是可以用类似 memoization 优化的部分。

Profiler 可以用来作为一个组件包裹在任何组件的外面。一个应用中可以使用多个 Profiler。

尽管 Profiler 是一个轻量级组件，但我们仍然要注意只在需要时才使用它。因为每一个添加都会给 CPU 和内存增加一些负担。

```tsx
<Profiler id="xxx" onRender={callback}>
  <SomeComponent />
</Profiler>
```

因为 Profiler 会增加额外的开支，所以它在生产构建中默认是被禁用的。

如果需要用到它的时候，可以通过

npm run build -- --profile

或者

yarn build --profile

来启用它。

```tsx
import React, { ProfilerProps, ProfilerOnRenderCallback } from 'react';

type Props = { metadata?: any; phases?: ('mount' | 'update')[] } & Omit<
  ProfilerProps,
  'onRender'
>;

let queue: unknown[] = [];

const sendProfileQueue = () => {
  if (!queue.length) {
    return;
  }

  const queueToSend = [...queue];
  queue = [];
  console.log(queueToSend);
};

// 每隔5秒批量打印输出一次，以避免打印过于频繁
setInterval(sendProfileQueue, 5000);

export const Profiler = ({ metadata, phases, ...props }: Props) => {
  const reportProfile: ProfilerOnRenderCallback = (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
    interactions: Set<unknown>
  ) => {
    // 指定如果没有传入phases，则所有更新都记录
    // 否则，如果phase属于phases中，则也要记录
    // phase是阶段的意思，比如，mount阶段、update阶段
    if (!phases || phases.includes(phase)) {
      queue.push({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
        metadata,
      });
    }
  };

  return <React.Profiler onRender={reportProfile} {...props} />;
};
```

然后像如下这样使用：

```tsx
import { Profiler } from '../../common/components/Profiler';
...
<Profiler id="app-list" phases={['update', 'mount']} >
  <AppList keyword={keyword} setRefetch={setRefetchRef} />
</Profiler>
...
```

我在初次改变 pageSize 时，onChange 里面接收到的 currentPage 是 0，不知道是受到什么的影响。后来，为了解决这个问题，我在 onChange 里面判断了一下，如果 currentPage 是小于等于 0，就把它变成 1。

## 自动化测试

### 目的：让我们对自己写的代码更有信心，防止出现“新代码破坏旧代码”的无限循环。

### 分类：（从上往下粒度越来越大）

- 单元测试：传统单元测试、组件测试、hook 测试

- 集成测试：多个单元集成成一起，变成一个模块，测试这个模块

- e2e 测试（端到端测试）：模拟用户

### 安装依赖

Create React App 已经默认给我们安装了几个测试依赖：

```json
"@testing-library/jest-dom": "^5.16.1",
"@testing-library/react": "^12.1.2",
"@testing-library/user-event": "^13.5.0",
```

我们还需要安装如下两个：

```sh
pnpm add @testing-library/react-hooks msw -D
```

### 测试一个函数：

http 模块的单元测试
**test**/http.ts

```ts
// 这个是用来mock异步请求的，因为单元测试不能去直接测试真实的请求，那样的话请求有可能成功，有可能失败，就没法隔离环境对单元测试结果的影响了
import { setupServer } from 'msw/node';

// rest可以用来很方便的mock RESTful的接口
import { rest } from 'msw';
const apiUrl = process.env.REACT_APP_API_URL;
const server = setupServer();

// jest是对react最友好的一个测试库
// beforeAll 代表执行所有测试之前，先要执行的回调函数
beforeAll(() => server.listen());

// 每一个测试跑完以后，都重置mock路由
afterEach(() => server.resetHandlers());

// 所有的测试跑完以后，关闭mock路由
afterAll(() => server.close());

test('http方法发送异步请求', async () => {
  const endpoint = 'test-endpoint'; // 请求的地址
  const mockResult = { mockValue: 'mock' }; // mock请求返回的值

  server.use(
    rest.get(`${apiUrl}/${endpoint}`, (req, res, ctx) =>
      res(ctx.json(mockResult))
    )
  );

  const result = await http(endpoint);
  expect(result).toEqual(mockResult);
});

http('http请求时会在header里带上token', async () => {
  const token = 'FAKE_TOKEN';
  const endpoint = 'test-endpoint';
  const mockResult = {
    mockValue: 'mock',
  };

  let request: any;

  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      request = req;
      return res(ctx.json(mockResult));
    })
  );

  await http(endpoint, { token });
  expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`);
});
```

然后执行 npm tun test 即可执行单元测试。

### 测试 hook；

**test**/use-async.ts

```ts
import { useAsync } from 'utils/use-async'
import { act, renderHook } from '@testing-library/react-hooks';

const defaultState: ReturnType<typeof useAsync> = {
  stat: 'idle',
  data: null,
  error: null,

  isIdle: true,
  isLoading: false,
  isError: false,
  isSuccess: false,

  // 下面几个方法在我们测试时都不是很重要，我们把它们标记成 expect.any(Function)
  run: expect.any(Function),
  setData: expect.any(Function),
  setError: expect.any(Function),
  retry: expect.any(Function),
}

const loadingState: ReturnType<typeof useAsync> = {
  ...defaultState,
  stat: 'loading',
  isIdle: false,
  isLoading: true,
};

const successState: ReturnType<typeof useAsync> {
  ...defaultState,
  stat: 'success',
  isIdle: false,
  isSuccess: true,
};

test('useAsync 可以异步处理', async() => {
  let resolve: any;
  let reject;

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const { result } = renderHook(() => useAsync());
  expect(result.current).toEqual(defaultState);

  let p: Promise<any>;

  // 因为有情况下setState是异步的，所以如果你想等setState都执行完了，可以安全地获得setState后的值的话，就应该用act把它包起来。
  act(() => {
    p = result.current.run(promise);
  });
  expect(result.current).toEqual(loadingState);

  const resolvedValue = {mockValue: 'resolved'};
  await act(async() => {
    resolve(resolvedValue);
    await p;
  });
  expect(result.current).toEqual({
    ...successState,
    data: resolvedValue,
  });
})
```

### 测试组件：

**test**/mark.tsx

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';

import { Mark } from 'components/mark';

test('Mark组件正确高亮关键词', () => {
  const name = '物料管理';
  const keyword = '管理';

  render(<Mark name={name} keyword={keyword} />);

  expect(screen.getByText(keyword)).toBeInTheDocument();
  expect(screen.getByText(keyword)).toHaveStyle('color: #257AFD');
  expect(screen.getByText('物料')).not.toHaveStyle('color: #257AFD');
});
```

### 集成测试：

集成测试一般测试的是组件之间的组合或者函数之间的组合。

useLocation 只能在 BrowserRouter 包裹的范围内使用，否则会得到错误。

在测试用例之前加入一个下面这个 matchMedia stub。

setupTests.ts

```tsx
import '@testing-library/jest-dom'

window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function{},
    removeListener: function{},
  };
}
```

下面我们来测试 project-list.tsxt 这个页面。

首先我们看看这个页面都用到哪些 API。然后我们将这些 API 逐一 mock 一下。

**test**/project-list.tsx

```tsx
import React, { ReactNode } from 'react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { render, screen, waitFor } from '@testing-library/react';
import { ProjectListScreen } from 'src/screens/project-list';
import { AppProviders } from 'src/context';

const apiUrl = process.env.REACT_APP_API_URL;

const server = setupServer(
  rest.get(`${apiUrl}/me`, (req, res, ctx) => {
    id: 1,
    name: 'jack',
    token: '123',
  });

  rest.get(`${apiUrl}/users`, (req, res, ctx) => [
    {
      "id": 1,
      "name": "paian"
    },
    {
      "id": 2,
      "name": "dennis"
    }
  ]);

  rest.get(`${apiUrl}/projects`, (req, res, ctx) => {
    // mock一个简易的搜索功能
    const data = [
      {
        "id": 1,
        "name": "项目1",
        "created": 1604989637822
      },
      {
        "id": 2,
        "name": "项目2",
        "created": 1604989667855
      },
    ];
    const { name = '', personId = undefined, } = Object.fromEntries(req.url.searchParams);
    const result = data.filter(project => {
      return project.name.includes(name) && (personId ? project.personId === +personId : true)
    })
    return res(ctx.json(result));
  });
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

// 因为渲染一个页面的时候，通常都会依赖一些Provider，路由等信息，不是单纯的一个页面，所以我们封装一个函数来提供这些信息
export const renderScreen = (ui: ReactNode, { route = 'projects/'} = {}) => {
  window.history.pushState({}, 'Test Page', route);
  return render(<AppProviders>{ui}</AppProviders>);
}

// 因为页面首先会是显示loading，所以我们需要等一等，等到真实内容渲染出来
const waitTable = () => waitFor(() => expect(screen.getByText('项目1')).toBeInTheDocument());

test('项目列表展示正常', async () => {
  renderScreen(<ProjectScreen />, { route: '/projects' });
  await waitTable();
  expect(screen.getAllByRole('row').length).toBe(fakeData.projects.length + 1);
});

// 因为单元测试和集成测试是跑在node.js上的，这样会跑得比较快，缺点是无法完整地模拟浏览器。比如，在页面的项目搜索输入框中内容改变的时候，URL地址也跟着改变，这个是做不到的，因为没有浏览器。
test('搜索项目', async () => {
  renderScreen(<ProjectListScreen/>, { route: '/projects?name=项目' });
  await waitTable();
  expect(screen.getAllByRole('row').length).toBe(3);
  expect(screen.getByText('项目1')).toBeInTheDocument();
})
```

因为这里用到了 AppProviders，所以如果你的项目中并没有把这个东西做提取的话，建议做一下提取，方便真实项目和测试共用。

```tsx
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from 'src/context/auth-context';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>{children}</AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};
```

我们这里用到的库是@testing-library/react，它有一个前辈是 emzy，之前非常流行，现在逐渐被@testing-library/react 所代替。@testing-library/react 中，没有 getById、getByClass 等 DOM 相关的操作接口，取而代之的是（都在@testing-library/react 的 screen 下）：

- getByText

- getByRole

- getByPlaceholderText

- getByTestId // 可以给 DOM 元素加一个属性，test id

- getByAltText

- getByLabelText

- getByTitle

- getAllByRole

- getAllByText

- getAllByTestId

- getAllByAltText

- getAllByDisplayValue

- getAllByLabelText

- getAllByPlaceholderText

- getAllByTitle

等等。

这是因为@testing-library/react 认为，测试的时候，要从用户的角度出发。而 getById、getByClass 等 DOM 相关的操作会涉及到开发中的细节，因为 className 等是会经常变的，一旦变化就得相应地调整你的测试脚本。而 getByText 等里面的 Text 是较大概率不会经常变化的，所以可以更好地保持测试脚本的稳定。

## 添加.editorconfig文件

```
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
tab_width = 2
end_of_line = lf
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

```

## 加长设置VS Code自动保存文件的延时

在.vscode/settings.json中，需要配置"files.autoSave": "afterDelay"选项来让文件修改后自动保存，之所以要设置 "files.autoSaveDelay": 2000 是因为默认的保存速度太快，当文件末尾没有空行的时候，会与.editorconfig中的 insert_final_newline = true 相冲突，在你安装了名称: EditorConfig for VS Code（https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig）插件的时候，会造成鼠标在你输入代码的时候不断换行的问题。

```json
{
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 2000,
}
```

## 解决报错： validateDOMNesting(...): <button> cannot appear as a descendant of <button>

大致是说在<button>标签里面不能在嵌套<button>标签

例如下面：

<button>
  button1
    <button>button2</button>
</button>

# 打包优化

## 引入speed-measure-webpack-plugin

```js
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      ...
      return smp.wrap(webpackConfig);
    },
  },
  ...
};
```

这时会出现如下错误：

URIError: Failed to decode param '/examples/%PUBLIC_URL%/favicon.ico'

经过一系列折腾，发现只需要把public/index.html中的几处 %PUBLIC_URL% 删掉即可。注意%PUBLIC_URL%之后的那个斜杠药留着，否则控制台显示：

> Manifest: Line: 1, column: 1, Syntax error.错误

