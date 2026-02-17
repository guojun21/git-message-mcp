# 📑 Git Message MCP v2.0 - 完整文档索引

## 📚 文档导航

### 🚀 快速开始（新用户必读）
1. **[QUICKSTART.md](./QUICKSTART.md)** ⭐ **从这里开始！**
   - 5分钟快速上手
   - 环境配置
   - 基本使用示例
   - 常见问题速查

### 📖 详细文档
2. **[README.md](./README.md)** - 完整功能文档
   - 系统要求
   - 安装方法
   - 完整 API 参考
   - 所有参数说明
   - 返回数据结构
   - 故障排除指南

3. **[USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)** - 实战示例集
   - 6个完整示例（从简单到高级）
   - 各种场景的调用方式
   - 错误处理示例
   - 集成到工作流的方法
   - 模型选择指南

### 🏗️ 架构与设计
4. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - 系统设计文档
   - 高层架构图
   - 模块化设计
   - 数据流详解
   - 时序图
   - 设计原则
   - 扩展机制
   - 性能考虑

5. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - 项目概览
   - 项目介绍
   - 核心功能
   - 技术栈
   - 工具详解
   - 完整示例
   - 性能特性
   - 版本历史

### 💻 源代码
6. **[index.ts](./index.ts)** - 主程序
   - FastMCP 服务器定义
   - 两个核心工具实现
   - Git 操作函数
   - POE API 集成
   - 工具参数定义

7. **[package.json](./package.json)** - 项目配置
   - 依赖管理
   - 启动脚本
   - 项目元数据

8. **[tsconfig.json](./tsconfig.json)** - TypeScript 配置
   - 编译选项
   - 最佳实践设置

---

## 🎯 快速查找

### 我想...

#### ...快速上手
→ 阅读 **QUICKSTART.md**（5分钟）

#### ...了解完整功能
→ 阅读 **README.md**（10分钟）

#### ...看具体代码示例
→ 查看 **USAGE_EXAMPLES.md**（15分钟）

#### ...理解系统设计
→ 查看 **ARCHITECTURE.md**（20分钟）

#### ...了解项目概况
→ 查看 **PROJECT_SUMMARY.md**（10分钟）

#### ...修改或扩展代码
→ 查看 **index.ts** + **ARCHITECTURE.md**

#### ...排查问题
→ 查看 **README.md** 的 🔧 故障排除部分

#### ...查看版本历史
→ 查看 **PROJECT_SUMMARY.md** 的版本历史部分

---

## 📊 文档统计

| 文档 | 类型 | 字数 | 适合 |
|------|------|------|------|
| QUICKSTART.md | 快速入门 | ~2000 | 完全新手 |
| README.md | 完整文档 | ~5000 | 日常使用 |
| USAGE_EXAMPLES.md | 示例代码 | ~4000 | 实战学习 |
| ARCHITECTURE.md | 设计文档 | ~6000 | 开发者/维护 |
| PROJECT_SUMMARY.md | 项目概览 | ~4000 | 全局理解 |
| 源代码 (index.ts) | 代码 | ~700 行 | 参考实现 |

**总计**: ~25000 字 + 700 行代码

---

## 🔄 推荐阅读顺序

### 对于新用户

```
1. QUICKSTART.md (快速了解 5 min)
   ↓
2. 按照步骤启动和调用工具 (10 min)
   ↓
3. USAGE_EXAMPLES.md 中查看需要的示例 (5-15 min)
   ↓
4. 开始使用！
```

### 对于开发者

```
1. README.md (全面了解)
   ↓
2. ARCHITECTURE.md (理解设计)
   ↓
3. index.ts (查看实现)
   ↓
4. 开始修改/扩展！
```

### 对于运维/管理

```
1. PROJECT_SUMMARY.md (项目概况)
   ↓
2. QUICKSTART.md (安装部署)
   ↓
3. README.md 的故障排除部分
   ↓
4. 部署和维护！
```

---

## 🔑 核心概念速查

### 两个工具

| 工具 | 功能 | 入参数 | 返回 |
|------|------|--------|------|
| **listAvailableModels** | 获取可用 AI 模型 | 0 | models 数组 |
| **generateGitMessage** | 生成 AI commit message | 4 个 | 消息 + 详情 |

