import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "GitFame",
  description: "发现优质 GitHub 项目",
  appearance: 'dark',
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['script', {}, `
!function(p){"use strict";!function(t){var s=window,e=document,i=p,c="".concat("https:"===e.location.protocol?"https://":"http://","sdk.51.la/js-sdk-pro.min.js"),n=e.createElement("script"),r=e.getElementsByTagName("script")[0];n.type="text/javascript",n.setAttribute("charset","UTF-8"),n.async=!0,n.src=c,n.id="LA_COLLECT",i.d=n;var o=function(){s.LA.ids.push(i)};s.LA?s.LA.ids&&o():(s.LA=p,s.LA.ids=[],o()),r.parentNode.insertBefore(n,r)}()}({id:"L893gOFc1OlkvuzB",ck:"L893gOFc1OlkvuzB"});
    `]
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '分类', link: '/categories' },
      { text: '成熟度', link: '/maturity' }
    ],
    sidebar: [
      {
        text: '🏠 导航',
        collapsed: false,
        items: [
          { text: '首页', link: '/' },
          { text: '分类', link: '/categories' },
          { text: '成熟度', link: '/maturity' }
        ]
      },
      {
        text: '🤖 智能前沿',
        collapsed: false,
        items: [
          { text: 'LLM 框架', link: '/#llm-框架' },
          { text: 'AI Agent', link: '/#ai-agent' },
          { text: '本地大模型', link: '/#本地大模型' },
          { text: '图像/视频生成', link: '/#图像视频生成' }
        ]
      },
      {
        text: '🛠️ 开发利器',
        collapsed: false,
        items: [
          { text: '终端增强', link: '/#终端增强' },
          { text: 'API 工具', link: '/#api-工具' },
          { text: 'IDE 插件', link: '/#ide-插件' },
          { text: '测试/调试', link: '/#测试调试' }
        ]
      },
      {
        text: '🌐 现代 Web',
        collapsed: false,
        items: [
          { text: '全栈框架', link: '/#全栈框架' },
          { text: 'UI 组件库', link: '/#ui-组件库' },
          { text: '低代码', link: '/#低代码' },
          { text: '动效/可视化', link: '/#动效可视化' }
        ]
      },
      {
        text: '🏗️ 基础设施',
        collapsed: false,
        items: [
          { text: '数据库', link: '/#数据库' },
          { text: '缓存', link: '/#缓存' },
          { text: '容器', link: '/#容器' },
          { text: '云原生', link: '/#云原生' }
        ]
      },
      {
        text: '🏠 自托管',
        collapsed: false,
        items: [
          { text: '云服务替代品', link: '/#云服务替代品' },
          { text: '家庭实验室', link: '/#家庭实验室' },
          { text: '私人影音', link: '/#私人影音' },
          { text: '自动化', link: '/#自动化' }
        ]
      },
      {
        text: '📚 终身学习',
        collapsed: false,
        items: [
          { text: '教程', link: '/#教程' },
          { text: '文档', link: '/#文档' },
          { text: '学习资源', link: '/#学习资源' },
          { text: 'API集合', link: '/#api集合' }
        ]
      }
    ]
  }
})
