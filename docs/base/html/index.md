# HTML

## DOM

文档对象模型 (DOM) 将 web 页面与到脚本或编程语言连接起来。通常是指 JavaScript，但将 HTML、SVG 或 XML 文档建模为对象并不是 JavaScript 语言的一部分。DOM 模型用一个逻辑树来表示一个文档，树的每个分支的终点都是一个节点(node)，每个节点都包含着对象(objects)。DOM 的方法(methods)让你可以用特定方式操作这个树，用这些方法你可以改变文档的结构、样式或者内容。节点可以关联上事件处理器，一旦某一事件被触发了，那些事件处理器就会被执行。

### 事件模型

- DOM0 级处理事件就是将一个函数赋值给一个事件处理属性。（行内属性事件）
- DOM2 级事件定义了 addEventListener 和 removeEventListener 两个方法
- DOM3 级事件是在 DOM2 级事件的基础上添加很多事件类型。
- UI 事件，当用户与页面上的元素交互时触发，如：load、scroll
- 焦点事件，当元素获得或失去焦点时触发，如：blur、focus
- 鼠标事件，当用户通过鼠标在页面执行操作时触发如：dbclick、mouseup
- 滚轮事件，当使用鼠标滚轮或类似设备时触发，如：mousewheel
- 文本事件，当在文档中输入文本时触发，如：textInput
- 键盘事件，当用户通过键盘在页面上执行操作时触发，如：keydown、keypress
- 合成事件，当为 IME（输入法编辑器）输入字符时触发，如：compositionstart
- 变动事件，当底层 DOM 结构发生变化时触发，如：DOMsubtreeModified
- 同时 DOM3 级事件也允许使用者自定义一些事件。

```js
<body>
<!--行内绑定：脚本模型-->
<button onclick="javascrpt:alert('Hello')">Hello1</button>
<!--内联模型-->
<button onclick="showHello()">Hello2</button>
<!--动态绑定-->
<button id="btn3">Hello3</button>
</body>
<script>
/*DOM0：同一个元素，同类事件只能添加一个，如果添加多个，
/* 后面添加的会覆盖之前添加的 */
function shoeHello() {
  alert("Hello");
}
var btn3 = document.getElementById("btn3");
btn3.onclick = function () {
  alert("Hello");
}
/*DOM2:可以给同一个元素添加多个同类事件*/
btn3.addEventListener("click",function () {
  alert("hello1");
});
btn3.addEventListener("click",function () {
  alert("hello2");
})
if (btn3.attachEvent){
    /*IE*/
    btn3.attachEvent("onclick",function () {
      alert("IE Hello1");
    })
    }else {
    /*W3C*/
    btn3.addEventListener("click",function () {
      alert("W3C Hello");
    })
}
</script>
```

- 事件冒泡：事件冒泡(event bubbling)，即事件开始时由最具体的元素(文档中嵌套层次最深的那个节点)接收，然后逐级向上传播到较为不具体的节点。事件捕获：冒泡的反动作

- 事件流事件流又称为事件传播，DOM2 级事件规定的事件流包括三个阶段：事件捕获阶段(capture phase)、处于目标阶段(target phase)和事件冒泡阶段(bubbling phase)。

- 触发顺序通常为

1. 进行事件捕获，为截获事件提供了机会
2. 实际的目标接收到事件
3. 冒泡阶段，可以在这个阶段对事件做出响应

- 事件委托

事件委托就是利用事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件. 在绑定大量事件的时候往往选择事件委托。

优点: 节省内存占用，减少事件注册新增子对象时无需再次对其绑定事件，适合动态添加元素局限性: focus、blur 之类的事件本身没有事件冒泡机制，所以无法委托 mousemove、mouseout 这样的事件，虽然有事件冒泡，但是只能不断通过位置去计算定位，对性能消耗高，不适合事件委托

```html
<ul id="parent">
  <li class="child">one</li>
  <li class="child">two</li>
  <li class="child">three</li>
  ...
</ul>

<script type="text/javascript">
  //父元素
  var dom = document.getElementById('parent');

  //父元素绑定事件，代理子元素的点击事件
  dom.onclick = function (event) {
    var event = event || window.event;
    var curTarget = event.target || event.srcElement;

    if (curTarget.tagName.toLowerCase() == 'li') {
      //事件处理
    }
  };
</script>
```

### DOM 变动事件

