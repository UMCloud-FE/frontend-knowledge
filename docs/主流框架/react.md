## react

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
