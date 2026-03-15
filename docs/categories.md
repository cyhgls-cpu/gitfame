---
layout: page
title: 项目分类
---

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const projects = ref([])
const loading = ref(true)
const selectedDomain = ref('')
const selectedSubCategory = ref('')

const categoryData = {
  'AI & ML': {
    name: '智能前沿',
    icon: '🤖',
    desc: 'LLM 框架、AI Agent、本地大模型、图像/视频生成',
    subCategories: ['LLM 框架', 'AI Agent', '本地大模型', '图像/视频生成']
  },
  'DevTools': {
    name: '开发利器',
    icon: '🛠️',
    desc: '终端增强、API 工具、高效 IDE 插件、测试/调试',
    subCategories: ['终端增强', 'API 工具', 'IDE 插件', '测试/调试']
  },
  'Web Stack': {
    name: '现代 Web',
    icon: '🌐',
    desc: '全栈框架、UI 组件库、低代码、动效/可视化',
    subCategories: ['全栈框架', 'UI 组件库', '低代码', '动效/可视化']
  },
  'Infra': {
    name: '基础设施',
    icon: '🏗️',
    desc: '数据库、缓存、容器、云原生',
    subCategories: ['数据库', '缓存', '容器', '云原生']
  },
  'Self-Hosted': {
    name: '自托管',
    icon: '🏠',
    desc: '云服务替代品、家庭实验室、私人影音、自动化',
    subCategories: ['云服务替代品', '家庭实验室', '私人影音', '自动化']
  },
  'Resources': {
    name: '终身学习',
    icon: '📚',
    desc: '教程、文档、学习资源、API集合',
    subCategories: ['教程', '文档', '学习资源', 'API集合']
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
    
    const params = new URLSearchParams(window.location.search)
    selectedDomain.value = params.get('domain') || ''
    selectedSubCategory.value = params.get('subCategory') || ''
  } catch (e) {
    console.error('Failed to load projects:', e)
  } finally {
    loading.value = false
  }
})

function getProjectsByDomain(domain) {
  return projects.value.filter(p => p.domain === domain).slice(0, 30)
}

function getProjectsBySubCategory(domain, subCategory) {
  return projects.value.filter(p => p.domain === domain && p.subCategory === subCategory).slice(0, 20)
}

const filteredProjects = computed(() => {
  let result = projects.value
  if (selectedDomain.value) {
    result = result.filter(p => p.domain === selectedDomain.value)
  }
  if (selectedSubCategory.value) {
    result = result.filter(p => p.subCategory === selectedSubCategory.value)
  }
  return result
})

function clearFilters() {
  selectedDomain.value = ''
  selectedSubCategory.value = ''
  window.history.replaceState({}, '', '/categories')
}
</script>

# 项目分类

<div v-if="loading">加载中...</div>

<div v-if="!loading">

<div v-if="selectedDomain || selectedSubCategory" style="margin-bottom: 1.5rem; padding: 12px; background: #f9fafb; border-radius: 8px;">
  <span style="color: #6b7280;">当前筛选: </span>
  <span v-if="selectedDomain" style="background: #dbeafe; color: #1e40af; padding: 2px 10px; border-radius: 12px; font-size: 13px; margin-right: 8px;">{{ categoryData[selectedDomain]?.name || selectedDomain }}</span>
  <span v-if="selectedSubCategory" style="background: #d1fae5; color: #065f46; padding: 2px 10px; border-radius: 12px; font-size: 13px; margin-right: 8px;">{{ selectedSubCategory }}</span>
  <a href="/categories" @click="clearFilters" style="color: #ef4444; font-size: 13px; margin-left: 8px;">清除筛选</a>
</div>

