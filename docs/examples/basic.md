# 基本使用示例

## 简介

本示例展示了 GitFame 的基本使用方法，帮助你快速上手。

## 示例 1：分析当前目录

```bash
# 分析当前目录
gitfame
```

## 示例 2：分析指定目录

```bash
# 分析指定目录
gitfame /path/to/repository
```

## 示例 3：以表格形式输出

```bash
# 以表格形式输出
gitfame --format table
```

## 示例 4：以 JSON 形式输出

```bash
# 以 JSON 形式输出
gitfame --format json
```

## 示例 5：以 CSV 形式输出

```bash
# 以 CSV 形式输出
gitfame --format csv
```

## 示例 6：按提交次数排序

```bash
# 按提交次数排序
gitfame --sort commits
```

## 示例 7：按新增代码行数排序

```bash
# 按新增代码行数排序
gitfame --sort additions
```

## 示例 8：只显示前 5 名贡献者

```bash
# 只显示前 5 名贡献者
gitfame --top 5
```

## 示例 9：排除指定目录

```bash
# 排除 node_modules 目录
gitfame --exclude node_modules
```

## 示例 10：只包含指定目录

```bash
# 只包含 src 目录
gitfame --include src
```