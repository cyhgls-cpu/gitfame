const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./data/projects.json', 'utf8'));

const subCategoryRules = {
  // AI & ML - 增强版
  'LLM 框架': [
    'llm', 'gpt', 'qwen', 'claude', 'gemini', 'openai', 'ollama', 'litellm', 'vllm',
    'text-generation', 'llama', 'mistral', 'phi', 'chatglm', 'yi', 'baichuan',
    'minimax', 'tongyi', 'ERNIE', 'kobold', 'text-generation-webui', 'lm-studio',
    'guidance', 'outlines', 'inference', 'serving', 'api', 'openai-compatible'
  ],
  'AI Agent': [
    'agent', 'agent-', '-agent', 'claude-code', 'claude code', 'cursor', 'agentic',
    'crew', 'auto', 'browser-use', 'agentbrowser', 'openclaw', 'devin', ' Manus',
    'superagent', 'autogen', 'langgraph', 'langchain', 'langroid', 'smolagents',
    'taskmatrix', 'meta-agent', 'multi-agent', 'camel-ai', 'roocode'
  ],
  '本地大模型': [
    'local', 'ollama', 'llamafile', 'mlc', 'gpt4all', 'lora', 'finetune', '量化',
    'quantize', 'gguf', 'ggml', 'model merger', 'model merging', 'lora', 'qlora',
    'alpacajs', 'web-llm', 'mlc-llm', 'llama.cpp', 'gpt4all-j', 'oobabooga'
  ],
  '图像/视频生成': [
    'image', 'video', 'stable-diffusion', 'comfyui', 'sd-webui', 'diffusion', 'sdxl',
    'flux', 'video-', 'animated', '生成', 'sd', 'automatic1111', 'invokeai', 'fooocus',
    'animatediff', 'motion', 'video-gen', 'text-to-video', 'text-to-image', 'img2img',
    'controlnet', 'lora', 'vae', 'embedding', 'upscale', 'a1111', 'sadtalker', 'wav2lip'
  ],
  'AI 编程': [
    'ai编程', 'ai coding', 'code assistant', 'code generation', 'copilot', 'codeium',
    'tabnine', 'amazon-codewhisperer', 'code-ge', 'ai-code', '智能编程', 'ai-complete'
  ],
  'AI 语音': [
    'tts', 'stt', 'speech', 'voice', 'whisper', 'coqui', 'bark', 'elevenlabs', 'vits',
    'fish-tts', 'parler', 'speech-to-text', 'text-to-speech', '语音识别', '语音合成'
  ],
  'AI RAG': [
    'rag', 'retrieval', 'vector', 'embedding', 'pinecone', 'weaviate', 'chroma',
    'qdrant', 'milvus', 'faiss', 'langchain', 'llamaindex', 'ragflow', 'anything-llm',
    'open-webui', 'embed', 'rerank', 'hybrid-search', 'ragas', 'rag-'
  ],

  // DevTools - 增强版
  '终端增强': [
    'terminal', 'term', 'cli', 'shell', 'zsh', 'fish', 'iterm', 'alacritty', 'kitty',
    'wezterm', 'ghostty', 'powershell', 'cmd', 'wt', 'windows-terminal', 'hyper',
    'starship', 'oh-my-zsh', 'oh-my-fish', 'fzf', 'zoxide', 'eza', 'bat', 'htop',
    'btop', 'bottom', 'glances', 'lazydocker', 'lazygit', 'tldr', 'cheat'
  ],
  'API 工具': [
    'api', 'postman', 'insomnia', 'bruno', 'hoppscotch', 'rest', 'graphql', 'swagger',
    'openapi', 'api-client', 'apifox', 'apipost', 'yapi', 'knife4j', 'swagger-editor',
    'api-doc', 'api-explorer', 'http-client', 'postwoman'
  ],
  'IDE 插件': [
    'vscode', 'idea', 'jetbrains', 'vim', 'neovim', 'emacs', 'extension', 'plugin',
    'copilot', 'vscode-plugin', 'idea-plugin', 'neovim-plugin', 'nvim', 'nvim-cmp',
    'telescope', 'fzf-vim', 'coc.nvim', 'lazyvim', 'astrovim', 'spacevim'
  ],
  '测试/调试': [
    'test', 'debug', 'mock', 'faker', 'playwright', 'cypress', 'vitest', 'jest',
    'unittest', 'junit', 'pytest', 'mocha', 'jasmine', 'ava', 'tape', 'bun-test',
    'testing-library', 'msw', 'miragejs', 'json-server', 'wiremock', 'mockoon',
    'locust', 'k6', 'artillery', ' siege', 'boom'
  ],
  '开发工具': [
    'tool', 'dev', 'developer', 'utility', 'utils', 'helper', 'boilerplate', 'starter',
    'template', 'scaffold', 'generator', 'cli-tool', 'toolkit', 'toolbox', 'snippets'
  ],

  // Web Stack - 增强版
  '全栈框架': [
    'nextjs', 'nuxt', 'astro', 'remix', 'sveltekit', 'solidstart', 'react', 'vue',
    'angular', 'svelte', 'django', 'rails', 'spring', 'fastapi', 'express', 'koa',
    'nestjs', 'gin', 'fiber', 'laravel', 'symfony', 'flask', 'bottle', 'tornado',
    'aspnet', 'blazor', 'next.js', 'nuxtjs', 'solidjs', 'qwik', 'fresh', 'hono'
  ],
  'UI 组件库': [
    'ui', 'component', 'antd', 'shadcn', 'radix', 'headlessui', 'material', 'chakra',
    'element', 'vuetify', 'quasar', 'primeng', 'ionic', 'framework7', 'svelte-ui',
    'daisyui', 'tailblocks', 'meraki', 'react-bootstrap', 'react-native-web', 'chakra-ui'
  ],
  '低代码': [
    'lowcode', 'nocode', 'builder', 'form', 'visual', 'drag-drop', 'grapesjs',
    'builder.io', 'appsmith', 'budibase', 'refine', 'nocodb', 'appsheet', 'bubble',
    'retool', 'tooljet', 'ILLA Builder', 'filament'
  ],
  '动效/可视化': [
    'animation', 'animate', 'motion', 'threejs', 'canvas', 'chart', 'd3', 'echarts',
    'vis', 'graph', 'timeline', 'videojs', 'player', 'gsap', 'framer-motion', 'animejs',
    'motion-one', 'popmotion', 'velocity', 'vivus', 'particles', 'tsparticles',
    'chart.js', 'apexcharts', 'visx', 'recharts', 'nivo', 'react-flow', 'xyflow'
  ],

  // Infra - 增强版
  '数据库': [
    'database', 'db', 'mysql', 'postgres', 'postgresql', 'mongodb', 'redis', 'sqlite',
    'mariadb', 'tidb', 'cockroachdb', 'dynamodb', 'supabase', 'prisma', 'drizzle',
    'neon', 'planetscale', 'clickhouse', 'duckdb', 'typesense', 'orama', 'pglite',
    'libsql', 'rqlite', 'termdb', 'nanodb', 'vector-db'
  ],
  '缓存': [
    'cache', 'redis', 'memcached', 'valkey', 'keydb', 'dragonfly', 'pemberly',
    'cache-manager', 'node-cache', 'memory-cache', 'quick-lru', 'lru-cache'
  ],
  '容器': [
    'docker', 'container', 'kubernetes', 'k8s', 'helm', 'podman', 'containerd',
    'cri-o', 'rancher', 'k3s', 'minikube', 'kind', 'docker-compose', 'dockerfile',
    'buildkit', 'buildx', 'dive', 'ctop', 'dry', 'portainer'
  ],
  '云原生': [
    'cloud-native', 'cloud', 'serverless', 'faas', 'knative', 'istio', 'linkerd',
    'envoy', 'traefik', 'nginx', 'ingress', 'prometheus', 'grafana', 'jaeger',
    'opentelemetry', 'argo', 'flux', 'crossplane', 'terraform', 'ansible', 'pulumi'
  ],

  // Self-Hosted - 增强版
  '云服务替代品': [
    'self-hosted', 'alternative', '替代', 'selfhost', 'home-lab', 'homelab',
    '替代', '开源替代', 'open-source alternative', 'notion-alternative', 'slack-alternative',
    'airtable-alternative', 'trello-alternative', 'asana-alternative'
  ],
  '家庭实验室': [
    'home-assistant', 'homeassistant', 'home-lab', 'homelab', 'smart-home', 'homekit',
    'mqtt', 'zigbee', 'zha', 'homebridge', 'esphome', 'iobroker', 'openhab',
    'smartthings', 'hubitat', 'frigate', 'zwavejs', 'zigbee2mqtt'
  ],
  '私人影音': [
    'media', 'plex', 'jellyfin', 'emby', 'sonarr', 'radarr', 'lidarr', 'bazarr',
    'overseerr', 'tautulli', 'video', 'movie', 'anime', 'music', 'jellyseerr',
    'prowlarr', 'sabnzbd', 'nzbget', 'torrents', 'qbittorrent', 'transmission'
  ],
  '自动化': [
    'automation', 'automate', 'n8n', 'automations', 'workflow', 'pipe', 'trigger',
    'cron', 'ifttt', 'home-assistant', 'make', 'zapier', 'pipedream', 'shortcuts',
    'tasker', 'macro', 'automator', 'huginn', 'node-red', 'iobroker'
  ],

  // Resources - 增强版
  '教程': [
    'tutorial', 'course', 'learn', '教程', '入门', 'guide', 'getting-started', 'doc',
    'handbook', 'bootcamp', 'workshop', 'lesson', 'learn-x', 'awesome-', 'mdbook',
    'docz', 'storybook', 'typedoc', 'jsdoc', 'swagger-ui', 'redoc'
  ],
  '文档': [
    'docs', 'documentation', 'doc', 'wiki', 'readme', 'spec', 'rfc', 'api-doc',
    'devdocs', 'devto', 'readme.so', 'readme-md', 'docusaurus', 'gitbook', 'mintlify'
  ],
  '学习资源': [
    'awesome', 'list', 'collection', 'resource', 'book', 'paper', 'course', 'learn',
    'tutorial', 'papers-with-code', 'arxiv', 'papers', 'cheatsheet', 'cheat-sheet',
    'knowledge', 'mindmap', 'roadmap', 'interview', 'algorithm', 'data-structure'
  ],
  'API集合': [
    'api-list', 'public-apis', 'api-collection', 'free-api', 'openapi', 'api-gateway',
    'any-api', 'public-apis', 'apilist', 'apis-you-wont-hate', 'developer-api'
  ]
};

