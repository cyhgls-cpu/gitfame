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
import { ref, onMounted } from 'vue'

const projects = ref([])
const loading = ref(true)

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
</script>

## 热门项目 {#热门项目}

<div v-if="loading">加载中...</div>

<div v-if="!loading">

### 🔥 潜力股

<div style="display: flex; flex-wrap: wrap; gap: 12px;">
<a v-for="p in projects.filter(x => x.maturity === 'trending').slice(0, 15)" 
   :href="p.link" 
   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 14px;">
  {{ p.name }}
</a>
</div>

### 🌟 镇馆之宝

<div style="display: flex; flex-wrap: wrap; gap: 12px;">
<a v-for="p in projects.filter(x => x.maturity === 'stable').slice(0, 15)" 
   :href="p.link" 
   style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 14px;">
  {{ p.name }}
</a>
</div>

### 🛠️ 极客玩具

<div style="display: flex; flex-wrap: wrap; gap: 12px;">
<a v-for="p in projects.filter(x => x.maturity === 'geek').slice(0, 15)" 
   :href="p.link" 
   style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 14px;">
  {{ p.name }}
</a>
</div>

</div>

---

## 分类导航

### 🤖 AI & ML

<div style="display: flex; flex-wrap: wrap; gap: 8px;">
<a v-for="p in projects.filter(x => x.domain === 'AI & ML').slice(0, 20)" :href="p.link" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px; text-decoration: none; font-size: 13px;">{{ p.name }}</a>
</div>

### 🛠️ DevTools

<div style="display: flex; flex-wrap: wrap; gap: 8px;">
<a v-for="p in projects.filter(x => x.domain === 'DevTools').slice(0, 20)" :href="p.link" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px; text-decoration: none; font-size: 13px;">{{ p.name }}</a>
</div>

### 🌐 Web Stack

<div style="display: flex; flex-wrap: wrap; gap: 8px;">
<a v-for="p in projects.filter(x => x.domain === 'Web Stack').slice(0, 20)" :href="p.link" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px; text-decoration: none; font-size: 13px;">{{ p.name }}</a>
</div>

### 🏗️ Infra

<div style="display: flex; flex-wrap: wrap; gap: 8px;">
<a v-for="p in projects.filter(x => x.domain === 'Infra').slice(0, 20)" :href="p.link" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px; text-decoration: none; font-size: 13px;">{{ p.name }}</a>
</div>

### 🏠 Self-Hosted

<div style="display: flex; flex-wrap: wrap; gap: 8px;">
<a v-for="p in projects.filter(x => x.domain === 'Self-Hosted').slice(0, 20)" :href="p.link" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px; text-decoration: none; font-size: 13px;">{{ p.name }}</a>
</div>

### 📚 Resources

<div style="display: flex; flex-wrap: wrap; gap: 8px;">
<a v-for="p in projects.filter(x => x.domain === 'Resources').slice(0, 20)" :href="p.link" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px; text-decoration: none; font-size: 13px;">{{ p.name }}</a>
</div>

---

## 成熟度说明

- 🔥 **潜力股**：近期热门，增长迅速的项目
- 🌟 **镇馆之宝**：稳定可靠，社区认可的项目
- 🛠️ **极客玩具**：小众有趣，适合折腾的项目
