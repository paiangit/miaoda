# 项目工作笔记：

## 一、通过create-react-app创建项目

```sh
npm i -g create-react-app
cd <some_path>
create-react-app miaoda
```

CRA的文档见：https://create-react-app.bootcss.com/

修改README.md的第一行为：

```
# miaoda
```

如果需要修改npm start时的启动端口（默认是3000），可以在package.json中修改环境变量PORT，如下所示：

```js
"scripts": {
-  "start": "react-scripts start",
+  "start": "cross-env PORT=4000 react-scripts start",
```

因为CRA创建的项目只有很基础的功能，很多配置的工作还需要自己来添加。下面我们一步步将项目搭建起来。

## 二、添加对Less打包的支持

首先一个问题是，为什么选用Less？

其实我也认为Sass挺好的。考虑使用Less的原因在于，计划会需要用到Ant Design，而它的样式目前是用Less实现的，所以，后续在引用其抛出的一些文件的时候（如颜色主题变量），会比较方便。

通过React默认脚手架(create-react-app)创建出的项目默认是不支持Less打包的。

如需支持有两种方式：

1）通过执行命令 npm eject 将脚手架预先封闭的Webpack等配置工具的源文件暴露出来自行修改。

2）使用customize-cra、react-app-rewired对配置进行扩展。

3）采用@craco/craco对配置进行扩展。

我们最好不用第一种方式，因为不eject，比较容易更新构建工具。当新版本的 Create React App 发布后，只需运行如下命令即可升级：

```sh
npm install react-scripts@latest
```

因为第二种比较熟知，之前也用过，于是首先采用第二种方式。不料这种方式存在问题跑不起来。所以各位读者如果看到这里，只是想往下顺利进行的话，请直接跳到使用第三种方式（用@craco和craco）配置的部分。

因为第二种方式太过常见，我暂且先记录一下。

### 1、失败的尝试——用customize-cra和react-app-rewired

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

### 2、回到正确的道路上——用@craco和craco

参见：
https://ant.design/docs/react/use-with-create-react-app-cn#%E9%AB%98%E7%BA%A7%E9%85%8D%E7%BD%AE

```sh
npm i @craco/craco craco-less -D
```

修改package.json：

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

然后我们将src目录下的index.css和App.css的后缀都修改成.less。并在App.less中做如下修改，以验证配置是否生效：

```css
.App-header {
-  background-color: #282c34;
+  @color: red;
+  background-color: red;
```

然后执行 `npm start` 即可见到界面的背景色被修改成了红色。

真是分分钟搞定，回过来看上面使用customize-cra react-app-rewired时的各种报错，还Google不到答案，Github上有人提了相关的问题也没解决，真是太浪费时间了。因此，值得给craco 和 Ant Design一个大大的赞（我是在Ant Design的官网上看到用craco的）。

## 三、添加typescript打包支持

根据CRA官方的相关文档（https://create-react-app.bootcss.com/docs/adding-typescript/），可用如下命令添加：

```sh
npm install --save typescript @types/node @types/react @types/react-dom @types/jest
```

做完这一步之后，会发现index.js、App.js文件转变成了index.jsx、App.jsx文件。

我们接着想把它修改成.tsx文件，但是看了CRA的文档（https://create-react-app.bootcss.com/docs/folder-structure/）居然说不能改：

> For the project to build, these files must exist with exact filenames:
> public/index.html is the page template;
> src/index.js is the JavaScript entry point.
> You can delete or rename the other files.

不应该啊，这么简单的东西也不让改！

这时想起一开始我们配置Less打包时引入过的craco。果然很快就在其文档中找到了：

https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration

这样，我们对craco.config.js做如下修改：

```js
module.exports = {
+  webpack: {
+    configure: {
+      entry: path.resolve(__dirname, './src/index.tsx')
+    },
+  },
```

类似的，在configure这个属性下，估计是可以做各种各样的属性（https://webpack.js.org/configuration）的修改的。

添加完这个配置之后，我们就可以将项目中那些.jsx文件悉数改成.tsx了。

`npm run start`查看，发现构建成功。

## 四、解决 'printPatternCaret' not found 问题

但是，在执行`npm run test`的时候，却遇到了如下报错：

