---
title: 排序
order: 1

group:
  title: 算法
  order: 0
---

## 堆排序

堆排序（Heapsort）是指利用堆这种数据结构所设计的一种排序算法。堆是一个近似完全二叉树的结构，并同时满足堆的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。堆排序可以说是一种利用堆的概念来排序的选择排序。分为两种方法：

大顶堆：每个节点的值都大于或等于其子节点的值，在堆排序算法中用于升序排列；
小顶堆：每个节点的值都小于或等于其子节点的值，在堆排序算法中用于降序排列；

堆排序的平均时间复杂度为 Ο(nlogn)。

![图片](/frontend-knowledge/images/algorithm/heapSort.gif)

> 图片来源：https://www.runoob.com/w3cnote/heap-sort.html

利用堆排序查找数组 nums 中前 k 大的值 (LeetCode 703)，并支持添加元素：

nums = [1, 2, 3, 4, 5, 6, 7, 8]

```js
// 构建一个最大堆
const KthLargest = function (k, nums) {
  this.k = k;
  this.heap = new MaxHeap();
  for (const x of nums) {
    this.add(x);
  }
};

// 入堆操作
KthLargest.prototype.add = function (val) {
  this.heap.offer(val);
  if (this.heap.size() > this.k) {
    // this.heap.poll();
  }
  return this.heap.peek();
};

// 最大堆类
class MaxHeap {
  constructor(data = []) {
    this.data = data;
    this.comparator = (a, b) => a - b;
    this.heapify();
  }

  heapify() {
    // 初始化时若不传data，heapify不执行
    if (this.size() < 2) return;
    for (let i = 1; i < this.size(); i++) {
      this.bubbleUp(i);
    }
  }

  // 获取第k大元素
  peek() {
    if (this.size() === 0) return null;
    return this.data[0];
  }

  // 向对尾推入元素，并做一次提升操作
  offer(value) {
    this.data.push(value);
    this.bubbleUp(this.size() - 1);
  }

  // 轮询一遍：只保留前k的，可以理解为祛除了最大元素后再次堆化
  poll() {
    if (this.size() === 0) {
      return null;
    }
    const result = this.data[0];
    const last = this.data.pop();
    if (this.size() !== 0) {
      this.data[0] = last;
      this.bubbleDown(0);
    }
    return result;
  }

  // 比较当前索引的节点和其子节点大小，子节点小的要交换，直到根节点结束
  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = (index - 1) >> 1; // 除以2，获取完全二叉树的父节点的索引
      if (this.comparator(this.data[index], this.data[parentIndex]) < 0) {
        this.swap(index, parentIndex);
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  bubbleDown(index) {
    const lastIndex = this.size() - 1;
    while (true) {
      const leftIndex = index * 2 + 1;
      const rightIndex = index * 2 + 2;
      let findIndex = index;
      if (
        leftIndex <= lastIndex &&
        this.comparator(this.data[leftIndex], this.data[findIndex]) < 0
      ) {
        findIndex = leftIndex;
      }
      if (
        rightIndex <= lastIndex &&
        this.comparator(this.data[rightIndex], this.data[findIndex]) < 0
      ) {
        findIndex = rightIndex;
      }
      if (index !== findIndex) {
        this.swap(index, findIndex);
        index = findIndex;
      } else {
        break;
      }
    }
  }

  // 交换data中两个下标的元素
  swap(index1, index2) {
    [this.data[index1], this.data[index2]] = [
      this.data[index2],
      this.data[index1],
    ];
  }

  size() {
    return this.data.length;
  }
}
```

使用：

```js
const heap = new KthLargest(3, nums);
```

算法思想：

- 新建一个空数组作为输出，data = []
- 堆化阶段：循环 data.push 数组元素，每次添加，堆尾元素向上与父节点冒泡交换。交换到根节点或元素大小合适为止。
- 取前 k 个值阶段：交换完毕后，若 data.size() > k，做一次自顶向下的轮询：pop 堆顶最大元素放在堆尾，重新堆化，直到 data.size === k
