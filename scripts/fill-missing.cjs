const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./data/projects.json', 'utf8'));

const descriptionFallbacks = {
  'LLM 框架': 'LLM 大语言模型开发框架',
  'AI Agent': 'AI 智能体/Agent 开发框架',
  '本地大模型': '本地部署运行大语言模型',
  '图像/视频生成': 'AI 图像/视频生成工具',
  'AI 编程': 'AI 辅助编程工具',
  'AI 语音': 'AI 语音识别/合成工具',
  'AI RAG': 'RAG 向量检索与知识库',
  '终端增强': '终端增强工具/Shell 工具',
  'API 工具': 'API 开发与测试工具',
  'IDE 插件': 'IDE 编辑器插件',
  '测试/调试': '测试与调试工具',
  '开发工具': '开发者工具集',
  '全栈框架': '全栈 Web 开发框架',
  'UI 组件库': 'UI 组件库/设计系统',
  '低代码': '低代码/可视化构建平台',
  '动效/可视化': '动画与数据可视化',
  '数据库': '数据库相关工具',
  '缓存': '缓存系统与工具',
  '容器': '容器与虚拟化工具',
  '云原生': '云原生与 DevOps 工具',
  '云服务替代品': '开源替代商业云服务',
  '家庭实验室': '智能家居/家庭自动化',
  '私人影音': '私人媒体服务器',
  '自动化': '工作流自动化工具',
  '教程': '学习教程与文档',
  '文档': '文档生成与管理',
  '学习资源': '技术学习资源集合',
  'API集合': '公共 API 接口集合'
};

const tagSuggestions = {
  'AI & ML': ['人工智能', '机器学习', '开源'],
  'DevTools': ['开发者工具', '效率', '开源'],
  'Web Stack': ['Web开发', '前端', '后端'],
  'Infra': ['DevOps', '云计算', '开源'],
  'Self-Hosted': ['自托管', '开源', '隐私'],
  'Resources': ['资源', '学习', '开源']
};

console.log(`处理 ${data.length} 个项目...\n`);

let descUpdated = 0;
let tagUpdated = 0;

for (const project of data) {
  let changed = false;
  
  if (!project.description && !project.aiDescription && !project.aiSummary) {
    const fallback = descriptionFallbacks[project.subCategory] || descriptionFallbacks[project.domain] || '优质开源项目';
    project.aiSummary = fallback;
    descUpdated++;
    changed = true;
  }
  
  if (!project.tags || project.tags.length === 0) {
    project.tags = [project.domain, project.subCategory].filter(Boolean);
    if (!project.tags.includes('开源')) {
      project.tags.push('开源');
    }
    tagUpdated++;
    changed = true;
  }
  
  if (changed) {
    project.updatedAt = new Date().toISOString();
  }
}

console.log(`更新统计:`);
console.log(`  - 补充描述: ${descUpdated}`);
console.log(`  - 补充标签: ${tagUpdated}`);

const missingDesc = data.filter(p => !p.description && !p.aiDescription && !p.aiSummary).length;
const noTags = data.filter(p => !p.tags || p.tags.length === 0).length;
console.log(`\n剩余缺失:`);
console.log(`  - 缺描述: ${missingDesc}`);
console.log(`  - 缺标签: ${noTags}`);

fs.writeFileSync('./data/projects.json', JSON.stringify(data, null, 2), 'utf8');
console.log('\n已保存到 data/projects.json');

fs.writeFileSync('./docs/public/data/projects.json', JSON.stringify(data, null, 2), 'utf8');
console.log('已保存到 docs/public/data/projects.json');