- DOMSubtreeModified：在 DOM 结构中发生任何变化时触发；
- DOMNodeInserted：在一个节点作为子节点被插入到另一个节点中时触发；
- DOMNodeRemoved：在节点从其父节点中被移除时触发；
- DOMNodeInsertedIntoDocument：在一个节点被直接插入文档中或者通过子树间接插入文档后触发。在 DOMNodeInserted 之后触发；
- DOMNodeRemovedFromDocument：在一个节点被直接从文档中删除或通过子树间接从文档中移除之前触发。在 DOMNodeRemoved 之后触发。
- DOMAttrModified：在特性被修改之后触发；
- DOMCharacterDataModified：在文本节点的值发生变化的时候触发。


## 语义化标签

HTML 标签语义化是让大家直观的认识标签(markup)和属性(attribute)的用途和作用；有利于 SEO；方便设备解析；符合 W3C 标准。

### 语义化块级元素

块级元素占据其父元素（容器）的整个空间，因此创建了一个“块”。

```html
<address>
<article>
<aside>
<audio>
<blockquote>
<canvas>
<dd>
<fieldset>
<form>
  <fieldset>
  <!-- 表单边框内嵌标题使用 -->
    <legend>健康信息</legend>
    身高：<input type="text" />
    体重：<input type="text" />
  </fieldset>
</form>
<figure>
<footer>
<form>
<h1>
<hgroup>
<hr>
<pre>
<p>
<table>
<tfoot>
<ul>
<video>
```

### 语义化行内元素

1. b（废弃）：不要将\<b>元素与 \<strong>、\<em>或\<mark>元素混淆。 \<strong>元素表示某些重要性的文本，\<em>强调文本，而\<mark>元素表示某些相关性的文本。 \<b>元素不传达这样的特殊语义信息；仅在没有其他合适的元素时使用它。
2. i：用于表现因某些原因需要区分普通文本的一系列文本。例如技术术语、外文短语或是小说中人物的思想活动等，它的内容通常以斜体显示。
3. small：使文本的字体变小一号
4. abbr：用于代表缩写，并且可以通过可选的 title 属性提供完整的描述
5. cite：表示一个作品的引用
6. code：呈现一段计算机代码. 默认情况下, 它以浏览器的默认等宽字体显示
7. dfn：表示术语的一个定义
8. em：标记出需要用户着重阅读的内容，\<em> 元素是可以嵌套的，嵌套层次越深，则其包含的内容被认定为越需要着重阅读。
9. kbd：用于表示用户输入，它将产生一个行内元素，以浏览器的默认 monospace 字体显示。显示的是一个键盘符号示意图。
10. strong：表示文本十分重要，一般用粗体显示。
11. samp:用于标识计算机程序输出，通常使用浏览器缺省的 monotype 字体
12. var：数学表达式或编程上下文中的变量名称
13. a
14. bdo：改写了文本的方向性
15. br
16. img

17. map：与 \<area> 属性一起使用来定义一个图像映射(一个可点击的链接区域).

```html
<map name="example-map-1">
  <area shape="circle" coords="200,250,25" href="another.htm" />
  <area shape="default" />
</map>
```

18. object：称作 HTML 嵌入对象元素）表示引入一个外部资源，这个资源可能是一张图片，一个嵌入的浏览上下文，亦或是一个插件所使用的资源。
19. q：表示一个封闭的并且是短的行内引用的文本
20. script
21. defer：浏览器指示脚本在文档被解析后执行，script 被异步加载后并不会立刻执行，而是等待文档被解析完毕后执行。 async：同样是异步加载脚本，区别是脚本加载完毕后立即执行，这导致 async 属性下的脚本是乱序的，对于 script 有先后依赖关系的情况，并不适用。
22. span
23. sub：定义了一个文本区域，出于排版的原因，与主要的文本相比，应该展示得更低并且更小。即文字下沉
24. sup：同上，文字上浮
25. button
26. input
27. label
28. select：表示一个提供选项菜单的控件

```html
<select name="pets" id="pet-select">
  <option value="">--Please choose an option--</option>
  <option value="dog">Dog</option>
  <option value="cat">Cat</option>
  <option value="hamster">Hamster</option>
  <option value="parrot">Parrot</option>
  <option value="spider">Spider</option>
  <option value="goldfish">Goldfish</option>
</select>
```

29. textarea
30. picture 可以根据不同的设备匹配不同的媒体资源

```html
<picture>
  <source srcset="/media/examples/surfer-240-200.jpg" media="(min-width: 800px)" />
  <img src="/media/examples/painted-hand-298-332.jpg" />
</picture>
```
