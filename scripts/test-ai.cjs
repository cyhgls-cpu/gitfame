const fetch = globalThis.fetch || require('node-fetch');
const fs = require('fs');
const path = require('path');

const QWEN_API_KEY = process.env.QWEN_API_KEY || 'sk-test';

const PROJECT_SUMMARY_PROMPT = `你是一个专业的技术项目分析师。请根据以下GitHub项目信息，生成一段50字以内的精炼中文简介，要求：
1. 一句话说清项目是什么
2. 突出核心功能和用途
3. 语言简洁有力
4. 不要包含任何格式符号

项目名称：{name}
原英文描述：{description}

请直接输出简介，不要任何前缀或后缀：`;

// 测试用项目
const testProjects = [
  { id: 'test1', name: 'BitNet', description: 'Official inference framework for 1-bit LLMs that makes running large language models efficient on CPUs.' },
  { id: 'test2', name: 'MiroFish', description: 'A Simple and Universal Swarm Intelligence Engine, Predicting Anything.' },
  { id: 'test3', name: 'ComfyUI', description: 'The most powerful and modular stable diffusion GUI, api and back-end with a graph/nodes interface.' }
];

async function callQwenAPI(name, description) {
  if (!QWEN_API_KEY || QWEN_API_KEY === 'sk-test') {
    // 模拟输出
    const mockSummaries = {
      'BitNet': '微软发布的1比特大模型推理框架，让CPU高效运行百亿参数AI模型',
      'MiroFish': '简洁通用的群体智能引擎，用AI预测万物规律',
      'ComfyUI': '强大的Stable Diffusion可视化工作流工具'
    };
    return mockSummaries[name] || `关于${name}的项目`;
  }
  
  const prompt = PROJECT_SUMMARY_PROMPT
    .replace('{name}', name)
    .replace('{description}', description);
  
  try {
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: { messages: [{ role: 'user', content: prompt }] },
        parameters: { result_format: 'message', max_tokens: 100 }
      })
    });
    
    const data = await response.json();
    return data.output?.choices?.[0]?.message?.content?.trim() || null;
  } catch (e) {
    console.error('API Error:', e.message);
    return null;
  }
}

async function test() {
  console.log('🧪 测试 AI 总结功能\n');
  
  for (const p of testProjects) {
    const summary = await callQwenAPI(p.name, p.description);
    console.log(`📦 ${p.name}`);
    console.log(`   原文: ${p.description.substring(0, 60)}...`);
    console.log(`   总结: ${summary}`);
    console.log();
  }
}

test();