> import { PatternPrompt, printPatternCaret, printRestoredPatternCaret } from 'jest-watcher';
>                            ^^^^^^^^^^^^^^^^^
> SyntaxError: Named export 'printPatternCaret' not found. The requested module 'jest-watcher' is a CommonJS module, which may not support all module.exports as named exports.
> CommonJS modules can always be imported via the default export, for example using:
> import pkg from 'jest-watcher';
> const { PatternPrompt, printPatternCaret, printRestoredPatternCaret } = pkg;

经过一番查找，在这里（https://github.com/facebook/create-react-app/issues/11792#issue-1083291936 以及 https://github.com/facebook/create-react-app/issues/11043#issuecomment-942472592）找到了答案，原因是跟Node.js版本有关系，我所采用的是14.15.0版本的Node.js（这个版本不支持native ESM，而新版本的jest-watch-typeahead是用native ESM编写的，所以会报错）。其中介绍说升级到Node.js 16版本就没问题了。但是，因为升级可能带来其它的问题，所以我暂时不升级，而是采用了其中提到的如下方法：

```sh
npm i --exact jest-watch-typeahead@0.6.5
```

## 五、引入react-router-dom，初步配置路由

react-router-dom比react-router多了 `<Link>` 、 `<BrowserRouter>` 这样的 DOM 类组件。因此，我们只需引用 react-router-dom 这个包就行了。而且，从版本5开始，官方已经放弃对react-router的维护，而只维护react-router-dom。

例如：

`<Link>` 组件，会渲染一个a标签。

`<BrowserRouter>` 和 `<HashRouter>`组件，前者使用popState事件和pushState构建路由，后者使用hashchange事件和window.location.hash构建路由。

### 1. 安装react-router-dom：

```
npm i react-router-dom -S
```

这里我们安装的是最新版本，6.2.1。

关于react-router-dom的使用，可以参考这篇文章：https://zhuanlan.zhihu.com/p/431389907

#### react-router-dom 6中常用的组件和hook

这里介绍下react-router-dom 6中常用的组件和hooks。

常用的组件：

- <Routes>：是一组路由，用于代替原有<Switch>，所有子路由都用基础的<Route>作为children来表示。
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

当访问projects/123时，组件树将是渲染成这样：

```
<App>
  <Projects>
    <Project/>
  </Projects>
</App>
```

- <Link>：导航组件，在页面中做为跳转链接使用。只能在Router内部使用。
- <Outlet/>：自适应渲染组件，根据实际路由URL自动匹配上不同的组件进行渲染，相当于Vue.js中的<router-view>。

常用hooks：
- useParams：返回当前路由URL参数。

例如，

```ts
// 注册路由(相当于声明了有什么params参数)：
<Route path="/project/:id/:title" component={Project}/>
```

```ts
// 接收params参数：
const params = useParams();
// params参数 => {id: "xxx", title: "yyy"}
```

- useNavigate：返回当前路由，相当于5.0版本中的useHistoryuse。
- Outlet：返回根据路由自动生成的element。
- useLocation：返回当前的location对象。
- useRoutes：同Routes组件一样，只不过是在JavaScript中用。
- useSearchParams：用来匹配URL中?后面的query参数。

#### react-router-dom 6 与 版本5的区别

- <Routes> 替代 <Switch>

5.0写法：

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

6.0写法：

```ts
<Routes>
  <Route index path="/" element={<Home />} />
  <Route path="/projects/:id" element={<Project />} />
  <Route path="Editor" element={<Editor />} />
</Routes>
```

- 移除掉了Switch中的<Redirect>，6.0版本中可以用 <Navigate> 实现

5.0写法：

```ts
<Switch>
  <Redirect from="xxx" to="yyy"/>
</Switch>
```

6.0写法：

```ts
<Route path="xxx" render={<Navigate to="yyy"/>}
```

- <Link>的to属性支持相对路径，而5.0版中只支持绝对路径。在6.0中，to如果路径是/开头的则是绝对路由，否则为相对路由，即相对于“当前URL”进行改变。

- useNavigate 代替了 useHistory


### 2. 新建Root.js

全局路由有常用两种路由模式可选：HashRouter 和 BrowserRouter。HashRouter：URL中采用的是hash去创建路由。这里我们采用BrowserRouter来创建路由。

