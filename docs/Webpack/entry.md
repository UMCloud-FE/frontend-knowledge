---
title: Entry
nav: 
	path: /entry
	order: 1
---

# webpack 基础

- 版本 webpack5.x

## 一、安装

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

## 二、直接使用 webpack

```
npx webpack

yarn webpack

```

## 三、通过 webpack 配置文件启动

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

## 四、配置 script 启动

**package.json**

```json
{
  "start": "webpack serve --config webpack.config.js",
  "build": "webpack --config webpack.config.js"
}
```

## 五、mode

- 默认：production
- 可选：development、none

| 选项 | 描述 |
| --- | --- |
| development | 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 development. 为模块和 chunk 启用有效的名。 |
| production | 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 production。为模块和 chunk 启用确定性的混淆名称，FlagDependencyUsagePlugin，FlagIncludedChunksPlugin，ModuleConcatenationPlugin，NoEmitOnErrorsPlugin 和 TerserPlugin 。 |
| none | 不使用任何默认优化选项 |

## 六、context

上下文环境，默认 webpack 当前的执行路径，值为绝对路径，可以统一配置独立的目录执行环境

```
{
	context: path.resolve(__dirname, "./src")
}
```

## 七、Entry 的用法

### 1、entry

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

### 2、html-webpack-plugin

> webpack 最常用的插件，自动生成 html 模版，插入生成的 script、link 标签，这里为 entry 参数的演示，先简单的引入使用，后续在详细介绍参数

```
yarn add -D html-webpack-plugin
```

```js
{
  plugins: [new HtmlWebpackPlugin()];
}
```

### 3、devServer

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

### 4、Entry 参数

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

#### 当没有加入 dependOn 时，构建结果

![图片](/images/webpack-without-dependOn.png)

#### 当加入 dependOn 时，构建结果

![图片](/images/webpack-with-dependOn.png)

当然，在使用之前也要先加载 lodash 文件

### 6、导出多份构建文件

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

## 八、本节常见问题

### 1、yarn 安装时怎么选择是否加`-D`参数?

- -D 安装的主要是开发环境使用的依赖，比如 ESlint、Prettier、@types 等，不会将依赖打包到代码中
- 不加—D，生产环境使用的依赖，会打包到代码中

### 2、path 的几个常见参数的区别

- path.resolve()
- path.join()
- path.join(\_\_dirname)
- path.join(process.cwd())

### 3、webpack 中的名词 chunk bundle 和 module

- module 打包的源代码模块: 如图，index.js 和 lodash.js
- bundle 打包生成的静态资源文件: 如图，app.js 和 index.html
- chunk 组成打包后静态资源文件的单个文件: 如图，app.js 或 index.html

![build](/images/webpack-word.png)

### 4、打包后文件的名字如何确定

- entry: string | array => name: main
- entry: object => name: key
- entry: filename => name: filename
- entry: 占位符

### 5、构建多页面应用
