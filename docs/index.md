---
layout: home

hero:
  name: GitFame
  text: 发现优质 GitHub 项目
  tagline: 收录 GitHub 上的优质开源项目，按分类和成熟度整理
  actions:
    - theme: brand
      text: 热门项目
      link: /#热门项目
    - theme: alt
      text: 分类浏览
      link: /categories
---

<script setup>
import { ref, onMounted, computed } from 'vue'

const projects = ref([])
const loading = ref(true)
const selectedDomain = ref('')
const selectedSubCategory = ref('')
const selectedMaturity = ref('')
const githubData = ref({})
const githubLoading = ref(false)

const domainMap = {
  'AI & ML': '🤖 智能前沿',
  'DevTools': '🛠️ 开发利器',
  'Web Stack': '🌐 现代 Web',
  'Infra': '🏗️ 基础设施',
  'Self-Hosted': '🏠 自托管',
  'Resources': '📚 终身学习'
}

const domains = Object.keys(domainMap)

const maturityMap = {
  'trending': { label: '🔥 潜力股', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  'stable': { label: '🌟 镇馆之宝', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  'geek': { label: '🛠️ 极客玩具', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
}

const subCategories = computed(() => {
  if (!selectedDomain.value) return []
  const subs = new Set()
  projects.value.filter(p => p.domain === selectedDomain.value).forEach(p => {
    if (p.subCategory) subs.add(p.subCategory)
  })
  return Array.from(subs)
})

onMounted(async () => {
  try {
    const response = await fetch('/data/projects.json')
    projects.value = await response.json()
    
    const params = new URLSearchParams(window.location.search)
    selectedDomain.value = params.get('domain') || ''
    selectedSubCategory.value = params.get('subCategory') || ''
    selectedMaturity.value = params.get('maturity') || ''
    
    if (selectedDomain.value || selectedSubCategory.value || selectedMaturity.value) {
      githubLoading.value = true
      await fetchGitHubData()
      githubLoading.value = false
    }
  } catch (e) {
    console.error('Failed to load projects:', e)
  } finally {
    loading.value = false
  }
})

async function fetchGitHubData() {
  const filtered = filteredProjects.value.slice(0, 30)
  const githubPaths = filtered.map(p => p.github).filter(Boolean)
  
  for (const path of githubPaths) {
    try {
      const [owner, repo] = path.split('/')
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
      if (res.ok) {
        const data = await res.json()
        githubData.value[path] = {
          stars: data.stargazers_count || 0,
          forks: data.forks_count || 0,
          watches: data.subscribers_count || 0
        }
      }
    } catch (e) {
      console.error('Error fetching GitHub data for', path, e)
    }
    await new Promise(r => setTimeout(r, 100))
  }
}

const filteredProjects = computed(() => {
  let result = projects.value
  if (selectedDomain.value) {
    result = result.filter(p => p.domain === selectedDomain.value)
  }
  if (selectedSubCategory.value) {
    result = result.filter(p => p.subCategory === selectedSubCategory.value)
  }
  if (selectedMaturity.value) {
    result = result.filter(p => p.maturity === selectedMaturity.value)
  }
  return result
})

const trendingProjects = computed(() => filteredProjects.value.filter(x => x.maturity === 'trending').slice(0, 15))
const stableProjects = computed(() => filteredProjects.value.filter(x => x.maturity === 'stable').slice(0, 15))
const geekProjects = computed(() => filteredProjects.value.filter(x => x.maturity === 'geek').slice(0, 15))

function clearFilters() {
  selectedDomain.value = ''
  selectedSubCategory.value = ''
  selectedMaturity.value = ''
  window.history.replaceState({}, '', '/')
}

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num
}

function getGitHubStats(github) {
  return githubData.value[github] || { stars: 0, forks: 0, watches: 0 }
}
</script>

## 筛选条件 {#筛选条件}

<div v-if="loading">加载中...</div>

<div v-if="!loading" style="margin-bottom: 2rem;">

<div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 1rem; align-items: center;">
  <span style="line-height: 32px; font-weight: bold;">📂 一级分类:</span>
  <a v-for="d in domains" 
     :href="`/?domain=${encodeURIComponent(d)}`"
     :style="selectedDomain === d ? 'background: #3b82f6; color: white;' : 'background: #f3f4f6; color: #374151;'"
     style="padding: 6px 14px; border-radius: 16px; text-decoration: none; font-size: 13px; transition: all 0.2s;">
    {{ domainMap[d] }}
  </a>
</div>

<div v-if="subCategories.length > 0" style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 1rem; align-items: center;">
  <span style="line-height: 32px; font-weight: bold;">📁 二级分类:</span>
  <a v-for="s in subCategories" 
     :href="`/?domain=${encodeURIComponent(selectedDomain)}&subCategory=${encodeURIComponent(s)}`"
     :style="selectedSubCategory === s ? 'background: #10b981; color: white;' : 'background: #e5e7eb; color: #374151;'"
     style="padding: 6px 14px; border-radius: 16px; text-decoration: none; font-size: 13px; transition: all 0.2s;">
    {{ s }}
  </a>
</div>

<div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 1rem; align-items: center;">
  <span style="line-height: 32px; font-weight: bold;">⭐ 成熟度:</span>
  <a v-for="(m, key) in maturityMap" 
     :href="`/?maturity=${key}`"
     :style="selectedMaturity === key ? 'background: #3b82f6; color: white;' : 'background: #f3f4f6; color: #374151;'"
     style="padding: 6px 14px; border-radius: 16px; text-decoration: none; font-size: 13px; transition: all 0.2s;">
    {{ m.label }}
  </a>
</div>

<div v-if="selectedDomain || selectedSubCategory || selectedMaturity" style="margin-bottom: 1rem; padding: 12px; background: #f9fafb; border-radius: 8px;">
  <span style="color: #6b7280;">当前筛选: </span>
  <span v-if="selectedDomain" style="background: #dbeafe; color: #1e40af; padding: 2px 10px; border-radius: 12px; font-size: 13px; margin-right: 8px;">{{ domainMap[selectedDomain] || selectedDomain }}</span>
  <span v-if="selectedSubCategory" style="background: #d1fae5; color: #065f46; padding: 2px 10px; border-radius: 12px; font-size: 13px; margin-right: 8px;">{{ selectedSubCategory }}</span>
  <span v-if="selectedMaturity" style="background: #fef3c7; color: #92400e; padding: 2px 10px; border-radius: 12px; font-size: 13px; margin-right: 8px;">{{ maturityMap[selectedMaturity]?.label }}</span>
  <a href="/" @click="clearFilters" style="color: #ef4444; font-size: 13px; margin-left: 8px;">清除筛选</a>
  <span v-if="githubLoading" style="color: #6b7280; font-size: 13px; margin-left: 12px;">正在获取GitHub数据...</span>
</div>

<div v-if="filteredProjects.length > 0" style="color: #6b7280; font-size: 13px;">
  共找到 <strong>{{ filteredProjects.length }}</strong> 个项目
</div>

</div>

## 热门项目 {#热门项目}

<div v-if="!loading">

### 🔥 潜力股

<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px;">
<a v-for="p in trendingProjects" 
   :href="p.link" 
   :style="maturityMap.trending.color"
   style="color: white; padding: 12px 16px; border-radius: 12px; text-decoration: none; font-size: 14px;"
   class="project-card">
  <div style="font-weight: bold; margin-bottom: 4px;">{{ p.name }}</div>
  <div style="font-size: 12px; opacity: 0.9; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ p.description }}</div>
  <div style="display: flex; gap: 12px; font-size: 12px; opacity: 0.8;">
    <span>⭐ {{ formatNumber(getGitHubStats(p.github).stars) }}</span>
    <span>🍴 {{ formatNumber(getGitHubStats(p.github).forks) }}</span>
    <span>👁️ {{ formatNumber(getGitHubStats(p.github).watches) }}</span>
  </div>
</a>
<span v-if="trendingProjects.length === 0" style="color: #9ca3af;">暂无项目</span>
</div>

### 🌟 镇馆之宝

<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px;">
<a v-for="p in stableProjects" 
   :href="p.link" 
   :style="maturityMap.stable.color"
   style="color: white; padding: 12px 16px; border-radius: 12px; text-decoration: none; font-size: 14px;"
   class="project-card">
  <div style="font-weight: bold; margin-bottom: 4px;">{{ p.name }}</div>
  <div style="font-size: 12px; opacity: 0.9; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ p.description }}</div>
  <div style="display: flex; gap: 12px; font-size: 12px; opacity: 0.8;">
    <span>⭐ {{ formatNumber(getGitHubStats(p.github).stars) }}</span>
    <span>🍴 {{ formatNumber(getGitHubStats(p.github).forks) }}</span>
    <span>👁️ {{ formatNumber(getGitHubStats(p.github).watches) }}</span>
  </div>
</a>
<span v-if="stableProjects.length === 0" style="color: #9ca3af;">暂无项目</span>
</div>

### 🛠️ 极客玩具

<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px;">
<a v-for="p in geekProjects" 
   :href="p.link" 
   :style="maturityMap.geek.color"
   style="color: white; padding: 12px 16px; border-radius: 12px; text-decoration: none; font-size: 14px;"
   class="project-card">
  <div style="font-weight: bold; margin-bottom: 4px;">{{ p.name }}</div>
  <div style="font-size: 12px; opacity: 0.9; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ p.description }}</div>
  <div style="display: flex; gap: 12px; font-size: 12px; opacity: 0.8;">
    <span>⭐ {{ formatNumber(getGitHubStats(p.github).stars) }}</span>
    <span>🍴 {{ formatNumber(getGitHubStats(p.github).forks) }}</span>
    <span>👁️ {{ formatNumber(getGitHubStats(p.github).watches) }}</span>
  </div>
</a>
<span v-if="geekProjects.length === 0" style="color: #9ca3af;">暂无项目</span>
</div>

</div>

---

## 分类导航

### 🤖 智能前沿 (AI & ML)

<div style="display: flex; flex-wrap: wrap; gap: 8px;">
<a v-for="p in projects.filter(x => x.domain === 'AI & ML').slice(0, 20)" :href="p.link" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px; text-decoration: none; font-size: 13px;">{{ p.name }}</a>
</div>

### 🛠️ 开发利器 (DevTools)

<div style="display: flex; flex-wrap: wrap; gap: 8px;">
<a v-for="p in projects.filter(x => x.domain === 'DevTools').slice(0, 20)" :href="p.link" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px; text-decoration: none; font-size: 13px;">{{ p.name }}</a>
</div>

### 🌐 现代 Web (Web Stack)

<div style="display: flex; flex-wrap: wrap; gap: 8px;">
<a v-for="p in projects.filter(x => x.domain === 'Web Stack').slice(0, 20)" :href="p.link" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px; text-decoration: none; font-size: 13px;">{{ p.name }}</a>
</div>

### 🏗️ 基础设施 (Infra)

<div style="display: flex; flex-wrap: wrap; gap: 8px;">
<a v-for="p in projects.filter(x => x.domain === 'Infra').slice(0, 20)" :href="p.link" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px; text-decoration: none; font-size: 13px;">{{ p.name }}</a>
</div>

### 🏠 自托管 (Self-Hosted)

<div style="display: flex; flex-wrap: wrap; gap: 8px;">
<a v-for="p in projects.filter(x => x.domain === 'Self-Hosted').slice(0, 20)" :href="p.link" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px; text-decoration: none; font-size: 13px;">{{ p.name }}</a>
</div>

### 📚 终身学习 (Resources)

<div style="display: flex; flex-wrap: wrap; gap: 8px;">
<a v-for="p in projects.filter(x => x.domain === 'Resources').slice(0, 20)" :href="p.link" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px; text-decoration: none; font-size: 13px;">{{ p.name }}</a>
</div>

---

## 成熟度说明

- 🔥 **潜力股**：近期热门，增长迅速的项目
- 🌟 **镇馆之宝**：稳定可靠，社区认可的项目
- 🛠️ **极客玩具**：小众有趣，适合折腾的项目