const domainRules = {
  'AI & ML': [
    'ai', 'ml', 'machine learning', 'deep learning', 'llm', 'gpt', 'neural', 'gpu',
    'tensor', 'model', 'train', 'infer', 'nlp', 'cv', 'computer vision', 'llama',
    'gemma', 'mistral', 'qwen', 'yi', 'chatbot', 'conversation', 'prompt', 'rag',
    'vector', 'embedding', 'token', 'tokenizer', 'transformer', 'diffusion', 'genai'
  ],
  'DevTools': [
    'cli', 'terminal', 'tool', 'dev', 'developer', 'debug', 'test', 'ide', 'plugin',
    'extension', 'api client', 'postman', 'utility', 'utils', 'boilerplate', 'scaffold'
  ],
  'Web Stack': [
    'web', 'frontend', 'backend', 'fullstack', 'react', 'vue', 'angular', 'node',
    'javascript', 'typescript', 'html', 'css', 'ui', 'framework', 'library', 'component',
    'ssr', 'ssg', 'spa', 'pwa', 'bundle', 'webpack', 'vite', 'rollup'
  ],
  'Infra': [
    'docker', 'kubernetes', 'k8s', 'cloud', 'infra', 'infrastructure', 'server',
    'database', 'db', 'cache', 'container', 'devops', 'ci', 'cd', 'pipeline',
    'monitoring', 'logging', 'observability'
  ],
  'Self-Hosted': [
    'self-hosted', 'selfhost', 'home', 'media', 'plex', 'jellyfin', 'automation',
    'homeassistant', 'nas', 'homelab', 'home-lab', 'smart-home', 'iot'
  ],
  'Resources': [
    'awesome', 'list', 'resource', 'learn', 'tutorial', 'doc', 'documentation',
    'api collection', 'books', 'papers', 'course', 'cheatsheet', 'roadmap'
  ]
};

