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
  const data = `${language || 'all'}-${since || 'daily'}-${limit || 25}`;
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
  const language = process.argv[2] || '';
  const since = process.argv[3] || 'daily';
  const limit = parseInt(process.argv[4]) || 25;
  
  const projects = await fetchGitHubTrending(language, since, limit);
  
  console.log(`Fetched ${projects.length} trending projects (${language || 'all'}, ${since})`);
  
  projects.slice(0, 10).forEach((p, i) => {
    console.log(`${i+1}. ${p.owner}/${p.name} - ${p.starsToday} stars today`);
  });
}

if (require.main === module) {
  main();
}

module.exports = { fetchGitHubTrending, parseTrendingHTML };
