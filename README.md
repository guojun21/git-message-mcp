# Git Message MCP v2.0

一个智能的 MCP (Model Context Protocol) 工具，利用 **POE API** 和 AI 模型来分析 Git 仓库的更改，生成专业的 commit message，并自动复制到剪贴板。

## 🚀 核心特性

- 🤖 **AI 驱动**: 使用 POE API 调用强大的 AI 模型（Claude、GPT-4o 等）
- 📊 **自动分析**: 扫描指定文件夹的 Git diff 和统计信息
- 📝 **多种格式**: 支持详细、简洁和更新日志三种 commit message 格式
- 📋 **直接复制**: 自动将生成的 message 复制到剪贴板
- 🎯 **模型灵活**: 支持动态选择 POE 中的任何可用 AI 模型
- 📈 **完整上下文**: 收集 git diff、统计数据、最近 commits 等信息供 AI 理解

## 📋 系统要求

- Node.js/Bun
- Git 已安装且配置
- POE API Key（已内置：`W4HQGO1TRCOcZzRv-8vB84REwnexAshVRVVhyZ9dpII`）
- macOS（使用 pbcopy 复制到剪贴板）

## 📦 安装

```bash
cd git-message-mcp
bun install
# 或
npm install
```

## 🎮 使用

### 启动服务

```bash
npm start
# 或
bun run index.ts --stdio
```

### 工具 1: 列出可用模型

获取 POE 中所有可用的 AI 模型列表。

**入参：** 无参数

**返回示例：**
```json
{
  "success": true,
  "models": [
    "Claude-3-5-Sonnet",
    "GPT-4o",
    "Gemini-2-Flash",
    "Claude-3-Opus"
  ],
  "message": "✅ 成功获取 4 个可用模型"
}
```

### 工具 2: 生成 AI 驱动的 Git Message

分析 Git 仓库变更，使用指定的 AI 模型生成 commit message。

**工具名称：** `generateGitMessage`

#### 入参对象

```typescript
{
  "folderPath": string,           // ✅ 必需：Git仓库的绝对路径
  "model": string,                // 可选：AI模型名称 (默认: "Claude-3-5-Sonnet")
  "messageType": string,          // 可选：信息类型 (默认: "detailed")
  "includeStats": boolean         // 可选：是否包含统计 (默认: true)
}
```

#### 参数详解

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `folderPath` | string | ✅ | - | Git仓库的绝对路径，例如 `/Users/oasmet/Documents/MyProject` |
| `model` | string | 否 | `Claude-3-5-Sonnet` | 使用的AI模型，可选值：`Claude-3-5-Sonnet`、`GPT-4o`、`Gemini-2-Flash`、`Claude-3-Opus` 等 |
| `messageType` | string | 否 | `detailed` | 生成的message类型：`detailed`（详细）、`concise`（简洁）或 `changelog`（更新日志） |
| `includeStats` | boolean | 否 | `true` | 是否在 message 中包含统计数据（文件数、插入/删除行数） |

#### 调用示例

**示例1：使用默认参数（最简单）**
```typescript
{
  "folderPath": "/Users/oasmet/Documents/MyAgent"
}
// 会使用：
// - model: "Claude-3-5-Sonnet"
// - messageType: "detailed"
// - includeStats: true
```

**示例2：使用 GPT-4o，简洁格式**
```typescript
{
  "folderPath": "/Users/oasmet/Documents/MacTaskManager",
  "model": "GPT-4o",
  "messageType": "concise"
}
```

**示例3：生成 Changelog，不包含统计**
```typescript
{
  "folderPath": "/Users/oasmet/Documents/MyProject",
  "model": "Claude-3-5-Sonnet",
  "messageType": "changelog",
  "includeStats": false
}
```

#### 返回数据结构

**成功响应：**
```typescript
{
  success: true,
  message: "✅ Git message 已成功复制到剪贴板！\n\n📊 统计信息：\n文件数: 5\n插入: +125\n删除: -32\n\n🤖 AI模型: Claude-3-5-Sonnet",
  details: {
    folderPath: "/Users/oasmet/Documents/MyAgent",
    folderName: "MyAgent",
    filesChanged: 5,
    insertions: 125,
    deletions: 32,
    messageType: "detailed",
    model: "Claude-3-5-Sonnet",
    copiedToClipboard: true,
    generatedMessage: "..."  // 生成的完整message内容
  }
}
```

**失败响应：**
```typescript
{
  success: false,
  message: "❌ 该文件夹不是一个git仓库: /path/to/folder"
}
```

## 📝 消息格式说明

### 1. Detailed (详细格式)
- 完整的 commit message 格式
- 包含清晰的标题行（≤72字符）
- 详细的主体说明
- 具体的文件和组件引用
- 专业的语气

**适用场景：** 正式的 commit、需要完整信息的场景

### 2. Concise (简洁格式)
- 简短的一行或几行
- 清晰总结主要变更
- 使用祈使语态
- 包含项目/模块名称

**适用场景：** 快速提交、日常开发

### 3. Changelog (更新日志格式)
- Markdown 格式
- 按类别组织（Added、Fixed、Changed 等）
- 使用项目符号
- 可直接追加到 CHANGELOG.md

**适用场景：** 版本发布、更新日志维护

## 🔄 工作流程

```
输入文件夹路径
    ↓
检查是否为 Git 仓库
    ↓
收集 Git 信息：
  - git diff --stat HEAD （统计数据）
  - git diff HEAD （具体改动）
  - git log --oneline （最近提交）
  - Changed files list
    ↓
准备 AI 上下文信息
    ↓
调用 POE API，指定模型生成 Message
    ↓
可选：追加统计信息
    ↓
复制到剪贴板 (pbcopy)
    ↓
返回结果和生成的内容
```

## 🤖 AI 模型选择建议

- **Claude-3-5-Sonnet**: 💎 最平衡，推荐首选
- **GPT-4o**: ⚡ 快速、精准
- **Gemini-2-Flash**: 🚀 超快速，实时性好
- **Claude-3-Opus**: 🧠 最深度理解

## ⚠️ 注意事项

- 工具分析的是 `git diff HEAD` 的变更（本地未 commit 的变更）
- 必须在有效的 Git 仓库中运行
- 剪贴板功能仅在 macOS 上工作（使用 pbcopy）
- POE API Key 已内置，无需手动配置
- git diff 内容限制在 10000 字符以避免 API 负载过大

## 🔧 故障排除

| 问题 | 解决方案 |
|------|---------|
| "文件夹不是git仓库" | 确保目标文件夹包含 `.git` 目录 |
| "没有未提交的更改" | 先进行一些代码更改，使用 `git add` 暂存，但不 commit |
| "复制到剪贴板失败" | 确认在 macOS 上运行，或手动复制返回的 message |
| "POE API 调用失败" | 检查网络连接、API Key 有效性 |
| "模型不可用" | 使用 `listAvailableModels` 工具查看可用模型列表 |

## 📄 许可证

ISC

## 🎯 版本历史

### v2.0.0
- ✨ 集成 POE API 和 AI 模型
- 🤖 AI 驱动的 message 生成
- 📊 动态模型列表获取
- 🎯 改进的上下文信息收集

### v1.0.0
- 初始版本，基于规则的 message 生成
