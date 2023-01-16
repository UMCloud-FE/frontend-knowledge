---
title: React 源码解毒
order: 2

group:
  title: 框架
  order: 1
---

# React 源码解毒

<hr>

# 原理

## 虚拟DOM 与 fiber架构

### 为什么使用虚拟DOM（vdom）

- DOM 操作很慢，轻微的操作都可能导致页面重新排版，非常耗性能。相对于DOM对象，js对象处理起来更快，而且更简单。通过diff算法对比新旧 vdom（js对象） 之间的差异，可以批量的、最小化的执行dom操作，从而提升用户体验
- DOM 内置属性太多，使用 vdom 可以只封装自己想要的属性来减少计算开销
![图片](/frontend-knowledge/images/react/old-dom.png)

### react 渲染

在某一时间节点调用 React 的 render() 方法，会创建一棵由 React 元素组成的树。在下一次 state 或 props 更新时，相同的 render() 方法会返回一棵不同的树。React 需要基于这两棵树之间的差别来判断如何有效率的更新 UI 以保证当前 UI 与最新的树保持同步。这种算法起个名字，叫做 DIFF 算法，字面意思，就是对比差异。

### DIFF

react渲染树：

![图片](/frontend-knowledge/images/react/diff-tree.png)

算法策略

- 同级比较
- 拥有不同类型的两个组件将会生成不同的树形结构。
- 使用 key 来保持稳定渲染

diff原则

- 删除：新vdom不存在时
- 替换：vdom和newVdom类型不同或key不同时
- 更新：有相同类型和key但vdom和vdom不同时

### fiber

为什么需要 fiber

- diff算法采用深度优先遍历（递归）的方式，对于大型项目，组件树会很大，这个时候递归遍历的成本就会很高，会造成主线程被持续占用，结果就是主线程上的布局、动画等周期性任务就无法立即得到处理，造成视觉上的卡顿，影响用户体验。

fiber 新功能

1. 增量渲染（把渲染任务拆分成块，匀到多帧）
2. 更新时能够暂停，终止，复用渲染任务
3. 给不同类型的更新赋予优先级
4. 给新版 react 提供并发的基础能力

![图片](/frontend-knowledge/images/react/fiber-1.jpeg)

