---
title: 迭代器
order: 6

group:
  title: 编程语言
  order: 1
---

## 一、定义

- 迭代器是一种行为设计模式，让你能在不暴露复杂数据结构内部细节的情况下遍历其中所有的元素，可以用一个迭代器接口以相似的方式遍历不同集合中的元素
- 迭代器通常是一个实现了下面接口的对象

```js
interface Iterator<T> {
    next(value?: any): IteratorResult<T>;
    return?(value?:any):IteratorResult<T>;
    throw?(e?:any):IteratorResult<T>;
}
```

## 二、迭代器

### 1. 可迭代性

- 当一个对象实现了 Symbol.iterator 属性时，我们认为它是可迭代的。
- 一些内置的类型如 Array,Map,Set,String,Int32Array,Unit32Array 等都已经实现了各自的 Symbol.iterator
- 对象上的 Symbol.iterator 函数负责函数工迭代的值。
- for...of 语句，会遍历可迭代的对象，调用对象上的 Symbol.iterator 方法。

### 2. 示例

```js
interface IteratorInterface {
  next: () => {
    value: any,
    done: boolean,
  };
}
function createIterator(array: any[]): IteratorInterface {
  let index = 0;
  let len = array.length;

  return {
    next: function () {
      return index < len
        ? { value: array[index++], done: false }
        : { value: undefined, done: true };
    },
  };
}

let iterator = createIterator([1, 2, 3]);
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

```js
let str: string = 'Hi';
let iterator: IterableIterator<string> = str[Symbol.iterator]();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```
