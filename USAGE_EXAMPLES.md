# Git Message MCP 使用示例

本文档提供了详细的使用示例，展示如何调用工具来生成 AI 驱动的 Git commit messages。

## 前置准备

1. 启动 MCP 服务：
```bash
npm start
# 或
bun run index.ts --stdio
```

2. 确保你的 Git 仓库有未提交的更改：
```bash
cd /path/to/your/repo
# 进行一些代码修改
git add .
# 注意：不要 commit！工具分析的是未提交的更改
```

---

## 示例 1: 列出所有可用的 AI 模型

**目的**: 查看 POE 中有哪些可用的 AI 模型

**调用方式**:
```json
{
  "tool": "listAvailableModels"
}
```

**预期返回**:
```json
{
  "success": true,
  "models": [
    "Claude-3-5-Sonnet",
    "GPT-4o",
    "Gemini-2-Flash",
    "Claude-3-Opus",
    "Claude-3-Haiku",
    "Mixtral-8x7B"
  ],
  "message": "✅ 成功获取 6 个可用模型"
}
```

---

## 示例 2: 生成详细的 Commit Message（使用默认参数）

**目的**: 对 `MyAgent` 项目进行分析，生成详细的 commit message

**调用方式**:
```json
{
  "tool": "generateGitMessage",
  "parameters": {
    "folderPath": "/Users/oasmet/Documents/!002Projects/MyAgent"
  }
}
```

**说明**:
- `model` 使用默认值 `Claude-3-5-Sonnet`
- `messageType` 使用默认值 `detailed`
- `includeStats` 使用默认值 `true`

**预期返回**:
```json
{
  "success": true,
  "message": "✅ Git message 已成功复制到剪贴板！\n\n📊 统计信息：\n文件数: 8\n插入: +342\n删除: -128\n\n🤖 AI模型: Claude-3-5-Sonnet",
  "details": {
    "folderPath": "/Users/oasmet/Documents/!002Projects/MyAgent",
    "folderName": "MyAgent",
    "filesChanged": 8,
    "insertions": 342,
    "deletions": 128,
    "messageType": "detailed",
    "model": "Claude-3-5-Sonnet",
    "copiedToClipboard": true,
    "generatedMessage": "[将包含完整的AI生成的commit message]"
  }
}
```

**生成的 Message 示例**:
```
feat(backend): Implement advanced task scheduling and optimization

This commit introduces several key improvements to the backend system:

1. Task Scheduling Engine
   - Added new TaskScheduler class for intelligent task queuing
   - Implements priority-based task execution
   - Supports scheduled execution with cron expressions
   
2. Performance Optimization
   - Optimized database queries in core/database.py
   - Reduced memory footprint by 30% through caching improvements
   - Implemented batch processing for bulk operations

3. Configuration Updates
   - Added new configuration options for scheduling parameters
   - Updated environment variables documentation
   - Enhanced settings validation

4. Bug Fixes
   - Fixed race condition in task processing
   - Resolved memory leak in event handlers
   - Corrected timezone handling in scheduling logic

All changes are backward compatible and include comprehensive error handling.

---
📊 Statistics: 8 files, +342/-128 lines
```

---

## 示例 3: 生成简洁的 Commit Message（使用 GPT-4o）

**目的**: 快速生成简洁的 commit message，使用 GPT-4o 模型

**调用方式**:
```json
{
  "tool": "generateGitMessage",
  "parameters": {
    "folderPath": "/Users/oasmet/Documents/!002Projects/MacTaskManager",
    "model": "GPT-4o",
    "messageType": "concise"
  }
}
```

**预期返回**:
```json
{
  "success": true,
  "message": "✅ Git message 已成功复制到剪贴板！\n\n📊 统计信息：\n文件数: 3\n插入: +75\n删除: -22\n\n🤖 AI模型: GPT-4o",
  "details": {
    "folderPath": "/Users/oasmet/Documents/!002Projects/MacTaskManager",
    "folderName": "MacTaskManager",
    "filesChanged": 3,
    "insertions": 75,
    "deletions": 22,
    "messageType": "concise",
    "model": "GPT-4o",
    "copiedToClipboard": true,
    "generatedMessage": "[简洁的AI生成message]"
  }
}
```

**生成的 Message 示例**:
```
feat(ui): Enhance task management interface and improve performance

- Redesigned task list component with better UX
- Optimized electron rendering process
- Fixed window state persistence bug
```

---

## 示例 4: 生成 Changelog 格式（使用 Gemini）

**目的**: 为版本发布生成 CHANGELOG 格式的内容

**调用方式**:
```json
{
  "tool": "generateGitMessage",
  "parameters": {
    "folderPath": "/Users/oasmet/Documents/!002Projects/LiquidGlassBar",
    "model": "Gemini-2-Flash",
    "messageType": "changelog",
    "includeStats": false
  }
}
```