function classifySubCategory(project) {
  const text = (project.name + ' ' + (project.description || '') + ' ' + (project.subCategory || '') + ' ' + (project.tags?.join(' ') || '')).toLowerCase();
  
  let bestMatch = null;
  let bestScore = 0;

  for (const [subCategory, keywords] of Object.entries(subCategoryRules)) {
    let score = 0;
    const lowerKeywords = keywords.map(k => k.toLowerCase());
    
    for (const keyword of lowerKeywords) {
      if (text.includes(keyword)) {
        score++;
      }
      const nameLower = project.name.toLowerCase();
      if (nameLower.includes(keyword)) {
        score += 2;
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = subCategory;
    }
  }

  if (bestScore > 0) {
    return bestMatch;
  }

  const domainDefaults = {
    'AI & ML': 'LLM 框架',
    'DevTools': '开发工具',
    'Web Stack': 'Web 开发',
    'Infra': '数据库',
    'Self-Hosted': '云服务替代品',
    'Resources': '学习资源'
  };

  return domainDefaults[project.domain] || '学习资源';
}

function classifyDomain(project) {
  const text = (project.name + ' ' + (project.description || '') + ' ' + (project.tags?.join(' ') || '')).toLowerCase();
  
  let bestDomain = 'Resources';
  let bestScore = 0;

  for (const [domain, keywords] of Object.entries(domainRules)) {
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score++;
      }
      const nameLower = project.name.toLowerCase();
      if (nameLower.includes(keyword.toLowerCase())) {
        score += 3;
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestDomain = domain;
    }
  }

  return bestDomain;
}

