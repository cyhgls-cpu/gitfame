---
layout: page
title: 成熟度
---

<script setup>
import { ref, onMounted, computed } from 'vue'

const projects = ref([])
const loading = ref(true)
const filter = ref('all')

const maturityMap = {
  'trending': { label: '🔥 潜力股', color: '#667eea', desc: '快速发展，功能创新，活跃的开发活动，良好的发展前景' },
  'stable': { label: '🌟 镇馆之宝', color: '#f093fb', desc: '稳定可靠，经过长期验证，活跃的社区支持，完善的文档和测试' },
  'geek': { label: '🛠️ 极客玩具', color: '#4facfe', desc: '轻量级，专注于特定功能，适合技术爱好者尝试，可能是实验性项目' }
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

const filteredProjects = computed(() => {
  if (filter.value === 'all') return projects.value
  return projects.value.filter(p => p.maturity === filter.value)
})

function formatNumber(num) {
  if (!num) return '0'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num
}
</script>

# 成熟度动态视图

<div v-if="loading">加载中...</div>

<div v-if="!loading">

## 成熟度说明

<div v-for="(info, key) in maturityMap" :key="key" style="margin-bottom: 1rem; padding: 12px; border-radius: 8px; background: linear-gradient(135deg, {{ info.color }}22 0%, {{ info.color }}11 100%);">
  <strong>{{ info.label }}</strong>: {{ info.desc }}
</div>

## 筛选切换

<div style="display: flex; gap: 12px; margin: 1.5rem 0;">
  <button @click="filter = 'all'" :style="filter === 'all' ? 'background: #3b82f6; color: white;' : 'background: #f3f4f6;'" style="padding: 8px 16px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">全部</button>
  <button @click="filter = 'stable'" :style="filter === 'stable' ? 'background: #f093fb; color: white;' : 'background: #f3f4f6;'" style="padding: 8px 16px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">🌟 稳定</button>
  <button @click="filter = 'trending'" :style="filter === 'trending' ? 'background: #667eea; color: white;' : 'background: #f3f4f6;'" style="padding: 8px 16px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">🔥 热门</button>
  <button @click="filter = 'geek'" :style="filter === 'geek' ? 'background: #4facfe; color: white;' : 'background: #f3f4f6;'" style="padding: 8px 16px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">🛠️ 极客</button>
</div>

<div style="color: #6b7280; margin-bottom: 1rem;">
  共 <strong>{{ filteredProjects.length }}</strong> 个项目
</div>

<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px;">
<a v-for="p in filteredProjects" 
   :href="p.link" 
   :style="p.maturity === 'trending' ? 'border-left: 4px solid #667eea;' : p.maturity === 'stable' ? 'border-left: 4px solid #f093fb;' : 'border-left: 4px solid #4facfe;'"
   style="display: block; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; transition: all 0.2s; background: white;"
   class="maturity-card">
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <span style="font-weight: 600; color: #1f2937;">{{ p.name }}</span>
    <span v-if="p.trendingRank" style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 12px; font-size: 11px;">#{{ p.trendingRank }}</span>
  </div>
  <div v-if="p.description" style="font-size: 12px; color: #6b7280; margin-top: 6px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
    {{ p.description }}
  </div>
  <div v-if="p.github" style="margin-top: 6px;">
    <img :src="'https://img.shields.io/github/stars/' + p.github + '?style=flat&color=yellow'" alt="stars" style="height: 18px;" />
  </div>
  <div v-if="p.subCategory" style="font-size: 11px; color: #9ca3af; margin-top: 6px;">
    {{ p.subCategory }}
  </div>
</a>
</div>

<div v-if="filteredProjects.length === 0" style="color: #9ca3af; text-align: center; padding: 2rem;">
  暂无项目
</div>

</div>

<style>
.maturity-card:hover {
  border-color: #3b82f6 !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>