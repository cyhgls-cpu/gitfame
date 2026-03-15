---
layout: page
title: 成熟度视图
---

<script setup>
import { ref, onMounted } from 'vue'

const projects = ref([])
const loading = ref(true)

const categoryData = {
  'AI & ML': { name: '智能前沿', icon: '🤖' },
  'DevTools': { name: '开发利器', icon: '🛠️' },
  'Web Stack': { name: '现代 Web', icon: '🌐' },
  'Infra': { name: '基础设施', icon: '🏗️' },
  'Self-Hosted': { name: '自托管', icon: '🏠' },
  'Resources': { name: '终身学习', icon: '📚' }
}

const maturityData = {
  'trending': {
    label: '🔥',
    color: '#667eea',
    desc: '快速发展，功能创新，活跃的开发活动，良好的发展前景'
  },
  'stable': {
    label: '🌟',
    color: '#f093fb',
    desc: '稳定可靠，经过长期验证，活跃的社区支持，完善的文档和测试'
  },
  'geek': {
    label: '🛠️',
    color: '#4facfe',
    desc: '轻量级，专注于特定功能，适合技术爱好者尝试，可能是实验性项目'
  }
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

function getProjectsByMaturity(maturity) {
  return projects.value.filter(p => p.maturity === maturity).slice(0, 30)
}

function getProjectsByMaturityAndDomain(maturity, domain) {
  return projects.value.filter(p => p.maturity === maturity && p.domain === domain).slice(0, 20)
}
</script>

# 成熟度视图

<div v-if="loading" style="text-align: center; padding: 2rem;">加载中...</div>

<div v-if="!loading">

<div v-for="(maturityInfo, maturity) in maturityData" :key="maturity" :id="maturity" style="margin-bottom: 3rem; scroll-margin-top: 80px;">

## {{ maturityInfo.label }} {{ maturity }}

{{ maturityInfo.desc }}

<div v-for="(cat, domain) in categoryData" :key="domain" style="margin-top: 1.5rem; margin-left: 1rem;">

### {{ cat.icon }} {{ cat.name }}

<div v-if="getProjectsByMaturityAndDomain(maturity, domain).length > 0" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; margin-top: 10px;">
<a v-for="p in getProjectsByMaturityAndDomain(maturity, domain)" 
   :href="p.link" 
   target="_blank"
   rel="noopener noreferrer"
   :style="'border-left: 4px solid ' + maturityInfo.color + ';'"
   style="display: block; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; transition: all 0.2s; background: white;"
   class="maturity-card">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
    <span style="font-weight: 600; color: #1f2937; font-size: 14px;">{{ p.name }}</span>
    <span style="font-size: 11px;">{{ maturityMap[maturity] }}</span>
  </div>
  <div v-if="p.description" style="font-size: 11px; color: #6b7280; margin-top: 4px; line-height: 1.5;">
    {{ p.description }}
  </div>
  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
    <span v-if="p.subCategory" style="font-size: 11px; color: #9ca3af;">{{ p.subCategory }}</span>
    <div v-if="p.github">
      <img :src="'https://img.shields.io/github/stars/' + p.github + '?style=flat&color=yellow'" alt="stars" style="height: 16px;" />
    </div>
  </div>
</a>
</div>

<div v-else style="font-size: 12px; color: #9ca3af; margin-top: 8px;">
  暂无项目
</div>

</div>

</div>

---

## 成熟度定义

| 标签 | 说明 | 特点 |
|------|------|------|
| 🔥 潜力股 | 近期热门，增长迅速 | 快速发展、功能创新、活跃开发 |
| 🌟 镇馆之宝 | 稳定可靠，社区认可 | 长期验证、社区支持、文档完善 |
| 🛠️ 极客玩具 | 小众有趣，适合折腾 | 轻量级、特定功能、实验性 |

</div>

<style>
.maturity-card:hover {
  border-color: #3b82f6 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
</style>