```js
import React from 'react';
import {
  BrowserRouter,
  Link,
  Routes,
  Route
} from 'react-router-dom';

import App from './App.tsx';
import Projects from './Projects.tsx';
import Project from './Project.tsx';
import Editor from './Editor.tsx';

function Root() {
  return (
    <BrowserRouter>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/project/1">Project 1</Link></li>
        <li><Link to="/editor">Editor</Link></li>
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

### 3. 修改index.tsx

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

### 4. 添加Projects.tsx
```ts
function Projects() {
  return (
    <div className="projects">
      projects
    </div>
  );
}

export default Projects;
```

### 5. 添加Project.tsx
```ts
import { useParams } from 'react-router-dom';

function Project() {
  const params = useParams();
  return (
    <div className="project" >
      project {params.id}
    </div>
  );
}

export default Project;
```

### 6. 添加Editor.tsx

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
import {
  BrowserRouter,
  Link,
  useRoutes,
} from 'react-router-dom';

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
        path: "/",
        element: <App />
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
    ],
  };
  const routing = useRoutes([mainRoutes]);

  return (
    <BrowserRouter>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/project/1">Project 1</Link></li>
        <li><Link to="/editor">Editor</Link></li>
      </ul>
      { routing }
    </BrowserRouter>
  );
}

export default Root;
```

发现报错了：

> Uncaught Error: useRoutes() may be used only in the context of a <Router> component.

意思是说，`useRoutes()` 只能用在一个Router组件内，而现在我们是用在 `<BrowserRouter>` 组件之外的，而不是之内。

所以，我们需要将 `useRoutes()` 降低到 `<BrowserRouter>`的子组件中去使用。

### 1. 首先对Root.tsx做如下修改

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

### 2. 将App.tsx修改成如下

useRoutes的使用主要降到了这个文件中。

可以参考：https://typescript.tv/react/upgrade-to-react-router-v6/

```ts
import {
  useRoutes,
} from 'react-router-dom';

import Projects from './Projects.tsx';
import Project from './Project.tsx';
import Editor from './Editor.tsx';
import Layout from './Layout.tsx';
import Home from './Home.tsx';
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

### 3. 新建Layout.tsx

原来在Root.tsx中的那些路由跳转链接移到了这里，当然，这些链接放在Root.tsx中也是可以的。

注意这里的<Outlet/>（该单词的英文意思是出口），相当于挖了个窟窿，用来渲染子路由对应的内容的。也即上面App.tsx文件中mainRoutes对应的children。它会根据实际路由URL自动匹配渲染哪个组件。有点像Vue.js中的<router-view>。

```tsx
import {
  Link,
  Outlet
} from 'react-router-dom';
import './Layout.less';

export default function Layout() {
  return (
    <div className="layout">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/project/1">Project 1</Link></li>
        <li><Link to="/editor">Editor</Link></li>
      </ul>
      <Outlet />
    </div>
  );
}
```

### 4. 新建Layout.less

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

### 5. 新建Home.tsx

```ts
export default function Home() {
  return (
    <div className="home">home</div>
  )
}
```

### 6. 新建home.less

```css
.home {

}
```

## 七、让路由未匹配成功的时候展示404页面

### 1. 新建PageNotFound.tsx

```ts
import './PageNotFound.less';

