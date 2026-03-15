const fs = require('fs');
const path = require('path');
const fetch = globalThis.fetch || require('node-fetch');

const QWEN_API_KEY = process.env.QWEN_API_KEY;
const PROJECTS_FILE = path.join(__dirname, '../data/projects.json');
const SCENARIOS_FILE = path.join(__dirname, '../data/scenarios.json');

function readProjects() {
  try {
    return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8'));
  } catch (error) {
    console.error('Error reading projects file:', error);
    return [];
  }
}

function saveScenarios(scenarios) {
  fs.writeFileSync(SCENARIOS_FILE, JSON.stringify(scenarios, null, 2));
}

async function generateScenariosForProject(project) {
  if (!QWEN_API_KEY) {
    console.warn('Qwen API key not set, skipping scenario generation');
    return [];
  }

  const prompt = `请分析项目 ${project.name} 的功能和用途，不要告诉我它的技术栈。请告诉我，如果一个非技术背景的用户想用它，他会输入什么样的搜索词？请生成 3 个以'我想...'开头的短句。只返回这 3 个短句，每行一个，不要包含其他内容。`;

  try {
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QWEN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen3.5-flash',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates user-centric search queries for projects.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const scenarios = content.trim().split('\n').filter(line => line.startsWith('我想'));
    
    return scenarios.slice(0, 3);
  } catch (error) {
    console.error(`Error generating scenarios for ${project.name}:`, error);
    return [];
  }
}

async function generateScenarios() {
  const projects = readProjects();
  const allScenarios = [];

  for (const project of projects) {
    console.log(`Generating scenarios for ${project.name}...`);
    const scenarios = await generateScenariosForProject(project);
    
    if (scenarios.length > 0) {
      scenarios.forEach(scenario => {
        allScenarios.push({
          id: `${project.id}-${scenario.slice(2).trim().replace(/\s+/g, '-').toLowerCase()}`,
          text: scenario,
          projectId: project.id,
          projectName: project.name,
          projectLink: project.link
        });
      });
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const uniqueScenarios = [];
  const seenTexts = new Set();

  for (const scenario of allScenarios) {
    if (!seenTexts.has(scenario.text)) {
      seenTexts.add(scenario.text);
      uniqueScenarios.push(scenario);
    }
  }

  saveScenarios(uniqueScenarios);
  console.log(`Generated ${uniqueScenarios.length} unique scenarios`);

  generateFrontendCode(uniqueScenarios);
}

function generateFrontendCode(scenarios) {
  const frontendCode = `## 我想做什么？

<ClientOnly>
  <div class="scenario-entry">
    <h3>从用户痛点出发，找到适合你的工具</h3>
    <div class="scenario-grid">
      ${scenarios.slice(0, 6).map((scenario, index) => {
        const icons = ['📊', '🔍', '🎯', '📈', '🔧', '⭐'];
        return `
      <div class="scenario-card" @click="navigate('${scenario.projectLink}')">
        <div class="scenario-icon">${icons[index % icons.length]}</div>
        <div class="scenario-text">${scenario.text}</div>
      </div>`;
      }).join('')}
    </div>
  </div>
</ClientOnly>

<script setup>
function navigate(path) {
  window.location.href = path;
}
</script>

<style scoped>
.scenario-entry {
  margin: 3rem 0;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 8px;
}

.scenario-entry h3 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  color: #111827;
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.scenario-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.scenario-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.scenario-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.scenario-text {
  font-size: 1rem;
  color: #374151;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .scenario-grid {
    grid-template-columns: 1fr;
  }
  
  .scenario-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>`;

  fs.writeFileSync(path.join(__dirname, '../data/scenarios-frontend.md'), frontendCode);
  console.log('Generated frontend code for scenarios');
}

generateScenarios().catch(console.error);
