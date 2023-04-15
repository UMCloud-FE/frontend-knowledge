---
title: React 常见问题
order: 1

group:
  title: 框架
  order: 1
---

# React 常见问题

### 一、定时器问题

#### 1. class 组件里面如何设置 10 秒定时器（自己实现）

（1）componentDidMount 里面调用 this.timeCount()<br /> （2）设置 timeCount 函数，可以用 setTimeout 或者 setInterval，这里注意需要把当前计数的放在 setTimeout 或者 setInterval 里面<br />

```
this.timer = setInterval(() => {
    let count = (this.state as ICancelAccountState).count;
    if (count > 0) {
        this.setState({ count: --count });
    } else {
        this.clearTimerInterval();
    }
}, 1000);
```

（3） componentWillUnmount 离开时候清除定时器<br />

```
clearInterval(this.timer);
this.timer = null;
```

#### 借鉴

[一些其他的思路](https://juejin.cn/post/7020776405751300132)

### 二、父子组件获取值问题

1. 子组件是函数组件
   - 首先子组件需要用 forwardRef 包裹一层，然后将要暴露的数据写成一个方法放在 useImperativeHandle 里面
   - 父组件中，给当前子组件绑定一个 ref，然后通过 子组件.current.暴露的方法
2. 子组件是一个 form 的函数组件（form 组件是当前公司组件库里面的 form 表单）
   - 子组件利用 formDecorator 包裹主
   - 父组件中，通过 useRef 获取当前子组件
   - 父组件直接通过 (invoiceDataRef.current as any).getFieldValue('invoiceAmount') 获取子组件里面的数据。（备注：invoiceDataRef 是当前子组件）

### 三、类式组件的 this 问题

```js
// 组件对象
handleThis = () => console.log(this);
handleThis() {
  // undefined
  console.log(this)
}
...
onClick={this.handleThis}
```

修改方式：

```js
onClick={this.handleThis.bind(this)}
```

原理：

函数中的 this，指向调用该函数的对象。类式组件中，普通函数在调用的地方，apply 了一个 context，程序里传进去的就是 undefined。

### 四、合成事件

使用原因：

1. 事件兼容性
2. 提高性能：父级事件委托（17-：document，17+：container 层）
3. 便于记录事件上下文，并通过事件优先级调度

### 五、函数式组件中 forceUpdate

```js
// 方法1
const [, forceUpdate] = useReducer((x) => x + 1, 0);

const handleClick = () => {
  forceUpdate();
};

// 方法2：抽取hook
const forceUpdate = useForceUpdate();

function useForceUpdate() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const update = useCallback(() => {
    forceUpdate();
  }, []);

  return update;
}
```

### 六、Hook 解决了什么问题，有什么特性

出现时间 16.8+

出现之前问题：

1. 组件间共用数据（例子：useForm）
2. 复杂组件难以理解
3. 难以理解的 class：this、臃肿的多层 state、不明所以的 state

特性：

1. 组件更新时，可以缓存组件状态，便于在函数式组件中使用已有的 react 特性
2. 使用副作用函数替代生命周期
3. 支持扩展 react 特性：可自定义 hook
4. 没有破坏性改动，100%向后兼容

QA:

1. 为什么只能用在组件最顶层

因为要保证 hook 函数的稳定性。组件内部的 hook 是按照顺序存储的（单链表或者数组），每次获取 hook 状态时，通过位置获取。

2. 为什么只能在函数组件中使用

普通函数没有 fiber 节点，没有地方挂载 hook 的单链表。

### 七、类组件构造函数中的 super

super 是 es6 的知识点。

1. 子类的构造函数必须执行一遍 super，起作用是返回父类的构造函数。

```js
const Context = React.createContext();
...
static contextType = Context;
constructor(props, context) {
  // props, context 是子类接受的参数，super负责把这些参数给父类
  super(props, context);
}
```

2. 不能在 spuer 之前使用 this
3. 没有定义构造函数的组件，实例化时会自动调用并传入标准参数

### 八、函数式组件与类式组件对比

- 颗粒度

函数式组件侧重于颗粒度小的场景。

- 实例

经常用到组件实例时，类组件适用

- 复用状态逻辑

类组件的 HOC 嵌套太多，不合适，自定义 hook 更简单

- 学习成本

函数组件没有成本，类式组件难度较高

- 其他

具体使用综合考量，比如一些特定的 API，或者要使用继承等。

### 九、useState 与 useReducer 为什么返回一个数组而不是对象

灵活性高，数组对应位置用户可以自定义名称。对象的 key 值是写死的，重名问题不好解决。

### 十、函数式组件没有 setState，如何调用回调

可以使用 useEffect、useLayoutEffect 替代
