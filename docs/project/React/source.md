---
title: React 源码解读
order: 2

group:
  title: 框架
  order: 1
---

# React 源码解读

---

## 1. 原理

### 虚拟 DOM 与 fiber 架构

#### 为什么使用虚拟 DOM（vdom）

- DOM 操作很慢，轻微的操作都可能导致页面重新排版，非常耗性能。相对于 DOM 对象，js 对象处理起来更快，而且更简单。通过 diff 算法对比新旧 vdom（js 对象） 之间的差异，可以批量的、最小化的执行 dom 操作，从而提升用户体验
- DOM 内置属性太多，使用 vdom 可以只封装自己想要的属性来减少计算开销
  ![图片](/frontend-knowledge/images/react/old-dom.png)

#### react 渲染

在某一时间节点调用 React 的 render() 方法，会创建一棵由 React 元素组成的树。在下一次 state 或 props 更新时，相同的 render() 方法会返回一棵不同的树。React 需要基于这两棵树之间的差别来判断如何有效率的更新 UI 以保证当前 UI 与最新的树保持同步。这种算法起个名字，叫做 DIFF 算法，字面意思，就是对比差异。

#### DIFF

react 渲染树：

![图片](/frontend-knowledge/images/react/diff-tree.png)

算法策略

- 同级比较
- 拥有不同类型的两个组件将会生成不同的树形结构。
- 使用 key 来保持稳定渲染

diff 原则

- 删除：新 vdom 不存在时
- 替换：vdom 和 newVdom 类型不同或 key 不同时
- 更新：有相同类型和 key 但 vdom 和 vdom 不同时

#### fiber

为什么需要 fiber

- diff 算法采用深度优先遍历（递归）的方式，对于大型项目，组件树会很大，这个时候递归遍历的成本就会很高，会造成主线程被持续占用，结果就是主线程上的布局、动画等周期性任务就无法立即得到处理，造成视觉上的卡顿，影响用户体验。

fiber 新功能

1. 增量渲染（把渲染任务拆分成块，匀到多帧），使用链表循环代替递归来进行深度优先遍历，算法时间复杂度 O(n)
2. 更新时能够暂停，终止，复用渲染任务
3. 给不同类型的更新赋予优先级
4. 给新版 react 提供并发的基础能力

![图片](/frontend-knowledge/images/react/fiber-1.jpeg)

fiber 树(双向链表)：

![图片](/frontend-knowledge/images/react/fiber-2.png)

因为要借助 fiber，所以在 vdom 外需要包装一个 fiber node 的封装来参与调度。

## 2. 实现一个 mini-fiber

### ① Tags

由于要渲染不同的组件和原生标签，给各个类型打上标签：

```js
// ReactWorkTags
export const FunctionComponent = 0;
export const ClassComponent = 1;
export const IndeterminateComponent = 2;
...
export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;
```

### ② Fiber 对象

新建一个 fiber 封装类

```js
// ReactFiber
export function createFiber(vnode, returnFiber) {
  const fiber = {
    type: vnode.type, // 表示fiber的真实类型 这个和elementType大部分情况下是一样的 在使用了懒加载之类的功能时可能会不一样。 区别于 tag，type可以自定义，当是组件时 type可以是这个组件的构造函数，用户创建元素时使用
    key: vnode.key,
    props: vnode.props, // 属性
    // 第一个子节点fiber
    child: null,
    // 下一个兄弟fiber
    sibling: null,
    // 父fiber
    return: returnFiber,
    // dom或实例
    // 函数式组件为null，他的实例存在child里，这也是为什么render里只能有一个跟节点
    stateNode: null,
    // 节点下标
    index: null,
    // old fiber
    alternate: null,
    flags: Placement,
    tag: null,
  };

  const { type } = vnode;

  // 打 tag
  if (isStr(type)) {
    // 原生标签
    fiber.tag = HostComponent; // 传入的是dom.nodeName
  } else if (isFn(type)) {
    // 函数组件 类组件
    fiber.tag = type.prototype.isReactComponent
      ? ClassComponent
      : FunctionComponent;
  } else if (isUndefined(type)) {
    // 此时是纯文本或数字节点
    fiber.tag = HostText;
    fiber.props = { children: vnode };
  } else {
    fiber.tag = Fragment;
  }

  return fiber;
}
```