<div v-if="selectedDomain && selectedSubCategory">
  <h2>{{ categoryData[selectedDomain]?.icon }} {{ selectedSubCategory }}</h2>
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; margin-top: 12px;">
    <a v-for="p in filteredProjects" 
       :href="p.link" 
       style="display: block; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; transition: all 0.2s;"
       class="category-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span style="font-weight: 600; color: #1f2937; font-size: 14px;">{{ p.name }}</span>
        <span v-if="p.maturity" style="font-size: 11px;">{{ maturityMap[p.maturity] }}</span>
      </div>
      <div v-if="p.description" style="font-size: 11px; color: #6b7280; margin-top: 4px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
        {{ p.description }}
      </div>
      <div v-if="p.github" style="margin-top: 6px;">
        <img :src="'https://img.shields.io/github/stars/' + p.github + '?style=flat&color=yellow'" alt="stars" style="height: 16px;" />
      </div>
    </a>
  </div>
  <div v-if="filteredProjects.length === 0" style="color: #9ca3af; margin-top: 1rem;">暂无项目</div>
</div>

<div v-else-if="selectedDomain">
  <h2>{{ categoryData[selectedDomain]?.icon }} {{ categoryData[selectedDomain]?.name }}</h2>
  <p>{{ categoryData[selectedDomain]?.desc }}</p>
  
  <div style="display: flex; flex-wrap: wrap; gap: 8px; margin: 1rem 0;">
    <a v-for="subCat in categoryData[selectedDomain]?.subCategories" 
       :href="'/categories?domain=' + selectedDomain + '&subCategory=' + encodeURIComponent(subCat)"
       style="padding: 6px 14px; border: 1px solid #e5e7eb; border-radius: 16px; text-decoration: none; font-size: 13px; transition: all 0.2s; background: white;">
      {{ subCat }}
    </a>
  </div>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; margin-top: 12px;">
    <a v-for="p in getProjectsByDomain(selectedDomain)" 
       :href="p.link" 
       style="display: block; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; transition: all 0.2s;"
       class="category-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span style="font-weight: 600; color: #1f2937; font-size: 14px;">{{ p.name }}</span>
        <span v-if="p.maturity" style="font-size: 11px;">{{ maturityMap[p.maturity] }}</span>
      </div>
      <div v-if="p.description" style="font-size: 11px; color: #6b7280; margin-top: 4px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
        {{ p.description }}
      </div>
      <div v-if="p.github" style="margin-top: 6px;">
        <img :src="'https://img.shields.io/github/stars/' + p.github + '?style=flat&color=yellow'" alt="stars" style="height: 16px;" />
      </div>
    </a>
  </div>
</div>

<div v-else>
  <div v-for="(cat, domain) in categoryData" :key="domain" style="margin-bottom: 2rem;">

  ## {{ cat.icon }} {{ cat.name }} ({{ domain }})

  {{ cat.desc }}

  <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
    <a v-for="subCat in cat.subCategories" 
       :href="'/categories?domain=' + domain + '&subCategory=' + encodeURIComponent(subCat)"
       style="padding: 4px 12px; border: 1px solid #e5e7eb; border-radius: 6px; text-decoration: none; font-size: 12px; background: white; color: #4b5563;">
      {{ subCat }}
    </a>
  </div>

  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; margin-top: 12px;">
  <a v-for="p in getProjectsByDomain(domain)" 
     :href="p.link" 
     style="display: block; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; transition: all 0.2s;"
     class="category-card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
      <span style="font-weight: 600; color: #1f2937; font-size: 14px;">{{ p.name }}</span>
      <span v-if="p.maturity" style="font-size: 11px;">{{ maturityMap[p.maturity] }}</span>
    </div>
    <div v-if="p.description" style="font-size: 11px; color: #6b7280; margin-top: 4px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
      {{ p.description }}
    </div>
    <div v-if="p.github" style="margin-top: 6px;">
      <img :src="'https://img.shields.io/github/stars/' + p.github + '?style=flat&color=yellow'" alt="stars" style="height: 16px;" />
    </div>
  </a>
  </div>

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