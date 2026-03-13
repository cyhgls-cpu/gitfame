# 快速开始

## 简介

GitFame 是一个强大的 Git 仓库分析工具，帮助你了解代码贡献者的贡献情况。本指南将帮助你快速上手 GitFame。

## 安装

首先，你需要安装 GitFame：

```bash
# 使用 npm 安装
npm install -g gitfame

# 或使用 yarn 安装
yarn global add gitfame

# 或使用 pnpm 安装
pnpm add -g gitfame
```

## 基本使用

安装完成后，你可以使用以下命令分析 Git 仓库：

```bash
# 分析当前目录
gitfame

# 分析指定目录
gitfame /path/to/repository

# 分析多个目录
gitfame /path/to/repo1 /path/to/repo2
```

## 查看报告

GitFame 会生成详细的贡献者报告，包括：

- 贡献者名称
- 提交次数
- 新增代码行数
- 删除代码行数
- 总代码行数
- 贡献百分比

## 常用选项

- `--format`：指定输出格式（默认：table）
- `--sort`：指定排序方式（默认：commits）
- `--top`：只显示前 N 名贡献者
- `--exclude`：排除指定文件或目录
- `--include`：只包含指定文件或目录

## 示例

```bash
# 以 JSON 格式输出前 5 名贡献者
gitfame --format json --top 5

# 排除 node_modules 目录
gitfame --exclude node_modules

# 只包含 src 目录
gitfame --include src
```