# 如何开发 loader

## 一、loader 简单介绍

### 1、loader 是什么

loaders 将 webpack 不支持的文件类型转换成有效的模块，并可以加入依赖图中。
loader 就是一个 javascript 的模块函数，用来将源代码转化成特定的资源

```js
module.exports = (resource) => {
  return resource;
};
```

### 2、常见的 loader

| 名称         | 描述                             |
| ------------ | -------------------------------- |
| babel-loader | 转化 ES6、ES7 等 JS 新特性和语法 |
| html-loader  | 将生成的资源插入 html 中         |
| style-loader | 讲 css 文件插入 html 中          |

### 3、如何配置 loader

```js
module.exports = {
  output: {
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'css-loader',
      },
    ],
  },
};
```

## 二、loader-runner 调试 loader

[loader-runner](https://github.com/webpack/loader-runner)

```js
const { runLoaders } = require('loader-runner');
const fs = require('fs');
const path = require('path');

runLoaders(
  {
    resource: path.resolve('src/index.js'),
    loaders: [path.resolve('loader/index.js')],
    context: { minimize: true },
    // processResource: (loaderContext, resourcePath, callback) => {
    // console.log("loaderContext", loaderContext, resourcePath, callback)
    // },
    readResource: fs.readFile.bind(fs),
  },
  function (err, result) {
    // console.log("err", err, result)
    err ? console.log(err) : console.log(result);
  },
);
```

## 三、同步 loader 和异步 loader

## 四、文件输出

## 五、合成雪碧图

## 六、常见 loader 源码解析

- markdown-loader
- less-loader
- 合并雪碧图

## 七、webpack 执行的生命周期

- loader 先执行还是 plugin 先执行？

- 1、初始化参数：webpack 读取 webpack 配置，得到最终的初始化参数
- 2、开始编译：webpack 根据初始化参数，实例化 compiler 对象，并加载 plugin 配置，执行 runner 方法
- 3、确定入口：找到 entry 所有的入口文件
- 4、编译模块：从入口文件开始，调用 loader 开始进行文件编译，并依次找到依赖文件，进行编译
- 5、编译完成：此时得到 webpack 编译生成对应的资源和文件的依赖关系
- 6、输出资源：根据入口文件和文件的依赖关系，组装成包含多个模块的 chunk，然后将 chunk 生成一个个文件，加入输出列表，
- 7、输出完成：根据 webpack 的输出配置，通过文件系统将文件内容输出
  在 compiler 执行过程中，会有不同的钩子函数，如果存在对应的插件，plugin 会执行对应的逻辑，并且可以调用 webpack 的 api 修改资源文件
