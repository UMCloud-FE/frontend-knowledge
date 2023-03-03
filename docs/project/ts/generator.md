---
title: 生成器
order: 5

group:
  title: TYPESCRIPT
  order: 1
---

## 一、定义

- 生成器是一种能够中途停止，然后从停止的地方继续运行的函数
- 可以借助 yield 或者 return 停止函数运行
- 通常利用 function\* 来创建一个生成器函数，并不会立即执行函数中的代码，而是会返回一个迭代器对象，通过调用迭代器对象的 next() 方法，可以获得 yield/return 的返回值
- 可以把异步回调代码变成同步代码。
- async await 就是基于生成器函数的语法糖

## 二、生成器示例

```js
function* generatorFunction() {
  console.log('start');
  yield 'hello,';
  console.log('pause');
  yield 'world!';
}
const iterator = generatorFunction();
iterator.next();
iterator.next();
```
