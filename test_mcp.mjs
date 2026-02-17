import axios from "axios";

const POE_API_KEY = "W4HQGO1TRCOcZzRv-8vB84REwnexAshVRVVhyZ9dpII";
const POE_API_BASE_URL = "https://api.poe.com/v1";

async function generateMessageWithAI(content, model = "Claude-3-5-Sonnet", messageType = "detailed") {
  try {
    const prompt = `You are an expert software engineer specializing in writing clear, concise, and informative Git commit messages.

Here is the Git repository change information:
${content}

Please generate a detailed and professional Git commit message that:
1. Starts with a clear subject line (max 72 characters)
2. Is followed by a blank line
3. Contains a detailed body explaining:
   - What changes were made
   - Why these changes were necessary
   - Any important implementation details
4. Include references to specific files or components that were modified
5. Be professional and clear

Format the response as a complete commit message ready to use.`;

    console.log("🔄 正在调用 POE API...");
    console.log(`📍 API URL: ${POE_API_BASE_URL}/chat/completions`);
    
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
      return response.data.choices[0].message.content;
    }

    throw new Error("Invalid response from POE API");
  } catch (error) {
    console.error(`❌ POE API 调用失败: ${error.message}`);
    if (error.response) {
      console.error(`Response Status: ${error.response.status}`);
      console.error(`Response Data:`, error.response.data);
    }
    throw error;
  }
}

// 测试数据
const testContent = `Project: !MyCv
Files Changed: 13
Insertions: +150
Deletions: -45

Changed Files:
- .DS_Store (deleted)
- course/202511280048_Serious_Agentic_AI_Courses.md (deleted)
- course/202512010239_JHU_Agentic_AI_Program_Welcome_Email.md (deleted)
- course/知乎的/202512092012_知乎知学堂_开学典礼通知.md (modified)
- course/知乎的/convert_to_mp3.py (new)
- course/知乎的/convert_to_mp3.sh (new)
- course/202512140148_JHU_Agentic_AI_Program_Details_and_Support.md (new)
- course/JHU_Agentic_AI_Certificate_Program/ (new directory)
- cv/png_to_jpg.py (modified)
- cv/简历模版 - 计算机.md (modified)`;

(async () => {
  try {
    const message = await generateMessageWithAI(testContent);
    console.log("\n✅ 生成的 Git Commit Message:\n");
    console.log("=".repeat(60));
    console.log(message);
    console.log("=".repeat(60));
  } catch (error) {
    console.error("Failed to generate message");
  }
})();
