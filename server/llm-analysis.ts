import OpenAI from "openai";
import pLimit from "p-limit";
import pRetry from "p-retry";
import type { Function, FunctionVersion } from "@shared/schema";

/* =========================================================
   UKG LiteLLM (Claude / Gemini) Setup
   ========================================================= */

const apiKey = process.env.ANTHROPIC_AUTH_TOKEN;
const baseURL = process.env.ANTHROPIC_BASE_URL;
const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";

if (!apiKey || !baseURL) {
  throw new Error(
    "LiteLLM not configured. Set ANTHROPIC_AUTH_TOKEN and ANTHROPIC_BASE_URL"
  );
}

/**
 * LiteLLM is OpenAI-compatible.
 * We still use the OpenAI SDK but point it to UKG LiteLLM.
 */
const llm = new OpenAI({
  apiKey,
  baseURL,
});

/* =========================================================
   Types
   ========================================================= */

export interface FunctionAnalysis {
  functionName: string;
  filePath: string;
  purpose: string;
  howItHelps: string;
  inputOutput: string;
  dependencies: string[];
  complexity: "simple" | "moderate" | "complex";
}

export interface BatchAnalysisOptions {
  concurrency?: number;
  maxRetries?: number;
  onProgress?: (completed: number, total: number, fn: string) => void;
}

/* =========================================================
   Helpers
   ========================================================= */

function isRetryableError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes("429") ||
    msg.toLowerCase().includes("rate") ||
    msg.toLowerCase().includes("timeout") ||
    msg.toLowerCase().includes("fetch")
  );
}

/* =========================================================
   Single Function Analysis
   ========================================================= */

export async function analyzeFunctionWithLLM(
  fn: Function | FunctionVersion,
  codeSnippet: string,
  projectContext: string
): Promise<FunctionAnalysis> {
  const functionName = "name" in fn ? fn.name : fn.functionName;
  const filePath = "filePath" in fn ? fn.filePath : "";

  const prompt = `
You are a senior UKG software engineer writing documentation.

PROJECT CONTEXT:
${projectContext}

FUNCTION NAME: ${functionName}
FILE PATH: ${filePath}
PARAMETERS: ${JSON.stringify(fn.parameters || [])}
RETURN TYPE: ${fn.returnType || "unknown"}
ASYNC: ${"isAsync" in fn ? fn.isAsync : false}
EXPORTED: ${"isExported" in fn ? fn.isExported : false}

CODE:
${codeSnippet.slice(0, 2000)}

Return ONLY valid JSON (no markdown, no explanation):
{
  "purpose": "One sentence describing what this function does",
  "howItHelps": "How this function helps the overall project",
  "inputOutput": "Summary of inputs and outputs",
  "dependencies": ["key", "dependencies"],
  "complexity": "simple | moderate | complex"
}
`;

  const response = await llm.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2000,
    temperature: 0.2,
  });

const content = response.choices?.[0]?.message?.content;

if (!content) {
  throw new Error("LLM returned empty response");
}

// Claude/LiteLLM often wraps JSON in ```json fences — remove them
const cleaned = content
  .replace(/^```json\s*/i, "")
  .replace(/^```\s*/i, "")
  .replace(/\s*```$/i, "")
  .trim();

let parsed;
try {
  parsed = JSON.parse(cleaned);
} catch (err) {
  console.error("FAILED TO PARSE LLM RESPONSE");
  console.error("RAW RESPONSE:", content);
  console.error("CLEANED RESPONSE:", cleaned);
  throw err;
}


  return {
    functionName,
    filePath,
    purpose: parsed.purpose ?? "No description provided",
    howItHelps: parsed.howItHelps ?? "No description provided",
    inputOutput: parsed.inputOutput ?? "See function signature",
    dependencies: Array.isArray(parsed.dependencies)
      ? parsed.dependencies
      : [],
    complexity: parsed.complexity ?? "moderate",
  };
}

/* =========================================================
   Batch Analysis
   ========================================================= */

export async function batchAnalyzeFunctions(
  functions: Array<{ fn: Function | FunctionVersion; code: string }>,
  projectContext: string,
  options: BatchAnalysisOptions = {}
): Promise<FunctionAnalysis[]> {
const { concurrency = 1, maxRetries = 5, onProgress } = options;

  const limit = pLimit(concurrency);
  let completed = 0;

  const tasks = functions.map(({ fn, code }) =>
    limit(async () => {
      const name = "name" in fn ? fn.name : fn.functionName;

      try {
        const result = await pRetry(
          () => analyzeFunctionWithLLM(fn, code, projectContext),
          {
            retries: maxRetries,
            minTimeout: 3000,
            maxTimeout: 60000,
            factor: 2,
            onFailedAttempt: (error) => {
              console.warn(
                `Retry ${error.attemptNumber}/${maxRetries} for ${name}`
              );
              if (!isRetryableError(error)) {
                throw error;
              }
            },
          }
        );

        completed++;
        onProgress?.(completed, functions.length, name);
        return result;
      } catch (err) {
        console.error(`FINAL FAILURE FOR ${name}:`, err);
        completed++;
        onProgress?.(completed, functions.length, name);
        return {
          functionName: name,
          filePath: "",
          purpose: "Analysis failed",
          howItHelps: "Unable to analyze",
          inputOutput: "See function signature",
          dependencies: [],
          complexity: "moderate",
        };
      }
    })
  );

  return Promise.all(tasks);
}

/* =========================================================
   Project Context Generator
   ========================================================= */

export async function generateProjectContext(
  repoName: string,
  repoDescription: string,
  topFolders: string[],
  languages: string[]
): Promise<string> {
  return `
Repository: ${repoName}
Description: ${repoDescription || "No description provided"}
Languages: ${languages.join(", ")}
Key folders: ${topFolders.slice(0, 10).join(", ")}
`;
}
