<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Project } from '../.vitepress/projects.data'
import { loadProjects, getDomains, getSubCategories, getProjectsByDomain } from '../.vitepress/projects.data'

// 状态管理
const activeDomain = ref<string>('')
const activeMaturity = ref<string>('all')
const projects = ref<Project[]>([])
const domains = ref<string[]>([])
const subCategories = ref<string[]>([])

// 加载数据
onMounted(async () => {
  try {
    // 加载所有项目
    const loadedProjects = loadProjects()
    projects.value = loadedProjects
    
    // 获取所有一级分类
    const loadedDomains = getDomains()
    domains.value = loadedDomains
    
    // 默认选择第一个分类
    if (loadedDomains.length > 0) {
      activeDomain.value = loadedDomains[0]
      updateSubCategories(loadedDomains[0])
    }
  } catch (error) {
    console.error('Error loading projects:', error)
  }
})

// 更新二级分类
const updateSubCategories = (domain: string) => {
  subCategories.value = getSubCategories(domain)
}

// 切换一级分类
const switchDomain = (domain: string) => {
  activeDomain.value = domain
  updateSubCategories(domain)
  activeMaturity.value = 'all'
}

// 切换成熟度筛选
const switchMaturity = (maturity: string) => {
  activeMaturity.value = maturity
}

// 过滤后的项目
const filteredProjects = computed(() => {
  let result = getProjectsByDomain(activeDomain.value)
  
  if (activeMaturity.value !== 'all') {
    result = result.filter(project => project.maturity === activeMaturity.value)
  }
  
  return result
})

// 成熟度标签映射
const maturityLabels = {
  stable: '🌟 镇馆之宝',
  trending: '🔥 潜力股',
  geek: '🛠️ 极客玩具'
}

// 成熟度颜色映射
const maturityColors = {
  stable: 'bg-gradient-to-r from-blue-900 to-blue-500',
  trending: 'bg-gradient-to-r from-red-600 to-orange-500 animate-pulse',
  geek: 'bg-gradient-to-r from-green-800 to-green-500'
}
</script>

<template>
  <div class="categories-page">
    <h1>项目分类</h1>
    
    <!-- 一级分类导航 -->
    <div class="domain-nav">
      <button
        v-for="domain in domains"
        :key="domain"
        :class="['domain-btn', { active: activeDomain === domain }]"
        @click="switchDomain(domain)"
      >
        {{ domain }}
      </button>
    </div>
    
    <!-- 成熟度筛选 -->
    <div class="maturity-filter">
      <button
        :class="['maturity-btn', { active: activeMaturity === 'all' }]"
        @click="switchMaturity('all')"
      >
        全部
      </button>
      <button
        :class="['maturity-btn', { active: activeMaturity === 'stable' }]"
        @click="switchMaturity('stable')"
      >
        🌟 稳定
      </button>
      <button
        :class="['maturity-btn', { active: activeMaturity === 'trending' }]"
        @click="switchMaturity('trending')"
      >
        🔥 热门
      </button>
      <button
        :class="['maturity-btn', { active: activeMaturity === 'geek' }]"
        @click="switchMaturity('geek')"
      >
        🛠️ 极客
      </button>
    </div>
    
    <!-- 二级分类显示 -->
    <div class="sub-categories" v-if="subCategories.length > 0">
      <h3>二级分类</h3>
      <div class="sub-category-tags">
        <span v-for="subCategory in subCategories" :key="subCategory" class="sub-category-tag">
          {{ subCategory }}
        </span>
      </div>
    </div>
    
    <!-- 项目列表 -->
    <div class="projects-grid">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        :class="['project-card', maturityColors[project.maturity]]"
      >
        <div class="card-header">
          <div class="project-info">
            <span v-if="project.icon" class="project-icon">{{ project.icon }}</span>
            <h3><a :href="project.link" class="project-name">{{ project.name }}</a></h3>
          </div>
          <div class="header-badges">
            <span v-if="project.maturity === 'trending' && project.trendingRank" class="trending-badge">
              #{{ project.trendingRank }}
            </span>
            <img v-if="project.github" :src="`https://img.shields.io/github/stars/${project.github}?style=flat-square&color=white`" :alt="`${project.name} stars`" class="star-badge" />
          </div>
        </div>
        <p class="card-description">{{ project.description || project.aiDescription || '暂无描述' }}</p>
        <div class="card-features">
          <span v-for="feature in project.features.slice(0, 3)" :key="feature" class="feature-tag">
            {{ feature }}
          </span>
        </div>
        <div class="card-footer">
          <div class="card-meta">
            <span class="maturity-label">{{ maturityLabels[project.maturity] }}</span>
            <span v-if="project.efficiency" class="efficiency-badge">
              ⚡ {{ project.efficiency }}%
            </span>
            <span v-if="project.starChange" :class="['star-trend-badge', project.starChange > 0 ? 'positive' : 'negative']">
              {{ project.starChange > 0 ? '+' : '' }}{{ project.starChange }} Stars this week
            </span>
          </div>
          <a :href="project.link" class="card-link">查看详情</a>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div class="empty-state" v-if="filteredProjects.length === 0">
      <p>暂无符合条件的项目</p>
    </div>
  </div>
</template>

<style scoped>
.categories-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
}

/* 一级分类导航 */
.domain-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 2rem;
  justify-content: center;
}

.domain-btn {
  padding: 10px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 25px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.domain-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.domain-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* 成熟度筛选 */
.maturity-filter {
  display: flex;
  gap: 10px;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.maturity-btn {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.maturity-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.maturity-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* 二级分类 */
.sub-categories {
  margin-bottom: 2rem;
  text-align: center;
}

.sub-categories h3 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.sub-category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.sub-category-tag {
  padding: 4px 12px;
  background: #f3f4f6;
  border-radius: 12px;
  font-size: 0.875rem;
  color: #4b5563;
}

/* 项目网格 */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 2rem;
}

.project-card {
  border-radius: 8px;
  padding: 20px;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.project-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.project-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
}

.project-name {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.project-name:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.header-badges {
  display: flex;
  gap: 8px;
  align-items: center;
}

.trending-badge {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: bold;
}

.star-badge {
  height: 18px;
  border-radius: 4px;
}

.card-description {
  margin: 10px 0;
  font-size: 0.875rem;
  opacity: 0.9;
  line-height: 1.4;
}

.card-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0;
}

.feature-tag {
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-size: 0.75rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  font-size: 0.875rem;
}

.card-meta {
  display: flex;
  gap: 10px;
  align-items: center;
}

.maturity-label {
  opacity: 0.8;
}

.efficiency-badge {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: bold;
}

.star-trend-badge {
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: bold;
}

.star-trend-badge.positive {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
}

.star-trend-badge.negative {
  background: rgba(255, 0, 0, 0.2);
  color: #ff0000;
}

.card-link {
  color: white;
  text-decoration: underline;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.card-link:hover {
  opacity: 1;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: #f9fafb;
  border-radius: 8px;
  color: #6b7280;
}

/* 动画效果 */
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.4);
  }
  50% {
    box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.6);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .categories-page {
    padding: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>