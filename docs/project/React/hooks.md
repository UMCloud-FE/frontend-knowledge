---
title: React 常见 Hooks
order: 3

group:
  title: 框架
  order: 1
---

## useCallback

useCallback 将返回一个记忆化的回调函数，这个函数只有在依赖项改变时才会发生变化。这是对回调函数进行性能优化的一种方式，以确保子组件不会在父组件重新渲染时重复渲染。。使用方式：

```js
const cachedFn = useCallback(fn, dependencies);
```

### 使用

```js
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback(
    (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails,
      });
    },
    [productId, referrer],
  );
}
```

### 参数

- fn：想要缓存的函数
- 依赖项：缓存更新的条件

### 返回值

- 初始化时，返回缓存的原始函数
- 依赖项没有变化（Object.is 判断），返回上次缓存的函数，否则返回最新的函数

### 注意事项

- 组件文件修改后，缓存会失效
- 初始化后，suspends 加载前的组件，不会缓存函数

### Future

- 有望在虚拟列表实现滚动区域外的元素停止缓存

### 使用场景

#### 在组件 re-render 时跳过重渲染

官方案例：

```js
export default function ProductPage({ productId, referrer, theme }) {
  // ...
  // handleSubmit 是上面缓存的函数
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

当 theme 变化时，ShippingForm 会被重新渲染，页面会卡顿一下。接下来优化 ShippingForm。

> By default, when a component re-renders, React re-renders all of its children recursively. (还记得 commitWorker 把)

为了规避由 props 变化造成的不必要的渲染，可以使用 memo：

```js
const ShippingFormMemo = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

上面这种情况下，当 props 检测出变化前后一样时，被 memo 包裹的组件不做重新渲染。此时，useCallback 就能起到作用了。上面的例子，如果你不使用 useCallback，组件渲染前后，js 会创建两次 handleSubmit，他们在内存中地址不一样，自然是不同的数据，此时 memo 就失效了！

#### 在缓存中使用 state

```js
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback(
    (text) => {
      const newTodo = { id: nextId++, text };
      setTodos([...todos, newTodo]);
    },
    [todos],
  );
  // ...
}
```

设置 state 的语句可以写成下面形式：

```js
const handleAddTodo = useCallback((text) => {
  const newTodo = { id: nextId++, text };
  setTodos((todos) => [...todos, newTodo]);
}, []); // ✅ No need for the todos dependency
```

> 为什么这样可以，可以详见 useState

#### 防止 useEffect 过多触发

看下面聊天室的例子：

```js
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: roomId,
  };
}

useEffect(() => {
  const options = createOptions();
  const connection = createConnection();
  connection.connect();
  return () => connection.disconnect();
}, [createOptions]);
```

用 createOptions 会造成循环检测，导致一直调用 useEffect 的死循环。此时，可以将 createOptions 也缓存一下即可：

```js
const createOptions = useCallback(() => {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: roomId,
  };
}, [roomId]);
```

此时，既然有一个引用链，根源都依赖 roomId，所以可以合并，因此有更进一步的改进方案：

```js
useEffect(() => {
  function createOptions() {
    // ✅ No need for useCallback or function dependencies!
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId,
    };
  }

  const options = createOptions();
  const connection = createConnection();
  connection.connect();
  return () => connection.disconnect();
}, [roomId]); // ✅ Only changes when roomId changes
```

#### 自定义 hook 时使用

自定义 hook 时，推荐所有的函数缓存一下，以便于在外部使用时不留性能问题的坑，便于随时优化性能：

```js
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback(
    (url) => {
      dispatch({ type: 'navigate', url });
    },
    [dispatch],
  );

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

### QA

- 如何在循环列表里使用 useCallback

不可以直接使用，会破坏 hook 的链表结构。推荐的做法是将公共组件提取出来，在提取的公共组件中使用。
