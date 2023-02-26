---
title: 六、tapable的使用
order: 6
---

# tapable 的使用

## 一、介绍

在 webpack 中，实现 webpack 生命周期的库，控制着 webpack 的插件系统

### 1、EventEmitter

类似 node.js 的 EventEmitter 库，控制钩子函数的发布和订阅

```js
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// 绑定事件
myEmitter.on('event', (a, b) => {
  console.log('an event occurred', a, b);
});
// 触发事件
myEmitter.emit('event', 'a', 'b');
```

### 2、tapable 主要的字段解释

| type          | description                                                                                |
| ------------- | ------------------------------------------------------------------------------------------ |
| Basic Hook    | 基础 Hook, 绑定事件，通过 tap 调用                                                         |
| Waterfall     | 流水，会将返回值传递给下一个 Hook 函数，作为参数使用                                       |
| Bail          | 熔断，如果返回值是 undefined，就继续执行，否则停止执行后面的钩子                           |
| Loop          | 循环，当函数返回不是 undefined，则会从第一个钩子开始执行，循环到所有钩子全部返回 undefined |
| Sync          | 同步钩子，只能用 myHook.tap()定义                                                          |
| AsyncSeries   | 异步串行钩子                                                                               |
| AsyncParallel | 异步并发钩子                                                                               |

### 3、钩子绑定事件和执行事件对应的方法

|         | 绑定                    | 执行              | 钩子                                                                                                     |
| ------- | ----------------------- | ----------------- | -------------------------------------------------------------------------------------------------------- |
| Sync\*  | tap                     | call              | SyncHook, SyncBailHook, SyncBailWaterfallHook, SyncLoopHook                                              |
| Async\* | tap/tapAsync/tapPromise | promise/callAsync | AsyncParallelHook, AsyncParallelBailHook, AsyncSeriesHook, AsyncSeriesBailHook, AsyncSeriesWaterfallHook |

## 二、各种不同的钩子

```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} = require('tapable');
```

使用方法需要三步：

- 1、需要通过 new 关键字，实例化不同的 Hooks
- 2、通过 tap 等关键字注册事件
- 3、通过 call 等方法调用

### 1、SyncHook

![SyncHook](/frontend-knowledge/images/tapable/SyncHook.png)

```js
const Hooks = new SyncHook(['args1', 'args2', 'args3'])
Hooks.tap("run",  (args1, args2, args3) => {
    console.log("this is tap", args1, args2, args3)
}
Hooks.call(1,2,3)
```

同步执行，不管执行结果

### 2、SyncBailHook

![SyncBailHook](/frontend-knowledge/images/tapable/SyncBailHook.png)

```js
const { SyncBailHook } = require('tapable');
const hooks = new SyncBailHook([]);

hooks.tap('bail', () => {
  console.log('bail');
  return undefined;
});
hooks.tap('bail1', () => {
  console.log('bail1');
});

hooks.call();
```

同步熔断勾子，如果有事件返回不为 undefined，停止执行下一个事件，直接结束

### 3、SyncLoopHook

![SyncLoopHook](/frontend-knowledge/images/tapable/SyncLoopHook.png)

```js
const { SyncLoopHook } = require('tapable');
const hooks = new SyncLoopHook();
let a = 1;

hooks.tap('hooks1', () => {
  console.log('hook1');
  if (a === 1) {
    a++;
    console.log('a', a);
    return false;
  }
});
hooks.tap('hooks2', () => {
  console.log('hook2');
});
hooks.call();
```

LoopHook 依次执行事件，如果某个函数，返回值不为 undefined 时，重头开始执行事件。

### 4、SyncWaterfallHook

![SyncWaterfallHook](/frontend-knowledge/images/tapable/SyncWaterfallHook.png)

```js
const { SyncWaterfallHook } = require('tapable');
const hooks = new SyncWaterfallHook(['arg1']);

hooks.tap('water1', (arg1) => {
  console.log('water1', arg1);
  return 'this is ' + arg1;
});

hooks.tap('water2', (arg2) => {
  console.log('water2', arg2);
});

hooks.call('water');
```

