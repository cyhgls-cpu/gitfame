const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// 配置
const GITHUB_TOKEN = process.env.GHKEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PROJECTS_FILE = path.join(__dirname, '../data/projects.json');
const STARS_HISTORY_FILE = path.join(__dirname, '../data/stars-history.json');

// 二级分类映射
const subCategoryMap = {
  'cli': '终端增强 (CLI)',
  'api': 'API 工具',
  'ide': '高效 IDE 插件',
  'testing': '测试/调试',
  'llm': 'LLM 框架',
  'agent': 'AI Agent',
  'local-model': '本地大模型 (Ollama/Local)',
  'image-generation': '图像/视频生成',
  'fullstack': '全栈框架',
  'ui-components': 'UI 组件库',
  'low-code': '低代码 (Low-code)',
  'animation': '动效/可视化',
  'docker': 'Docker/K8s 工具',
  'database': '数据库/存储',
  'security': '安全/防护',
  'network': '网络/穿透',
  'cloud-alternative': '云服务替代品',
  'nas': '家庭实验室 (NAS)',
  'media': '私人影音',
  'automation': '自动化流',
  'roadmap': '技术路线图 (Roadmap)',
  'books': '电子书合集',
  'interview': '面试/算法',
  'papers': '优质论文'
};

// 读取现有数据
function readProjects() {
  try {
    return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8'));
  } catch (error) {
    console.error('Error reading projects file:', error);
    return [];
  }
}

// 读取 Star 历史数据
function readStarsHistory() {
  try {
    return JSON.parse(fs.readFileSync(STARS_HISTORY_FILE, 'utf8'));
  } catch (error) {
    console.error('Error reading stars history file:', error);
    return {};
  }
}

// 保存数据
function saveProjects(projects) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

// 保存 Star 历史数据
function saveStarsHistory(history) {
  fs.writeFileSync(STARS_HISTORY_FILE, JSON.stringify(history, null, 2));
}

// 获取 GitHub 项目信息
async function getGitHubRepoInfo(repo) {
  const url = `https://api.github.com/repos/${repo}`;
  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching repo ${repo}:`, error);
    return null;
  }
}

// 获取 GitHub 项目 Topics
async function getGitHubRepoTopics(repo) {
  const url = `https://api.github.com/repos/${repo}/topics`;
  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    const data = await response.json();
    return data.names;
  } catch (error) {
    console.error(`Error fetching topics for ${repo}:`, error);
    return [];
  }
}

// 翻译 Topics 到中文二级分类
async function translateTopics(topics) {
  const QWEN_API_KEY = process.env.QWEN_API_KEY;
  if (!QWEN_API_KEY) {
    console.warn('Qwen API key not set, skipping topic translation');
    return [];
  }

  const prompt = `Translate the following GitHub topics to Chinese sub-categories based on the mapping:\n\n${JSON.stringify(subCategoryMap, null, 2)}\n\nTopics: ${topics.join(', ')}\n\nReturn only the matching Chinese sub-categories as an array.`;

  try {
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QWEN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'ep-20260313151840-qv5qf', // 千问模型 ID
        messages: [
          { role: 'system', content: 'You are a helpful assistant that translates GitHub topics to Chinese sub-categories.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error translating topics:', error);
    return [];
  }
}

// 使用千问 API 生成项目简介
async function generateProjectDescription(project, repoInfo) {
  const QWEN_API_KEY = process.env.QWEN_API_KEY;
  if (!QWEN_API_KEY) {
    console.warn('Qwen API key not set, skipping description generation');
    return project;
  }

  // 如果已有人工写的描述，跳过生成
  if (project.description && project.description.length > 0) {
    return project;
  }

  const projectDescription = repoInfo?.description || 'This is a GitHub project';
  
  const prompt = `你现在是一名资深的开源项目评测专家。请根据我提供的 GitHub 项目 README 内容（或项目描述），为该项目生成一个中文一句话简介。\n\n项目描述：${projectDescription}\n\n要求如下：\n\n核心价值：必须说明该项目"是什么"以及"解决了什么痛点"。\n字数限制：严格控制在 30 到 60 个汉字之间，不包含句号。\n语气：客观、专业、极简，避免使用"最强"、"第一"、"惊人"等夸张的营销词汇。\n格式：直接输出简介文本，不要包含任何前缀（如"简介："）。\n差异化：如果该项目是某个知名软件的替代品，请明确标注（例如："XXX 的轻量级开源替代方案"）。`;

  try {
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QWEN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'ep-20260313151840-qv5qf', // 千问模型 ID
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates concise Chinese descriptions for GitHub projects.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    project.aiDescription = content.trim();

    return project;
  } catch (error) {
    console.error('Error generating project description:', error);
    return project;
  }
}

// 使用千问 API 对项目内容进行归类和清洗
async function categorizeAndCleanProject(project, repoInfo, topics) {
  const QWEN_API_KEY = process.env.QWEN_API_KEY;
  if (!QWEN_API_KEY) {
    console.warn('Qwen API key not set, skipping project categorization');
    return project;
  }

  const prompt = `Analyze the following GitHub project and provide a clean categorization:\n\nProject Name: ${project.name}\nProject Description: ${project.description || repoInfo?.description || ''}\nGitHub Topics: ${topics.join(', ')}\n\nBased on the following categories:\n\n一级分类：\n- 智能前沿 (AI & ML)\n- 开发利器 (DevTools)\n- 现代 Web (Web Stack)\n- 基础设施 (Infra)\n- 自托管 (Self-Hosted)\n- 终身学习 (Resources)\n\n二级分类映射：\n${JSON.stringify(subCategoryMap, null, 2)}\n\nPlease provide:\n1. The most appropriate primary category (一级分类)\n2. The most appropriate secondary category (二级分类)\n3. A cleaned and improved description in Chinese\n4. 3-5 relevant tags\n5. A simple emoji icon that represents the project\n\nReturn the result as a JSON object with keys: primaryCategory, secondaryCategory, cleanedDescription, tags, icon.`;

  try {
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QWEN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'ep-20260313151840-qv5qf', // 千问模型 ID
        messages: [
          { role: 'system', content: 'You are a helpful assistant that categorizes and cleans GitHub project information.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const result = JSON.parse(content);

    // 更新项目信息
    if (result.primaryCategory) {
      project.domain = result.primaryCategory;
    }
    if (result.secondaryCategory) {
      project.subCategory = result.secondaryCategory;
    }
    if (result.cleanedDescription && !project.description) {
      project.aiDescription = result.cleanedDescription;
    }
    if (result.tags && result.tags.length > 0) {
      project.tags = [...new Set([...project.tags, ...result.tags])];
    }
    if (result.icon) {
      project.icon = result.icon;
    }

    return project;
  } catch (error) {
    console.error('Error categorizing project:', error);
    return project;
  }
}

// 计算 Star 趋势
function calculateStarTrend(repo, currentStars, history) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  if (!history[repo]) {
    history[repo] = [];
  }
  
  // 添加当前 Star 数
  history[repo].push({
    date: now.toISOString(),
    stars: currentStars
  });
  
  // 只保留最近 30 天的数据
  history[repo] = history[repo].filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= oneWeekAgo;
  });
  
  // 计算 7 天内的 Star 变化
  let starChange = 0;
  if (history[repo].length > 1) {
    const oldestStar = history[repo][0].stars;
    starChange = currentStars - oldestStar;
  }
  
  return {
    starChange,
    history
  };
}

