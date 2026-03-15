import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "GitFame",
  description: "发现优质 GitHub 项目",
  appearance: false,
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
          text: '🤖 智能前沿 (AI & ML)',
          collapsed: false,
          items: [
            { text: 'AI 综合', link: '/?domain=AI%20%26%20ML&subCategory=AI%20%E7%BB%BC%E5%90%88' },
            { text: 'AI Agent', link: '/?domain=AI%20%26%20ML&subCategory=AI%20Agent' },
            { text: 'LLM 大模型', link: '/?domain=AI%20%26%20ML&subCategory=LLM%20%E5%A4%A7%E6%A8%A1%E5%9E%8B' },
            { text: 'RAG', link: '/?domain=AI%20%26%20ML&subCategory=RAG' }
          ]
        },
        {
          text: '🛠️ 开发利器 (DevTools)',
          collapsed: false,
          items: [
            { text: '开发工具', link: '/?domain=DevTools&subCategory=%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7' },
            { text: '安全工具', link: '/?domain=DevTools&subCategory=%E5%AE%89%E5%85%A8%E5%B7%A5%E5%85%B7' }
          ]
        },
        {
          text: '🌐 现代 Web (Web Stack)',
          collapsed: false,
          items: [
            { text: 'Web 开发', link: '/?domain=Web%20Stack&subCategory=Web%20%E5%BC%80%E5%8F%91' }
          ]
        },
        {
          text: '🏗️ 基础设施 (Infra)',
          collapsed: false,
          items: [
            { text: '数据存储', link: '/?domain=Infra&subCategory=%E6%95%B0%E6%8D%AE%E5%AD%98%E5%84%A' },
            { text: '基础设施', link: '/?domain=Infra&subCategory=%E5%9F%BA%E7%A1%A5%E8%AE%BE%E6%96%BE' }
          ]
        },
        {
          text: '🏠 自托管 (Self-Hosted)',
          collapsed: false,
          items: [
            { text: '自托管', link: '/?domain=Self-Hosted' }
          ]
        },
        {
          text: '📚 终身学习 (Resources)',
          collapsed: false,
          items: [
            { text: '综合资源', link: '/?domain=Resources&subCategory=%E7%BB%BC%E5%90%88%E8%B5%84%E6%BA%90' },
            { text: 'API 资源', link: '/?domain=Resources&subCategory=API%20%E8%B5%84%E6%BA%90' }
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
