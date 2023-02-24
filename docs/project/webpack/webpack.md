---
title: 五、Webpack源码结构分析
order: 5
---

# webpack 执行流程分析

回顾执行流程

![webpack执行流程](/frontend-knowledge/images/webpack/webpack.png)

## 1、执行流程分析

- 执行 npx webpack --help
- 1、本地安装，运行开始`/node_modules/webpack/bin/webpack.js`
- 2、全局安装，运行开始
- 3、运行 webpack 会读取同目录下的`webpack-cli`，执行 CLI

![webpack执行流程](/frontend-knowledge/images/webpack/webpack-flow.webp)

## 2、开始执行执行

```js
#!/usr/bin/env node

runCLI(process.argv);

const runCLI = async (args) => {
  // Create a new instance of the CLI object
  const cli = new WebpackCLI();
  try {
    await cli.run(args);
  } catch (error) {
    cli.logger.error(error);
    process.exit(2);
  }
};
```

定义的指令

```js
const helpCommandOptions = {
  name: 'help [command] [option]',
  alias: 'h',
  description: 'Display help for commands and options.',
};
```

获取 webpack，创建`compiler`对象

```js
compiler = await this.createCompiler(options, callback);
```

## 3、处理 complier 对象

```js
// 初始化参数：处理options参数
getNormalizedWebpackOptions + applyWebpackOptionsBaseDefaults;

// 实例化compiler对象，加载插件，触发周期函数
// webpack.js
const createCompiler = (rawOptions) => {
  const options = getNormalizedWebpackOptions(rawOptions);
  applyWebpackOptionsBaseDefaults(options);
  const compiler = new Compiler(options.context, options);
  new NodeEnvironmentPlugin({
    infrastructureLogging: options.infrastructureLogging,
  }).apply(compiler);
  if (Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      if (typeof plugin === 'function') {
        plugin.call(compiler, compiler);
      } else {
        plugin.apply(compiler);
      }
    }
  }
  applyWebpackOptionsDefaults(options);
  compiler.hooks.environment.call();
  compiler.hooks.afterEnvironment.call();
  new WebpackOptionsApply().process(options, compiler);
  compiler.hooks.initialize.call();
  return compiler;
};

// 执行run方法
const { compiler, watch, watchOptions } = create();
if (watch) {
  compiler.watch(watchOptions, callback);
} else {
  compiler.run((err, stats) => {
    compiler.close((err2) => {
      callback(err || err2, stats);
    });
  });
}
return compiler;
```

```js
// run方法
const run = () => {
  this.hooks.beforeRun.callAsync(this, (err) => {
    if (err) return finalCallback(err);

    this.hooks.run.callAsync(this, (err) => {
      if (err) return finalCallback(err);

      this.readRecords((err) => {
        if (err) return finalCallback(err);

        this.compile(onCompiled);
      });
    });
  });
};
```

## 4、webpack 生命周期执行流程

![编译解析](/frontend-knowledge/images/webpack/webpack-start.webp)
