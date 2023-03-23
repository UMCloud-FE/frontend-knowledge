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

## [useMemo](https://beta.reactjs.org/reference/react/useMemo)

useMemo 与 useCallback 的原理类似。它是用来缓存计算结果的，类似于 vue 的计算属性。

定义：

```js
const cachedValue = useMemo(calculateValue, dependencies);
```

### 使用

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

### 参数

- fn：用户返回想要缓存的数值，可以传递参数
- 依赖项：缓存更新的条件

### 响应式返回值

- 初始化时，返回一次 fn 的返回值
- 依赖项没有变化（Object.is 判断），返回上次缓存的值，否则返回最新的计算值，并再次缓存

### 注意事项

- 只能在函数式组件顶部使用
- 在严格模式下，React 会调用计算函数两次，以帮助您查找意外杂质。这只是**开发行为**，不影响生产。如果您的计算函数是纯的，这不会影响组件的逻辑。其中一个调用的结果将被忽略。
- 缓存被丢弃的情况：在开发中，当编辑组件文件时，React 会丢弃缓存。在开发和生产环境中，在 suspends 加载前的组件，不会缓存函数，React 将丢弃缓存。

### Future

- 未来期望添加对虚拟化列表的内置支持。此时会自动丢弃不在可视窗口内的列表缓存。

### 使用场景

#### 跳过没必要的值重计算

这个是最常用的使用场景，在依赖没有变化时，使用缓存值，而不用重新计算：

```js
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

这里的计算函数，可简单可复杂。如果计算函数很简单，那么不缓存不是问题，因为计算会很快。然而，如果要过滤或转换大型数组或者复杂的数据结构时，或进行一些耗时的计算（`console.time`来测试）时，缓存就很有必要了。

#### 跳过没必要的组件重渲染

还以上面的待办列表的例子：

```js
export default function TodoList({ todos, tab, theme }) {
  // Every time the theme changes, this will be a different array...
  const visibleTodos = filterTodos(todos, tab);

  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

上面的代码，基于 React 的渲染原理，当一个组件重渲染，其子组件会全部重渲染。所以 theme 变化后，List 组件就会被重渲染。我们使用 memo 检测 props 变化：

```js
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

但还是之前的问题，props 传入的对象也应该缓存。每次 TodoList 重渲染，visibleTodos 列表是一个不同的值了，所以，List 的 memo 会失效。因为 visibleTodos 不是函数，我们不用 useCallback，我们使用 useMemo：

```js
const visibleTodos = useMemo(
  () => filterTodos(todos, tab),
  [todos, tab], // ...so as long as these dependencies don't change...
);
```

#### 缓存一个 hook 的依赖关系

假设有个在组件内部新创建的对象：

```js
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Caution: Dependency on an object created in the component body
  // ...
}
```

上面例子中，searchOptions 就是一个新的对象，每次渲染组件都会创建一个新的。这就又会造成 下边 useMemo 失效，我们可以这样：

```js
const searchOptions = useMemo(() => {
  return { matchMode: 'whole-word', text };
}, [text]); // ✅ Only changes when text changes
```

当然，也可以两个 useMemo 合并一个：

```js
const visibleItems = useMemo(() => {
  const searchOptions = { matchMode: 'whole-word', text };
  return searchItems(allItems, searchOptions);
}, [allItems, text]); // ✅ Only changes when allItems or text changes
```

#### 缓存函数

举一个表单提交的例子：

```js
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

handleSubmit 每次重渲染都会创建一个新的对象，导致 Form 子组件也重渲染了。除了使用 useCallback，还可以使用 useMemo：

```js
const handleSubmit = useMemo(() => {
  return (orderDetails) => {
    post('/product/' + product.id + '/buy', {
      referrer,
      orderDetails,
    });
  };
}, [productId, referrer]);
```

只需要让 useMemo 的 fn 返回一个函数就行了。官方建议，缓存函数使用 useCallback，这样会避免多写一个包裹函数而造成代码可读性下降。

### QA

- **为什么我的计算值每次渲染都执行两次**

因为，在严格模式下，React 将调用某些函数两次而不是一次。而且这只停留在开发模式下，只要你的组件和计算函数是纯的，这就不会影响逻辑。但是为了让代码更健壮，下面的代码就是可改进的：

```js
const visibleTodos = useMemo(() => {
  // 🚩 Mistake: mutating a prop
  todos.push({ id: 'last', text: 'Go for a walk!' });
  const filtered = filterTodos(todos, tab);
  return filtered;
}, [todos, tab]);
```

todos 作为依赖项 会被 push 两次，我们可以这样写：

```js
const visibleTodos = useMemo(() => {
  const filtered = filterTodos(todos, tab);
  // ✅ Correct: mutating an object you created during the calculation
  filtered.push({ id: 'last', text: 'Go for a walk!' });
  return filtered;
}, [todos, tab]);
```

这样就保证了 useMemo 依赖的一致性。即使调用了两次，那个对象也不会被 push 两个相同的对象。

- **为什么我的 useMemo 返回了 undefined**

错误代码示例：

```js
// 🔴 You can't return an object from an arrow function with () => {
const searchOptions = useMemo(() => {
  matchMode: 'whole-word',
  text: text
}, [text]);
```

原因：没有写返回值。你应该把想要的对象 return 返回出去。可能对箭头函数的使用还不太熟悉。

- **如何在循环列表里使用 useMemo**

不可以直接使用，会破坏 hook 的链表结构。推荐的做法是将公共组件提取出来，在提取的公共组件中使用。
