---
title: 二叉树遍历
order: 0

group:
  title: 算法
  order: 0
---

<img src="/frontend-knowledge/images/algorithm/tree.png" width="300" alt="二叉树" />

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

![图片](/frontend-knowledge/images/algorithm/btree-map.png)

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
      queue.unshift(...printNode.children.slice().reverse());
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
    console.log(root.name);
    preOrderTraverse(children[0]);
    preOrderTraverse(children[1]);
  }
}
```

非递归实现

- 建立一个栈，入栈根节点
- 出栈当前节点，将当前节点子节点集合逆向入栈
- 重复第二步，直到栈空

![图片](/frontend-knowledge/images/algorithm/btree-map2.png)

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

> 思考：学会了先序遍历，相信你应该能够很容易的写出后序遍历的实现！

## 中序遍历

非递归实现

- 建立一个栈，入栈根节点
- 若有左子节点，则入栈，直到没有左子节点时出栈栈顶元素并打印，入栈栈顶元素的右子节点
- 重复第二步，直到没有可用元素且栈空为止

![图片](/frontend-knowledge/images/algorithm/btree-map3.png)

```js
function middleOrderTraverse(node) {
  if (!node) return;

  const stack = [];
  let currentNode = node;
  while (currentNode || stack.length > 0) {
    if (currentNode) {
      stack.push(currentNode);
      currentNode =
        currentNode && currentNode.children ? currentNode.children[0] : null;
    } else {
      const poped = stack.pop();
      console.log(poped.name);
      currentNode = poped.children ? poped.children[1] : null;
    }
  }
}
```

## 链表实现

链表不适合做广度优先遍历，下面示意图中，深度优先会非常的方便。

![图片](/frontend-knowledge/images/algorithm/btree-linktable.png)

- 遍历思路：从根节点开始，以此遍历每一个经过的节点的 child 和 sibling

伪代码实现：

```js
function linkedListTraverse(root) {
  let wip = root;

  while (wip) {
    console.log(wip);

    if (wip.child) {
      temp = wip.child;
      wip.child = null; // 遍历过就剔除
      wip = temp;
      continue;
    }

    if (wip.sibling) {
      temp = wip.sibling;
      wip.sibling = null; // 遍历过就剔除
      wip = temp;
      continue;
    }

    wip = wip.return;
  }
}
```
