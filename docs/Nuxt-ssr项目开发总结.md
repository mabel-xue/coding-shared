## 项目背景

该项目是公司针对SEO制定的新版官网开发需求，通过服务端渲染(SSR)实现，技术栈为Nuxt(基于Vue)，UI框架为Bulma，部署方式为静态部署。

## 性能 & SEO优化

### image lazy-loading

关于图片懒加载，可以使用原生属性loading="lazy"，详情可以通过阅读此文了解
💬[博文参考](https://addyosmani.com/blog/lazy-loading/)；如果对图片懒加载有其他需求，比如设置默认

### 插件的按需加载

在使用插件前应先考虑插件的使用范围，选择全局引入还是局部引入。

开发实例：在项目前期引入了高德地图插件amap，在“关于我们”一页中使用，由于一开始是全局引用，导致页面初始化的时候就加载了大量的css和脚本文件，造成首页加载时负重增多，影响页面性能。后通过删除全局引用，改在about.vue的created中引入插件以优化。

### 网站性能测评工具-Lighthouse(chorme插件)

```Lighthouse```是一个Google开源的自动化工具，主要用于改进网络应用（移动端）的质量。目前测试项包括```页面性能```、```PWA```、```可访问性（无障碍）```、```最佳实践```、```SEO```。Lighthouse会对各个测试项的结果打分，并给出优化建议，这些打分标准和优化建议可以视为Google的网页最佳实践。

**常用最佳实践**

- 打开外部链接使用rel="noopener"
- 避免长宽比不正确的图像
- 每个图像都有一个alt属性
- 配置HTML的Viewport meta标签
- 压缩图片（仅针对JPEG）
- 允许用户粘贴到密码字段中
- 避免DOM过大
- 页面应该给元素适当的角色role="navigation" role="main" role="contentinfo"等
- ...

💬[官方-Lighthouse Scoring Guide](https://developers.google.com/web/tools/lighthouse/v3/scoring#perf-consistency)

### 针对Lighthouse-Accessibility的优化工具-axe(chrome插件)

axe是一个在开发阶段可以扫描页面并给出Accessibility优化建议的工具，使用方便，比Lighthouse列出的可优化项更详细。

[官网](https://www.deque.com/axe/)

### meta信息

完善页面的meta信息对SEO有重要作用，在官网项目的配置文件中，我们添加了如下meta：

```js
import pkg from './package'

meta: [{
      charset: 'utf-8'
    }, {
      name: 'keywords', // 网页关键词
      content: pkg
        .keywords
        .join('，')
    }, {
      hid: 'description',
      name: 'description',
      content: pkg.description
    }, {
      property: 'og:type', // og - The Open Graph protocol，一种社交协议，利于社交网站分享
      content: 'site'
    }, {
      hid: 'og-title',
      property: 'og:title',
      content: pkg.title
    }, {
      property: 'og:url',
      content: pkg.url
    }, {
      property: 'og:image',
      content: 'https://www.bigtreefinance.com/icon.png'
    }, {
      property: 'og:site_name',
      content: pkg.title
    }, {
      hid: 'og-description',
      property: 'og:description',
      content: pkg.description
    }, {
      name: 'renderer',
      content: 'webkit'
    }, {
      name: 'force-rendering',
      content: 'webkit'
    }, {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=5'
    }],
    ```

以及分享时相关配图的设置：

```js
link: [{
  rel: 'icon',
  type: 'image/x-icon',
  href: '/icon.png'
}, {
  rel: 'icon',
  type: 'image/png',
  href: '/icon.png'
}]
```

另外，在各个页面，都应该分别设置不同的meta-title及description信息，对此Nuxt有良好支持。

## 注意事项/问题/坑 & 解决

### 国际化

初始化项目后，考虑是否有国际化需求或可能，Nuxt有较完善的i18n支持，在初始化时就考虑到国际化可以免去后续开发时从非国际化转为国际化的繁琐的重构工作。

### 部署后网站图片无法正常加载

在确认服务端正常部署后，用```ls -l```命令行查看未加载的图片/文件的权限是否正常开启，读写权限不完整的文件无法在服务端加载。

💬[参考-mac 查看、修改文件权限的命令](https://www.jianshu.com/p/d5f9672f94ef)

### background-image切换时出现闪动

改用精灵图，通过background-position定位切换图片

### 跨页面锚点定位不生效

**🤔 原因**

**解决**

- 方法① 在有hash的页面添加代码：

```js
methods: {
  goAnchor(selector) {
    let anchor = this.$el.querySelector(selector)
    anchor.scrollIntoView()
  }
},
mounted() {
  if (window.location.hash) {
    this.goAnchor(window.location.hash)
  }
}
```

- 方法② NuxtLink不支持带hash的跳转，要改成a链接

### 关于Nuxt异步数据请求在客户端运行的问题

背景：官网项目的新闻数据是通过异步获取，在开发前期我把各个请求写在了对应页面的asyncData方法中，在静态部署后未发现异常。但当新闻后台新增数据后，如果请求的最新数据和部署时数据不一致，会导致在初次访问页面或内部路由跳转时请求到新数据，但在刷新页面后，页面显示的数据为部署时的静态数据，导致数据丢失。

#### 原因

asyncData方法会在页面渲染组件之前异步获取数据，它可以在服务端或路由更新之前被调用，所以页面刷新时不会执行该方法，而且通过获取服务端数据，所以会出现数据丢失的现象；

#### 解决

① 在store目录下新建index.js，在```nuxtServerInit```方法中获取新闻数据并存储在store中：
* nuxtServerInit方法会在将我们从服务器获取到的数据填充到状态树 (store) 上。

```js
import NewsService from '~/assets/news-service'

export const state = () => ({
  posts: [],
  total: 0
});

export const mutations = {
  SET_POSTS(state, data) {
    state.posts = data;
  },
  SET_TOTAL(state, data) {
    state.total = data;
  },
};

export const actions = {
  nuxtServerInit({
    commit
  }) {
    return NewsService.getAllNews().then(res => {
      commit('SET_POSTS', res.data.posts)
      commit('SET_TOTAL', res.data.meta.pagination.total)
    })
  }
};
```

② 在需要新闻数据的页面使用store获得数据

```js
index.vue

async asyncData({ store }) {
  return { news: store.state.posts }
},

...
...
...
```

通过以上解决方法，再次进入客户端时不会在前端请求数据，后台更新数据后不影响现有页面展示，当再次generate并部署后会获得最新数据。如果想要即时获得最新数据，可以将内部路由Nuxt-Link跳转改为a链接跳转，由于官网项目为SPA模式，故没有考虑该解决方式。

### 运行generate时部分页面生成失败

```pages```目录下仅放和路由一一对应的页面，如果一个页面包含多个组件，组件尽量放在```components```中，避免```generate```时报错

### 兼容性问题：firefox-无法载入此图像

原因：由于火狐的安全性策略，当页面内引入安全证书过期的网站图片时，图片无法正常载入。

解决：由运维人员配合解决。

