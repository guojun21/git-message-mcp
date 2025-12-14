# 🚀 从这里开始！

欢迎使用 **Git Message MCP v2.0** - 一个强大的 AI 驱动的 Git Commit Message 生成工具！

---

## ⚡ 30秒快速开始

### 1️⃣ 安装
```bash
cd /Users/oasmet/Documents/!002Projects/!mcps/git-message-mcp
bun install
```

### 2️⃣ 启动
```bash
npm start
```

你应该看到：
```
🚀 Git Message MCP Server v2.0 started with stdio transport
```

### 3️⃣ 使用（通过任何 MCP 客户端，如 Cursor）

```json
{
  "tool": "generateGitMessage",
  "parameters": {
    "folderPath": "/Users/oasmet/Documents/!002Projects/MyAgent"
  }
}
```

### ✅ 完成！
Message 已自动复制到剪贴板。直接使用：
```bash
git commit  # Cmd+V 粘贴 -> :wq
```

---

## 📚 文档导航

| 文档 | 用途 | 时间 |
|------|------|------|
| **[QUICKSTART.md](./QUICKSTART.md)** | 5分钟快速上手 | 5 min |
| **[README.md](./README.md)** | 完整功能说明 | 10 min |
| **[USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)** | 具体代码示例 | 15 min |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | 系统设计深入 | 20 min |
| **[INDEX.md](./INDEX.md)** | 完整文档索引 | 5 min |

**👉 推荐：先读 QUICKSTART.md**

---

## 🎯 核心功能一览

### 功能 1: 列出可用模型
```json
{
  "tool": "listAvailableModels"
}
```
**返回**: POE 中所有可用的 AI 模型列表

### 功能 2: 生成 Git Message
```json
{
  "tool": "generateGitMessage",
  "parameters": {
    "folderPath": "/path/to/your/git/repo",
    "model": "Claude-3-5-Sonnet",           // 可选，默认值
    "messageType": "detailed",               // 可选: detailed/concise/changelog
    "includeStats": true                    // 可选，默认值
  }
}
```
**返回**: AI 生成的 commit message + 详细信息

---

## 💡 常见问题

### Q: 入参是什么？
A: **必需参数**: `folderPath`（你的 Git 项目路径）  
其他参数可选，都有默认值。

### Q: 什么是 messageType？
A: 生成的 message 格式：
- `detailed` - 完整的 commit message（推荐）
- `concise` - 简洁的一行总结
- `changelog` - Markdown 格式的更新日志

### Q: API Key 是什么？
A: 已内置！无需配置。  
`W4HQGO1TRCOcZzRv-8vB84REwnexAshVRVVhyZ9dpII`

### Q: 支持哪些 AI 模型？
A: 所有 POE 中的模型，包括：
- Claude-3-5-Sonnet（推荐，平衡）
- GPT-4o（快速、精准）
- Gemini-2-Flash（超快）
- Claude-3-Opus（最强）

### Q: 如何使用生成的 Message？
A: 已自动复制到剪贴板！
```bash
git commit  # 打开编辑器
# Cmd+V 粘贴 message
# :wq 保存
```

---

## 🎬 工作流示例

### 场景：提交 MyAgent 项目的更改

```bash
# 1. 进入项目，进行代码修改
cd /Users/oasmet/Documents/!002Projects/MyAgent
# ... 编辑文件 ...

# 2. 暂存更改（重要：不要 commit！）
git add .

# 3. 通过 MCP 客户端调用
{
  "tool": "generateGitMessage",
  "parameters": {
    "folderPath": "/Users/oasmet/Documents/!002Projects/MyAgent"
  }
}

# 4. Message 已复制到剪贴板
# 5. 使用它进行 commit
git commit  # Cmd+V -> :wq

# 6. 完成！
```

---

## 🔑 关键特性

✨ **AI 驱动** - 使用强大的 AI 模型（不是规则模板）

📋 **极简入参** - 仅需一个参数（folderPath）

🤖 **模型灵活** - 支持多个 POE 模型，随时切换

📊 **自动分析** - 自动收集 git diff、统计、最近提交等

📝 **多种格式** - 3 种格式适应不同场景

⚡ **自动复制** - 直接复制到剪贴板，开箱即用

🎯 **生产就绪** - TypeScript 严格模式，零错误

📚 **文档齐全** - 25000+ 字的完整文档

---

## 📦 项目结构

