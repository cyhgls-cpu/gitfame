# 成熟度动态视图

## 项目成熟度分类

我们根据项目的发展阶段和稳定性，将项目分为三个成熟度等级：

### 🌟 镇馆之宝

**特点**：
- 稳定可靠，经过长期验证
- 活跃的社区支持
- 完善的文档和测试
- 广泛的应用场景

**配色**：深金/蓝配色，给人稳重、可靠的感觉

### 🔥 潜力股

**特点**：
- 快速发展，功能创新
- 活跃的开发活动
- 良好的发展前景
- 可能在 GitHub Trending 上有较高排名

**配色**：火红/橙渐变，并加上 animate-pulse 呼吸灯效果

### 🛠️ 极客玩具

**特点**：
- 轻量级，专注于特定功能
- 适合技术爱好者尝试
- 可能是实验性项目
- 快速迭代，功能多变

**配色**：草绿/灰配色，体现轻量和趣味

## 筛选切换

<ClientOnly>
  <div class="maturity-filter">
    <button :class="{ active: filter === 'all' }" @click="filter = 'all'">全部</button>
    <button :class="{ active: filter === 'stable' }" @click="filter = 'stable'">🌟 稳定</button>
    <button :class="{ active: filter === 'trending' }" @click="filter = 'trending'">🔥 热门</button>
    <button :class="{ active: filter === 'geek' }" @click="filter = 'geek'">🛠️ 极客</button>
  </div>
  
  <TransitionGroup name="maturity-list" tag="div" class="maturity-grid">
    <div 
      v-for="project in filteredProjects" 
      :key="project.id"
      :class="['maturity-card', project.maturity]"
    >
      <div class="card-header">
        <h3>{{ project.name }}</h3>
        <span v-if="project.maturity === 'trending'" class="trending-badge">
          #{{ project.trendingRank }}
        </span>
      </div>
      <p class="card-description">{{ project.description }}</p>
      <div class="card-footer">
        <span class="maturity-label">{{ project.maturityLabel }}</span>
        <a :href="project.link" target="_blank" class="card-link">查看详情</a>
      </div>
    </div>
  </TransitionGroup>
</ClientOnly>

<script setup>
import { ref, computed } from 'vue'

const filter = ref('all')

const projects = [
  {
    id: 1,
    name: 'GitFame',
    description: '功能强大的 Git 仓库分析工具，帮助你了解代码贡献者的贡献情况',
    maturity: 'stable',
    maturityLabel: '🌟 镇馆之宝',
    link: '/'
  },
  {
    id: 2,
    name: 'GitFame CLI',
    description: 'GitFame 的命令行工具，提供快速的仓库分析功能',
    maturity: 'trending',
    maturityLabel: '🔥 潜力股',
    trendingRank: 12,
    link: '/api/core'
  },
  {
    id: 3,
    name: 'GitFame Plugin',
    description: 'GitFame 的插件系统，允许你扩展其功能',
    maturity: 'geek',
    maturityLabel: '🛠️ 极客玩具',
    link: '/api/plugins'
  }
]

const filteredProjects = computed(() => {
  if (filter.value === 'all') return projects
  return projects.filter(project => project.maturity === filter.value)
})
</script>

<style scoped>
.maturity-filter {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.maturity-filter button {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.maturity-filter button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.maturity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.maturity-card {
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.maturity-card.stable {
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.4);
}

.maturity-card.trending {
  background: linear-gradient(135deg, #dc2626, #f97316);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.4);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.maturity-card.geek {
  background: linear-gradient(135deg, #166534, #65a30d);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(101, 163, 13, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
}

.trending-badge {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: bold;
}

.card-description {
  margin: 10px 0;
  font-size: 14px;
  opacity: 0.9;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  font-size: 14px;
}

.maturity-label {
  opacity: 0.8;
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

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.4);
  }
  50% {
    box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.6);
  }
}

.maturity-list-enter-active,
.maturity-list-leave-active {
  transition: all 0.5s ease;
}

.maturity-list-enter-from,
.maturity-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.maturity-list-move {
  transition: transform 0.5s ease;
}
</style>