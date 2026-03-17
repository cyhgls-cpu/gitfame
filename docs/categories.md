<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const activeDomain = ref<string>('')
const activeMaturity = ref<string>('all')
const activeSubCategory = ref<string>('all')
const searchQuery = ref<string>('')
const sortBy = ref<string>('name')
const projects = ref<any[]>([])
const domains = ref<string[]>([])
const subCategories = ref<string[]>([])
const loading = ref(true)
const currentPage = ref(1)
const pageSize = 52
const favorites = ref<string[]>([])

onMounted(async () => {
  const saved = localStorage.getItem('gitfame_favorites')
  if (saved) {
    favorites.value = JSON.parse(saved)
  }
  try {
    const response = await fetch('/data/projects.json')
    projects.value = await response.json()
    const uniqueDomains = [...new Set(projects.value.map(p => p.domain))]
    domains.value = uniqueDomains.sort()
    if (domains.value.length > 0) {
      activeDomain.value = domains.value[0]
      updateSubCategories(domains.value[0])
    }
  } catch (error) {
    console.error('Error loading projects:', error)
  } finally {
    loading.value = false
  }
})

const updateSubCategories = (domain: string) => {
  const subs = [...new Set(projects.value.filter(p => p.domain === domain).map(p => p.subCategory))]
  subCategories.value = subs.sort()
}

const switchDomain = (domain: string) => {
  activeDomain.value = domain
  updateSubCategories(domain)
  activeMaturity.value = 'all'
  activeSubCategory.value = 'all'
  currentPage.value = 1
}

const switchMaturity = (maturity: string) => {
  activeMaturity.value = maturity
  currentPage.value = 1
}

const switchSubCategory = (sub: string) => {
  activeSubCategory.value = sub
  currentPage.value = 1
}

const filteredProjects = computed(() => {
  let result = projects.value.filter(p => p.domain === activeDomain.value)
  if (activeMaturity.value !== 'all') {
    result = result.filter(project => project.maturity === activeMaturity.value)
  }
  if (activeSubCategory.value !== 'all') {
    result = result.filter(project => project.subCategory === activeSubCategory.value)
  }
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.name?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.tags?.some((t: string) => t.toLowerCase().includes(query)) ||
      p.subCategory?.toLowerCase().includes(query)
    )
  }
  result = [...result].sort((a, b) => {
    if (sortBy.value === 'name') {
      return (a.name || '').localeCompare(b.name || '')
    } else if (sortBy.value === 'stars') {
      return (b.starsToday || 0) - (a.starsToday || 0)
    } else if (sortBy.value === 'trending') {
      return (a.trendingRank || 999) - (b.trendingRank || 999)
    }
    return 0
  })
  return result
})

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProjects.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / pageSize))

const pageNumbers = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push(-1)
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push(-1)
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push(-1)
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push(-1)
      pages.push(total)
    }
  }
  return pages
})

const goToPage = (page: number) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const toggleFavorite = (id: string) => {
  if (!id) return
  if (favorites.value.includes(id)) {
    favorites.value = favorites.value.filter(f => f !== id)
  } else {
    favorites.value.push(id)
  }
  localStorage.setItem('gitfame_favorites', JSON.stringify(favorites.value))
}

const isFavorite = (id: string) => id ? favorites.value.includes(id) : false

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const maturityLabels: Record<string, string> = {
  stable: '🌟 镇馆之宝',
  trending: '🔥 潜力股',
  geek: '🛠️ 极客玩具'
}

const maturityColors: Record<string, string> = {
  stable: 'from-blue-900 to-blue-500',
  trending: 'from-red-600 to-orange-500',
  geek: 'from-green-800 to-green-500'
}
</script>

# 项目分类

<div v-if="loading" class="loading">加载中...</div>

