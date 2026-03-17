import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'GitFame',
  description: '发现优质 GitHub 项目',
  lang: 'zh-CN',
  base: '/',
  appearance: 'dark',
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'GitFame',
    nav: [
      {
        text: '首页',
        link: '/'
      },
      {
        text: '分类',
        link: '/categories'
      },
      {
        text: 'GitHub',
        link: 'https://github.com/cyhgls-cpu/gitfame'
      }
    ],
    search: {
      provider: 'local'
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/cyhgls-cpu/gitfame'
      }
    ],
    footer: {
      message: '使用 VitePress 构建',
      copyright: '© 2026 GitFame. 保留所有权利。'
    }
  }
})
