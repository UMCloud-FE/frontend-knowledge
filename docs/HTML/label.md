---
order: 0
---

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
