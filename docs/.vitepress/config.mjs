import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "GitFame",
  description: "发现优质 GitHub 项目",
  appearance: 'dark',
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '分类', link: '/categories' },
      { text: '成熟度', link: '/maturity' }
    ],
    sidebar: {
      '/': [
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
            { text: 'AI & ML', link: '/?domain=AI%20%26%20ML' }
          ]
        },
        {
          text: '🛠️ 开发利器',
          collapsed: false,
          items: [
            { text: 'DevTools', link: '/?domain=DevTools' }
          ]
        },
        {
          text: '🌐 现代 Web',
          collapsed: false,
          items: [
            { text: 'Web Stack', link: '/?domain=Web%20Stack' }
          ]
        },
        {
          text: '🏗️ 基础设施',
          collapsed: false,
          items: [
            { text: 'Infra', link: '/?domain=Infra' }
          ]
        },
        {
          text: '🏠 自托管',
          collapsed: false,
          items: [
            { text: 'Self-Hosted', link: '/?domain=Self-Hosted' }
          ]
        },
        {
          text: '📚 终身学习',
          collapsed: false,
          items: [
            { text: 'Resources', link: '/?domain=Resources' }
          ]
        },
        {
          text: '⭐ 成熟度',
          collapsed: false,
          items: [
            { text: '🔥 潜力股', link: '/?maturity=trending' },
            { text: '🌟 镇馆之宝', link: '/?maturity=stable' },
            { text: '🛠️ 极客玩具', link: '/?maturity=geek' }
          ]
        }
      ]
    }
  }
})
