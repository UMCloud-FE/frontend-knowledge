---
title: 装饰器
order: 8

group:
  title: TYPESCRIPT
  order: 1
---

## 一、定义

### 1. 官方定义

是一种特殊类型的声明，能够附加到类声明、方法、访问符、属性、类方法的参数上，以达到扩展类的行为，装饰器使用@expression 这种形式，expression 求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入。

### 2. 通俗解释

就是一个方法，可以注入到类、方法、属性参数上来扩展类、属性、方法、参数的功能。

## 二、引入原因

es2015 引入 class，当需要在多个不同的类之间共享或者扩展一些方法或行为的时候，代码会变得很复杂，这也是装饰器被提出的一个很重要的原因。

## 三、配置

装饰器是一项实验性特性，若要启用实验性的装饰器特性，你必须在命令行或 tsconfig.json 里启用 experimentalDecorators 编译器选项。

- 命令行：tsc --target ES5 --experimentalDecorators
- tsconfig.json

```js
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true
    }
}
```

## 四、常见装饰器

### 1. 类装饰器（无法传参数）

- 定义

```js
declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
```

- 例子

```js
function fun1(target: Function) {
    target.prototype.name = '张三';
    (target as any).userName = '李四';
}

@fun1
class Person1 {}

const p1 = new Person1();
console.log("name", (p1 as any).name)
console.log("username", (Person1 as any).userName)
```

### 2. 装饰器工厂

- 例子

```js
function fun2(options: any) {
  return function (target: Function) {
    target.prototype.name = options.name;
    target.prototype.age = options.age;
  };
}

@fun2({ name: '张三', age: 20 })
class Person2 {}
const p1 = new Person2();
console.log('p1', p1);
```

```js
const MessageDecorator = (type: string): ClassDecorator => {
  switch (type) {
    case "tank":
      return (target: Function) => {
        target.prototype.palyMusic = (): void => {
          console.log("播放音乐");
        };
      };
    default:
      return (target: Function) => {
        target.prototype.palyMusic = (): void => {
          console.log("喜洋洋");
        };
      };
  }
};
@MessageDecorator("tank")
class Tank {}
(new Tank() as any).palyMusic();

@MessageDecorator("player")
class Player {}
(new Player() as any).palyMusic();
```

### 3. 装饰器组合

- 多个装饰器可以应用到一个声明上
  - 书写在同一行
    @f @g X
  - 书写在多行
    @f
    @g
    X
- 执行顺序：组合起来一起使用的时候，会先从上至下的执行所有的装饰器工厂，拿到所有真正的装饰器，然后再从下至上的执行所有的装饰器。
- 例子

```js
function demo1(target: Function) {
  console.log('demo1');
}
function demo2() {
  console.log('demo2');
  return function (target: Function) {
    console.log('demo2 内部');
  };
}
function demo3() {
  console.log('demo3');
  return function (target: Function) {
    console.log('demo3 内部');
  };
}
function demo4(target: Function) {
  console.log('demo4');
}
@demo1
@demo2()
@demo3()
@demo4
class Person3 {}
```

```js
function demo1(target: Function) {
    target.prototype.name = '张三呀';
}
function demo2() {
    return function(target: Function) {
        target.prototype.name = '李四呀';
    }
}
@demo1
@demo2()
class Person3 {}
const p1 = new Person3();
console.log('name', (p1 as any).name)
```

### 4. 属性装饰器

- 定义

```js
declare type PropertyDecorator = (
  target: Object,
  propertyKey: string | symbol,
) => void;
```

- 例子

```js
// writable : 表示能否修改属性的值，即值是可写的还是只读。
// enumerable : 目标属性是否可被枚举（遍历）。
// configurable : 表示能否通过 delete 删除属性、能否修改属性的特性，或者将属性修改为访问器属性。
const propDecorator: PropertyDecorator = (...args: any[])=>{
    console.log('args', args);
}
// 普通参数就是原型对象
class PrintCase1{
    @propDecorator
    public title: string | undefined;
}
// 静态的话，就是构造函数
class PrintCase2{
    @propDecorator
    public static title: string | undefined;
}
```

```js
function fun4(target: Object, attr: any) {
    (target as any)[attr] = '张三';
}
class Person4 {
    @fun4
    userName: string | undefined;
}
let p4 = new Person4()
console.log('name', p4.userName)
```

### 5. 参数装饰器

- 定义

```js
declare type ParameterDecorator = (
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number,
) => void;
```

- 例子

```js
const paramsDecorator: ParameterDecorator = (...args: any[])=>{
    console.log('args', ...args)
}
class PrintCase{
    public show(id: number = 1, @paramsDecorator content: string) {

    }
}
```

### 6. 方法装饰器

- 定义

```js
declare type MethodDecorator = <T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>,
) => TypedPropertyDescriptor<T> | void;
```

- 例子

```js
function test(
  target: any,
  prototypeKey: string,
  decriptor: PropertyDescriptor,
) {
  console.log(target);
  console.log(prototypeKey);
}
class Person {
  @test
  sayName() {
    console.log('say name...');
    return 'say name...';
  }
}
let p = new Person();
p.sayName();
```

```js
const showDecorator: MethodDecorator = (...args: any[]) => {
  const method = args[2].value
  method()
};
class User {
  @showDecorator
  public show() {
    console.log("11");
  }
}
const obj = new User();
console.log('obj', obj.show());
```

```js
const showDecorator: MethodDecorator = (...args: any[]) => {
  args[2].value = () => {
    console.log("22");
  };
};
class User {
  @showDecorator
  public show() {
    console.log("11");
  }
}
const obj = new User();
console.log("obj", obj.show());
```

```js
const showDecorator: MethodDecorator = (
  target: Object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) => {
  descriptor.value = () => {
    console.log("22");
  };
};
class User {
  @showDecorator
  public show() {
    console.log("11");
  }
}
const obj = new User();
console.log("obj", obj.show());
```
