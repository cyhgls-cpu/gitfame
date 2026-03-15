---
layout: page
title: 项目分类
---

<script setup>
import { ref, onMounted } from 'vue'

const projects = ref([])
const loading = ref(true)

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

const subCategorySlugMap = {
  'LLM 框架': 'llm-gang-kuo-jia',
  'AI Agent': 'ai-agent',
  '本地大模型': 'ben-di-da-mo-xing',
  '图像/视频生成': 'tu-xiang-shi-pin-sheng-cheng',
  '终端增强': 'zhong-duan-zeng-qiang',
  'API 工具': 'api-gong-ju',
  'IDE 插件': 'ide-cha-jian',
  '测试/调试': 'ce-shi-tiao-shi',
  '全栈框架': 'quan-zhan-gang-jia',
  'UI 组件库': 'ui-zu-jian-ku',
  '低代码': 'di-dai-ma',
  '动效/可视化': 'dong-xiao-ke-shi-hua',
  '数据库': 'shu-ju-ku',
  '缓存': 'huan-cun',
  '容器': 'rong-qi',
  '云原生': 'yun-yuan-sheng',
  '云服务替代品': 'yun-fu-wu-ti-dai-pin',
  '家庭实验室': 'jia-ting-shi-yan-shi',
  '私人影音': 'si-ren-ying-yin',
  '自动化': 'zi-dong-hua',
  '教程': 'jiao-cheng',
  '文档': 'wen-dang',
  '学习资源': 'xue-xi-zi-yuan',
  'API集合': 'api-ji-he'
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

function getProjectsBySubCategory(domain, subCategory) {
  return projects.value.filter(p => p.domain === domain && p.subCategory === subCategory).slice(0, 20)
}

function getSlug(subCat) {
  return subCategorySlugMap[subCat] || subCat
}
</script>

# 项目分类

<div v-if="loading" style="text-align: center; padding: 2rem;">加载中...</div>

<div v-if="!loading">

<div v-for="(cat, domain) in categoryData" :key="domain" style="margin-bottom: 3rem;">

## {{ cat.icon }} {{ cat.name }} ({{ domain }})

{{ cat.desc }}

<div v-for="subCat in cat.subCategories" :key="subCat" :id="getSlug(subCat)" style="margin-top: 1.5rem; margin-left: 1rem; scroll-margin-top: 80px;">

### {{ subCat }}

<div v-if="getProjectsBySubCategory(domain, subCat).length > 0" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; margin-top: 10px;">
<a v-for="p in getProjectsBySubCategory(domain, subCat)" 
   :href="p.link" 
   target="_blank"
   rel="noopener noreferrer"
   style="display: block; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; transition: all 0.2s;"
   class="category-card">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
    <span style="font-weight: 600; color: #1f2937; font-size: 14px;">{{ p.name }}</span>
    <span v-if="p.maturity" style="font-size: 11px;">{{ maturityMap[p.maturity] }}</span>
  </div>
  <div v-if="p.description" style="font-size: 11px; color: #6b7280; margin-top: 4px; line-height: 1.5;">
    {{ p.description }}
  </div>
  <div v-if="p.github" style="margin-top: 6px;">
    <img :src="'https://img.shields.io/github/stars/' + p.github + '?style=flat&color=yellow'" alt="stars" style="height: 16px;" />
  </div>
</a>
</div>

<div v-else style="font-size: 12px; color: #9ca3af; margin-top: 8px;">
  暂无项目
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