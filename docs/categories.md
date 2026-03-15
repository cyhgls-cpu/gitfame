---
layout: page
title: 项目分类
---

<script setup>
import { ref, onMounted, computed } from 'vue'

const projects = ref([])
const loading = ref(true)

const domainMap = {
  'AI & ML': { name: '智能前沿', icon: '🤖', desc: 'LLM 框架、AI Agent、本地大模型、图像/视频生成' },
  'DevTools': { name: '开发利器', icon: '🛠️', desc: '终端增强、API 工具、高效 IDE 插件、测试/调试' },
  'Web Stack': { name: '现代 Web', icon: '🌐', desc: '全栈框架、UI 组件库、低代码、动效/可视化' },
  'Infra': { name: '基础设施', icon: '🏗️', desc: '数据库、缓存、容器、云原生' },
  'Self-Hosted': { name: '自托管', icon: '🏠', desc: '云服务替代品、家庭实验室、私人影音、自动化' },
  'Resources': { name: '终身学习', icon: '📚', desc: '教程、文档、学习资源、API集合' }
}

const maturityMap = {
  'trending': '🔥',
  'stable': '🌟',
  'geek': '🛠️'
}

onMounted(async () => {
  try {
    const response = await fetch('/data/projects.json')
    projects.value = await response.json()
  } catch (e) {
    console.error('Failed to load projects:', e)
  } finally {
    loading.value = false
  }
})

function getProjectsByDomain(domain) {
  return projects.value.filter(p => p.domain === domain).slice(0, 20)
}

function formatNumber(num) {
  if (!num) return '0'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num
}
</script>

# 项目分类

<div v-if="loading">加载中...</div>

<div v-if="!loading">

<div v-for="(info, domain) in domainMap" :key="domain" style="margin-bottom: 2rem;">

## {{ info.icon }} {{ info.name }} ({{ domain }})

{{ info.desc }}

<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 8px; margin-top: 12px;">
<a v-for="p in getProjectsByDomain(domain)" 
   :href="p.link" 
   style="display: block; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; transition: all 0.2s;"
   class="category-card">
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <span style="font-weight: 600; color: #1f2937;">{{ p.name }}</span>
    <span v-if="p.maturity" style="font-size: 12px;">{{ maturityMap[p.maturity] }}</span>
  </div>
  <div v-if="p.description" style="font-size: 12px; color: #6b7280; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
    {{ p.description }}
  </div>
  <div v-if="p.github" style="margin-top: 8px;">
    <img :src="'https://img.shields.io/github/stars/' + p.github + '?style=flat&color=yellow'" alt="stars" style="height: 18px;" />
  </div>
</a>
</div>

</div>

---

## 成熟度说明

| 标签 | 说明 |
|------|------|
| 🔥 潜力股 | 近期热门，增长迅速的项目 |
| 🌟 镇馆之宝 | 稳定可靠，社区认可的项目 |
| 🛠️ 极客玩具 | 小众有趣，适合折腾的项目 |

---

## 项目提交

欢迎提交优质项目！请提交 GitHub Issue：
[提交项目](https://github.com/cyhgls-cpu/gitfame/issues/new)

</div>

<style>
.category-card:hover {
  border-color: #3b82f6 !important;
  background: #f9fafb;
}
</style>