### 三个消息格式

| 格式 | 用途 | 特点 |
|------|------|------|
| **detailed** | 正式提交 | 标题+主体+统计 |
| **concise** | 日常开发 | 简洁一行 |
| **changelog** | 版本发布 | Markdown 格式 |

### 关键流程

```
文件夹路径 
  → 验证 
  → 收集 Git 信息 
  → 调用 POE API 
  → AI 生成 message 
  → 复制到剪贴板
  → 返回结果
```

---

## 📋 核心特性清单

- ✅ **一个必需参数** (`folderPath`)
- ✅ **AI 驱动生成** (不是规则模板)
- ✅ **多模型支持** (从 POE API 动态获取)
- ✅ **自动剪贴板** (直接 pbcopy)
- ✅ **三种格式** (detailed / concise / changelog)
- ✅ **完整错误处理** (验证 + 反馈)
- ✅ **统计信息** (文件数、增删行数)
- ✅ **参数验证** (Zod)

---

## 🚀 入门步骤

### Step 1: 安装
```bash
cd /Users/oasmet/Documents/!002Projects/!mcps/git-message-mcp
bun install
```

### Step 2: 启动
```bash
npm start
```

### Step 3: 使用（通过 MCP 客户端）
```json
{
  "tool": "generateGitMessage",
  "parameters": {
    "folderPath": "/path/to/your/git/repo"
  }
}
```

### Step 4: 完成
Message 已复制到剪贴板！直接使用。

---

## 📞 常见问题速答

| 问题 | 答案 | 详见 |
|------|------|------|
| 什么时候用 detailed？ | 需要完整 message 时 | USAGE_EXAMPLES.md |
| API Key 是什么？ | 已内置，无需配置 | README.md |
| 支持哪些模型？ | 调用 listAvailableModels | QUICKSTART.md |
| 如何扩展功能？ | 修改 index.ts | ARCHITECTURE.md |
| 删除数据吗？ | 不，仅分析不存储 | README.md |
| 离线可以用吗？ | 否，需要网络调用 POE | README.md |

---

## 🎓 学习路径

### 初级（了解用法）
1. QUICKSTART.md
2. 运行简单示例
3. 看 USAGE_EXAMPLES.md 前两个例子

### 中级（日常使用）
1. README.md 完整阅读
2. 尝试所有格式
3. 集成到工作流

### 高级（修改/扩展）
1. ARCHITECTURE.md 理解设计
2. index.ts 阅读源代码
3. 修改 buildPrompt 或添加新功能

---

## 🔗 文件关联图

```
INDEX.md (当前文件，导航中心)
├─ QUICKSTART.md ────── 新手必读
├─ README.md ───────── 完整文档
├─ USAGE_EXAMPLES.md ── 具体示例
├─ ARCHITECTURE.md ──── 系统设计
├─ PROJECT_SUMMARY.md ─ 项目概览
│
└─ 源代码文件
   ├─ index.ts ──────── 主程序
   ├─ package.json ────── 依赖
   └─ tsconfig.json ────── 配置
```

---

## 💡 提示

- 📝 **保留这个文件** 作为快速导航
- 🔖 **标记常用文档** 便于快速访问
- 🔍 **使用 Ctrl+F** 在文档中搜索
- 📱 **保存 QUICKSTART.md** 到手机备用
- 🤝 **分享 QUICKSTART.md** 给团队成员

---

## 📈 版本信息

- **当前版本**: v2.0.0
- **发布日期**: 2024-12-14
- **主要特性**: POE API 集成、AI 驱动生成
- **状态**: ✅ 生产就绪

---

## 🎯 成功的关键

1. ✅ 读 **QUICKSTART.md**
2. ✅ 安装依赖
3. ✅ 启动服务
4. ✅ 指定文件夹路径
5. ✅ 调用工具
6. ✅ 使用生成的 message
7. ✅ 完成！

---

**祝你使用愉快！** 🚀

有问题？返回 QUICKSTART.md 或 README.md 查找答案。


