import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables before initializing service
dotenv.config();

interface FunctionAnalysis {
  name: string;
  description: string;
  purpose: string;
  complexity: string;
}

interface FileAnalysis {
  description: string;
  purpose: string;
  keyComponents: string[];
}

interface CodebaseInsight {
  overallPurpose: string;
  architecture: string;
  mainComponents: string[];
}

class AIService {
  private isEnabled: boolean = false;
  private client: OpenAI | null = null;
  private model: string = "gpt-4o-mini";

  constructor() {
    // Support both LITELLM_API_KEY (virtual key) and OPENAI_API_KEY (direct)
    const apiKey = process.env.LITELLM_API_KEY || process.env.OPENAI_API_KEY || null;
    
    // LiteLLM proxy base URL - defaults to UKG internal proxy
    const baseURL = process.env.LITELLM_BASE_URL || "https://sdlc-llm.ukg.int";
    
    // Model selection - defaults to Claude Sonnet 4 via Vertex AI
    this.model = process.env.AI_MODEL || "claude-sonnet-4";
    
    if (apiKey) {
      this.isEnabled = true;
      // Initialize OpenAI client with custom baseURL for UKG proxy
      this.client = new OpenAI({
        apiKey: apiKey,
        baseURL: baseURL,
      });
      console.log(`✓ AI Service enabled with LiteLLM (model: ${this.model})`);
      console.log(`  Using proxy: ${baseURL}`);
    } else {
      console.log("⚠ AI Service disabled - LITELLM_API_KEY not configured");
      console.log("  Set LITELLM_API_KEY environment variable to enable AI analysis");
    }
  }

  isAIEnabled(): boolean {
    return this.isEnabled;
  }