勾子，前一个勾子返回的值，将会传递个下一个勾子，作为参数处理

### 5、AsyncParallelBailHook

![AsyncParallelBailHook](/frontend-knowledge/images/tapable/AsyncParallelBailHook.png)

```js
const { AsyncParallelBailHook } = require('tapable');
const hooks = new AsyncParallelBailHook(['arg1', 'arg2']);
console.time('timer');
hooks.tapPromise('promise3', () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('promise3');
      resolve(true);
    }, 1000);
  });
});
hooks.tapAsync('parallel2', (arg1, arg2, callback) => {
  setTimeout(() => {
    console.log('parallel2', arg1, arg2);
    callback();
  }, 3000);
});
hooks.callAsync('arg1', 'arg2', () => {
  console.log('done');
  console.timeEnd('timer');
});
```

异步并行熔断

- 1、如果有个事件先返回了非 undefined，则直接触发 callback 函数，表示整体勾子执行完毕
- 2、当前 3s 后打印出来，是因为在执行之前就触发了

### 6、AsyncParallelHook

![AsyncParallelHook](/frontend-knowledge/images/tapable/AsyncParallelHook.png)

```js
const { AsyncParallelHook } = require('tapable');
// 执行打印的时间为1s，同时开始执行
const hooks = new AsyncParallelHook(['params1']);
console.time();
hooks.tapAsync('start', (arg1, callback) => {
  setTimeout(() => {
    console.log('start', arg1);
    console.timeLog();
    callback(true);
  }, 1000);
});

hooks.tapAsync('end', (arg1, callback) => {
  setTimeout(() => {
    console.log('end', arg1);
    // console.timeLog()
    callback();
  }, 2000);
});

hooks.callAsync('params', () => {
  console.log('params over');
  console.timeEnd();
});
```

### 7、AsyncSeriesHook

![AsyncSeriesHook](/frontend-knowledge/images/tapable/AsyncSeriesHook.png)

```js
const { AsyncSeriesHook } = require('tapable');
const hooks = new AsyncSeriesHook(['args']);
console.time('timer');
hooks.tapAsync('start', (arg1, callback) => {
  setTimeout(() => {
    console.log('tapAsync1', arg1);
    console.timeLog('timer');
    callback();
  }, 1000);
});
hooks.tapPromise('end', (arg1) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('tapPromise2', arg1);
      console.timeLog('timer');
      resolve();
    }, 2000);
  });
});
hooks.callAsync('action', () => {
  console.log('event done');
  console.timeEnd('timer');
});
```

- tapAsync，callback 执行，代表本次事件执行完毕
- 异步事件依次执行
- 如果事件返回！undefined,那么 callback 就会触发，将会中断后面事件的执行
- reject()也一样会中断

## 三、其他使用

### 1、拦截器

```js
hook.intercept({
  // 每次通过 tap、tapAsync、tapPromise 方法注册事件函数时
  register: (tapInfo) => {
    console.log('tap', tapInfo);
    // tapInfo.name = "end"
    return tapInfo;
  },
  // 执行call方法触发
  call: (arg1, arg2, arg3) => {
    console.log('arg1, arg2, arg3', arg1, arg2, arg3);
  },
  // 调用注册事件时执行
  tap: (tap) => {
    console.log('tap', tap);
  },
});
```

### 2、HookMap 管理 Hook

```js
const { HookMap, SyncHook } = require('tapable');
// 更好的管理Hook
const hookMap = new HookMap((key) => new SyncHook(['arg']));

hookMap.for('one').tap('start', (arg) => {
  console.log('start', arg);
});
hookMap.for('two').tap('run', (arg) => {
  console.log('run', arg);
});
hookMap.for('three').tap('end', (arg) => {
  console.log('end', arg);
});
const oneHook = hookMap.get('one');
if (oneHook) {
  oneHook.call('go');
}
```
