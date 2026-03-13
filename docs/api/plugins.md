# 插件 API

## 简介

GitFame 提供了一个插件系统，允许你扩展其功能。本文档将详细介绍 GitFame 的插件 API。

## 插件结构

一个 GitFame 插件是一个包含以下结构的模块：

```javascript
module.exports = {
  name: '插件名称',
  version: '插件版本',
  description: '插件描述',
  hooks: {
    // 钩子函数
  }
};
```

## 钩子函数

GitFame 提供了以下钩子函数：

### preAnalyze

在分析开始前执行，可用于准备分析环境。

**参数**：
- `options`：分析选项

**返回值**：
- 可选的修改后的选项对象

### postAnalyze

在分析完成后执行，可用于处理分析结果。

**参数**：
- `result`：分析结果
- `options`：分析选项

**返回值**：
- 可选的修改后的结果对象

### preFormat

在格式化输出前执行，可用于修改要格式化的数据。

**参数**：
- `data`：要格式化的数据
- `format`：指定的输出格式
- `options`：分析选项

**返回值**：
- 可选的修改后的数据对象

### postFormat

在格式化输出后执行，可用于处理格式化后的输出。

**参数**：
- `output`：格式化后的输出
- `format`：指定的输出格式
- `options`：分析选项

**返回值**：
- 可选的修改后的输出

## 创建插件

### 示例插件

```javascript
// my-plugin.js
module.exports = {
  name: 'my-plugin',
  version: '1.0.0',
  description: 'My GitFame plugin',
  hooks: {
    preAnalyze(options) {
      console.log('Preparing analysis...');
      return options;
    },
    postAnalyze(result, options) {
      console.log('Analysis completed!');
      // 可以修改结果
      return result;
    },
    preFormat(data, format, options) {
      console.log(`Formatting data as ${format}...`);
      return data;
    },
    postFormat(output, format, options) {
      console.log('Formatting completed!');
      return output;
    }
  }
};
```

## 使用插件

### 命令行方式

```bash
gitfame --plugin ./my-plugin.js
```

### 编程方式

```javascript
const { analyze } = require('gitfame');
const myPlugin = require('./my-plugin');

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

## 内置插件

GitFame 内置了以下插件：

### summary

生成分析摘要，包括总提交次数、总代码行数等。

### chart

生成贡献者贡献情况的图表。

### export

将分析结果导出到文件。

## 插件开发最佳实践

1. **命名规范**：插件名称应该清晰、简洁，反映插件的功能。
2. **版本管理**：使用语义化版本号管理插件版本。
3. **文档**：为插件提供详细的文档，说明其功能和用法。
4. **测试**：为插件编写测试，确保其功能正常。
5. **错误处理**：妥善处理插件中的错误，避免影响 GitFame 的正常运行。

## 发布插件

如果你开发了一个有用的 GitFame 插件，可以考虑将其发布到 npm 上，让更多人使用。

```bash
# 初始化 npm 包
npm init

# 发布到 npm
npm publish
```

发布后，其他用户可以通过以下命令安装和使用你的插件：

```bash
npm install -g my-gitfame-plugin
gitfame --plugin my-gitfame-plugin
```