其中 flags 用于区分接下来进行什么操作：

```js
export const Placement = /*                    */ 0b0000000000000000000010; // 2
export const Update = /*                       */ 0b0000000000000000000100; // 4
export const Deletion = /*                     */ 0b0000000000000000001000; // 8
```

> 知道为什么使用 二进制吗？考虑到即将进行的操作可能会有多个，为了提高可扩展性，使用二进制方便位运算，相加同样具有唯一性。判断：`state & Update === true`

区分 函数式组件和类式组件，需要额外加标志。我们都知道 类式组件最终都会继承 Component 组件，我能就在这个上边做手脚：

```js
export default function Component(props) {
  this.props = props;
}

// 类组件标记
Component.prototype.isReactComponent = {};
```

只要判断有没有 isReactComponent 就可以区分是否是函数式组件了。

如此就构建了一个对 react vdom 二次封装的 Fiber 对象。

### ③ 渲染容器

我们都知道，React 17+ 的根组件渲染方式：

```js
// 新的渲染方式，开放出了 root 对象单例，方便重复render
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(jsx);

...
root.render(jsx1);
```

那不如就从这里入手，来看看 fiber 是怎么封装 dom 的。

```js
function createRoot(container) {
  const root = {
    containerInfo: container,
  };

  return new ReactDOMRoot(root);
}

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}
```

createRoot 返回了一个新的 ReactDOMRoot 对象:

```js
ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;

  updateContainer(children, root);
};

function updateContainer(element, container) {
  const { containerInfo } = container;

  // 这里可以看到， react的容器根节点一定是原生的dom，不然不存在nodeName
  const rootFiber = createFiber(element, {
    type: containerInfo.nodeName.toLocaleLowerCase(),
    stateNode: containerInfo,
  });

  scheduleUpdateOnFiber(rootFiber);
}
```

这个对象实现了 root 的 render 方法，调用了 updateContainer 方法。而这个方法创建了一个 Fiber 对象，通过 scheduleUpdateOnFiber 加入调度器：

```js
export function scheduleUpdateOnFiber(fiber) {
  // work in process
  wip = fiber;
  wipRoot = fiber;
}
```

work in process 表示当前正在处理的 fiber 节点。

我们看到了，初始化工作完成后，似乎没有渲染的操作，只是 new 了一堆对象。所以需要创建一个调度任务。

### ④ 调度器

浏览器有自己的调度工具：

> 这里我们暂且使用浏览器自带的空闲时间片调度工具。由于考虑到兼容性，React 自己实现了这个函数，放在 Scheduler 里，下边会讲到。

```js
// TODO：react scheduler 部分原生实现了一套：浏览器事件循环空闲时间段内调用函数排队
requestIdleCallback(workLoop);
```

我们这里关注的重点还是在如何调度上：

```js
function workLoop(IdleDeadLine) {
  // 可以自己定义核实执行什么事件，这里判断只要空闲就排队
  while (wip && IdleDeadLine.timeRemaining() > 0) {
    // 执行任务：使用新的 O(n) 算法
    performUnitOfWork();
  }

  // 确保调度器在运行
  requestIdleCallback(workLoop);

  // 如果所有的任务执行完毕，commit一下，就是说触发一次更新。从 root 开始刷新一遍渲染
  if (!wip && wipRoot) {
    commitRoot();
  }
}
```

上边的代码是一个循环调度，反复调用 requestIdleCallback，让 CPU 在空闲时间片调用我们自己定义的调度函数来渲染界面。当有空闲时间时，执行 performUnitOfWork，当没有工作中的 fiber 实例，说明是渲染根节点，此时不能复用上边的更新逻辑，因为节点都还没有呢，谈不上更新，此时需调用 commitRoot。

执行任务代码如下：

```js
// performUnitOfWork
const { tag } = wip;

// 通过 tag 区分吧冉的渲染模式
switch (tag) {
  case HostComponent:
    updateHostComponent(wip);
    break;

  case FunctionComponent:
    updateFunctionComponent(wip);
    break;

  case ClassComponent:
    updateClassComponent(wip);
    break;

  case Fragment:
    updateFragmentComponent(wip);
    break;

  case HostText:
    updateTextComponent(wip);
    break;

  default:
    break;
}

// 2. 更新wip 多叉树深度优先遍历
// 优先找孩子，没有孩子就找兄弟，没有兄弟找父级的兄弟，直到找到根节点。时间复杂度：O(n)
if (wip.child) {
  wip = wip.child;
  return;
}

let next = wip;

while (next) {
  if (next.sibling) {
    wip = next.sibling;
    return;
  }
  next = next.return;
}
wip = null;
```

