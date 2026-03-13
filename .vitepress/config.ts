import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Gitfame',
  description: 'Gitfame 项目文档',
  lang: 'zh-CN',
  base: '/',
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Gitfame',
    nav: [
      {
        text: '首页',
        link: '/'
      },
      {
        text: '分类',
        link: '/categories.vue'
      },
      {
        text: '成熟度',
        link: '/maturity'
      },
      {
        text: '指南',
        link: '/guide/'
      },
      {
        text: 'API',
        link: '/api/'
      },
      {
        text: '示例',
        link: '/examples/'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API',
          items: [
            { text: '核心 API', link: '/api/core' },
            { text: '插件 API', link: '/api/plugins' }
          ]
        }
      ],
      '/examples/': [
        {
          text: '示例',
          items: [
            { text: '基本使用', link: '/examples/basic' },
            { text: '高级用法', link: '/examples/advanced' }
          ]
        }
      ]
    },
    search: {
      provider: 'local'
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/gitfame/gitfame'
      }
    ],
    footer: {
      message: '使用 VitePress 构建',
      copyright: '© 2026 GitFame. 保留所有权利。'
    }
  }
})