export default function PageNotFound() {
  return (
    <div>
      Page not found.
    </div>
  )
}
```

### 2. 新建PageNotFound.less

```css
.page-not-found {

}
```

### 3. 在App.tsx中对路由配置做如下修改

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

如此一来，你在访问页面不存在路由的时候，就会跳转到/404这个路由。这里我们用到了 `Navigate` 组件。

## 八、将test文件移到根目录下的test目录，修改对应jest配置

调整后需要对应修改craco.config.js文件，以支持npm run test能正确运行。主要是roots、testMatch、setupFilesAfterEnv这三项。

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

## 九、按feature规整目录，配置动态路由、嵌套路由

1. 按feature规整目录，对应调整路由

规整后目录如下：

.\miaoda
├─.gitignore
├─craco.config.js
├─package-lock.json
├─package.json
├─README.md
├─test
|  ├─App.test.tsx
|  └setupTests.ts
├─src
|  ├─App.tsx
|  ├─index.tsx
|  ├─reportWebVitals.js
|  ├─Root.tsx
|  ├─styles
|  ├─images
|  ├─features
|  |    ├─settings
|  |    |    ├─AppSettingsPage.less
|  |    |    ├─AppSettingsPage.tsx   应用设置
|  |    |    ├─index.ts
|  |    |    └route.tsx
|  |    ├─publish
|  |    |    ├─AppPublishPage.less
|  |    |    ├─AppPublishPage.tsx    应用发布
|  |    |    ├─index.ts
|  |    ├─preview
|  |    |    ├─index.ts
|  |    |    ├─PreviewPage.less
|  |    |    ├─PreviewPage.tsx       页面预览
|  |    ├─myApps
|  |    |   ├─AppListPage.less
|  |    |   ├─AppListPage.tsx        我的应用
|  |    |   ├─index.ts
|  |    ├─management
|  |    |     ├─AdminLayout.less
|  |    |     ├─AdminLayout.tsx
|  |    |     ├─index.ts
|  |    |     ├─ManagementPage.less
|  |    |     ├─ManagementPage.tsx   页面管理
|  |    ├─home
|  |    |  ├─index.ts
|  |    |  ├─MainLayout.less
|  |    |  ├─MainLayout.tsx
|  |    |  ├─MainPage.less
|  |    |  ├─MainPage.tsx            首页
|  |    ├─design
|  |    |   ├─DesignerPage.less
|  |    |   ├─DesignerPage.tsx       页面设计器
|  |    |   ├─index.ts
|  |    ├─common
|  |    |   ├─index.ts
|  |    |   ├─PageNotFound.less
|  |    |   ├─PageNotFound.tsx       404页面
|  ├─common
├─public
|   ├─favicon.ico
|   ├─index.html
|   ├─logo192.png
|   ├─logo512.png
|   ├─manifest.json
|   └robots.txt

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

## 十、集成redux，并实战演示如何组织action、reducer、hooks等

### 1. 先安装redux：

```
npm i redux react-redux -S
```
### 2. 引入Provider，挂上store

然后修改src/common/Root.tsx如下：

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

### 3. 创建src/common/store.ts

```ts
import { createStore } from 'redux';
import rootReducer from './rootReducer.ts';

function initStore() {
  const store = createStore(rootReducer);

  return store;
}

export default initStore();
```

### 4. 创建src/common/rootReducer.ts：

```ts
import { combineReducers } from 'redux';
import homeReducer from '../features/examples/redux/reducer.ts';

const reducerMap = {
  home: homeReducer,
};

export default combineReducers(reducerMap);
```

### 5. 创建src\features\examples\redux文件夹，其中放置如下七个文件

#### reducer.ts

这个目录下reducer的聚合出口。它会把分别放在这个目录的各个文件中的reducer收集集合到一起。

```ts
import initialState from './initialState.ts';
import { reducer as counterPlusOne } from './counterPlusOne.ts';
import { reducer as counterMinusOne } from './counterMinusOne.ts';

const reducers = [
  counterPlusOne,
  counterMinusOne,
];

export default function reducer(state = initialState, action) {
  let newState;

  switch (action.type) {
    // 在这里放置全局reducer
    default:
      newState = state;
      break;
  }

  // reduce((acc, cur), initialAcc)
  return reducers.reduce((previousState, reducer) => reducer(previousState, action), newState);
}
```

#### actions.ts

这个目录下action的聚合出口。

```ts
import { counterPlusOne } from './counterPlusOne.ts';
import { counterMinusOne } from './counterMinusOne.ts';

export default {
  counterPlusOne,
  counterMinusOne
};
```

#### hooks.ts

这个目录下hooks的聚合出口

```ts
export { useCounterPlusOne } from './counterPlusOne.ts';
export { useCounterMinusOne } from './counterMinusOne.ts';
```

#### counterMinusOne.ts

一个文件只放做一件事情的action、reducer等。这样一个个文件分别拆开。

```ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HOME_COUNTER_MINUS_ONE } from './constants.ts';

export function counterMinusOne() {
  return {
    type: HOME_COUNTER_MINUS_ONE
  };
}