**预期返回**:
```json
{
  "success": true,
  "message": "✅ Git message 已成功复制到剪贴板！\n\n📊 统计信息：\n文件数: 5\n插入: +189\n删除: -54\n\n🤖 AI模型: Gemini-2-Flash",
  "details": {
    "folderPath": "/Users/oasmet/Documents/!002Projects/LiquidGlassBar",
    "folderName": "LiquidGlassBar",
    "filesChanged": 5,
    "insertions": 189,
    "deletions": 54,
    "messageType": "changelog",
    "model": "Gemini-2-Flash",
    "copiedToClipboard": true,
    "generatedMessage": "[Changelog格式的内容]"
  }
}
```

**生成的 Message 示例**:
```markdown
## [2024-12-14]

### Added
- New liquid glass effect with enhanced transparency support
- Dark mode theme for improved accessibility
- Animation presets for quick customization

### Fixed
- Memory leak in animation loop
- CSS rendering issue on Safari
- Dropdown positioning bug in mobile view

### Changed
- Refactored component architecture for better maintainability
- Updated styling system to use CSS variables
- Improved performance of particle effects

### Removed
- Deprecated jQuery dependency
- Old legacy animation code
```

---

## 示例 5: 生成详细 Message（不包含统计）

**目的**: 生成详细的 commit message，但不在末尾追加统计信息

**调用方式**:
```json
{
  "tool": "generateGitMessage",
  "parameters": {
    "folderPath": "/Users/oasmet/Documents/!002Projects/MyLaw",
    "model": "Claude-3-Opus",
    "messageType": "detailed",
    "includeStats": false
  }
}
```

**说明**:
- 使用强大的 Claude-3-Opus 模型进行深度分析
- 生成详细格式但不追加统计数据
- 适合需要高质量、深度理解的场景

---

## 示例 6: 处理错误场景

### 场景 A: 文件夹不存在

**调用**:
```json
{
  "tool": "generateGitMessage",
  "parameters": {
    "folderPath": "/path/that/does/not/exist"
  }
}
```

**返回**:
```json
{
  "success": false,
  "message": "❌ 文件夹不存在: /path/that/does/not/exist"
}
```

### 场景 B: 不是 Git 仓库

**调用**:
```json
{
  "tool": "generateGitMessage",
  "parameters": {
    "folderPath": "/Users/oasmet/Documents"
  }
}
```

**返回**:
```json
{
  "success": false,
  "message": "❌ 该文件夹不是一个git仓库: /Users/oasmet/Documents"
}
```

### 场景 C: 没有未提交的更改

**调用**:
```json
{
  "tool": "generateGitMessage",
  "parameters": {
    "folderPath": "/Users/oasmet/Documents/!002Projects/MyAgent"
  }
}
```

（当仓库没有未提交的更改时）

**返回**:
```json
{
  "success": false,
  "message": "❌ 没有未提交的更改"
}
```

---

## 快速参考

### 模型选择指南

| 模型 | 速度 | 质量 | 成本 | 最佳用途 |
|------|------|------|------|---------|
| Claude-3-5-Sonnet | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 中等 | 通用、首选 |
| GPT-4o | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 中等 | 快速、精准 |
| Gemini-2-Flash | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 低 | 实时、大规模 |
| Claude-3-Opus | ⭐⭐ | ⭐⭐⭐⭐⭐⭐ | 高 | 深度、复杂分析 |

### 消息类型选择指南

| 类型 | 场景 | 特点 |
|------|------|------|
| `detailed` | 正式 commit | 完整标题 + 详细主体 |
| `concise` | 日常开发 | 简短、快速 |
| `changelog` | 版本发布 | Markdown、可直接追加 |

---

## 集成到工作流

### 在 Shell 脚本中使用

```bash
#!/bin/bash

# 在提交前生成 message
FOLDER="/Users/oasmet/Documents/MyProject"

# 调用 MCP 工具（通过你的 MCP 客户端）
mcp-call generateGitMessage \
  --folderPath "$FOLDER" \
  --model "Claude-3-5-Sonnet" \
  --messageType "detailed"

# Message 已自动复制到剪贴板
# 现在可以直接粘贴到 git commit

git commit -m "$(pbpaste)"
```

### 在 CI/CD 中使用

```yaml
# .github/workflows/commit-message.yml
name: Generate Commit Message

on: [pull_request]

jobs:
  generate-message:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - name: Generate Message
        run: |
          npm start --folderPath ${{ github.workspace }}
```

---

## 成功的关键

1. ✅ 确保有未提交的更改
2. ✅ 使用 `git add` 暂存文件
3. ✅ 不要 `git commit`
4. ✅ 选择合适的模型和格式
5. ✅ Message 会自动复制到剪贴板
6. ✅ 可直接粘贴使用或进一步编辑

祝你使用愉快！🚀

