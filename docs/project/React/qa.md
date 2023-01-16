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