function calculateMaturity(project) {
  const text = (project.name + ' ' + (project.description || '') + ' ' + (project.tags?.join(' ') || '')).toLowerCase();
  
  const trendingKeywords = ['trending', 'popular', 'viral', 'breaking', 'new release', 'latest', 'hot', '🔥', 'new', 'v1', 'v2.0'];
  const stableKeywords = ['stable', 'production', 'mature', 'reliable', 'widely used', 'industry standard', 'enterprise', 'battle-tested', 'production-ready', 'deprecated', 'maintained', 'LTS', 'v3', 'v4', 'v5', 'legacy'];
  const geekKeywords = ['experimental', 'beta', 'alpha', 'hack', 'DIY', 'research', 'prototype', 'fun', 'toy', 'minimal', 'wip', 'draft', 'concept'];
  
  let trendingScore = 0, stableScore = 0, geekScore = 0;
  
  for (const kw of trendingKeywords) {
    if (text.includes(kw)) trendingScore += 1.5;
  }
  for (const kw of stableKeywords) {
    if (text.includes(kw)) stableScore += 2;
  }
  for (const kw of geekKeywords) {
    if (text.includes(kw)) geekScore += 1.5;
  }
  
  // Trending 排名高 = trending
  if (project.trendingRank && project.trendingRank <= 30) trendingScore += 4;
  else if (project.trendingRank && project.trendingRank <= 100) trendingScore += 2;
  
  // 今日 star 多 = trending
  if (project.starsToday && project.starsToday > 500) trendingScore += 4;
  else if (project.starsToday && project.starsToday > 100) trendingScore += 2;
  
  // 有大量 stars = stable (假设是成熟项目)
  // 注意: 当前数据没有 totalStars 字段，需要通过 GitHub API 获取
  // 暂时用项目名称判断是否是"经典"项目
  const classicPatterns = ['react', 'vue', 'angular', 'node', 'django', 'rails', 'spring', 'flask', 'express', 'kubernetes', 'docker', 'nginx', 'redis', 'mysql', 'postgres', 'mongodb', 'tensorflow', 'pytorch', 'babel', 'webpack', 'vite', 'eslint', 'prettier', 'tailwind', 'bootstrap', 'lodash', 'axios', 'request', 'pm2', 'forever'];
  for (const pattern of classicPatterns) {
    if (project.name.toLowerCase().includes(pattern)) {
      stableScore += 3;
      trendingScore -= 1; // 经典项目不算 trending
    }
  }
  
  // AI/ML 领域的新项目默认 trending
  if (project.domain === 'AI & ML' && !classicPatterns.some(p => project.name.toLowerCase().includes(p))) {
    trendingScore += 1;
  }
  
  if (trendingScore > stableScore && trendingScore > geekScore) return 'trending';
  if (stableScore > geekScore) return 'stable';
  return 'geek';
}

