---
layout: page
title: 成熟度视图
---

<script setup>
import { ref, onMounted, computed } from 'vue'

const projects = ref([])
const loading = ref(true)
const selectedMaturity = ref('')
const selectedDomain = ref('')
const selectedSubCategory = ref('')

const categoryData = {
  'AI & ML': { name: '智能前沿', icon: '🤖' },
  'DevTools': { name: '开发利器', icon: '🛠️' },
  'Web Stack': { name: '现代 Web', icon: '🌐' },
  'Infra': { name: '基础设施', icon: '🏗️' },
  'Self-Hosted': { name: '自托管', icon: '🏠' },
  'Resources': { name: '终身学习', icon: '📚' }
}

const maturityMap = {
  'trending': { label: '🔥 潜力股', color: '#667eea', desc: '快速发展，功能创新，活跃的开发活动，良好的发展前景' },
  'stable': { label: '🌟 镇馆之宝', color: '#f093fb', desc: '稳定可靠，经过长期验证，活跃的社区支持，完善的文档和测试' },
  'geek': { label: '🛠️ 极客玩具', color: '#4facfe', desc: '轻量级，专注于特定功能，适合技术爱好者尝试，可能是实验性项目' }
}

onMounted(async () => {
  try {
    const response = await fetch('/data/projects.json')
    projects.value = await response.json()
    
    const params = new URLSearchParams(window.location.search)
    selectedMaturity.value = params.get('maturity') || ''
    selectedDomain.value = params.get('domain') || ''
    selectedSubCategory.value = params.get('subCategory') || ''
  } catch (e) {
    console.error('Failed to load projects:', e)
  } finally {
    loading.value = false
  }
})

const filteredProjects = computed(() => {
  let result = projects.value
  if (selectedMaturity.value) {
    result = result.filter(p => p.maturity === selectedMaturity.value)
  }
  if (selectedDomain.value) {
    result = result.filter(p => p.domain === selectedDomain.value)
  }
  if (selectedSubCategory.value) {
    result = result.filter(p => p.subCategory === selectedSubCategory.value)
  }
  return result
})

function clearFilters() {
  selectedMaturity.value = ''
  selectedDomain.value = ''
  selectedSubCategory.value = ''
  window.history.replaceState({}, '', '/maturity')
}
</script>

# 成熟度视图

<div v-if="loading">加载中...</div>

<div v-if="!loading">

## 成熟度说明

<div style="display: flex; flex-wrap: wrap; gap: 12px; margin: 1rem 0;">
  <a v-for="(info, key) in maturityMap" 
     :href="'/maturity?maturity=' + key"
     :style="selectedMaturity === key ? 'background: ' + info.color + '; color: white; border-color: ' + info.color : 'background: white;'"
     style="padding: 10px 16px; border-radius: 10px; text-decoration: none; font-size: 14px; border: 2px solid #e5e7eb; transition: all 0.2s; display: flex; flex-direction: column; min-width: 140px;">
    <strong>{{ info.label }}</strong>
    <span :style="selectedMaturity === key ? 'opacity: 0.9' : 'color: #6b7280; font-size: 11px;'" style="margin-top: 4px;">{{ info.desc }}</span>
  </a>
</div>

## 筛选条件

<div v-if="selectedMaturity || selectedDomain || selectedSubCategory" style="margin: 1rem 0; padding: 12px; background: #f9fafb; border-radius: 8px;">
  <span style="color: #6b7280;">当前筛选: </span>
  <span v-if="selectedMaturity" :style="'background: ' + maturityMap[selectedMaturity]?.color + '; color: white; padding: 2px 10px; border-radius: 12px; font-size: 13px; margin-right: 8px;'">{{ maturityMap[selectedMaturity]?.label }}</span>
  <span v-if="selectedDomain" style="background: #dbeafe; color: #1e40af; padding: 2px 10px; border-radius: 12px; font-size: 13px; margin-right: 8px;">{{ categoryData[selectedDomain]?.icon }} {{ categoryData[selectedDomain]?.name }}</span>
  <span v-if="selectedSubCategory" style="background: #d1fae5; color: #065f46; padding: 2px 10px; border-radius: 12px; font-size: 13px; margin-right: 8px;">{{ selectedSubCategory }}</span>
  <a href="/maturity" @click="clearFilters" style="color: #ef4444; font-size: 13px; margin-left: 8px;">清除筛选</a>
</div>

<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 1rem;">
  <span style="line-height: 32px; font-weight: bold; margin-right: 8px;">分类:</span>
  <a v-for="(cat, domain) in categoryData" 
     :href="'/maturity?maturity=' + (selectedMaturity || 'trending') + '&domain=' + domain"
     :style="selectedDomain === domain ? 'background: #3b82f6; color: white;' : 'background: white;'"
     style="padding: 6px 14px; border: 1px solid #e5e7eb; border-radius: 16px; text-decoration: none; font-size: 13px;">
    {{ cat.icon }} {{ cat.name }}
  </a>
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
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
    <span style="font-weight: 600; color: #1f2937; font-size: 14px;">{{ p.name }}</span>
    <span v-if="p.maturity" :style="'background: ' + maturityMap[p.maturity]?.color + '; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;'">{{ maturityMap[p.maturity]?.label }}</span>
  </div>
  <div v-if="p.description" style="font-size: 12px; color: #6b7280; margin-top: 6px; line-height: 1.5;">
    {{ p.description }}
  </div>
  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
    <span v-if="p.subCategory" style="font-size: 11px; color: #9ca3af;">{{ p.subCategory }}</span>
    <div v-if="p.github">
      <img :src="'https://img.shields.io/github/stars/' + p.github + '?style=flat&color=yellow'" alt="stars" style="height: 16px;" />
    </div>
  </div>
</a>
</div>

<div v-if="filteredProjects.length === 0" style="color: #9ca3af; text-align: center; padding: 2rem;">
  暂无项目
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