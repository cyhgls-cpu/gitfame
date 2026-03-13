import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

// 项目数据接口
export interface Project {
  id: string;
  name: string;
  description: string; // 人工写的描述
  aiDescription?: string; // AI 生成的描述
  domain: string; // 一级分类
  subCategory: string; // 二级分类
  maturity: 'stable' | 'trending' | 'geek'; // 成熟度
  trendingRank?: number; // GitHub Trending 排名
  github?: string; // GitHub 仓库地址
  link: string;
  icon?: string; // 项目图标
  efficiency?: number; // 效率提升百分比
  features: string[];
  tags: string[];
  starChange?: number; // 7 天 Star 变化
  updatedAt?: string; // 更新时间
}

// 分类映射
const domainMap: Record<string, string> = {
  'AI & ML': 'ai-ml',
  'DevTools': 'devtools',
  'Web Stack': 'web-stack',
  'Infra': 'infra',
  'Self-Hosted': 'self-hosted',
  'Resources': 'resources'
};

// 读取项目数据
export function loadProjects(): Project[] {
  const projectsDir = resolve(__dirname, '../data');
  const projects: Project[] = [];

  try {
    // 读取 data 目录下的所有 JSON 文件
    const files = readdirSync(projectsDir, { withFileTypes: true })
      .filter(dirent => dirent.isFile() && dirent.name.endsWith('.json'))
      .map(dirent => dirent.name);

    for (const file of files) {
      const filePath = resolve(projectsDir, file);
      const content = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      if (Array.isArray(data)) {
        projects.push(...data);
      } else if (data && typeof data === 'object') {
        projects.push(data as Project);
      }
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }

  return projects;
}

// 根据一级分类获取项目
export function getProjectsByDomain(domain: string): Project[] {
  const projects = loadProjects();
  return projects.filter(project => project.domain === domain);
}

// 获取所有一级分类
export function getDomains(): string[] {
  const projects = loadProjects();
  const domains = new Set(projects.map(project => project.domain));
  return Array.from(domains);
}

// 获取指定分类下的二级分类
export function getSubCategories(domain: string): string[] {
  const projects = getProjectsByDomain(domain);
  const subCategories = new Set(projects.map(project => project.subCategory));
  return Array.from(subCategories);
}

// 根据成熟度筛选项目
export function getProjectsByMaturity(maturity: 'stable' | 'trending' | 'geek'): Project[] {
  const projects = loadProjects();
  return projects.filter(project => project.maturity === maturity);
}

// 根据标签筛选项目
export function getProjectsByTag(tag: string): Project[] {
  const projects = loadProjects();
  return projects.filter(project => project.tags.includes(tag));
}

// 搜索项目
export function searchProjects(query: string): Project[] {
  const projects = loadProjects();
  const lowerQuery = query.toLowerCase();
  return projects.filter(project => 
    project.name.toLowerCase().includes(lowerQuery) ||
    project.description.toLowerCase().includes(lowerQuery) ||
    project.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// 获取项目详情
export function getProjectById(id: string): Project | undefined {
  const projects = loadProjects();
  return projects.find(project => project.id === id);
}

// 生成分类页面数据
export function generateCategoryPages() {
  const domains = getDomains();
  const pages: Record<string, any> = {};

  domains.forEach(domain => {
    const domainKey = domainMap[domain] || domain.toLowerCase().replace(/\s+/g, '-');
    pages[domainKey] = {
      domain,
      subCategories: getSubCategories(domain),
      projects: getProjectsByDomain(domain)
    };
  });

  return pages;
}
