---
title: 滑动窗口
order: 3

group:
  title: 算法
  order: 0
---

## 一、定义

### 1. 滑动

当前窗口是可移动的，并且移动是按一定的方向的

### 2. 窗口

窗口大小分为固定和不固定，可以不断扩大，也可以不断缩小，直到找到一个满足条件的最小窗口

### 3. 作用范围

主要应用于数组和字符串中

### 4. 作用

降低时间复杂度

## 二、实现思路

主要是借助双指针技巧

## 三、主要解决什么问题

1. 字符串问题，比如最小无重复子串
2. 数组问题，比如长度最小的子数组

## 四、具体例子

### 1. 寻找固定区间内的最大值

```js
const arr = [10, 20, 30, 5];
function getMaxSum(arr, k) {
  let maxSum = 0;
  for (let i = 0; i < k; i++) {
    maxSum += arr[i];
  }
  sum = maxSum;
  for (let i = k; i < arr.length; i++) {
    sum = sum + arr[i] - arr[i - k];
    maxSum = Math.max(sum, maxSum);
  }
  return maxSum;
}
```

### 2. 寻找字符串中的最长无重复子串

```js
function lengthOfLongestSubstring(s) {
  const occ = new Set();
  const n = s.length;
  let rk = -1,
    ans = 0;
  for (let i = 0; i < n; i++) {
    if (i !== 0) {
      occ.delete(s.charAt(i - 1));
    }
    while (rk + 1 < n && !occ.has(s.charAt(rk + 1))) {
      occ.add(s.charAt(rk + 1));
      ++rk;
    }
    ans = Math.max(ans, rk - i + 1);
  }
}
let val = lengthOfLongestSubstring('abcabca');
```

### 3. 最小覆盖子串

```js
function minWindow(s, t) {
  let l = 0,
    r = 0;
  const need = new Map();
  for (let c of t) {
    need.set(c, need.has(c) ? need.get(c) + 1 : 1);
  }
  let needType = need.size,
    res = '';
  while (r < s.length) {
    const c = s[r];
    if (need.has(c)) {
      need.set(c, need.get(c) - 1);
      if (need.get(c) === 0) needType -= 1;
    }
    while (needType === 0) {
      const newRes = s.substring(l, r + 1);
      if (!res || newRes.length < res.length) res = newRes;
      const c2 = s[l];
      if (need.has(c2)) {
        need.set(c2, need.get(c2) + 1);
        if (need.get(c2) === 1) needType += 1;
      }
      l += 1;
    }
    r += 1;
  }
  return res;
}
minWindow('ADOBECODEBANC', 'ABC');
```

### 4. 长度最小的子数组

```js
function minSubArrayLength(s, nums) {
  let left = 0,
    sum = 0,
    result = Number.MAX_VALUE;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= s) {
      console.log('sum', sum);
      result = Math.min(result, right - left + 1);
      sum -= nums[left++];
    }
  }
  return result === Number.MAX_VALUE ? 0 : result;
}
```
