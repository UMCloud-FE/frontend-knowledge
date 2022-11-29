## CSS 知识体系!

1. 取消当前设置的属性即是设置 unset 属性，例如：left: unset 就可以取消设置 left。<br /> 小问题：为什么 ant 的日期组件不会出现被覆盖的情况，但是公司日期组件会被遮覆盖掉？
2. 两个 link 标签，一个加载要 3 秒，一个加载要 1 秒，那么到页面显示总共需要多少秒？
3. 隐藏元素：transform: scale(0)，transform 属于复合层，改变 transform 或者 opacity，并不会导致重绘。
4. line-height 继承问题
   - 如果父元素的 line-height 是多少 px，那么子元素的 line-height 同父元素一样。
   - 父元素的 line-height 是个数字，比如 2，3 这种，那么子元素的 line-height 就等于 子元素的 font-size \* 父元素的 line-height
   - 父元素的 line-height 是个百分比，比如 80%，那么子元素的 line-height 等于父元素的 font-size \* 百分比。