```
git-message-mcp/
├── 📄 核心源代码
│   └── index.ts (700+ 行，所有逻辑)
│
├── ⚙️ 配置
│   ├── package.json (依赖管理)
│   └── tsconfig.json (TypeScript 配置)
│
└── 📚 文档 (8 个文档，25000+ 字)
    ├── START_HERE.md ⬅️ 你在这里
    ├── QUICKSTART.md (快速开始)
    ├── README.md (完整文档)
    ├── USAGE_EXAMPLES.md (详细示例)
    ├── ARCHITECTURE.md (系统设计)
    ├── PROJECT_SUMMARY.md (项目概览)
    ├── INDEX.md (文档索引)
    └── DELIVERY_REPORT.md (交付报告)
```

---

## 🚀 下一步

### 第1步：快速上手（5分钟）
→ 读 **[QUICKSTART.md](./QUICKSTART.md)**

### 第2步：了解完整功能（10分钟）
→ 读 **[README.md](./README.md)**

### 第3步：看实战示例（10分钟）
→ 读 **[USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)**

### 第4步：开始使用！
→ 按照 QUICKSTART.md 的步骤安装和启动

---

## 🎓 学习路径

### 🟢 初级（了解基础）
1. START_HERE.md（当前文件）
2. QUICKSTART.md
3. 尝试简单示例

### 🟡 中级（日常使用）
1. README.md 完整阅读
2. 尝试所有 3 种格式
3. 集成到工作流

### 🔴 高级（修改/扩展）
1. ARCHITECTURE.md 理解设计
2. 阅读 index.ts 源代码
3. 自定义或扩展功能

---

## ✅ 检查清单

启动前确保：

- [ ] 已安装 Node.js 或 Bun
- [ ] 已进入项目目录
- [ ] 已运行 `bun install` 或 `npm install`
- [ ] 准备好 Git 仓库路径

---

## 🆘 遇到问题？

### 安装问题
→ 查看 **QUICKSTART.md** 的"故障排除"部分

### 使用问题
→ 查看 **README.md** 的"故障排除"部分

### 技术问题
→ 查看 **ARCHITECTURE.md** 理解设计

### 不知道入参是什么？
→ 查看 **README.md** 的"入参说明"部分

---

## 💬 核心要点

| 要点 | 说明 |
|------|------|
| **只需一个参数** | `folderPath` |
| **API Key 已内置** | 无需配置 |
| **自动复制到剪贴板** | 直接粘贴使用 |
| **AI 驱动** | 真正的智能生成 |
| **支持多模型** | 随时切换 |
| **三种格式** | 满足不同场景 |
| **完整文档** | 25000+ 字 |

---

## 🎯 成功的关键

```
1️⃣ 安装依赖        (bun install)
2️⃣ 启动服务         (npm start)
3️⃣ 准备 Git 仓库     (git add .)
4️⃣ 调用工具         (指定 folderPath)
5️⃣ 使用生成的 message (git commit)
6️⃣ 完成！           ✅
```

---

## 📊 版本信息

- **版本**: v2.0.0
- **发布日期**: 2024-12-14
- **状态**: ✅ 生产就绪
- **API**: POE API (OpenAI 兼容)

---

## 🎉 你已准备好！

现在你了解了基本情况，可以开始使用了。

### 推荐流程：
1. **5分钟**: 读 QUICKSTART.md
2. **2分钟**: 安装依赖 + 启动服务
3. **3分钟**: 第一次使用
4. **开始享受**: AI 自动为你生成高质量的 Git messages！

---

## 📖 完整文档清单

- ✅ START_HERE.md (你在这里)
- ✅ QUICKSTART.md (5分钟上手)
- ✅ README.md (完整文档)
- ✅ USAGE_EXAMPLES.md (6个详细示例)
- ✅ ARCHITECTURE.md (系统设计)
- ✅ PROJECT_SUMMARY.md (项目概览)
- ✅ INDEX.md (文档导航)
- ✅ DELIVERY_REPORT.md (交付报告)

**总计**: 25000+ 字的专业文档

---

## 🌟 核心优势

1. **开箱即用** - 安装即用，无需复杂配置
2. **智能自动化** - AI 理解代码变更，自动生成
3. **灵活多样** - 3 种格式，多个模型可选
4. **高效工作流** - 自动剪贴板，快速提交
5. **文档完善** - 25000+ 字专业文档
6. **生产级质量** - TypeScript 严格，零错误

---

<div align="center">

# 🚀 准备好了吗？

### 👉 [现在就开始！](./QUICKSTART.md)

</div>

---

**祝你使用愉快！** ✨

*Git Message MCP v2.0 - 让 AI 帮你写更好的 Commit Message*

💡 **提示**: 如果有任何问题，先查看 QUICKSTART.md 的常见问题部分。