console.log(`开始处理 ${data.length} 个项目...\n`);

let domainUpdated = 0;
let subUpdated = 0;
let maturityUpdated = 0;

for (const project of data) {
  let changed = false;
  
  if (!project.domain || project.domain === 'Resources') {
    const newDomain = classifyDomain(project);
    if (newDomain !== project.domain) {
      project.domain = newDomain;
      domainUpdated++;
      changed = true;
    }
  }
  
  const newSubCategory = classifySubCategory(project);
  if (newSubCategory !== project.subCategory) {
    project.subCategory = newSubCategory;
    subUpdated++;
    changed = true;
  }
  
  const newMaturity = calculateMaturity(project);
  if (newMaturity !== project.maturity) {
    project.maturity = newMaturity;
    maturityUpdated++;
    changed = true;
  }
}

console.log(`分类更新统计:`);
console.log(`  - Domain 更新: ${domainUpdated}`);
console.log(`  - SubCategory 更新: ${subUpdated}`);
console.log(`  - Maturity 更新: ${maturityUpdated}`);

// 统计分类
const domainStats = {};
const subStats = {};
const maturityStats = {};

for (const p of data) {
  domainStats[p.domain] = (domainStats[p.domain] || 0) + 1;
  subStats[p.subCategory] = (subStats[p.subCategory] || 0) + 1;
  maturityStats[p.maturity] = (maturityStats[p.maturity] || 0) + 1;
}

console.log(`\nDomain 分布:`);
for (const [d, c] of Object.entries(domainStats).sort((a,b) => b[1]-a[1])) {
  console.log(`  ${d}: ${c}`);
}

console.log(`\nSubCategory 分布 (Top 10):`);
for (const [s, c] of Object.entries(subStats).sort((a,b) => b[1]-a[1]).slice(0, 10)) {
  console.log(`  ${s}: ${c}`);
}

console.log(`\nMaturity 分布:`);
for (const [m, c] of Object.entries(maturityStats).sort((a,b) => b[1]-a[1])) {
  console.log(`  ${m}: ${c}`);
}

fs.writeFileSync('./data/projects.json', JSON.stringify(data, null, 2), 'utf8');
console.log('\n已保存到 data/projects.json');

fs.writeFileSync('./docs/public/data/projects.json', JSON.stringify(data, null, 2), 'utf8');
console.log('已保存到 docs/public/data/projects.json');
