# 安装

## 系统要求

在安装 GitFame 之前，请确保你的系统满足以下要求：

- Node.js 14.0 或更高版本
- Git 2.0 或更高版本

## 安装方法

### 使用 npm

```bash
npm install -g gitfame
```

### 使用 yarn

```bash
yarn global add gitfame
```

### 使用 pnpm

```bash
pnpm add -g gitfame
```

### 从源码安装

如果你想从源码安装 GitFame，可以按照以下步骤操作：

1. 克隆 GitFame 仓库：

```bash
git clone https://github.com/gitfame/gitfame.git
cd gitfame
```

2. 安装依赖：

```bash
npm install
```

3. 构建项目：

```bash
npm run build
```

4. 全局链接：

```bash
npm link
```

## 验证安装

安装完成后，你可以运行以下命令验证安装是否成功：

```bash
gitfame --version
```

如果安装成功，你应该看到 GitFame 的版本信息。

## 升级 GitFame

要升级到最新版本的 GitFame，可以使用以下命令：

### 使用 npm

```bash
npm update -g gitfame
```

### 使用 yarn

```bash
yarn global upgrade gitfame
```

### 使用 pnpm

```bash
pnpm update -g gitfame
```

## 卸载 GitFame

如果你想卸载 GitFame，可以使用以下命令：

### 使用 npm

```bash
npm uninstall -g gitfame
```

### 使用 yarn

```bash
yarn global remove gitfame
```

### 使用 pnpm

```bash
pnpm remove -g gitfame
```