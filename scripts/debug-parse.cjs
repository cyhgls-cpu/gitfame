const fs = require('fs');

const html = fs.readFileSync('debug.html', 'utf-8');

function parseTrending(html, limit = 25) {
  const projects = [];
  
  const articleRegex = /<article[^>]*class="Box-row"[^>]*>([\s\S]*?)<\/article>/g;
  let articleMatch;
  let count = 0;
  
  while ((articleMatch = articleRegex.exec(html)) !== null && count < limit) {
    const article = articleMatch[1];
    
    // 找到仓库链接
    const linkMatch = article.match(/<a\s+[^>]*href="(\/[^"]+)"[^>]*class="[^"]*Link[^"]*"[^>]*>/);
    if (!linkMatch) continue;
    
    const repoPath = linkMatch[1].replace(/^\//, '');
    if (!repoPath || repoPath.includes('/login') || repoPath.includes('#')) continue;
    
    const parts = repoPath.split('/');
    if (parts.length < 2) continue;
    
    const owner = parts[0];
    const name = parts[1];
    
    // 找到描述
    const descMatch = article.match(/<p[^>]*>([^<]+)<\/p>/);
    const description = descMatch ? descMatch[1].trim().substring(0, 200) : '';
    
    // 找到今日 star 数
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

const projects = parseTrending(html, 25);

console.log(`Found ${projects.length} projects\n`);

projects.forEach((p, i) => {
  console.log(`${i+1}. ${p.owner}/${p.name}`);
  console.log(`   Stars today: ${p.starsToday}`);
  console.log(`   Desc: ${p.description.substring(0, 80)}...`);
  console.log();
});
