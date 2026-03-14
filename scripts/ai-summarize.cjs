const fetch = globalThis.fetch || require('node-fetch');
const fs = require('fs');
const path = require('path');

const QWEN_API_KEY = process.env.QWEN_API_KEY;
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

const PROJECT_SUMMARY_PROMPT = `你是一个专业的技术项目分析师。请根据以下GitHub项目信息，生成一段50字以内的精炼中文简介，要求：
1. 一句话说清项目是什么
2. 突出核心功能和用途
3. 语言简洁有力
4. 不要包含任何格式符号

项目名称：{name}
原英文描述：{description}

请直接输出简介，不要任何前缀或后缀：`;

// 批量总结项目描述
async function summarizeProjects(projects) {
  if (!QWEN_API_KEY) {
    console.log('⚠️ 未配置 QWEN_API_KEY，跳过AI总结');
    return projects;
  }
  
  const needSummary = projects.filter(p => !p.aiSummary && p.description && p.description.length > 20);
  
  if (needSummary.length === 0) {
    console.log('✓ 所有项目已有AI总结');
    return projects;
  }
  
  console.log(`🤖 开始AI总结 ${needSummary.length} 个项目...`);
  
  const results = [];
  
  for (let i = 0; i < needSummary.length; i++) {
    const p = needSummary[i];
    
    try {
      const summary = await callQwenAPI(p.name, p.description);
      
      if (summary) {
        results.push({ id: p.id, aiSummary: summary });
        console.log(`  ✓ ${p.name}: ${summary.substring(0, 30)}...`);
      }
    } catch (e) {
      console.error(`  ✗ ${p.name}: ${e.message}`);
    }
    
    await new Promise(r => setTimeout(r, 500));
    
    if ((i + 1) % 10 === 0) {
      console.log(`  进度: ${i + 1}/${needSummary.length}`);
    }
  }
  
  return projects.map(p => {
    const result = results.find(r => r.id === p.id);
    return result ? { ...p, aiSummary: result.aiSummary } : p;
  });
}

async function callQwenAPI(name, description) {
  if (!QWEN_API_KEY) return null;
  
  const prompt = PROJECT_SUMMARY_PROMPT
    .replace('{name}', name)
    .replace('{description}', description);
  
  try {
    const response = await fetch(QWEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: {
          messages: [
            { role: 'user', content: prompt }
          ]
        },
        parameters: {
          result_format: 'message',
          max_tokens: 100
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`API ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.output?.choices?.[0]?.message?.content) {
      return data.output.choices[0].message.content.trim();
    }
    
    return null;
  } catch (e) {
    console.error('Qwen API Error:', e.message);
    return null;
  }
}

module.exports = { summarizeProjects, callQwenAPI };

if (require.main === module) {
  const projectsFile = path.join(__dirname, '../data/projects.json');
  const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf-8'));
  
  summarizeProjects(projects).then(updated => {
    fs.writeFileSync(projectsFile, JSON.stringify(updated, null, 2), 'utf-8');
    console.log('\n✅ AI总结完成');
  });
}
