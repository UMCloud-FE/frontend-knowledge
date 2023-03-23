---
title: 八、利用tapable实现一个微前端架构
order: 8
---

## 一、前言

前端微服务已经很常见了，最近我们的微服务项目正式上线了，利用了开源的库，现在来复盘下，研究了下底层实现。

今天来分享一下，从零实现一个简单的微服务。

### 1、实现思路

通过在入口文件中，定义子应用挂载的 DOM，子应用全部挂载在`<div id="root"></div>`上，然后通过`document.getElementById("root").innerHTML = [child]`，来实现子应用切换。

实现的关键是：

- 串联各个子应用
- 实现子应用的生命周期
- 将子应用卸载和挂载

### 2、涉及到的技术栈：

- tapable 实现微服务的生命周期
- history 监听路由的变化
- lodash 工具函数

### 3、目录结构

```
- dist
    - index.html # 测试页面
- src
    - Hooks.js # 微服务生命周期
    - index.js # 微服务实现核心代码
    - demo.js # 微服务测试入口文件
- webpack.config.js # 本地启动服务，测试微服务
```

### 4、服务架构

最终的架构实现，这里仅仅是`Main Application`的实现

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f03b68ba2f5d44fe99ebcb14197b940c~tplv-k3u1fbpfcp-watermark.image?)

## 二、设计微服务

通过注册 App，将子应用挂载在主应用上

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7a935b3e8e040a5be86d2e71ebe186d~tplv-k3u1fbpfcp-watermark.image?)

### 1、在入口文件中，生成一个微服务 app 实例

调用我们要实现的微服务，传入必要的参数

```js
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

// 三个子应用分别是：home、demo、demo2
const config = {
  home: {
    prefix: '/',
    href: '/',
  },
  demo: {
    prefix: '/demo/',
    href: '/demo/',
  },
  demo2: {
    prefix: '/demo2/',
    href: '/demo2/',
  },
};

const app = microApp({
  config, // 传入配置的子应用
  mountDOM: document.getElementById('root'), // app挂载的节点
  history, // 传入history的`createBrowserHistory`
});

window._app = app;
```

### 2、在各个子应用中，注册到微服务

在 home 子应用中，通过读取`window._app`，将子应用注册为微服务，那么很明显我们要在微服务中实现注册函数，其他子应用同样注册

```js
window._app.register('home', () => {
  (mountDOM) => {
    const content = document.createElement('div');
    content.innerText = 'this is my home';
    mountDOM.appendChild(content);
  },
    (mountDOM) => {
      mountDOM.innerHTML = null;
    };
});
```

## 三、实现微服务的生命周期

这里我们通过`tapable`库来实现当前微服务的生命周期，下面定义了一些生命周期钩子，对应的钩子可以在需要的节点触发。

```js
import { SyncHook, AsyncParallelHook } from 'tapable';

class Hooks {
  // 注册子应用后
  afterRegister = new SyncHook(['project']);
  // 退出子应用
  exitProject = new SyncHook('project');
  // 卸载子应用
  unMount = new SyncHook(['project']);
  // 进入子应用
  enterProject = new SyncHook(['project']);
  // 挂载子应用
  mounted = new SyncHook(['mountDOM']);
  // 子应用挂载完成
  afterMounted = new SyncHook(['mountDOM']);
  // 资源加载时
  loadResource = new AsyncParallelHook([
    'project',
    'projectInfo',
    'interceptor',
  ]);
  // 出现错误时
  error = new SyncHook(['error']);
}

export default Hooks;
```

## 四、实现多个应用挂载

### 1、实现注册函数

定义一个内部全局对象`registerConfig`，将子应用配置信息全部缓存起来

```js
import Hooks from './Hooks';
const app = (config, initialMountDOM, history) => {
  const hooks = new Hooks(); //实例化钩子
  const registerConfig = {};
  const register = (projectKey, mount, unmount) => {
    registerConfig[projectKey] = {
      projectKey,
      mount,
      unmount,
    };
  };
  return {
    register,
    hooks, // 将钩子挂载在app上，可以在外部app上使用钩子
  };
};
```

### 2、卸载和挂载应用

对于子应用，在切换的时候，我们要能将当前的子应用卸载下来，将新的应用挂载到对应的 DOM

```
// 退出项目
const exitProject = (
    projectKey,
    projectRegisterConfig,
    mountDOM,
    hooks
) => {
    if(!projectKey) return
    // 卸载方法unmount
    const { unmount } = projectRegisterConfig || {};
    if (!unmount) {
        console.error(`unmount of project: ${projectKey} not exist`);
        return;
    }
    // 将mountDOM传递给子应用
    unmount(mountDOM)
    // 执行退出子应用钩子
    hooks.exitProject.call(projectKey)
    // 处理复杂逻辑后，如果正常执行，返回true，这里我们默认返回true
    return true
}
// 进入项目
const enterProject = (...) => {
    // 挂载方法mount
    // ...
    const { mount } = projectRegisterConfig || {};
    mount(mountDOM) // 进入项目使用
    // 执行进入子应用钩子
    hooks.enterProject.call(projectKey)
    return true
}
```

### 3、刷新子应用，执行挂载和卸载

刷新逻辑比较频繁，所以需要更复杂的错误边界处理和兼容处理。甚至需要在执行时，锁定当前的刷新状态，等到前一个应用卸载完毕，再开始挂载下一个应用。

```js
const refresh = (forceProjectKey) => {
    // 如果当前挂载的子应用和要刷新的子应用相同，就return
    if(mountedProjectKey === projectKey){
        return
    }
    // 卸载项目
    if(exitProject(...){
        mountedProjectKey = null
    }
    // 挂载项目
    if(enterProject(...){
        mountedProjectKey = projectKey
    }
}
```

### 4、监听路由的变化

通过监听 history 来刷新子应用

```js
if (history) {
  history.listen(() => {
    refresh();
  });
}
```

### 5、生命周期钩子事件的定义和执行

```js
hooks.exitProject.tap('refresh exitProject', () => refresh());
hooks.enterProject.tap('refresh enterProject', () => refresh());
```

这样，当执行`hooks.exitProject.call()`和`hooks.enterProject.call()`时，就会执行 refresh()，保持子应用最新状态

以上，最简单的一个微应用框架就好了，后面只需要在子应用加载时，将子应用的代码载入，渲染在对应的 DOM 即可

## 五、具体演示，挂载子应用

1、在 html 中渲染子应用，当触发切换子应用时执行`history.push`
2、在 webpack 启动 devServer 时，配置 history 模式

```js
devServer: {
    static: 'dist',
    port: 9000,
    historyApiFallback: true // 执行history模式
}
```

### 1、卸载 demo2，挂载 demo

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb2a75736cb24083884631e5b042d435~tplv-k3u1fbpfcp-watermark.image?)

### 2、卸载 demo，挂载 demo2

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c94aa9e44af342a0986a93af8cf5f095~tplv-k3u1fbpfcp-watermark.image?)

**这里我们仅声明了简单的几个生命周期和最简单的配置文件，可以自行根据需求在这个基础上扩展**