export function useCounterMinusOne() {
  const dispatch = useDispatch();
  const count = useSelector(state => state.home.count);
  const boundAction = useCallback(() => dispatch(counterMinusOne()), [dispatch]);

  return {
    count,
    counterMinusOne: boundAction
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_COUNTER_MINUS_ONE:
      return {
        ...state,
        count: state.count - 1
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
    type: HOME_COUNTER_PLUS_ONE
  }
}

export function useCounterPlusOne() {
  const dispatch = useDispatch();
  const count = useSelector(state => state.home.count);
  const boundAction = useCallback(() => dispatch(counterPlusOne()), [dispatch]);

  return {
    count,
    counterPlusOne: boundAction
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_COUNTER_PLUS_ONE:
      return {
        ...state,
        count: state.count + 1
      }

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

其它每个feature下，都应该参照此种分类方式，创建对应的redux文件夹。

### 6. 创建一个Counter组件来使用redux

#### Counter.ts

```ts
import { useCounterPlusOne, useCounterMinusOne } from './redux/hooks.ts';
import './Counter.less';

export default function Counter() {
  const { count, counterPlusOne } = useCounterPlusOne();
  const { counterMinusOne } = useCounterMinusOne();

  return (
    <div className='examples-counter'>
      <div className='count'>计数：{count}</div>
      <button className='minus-one' onClick={counterMinusOne}>-</button>
      <button className='plus-one' onClick={counterPlusOne}>+</button>
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

#### 引入Counter到CounterPage中

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

从redux的组织套路上来说，我们推荐：

- 按feature编写action、reducer和相关hooks（每一组拆成一个文件），编写辅助文件constants、initialState，将action、reducer、hooks集中到统一的出口。

- 编写store和将所有reducer收集成rootReducer

参考：

redux中文文档：https://www.redux.org.cn/docs/basics/Reducers.html

Rekit: http://rekit.js.org/docs/one-action-one-file.html

## 十一、用redux-mock-store创建 mock store以进行自动化测试

先安装redux-mock-store模块，然后对test/App.test.tsx进行如下修改：

```ts
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
```

### 新建styles/index.less 作为样式的总出口文件，并把这个文件引入到src/index.less中

```css
/* 样式的总出口 */
@import './global';
```

### 在每个组件中，会有组件文件名同名的less文件来存放样式。features中，每一个feature的文件夹名-组件名就是该组件的样式命名空间。因为feature都在同一个features文件夹下，所以可以保证feature不重名，又因为feature内部的功能都在feature文件夹下，所以可以保证feature内部组件不重名。这样一来，样式命名空间就不会重名。

比如，对于examples这个feature下的Counter组件，该组件最外层容器的className我们给它命名成examples-counter，该组件所有的样式都写在这个命名空间下：

```css
.examples-counter {
  /* 这里写组件的具体样式 */
}
```

## 十三、引入antd，进行样式引入，并修改语言包为中文

### 安装antd

```sh
npm install antd --save
```

antd 默认支持基于 ES modules 的 tree shaking，对于 js 部分，直接引入 import { Button } from 'antd' 就会有按需加载的效果。

antd具体使用请参照文档：https://ant.design/docs/react/getting-started-cn

### 接入图标

```sh
npm install --save @ant-design/icons
```
参照：https://ant.design/components/icon-cn/

### 新建src/styles/themes.less，导入antd的色板less

```
// import less of antd colors
// see: https://ant.design/docs/spec/colors-cn#%E5%9C%A8%E4%BB%A3%E7%A0%81%E4%B8%AD%E4%BD%BF%E7%94%A8%E8%89%B2%E6%9D%BF
@import '~antd/lib/style/themes/default.less';
```

其中，

@import 导入样式；～作为模块导入。

### 然后针对src/index.tsx做如下修改：

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
## 十四、注意React中事件绑定时容易犯的一个错误

如果你将一个如下所示的普通传递给JSX的属性，会报错：

```ts
function clickHandler(index: number, e) {
  setActiveIndex(index, e);
}
```

```ts
onClick={clickHandler(index)}
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
  }
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

上面说的是函数式组件里面的写法，而类组件里面也类似，不过要注意this绑定的处理。

可参见：https://blog.csdn.net/weixin_41615439/article/details/110237818

# 环境变量配置与获取

安装依赖：

```sh
npm i dotenv -S
```

然后在入口文件index.tsx文件中引入：
```ts
import { config } from 'dotenv';

config({ path: '.dev' });
```

然而，发现并不好用，webpack报如下错误：
> Module not found: Error: Can't resolve 'path' in '\miaoda\node_modules\dotenv\lib'
参见：https://github.com/motdotla/dotenv/issues/581

这是因为：
process.env is not polyfilled in Webpack 5+, leading to errors in environments where process is null (browsers).
https://github.com/mrsteele/dotenv-webpack/blob/master/README.md

最后，我发现其实react-scripts背后本身就已经使用了dotenv这个库的，我们只需要：

1）在项目的根目录中创建xxx.env文件
2）在xxx.env文件中配置以REACT_APP_开头的环境变量
3）在项目中通过process.env.REACT_APP_...访问它

所以根本不需要自己安装和配置dotenv。
参见：https://stackoverflow.com/questions/42182577/is-it-possible-to-use-dotenv-in-a-react-project/56668716#56668716

在create-react-app中，除了内置的环境变量，如NODE_ENV、PUBLIC_URL外，其余环境变量需要用REACT_APP_作为前缀。

env文件的优先级如下：

优先级如下：

`npm start`: `.env.development.local` > `.env.development` > `.env.local` > `.env`

`npm run build`: `.env.production.local` > `.env.production` > `.env.local` > `.env`

`npm test`: `.env.test.local` > `.env.test` > `.env`

# 请求后台数据

```sh
npm i axios
```

## 封装common/request.ts

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
  },
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
  },
);

