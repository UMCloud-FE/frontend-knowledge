# CSS 知识体系!

1. 取消当前设置的属性即是设置 unset 属性，例如：left: unset 就可以取消设置 left。<br /> 小问题：为什么 ant 的日期组件不会出现被覆盖的情况，但是公司日期组件会被遮覆盖掉？
2. 两个 link 标签，一个加载要 3 秒，一个加载要 1 秒，那么到页面显示总共需要多少秒？
3. 隐藏元素：transform: scale(0)，transform 属于复合层，改变 transform 或者 opacity，并不会导致重绘。
4. line-height 继承问题
   - 如果父元素的 line-height 是多少 px，那么子元素的 line-height 同父元素一样。
   - 父元素的 line-height 是个数字，比如 2，3 这种，那么子元素的 line-height 就等于 子元素的 font-size \* 父元素的 line-height
   - 父元素的 line-height 是个百分比，比如 80%，那么子元素的 line-height 等于父元素的 font-size \* 百分比。
5. backgroundSize
   - contain：图片放到背景区域的最小边为止，当背景区域与背景图片宽高比不一致的情况下，背景区域可能会在长边下有空白覆盖不全
   - cover：图片放大至能满足最大边时为止，当背景区域与背景图片的宽高比不一致时，背景图片会在短边下有裁切，显示不全
   - 百分比：第一个是宽度，第二个是高度，如果只设置了一个值，那么第二个值会默认设置成 auto
6. position: sticky
   - 是 position: relative 和 position: fixed 的结合体
   - 当元素在屏幕内的时候，表现的是 position: relative
   - 当滚出显示器屏幕的时候，表现的是 fixed
   - position:sticky 要想生效，top 属性或则 left 属性（看滚动方向）是必须要有明确的计算值的，否则 fixed 的表现不会出现。
