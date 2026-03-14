const fetch = globalThis.fetch || require('node-fetch');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CACHE_DIR = path.join(__dirname, '../.cache');
const PROJECTS_FILE = path.join(__dirname, '../data/projects.json');
const CACHE_TTL = 15 * 60 * 1000;

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const LANGUAGES = [
  '', 'python', 'javascript', 'typescript', 'go', 'rust', 'java', 'c++', 'c', 'swift', 'kotlin'
];

const TIME_RANGES = ['daily', 'weekly', 'monthly'];

function getCacheKey(language, since) {
  const data = `${language || 'all'}-${since}`;
  return crypto.createHash('md5').update(data).digest('hex');
}

function getCache(language, since) {
  const key = getCacheKey(language, since);
  const cacheFile = path.join(CACHE_DIR, `trending-${key}.json`);
  
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

function setCache(language, since, data) {
  const key = getCacheKey(language, since);
  const cacheFile = path.join(CACHE_DIR, `trending-${key}.json`);
  
  try {
    fs.writeFileSync(cacheFile, JSON.stringify({
      data,
      cachedAt: Date.now(),
      language,
      since
    }, null, 2));
  } catch (e) {
    console.error('Cache write error:', e.message);
  }
}

function parseTrendingHTML(html, limit = 50) {
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

async function fetchGitHubTrending(language = '', since = 'daily', limit = 50) {
  const cached = getCache(language, since);
  if (cached) {
    console.log(`  [Cache] ${language || 'all'}/${since}`);
    return cached;
  }
  
  const langParam = language ? `/${language}` : '';
  const url = `https://github.com/trending${langParam}?since=${since}`;
  
  console.log(`  [Fetch] ${language || 'all'}/${since}`);
  
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
    
    setCache(language, since, projects);
    
    return projects;
  } catch (error) {
    console.error(`  [Error] ${language}/${since}:`, error.message);
    return [];
  }
}

function classifyProject(project) {
  const name = project.name.toLowerCase();
  const desc = project.description.toLowerCase();
  const owner = project.owner.toLowerCase();
  const fullText = `${name} ${desc} ${owner}`;
  
  const aiKeywords = ['ai', 'llm', 'llm', 'agent', 'gpt', 'chat', 'model', 'train', 'inference', 'rag', 'embedding', 'nlp', 'vision', 'image', 'video', 'audio', 'speech', 'tts', 'stt', 'whisper', 'diffusion', 'stable', '生成', '智能', '大模型', '模型'];
  if (aiKeywords.some(k => fullText.includes(k))) {
    return { domain: 'AI & ML', subCategory: 'AI 综合' };
  }
  
  const devKeywords = ['dev', 'tool', 'cli', 'code', 'ide', 'editor', 'debug', 'test', 'git', 'github', 'docker', 'kubernetes', 'deploy', 'build', 'ci', 'cd', 'monitor', 'logging', 'api', 'server', 'framework', 'sdk', 'library', 'parser', 'linter', 'formatter'];
  if (devKeywords.some(k => fullText.includes(k))) {
    return { domain: 'DevTools', subCategory: '开发工具' };
  }
  
  const webKeywords = ['web', 'frontend', 'frontend', 'react', 'vue', 'angular', 'svelte', 'next', 'nuxt', 'node', 'http', 'browser', 'ui', 'css', 'html', 'javascript', 'typescript', 'component'];
  if (webKeywords.some(k => fullText.includes(k))) {
    return { domain: 'Web Stack', subCategory: 'Web 开发' };
  }
  
  const infraKeywords = ['cloud', 'infra', 'infrastructure', 'aws', 'azure', 'gcp', 'kubernetes', 'k8s', 'docker', 'serverless', 'edge', 'runtime', 'vm', 'virtual'];
  if (webKeywords.some(k => fullText.includes(k))) {
    return { domain: 'Infra', subCategory: '基础设施' };
  }
  
  const securityKeywords = ['security', 'sec', 'hack', 'vuln', 'crypto', 'auth', 'password', 'encryption', 'scan', 'pentest', 'firewall'];
  if (securityKeywords.some(k => fullText.includes(k))) {
    return { domain: 'DevTools', subCategory: '安全工具' };
  }
  
  const dataKeywords = ['data', 'database', 'db', 'sql', 'nosql', 'redis', 'mongo', 'postgres', 'mysql', 'cache', 'stream', 'pipeline', 'etl'];
  if (dataKeywords.some(k => fullText.includes(k))) {
    return { domain: 'Infra', subCategory: '数据存储' };
  }
  
  return { domain: 'Resources', subCategory: '综合资源' };
}

function getMaturity(project) {
  const owner = project.owner.toLowerCase();
  const stableOwners = ['microsoft', 'google', 'meta', 'facebook', 'apple', 'amazon', 'aws', 'alibaba', 'tencent', 'baidu', 'bytedance', 'nvidia', 'anthropic', 'openai', 'stanford', 'mit', 'apache', 'linux', 'mozilla'];
  
  if (stableOwners.some(o => owner.includes(o))) {
    return 'stable';
  }
  
  if (project.starsToday > 500) {
    return 'trending';
  }
  
  return 'geek';
}

function loadExistingProjects() {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading projects:', e.message);
  }
  return [];
}

function saveProjects(projects) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

async function scrapeAll() {
  console.log('🚀 开始抓取 GitHub Trending...\n');
  
  const allProjects = [];
  let totalFetched = 0;
  
  for (const since of TIME_RANGES) {
    console.log(`📅 抓取 ${since.toUpperCase()} 趋势...`);
    
    for (const language of LANGUAGES) {
      const projects = await fetchGitHubTrending(language, since, 30);
      
      for (const p of projects) {
        if (!allProjects.find(existing => existing.github === p.github)) {
          const classification = classifyProject(p);
          const maturity = getMaturity(p);
          
          allProjects.push({
            id: p.id,
            name: p.name,
            description: p.description,
            domain: classification.domain,
            subCategory: classification.subCategory,
            maturity,
            trendingRank: totalFetched + 1,
            since: since,
            language: language || 'all',
            starsToday: p.starsToday,
            github: p.github,
            link: p.link,
            tags: [classification.domain.toLowerCase().replace(/\s+/g, '-'), since],
            fetchedAt: new Date().toISOString()
          });
          
          totalFetched++;
        }
      }
      
      await new Promise(r => setTimeout(r, 1000));
    }
    
    console.log(`  ✓ ${since} 完成\n`);
  }
  
  const existingProjects = loadExistingProjects();
  const existingIds = new Set(existingProjects.map(p => p.id));
  
  const newProjects = allProjects.filter(p => !existingIds.has(p.id));
  
  const mergedProjects = [...existingProjects, ...newProjects];
  
  mergedProjects.sort((a, b) => (b.starsToday || 0) - (a.starsToday || 0));
  
  saveProjects(mergedProjects);
  
  console.log('\n✅ 抓取完成！');
  console.log(`   新增项目: ${newProjects.length}`);
  console.log(`   项目总数: ${mergedProjects.length}`);
  console.log(`   文件位置: ${PROJECTS_FILE}`);
  
  const domainStats = {};
  mergedProjects.forEach(p => {
    domainStats[p.domain] = (domainStats[p.domain] || 0) + 1;
  });
  
  console.log('\n📊 分类统计:');
  Object.entries(domainStats).forEach(([domain, count]) => {
    console.log(`   ${domain}: ${count}`);
  });
}

if (require.main === module) {
  scrapeAll().catch(console.error);
}

module.exports = { scrapeAll, fetchGitHubTrending };