function getDefaultOptions() {
  // API基地址
  const baseURL =
    `${window.location.protocol}//${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_API_PREFIX}`;
  // 超时时间
  const timeout = 60000;

  return {
    baseURL,
    timeout,
  }
}

function getToken() {
  let token = '';
  // TODO
  return token;
}

export default axiosInstance;
```

这里因为忘记return的问题导致调试了好一会儿。所以特地都加上了注释，防止你忘记。

## 封装请求API：features/authority/api.ts

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
  signIn(data) {
    return request({
      method: 'post',
      url: '/auth/signIn',
      data,
    });
  },
}
```

## 在注册、登录等页面直接调用就好了

features/authority/RegisterPage.tsx

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
      .then(res => {
        console.log(res);
        if (res.code === 0) {
          navigate('/authority/signIn');
        }
      }).catch(err => {
        console.log(err);
      });
  };

  return (
    <div className="authority-register-page">
      <h2 className="title">Register</h2>
      <form ref={registerForm}>
        <label className="label" htmlFor="username">Username</label>
        <input type="text" name="username" id="username"></input>
        <label className="label" htmlFor="password">Password</label>
        <input type="password" name="password" id="password"></input>
        <label className="label" htmlFor="retypePassword">Retype password</label>
        <input type="password" name="retypePassword" id="retypePassword"></input>
        <label className="label" htmlFor="email">Email address</label>
        <input type="text" name="email" id="email"></input>

        <Button className="register" type="primary" onClick={clickHandler}>Register</Button>
      </form>
    </div>
  );
}
```

## 修改应用标题

修改public/index.html的title为：

```
<title>秒搭</title>
```

## 使用JWT

在登录时访问user/signIn接口，接口会返回token，我们将token存在localStorage中。为了让保存和读取时的值一致，我们在项目根目录下新建一个.env文件来保存其键值。

```
# 各个环境公用的环境变量

## ======localStorage的键值======
# 登录token存储在localStorage中的key
REACT_APP_ACCESS_TOKEN_NAME=miaodaAccessToken
```

然后，在读和写的地方都通过process.env.REACT_APP_ACCESS_TOKEN_NAME来取得该键值。

在下次请求的时候，通过在请求头中设置Authorization这个请求头，其value就是 `Bearer ${token}` ，即把localStorage中存的token取出来，在前面拼上Bearer加空格。这是JWT要求的格式。

这样返回给服务器端之后，服务器就能正常地解析和验证JWT是否有效。

## 性能优化

因为Layout组件无参数，所以可以用React.memo第二个参数传return false的函数来直接优化。

export default React.memo(MainLayout, () => false);
