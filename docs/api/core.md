# 核心 API

## 简介

GitFame 核心 API 提供了用于分析 Git 仓库的主要功能。本文档将详细介绍 GitFame 的核心 API。

## 命令行 API

### 基本命令

```bash
gitfame [options] [directories...]
```

### 选项

| 选项 | 描述 | 默认值 |
|------|------|--------|
| `--version`, `-v` | 显示版本信息 | - |
| `--help`, `-h` | 显示帮助信息 | - |
| `--format`, `-f` | 指定输出格式（table, json, csv） | table |
| `--sort`, `-s` | 指定排序方式（commits, additions, deletions, total, percentage） | commits |
| `--top`, `-t` | 只显示前 N 名贡献者 | - |
| `--exclude`, `-e` | 排除指定文件或目录 | - |
| `--include`, `-i` | 只包含指定文件或目录 | - |
| `--since` | 只分析指定日期之后的提交 | - |
| `--until` | 只分析指定日期之前的提交 | - |
| `--branch` | 只分析指定分支 | - |
| `--email` | 显示贡献者邮箱 | false |
| `--no-ansi` | 禁用 ANSI 颜色 | false |

## 编程 API

### 基本用法

```javascript
const { analyze } = require('gitfame');

async function main() {
  const result = await analyze({
    directories: ['./'],
    options: {
      format: 'json',
      sort: 'commits',
      top: 10
    }
  });
  
  console.log(result);
}

main();
```

### analyze 函数

**参数**：

- `directories`：要分析的目录数组
- `options`：分析选项，与命令行选项相同

**返回值**：

返回一个包含贡献者信息的对象，格式如下：

```javascript
{
  contributors: [
    {
      name: '贡献者名称',
      email: '贡献者邮箱',
      commits: 提交次数,
      additions: 新增代码行数,
      deletions: 删除代码行数,
      total: 总代码行数,
      percentage: 贡献百分比
    },
    // 更多贡献者...
  ],
  total: {
    commits: 总提交次数,
    additions: 总新增代码行数,
    deletions: 总删除代码行数,
    total: 总代码行数
  }
}
```

## 示例

### 分析单个目录

```bash
gitfame /path/to/repository
```

### 分析多个目录

```bash
gitfame /path/to/repo1 /path/to/repo2
```

### 以 JSON 格式输出

```bash
gitfame --format json
```

### 只显示前 5 名贡献者

```bash
gitfame --top 5
```

### 排除指定目录

```bash
gitfame --exclude node_modules,dist
```

### 只包含指定目录

```bash
gitfame --include src,lib
```