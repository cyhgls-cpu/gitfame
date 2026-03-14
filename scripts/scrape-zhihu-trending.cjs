const fs = require('fs');
const path = require('path');

const trendingProjects = [
  { name: "BitNet", description: "微软官方1比特大语言模型推理框架", github: "https://github.com/microsoft/BitNet" },
  { name: "OpenRAG", description: "基于Langflow、Docling和Opensearch的检索增强生成平台", github: "https://github.com/langflow-ai/openrag" },
  { name: "Lightpanda", description: "专为AI和自动化设计的高性能无头浏览器", github: "https://github.com/lightpanda-io/browser" },
  { name: "Superpowers", description: "有效的代理技能框架与软件开发方法", github: "https://github.com/obra/superpowers" },
  { name: "Public-APIs", description: "免费API集合列表", github: "https://github.com/public-apis/public-apis" },
  { name: "promptfoo", description: "测试提示词，智能体和RAG框架的工具", github: "https://github.com/promptfoo/promptfoo" },
  { name: "agency-agents", description: "完整的AI代理团队", github: "https://github.com/msitarzewski/agency-agents" },
  { name: "Dolt", description: "Git for data - 版本控制的SQL数据库", github: "https://github.com/dolthub/dolt" },
  { name: "A2UI", description: "Google的AI用户界面工具集", github: "https://github.com/google/A2UI" },
  { name: "Fish-Speech", description: "SOTA开源TTS语音合成工具", github: "https://github.com/fishaudio/fish-speech" },
  { name: "Page-Agent", description: "用自然语言控制网页界面的JavaScript代理", github: "https://github.com/alibaba/page-agent" },
  { name: "Claude-Plugins", description: "Anthropic官方Claude插件", github: "https://github.com/anthropics/claude-plugins-official" },
  { name: "Hindsight", description: "能自主学习和进化的AI智能体记忆库", github: "https://github.com/vectorize-io/hindsight" },
  { name: "InsForge", description: "为AI智能体提供全栈应用后端框架", github: "https://github.com/InsForge/InsForge" },
  { name: "LiteRT", description: "Google边缘设备AI推理运行时", github: "https://github.com/google-ai-edge/LiteRT" },
  { name: "MiroFish", description: "简洁通用的群体智能引擎", github: "https://github.com/666ghj/MiroFish" },
  { name: "hermes-agent", description: "与你一起成长的AI代理", github: "https://github.com/NousResearch/hermes-agent" },
  { name: "Generative-AI", description: "Google Cloud生成式AI示例代码", github: "https://github.com/GoogleCloudPlatform/generative-ai" },
  { name: "nanochat", description: "仅需100美元搭建的类ChatGPT", github: "https://github.com/karpathy/nanochat" },
  { name: "BettaFish", description: "人人可用的多Agent舆情分析助手", github: "https://github.com/666ghj/BettaFish" },
  { name: "OpenClaw", description: "跨平台个人AI助手", github: "https://github.com/openclaw/openclaw" },
  { name: "shadcn-ui", description: "精美可访问的UI组件库", github: "https://github.com/shadcn-ui/ui" },
  { name: "AFFiNE", description: "下一代知识库，融合Notion和Miro", github: "https://github.com/toeverything/AFFiNE" },
  { name: "CyberStrikeAI", description: "AI原生安全测试平台", github: "https://github.com/Ed1s0nZ/CyberStrikeAI" },
  { name: "Learn-Claude-Code", description: "学习Claude Code的教程", github: "https://github.com/shareAI-lab/learn-claude-code" },
  { name: "OpenAI-Skills", description: "OpenAI技能系统", github: "https://github.com/openai/skills" },
  { name: "is-a-dev", description: "免费开发者子域名服务", github: "https://github.com/is-a-dev/register" },
  { name: "NotebookLM-Py", description: "NotebookLM Python库", github: "https://github.com/teng-lin/notebooklm-py" },
  { name: "Impeccable", description: "让AI更好地进行设计语言处理", github: "https://github.com/pbakaus/impeccable" },
  { name: "Claude-Skills", description: "Claude技能集合", github: "https://github.com/alirezarezvani/claude-skills" },
  { name: "Win11Debloat", description: "Windows 11精简工具", github: "https://github.com/Raphire/Win11Debloat" },
  { name: "Deer-Flow", description: "深度研究自动化框架", github: "https://github.com/bytedance/deer-flow" },
  { name: "IPED", description: "数字取证开源工具", github: "https://github.com/sepinf-inc/IPED" }
];

function classifyProject(name, desc) {
  const n = name.toLowerCase();
  const d = desc.toLowerCase();
  
  if (n.includes('ai') || n.includes('llm') || n.includes('agent') || n.includes('model') || n.includes('chat') || n.includes('speech') || n.includes('tts')) {
    return { domain: 'AI & ML', subCategory: 'AI 综合' };
  }
  if (n.includes('ui') || n.includes('web') || n.includes('frontend') || n.includes('component')) {
    return { domain: 'Web Stack', subCategory: 'Web 开发' };
  }
  if (n.includes('dev') || n.includes('tool') || n.includes('code') || n.includes('skills') || n.includes('cli')) {
    return { domain: 'DevTools', subCategory: '开发工具' };
  }
  if (n.includes('cloud') || n.includes('infra') || n.includes('runtime') || n.includes('deploy') || n.includes('server')) {
    return { domain: 'Infra', subCategory: '基础设施' };
  }
  if (n.includes('api') || n.includes('public')) {
    return { domain: 'Resources', subCategory: 'API 资源' };
  }
  return { domain: 'Resources', subCategory: '综合资源' };
}

function getMaturity(name) {
  const n = name.toLowerCase();
  const stable = ['microsoft', 'google', 'meta', 'apple', 'amazon', 'alibaba', 'bytedance', 'anthropic', 'openai'];
  if (stable.some(k => n.includes(k))) return 'stable';
  return 'trending';
}

const newProjects = trendingProjects.map(p => {
  const cls = classifyProject(p.name, p.description);
  return {
    id: p.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: p.name,
    description: p.description,
    domain: cls.domain,
    subCategory: cls.subCategory,
    maturity: getMaturity(p.name),
    github: p.github.replace('https://github.com/', ''),
    link: p.github,
    tags: [cls.domain.toLowerCase().replace(/\s+/g, '-')]
  };
});

const existingPath = path.join(__dirname, '../data/projects.json');
let existing = JSON.parse(fs.readFileSync(existingPath, 'utf-8'));
const existingIds = new Set(existing.map(p => p.id));
const merged = [...existing];
let added = 0;

for (const p of newProjects) {
  if (!existingIds.has(p.id)) {
    merged.push(p);
    added++;
  }
}

fs.writeFileSync(existingPath, JSON.stringify(merged, null, 2), 'utf-8');
console.log(`✅ 成功添加 ${added} 个新项目`);
console.log(`📦 项目总数：${merged.length}`);