  async analyzeFunctionBatch(
    functions: Array<{
      name: string;
      code: string;
      parameters: Array<{ name: string; type?: string }>,
      returnType?: string;
      filePath: string;
    }>
  ): Promise<Map<string, FunctionAnalysis>> {
    if (!this.isEnabled || !this.client) {
      console.log("⚠ AI analysis skipped - service not enabled");
      return new Map();
    }

    console.log(`🤖 Analyzing ${functions.length} functions with AI...`);
    const results = new Map<string, FunctionAnalysis>();

    try {
      // Process in smaller batches to avoid token limits
      const batchSize = 5;
      for (let i = 0; i < functions.length; i += batchSize) {
        const batch = functions.slice(i, i + batchSize);
        console.log(`  Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(functions.length/batchSize)} (${batch.length} functions)`);
        
        const prompt = this.buildFunctionAnalysisPrompt(batch);
        
        try {
          const response = await this.client.chat.completions.create({
            model: this.model,
            messages: [
              {
                role: "system",
                content: "You are an expert code analyst. Analyze functions and provide concise, clear descriptions of what they do, their purpose in the codebase, and complexity level."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: 4000,
          });

          const content = response.choices[0]?.message?.content;
          if (content) {
            console.log(`  ✓ Got AI response, parsing...`);
            this.parseFunctionAnalysisResponse(content, batch, results);
            console.log(`  ✓ Parsed ${results.size} function descriptions so far`);
          } else {
            console.warn(`  ⚠ Empty response from AI for batch ${Math.floor(i/batchSize) + 1}`);
          }
        } catch (batchError) {
          console.error(`  ✗ Error analyzing batch ${Math.floor(i/batchSize) + 1}:`, batchError);
          if (batchError instanceof Error) {
            console.error(`    Message: ${batchError.message}`);
          }
        }

        // Rate limiting
        if (i + batchSize < functions.length) {
          await this.sleep(500);
        }
      }
      console.log(`✓ AI analysis complete: ${results.size}/${functions.length} functions analyzed`);
    } catch (error) {
      console.error("✗ AI function analysis error:", error);
      if (error instanceof Error) {
        console.error(`  Message: ${error.message}`);
        console.error(`  Stack: ${error.stack}`);
      }
    }

    return results;
  }

  async analyzeFile(
    fileName: string,
    filePath: string,
    language: string | null,
    fileType: string | null,
    content: string,
    lineCount: number
  ): Promise<FileAnalysis | null> {
    if (!this.isEnabled || !this.client) {
      return null;
    }

    console.log(`  🤖 Analyzing file: ${fileName}`);

    try {
      // Truncate very large files
      const maxLength = 8000;
      const truncatedContent = content.length > maxLength 
        ? content.substring(0, maxLength) + "\n... (truncated)"
        : content;

      const prompt = `Analyze this ${language || 'code'} file and provide:
1. A brief description (1-2 sentences) of what this file does
2. Its purpose in the codebase
3. Key components or exports (list 2-3 most important)

File: ${fileName}
Path: ${filePath}
Type: ${fileType || 'unknown'}
Lines: ${lineCount}

Content:
\`\`\`${language || 'code'}
${truncatedContent}
\`\`\`

Respond in JSON format:
{
  "description": "...",
  "purpose": "...",
  "keyComponents": ["...", "..."]
}`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: "You are an expert code analyst. Analyze files and provide clear, concise descriptions. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      const content_response = response.choices[0]?.message?.content;
      if (content_response) {
        const analysis = this.extractJSON(content_response);
        return {
          description: analysis.description || "",
          purpose: analysis.purpose || "",
          keyComponents: analysis.keyComponents || []
        };
      }
    } catch (error) {
      console.error(`  ✗ AI file analysis error for ${fileName}:`, error);
      if (error instanceof Error) {
        console.error(`    Message: ${error.message}`);
      }
    }

    return null;
  }

  async analyzeCodebaseStructure(
    repoName: string,
    description: string | null,
    language: string | null,
    folderStructure: string[],
    mainFiles: string[]
  ): Promise<CodebaseInsight | null> {
    if (!this.isEnabled || !this.client) {
      return null;
    }

    try {
      const prompt = `Analyze this codebase structure and provide insights:

Repository: ${repoName}
Description: ${description || 'No description'}
Primary Language: ${language || 'Multiple'}

Folder Structure:
${folderStructure.slice(0, 30).join('\n')}

Key Files:
${mainFiles.slice(0, 20).join('\n')}

Provide:
1. Overall purpose of this codebase (2-3 sentences)
2. Architecture pattern/framework used
3. Main components or modules (list 3-5)

Respond in JSON format:
{
  "overallPurpose": "...",
  "architecture": "...",
  "mainComponents": ["...", "..."]
}`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: "You are an expert software architect. Analyze codebases and identify their purpose, architecture, and main components. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 600,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const insight = this.extractJSON(content);
        return {
          overallPurpose: insight.overallPurpose || "",
          architecture: insight.architecture || "",
          mainComponents: insight.mainComponents || []
        };
      }
    } catch (error) {
      console.error("AI codebase analysis error:", error);
    }

    return null;
  }

  private buildFunctionAnalysisPrompt(
    functions: Array<{
      name: string;
      code: string;
      parameters: Array<{ name: string; type?: string }>;
      returnType?: string;
      filePath: string;
    }>
  ): string {
    let prompt = `Analyze these functions and for each provide:
1. A clear description (1 sentence) of what it does
2. Its purpose/role in the application
3. Complexity level (low/medium/high)

`;

    functions.forEach((fn, idx) => {
      const params = fn.parameters.map(p => p.type ? `${p.name}: ${p.type}` : p.name).join(", ");
      prompt += `\n--- Function ${idx + 1} ---
Name: ${fn.name}
File: ${fn.filePath}
Signature: ${fn.name}(${params})${fn.returnType ? `: ${fn.returnType}` : ''}
Code:
\`\`\`
${fn.code.substring(0, 1500)}${fn.code.length > 1500 ? '...' : ''}
\`\`\`
`;
    });

    prompt += `\nRespond with analysis for each function in this format:
FUNCTION: <name>
DESCRIPTION: <one sentence>
PURPOSE: <role in app>
COMPLEXITY: <low/medium/high>
---`;

    return prompt;
  }

  private parseFunctionAnalysisResponse(
    response: string,
    functions: Array<{ name: string }>,
    results: Map<string, FunctionAnalysis>
  ): void {
    const sections = response.split('---').filter(s => s.trim());
    
    for (const section of sections) {
      const lines = section.split('\n').map(l => l.trim()).filter(l => l);
      let name = '';
      let description = '';
      let purpose = '';
      let complexity = 'medium';

      for (const line of lines) {
        if (line.startsWith('FUNCTION:')) {
          name = line.substring(9).trim();
        } else if (line.startsWith('DESCRIPTION:')) {
          description = line.substring(12).trim();
        } else if (line.startsWith('PURPOSE:')) {
          purpose = line.substring(8).trim();
        } else if (line.startsWith('COMPLEXITY:')) {
          complexity = line.substring(11).trim().toLowerCase();
        }
      }

      if (name && description) {
        results.set(name, { name, description, purpose, complexity });
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private extractJSON(content: string): any {
    // Remove markdown code blocks if present
    let cleaned = content.trim();
    
    // Check for ```json or ``` wrapper
    if (cleaned.startsWith('```')) {
      // Remove opening ```json or ```
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '');
      // Remove closing ```
      cleaned = cleaned.replace(/```\s*$/, '');
      cleaned = cleaned.trim();
    }
    
    return JSON.parse(cleaned);
  }
}

export const aiService = new AIService();
