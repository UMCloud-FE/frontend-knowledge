---
title: 基础类型
order: 2

group:
  title: 编程语言
  order: 1
---

## 一、基础类型

### 1. 基本数据类型

```js
let a1: boolean = false;
let a2: number = 1;
let a3: string = 'test';
let a4: number[] = [1, 2, 3]; // let a4: Array<number> = [1, 2, 3];
```

### 2. 元祖

```js
let a: [boolean, number[]] = [true, [1, 2, 3]];
```

- 小贴士
  - 访问已有的，会得到正确类型，例如 a[0]
  - 访问越界的，会得到联合类型，例如 a[3] = false

### 3. 枚举

```js
enum Direction { Up = "UP", Down = "DOWN", Left = "LEFT", Right = "RIGHT" }
enum Date { yesterday = 5, today }
let a1: Date = Date.today;
let a: string = Date[6];
```

### 4. 联合类型

- 表示取值可以为多种类型中的一种
- 访问联合类型的属性或者方法的时候，只能访问此联合类型的所有类型里共有的属性或方法

```js
let a = string | number;
```

### 5. any

### 6. void

- 基本用于函数声明，表示当前函数没有返回值

### 7. 对象

- object 类型用于表示所有的非原始类型
- Object 代表所有拥有 toString、hasOwnProperty 方法的类型 所以所有原始类型、非原始类型都可以赋给 Object

```js
let obj1: object;
obj1 = 1;
let obj2: Object;
obj2 = 2;
```

## 二、类型断言

### 1. 定义

通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

### 2. 声明

- 尖括号
- as

```js
let someValue: any = "this is a string";
// let strLength1: number = (<string>someValue).length;
let strLength2: number = (someValue as string).length; // 推荐用这个，因为jsx文件里面尖括号语法会报错
```

### 3.列子

```js
let obj = {};
obj.a = 'test';
```

```js
interface IObjProps {
    a: string;
}
let obj = {} as IObjProps;
obj.a = 'test';
```

## 三、交叉类型

- 交叉类型表示同时为多个类型

```js
interface A {
  name: string;
}
interface B {
  age: number;
}
type T = A & B;
const a: T = { name: '11', age: 20 };
const d = string & number; // d 类型就为never
const e = string & string;
```

## 四、类型守卫

### 1. 定义

是可执行运行时检查的一种表达式，用于确保该类型在一定的范围内。

### 2. 实现方式

- in

```js
interface Teacher {
  name: string;
  course: string;
}
interface Student {
  name: string;
  study: string;
}
type Class = Teacher | Student;
function getInfo(val: Class) {
  if ('course' in val) {
    console.log('this is teacher');
  } else if ('study' in val) {
    console.log('this is student');
  }
}
getInfo({ name: '张三', course: '语文' });
```

- typeof(只能识别基本类型：boolean,string,undefined,function,number,bigInt,symbol)

```js
function getInfo(name: string, score: string | number) {
  if (typeof score === 'number') {
    console.log(`teacher ${name}:${score}`);
  } else if (typeof score === 'string') {
    console.log(`student ${name}:${score}`);
  }
}
getInfo('张三', 20);
```

- instanceof

```js
class Person {
  firstName: string;
  lastName: string;
  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

class Animal {
  kind: string;
  legs: number;
  constructor(kind: string, legs: number) {
    this.kind = kind;
    this.legs = legs;
  }
}

function helloWorld(obj_: Person | Animal) {
  let res_: string = '';
  if (obj_ instanceof Person) {
    res_ = `Welcome ${obj_.firstName} ${obj_.lastName}`;
  } else if (obj_ instanceof Animal) {
    res_ = `${obj_.kind} has ${obj_.legs} legs`;
  }
  return res_;
}

const james = new Person('James', 'Anderson');
const jimmy = new Animal('Dog', 4);

helloWorld(james);
helloWorld(jimmy);
```

- 自定义类型保护的类型谓词(用 is 可以判断变量是否属于某种类型)

```js
interface IBird{
  name: string;
  feathersColor: string;
}
interface IFish{
  name: string;
  finsColor: string;
}
type Animal = IBird | IFish;
const isBird = (animal: Animal): animal is IBird => {
  let res_ = (animal as IBird).feathersColor !== undefined;
  return res_;
}

const parrot: Animal = {name: "Parrot", feathersColor: "green"};
const oscar: Animal = {name: "Oscar", finsColor: "orange"};

console.log(isBird(parrot))
console.log(isBird(oscar))
```
