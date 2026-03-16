const fetch = globalThis.fetch || require('node-fetch');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CACHE_DIR = path.join(__dirname, '../.cache');
const CACHE_TTL = 15 * 60 * 1000;

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function getCacheKey(language, since, limit) {
  const data = `${language || 'all'}-${since}-${limit || 25}`;
  return crypto.createHash('md5').update(data).digest('hex');
}

function getCache(language, since, limit) {
  const key = getCacheKey(language, since, limit);
  const cacheFile = path.join(CACHE_DIR, `${key}.json`);
  
  try {
    if (fs.existsSync(cacheFile)) {
      const stats = fs.statSync(cacheFile);
      const age = Date.now() - stats.mtimeMs;
      
      if (age < CACHE_TTL) {
        const fileContent = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
        return fileContent.data;
      }
    }
  } catch (e) {}
  
  return null;
}

function setCache(language, since, limit, data) {
  const key = getCacheKey(language, since, limit);
  const cacheFile = path.join(CACHE_DIR, `${key}.json`);
  
  try {
    fs.writeFileSync(cacheFile, JSON.stringify({
      data,
      cachedAt: Date.now()
    }, null, 2));
  } catch (e) {}
}

function parseTrendingHTML(html, limit = 25) {
  const projects = [];
  
  const articleRegex = /<article[^>]*class="Box-row"[^>]*>([\s\S]*?)<\/article>/g;
  let articleMatch;
  let count = 0;
  
  while ((articleMatch = articleRegex.exec(html)) !== null && count < limit) {
    const article = articleMatch[1];
    
    const linkMatch = article.match(/<a\s+[^>]*href="(\/[^"]+)"[^>]*class="[^"]*Link[^"]*"[^>]*>/);
    if (!linkMatch) continue;
    
    const repoPath = linkMatch[1].replace(/^\//, '');
    if (!repoPath || repoPath.includes('/login') || repoPath.includes('#')) continue;
    
    const parts = repoPath.split('/');
    if (parts.length < 2) continue;
    
    const owner = parts[0];
    const name = parts[1];
    
    const descMatch = article.match(/<p[^>]*>([^<]+)<\/p>/);
    const description = descMatch ? descMatch[1].trim().substring(0, 200) : '';
    
    const starMatch = article.match(/(\d+[\d,]*)\s*stars?\s*(?:today)?/i);
    const starsToday = starMatch ? parseInt(starMatch[1].replace(/,/g, '')) : 0;
    
    projects.push({
      id: `${owner}-${name}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      name,
      owner,
      description,
      starsToday,
      github: repoPath,
      link: `https://github.com/${repoPath}`
    });
    
    count++;
  }
  
  return projects.sort((a, b) => b.starsToday - a.starsToday);
}

async function fetchGitHubTrending(language = '', since = 'daily', limit = 25) {
  const cached = getCache(language, since, limit);
  if (cached) {
    return cached;
  }
  
  const langParam = language ? `/${language}` : '';
  const url = `https://github.com/trending${langParam}?since=${since}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const html = await response.text();
    const projects = parseTrendingHTML(html, limit);
    
    setCache(language, since, limit, projects);
    
    return projects;
  } catch (error) {
    console.error('Fetch error:', error.message);
    return [];
  }
}

async function main() {
  const PROJECTS_FILE = path.join(__dirname, '../data/projects.json');
  
  // 读取现有项目
  let existingProjects = [];
  if (fs.existsSync(PROJECTS_FILE)) {
    existingProjects = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
  }
  
  const seen = new Map();
  existingProjects.forEach(p => seen.set(p.github.toLowerCase(), p));
  
  // 分别抓取日榜、周榜、月榜
  const timeframes = [
    { since: 'daily', label: '日榜', maturity: 'trending' },
    { since: 'weekly', label: '周榜', maturity: 'stable' },
    { since: 'monthly', label: '月榜', maturity: 'geek' }
  ];
  
  let totalCount = 0;
  let newCount = 0;
  
  for (const { since, label, maturity } of timeframes) {
    console.log(`\n📊 抓取 GitHub Trending ${label}...`);
    
    const projects = await fetchGitHubTrending('', since, 25);
    console.log(`   获取到 ${projects.length} 个项目`);
    
    for (const project of projects) {
      const key = project.github.toLowerCase();
      
      if (seen.has(key)) {
        // 更新现有项目
        const existing = seen.get(key);
        if (!existing.maturity || existing.maturity === 'geek') {
          existing.maturity = maturity; // 升级到更高优先级
        }
      } else {
        // 添加新项目
        const newProject = {
          ...project,
          maturity,
          createdAt: new Date().toISOString()
        };
        existingProjects.push(newProject);
        seen.set(key, newProject);
        newCount++;
        totalCount++;
      }
    }
  }
  
  // 保存
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(existingProjects, null, 2), 'utf-8');
  
  console.log(`\n✅ 完成！新增 ${totalCount} 个项目，更新 ${existingProjects.length - totalCount} 个现有项目`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { fetchGitHubTrending, parseTrendingHTML };
