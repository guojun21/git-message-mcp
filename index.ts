#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as child_process from "child_process";
import * as fs from "fs";
import * as path from "path";
import axios from "axios";

// POE API Configuration
const POE_API_KEY = "W4HQGO1TRCOcZzRv-8vB84REwnexAshVRVVhyZ9dpII";
const POE_API_BASE_URL = "https://api.poe.com/v1";

// ============== POE API Functions ==============

async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await axios.get(`${POE_API_BASE_URL}/models`, {
      headers: {
        Authorization: `Bearer ${POE_API_KEY}`,
      },
    });

    if (response.data && response.data.models) {
      return response.data.models.map((model: any) => model.name);
    }
    return [];
  } catch (error: any) {
    return [
      "Claude-3-5-Sonnet",
      "GPT-4o",
      "Gemini-2-Flash",
      "Claude-3-Opus",
    ];
  }
}

function extractPureCommitMessage(rawContent: string): string {
  let content = rawContent.trim();
  
  // First, try to extract content from markdown code blocks (handle multiple code blocks)
  const codeBlockMatches = content.match(/```[\w]*\n([\s\S]*?)```/g);
  if (codeBlockMatches && codeBlockMatches.length > 0) {
    // Get the last code block (usually the actual commit message)
    const lastCodeBlock = codeBlockMatches[codeBlockMatches.length - 1];
    const codeContent = lastCodeBlock.match(/```[\w]*\n([\s\S]*?)```/);
    if (codeContent) {
      content = codeContent[1].trim();
    }
  }
  
  // Remove markdown code block markers if still present
  content = content.replace(/^```[\w]*\n?/gm, '');
  content = content.replace(/```$/gm, '');
  content = content.replace(/```\n/gm, '\n');
  
  // Remove everything before the first line that looks like a commit message
  // This handles cases like "Here's a complete commit message:\n\n```\nchore: ..."
  const lines = content.split('\n');
  let startIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (line.length === 0) continue;
    
    // Check if this line starts a commit message
    if (line.match(/^(?:feature|fix|refactor|perf|docs|test|chore|style|revert):\s+/i)) {
      startIndex = i;
      break;
    }
    
    // Skip explanation lines
    if (/^(Here's|Here is|I'll|This is|The|好的|以下是|Generated|Commit message|Git commit message)/i.test(line) ||
        /commit\s+message/i.test(line)) {
      continue;
    }
    
    // If we find a line that looks like a commit message subject (starts with capital, reasonable length)
    if (line.match(/^[A-Z][a-z]+(?:\s+[a-z]+)*:/) && line.length > 10 && line.length < 100) {
      startIndex = i;
      break;
    }
  }
  
  if (startIndex >= 0) {
    content = lines.slice(startIndex).join('\n');
  }
  
  // Remove common explanation prefixes (more comprehensive)
  const prefixesToRemove = [
    /^Here's\s+(?:a\s+)?(?:formatted\s+|properly\s+formatted\s+|complete\s+)?(?:Git\s+)?commit\s+message\s+(?:for\s+these\s+changes\s*)?[:\n]*/i,
    /^Here\s+(?:is\s+)?(?:a\s+)?(?:formatted\s+|properly\s+formatted\s+|complete\s+)?(?:Git\s+)?commit\s+message\s*[:\n]*/i,
    /^I'll\s+(?:generate|create)\s+(?:a\s+)?(?:Git\s+)?commit\s+message\s*[:\n]*/i,
    /^好的.*?生成.*?commit\s+message\s*[:\n]*/i,
    /^以下是.*?commit\s+message\s*[:\n]*/i,
    /^This\s+(?:is\s+)?(?:a\s+)?(?:Git\s+)?commit\s+message\s*[:\n]*/i,
    /^The\s+(?:Git\s+)?commit\s+message\s*[:\n]*/i,
    /^Generated\s+(?:Git\s+)?commit\s+message\s*[:\n]*/i,
    /^Commit\s+message\s*[:\n]*/i,
    /^Git\s+commit\s+message\s*[:\n]*/i,
  ];
  
  for (const prefix of prefixesToRemove) {
    content = content.replace(prefix, '');
  }
  
  // Remove trailing explanations and statistics
  const suffixesToRemove = [
    /\n---\s*\n.*$/s,  // Remove everything after ---
    /\n📊\s*Statistics:.*$/s,  // Remove statistics with emoji
    /\nStatistics:.*$/s,  // Remove statistics
    /\nNote:.*$/s,  // Remove notes
    /\nRemember:.*$/s,  // Remove reminders
    /\n---\s*📊.*$/s,  // Remove statistics section
  ];
  
  for (const suffix of suffixesToRemove) {
    content = content.replace(suffix, '');
  }
  
  // Find the actual commit message
  // Try to find message starting with type (feature, fix, etc.)
  let commitMessageMatch = content.match(/((?:feature|fix|refactor|perf|docs|test|chore|style|revert):\s+.*)/is);
  if (commitMessageMatch) {
    content = commitMessageMatch[1];
  }
  
  // Clean up extra whitespace
  content = content.trim();
  
  // Final cleanup: remove any remaining markdown formatting
  content = content.replace(/^\*\*([^*]+)\*\*/gm, '$1'); // Remove bold markers
  content = content.replace(/^#+\s+/gm, ''); // Remove markdown headers if at start of line
  
  return content.trim();
}

async function generateMessageWithAI(
  content: string,
  model: string,
  messageType: "detailed" | "concise" | "changelog"
): Promise<string> {
  try {
    const prompt = buildPrompt(content, messageType);

    const response = await axios.post(
      `${POE_API_BASE_URL}/chat/completions`,
      {
        model: model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${POE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      const rawContent = response.data.choices[0].message.content;
      return extractPureCommitMessage(rawContent);
    }

    throw new Error("Invalid response from POE API");
  } catch (error: any) {
    throw new Error(`POE API 调用失败: ${error.message}`);
  }
}

function buildPrompt(
  gitInfo: string,
  messageType: "detailed" | "concise" | "changelog"
): string {
  const commitMessageStandard = `# Commit Message 规范

> 基于 Conventional Commits 规范 + 团队实践总结，确保每次提交都能清晰表达变更意图、方便代码追溯和自动化工具处理。

## 0. 🚨 最重要的规则：中英双语

**Commit Message 必须中英双语！**

\`\`\`
# ✅ 正确格式
<type>: <English subject>

<类型>: <中文主题>

<English body>

<中文 body>
\`\`\`

**这不是可选的，是强制的！** 不写双语的 Commit 会被打回。

## 1. 核心格式

\`\`\`
<type>: <English subject>

<类型>: <中文主题>

<body - 中英双语>

<footer>
\`\`\`

### 必填部分

| 部分 | 说明 | 示例 |
|------|------|------|
| \`<type>\` | 变更类型，见下方列表 | \`feature\`、\`fix\` |
| \`<English subject>\` | 英文简短描述 | \`Add LineId field to weight dimension DTOs\` |
| \`<中文主题>\` | 中文简短描述 | \`在重量维度 DTO 中添加 LineId 字段\` |

### 可选部分

| 部分 | 说明 |
|------|------|
| \`<body>\` | 详细描述变更内容、背景、影响范围（**中英双语**） |
| \`<footer>\` | 关联信息，如 Breaking Changes、相关 JIRA |

## 2. Type 类型列表

| Type | 说明 | 使用场景 |
|------|------|----------|
| \`feature\` | 新功能 | 新增接口、字段、业务逻辑 |
| \`fix\` | Bug 修复 | 修复线上/测试环境问题 |
| \`refactor\` | 重构 | 不改变功能的代码重构 |
| \`perf\` | 性能优化 | 提升性能的改动 |
| \`docs\` | 文档 | 仅修改文档 |
| \`test\` | 测试 | 添加/修改测试用例 |
| \`chore\` | 杂项 | 构建、依赖、配置等非业务改动 |
| \`style\` | 格式 | 代码格式化，不影响逻辑 |
| \`revert\` | 回滚 | 回滚之前的提交 |

## 3. Subject 主题规范

### 3.1 语言选择：中英双语必须！

**🚨 中英双语是强制要求，不是可选！**

\`\`\`
# ✅ 正确：中英双语
feature: Add LineId field to weight dimension DTOs

功能: 在重量维度 DTO 中添加 LineId 字段
\`\`\`

### 3.2 格式要求

1. **首字母大写**（英文）
2. **不加句号**
3. **祈使语气**：用 \`Add\` 而不是 \`Added\` 或 \`Adds\`
4. **长度限制**：50 字符以内

\`\`\`
# ✅ 正确
feature: Add LineId field to weight dimension DTOs
\`\`\`

### 3.3 常用动词

| 动词 | 场景 |
|------|------|
| \`Add\` | 新增功能/字段/文件 |
| \`Remove\` | 删除功能/字段/文件 |
| \`Update\` | 更新已有功能 |
| \`Fix\` | 修复问题 |
| \`Refactor\` | 重构代码 |
| \`Optimize\` | 优化性能 |
| \`Support\` | 支持新特性 |
| \`Handle\` | 处理特定场景 |

## 4. Body 详细描述规范

### 4.1 何时需要 Body

- 变更涉及 **多个文件/模块**
- 需要解释 **为什么这么做**（Why）
- 存在 **向后兼容性** 考虑
- 涉及 **跨团队依赖**

### 4.2 推荐结构（中英双语）

**每个章节标题用 \`English / 中文\` 格式，内容也要中英双语！**

\`\`\`markdown
## Summary / 概述

This commit adds the \`LineId\` field to enable PIS to determine correct partnerId.

本次提交添加 \`LineId\` 字段，使 PIS 能够确定正确的 partnerId。

## Background / 背景

BEST 3PL requires different \`partnerId\` values based on shipping line.

BEST 3PL 需要根据不同的运输线路使用不同的 \`partnerId\` 值。

## Changes / 变更内容

### 1. DTO Layer / DTO 层
- Added \`LineId\` field to \`WeightDimensionInfo\`
- 在 \`WeightDimensionInfo\` 中添加 \`LineId\` 字段

### 2. Business Logic / 业务逻辑层
- Modified \`UpdateWaybillWeightDimension\` method
- 修改 \`UpdateWaybillWeightDimension\` 方法

## Backward Compatibility / 向后兼容性（可选）

- Old callers will have empty string value
- 不传 LineId 的老调用方将得到空字符串值
\`\`\`

## 5. Footer 规范

### 5.1 关联信息

\`\`\`
Related: SPLN-42670, SPLN-42671
Downstream: PIS (Partner Integration System)
\`\`\`

### 5.2 Breaking Changes

如果有破坏性变更，**必须**在 Footer 中标注：

\`\`\`
BREAKING CHANGE: \`WeightDimensionInfo.Weight\` 字段类型从 \`int\` 改为 \`float64\`
\`\`\`

## 6. 完整示例（中英双语）

### 6.1 简单变更（单文件/小改动）

\`\`\`
fix: Correct weight unit conversion in PIS request

修复: 修正 PIS 请求中的重量单位转换

Fix the weight unit conversion error in PIS request. The divisor should be 1000 when converting from grams to kilograms.

修复 PIS 请求中重量单位转换错误，从克转换为千克时除数应为 1000。
\`\`\`

### 6.2 中等变更（多文件/单功能）

\`\`\`
feature: Add LineId field to weight dimension DTOs

功能: 在重量维度 DTO 中添加 LineId 字段

## Summary / 概述

This commit adds the \`LineId\` field to the weight dimension data transfer flow, enabling PIS to determine the correct BEST API \`partnerId\`.

本次提交在重量维度数据传递流程中添加 \`LineId\` 字段，使 PIS 能够根据线路标识符确定正确的 BEST API partnerId。

## Changes / 变更内容

### DTO Layer / DTO 层
- \`dto/fulfillment_dto/weight.go\`: Added \`LineId\` field
- \`dto/fulfillment_dto/weight.go\`: 添加 \`LineId\` 字段

### Business Logic / 业务逻辑层
- \`internal/domain/transform_domain/transform_service.go\`: Pass \`LineId\` from cache
- \`internal/domain/transform_domain/transform_service.go\`: 从缓存传递 \`LineId\`

## Backward Compatibility / 向后兼容性

- Old callers that don't pass \`LineId\` will have an empty string value
- PIS will use the default \`partnerId\` (SG_SHOPEE_CB)
- 不传 LineId 的老调用方将得到空字符串
- PIS 将使用默认 partnerId (SG_SHOPEE_CB)
\`\`\`

## 7. 常见错误

### ❌ 没有中英双语（最常见！）

\`\`\`
# ❌ 只有英文
feature: Add LineId field

# ❌ 只有中文
功能: 添加 LineId 字段

# ✅ 正确：中英双语
feature: Add LineId field

功能: 添加 LineId 字段
\`\`\`

### ❌ Type 不规范

\`\`\`
feat: Add LineId field    # 应该用 feature，不是 feat
新功能: Add LineId field   # type 必须用英文
\`\`\`

### ❌ Subject 太长

\`\`\`
feature: Add LineId field to weight dimension DTOs and update related logic in transform service and distribution domain
\`\`\`

### ❌ Subject 太模糊

\`\`\`
fix: Fix bug
feature: Update code
refactor: Refactor
\`\`\`

### ❌ 用过去时

\`\`\`
feature: Added LineId field
\`\`\`

### ❌ 带句号

\`\`\`
feature: Add LineId field.
\`\`\`

## 8. Code Review 检查清单

1. ✅ **中英双语**（最重要！必须双语）
2. ✅ Type 使用正确
3. ✅ Subject 简洁明了，50 字符以内
4. ✅ 祈使语气，首字母大写，无句号
5. ✅ 复杂变更有 Body 说明（中英双语）
6. ✅ 涉及向后兼容的有相关说明
7. ✅ Breaking Changes 有明确标注

## 9. 一句话总结

> **Commit Message 必须中英双语！**  
> 英文方便国际团队协作，中文方便中国团队快速理解业务背景。  
> Type 让人快速分类，Subject 让人一眼知道改了什么，Body 让人理解为什么这么改。`;

  const basePrompt = `You are an expert software engineer specializing in writing Git commit messages following the team standards.

**CRITICAL REQUIREMENTS:**
1. **MANDATORY Bilingual (English + Chinese)**: All commit messages MUST be in both English and Chinese
2. **Format**: <type>: <English subject> followed by <类型>: <中文主题>
3. **Output ONLY the commit message**: No explanations, no "Here's...", no "I'll generate...", just the pure commit message text

Here is the Commit Message Standard you MUST follow:

${commitMessageStandard}

---

Here is the Git repository change information:
${gitInfo}

---

**IMPORTANT INSTRUCTIONS:**
1. Analyze the git changes carefully
2. Generate a commit message STRICTLY following the standard above
3. **OUTPUT ONLY THE COMMIT MESSAGE TEXT** - no explanations, no markdown code blocks, no "Here's...", no "I'll...", just the pure commit message
4. Ensure BOTH English and Chinese versions are present
5. Use appropriate type (feature, fix, refactor, perf, docs, test, chore, style, revert)
6. Keep subject line under 50 characters
7. Use imperative mood, capitalize first letter, no period

`;

  if (messageType === "detailed") {
    return (
      basePrompt +
      `Generate a detailed commit message with body section explaining:
- What changes were made (中英双语)
- Why these changes were necessary (中英双语)
- Any important implementation details (中英双语)
- References to specific files or components modified (中英双语)

Use the structure: Summary / 概述, Background / 背景, Changes / 变更内容, etc.

REMEMBER: Output ONLY the commit message text, nothing else.`
    );
  } else if (messageType === "concise") {
    return (
      basePrompt +
      `Generate a concise commit message:
- Single line or very brief format
- Still MUST include both English and Chinese versions
- Clearly summarize the main changes
- Use imperative mood

REMEMBER: Output ONLY the commit message text, nothing else.`
    );
  } else {
    return (
      basePrompt +
      `Generate a changelog entry in Markdown format:
- Use standard changelog format (## [Version])
- Categorize changes under: Added, Fixed, Changed, Removed, Security
- Use bullet points for each change
- Still include bilingual descriptions where appropriate

REMEMBER: Output ONLY the changelog text, nothing else.`
    );
  }
}

// ============== Git Helper Functions ==============

function getGitDiffStats(folderPath: string): {
  filesChanged: number;
  insertions: number;
  deletions: number;
  summary: string;
} {
  try {
    const stats = child_process
      .execSync(`cd "${folderPath}" && git diff --stat HEAD`, {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      })
      .trim();

    const lines = stats.split("\n");
    const lastLine = lines[lines.length - 1] || "";

    const fileMatch = lastLine.match(/(\d+)\s+files?\s+changed/);
    const insertMatch = lastLine.match(/(\d+)\s+insertions?\(\+\)/);
    const deleteMatch = lastLine.match(/(\d+)\s+deletions?\(\-\)/);

    return {
      filesChanged: fileMatch ? parseInt(fileMatch[1]) : 0,
      insertions: insertMatch ? parseInt(insertMatch[1]) : 0,
      deletions: deleteMatch ? parseInt(deleteMatch[1]) : 0,
      summary: lastLine,
    };
  } catch {
    return {
      filesChanged: 0,
      insertions: 0,
      deletions: 0,
      summary: "Unable to get git diff stats",
    };
  }
}

function getChangedFiles(folderPath: string): string[] {
  try {
    const output = child_process
      .execSync(`cd "${folderPath}" && git diff HEAD --name-only`, {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      })
      .trim();

    return output.split("\n").filter((file) => file.length > 0);
  } catch {
    return [];
  }
}

function getGitDiffContent(folderPath: string): string {
  try {
    const diff = child_process
      .execSync(`cd "${folderPath}" && git diff HEAD`, {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      })
      .trim();

    return diff.substring(0, 10000);
  } catch {
    return "";
  }
}

function getRecentCommitMessages(folderPath: string, count: number = 3): string[] {
  try {
    const output = child_process
      .execSync(`cd "${folderPath}" && git log --oneline -${count}`, {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      })
      .trim();

    return output.split("\n").filter((msg) => msg.length > 0);
  } catch {
    return [];
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const proc = child_process.spawn("pbcopy", [], {
        stdio: ["pipe", "ignore", "ignore"],
      });

      proc.stdin.write(text);
      proc.stdin.end();

      proc.on("close", (code) => {
        resolve(code === 0);
      });

      setTimeout(() => resolve(false), 5000);
    } catch {
      resolve(false);
    }
  });
}

// ============== MCP Server Setup ==============

const server = new Server(
  {
    name: "git-message-mcp",
    version: "2.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "listAvailableModels",
        description: "获取POE API中所有可用的AI模型列表",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "generateGitMessage",
        description:
          "分析指定文件夹的git变更，使用AI生成详细的Git commit message，并复制到剪贴板。",
        inputSchema: {
          type: "object",
          properties: {
            folderPath: {
              type: "string",
              description: "要分析的文件夹的绝对路径",
            },
            model: {
              type: "string",
              description:
                "使用的AI模型名称，例如: Claude-3-5-Sonnet, GPT-4o, Gemini-2-Flash (默认: Claude-3-5-Sonnet)",
              default: "Claude-3-5-Sonnet",
            },
            messageType: {
              type: "string",
              enum: ["detailed", "concise", "changelog"],
              description:
                "生成的message类型：detailed(详细)、concise(简洁)或changelog(更新日志)",
              default: "detailed",
            },
            includeStats: {
              type: "boolean",
              description: "是否在message中包含统计数据",
              default: true,
            },
          },
          required: ["folderPath"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "listAvailableModels") {
    try {
      const models = await getAvailableModels();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              models: models,
              message: `✅ 成功获取 ${models.length} 个可用模型`,
            }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              message: `❌ 获取模型列表失败: ${error.message}`,
            }, null, 2),
          },
        ],
      };
    }
  }

  if (name === "generateGitMessage") {
    const folderPath = args?.folderPath as string;
    const model = (args?.model as string) || "Claude-3-5-Sonnet";
    const messageType = (args?.messageType as "detailed" | "concise" | "changelog") || "detailed";
    const includeStats = args?.includeStats !== false;

    // Validate folder exists
    if (!fs.existsSync(folderPath)) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              message: `❌ 文件夹不存在: ${folderPath}`,
            }, null, 2),
          },
        ],
      };
    }

    // Check if it's a git repository
    if (!fs.existsSync(path.join(folderPath, ".git"))) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              message: `❌ 该文件夹不是一个git仓库: ${folderPath}`,
            }, null, 2),
          },
        ],
      };
    }

    try {
      const folderName = path.basename(folderPath);
      const stats = getGitDiffStats(folderPath);
      const changedFiles = getChangedFiles(folderPath);
      const diffContent = getGitDiffContent(folderPath);
      const recentCommits = getRecentCommitMessages(folderPath, 3);

      if (stats.filesChanged === 0 && changedFiles.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                message: "❌ 没有未提交的更改",
              }, null, 2),
            },
          ],
        };
      }

      const aiContext = `Project: ${folderName}
Files Changed: ${stats.filesChanged}
Insertions: +${stats.insertions}
Deletions: -${stats.deletions}

Changed Files:
${changedFiles.map((f) => `- ${f}`).join("\n")}

Recent Commits:
${recentCommits.map((c) => `- ${c}`).join("\n")}

Git Diff Preview:
${diffContent}
`;

      let aiGeneratedMessage = await generateMessageWithAI(
        aiContext,
        model,
        messageType
      );

      // Ensure the message is pure (no extra content)
      const pureMessage = aiGeneratedMessage.trim();

      // Copy pure message to clipboard (no statistics)
      const clipboardSuccess = await copyToClipboard(pureMessage);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              message: clipboardSuccess
                ? `✅ Git message 已成功复制到剪贴板！\n\n📊 统计信息：\n文件数: ${stats.filesChanged}\n插入: +${stats.insertions}\n删除: -${stats.deletions}\n\n🤖 AI模型: ${model}`
                : `⚠️ Message生成成功，但复制到剪贴板失败。\n\n生成的内容：\n\n${pureMessage}`,
              details: {
                folderPath,
                folderName,
                filesChanged: stats.filesChanged,
                insertions: stats.insertions,
                deletions: stats.deletions,
                messageType,
                model,
                copiedToClipboard: clipboardSuccess,
                generatedMessage: pureMessage,
              },
            }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              message: `❌ 生成Git message时出错: ${error.message}`,
            }, null, 2),
          },
        ],
      };
    }
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          success: false,
          message: `❌ 未知工具: ${name}`,
        }, null, 2),
      },
    ],
  };
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 Git Message MCP Server v2.0 started");
}

main().catch(console.error);
