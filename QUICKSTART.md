# 快速开始指南

## 5分钟上手 Git Message MCP

### 1️⃣ 安装依赖

```bash
cd /Users/oasmet/Documents/!002Projects/!mcps/git-message-mcp
bun install
```

或者：
```bash
npm install
```

### 2️⃣ 启动服务

```bash
npm start
```

你应该会看到：
```
🚀 Git Message MCP Server v2.0 started with stdio transport
```

### 3️⃣ 准备 Git 仓库

选择一个你想分析的项目，进行一些代码修改：

```bash
cd /path/to/your/project

# 进行一些代码修改
# ...

# 暂存文件（重要：不要 commit！）
git add .
```

### 4️⃣ 调用工具 - 查看可用模型

```json
{
  "tool": "listAvailableModels"
}
```

**返回**:
```json
{
  "success": true,
  "models": ["Claude-3-5-Sonnet", "GPT-4o", "Gemini-2-Flash", ...],
  "message": "✅ 成功获取 N 个可用模型"
}
```

### 5️⃣ 调用工具 - 生成 Git Message

```json
{
  "tool": "generateGitMessage",
  "parameters": {
    "folderPath": "/path/to/your/project"
  }
}
```

**返回**:
```json
{
  "success": true,
  "message": "✅ Git message 已成功复制到剪贴板！\n\n📊 统计信息：\n文件数: X\n插入: +Y\n删除: -Z",
  "details": {
    "filesChanged": X,
    "insertions": Y,
    "deletions": Z,
    "copiedToClipboard": true,
    "generatedMessage": "..."
  }
}
```

### 6️⃣ 使用生成的 Message

Message 已自动复制到剪贴板，直接粘贴：

```bash
git commit  # 打开编辑器
# Cmd+V 粘贴 message
# :wq 保存退出
```

或者：

```bash
git commit -m "$(pbpaste)"
```

---

## 常用命令

### 生成详细 Message（推荐）

```json
{
  "tool": "generateGitMessage",
  "parameters": {
    "folderPath": "/Users/oasmet/Documents/!002Projects/MyAgent",
    "model": "Claude-3-5-Sonnet",
    "messageType": "detailed"
  }
}
```

### 生成简洁 Message（快速）

```json
{
  "tool": "generateGitMessage",
  "parameters": {
    "folderPath": "/Users/oasmet/Documents/!002Projects/MacTaskManager",
    "messageType": "concise"
  }
}
```

### 生成 Changelog（发布版本）

```json
{
  "tool": "generateGitMessage",
  "parameters": {
    "folderPath": "/Users/oasmet/Documents/!002Projects/MyProject",
    "messageType": "changelog"
  }
}
```

### 使用最强模型（深度分析）

```json
{
  "tool": "generateGitMessage",
  "parameters": {
    "folderPath": "/path/to/project",
    "model": "Claude-3-Opus"
  }
}
```

---

## 入参说明

| 参数 | 必需 | 默认值 | 说明 |
|------|------|--------|------|
| `folderPath` | ✅ | - | Git 项目路径 |
| `model` | ❌ | `Claude-3-5-Sonnet` | AI 模型选择 |
| `messageType` | ❌ | `detailed` | `detailed` / `concise` / `changelog` |
| `includeStats` | ❌ | `true` | 包含统计数据 |

---

## 故障排除

### ❌ "文件夹不是git仓库"

**原因**: 目标文件夹不含 `.git` 目录

**解决**:
```bash
cd /your/folder
git init  # 初始化 git
```

### ❌ "没有未提交的更改"

**原因**: 所有更改都已 commit

**解决**:
```bash
# 修改一些文件
git add .
# 不要 commit！
```

### ❌ "复制到剪贴板失败"

**原因**: 不是 macOS 或权限问题

**解决**: 在返回的 `generatedMessage` 中找到内容，手动复制

### ❌ "POE API 调用失败"

**原因**: 网络问题或 API Key 失效

**解决**: 检查网络连接，确认 API Key 有效

---

## 🎯 完整示例

### 场景：提交 MyAgent 项目的更改

```bash
# 1. 进入项目
cd /Users/oasmet/Documents/!002Projects/MyAgent

# 2. 进行代码修改
# ... 编辑文件 ...

# 3. 暂存更改
git add .

# 4. 启动 MCP（如果还没启动）
npm start  # 在另一个终端

# 5. 调用工具（通过 MCP 客户端）
{
  "tool": "generateGitMessage",
  "parameters": {
    "folderPath": "/Users/oasmet/Documents/!002Projects/MyAgent",
    "model": "Claude-3-5-Sonnet",
    "messageType": "detailed"
  }
}

# 6. Message 已复制到剪贴板，使用它
git commit  # Cmd+V 粘贴 -> :wq 保存
```

---

## 模型推荐

- 🏆 **Claude-3-5-Sonnet** - 通用、平衡、最推荐
- ⚡ **GPT-4o** - 快速、精准
- 🚀 **Gemini-2-Flash** - 超快、流畅
- 🧠 **Claude-3-Opus** - 最强、深度分析

---

## 需要帮助？

查看详细文档：
- `README.md` - 完整功能说明
- `USAGE_EXAMPLES.md` - 详细使用示例

祝你使用愉快！🎉

