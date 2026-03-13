# 高级用法示例

## 简介

本示例展示了 GitFame 的高级使用方法，帮助你充分利用其功能。

## 示例 1：分析特定时间段的提交

```bash
# 分析 2023 年 1 月 1 日之后的提交
gitfame --since 2023-01-01

# 分析 2023 年 1 月 1 日到 2023 年 12 月 31 日之间的提交
gitfame --since 2023-01-01 --until 2023-12-31
```

## 示例 2：分析特定分支

```bash
# 分析 main 分支
gitfame --branch main

# 分析 develop 分支
gitfame --branch develop
```

## 示例 3：显示贡献者邮箱

```bash
# 显示贡献者邮箱
gitfame --email
```

## 示例 4：禁用 ANSI 颜色

```bash
# 禁用 ANSI 颜色
gitfame --no-ansi
```

## 示例 5：组合多个选项

```bash
# 组合多个选项：只显示前 10 名贡献者，按贡献百分比排序，以 JSON 形式输出
gitfame --top 10 --sort percentage --format json
```

## 示例 6：分析多个目录

```bash
# 分析多个目录
gitfame /path/to/repo1 /path/to/repo2 /path/to/repo3
```

## 示例 7：使用正则表达式排除文件

```bash
# 使用正则表达式排除文件
gitfame --exclude "*.log,*.tmp,node_modules"
```

## 示例 8：使用编程 API

```javascript
const { analyze } = require('gitfame');

async function main() {
  try {
    const result = await analyze({
      directories: ['./'],
      options: {
        format: 'json',
        sort: 'commits',
        top: 10,
        email: true
      }
    });
    
    console.log('分析结果:', result);
    
    // 处理结果
    result.contributors.forEach(contributor => {
      console.log(`${contributor.name} (${contributor.email}): ${contributor.commits} 次提交, ${contributor.total} 行代码`);
    });
  } catch (error) {
    console.error('分析失败:', error);
  }
}

main();
```

## 示例 9：使用插件

```javascript
// 创建插件
const myPlugin = {
  name: 'my-plugin',
  version: '1.0.0',
  description: 'My GitFame plugin',
  hooks: {
    postAnalyze(result, options) {
      // 添加自定义统计信息
      result.customStats = {
        averageCommitsPerContributor: result.contributors.length > 0 ? 
          result.total.commits / result.contributors.length : 0
      };
      return result;
    }
  }
};

// 使用插件
const { analyze } = require('gitfame');

async function main() {
  const result = await analyze({
    directories: ['./'],
    options: {
      format: 'json'
    },
    plugins: [myPlugin]
  });
  
  console.log(result);
}

main();
```

## 示例 10：集成到 CI/CD 流程

```bash
# 在 CI/CD 流程中使用 GitFame
# .github/workflows/analyze.yml

name: Code Analysis

on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
      - name: Install GitFame
        run: npm install -g gitfame
      - name: Analyze code contributions
        run: gitfame --format json > analysis.json
      - name: Upload analysis result
        uses: actions/upload-artifact@v3
        with:
          name: code-analysis
          path: analysis.json
```