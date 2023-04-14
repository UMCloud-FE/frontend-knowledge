---
title: 泛型
order: 5

group:
  title: 编程语言
  order: 1
---

## 一、定义

使用泛型来创建可重用的组件，一个组件可以支持多种类型的数据。

## 二、使用场景

1. 函数、接口或类将处理多种数据类型时
2. 函数、接口或类在多个地方使用该数据类型时

## 三、泛型接口

```js
function identity<T>(arg: T): T {
  return arg;
}
function identity<T, U>(value: T, message: U): U {
  return message;
}
```

如果要返回多种泛型怎么办？<br />

```js
// 利用元组
function identity<T, U>(value: T, message: U)[T,U] {
  return [value, message]
}

//利用泛型接口
interface Identities<V, M> {
  value: V,
  message: M
}
function identity<T, U>(value: T, message: U):Identities<T,U> {
  let data: Identities<T, U> = {
    value,
    message
  }
  return data;
}
```

## 四、泛型类

```js
class Person<T, U>{
    other: T
    age: U
}
​
let p = new Person<string,number>()
p.other = "good men"
p.age = 12
```

## 五、泛型约束

1. 检查属性是否存在

```js
function identity<T>(arg: T):T {
  return arg;
}
// 如果我们希望访问arg上面的length属性，那么就需要约束这个泛型
interface ILength {
  length: number;
}
function identity<T extends ILength>(arg:T):T {
  console.log('length', arg.length);
  return arg;
}
function identify<T>(arg: Array<T>):T {
  console.log('length', arg.length)
  return arg;
}
function identity<T>(arg: T[]):T[] {
  console.log('length', arg.length)
  return arg;
}
```

若有多种约束，就用,隔开，例如 <T extends Type1, Type 2>

2. 检查对象上的 key

```js
function checkProperty<T, K extends keyof T>(obj:T, key: K):T[K] {
    return obj[key]
}
```

## 六、泛型参数设置默认值

```js
interface IPerson<T = string> {
  name: T;
}
const people: IPerson = { name: '111' };
const people1: IPerson<number> = { name: 100 };
```

有默认类型的类型参数被认为是可选的。

## 七、泛型工具类

1. Partial\<T>：将某个类型里面的属性全部变成可选项

```js
interface IPeople {
  name: string;
  age: string;
}
const aPeople: IPeople = { name: '李四', age: 20 };
const people: Partial<IPeople> = { name: '张三' };
```

2. Record\<K extends keyof any, T>：将 K 中所有的属性的值转化为 T 类型

```js
interface IPeople {
  name: string;
  age: number;
}
type PersonType = 'doctor' | 'teacher';
const people: Record<PersonType, IPeople> = {
  doctor: {
    name: '张三',
    age: 20,
  },
  teacher: {
    name: '李四',
    age: 18,
  },
};
```

3. Pick\<T, K extends keyof T>：将某个类型中的子属性挑出来，变成包含这个类型部分属性的子属性。

```js
interface IPeople {
  name: string;
  age: number;
  weight: string;
}
type Person = Pick<IPeople, 'name' | 'age'>;
const people: Person = {
  name: '张三',
  age: 20,
};
```

4. Exclude\<T, U>：将某个类型中属于另一个的类型移除掉

```js
type T0 = Exclude<'a', 'b', 'c', 'a'>; // "b" | "c"
```

5. ReturnType\<T> ：获取函数 T 的返回类型

```js
type T0 = ReturnType<() => string>; // string
type T1 = ReturnType<(s: string) => void>; // void
```
