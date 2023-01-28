---
title: 二叉树遍历
order: 0

group:
  title: 算法
  order: 0
---

<img src="/frontend-knowledge/images/algorithm/tree.png" width="300" alt="二叉树" />

<!-- ![二叉树](/frontend-knowledge/images/algorithm/tree.png#pic_center=100x100) -->

## 数据结构

```js
const tree = {
  name: 1,
  children: [
    {
      name: 2,
      children: [
        {
          name: 4,
          children: [{ name: 8 }],
        },
        { name: 5 },
      ],
    },
    {
      name: 3,
      children: [{ name: 6 }, { name: 7 }],
    },
  ],
};
```

## 层次遍历

按照层级遍历

算法思路：

- 建立一个队列，从根节点开始，将其子节点的子节点从左至右入队
- 遍历队列并出队，重复第二步后半部分
- 队列为空则遍历结束

```js
function traverse(node) {
  if (!node) {
    return;
  }

  const queue = [];
  queue.unshift(node);

  while (queue.length > 0) {
    const printNode = queue.pop();
    console.log(printNode.name);
    if (printNode.children && printNode.children.length > 0) {
      queue.unshift(...printNode.children.reverse());
    }
  }
}
```

## 先序遍历

递归实现

- 从根节点开始
- 将左右节点当做子树，先遍历左节点，再遍历右节点
- 直到当前节点没有子节点为止

```js
function preOrderTraverse(root) {
  if (root != null) {
    const children = root.children || [];
    console.log(root.val);
    postOrderTraverse(children[0]);
    postOrderTraverse(children[1]);
  }
}
```

非递归实现

- 建立一个栈，入栈根节点
- 出栈当前节点，将当前节点子节点集合逆向入栈
- 重复第二步，直到栈空

```js
function preOrderTraverse(node) {
  if (!node) return;

  const track = [];
  track.push(node);

  while (track.length > 0) {
    const node = track.pop();
    console.log(node.name);
    const children = node.children;
    if (children && children.length > 0) {
      track.push(...children.reverse());
    }
  }
}
```

链表实现