commitRoot 代码如下：

```js
// commitRoot
commitWorker(wipRoot);
// 防止被 多次执行
wipRoot = null;

// fiber 树创建的过程
function commitWorker(wip) {
  // 直到找不到 wip，退出
  if (!wip) {
    return;
  }
  // 自己
  const { stateNode, flags } = wip;
  // 父dom节点
  const parentNode = getParentNode(wip.return); //wip.return.stateNode;

  // 具体 flags 的设置，在 后边 diff 算法中实现

  // 即将创建的
  if (flags & Placement && stateNode) {
    parentNode.appendChild(stateNode);
  }

  // 即将更新的
  if (flags & Update && stateNode) {
    updateNode(stateNode, wip.alternate.props, wip.props);
  }

  // 即将删除的
  if (wip.deletions) {
    commitDeletions(wip.deletions, stateNode || parentNode);
  }

  // 2. 下一个孩子
  commitWorker(wip.child);
  // 3. 下一个兄弟
  commitWorker(wip.sibling);
}

function getParentNode(wip) {
  // 自定义组件没有实体，return里全是child，需往上找父组件
  let tem = wip;
  while (tem) {
    if (tem.stateNode) {
      return tem.stateNode;
    }
    tem = tem.return;
  }
}

// prev  {a: 1}
// next { b: 3}
export function updateNode(node, prevVal, nextVal) {
  Object.keys(prevVal).forEach((k) => {
    if (k === 'children') {
      // 有可能是文本
      if (isStringOrNumber(prevVal[k])) {
        node.textContent = '';
      }
    } else if (k.slice(0, 2) === 'on') {
      const eventName = k.slice(2).toLocaleLowerCase();
      node.removeEventListener(eventName, prevVal[k]);
    } else {
      if (!(k in nextVal)) {
        node[k] = '';
      }
    }
  });

  Object.keys(nextVal).forEach((k) => {
    if (k === 'children') {
      // 有可能是文本
      if (isStringOrNumber(nextVal[k])) {
        node.textContent = nextVal[k] + '';
      }
    } else if (k.slice(0, 2) === 'on') {
      const eventName = k.slice(2).toLocaleLowerCase();
      node.addEventListener(eventName, nextVal[k]);
    } else {
      node[k] = nextVal[k];
    }
  });
}

function commitDeletions(deletions, parentNode) {
  for (let i = 0; i < deletions.length; i++) {
    parentNode.removeChild(getStateNode(deletions[i]));
  }
}
```

### ⑤ 渲染节点

上边的 commit 操作我们看到了，是根据节点的 flags 和 stateNode 实例来更新的。在渲染的时候，需要写入这两份属性，

渲染原生节点：

```js
export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type);
    updateNode(wip.stateNode, {}, wip.props);
  }

  // 协调子节点，还记得上边原生节点放在了 props.children 中
  reconcileChildren(wip, wip.props.children);
}
```

调度函数：

```js
function reconcileChildren(wip, children) {
  if (isStringOrNumber(children)) {
    return;
  }

  // 原生 dom 只有一个 child，会是一个对象，这里统一放在数组里
  const newChildren = isArray(children) ? children : [children];

  // 记录上一个fiber
  let previousNewFiber = null;
  let oldFiber = wip.alternate?.child;
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    if (!newChild) {
      // 规避这样的写法： {null}
      continue;
    }
    const newFiber = createFiber(newChild, wip);

    const same = sameNode(newFiber, oldFiber);

    if (same) {
      Object.assign(newFiber, {
        stateNode: oldFiber.stateNode,
        alternate: oldFiber,
        flags: Update,
      });
    }

    if (!same && oldFiber) {
      deleteChild(wip, oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (previousNewFiber === null) {
      // 头结点
      wip.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }
}

function sameNode(a, b) {
  return a && b && a.type === b.type && a.key === b.key;
}
```