<div v-if="!loading">
  <div class="search-bar">
    <input v-model="searchQuery" type="text" placeholder="搜索项目名称、描述、标签..." class="search-input" @input="currentPage = 1" />
    <button v-if="searchQuery" @click="clearSearch" class="clear-btn">✕</button>
    <span class="result-count">{{ filteredProjects.length }} 个项目</span>
  </div>

  <div class="sort-bar">
    <span class="sort-label">排序:</span>
    <button :class="['sort-btn', { active: sortBy === 'name' }]" @click="sortBy = 'name'">名称</button>
    <button :class="['sort-btn', { active: sortBy === 'stars' }]" @click="sortBy = 'stars'">今日 Star</button>
    <button :class="['sort-btn', { active: sortBy === 'trending' }]" @click="sortBy = 'trending'">Trending 排名</button>
  </div>

  <div class="domain-nav">
    <button v-for="domain in domains" :key="domain" :class="['domain-btn', { active: activeDomain === domain }]" @click="switchDomain(domain)">
      {{ domain }}
      <span class="domain-count">({{ projects.filter(p => p.domain === domain).length }})</span>
    </button>
  </div>

  <div class="sub-category-nav" v-if="subCategories.length > 0">
    <button :class="['sub-btn', { active: activeSubCategory === 'all' }]" @click="switchSubCategory('all')">全部</button>
    <button v-for="sub in subCategories" :key="sub" :class="['sub-btn', { active: activeSubCategory === sub }]" @click="switchSubCategory(sub)">{{ sub }}</button>
  </div>

  <div class="maturity-filter">
    <button :class="['maturity-btn', { active: activeMaturity === 'all' }]" @click="switchMaturity('all')">全部</button>
    <button :class="['maturity-btn', { active: activeMaturity === 'stable' }]" @click="switchMaturity('stable')">🌟 稳定</button>
    <button :class="['maturity-btn', { active: activeMaturity === 'trending' }]" @click="switchMaturity('trending')">🔥 热门</button>
    <button :class="['maturity-btn', { active: activeMaturity === 'geek' }]" @click="switchMaturity('geek')">🛠️ 极客</button>
  </div>

  <div class="projects-grid" v-if="paginatedProjects && paginatedProjects.length">
    <div v-for="(project, index) in paginatedProjects" :key="(project?.id || project?.name || index)" :class="['project-card', 'bg-gradient-to-r', project ? maturityColors[project.maturity] : 'from-gray-800 to-gray-600']">
      <button class="favorite-btn" @click="toggleFavorite(project?.id)" :title="isFavorite(project?.id) ? '取消收藏' : '收藏'">
        {{ isFavorite(project?.id) ? '❤️' : '🤍' }}
      </button>
      <div class="card-header">
        <div class="project-info">
          <span v-if="project?.icon" class="project-icon">{{ project.icon }}</span>
          <h3><a :href="project?.link" class="project-name" target="_blank">{{ project?.name }}</a></h3>
        </div>
        <div class="header-badges">
          <span v-if="project?.trendingRank && project.trendingRank <= 100" class="trending-badge">#{{ project.trendingRank }}</span>
          <img v-if="project?.github" :src="`https://img.shields.io/github/stars/${project.github}?style=flat-square&color=white`" :alt="`${project.name} stars`" class="star-badge" />
        </div>
      </div>
      <p class="card-description">{{ project?.description || project?.aiDescription || '暂无描述' }}</p>
      <div class="card-tags" v-if="project?.tags && project.tags.length">
        <span v-for="tag in project.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <div class="card-footer">
        <div class="card-meta">
          <span class="maturity-label">{{ maturityLabels[project?.maturity] }}</span>
          <span v-if="project?.subCategory" class="sub-category">{{ project.subCategory }}</span>
        </div>
        <a :href="project?.link" class="card-link" target="_blank">查看详情 →</a>
      </div>
    </div>
  </div>

  <div class="pagination" v-if="totalPages > 1">
    <button class="page-btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">上一页</button>
    <template v-for="page in pageNumbers" :key="page">
      <span v-if="page === -1" class="page-ellipsis">...</span>
      <button v-else :class="['page-btn', { active: currentPage === page }]" @click="goToPage(page)">{{ page }}</button>
    </template>
    <button class="page-btn" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">下一页</button>
  </div>

  <div class="empty-state" v-if="filteredProjects.length === 0">
    <p>暂无符合条件的项目</p>
    <button v-if="searchQuery" @click="clearSearch" class="clear-search-btn">清除搜索</button>
  </div>
</div>

