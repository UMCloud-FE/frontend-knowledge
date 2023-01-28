---
title: 基础使用
order: 0

group:
  title: Webpack
  order: 0
---

# Webpack 基础使用

## Webpack 常见问题

### 一、webpack5 升级记录

`[DEP_WEBPACK_COMPILATION_OPTIMIZE_CHUNK_ASSETS] DeprecationWarning: optimizeChunkAssets is deprecated (use Compilation.hook.processAssets instead and use one of Compilation.PROCESS_ASSETS_STAGE_* as stage option)(Use node --trace-deprecation ... to show where the warning was created)`

问题说明：webpack5.x 将要弃用`optimize-css-assets-webpack-plugin`，更换

```
yarn add css-assets-webpack-plugin --dev
```

- [webpack5 踩坑记录](https://juejin.cn/post/6905364009969844232)

### 二、webpack 中 Compiler 和 Compilation 钩子概念和用法

### 三、node-sass 安装失败踩坑

在使用 node-sass 包时，常常拉取依赖出问题，大部分原因归结于下面两点：

- 网络问题
- node 版本不兼容

[记录安装 node-sass 失败原因及解决办法汇总](https://juejin.cn/post/6946530710324772878)

### 三、webpack5 升级报错

`(node:59068) [DEP_WEBPACK_COMPILATION_OPTIMIZE_CHUNK_ASSETS] DeprecationWarning: optimizeChunkAssets is deprecated (use Compilation.hooks.processAssets instead and use one of Compilation.PROCESS_ASSETS_STAGE_* as stage option) (Use`node --trace-deprecation ...`to show where the warning was created) (node:59068) [DEP_WEBPACK_COMPILATION_CACHE] DeprecationWarning: Compilation.cache was removed in favor of Compilation.getCache()`

### 四、问题记录

entry 和 output 里面同时配置了 filename，entry 配置的优先级更高，以 entry 配置的 filename 为准。<br /> webpack entry 配置是数组的时候，打包是并行还是串行的?<br />

## webpack 基础

- 版本 webpack5.x

### 一、安装

> 可以选择全局安装或本地安装

1、全局安装

```
npm install -g webpack webpack-cli webpack-dev-server
```

2、本地安装

```
mkdir webpack

npm init

yarn add webpack webpack-cli webpack-dev-server -D

```

### 二、直接使用 webpack

```
npx webpack

yarn webpack

```

### 三、通过 webpack 配置文件启动

```js
cd webpack

touch webpack.config.js
```

webpack.config.js

```
module.exports = {
	entry: './src/index.js'，
	output: {
		filename: "main.js"
	}
	mode: 'production'
}
```

**webpack 的输出路径都是以 webpack.config.js 的路径为根目录**

### 四、配置 script 启动

**package.json**

```json
{
  "start": "webpack serve --config webpack.config.js",
  "build": "webpack --config webpack.config.js"
}
```

### 五、mode

- 默认：production
- 可选：development、none

| 选项        | 描述                                                                                                                                                                                                                          |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| development | 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 development. 为模块和 chunk 启用有效的名。                                                                                                                               |
| production  | 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 production。为模块和 chunk 启用确定性的混淆名称，FlagDependencyUsagePlugin，FlagIncludedChunksPlugin，ModuleConcatenationPlugin，NoEmitOnErrorsPlugin 和 TerserPlugin 。 |
| none        | 不使用任何默认优化选项                                                                                                                                                                                                        |

### 六、context

上下文环境，默认 webpack 当前的执行路径，值为绝对路径，可以统一配置独立的目录执行环境

```
{
	context: path.resolve(__dirname, "./src")
}
```

### 七、Entry 的用法

#### 1、entry

string | object | []string 默认值：src/index.js

string

```js
{
  entry: './src/index.js';
}
```

[]string

```js
{
  entry: ['./src/index.js', './src/lib.js'];
}
```

object

```js
{
  entry: {
    main: './src/index.js';
  }
}
```

#### 2、html-webpack-plugin

> webpack 最常用的插件，自动生成 html 模版，插入生成的 script、link 标签，这里为 entry 参数的演示，先简单的引入使用，后续在详细介绍参数

```
yarn add -D html-webpack-plugin
```

```js
{
  plugins: [new HtmlWebpackPlugin()];
}
```

#### 3、devServer

> 启动本地服务器，这里为 entry 参数的演示，先简单的引入使用，后续在详细介绍参数

```
yarn add -D webpack-dev-server
```

配置本地服务器端口号为：3000，指定静态资源目录为`webpack.config.js`同目录下的`public`

```js
const path = require('path')

{
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'public')
		},
		port: 3000
	}
}
```

#### 4、Entry 参数

- shared
- entry 对象形式的描述字段
  - import: 入口文件地址
  - filename: 打包后的路径和名称
  - dependOn: 可以共享另一个模块，减少打包体积
  - library: 探索中
  - runtime: 运行时，创建新的 chunk 名称
  - publicPath: 同 output 属性，entry 内测试未生效

```js
{
	entry: {
		app: {
            import: "./index.js",
            dependOn: ['lodash']
        },
        lib: {
            import: './lib.js',
            filename: 'lib.min.js',
            dependOn: ['lodash']
        },
        lodash: ['lodash'],
	}
}
```

##### 当没有加入 dependOn 时，构建结果

![图片](/frontend-knowledge/images/webpack-without-dependOn.png)

##### 当加入 dependOn 时，构建结果

![图片](/frontend-knowledge/images/webpack-with-dependOn.png)

当然，在使用之前也要先加载 lodash 文件

#### 6、导出多份构建文件

> 当我们在生成 js-sdk 时，一般会生成两份，预发环境和生产环境使用，两者的配置会有一些区别，那么使用数组就可以实现同时构建两个不同的包

```js
[
  {
    entry: {
      app: './index.js',
    },
    mode: 'production',
    context: path.resolve(__dirname, 'src'),
    plugins: [new HtmlWebpackPlugin()],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      port: 3000,
    },
  },
  {
    entry: {
      app: './index.js',
    },
    output: {
      path: path.resolve(__dirname, './build'),
    },
    mode: 'production',
    context: path.resolve(__dirname, 'src'),
    plugins: [new HtmlWebpackPlugin()],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      port: 3000,
    },
  },
];
```

### 八、本节常见问题

#### 1、yarn 安装时怎么选择是否加`-D`参数?

- -D 安装的主要是开发环境使用的依赖，比如 ESlint、Prettier、@types 等，不会将依赖打包到代码中
- 不加—D，生产环境使用的依赖，会打包到代码中

#### 2、path 的几个常见参数的区别

- path.resolve()
- path.join()
- path.join(\_\_dirname)
- path.join(process.cwd())

#### 3、webpack 中的名词 chunk bundle 和 module

- module 打包的源代码模块: 如图，index.js 和 lodash.js
- bundle 打包生成的静态资源文件: 如图，app.js 和 index.html
- chunk 组成打包后静态资源文件的单个文件: 如图，app.js 或 index.html

![build](/frontend-knowledge/images/webpack-word.png)

#### 4、打包后文件的名字如何确定

- entry: string | array => name: main
- entry: object => name: key
- entry: filename => name: filename
- entry: 占位符

#### 5、构建多页面应用

## js 模块化整理

### 一、script 标签引入

通过 script 标签引入 js 代码，然后通过 window 对象访问导出的变量

```js
// 引入babel，否则无法编译
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
// 引入umd格式的react和react-dom，这里引入18版本和17版本以下的api有所差异，要注意
<script src="https://cdn.bootcdn.net/ajax/libs/react/18.2.0/umd/react.development.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/react-dom/18.2.0/umd/react-dom.development.js"></script>
// 引入lodash，测试lodash在window下的直接使用
<script src="https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.js"></script>
// 引入antd,测试antd在window下直接使用
<link href="https://cdn.bootcdn.net/ajax/libs/antd/4.24.1/antd.min.css" rel="stylesheet">
// 为了美观
<script src="https://cdn.bootcdn.net/ajax/libs/antd/4.24.1/antd.min.js"></script>
```

编写下面代码，我们可以看到成功执行

```js
<div id="app" style="margin: 20px"></div>
<script type="text/babel">
      function ShowUser() {
          const user = {
              1: "张三",
              2: "李四"
          }
          return <ul>
              {_.map(user, (value, key) => {
                  return <li key={key}>第{key}个是：{value}</li>
              })}
          </ul>
      }
      const root = ReactDOM.createRoot(document.getElementById('app'))
      root.render(<div>
          <ShowUser />
          <antd.Button type="primary">测试</antd.Button>
      </div>)
</script>
```

在 console 打印，可以发现`window._`,`window.antd`,`widnow.React`可以看到对应的模块

**通过 script 引入，在全局环境中直接使用挂载在 window 对象上的库名，需要 js 支持 script 方式导出，比如 umd 格式。。？？还有什么格式可以直接导出的？**

### 二、commonjs 引入（CJS）

commonjs 实现模块化引入，同步加载，每个文件就是一个模块，有自己的作用域。并不适合前端加载方案，一般使用在 nodejs 的服务器端，nodejs 是 commonjs 的主要实践者

commonjs 的特点

- 同步加载
- 每个文件都有单独的作用域，不会污染全局
- 加载顺序按代码先后顺序
- 第一次加载时运行，然后会缓存，要再次运行，需要清除缓存

比如，运行在 node 环境下，webpack 加载不同的模块

主要通过`module.exports、require、exports(不推荐)`

`webpack.config.base.js`

```js
module.exports = {
  name: 'lib',
  env: 'development',
};
```

```
const path = require("path")

const baseConfig = require("./webpack.config.base.js")

console.log("baseConfig", baseConfig)

```

### 三、amd 引入

amd 是 requirejs 在推广过程中产出的模块化规范，采用异步方式加载模块

amd 特点：

- 使用 define 定义模块
- 使用 require.config()配置路径
- 使用 require()加载模块
- 推崇依赖前置、提前执行

实现过程

- 1、引入 requirejs，并使用 data-main 指定入口的 js 文件
- 2、在入口 js 文件内，使用 require.config 配置路径
- 3、define 定义 js 模块
- 4、require 引入 js 模块

```js
<script src="js/require.js" data-main="js/main"></script>
```

```js
requirejs.config({
  baseUrl: 'js/lib',
  paths: {
    jquery: 'jquery.min',
  },
});
// 使用
requirejs(['jquery'], function ($) {
  console.log('$', $);
});

// 定义模块，对象
define({
  color: '#fff',
});
// 定义函数
define(function () {
  return {
    color: '#fff',
  };
});
// 定义有依赖的函数
define(['jquery', './a', './b'], function ($, a, b) {
  console.log('$', $);
  a.test();
  b.test();
});
```

### 四、cmd 引入

cmd 是 SeaJS 在推广过程中产出的模块化规范，也是一种异步加载方案

cmd 模块化的特点：

- 推崇依赖就近、延迟执行

seajs 使用方式

- 1、引入 seajs
- 2、定义符合 cmd 规范的代码
- 3、seajs.config()、seajs.use()

```js
<script src="./lib/sea.js"></script>
```

```js
// a.js
define(function (require, exports, module) {
  let a = require('./a');
  a.test();

  module.exports = a; // recommend
  // or exports.a = a
});
```

```js
seajs.config({
  base: '../modules/', // 指定基础路由
  alias: {
    jquery: 'juqery/jquery.js', // 从基础路由开始计算
  },
});
// load index file
seajs.use('../lib/main');
```

### 五、ES6 模块引入（ESM）

ES6 实现了模块化，通过`import`和`export`来实现

ESM 特性：

- 静态编译，只能放在文件顶部，提前加载和执行，方便 tree shaking
- 不能放在块级作用域或条件语句中
- 可以作为中转站，比如 UI 组件库，统一在入口文件抛出
- 允许动态导出，ES2022 支持，返回 Promise 对象
- 在 React 中配合懒加载使用

#### 1、在 script 引入或使用

```js
// 存在兼容性
<script type="module" src="./a.js"></script>
<script type="module">
	import $ from 'jquery'
	$("#App").innerText = "123"
</script>
```

#### 2、导入导出

```js
// lib.js
// export
function lib(){
	console.log("this is a lib")
}
export const a = 1;
export const b = 2;
export default lib;

// import
import lib from './lib.js'
import { a } from './lib.js'
import lib, { * as c } from 'lib'

```

#### 3、动态导入

```js
async function App() {
  const lodash = await import('lodash');
  console.log('lodash', lodash);
}
```

#### 4、在 React 中动态加载

React.lazy 和 Suspense 配合一起用，能够有动态加载组件的效果，实现动态加载

```js
import React, { lazy, Suspense } from 'react';

const Text = lazy(() => import('./text'));
const UserInfo = lazy(() => import('./userInfo'));

function MyComponent() {
  return (
    <Suspense fallback={<Loading />}>
      <Text />
      <UserInfo />
    </Suspense>
  );
}
```

#### 5、commonjs 和 es6 module 的区别

- 加载方式：comonjs 值拷贝，ESM 值的引用
- 执行时机：commonjs 运行时加载，ESM 编译时加载
- 加载原理：commonjs 同步加载，ESM 异步加载

### 六、UMD 模块化

```js
// 首先，我们要开发的库
function microApp() {
  return {
    version: '1.0.0',
    getApp: () => {
      return 'this is a app';
    },
  };
}
```

#### 1、兼容全局对象挂载

```js
// window、global
(function (root, factory) {
  root.microApp = factory();
})(this, function () {
  return {
    version: '1.0.0',
    getApp: () => {
      return 'this is a app';
    },
  };
});
```

#### 2、兼容 amd 规范

```js
// window、global
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.microApp = factory();
  }
})(this, function () {
  return {
    version: '1.0.0',
    getApp: () => {
      return 'this is a app';
    },
  };
});
```

#### 3、兼容 cmd 规范

```js
(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    console.log('commonjs');
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof define === 'function' && define.cmd) {
    define(function (require, exports, module) {
      module.exports = factory();
    });
  } else {
    root.microApp = factory();
  }
})(this, function () {
  return {
    version: '1.0.0',
    getApp: () => {
      return 'this is a app';
    },
  };
});
```

### 六、参考文档

- [seajs 文档](https://seajs.github.io/seajs/docs/#quick-start)
- [Requirejs 文档](https://www.requirejs-cn.cn/)
- [es6 module](https://es6.ruanyifeng.com/#docs/module-loader)
- [umd 实现](https://github.com/cumt-robin/umd-learning)
