const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./data/projects.json', 'utf8'));

const subCategoryRules = {
  // AI & ML
  'LLM 框架': ['llm', 'gpt', 'qwen', 'claude', 'gemini', 'openai', 'ollama', 'litellm', 'vllm', 'text-generation', 'llama', 'mistral', 'phi'],
  'AI Agent': ['agent', 'agent-', '-agent', 'claude-code', 'claude code', 'cursor', 'agentic', 'crew', 'auto', 'browser-use', 'agentbrowser', 'openclaw'],
  '本地大模型': ['local', 'ollama', 'llamafile', 'mlc', 'gpt4all', 'lora', 'finetune', '量化', 'quantize'],
  '图像/视频生成': ['image', 'video', 'stable-diffusion', 'comfyui', 'sd-webui', 'diffusion', 'sdxl', 'flux', 'video-', 'animated', ' 生成'],

  // DevTools
  '终端增强': ['terminal', 'term', 'cli', 'shell', 'zsh', 'fish', 'iterm', 'alacritty', 'kitty', 'wezterm', 'ghostty'],
  'API 工具': ['api', 'postman', 'insomnia', 'bruno', 'hoppscotch', 'rest', 'graphql', 'swagger', 'openapi'],
  'IDE 插件': ['vscode', 'idea', 'jetbrains', 'vim', 'neovim', 'emacs', 'extension', 'plugin', 'copilot'],
  '测试/调试': ['test', 'debug', 'mock', 'faker', 'playwright', 'cypress', 'vitest', 'jest', 'unittest', 'junit'],

  // Web Stack
  '全栈框架': ['nextjs', 'nuxt', 'astro', 'remix', 'sveltekit', 'solidstart', 'react', 'vue', 'angular', 'svelte', 'django', 'rails', 'spring', 'fastapi', 'express', 'koa', 'nestjs', 'gin', 'fiber', 'laravel', 'symfony'],
  'UI 组件库': ['ui', 'component', 'antd', 'shadcn', 'radix', 'headlessui', 'material', 'chakra', 'element', 'vuetify', 'quasar', 'primeng'],
  '低代码': ['lowcode', 'nocode', 'builder', 'form', 'visual', 'drag-drop', 'grapesjs', 'builder.io'],
  '动效/可视化': ['animation', 'animate', 'motion', 'threejs', 'canvas', 'chart', 'd3', 'echarts', 'vis', 'graph', 'timeline', 'videojs', 'player'],

  // Infra
  '数据库': ['database', 'db', 'mysql', 'postgres', 'postgresql', 'mongodb', 'redis', 'sqlite', 'mariadb', 'tidb', 'cockroachdb', 'dynamodb', 'supabase', 'prisma', 'drizzle', 'neon', 'planetscale', 'clickhouse'],
  '缓存': ['cache', 'redis', 'memcached', ' Valkey', 'keydb', 'dragonfly'],
  '容器': ['docker', 'container', 'kubernetes', 'k8s', 'helm', 'podman', 'containerd', 'cri-o', 'rancher', 'k3s', 'minikube', 'kind'],
  '云原生': ['cloud-native', 'cloud', 'serverless', 'faas', 'knative', 'istio', 'linkerd', 'envoy', 'traefik', 'nginx', 'ingress', 'prometheus', 'grafana', 'jaeger', 'opentelemetry', 'argo', 'flux', 'crossplane'],

  // Self-Hosted
  '云服务替代品': ['self-hosted', 'alternative', '替代', 'selfhost', 'home-lab', 'homelab'],
  '家庭实验室': ['home-assistant', 'homeassistant', 'home-lab', 'homelab', 'smart-home', 'homekit', 'mqtt', 'zigbee', 'zha'],
  '私人影音': ['media', 'plex', 'jellyfin', 'emby', 'sonarr', 'radarr', 'lidarr', 'bazarr', 'overseerr', 'tautulli', 'video', 'movie', 'anime', 'music'],
  '自动化': ['automation', 'automate', 'n8n', 'automations', 'workflow', 'pipe', 'trigger', 'cron', 'ifttt', 'home-assistant'],

  // Resources
  '教程': ['tutorial', 'course', 'learn', '教程', '入门', 'guide', 'getting-started', 'doc', 'handbook'],
  '文档': ['docs', 'documentation', 'doc', 'wiki', 'readme', 'spec', 'rfc'],
  '学习资源': ['awesome', 'list', 'collection', 'resource', 'book', 'paper', 'course', 'learn', 'tutorial'],
  'API集合': ['api-list', 'public-apis', 'api-collection', 'free-api', 'openapi', 'api-gateway']
};

function classifySubCategory(project) {
  const text = (project.name + ' ' + (project.description || '') + ' ' + (project.subCategory || '')).toLowerCase();

  for (const [subCategory, keywords] of Object.entries(subCategoryRules)) {
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return subCategory;
      }
    }
  }

  // 根据 domain 默认分类
  const domainDefaults = {
    'AI & ML': 'LLM 框架',
    'DevTools': '开发工具',
    'Web Stack': 'Web 开发',
    'Infra': '数据存储',
    'Self-Hosted': '云服务替代品',
    'Resources': '综合资源'
  };

  return domainDefaults[project.domain] || '综合资源';
}

function classifyDomain(project) {
  const text = (project.name + ' ' + (project.description || '')).toLowerCase();

  // AI & ML 关键词
  if (/ai|ml|machine learning|deep learning|llm|gpt|neural|gpu|tensor|model|train|infer/.test(text)) {
    return 'AI & ML';
  }

  // DevTools 关键词
  if (/cli|terminal|tool|dev|developer|debug|test|ide|plugin|extension|api client|postman/i.test(text)) {
    return 'DevTools';
  }

  // Web Stack 关键词
  if (/web|frontend|backend|fullstack|react|vue|angular|node|javascript|typescript|html|css|ui|framework/.test(text)) {
    return 'Web Stack';
  }

  // Infra 关键词
  if (/docker|kubernetes|k8s|cloud|infra|infrastructure|server|database|db|cache|container/.test(text)) {
    return 'Infra';
  }

  // Self-Hosted 关键词
  if (/self-hosted|selfhost|home|media|plex|jellyfin|automation|homeassistant|nas/.test(text)) {
    return 'Self-Hosted';
  }

  // Resources 关键词
  if (/awesome|list|resource|learn|tutorial|doc|documentation|api collection/.test(text)) {
    return 'Resources';
  }

  return 'Resources';
}

// 更新项目分类
let updatedCount = 0;
for (const project of data) {
  const oldDomain = project.domain;
  const oldSubCategory = project.subCategory;

  // 更新 domain
  if (!project.domain) {
    project.domain = classifyDomain(project);
  }

  // 更新 subCategory
  project.subCategory = classifySubCategory(project);

  if (project.domain !== oldDomain || project.subCategory !== oldSubCategory) {
    updatedCount++;
  }
}

console.log(`处理完成，共 ${data.length} 个项目，更新了 ${updatedCount} 个项目的分类`);

// 保存到两个位置
fs.writeFileSync('./data/projects.json', JSON.stringify(data, null, 2), 'utf8');
console.log('已保存到 data/projects.json');

fs.writeFileSync('./docs/public/data/projects.json', JSON.stringify(data, null, 2), 'utf8');
console.log('已保存到 docs/public/data/projects.json');
