const fetch = globalThis.fetch || require('node-fetch');
const fs = require('fs');

const url = 'https://github.com/trending/python?since=daily';

async function debug() {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }
  });
  
  const html = await response.text();
  
  // Save for inspection
  fs.writeFileSync('debug.html', html);
  console.log('HTML saved to debug.html');
  
  // Try different patterns
  const patterns = [
    /<article/g,
    /Box-row/g,
    /class="Link"/g,
    /data-hydro-click/g,
  ];
  
  patterns.forEach(p => {
    const matches = html.match(p);
    console.log(`Pattern ${p}: ${matches ? matches.length : 0} matches`);
  });
  
  // Show a sample of the HTML
  const sampleStart = html.indexOf('<article');
  const sample = html.slice(sampleStart, sampleStart + 2000);
  console.log('\n=== Sample HTML ===');
  console.log(sample);
}

debug();
