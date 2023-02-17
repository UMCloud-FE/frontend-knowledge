---
title: interface
order: 2

group:
  title: TYPESCRIPT
  order: 1
---

## 一、定义

1. 为类型命名
2. 为你的代码或者第三方代码定义一个契约

## 二、具体使用

1. 定义说明
   - 定义：一般接口用 I 开头（I 表示 interface），然后 I 后面跟着的第一个字母大写。
   - 举例
   ```js
   interface IPeople {
     name: string;
     age: number;
     [propName: string]: any;
   }
   const person: IPeople = {
     name: '张三',
     age: 20,
   };
   ```
2. 可选属性
   - 用来定义非必需属性
   - 属性后面加一个问号即表示可选属性
   - 好处
     - 可以对可能存在的属性进行预定义
     - 可以捕获不存在的属性时的错误
   - 举例
   ```js
   interface IPeople {
     name: string;
     weight?: string;
   }
   const person: IPeople = {
     name: '张三',
     wight: '4kg',
   };
   ```
3. 只读属性
   - 利用 readonly
   - 举例
   ```js
   interface IPeople {
     readonly name: string;
   }
   const person: IPeople = {
     name: '张三'
   }
   person.name = '李四';
   ```
4. 函数类型
   - 一般使用 type 来定义函数类型
   - 举例
   ```js
   interface createPeople {
     (name: string, age: number): string;
   }
   let person: createPeople = (
     peopleName: string,
     peopleAge: number,
   ): string => {
     return '创建成功';
   };
   person('张三', 18);
   ```
5. 可索引类型
   - 索引只能为数字或者字符串
   - 举例
   ```js
   interface RoleDic {
     [id: number]: string;
   }
   const role1: RoleDic = {
     0: 'super_admin',
     1: 'admin',
   };
   ```
6. 类类型
   - 接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员
   - 举例
   ```js
   interface ClockInterface {
       currentTime: Date;
       setTime(d: Date);
   }
   class Clock implements ClockInterface {
       currentTime: Date;
       setTime(d: Date) {
           this.currentTime = d;
       }
       constructor(h: number, m: number) { }
   }
   ```
7. 继承接口
   - 继承一个
   ```js
   interface Shape {
     color: string;
   }
   interface Square extends Shape {
     sideLength: number;
   }
   let square: Square = {
     color: 'blue',
     sideLength: 10,
   };
   ```
   - 继承多个
   ```js
   interface Shape {
     color: string;
   }
   interface PenStroke {
     penWidth: number;
   }
   interface Square extends Shape, PenStroke {
     sideLength: number;
   }
   let square: Square = {
     color: 'blue',
     penWidth: 10,
     sideLength: 10,
   };
   ```
8. 接口继承类
   - 举例
   ```js
   class AnimalInfo {
       public age = 10;
       public setAge(age: number) {
         this.age = age;
       }
   }
   interface animal extends AnimalInfo {
       getFood(): string;
   }
   const panda: animal = {
       age: 20,
       getFood: () => {
         return "bamboo";
       },
       setAge: (age: number) => {},
   };
   ```
9. 同名接口
   - 举例
   ```js
   interface IPeople {
     name: string;
   }
   interface IPeople {
     age: number;
   }
   const person: IPeople = {
     name: '张三',
     age: 18,
   };
   ```
10. 混合类型
    - 举例
    ```js
    interface Counter {
      (): void;
      count: number;
    }
    const getCounter = (): Counter => {
      const c = () => {
        c.count++;
      };
      c.count = 0;
      return c;
    };
    const counter: Counter = getCounter();
    counter();
    console.log(counter.count);
    counter();
    console.log(counter.count);
    ```

## 三、与 type 的比较

1. type 介绍
   type: 类型别名，不仅可以用来表示基本类型，还可以用来表示对象类型、联合类型、元组和交集。
   interface 仅限于描述对象类型

```js
type name = string; // 基本类型
type peopleId = number | string; // 联合类型
type arr = number[];
type People = {
  name: string,
  age: number,
  id: peopleId,
};
type Tree<T> = { value: T };
const user: Tree<string> = { value: '111' };
```

2. 相同点

|              属性名称              | type | interface |
| :--------------------------------: | :--: | :-------: |
|          描述对象或者函数          |  能  |    能     |
|              能被继承              |  能  |    能     |
| 类都可以继承，除了 type 的联合类型 |  能  |    能     |

- 都可以描述对象或者函数

```js
type Point = {
  x: number,
  y: number,
};
type SetPoint = (x: number, y: number) => void;
```

```js
interface Point {
 x: number,
 y: number
}
interface SetPoint {
 (x: number, y: number) => void
}
```

- 都可以被继承
  类型别名可以继承接口，接口也可以继承类型别名
  - interface 继承 interface
  ```js
  interface Person {
    name: string;
  }
  interface Student extends Person {
    stuNo: number;
  }
  ```
  - interface 继承 type
  ```js
  type Person{
      name: string
  }
  interface Student extends Person { stuNo: number }
  ```
  - type 继承 type
  ```js
  type Person{
      name: string
  }
  type Student = Person & { stuNo: number }
  ```
  - type 继承 interface
  ```js
  interface Person {
    name: string;
  }
  type Student = Person & { stuNo: number };
  ```
  3. 类都可以继承，除了 type 的联合类型
  ```js
  interface ICat {
    setName(name: string): void;
  }
  class Cat implements ICat {
    setName(name: string): void {
      // todo
    }
  }
  // type
  type ICat = {
    setName(name: string): void,
  };
  class Cat implements ICat {
    setName(name: string): void {
      // todo
    }
  }
  type Person = { name: string } | { setName(name: string): void };
  // 无法对联合类型Person进行实现
  // error: A class can only implement an object type or intersection of object types with statically known members.
  class Student implements Person {
    name = '张三';
    setName(name: string): void {
      // todo
    }
  }
  ```

3. 不同点

|           属性名称           |    type    | interface |
| :--------------------------: | :--------: | :-------: |
|         定义基本类型         |     能     |   不能    |
|         声明联合类型         |     能     |   不能    |
|           声明元组           |     能     |   不能    |
| 声明合并（是否允许重复声明） |    不能    |    能     |
|           索引问题           | 不会出问题 | 会出问题  |

备注：索引问题

```js
interface IPropType {
  [key: string]: string;
}
let props: IPropType;
type dataType = {
  title: string,
};
interface dataType1 {
  title: string;
}
const data: dataType = {
  title: '订单页面',
};
const data1: dataType1 = {
  title: '订单页面111',
};
props = data;
props = data1;
```

4. 总结

- 官方推荐用 interface，其他无法满足需求的情况下用 type。
- type 定义的类型更广泛，如果想保持代码统一，建议用 type。
- 对于 React 组件中 props 及 state，使用 type ，这样能够保证使用组件的地方不能随意在上面添加属性。
- 编写三方库时使用 interface，其更加灵活自动的类型合并可应对未知的复杂使用场景。