<style scoped>
:root {
  --cat-text-primary: #333;
  --cat-text-secondary: #666;
  --cat-text-tertiary: #999;
  --cat-border: #e5e7eb;
  --cat-bg: #fff;
  --cat-bg-soft: #f9fafb;
}
.dark {
  --cat-text-primary: #fff;
  --cat-text-secondary: #ccc;
  --cat-text-tertiary: #999;
  --cat-border: #444;
  --cat-bg: #1a1a1a;
  --cat-bg-soft: #252525;
}
.categories-page { max-width: 100%; margin: 0 auto; padding: 2rem; box-sizing: border-box; }
h1 { font-size: 2.5rem; font-weight: bold; margin-bottom: 2rem; text-align: center; color: var(--cat-text-primary); }
.loading { text-align: center; padding: 4rem; color: var(--cat-text-secondary); }
.search-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; position: relative; }
.search-input { flex: 1; padding: 12px 16px; border: 2px solid var(--cat-border); border-radius: 8px; font-size: 1rem; transition: border-color 0.2s; background: var(--cat-bg); color: var(--cat-text-primary); }
.search-input:focus { outline: none; border-color: #3b82f6; }
.clear-btn { position: absolute; right: 120px; background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--cat-text-tertiary); }
.result-count { color: var(--cat-text-secondary); font-size: 0.9rem; white-space: nowrap; }
.sort-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 1.5rem; }
.sort-label { color: var(--cat-text-secondary); font-size: 0.9rem; }
.sort-btn { padding: 6px 12px; border: 1px solid var(--cat-border); border-radius: 16px; background: var(--cat-bg); cursor: pointer; font-size: 0.85rem; transition: all 0.2s; color: var(--cat-text-primary); }
.sort-btn:hover { border-color: #3b82f6; color: #3b82f6; }
.sort-btn.active { background: #3b82f6; color: white; border-color: #3b82f6; }
.domain-nav { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 1rem; justify-content: center; }
.domain-btn { padding: 10px 20px; border: 1px solid var(--cat-border); border-radius: 25px; background: var(--cat-bg); cursor: pointer; transition: all 0.3s ease; font-size: 1rem; color: var(--cat-text-primary); }
.domain-btn:hover { border-color: #3b82f6; color: #3b82f6; }
.domain-btn.active { background: #3b82f6; color: white; border-color: #3b82f6; }
.domain-count { font-size: 0.8rem; opacity: 0.8; }
.sub-category-nav { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 1.5rem; justify-content: center; }
.sub-btn { padding: 6px 14px; border: 1px solid var(--cat-border); border-radius: 16px; background: var(--cat-bg); cursor: pointer; font-size: 0.85rem; transition: all 0.2s; color: var(--cat-text-primary); }
.sub-btn:hover { border-color: #10b981; color: #10b981; }
.sub-btn.active { background: #10b981; color: white; border-color: #10b981; }
.maturity-filter { display: flex; gap: 10px; margin-bottom: 2rem; justify-content: center; flex-wrap: wrap; }
.maturity-btn { padding: 8px 16px; border: 1px solid var(--cat-border); border-radius: 20px; background: var(--cat-bg); cursor: pointer; transition: all 0.3s ease; font-size: 0.9rem; color: var(--cat-text-primary); }
.maturity-btn:hover { border-color: #3b82f6; color: #3b82f6; }
.maturity-btn.active { background: #3b82f6; color: white; border-color: #3b82f6; }
.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; margin-bottom: 2rem; }
@media (max-width: 1200px) {
  .projects-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 900px) {
  .projects-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 600px) {
  .projects-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
}
@media (max-width: 400px) {
  .projects-grid { grid-template-columns: 1fr; }
}
.project-card { border-radius: 12px; padding: 20px; color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; position: relative; overflow: hidden; }
.project-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2); }
.favorite-btn { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.2); border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }
.favorite-btn:hover { transform: scale(1.1); }
.card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.project-info { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.project-icon { font-size: 1.5rem; flex-shrink: 0; }
.card-header h3 { margin: 0; font-size: 1.1rem; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.project-name { color: white; text-decoration: none; transition: opacity 0.3s ease; }
.project-name:hover { opacity: 0.8; text-decoration: underline; }
.header-badges { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
.trending-badge { background: rgba(255, 255, 255, 0.25); border-radius: 12px; padding: 2px 8px; font-size: 0.75rem; font-weight: bold; }
.star-badge { height: 18px; border-radius: 4px; }
.card-description { margin: 10px 0; font-size: 0.875rem; opacity: 0.9; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card-tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0; }
.tag { padding: 2px 8px; background: rgba(255, 255, 255, 0.2); border-radius: 10px; font-size: 0.7rem; }
.card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; font-size: 0.875rem; }
.card-meta { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.maturity-label { opacity: 0.8; }
.sub-category { font-size: 0.75rem; background: rgba(255, 255, 255, 0.2); padding: 2px 8px; border-radius: 10px; }
.card-link { color: white; text-decoration: underline; opacity: 0.8; transition: opacity 0.3s ease; flex-shrink: 0; }
.card-link:hover { opacity: 1; }
.pagination { display: flex; justify-content: center; gap: 8px; margin: 2rem 0; flex-wrap: wrap; }
.page-btn { padding: 8px 14px; border: 1px solid var(--cat-border); border-radius: 8px; background: var(--cat-bg); cursor: pointer; font-size: 0.9rem; transition: all 0.2s; color: var(--cat-text-primary); }
.page-btn:hover:not(:disabled) { border-color: #3b82f6; color: #3b82f6; background: var(--cat-bg-soft); }
.page-btn.active { background: #3b82f6; color: white !important; border-color: #3b82f6; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-ellipsis { padding: 8px; color: var(--cat-text-tertiary); }
.empty-state { text-align: center; padding: 4rem 2rem; background: var(--cat-bg-soft); border-radius: 8px; color: var(--cat-text-secondary); }
.clear-search-btn { margin-top: 1rem; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; }
@media (max-width: 768px) {
  .categories-page { padding: 0.5rem; }
  .projects-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .project-card { padding: 12px; }
  .card-header h3 { font-size: 0.9rem; }
  .card-description { font-size: 0.75rem; -webkit-line-clamp: 1; }
  .domain-nav, .maturity-filter, .sub-category-nav { justify-content: flex-start; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 10px; }
  .search-bar { flex-direction: column; align-items: stretch; }
  .result-count { text-align: center; }
}
@media (max-width: 480px) {
  .projects-grid { grid-template-columns: 1fr; }
}
</style>
