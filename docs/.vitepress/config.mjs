import { defineConfig } from 'vitepress'

const getSidebar = (path) => {
  if (path.startsWith('/categories')) {
    return [
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
          { text: 'LLM 框架', link: '/categories?domain=AI%20%26%20ML&subCategory=LLM%20%E6%A1%86%E6%9E%B6' },
          { text: 'AI Agent', link: '/categories?domain=AI%20%26%20ML&subCategory=AI%20Agent' },
          { text: '本地大模型', link: '/categories?domain=AI%20%26%20ML&subCategory=%E6%9C%AC%E5%9C%B0%E5%A4%A7%E6%A8%A1%E5%9E%8B' },
          { text: '图像/视频生成', link: '/categories?domain=AI%20%26%20ML&subCategory=%E5%9B%BE%E5%83%8F/%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90' }
        ]
      },
      {
        text: '🛠️ 开发利器',
        collapsed: false,
        items: [
          { text: '终端增强', link: '/categories?domain=DevTools&subCategory=%E7%BB%88%E7%AB%AF%E5%A2%9E%E5%8C%96' },
          { text: 'API 工具', link: '/categories?domain=DevTools&subCategory=API%20%E5%B7%A5%E5%85%B7' },
          { text: 'IDE 插件', link: '/categories?domain=DevTools&subCategory=IDE%20%E6%8F%92%E4%BB%B6' },
          { text: '测试/调试', link: '/categories?domain=DevTools&subCategory=%E6%B5%8B%E8%AF%95/%E8%B0%83%E8%AF%95' }
        ]
      },
      {
        text: '🌐 现代 Web',
        collapsed: false,
        items: [
          { text: '全栈框架', link: '/categories?domain=Web%20Stack&subCategory=%E5%85%A8%E6%A0%88%E6%A1%86%E6%9E%B6' },
          { text: 'UI 组件库', link: '/categories?domain=Web%20Stack&subCategory=UI%20%E7%BB%84%E4%BB%B6%E5%BA%93' },
          { text: '低代码', link: '/categories?domain=Web%20Stack&subCategory=%E4%BD%8E%E4%BB%A3%E7%A0%81' },
          { text: '动效/可视化', link: '/categories?domain=Web%20Stack&subCategory=%E5%8A%A8%E6%95%88/%E5%8F%AF%E8%A7%86%E5%8C%96' }
        ]
      },
      {
        text: '🏗️ 基础设施',
        collapsed: false,
        items: [
          { text: '数据库', link: '/categories?domain=Infra&subCategory=%E6%95%B0%E6%8D%AE%E5%BA%93' },
          { text: '缓存', link: '/categories?domain=Infra&subCategory=%E7%BC%93%E5%AD%98' },
          { text: '容器', link: '/categories?domain=Infra&subCategory=%E5%AE%B9%E5%99%A8' },
          { text: '云原生', link: '/categories?domain=Infra&subCategory=%E4%BA%91%E5%8E%9F%E7%94%9F' }
        ]
      },
      {
        text: '🏠 自托管',
        collapsed: false,
        items: [
          { text: '云服务替代品', link: '/categories?domain=Self-Hosted&subCategory=%E4%BA%91%E6%9C%8D%E5%8A%A1%E6%9B%BF%E4%BB%A3%E5%93%81' },
          { text: '家庭实验室', link: '/categories?domain=Self-Hosted&subCategory=%E5%AE%B6%E5%BA%AD%E5%AE%9E%E9%AA%8C%E5%AE%A4' },
          { text: '私人影音', link: '/categories?domain=Self-Hosted&subCategory=%E7%A7%81%E4%BA%BA%E5%BD%B1%E9%9F%B3' },
          { text: '自动化', link: '/categories?domain=Self-Hosted&subCategory=%E8%87%AA%E5%8A%A8%E5%8C%96' }
        ]
      },
      {
        text: '📚 终身学习',
        collapsed: false,
        items: [
          { text: '教程', link: '/categories?domain=Resources&subCategory=%E6%95%99%E7%A8%8B' },
          { text: '文档', link: '/categories?domain=Resources&subCategory=%E6%96%87%E6%A1%A3' },
          { text: '学习资源', link: '/categories?domain=Resources&subCategory=%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%BA%90' },
          { text: 'API集合', link: '/categories?domain=Resources&subCategory=API%E9%9B%86%E5%90%88' }
        ]
      }
    ]
  }
  
  if (path.startsWith('/maturity')) {
    return [
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
        text: '🔥 潜力股',
        collapsed: false,
        items: [
          { text: '全部', link: '/maturity?maturity=trending' },
          { text: 'AI & ML', link: '/maturity?maturity=trending&domain=AI%20%26%20ML' },
          { text: 'DevTools', link: '/maturity?maturity=trending&domain=DevTools' },
          { text: 'Web Stack', link: '/maturity?maturity=trending&domain=Web%20Stack' }
        ]
      },
      {
        text: '🌟 镇馆之宝',
        collapsed: false,
        items: [
          { text: '全部', link: '/maturity?maturity=stable' },
          { text: 'AI & ML', link: '/maturity?maturity=stable&domain=AI%20%26%20ML' },
          { text: 'DevTools', link: '/maturity?maturity=stable&domain=DevTools' },
          { text: 'Web Stack', link: '/maturity?maturity=stable&domain=Web%20Stack' }
        ]
      },
      {
        text: '🛠️ 极客玩具',
        collapsed: false,
        items: [
          { text: '全部', link: '/maturity?maturity=geek' },
          { text: 'AI & ML', link: '/maturity?maturity=geek&domain=AI%20%26%20ML' },
          { text: 'DevTools', link: '/maturity?maturity=geek&domain=DevTools' },
          { text: 'Web Stack', link: '/maturity?maturity=geek&domain=Web%20Stack' }
        ]
      }
    ]
  }
  
  return [
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
      '/': getSidebar('/'),
      '/categories': getSidebar('/categories'),
      '/maturity': getSidebar('/maturity')
    }
  }
})