// 检查项目是否死亡
function checkProjectSunset(lastCommitDate) {
  const now = new Date();
  const lastCommit = new Date(lastCommitDate);
  const diffTime = Math.abs(now - lastCommit);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 365;
}

// 更新项目数据
async function updateProjects() {
  const projects = readProjects();
  const starsHistory = readStarsHistory();
  
  // 按成熟度排序，优先更新潜力股
  projects.sort((a, b) => {
    const maturityOrder = { trending: 0, geek: 1, stable: 2 };
    return maturityOrder[a.maturity] - maturityOrder[b.maturity];
  });
  
  // 限制 API 调用次数，优先更新潜力股
  const projectsToUpdate = projects.filter((project, index) => {
    if (project.maturity === 'trending') {
      return true; // 总是更新潜力股
    } else if (project.maturity === 'geek') {
      return index < 10; // 更新前 10 个极客玩具
    } else {
      // 镇馆之宝每周更新一次（通过 GitHub Actions 调度控制）
      return true;
    }
  });
  
  for (const project of projectsToUpdate) {
    if (!project.github) continue;
    
    console.log(`Updating project: ${project.name}`);
    
    // 获取 GitHub 仓库信息
    const repoInfo = await getGitHubRepoInfo(project.github);
    if (!repoInfo) continue;
    
    // 检查项目是否死亡
    const isSunset = checkProjectSunset(repoInfo.pushed_at);
    if (isSunset) {
      project.tags.push('💀 停止维护');
      if (project.maturity === 'trending') {
        project.maturity = 'geek'; // 从潜力股移到极客玩具
      }
    }
    
    // 计算 Star 趋势
    const { starChange, history } = calculateStarTrend(
      project.github, 
      repoInfo.stargazers_count, 
      starsHistory
    );
    project.starChange = starChange;
    starsHistory[project.github] = history;
    
    // 生成项目简介
    project = await generateProjectDescription(project, repoInfo);
    
    // 获取并翻译 Topics
    const topics = await getGitHubRepoTopics(project.github);
    if (topics.length > 0) {
      // 使用千问 API 对项目内容进行归类和清洗
      project = await categorizeAndCleanProject(project, repoInfo, topics);
      
      // 确保标签去重
      project.tags = [...new Set([...project.tags, ...topics])];
    }
    
    // 更新项目信息
    project.updatedAt = new Date().toISOString();
    
    // 避免 API 速率限制
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 保存更新后的数据
  saveProjects(projects);
  saveStarsHistory(starsHistory);
  
  console.log('Project data updated successfully!');
}

// 运行更新
updateProjects().catch(console.error);
