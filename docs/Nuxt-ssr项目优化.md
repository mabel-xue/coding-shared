# Nuxt-SSR应用优化

- 用link添加分享时图文

```js
nuxt.config.js

head: {
  link: [{
    rel: 'icon',
    type: 'image/png',
    href: '/favicon.png'
  }]
}
```

<!-- - 用 ```NuxtLink``` 替代 ```a```，有hash值除外 -->
- 添加img-alt属性
- 图片懒加载
  
使用```vue-lazyload```，遇到一未知问题：在官网项目开发时，刷新页面，首屏展示图片会先展示alt无图状态，故将首屏图片的懒加载取消已解决。

💬[Github](https://github.com/hilongjw/vue-lazyload)

- 如果全局引入第三方插件，检查是否按需加载

**场景**
在官网项目中，全局引入amap，导致页面刚加载时，就引入了amap的样式文件
**解决**
放入具体页面引用，取消全局引用

- chrome-debug的disabled javascript

**场景**
在新官网项目中，新闻分页按钮的逻辑用js写，导致禁用js时，新闻分页不起作用
**解决**
添加一层分页路由```/news/list/:id```，页码能直接跳转到对应路由，这样做的好处是让SEO更加友好

💬[代码详情](https://gitlab.bigtree.com/fe/official/bigtreefinance-www/commit/bfee875c52258595b667fcf3c22ad7784a100928)

- 不用过渡依赖css框架

在自适应过程中，注意图像的原比例显示，尤其是作为背景图时，框架的自适应并不能良好展现图片。因此需要利用media对不同尺寸进行调试。

- ie、火狐兼容性问题的自测

如：ie对css的支持问题 和 火狐的安全策略问题
