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

- 用 ```NuxtLink``` 替代 ```a```
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
