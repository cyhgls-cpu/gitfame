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
    sidebar: {
      '/categories': [
        {
          text: '🤖 智能前沿',
          collapsed: false,
          items: [
            { text: 'LLM 框架', link: '/categories#llm-gang-kuo-jia' },
            { text: 'AI Agent', link: '/categories#ai-agent' },
            { text: '本地大模型', link: '/categories#ben-di-da-mo-xing' },
            { text: '图像/视频生成', link: '/categories#tu-xiang-shi-pin-sheng-cheng' }
          ]
        },
        {
          text: '🛠️ 开发利器',
          collapsed: false,
          items: [
            { text: '终端增强', link: '/categories#zhong-duan-zeng-qiang' },
            { text: 'API 工具', link: '/categories#api-gong-ju' },
            { text: 'IDE 插件', link: '/categories#ide-cha-jian' },
            { text: '测试/调试', link: '/categories#ce-shi-tiao-shi' }
          ]
        },
        {
          text: '🌐 现代 Web',
          collapsed: false,
          items: [
            { text: '全栈框架', link: '/categories#quan-zhan-gang-jia' },
            { text: 'UI 组件库', link: '/categories#ui-zu-jian-ku' },
            { text: '低代码', link: '/categories#di-dai-ma' },
            { text: '动效/可视化', link: '/categories#dong-xiao-ke-shi-hua' }
          ]
        },
        {
          text: '🏗️ 基础设施',
          collapsed: false,
          items: [
            { text: '数据库', link: '/categories#shu-ju-ku' },
            { text: '缓存', link: '/categories#huan-cun' },
            { text: '容器', link: '/categories#rong-qi' },
            { text: '云原生', link: '/categories#yun-yuan-sheng' }
          ]
        },
        {
          text: '🏠 自托管',
          collapsed: false,
          items: [
            { text: '云服务替代品', link: '/categories#yun-fu-wu-ti-dai-pin' },
            { text: '家庭实验室', link: '/categories#jia-ting-shi-yan-shi' },
            { text: '私人影音', link: '/categories#si-ren-ying-yin' },
            { text: '自动化', link: '/categories#zi-dong-hua' }
          ]
        },
        {
          text: '📚 终身学习',
          collapsed: false,
          items: [
            { text: '教程', link: '/categories#jiao-cheng' },
            { text: '文档', link: '/categories#wen-dang' },
            { text: '学习资源', link: '/categories#xue-xi-zi-yuan' },
            { text: 'API 集合', link: '/categories#api-ji-he' }
          ]
        }
      ]
    }
  }
})
