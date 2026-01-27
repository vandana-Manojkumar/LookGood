import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { rateLimitedFetch, processBatch } from "./github-client";
import pLimit from "p-limit";

const analyzeRequestSchema = z.object({
  url: z.string().min(1),
  token: z.string().optional(),
});

function getGitHubHeaders(token?: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "CodeBase-Analyzer",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

interface GitHubRepoInfo {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  default_branch: string;
  html_url: string;
}

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
  files?: { filename: string }[];
}

interface GitHubContent {
  content?: string;
  encoding?: string;
}

function parseGitHubUrl(input: string): { owner: string; repo: string } | null {
  let cleaned = input.trim();
  
  // Handle full URL
  const urlPattern = /^https?:\/\/(www\.)?github\.com\/([\w.-]+)\/([\w.-]+)\/?$/;
  const urlMatch = cleaned.match(urlPattern);
  if (urlMatch) {
    return { owner: urlMatch[2], repo: urlMatch[3] };
  }

  // Handle owner/repo format
  const shortPattern = /^([\w.-]+)\/([\w.-]+)$/;
  const shortMatch = cleaned.match(shortPattern);
  if (shortMatch) {
    return { owner: shortMatch[1], repo: shortMatch[2] };
  }

  return null;
}

function getLanguageFromExtension(extension: string | null): string | null {
  if (!extension) return null;
  const langMap: Record<string, string> = {
    ts: "TypeScript",
    tsx: "TypeScript",
    js: "JavaScript",
    jsx: "JavaScript",
    py: "Python",
    java: "Java",
    go: "Go",
    rs: "Rust",
    rb: "Ruby",
    php: "PHP",
    c: "C",
    cpp: "C++",
    h: "C",
    hpp: "C++",
    cs: "C#",
    swift: "Swift",
    kt: "Kotlin",
    scala: "Scala",
    vue: "Vue",
    svelte: "Svelte",
    css: "CSS",
    scss: "SCSS",
    html: "HTML",
    json: "JSON",
    yaml: "YAML",
    yml: "YAML",
    md: "Markdown",
    sql: "SQL",
    sh: "Shell",
    bash: "Shell",
  };
  return langMap[extension.toLowerCase()] || null;
}

function getFileType(path: string, extension: string | null): string | null {
  const name = path.split("/").pop()?.toLowerCase() || "";
  
  if (name.includes("test") || name.includes("spec")) return "test";
  if (name.includes("config") || name === "package.json" || name === "tsconfig.json") return "config";
  if (path.includes("/controllers/") || path.includes("/routes/")) return "controller";
  if (path.includes("/services/")) return "service";
  if (path.includes("/models/") || path.includes("/schema")) return "model";
  if (path.includes("/utils/") || path.includes("/helpers/") || path.includes("/lib/")) return "utility";
  if (path.includes("/components/")) return "component";
  if (path.includes("/hooks/")) return "hook";
  if (path.includes("/pages/") || path.includes("/views/")) return "view";
  if (extension === "md") return "documentation";
  if (extension === "css" || extension === "scss") return "style";
  
  return null;
}

function extractFunctionsFromCode(
  content: string,
  language: string | null
): Array<{
  name: string;
  startLine: number;
  endLine: number;
  parameters: Array<{ name: string; type?: string }>;
  returnType?: string;
  isAsync: boolean;
  isExported: boolean;
  description?: string;
}> {
  const functions: Array<{
    name: string;
    startLine: number;
    endLine: number;
    parameters: Array<{ name: string; type?: string }>;
    returnType?: string;
    isAsync: boolean;
    isExported: boolean;
    description?: string;
  }> = [];

  const lines = content.split("\n");
  
  // Simple regex patterns for common function declarations
  const patterns = [
    // TypeScript/JavaScript: function name(...) or async function name(...)
    /^(\s*)(export\s+)?(async\s+)?function\s+(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?\s*\{?/,
    // TypeScript/JavaScript: const name = (...) => or const name = async (...) =>
    /^(\s*)(export\s+)?(const|let|var)\s+(\w+)\s*=\s*(async\s+)?\(?([^)=]*)\)?\s*=>/,
    // TypeScript/JavaScript: name(...) { in class
    /^(\s*)(public|private|protected|static|async|\s)*\s*(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?\s*\{/,
    // Python: def name(...):
    /^(\s*)(async\s+)?def\s+(\w+)\s*\(([^)]*)\)(?:\s*->\s*([^:]+))?\s*:/,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        let name = "";
        let params: Array<{ name: string; type?: string }> = [];
        let returnType: string | undefined;
        let isAsync = false;
        let isExported = false;

        // Extract based on pattern type
        if (pattern.source.includes("function")) {
          isExported = !!match[2];
          isAsync = !!match[3];
          name = match[4];
          const paramStr = match[5] || "";
          params = parseParams(paramStr);
          returnType = match[6]?.trim();
        } else if (pattern.source.includes("const|let|var")) {
          isExported = !!match[2];
          name = match[4];
          isAsync = !!match[5];
          const paramStr = match[6] || "";
          params = parseParams(paramStr);
        } else if (pattern.source.includes("def")) {
          isAsync = !!match[2];
          name = match[3];
          const paramStr = match[4] || "";
          params = parseParams(paramStr);
          returnType = match[5]?.trim();
        } else {
          // Class method
          isAsync = line.includes("async");
          name = match[3];
          const paramStr = match[4] || "";
          params = parseParams(paramStr);
          returnType = match[5]?.trim();
        }

        // Skip constructors and built-in methods
        if (name && !["constructor", "if", "for", "while", "switch", "catch"].includes(name)) {
          // Estimate end line (simple heuristic)
          let endLine = i + 1;
          let braceCount = 0;
          let started = false;
          for (let j = i; j < Math.min(i + 100, lines.length); j++) {
            const l = lines[j];
            for (const char of l) {
              if (char === "{") {
                braceCount++;
                started = true;
              } else if (char === "}") {
                braceCount--;
              }
            }
            if (started && braceCount === 0) {
              endLine = j + 1;
              break;
            }
          }

          functions.push({
            name,
            startLine: i + 1,
            endLine,
            parameters: params,
            returnType,
            isAsync,
            isExported,
          });
        }
        break;
      }
    }
  }

  return functions;
}

function parseParams(paramStr: string): Array<{ name: string; type?: string }> {
  if (!paramStr.trim()) return [];
  
  return paramStr.split(",").map((p) => {
    const cleaned = p.trim();
    // Handle TypeScript type annotations
    const colonIndex = cleaned.indexOf(":");
    if (colonIndex > 0) {
      return {
        name: cleaned.substring(0, colonIndex).trim().replace(/^\?/, ""),
        type: cleaned.substring(colonIndex + 1).trim(),
      };
    }
    // Handle Python type hints
    const arrowIndex = cleaned.indexOf("->");
    if (arrowIndex > 0) {
      return {
        name: cleaned.substring(0, arrowIndex).trim(),
        type: cleaned.substring(arrowIndex + 2).trim(),
      };
    }
    return { name: cleaned.split("=")[0].trim() };
  }).filter((p) => p.name && !p.name.startsWith("..."));
}

function extractImports(content: string): Array<{
  source: string;
  items: string[];
  type: "default" | "named" | "namespace";
}> {
  const imports: Array<{
    source: string;
    items: string[];
    type: "default" | "named" | "namespace";
  }> = [];

  const lines = content.split("\n");
  
  for (const line of lines) {
    // ES6 imports
    const importMatch = line.match(/import\s+(?:(\w+)|(?:\*\s+as\s+(\w+))|(?:\{([^}]+)\}))?(?:\s*,\s*(?:(\w+)|(?:\{([^}]+)\})))?\s+from\s+["']([^"']+)["']/);
    if (importMatch) {
      const source = importMatch[6];
      const items: string[] = [];
      let type: "default" | "named" | "namespace" = "named";

      if (importMatch[1]) {
        items.push(importMatch[1]);
        type = "default";
      }
      if (importMatch[2]) {
        items.push(importMatch[2]);
        type = "namespace";
      }
      if (importMatch[3]) {
        items.push(...importMatch[3].split(",").map((s) => s.trim().split(" as ")[0].trim()));
      }
      if (importMatch[4]) {
        items.push(importMatch[4]);
      }
      if (importMatch[5]) {
        items.push(...importMatch[5].split(",").map((s) => s.trim().split(" as ")[0].trim()));
      }

      imports.push({ source, items, type });
    }

    // Python imports
    const pyImportMatch = line.match(/from\s+([\w.]+)\s+import\s+(.+)/);
    if (pyImportMatch) {
      imports.push({
        source: pyImportMatch[1],
        items: pyImportMatch[2].split(",").map((s) => s.trim().split(" as ")[0].trim()),
        type: "named",
      });
    }

    const pySimpleImport = line.match(/^import\s+([\w.]+)(?:\s+as\s+\w+)?$/);
    if (pySimpleImport) {
      imports.push({
        source: pySimpleImport[1],
        items: [pySimpleImport[1].split(".").pop() || pySimpleImport[1]],
        type: "default",
      });
    }
  }

  return imports;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Analyze a repository
  app.post("/api/repositories/analyze", async (req, res) => {
    try {
      const { url, token } = analyzeRequestSchema.parse(req.body);
      
      const parsed = parseGitHubUrl(url);
      if (!parsed) {
        return res.status(400).json({ error: "Invalid GitHub repository URL" });
      }

      const { owner, repo } = parsed;
      const headers = getGitHubHeaders(token);

      console.log(`\n🚀 Starting import of ${owner}/${repo}...`);
      const startTime = Date.now();

      // Fetch repository info from GitHub API
      console.log(`📡 Step 1/5: Fetching repository metadata...`);
      const repoResponse = await rateLimitedFetch(
        `https://api.github.com/repos/${owner}/${repo}`,
        { headers }
      );

      if (!repoResponse.ok) {
        const errorText = await repoResponse.text();
        console.error(`GitHub API error: ${repoResponse.status} - ${errorText}`);
        if (repoResponse.status === 404) {
          return res.status(404).json({ error: "Repository not found. If it's private, please provide a GitHub token." });
        }
        if (repoResponse.status === 401 || repoResponse.status === 403) {
          return res.status(403).json({ error: "Access denied. Check your GitHub token permissions." });
        }
        return res.status(repoResponse.status).json({ error: "Failed to fetch repository" });
      }

      const repoInfo: GitHubRepoInfo = await repoResponse.json();
      console.log(`✓ Repository: ${repoInfo.full_name} (${repoInfo.language || 'Unknown language'})`);

      // Create repository record
      const repository = await storage.createRepository({
        name: repoInfo.name,
        fullName: repoInfo.full_name,
        url: repoInfo.html_url,
        description: repoInfo.description,
        language: repoInfo.language,
        stars: repoInfo.stargazers_count,
        forks: repoInfo.forks_count,
        defaultBranch: repoInfo.default_branch,
      });

      // Fetch repository tree
      console.log(`📂 Step 2/5: Scanning repository file tree...`);
      const treeResponse = await rateLimitedFetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${repoInfo.default_branch}?recursive=1`,
        { headers }
      );

      if (treeResponse.ok) {
        const treeData = await treeResponse.json();
        const items: GitHubTreeItem[] = treeData.tree || [];
        console.log(`✓ Found ${items.length} items in repository tree`);

        // Process folders
        console.log(`📁 Step 3/5: Processing folder structure...`);
        const folderPaths = new Set<string>();
        items.forEach((item) => {
          if (item.type === "tree") {
            folderPaths.add(item.path);
          } else {
            // Add parent folders for files
            const parts = item.path.split("/");
            for (let i = 1; i < parts.length; i++) {
              folderPaths.add(parts.slice(0, i).join("/"));
            }
          }
        });

        for (const folderPath of Array.from(folderPaths)) {
          const name = folderPath.split("/").pop() || folderPath;
          const parentPath = folderPath.split("/").slice(0, -1).join("/") || null;
          
          await storage.createFolder({
            repositoryId: repository.id,
            path: folderPath,
            name,
            parentPath,
            purpose: null,
            fileCount: 0,
          });
        }
        console.log(`✓ Created ${folderPaths.size} folders`);

        // Process ALL files (no limit)
        console.log(`📄 Step 4/5: Processing files (parallel fetch with concurrency=15)...`);
        const fileItems = items.filter((item) => item.type === "blob");
        const fileMap = new Map<string, string>();
        
        // Code extensions that we want to extract content from
        const codeExtensions = ["ts", "tsx", "js", "jsx", "py", "java", "go", "rs", "rb", "c", "cpp", "h", "hpp", "cs", "swift", "kt", "scala", "vue", "svelte", "php"];
        const textExtensions = ["md", "txt", "json", "yaml", "yml", "xml", "html", "css", "scss", "less", "sql", "sh", "bash", "dockerfile", "makefile", "gitignore", "env"];
        const allContentExtensions = [...codeExtensions, ...textExtensions];

        console.log(`Processing ${fileItems.length} files in parallel...`);

        // OPTIMIZED: Parallel file processing with concurrency limit
        const limit = pLimit(15); // Process 15 files concurrently
        let processedCount = 0;

        const fileProcessingPromises = fileItems.map(item =>
          limit(async () => {
            const name = item.path.split("/").pop() || item.path;
            const extension = name.includes(".") ? name.split(".").pop() || null : null;
            const language = getLanguageFromExtension(extension);
            const fileType = getFileType(item.path, extension);
            const folderPath = item.path.split("/").slice(0, -1).join("/") || null;

            // Determine if we should fetch content
            const shouldFetchContent = allContentExtensions.includes(extension?.toLowerCase() || "") && (item.size || 0) < 100000;
            let fileContent: string | null = null;
            let lineCount = 0;

            if (shouldFetchContent && item.sha) {
              try {
                // OPTIMIZED: Use Git Blobs API instead of Contents API (faster)
                const blobResponse = await rateLimitedFetch(
                  `https://api.github.com/repos/${owner}/${repo}/git/blobs/${item.sha}`,
                  { headers }
                );

                if (blobResponse.ok) {
                  const blobData = await blobResponse.json();
                  if (blobData.content && blobData.encoding === "base64") {
                    fileContent = Buffer.from(blobData.content, "base64").toString("utf-8");
                    lineCount = fileContent.split("\n").length;
                  }
                }
              } catch (err) {
                console.error(`Failed to fetch content for ${item.path}:`, err);
              }
            }

            const file = await storage.createFile({
              repositoryId: repository.id,
              path: item.path,
              name,
              folderPath,
              extension,
              language,
              size: item.size || 0,
              lineCount,
              purpose: null,
              fileType,
              content: fileContent,
            });

            processedCount++;
            if (processedCount % 10 === 0) {
              console.log(`  Processed ${processedCount}/${fileItems.length} files...`);
            }

            // Extract functions and imports from code files
            let extractedFunctions: any[] = [];
            let extractedImports: any[] = [];

            if (fileContent && codeExtensions.includes(extension?.toLowerCase() || "")) {
              extractedFunctions = extractFunctionsFromCode(fileContent, language);
              extractedImports = extractImports(fileContent);
            }

            return {
              file,
              path: item.path,
              functions: extractedFunctions,
              imports: extractedImports,
            };
          })
        );

        const fileResults = await Promise.all(fileProcessingPromises);

        // Map file paths to IDs
        fileResults.forEach(result => {
          fileMap.set(result.path, result.file.id);
        });

        // OPTIMIZED: Bulk insert functions
        const allFunctionsToInsert = fileResults.flatMap(result =>
          result.functions.map((fn: any) => ({
            repositoryId: repository.id,
            fileId: result.file.id,
            filePath: result.path,
            name: fn.name,
            startLine: fn.startLine,
            endLine: fn.endLine,
            parameters: fn.parameters,
            returnType: fn.returnType || null,
            description: fn.description || null,
            docstring: null,
            dependencies: null,
            exceptions: null,
            isAsync: fn.isAsync ? 1 : 0,
            isExported: fn.isExported ? 1 : 0,
          }))
        );

        if (allFunctionsToInsert.length > 0) {
          console.log(`Bulk inserting ${allFunctionsToInsert.length} functions...`);
          await storage.bulkCreateFunctions(allFunctionsToInsert);
        }

        // OPTIMIZED: Bulk insert dependencies
        const allDependenciesToInsert = fileResults.flatMap(result =>
          result.imports.map((imp: any) => ({
            repositoryId: repository.id,
            sourceModule: result.path,
            targetModule: imp.source,
            importType: imp.type,
            importedItems: imp.items,
          }))
        );

        if (allDependenciesToInsert.length > 0) {
          console.log(`Bulk inserting ${allDependenciesToInsert.length} dependencies...`);
          await storage.bulkCreateModuleDependencies(allDependenciesToInsert);
        }

        console.log(`✓ Processed ${fileItems.length} files, extracted ${allFunctionsToInsert.length} functions and ${allDependenciesToInsert.length} dependencies.`);
      }

      // Fetch commits and identify latest + tagged releases
      // OPTIMIZED: Limit to 500 commits to avoid long processing times
      console.log(`📊 Step 5/5: Fetching commit history (max 500)...`);
      const MAX_COMMITS = 500;
      let page = 1;
      let hasMoreCommits = true;
      let totalCommits = 0;
      let latestCommitId: string | null = null;

      while (hasMoreCommits && totalCommits < MAX_COMMITS) {
        const commitsResponse = await rateLimitedFetch(
          `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100&page=${page}`,
          { headers }
        );

        if (commitsResponse.ok) {
          const commitsData: GitHubCommit[] = await commitsResponse.json();

          if (commitsData.length === 0) {
            hasMoreCommits = false;
          } else {
            for (let i = 0; i < commitsData.length && totalCommits < MAX_COMMITS; i++) {
              const commit = commitsData[i];
              const isFirst = totalCommits === 0;

              const createdCommit = await storage.createCommit({
                repositoryId: repository.id,
                sha: commit.sha,
                message: commit.commit.message,
                author: commit.commit.author.name,
                authorEmail: commit.commit.author.email,
                date: new Date(commit.commit.author.date),
                additions: commit.stats?.additions || 0,
                deletions: commit.stats?.deletions || 0,
                filesChanged: commit.files?.length || 0,
                isLatest: isFirst ? 1 : 0,
                isIndexed: isFirst ? 1 : 0,
              });

              if (isFirst) {
                latestCommitId = createdCommit.id;
              }
              totalCommits++;
            }

            // Stop if we've reached the max commits limit
            if (totalCommits >= MAX_COMMITS) {
              hasMoreCommits = false;
              console.log(`Reached maximum commit limit (${MAX_COMMITS})`);
            } else if (commitsData.length < 100) {
              hasMoreCommits = false;
            } else {
              page++;
            }
          }
        } else {
          hasMoreCommits = false;
        }
      }
      
      console.log(`Fetched ${totalCommits} commits.`);

      // Create file_versions and function_versions for the latest commit
      if (latestCommitId) {
        console.log("Creating versioned snapshots for latest commit...");
        const allFiles = await storage.getFilesByRepository(repository.id);
        
        for (const file of allFiles) {
          if (file.content) {
            const fileVersion = await storage.createFileVersion({
              repositoryId: repository.id,
              commitId: latestCommitId,
              filePath: file.path,
              language: file.language,
              codeSnapshot: file.content,
              lineCount: file.lineCount,
            });

            // Create function versions for this file version
            const fileFunctions = await storage.getFunctionsByFile(file.id);
            for (const fn of fileFunctions) {
              const lines = file.content.split("\n");
              const startIdx = (fn.startLine || 1) - 1;
              const endIdx = fn.endLine || lines.length;
              const codeSnapshot = lines.slice(startIdx, endIdx).join("\n");

              await storage.createFunctionVersion({
                repositoryId: repository.id,
                fileVersionId: fileVersion.id,
                functionName: fn.name,
                startLine: fn.startLine,
                endLine: fn.endLine,
                codeSnapshot,
                parameters: fn.parameters,
                returnType: fn.returnType,
                isAsync: fn.isAsync,
                isExported: fn.isExported,
              });
            }
          }
        }
        console.log("✓ Versioned snapshots created.");
      }

      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`\n🎉 Repository import completed successfully in ${elapsedTime}s!`);
      console.log(`📊 Summary: ${repository.fullName}`);
      console.log(`   - Total commits: ${totalCommits}`);
      const allFiles = await storage.getFilesByRepository(repository.id);
      const allFunctions = await storage.getFunctionsByRepository(repository.id);
      console.log(`   - Total files: ${allFiles.length}`);
      console.log(`   - Total functions: ${allFunctions.length}`);
      console.log(`   - Repository ID: ${repository.id}\n`);

      res.json({ id: repository.id });
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: "Failed to analyze repository" });
    }
  });

  // Get repository analysis
  app.get("/api/repositories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getRepositoryAnalysis(id);
      
      if (!analysis) {
        return res.status(404).json({ error: "Repository not found" });
      }

      res.json(analysis);
    } catch (error) {
      console.error("Fetch error:", error);
      res.status(500).json({ error: "Failed to fetch repository analysis" });
    }
  });

  // VERSION-AWARE SEARCH APIs

  // Search functions by keyword with optional version filter
  app.get("/api/search/functions", async (req, res) => {
    try {
      const { keyword, version, repositoryId } = req.query;
      
      if (!keyword || typeof keyword !== "string") {
        return res.status(400).json({ error: "keyword query parameter is required" });
      }
      if (!repositoryId || typeof repositoryId !== "string") {
        return res.status(400).json({ error: "repositoryId query parameter is required" });
      }

      const versionStr = typeof version === "string" ? version : undefined;
      const functions = await storage.searchFunctionsByKeyword(repositoryId, keyword, versionStr);

      res.json({
        keyword,
        version: versionStr || "latest",
        count: functions.length,
        functions: functions.map((fn) => ({
          id: fn.id,
          name: fn.functionName,
          startLine: fn.startLine,
          endLine: fn.endLine,
          parameters: fn.parameters,
          returnType: fn.returnType,
          isAsync: fn.isAsync === 1,
          isExported: fn.isExported === 1,
          codePreview: fn.codeSnapshot?.substring(0, 200) + (fn.codeSnapshot && fn.codeSnapshot.length > 200 ? "..." : ""),
        })),
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Failed to search functions" });
    }
  });

  // Get file content by path and version
  app.get("/api/file", async (req, res) => {
    try {
      const { path, version, repositoryId } = req.query;
      
      if (!path || typeof path !== "string") {
        return res.status(400).json({ error: "path query parameter is required" });
      }
      if (!repositoryId || typeof repositoryId !== "string") {
        return res.status(400).json({ error: "repositoryId query parameter is required" });
      }

      const versionStr = typeof version === "string" ? version : undefined;
      const fileVersion = await storage.getFileVersionByPath(repositoryId, path, versionStr);

      if (!fileVersion) {
        return res.status(404).json({ error: "File not found for the specified version" });
      }

      res.json({
        filePath: fileVersion.filePath,
        version: versionStr || "latest",
        language: fileVersion.language,
        lineCount: fileVersion.lineCount,
        content: fileVersion.codeSnapshot,
        createdAt: fileVersion.createdAt,
      });
    } catch (error) {
      console.error("File fetch error:", error);
      res.status(500).json({ error: "Failed to fetch file" });
    }
  });

  // Get diff between two versions of a file
  app.get("/api/diff", async (req, res) => {
    try {
      const { file, from, to, repositoryId } = req.query;
      
      if (!file || typeof file !== "string") {
        return res.status(400).json({ error: "file query parameter is required" });
      }
      if (!repositoryId || typeof repositoryId !== "string") {
        return res.status(400).json({ error: "repositoryId query parameter is required" });
      }
      if (!from || typeof from !== "string") {
        return res.status(400).json({ error: "from version query parameter is required" });
      }
      if (!to || typeof to !== "string") {
        return res.status(400).json({ error: "to version query parameter is required" });
      }

      const fromVersion = await storage.getFileVersionByPath(repositoryId, file, from);
      const toVersion = await storage.getFileVersionByPath(repositoryId, file, to);

      if (!fromVersion) {
        return res.status(404).json({ error: `File not found for version: ${from}` });
      }
      if (!toVersion) {
        return res.status(404).json({ error: `File not found for version: ${to}` });
      }

      const fromLines = (fromVersion.codeSnapshot || "").split("\n");
      const toLines = (toVersion.codeSnapshot || "").split("\n");
      
      const changes: { type: "added" | "removed" | "unchanged"; line: string; lineNumber: number }[] = [];
      const maxLines = Math.max(fromLines.length, toLines.length);
      
      for (let i = 0; i < maxLines; i++) {
        const fromLine = fromLines[i] ?? "";
        const toLine = toLines[i] ?? "";
        
        if (fromLine === toLine) {
          changes.push({ type: "unchanged", line: toLine, lineNumber: i + 1 });
        } else if (!fromLines[i]) {
          changes.push({ type: "added", line: toLine, lineNumber: i + 1 });
        } else if (!toLines[i]) {
          changes.push({ type: "removed", line: fromLine, lineNumber: i + 1 });
        } else {
          changes.push({ type: "removed", line: fromLine, lineNumber: i + 1 });
          changes.push({ type: "added", line: toLine, lineNumber: i + 1 });
        }
      }

      const addedCount = changes.filter((c) => c.type === "added").length;
      const removedCount = changes.filter((c) => c.type === "removed").length;

      res.json({
        file,
        from,
        to,
        summary: {
          linesAdded: addedCount,
          linesRemoved: removedCount,
          fromLineCount: fromLines.length,
          toLineCount: toLines.length,
        },
        changes: changes.filter((c) => c.type !== "unchanged"),
      });
    } catch (error) {
      console.error("Diff error:", error);
      res.status(500).json({ error: "Failed to generate diff" });
    }
  });

  // Get indexed versions for a repository
  app.get("/api/repositories/:id/versions", async (req, res) => {
    try {
      const { id } = req.params;
      const indexedCommits = await storage.getIndexedCommits(id);

      res.json({
        repositoryId: id,
        versions: indexedCommits.map((c) => ({
          commitId: c.id,
          sha: c.sha,
          tag: c.tag,
          date: c.date,
          message: c.message,
          isLatest: c.isLatest === 1,
        })),
      });
    } catch (error) {
      console.error("Versions fetch error:", error);
      res.status(500).json({ error: "Failed to fetch versions" });
    }
  });

  // LLM ANALYSIS APIs

  // Trigger AI analysis for all functions in a repository (SSE streaming)
 // Trigger AI analysis for all functions in a repository (SAFE BATCH MODE)
app.post("/api/repositories/:id/analyze-functions", async (req, res) => {
  const { batchAnalyzeFunctions, generateProjectContext } = await import("./llm-analysis");

  try {
    const { id } = req.params;
    const repository = await storage.getRepository(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    const allFunctions = await storage.getFunctionsByRepository(id);
    const allFiles = await storage.getFilesByRepository(id);
    const folders = await storage.getFoldersByRepository(id);

    // 🔑 Only analyze functions that are NOT already analyzed
    const pendingFunctions = allFunctions.filter(
      fn => !fn.aiPurpose || fn.aiPurpose.length === 0
    );

    if (pendingFunctions.length === 0) {
      return res.status(200).json({ message: "All functions already analyzed" });
    }

    const fileMap = new Map(allFiles.map(f => [f.id, f]));
    const languages = [...new Set(allFiles.map(f => f.language).filter(Boolean))];
    const topFolders = folders.slice(0, 10).map(f => f.path);

    const projectContext = await generateProjectContext(
      repository.name,
      repository.description || "",
      topFolders,
      languages as string[]
    );

    // Build function → code map
    const functionsWithCode = pendingFunctions
      .map(fn => {
        const file = fileMap.get(fn.fileId);
        let code = "";
        if (file?.content && fn.startLine && fn.endLine) {
          const lines = file.content.split("\n");
          code = lines.slice(fn.startLine - 1, fn.endLine).join("\n");
        }
        return { fn, code };
      })
      .filter(item => item.code.length > 0);

    // ===== SSE SETUP =====
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(
      `data: ${JSON.stringify({ type: "started", total: functionsWithCode.length })}\n\n`
    );

    // ===== BATCH SETTINGS =====
    const BATCH_SIZE = 200;      // 🔥 SAFE batch size
    const CONCURRENCY = 60;      // 🔥 SAFE concurrency
    let completed = 0;
    let errors = 0;

    // ===== PROCESS IN BATCHES =====
    for (let i = 0; i < functionsWithCode.length; i += BATCH_SIZE) {
      const batch = functionsWithCode.slice(i, i + BATCH_SIZE);

      const results = await batchAnalyzeFunctions(
        batch,
        projectContext,
        {
          concurrency: CONCURRENCY,
          maxRetries: 5,
          onProgress: async (done, total, fnName) => {
            res.write(
              `data: ${JSON.stringify({
                type: "progress",
                completed: completed + done,
                total: functionsWithCode.length,
                function: fnName
              })}\n\n`
            );
          }
        }
      );

      // Save results
      for (let j = 0; j < results.length; j++) {
        const analysis = results[j];
        const fn = batch[j].fn;

        try {
          await storage.updateFunctionAIAnalysis(fn.id, {
            aiPurpose: analysis.purpose,
            aiHowItHelps: analysis.howItHelps,
            aiInputOutput: analysis.inputOutput,
            aiComplexity: analysis.complexity
          });
          completed++;
        } catch {
          errors++;
        }
      }

      // 🔑 Cool-down between batches (VERY IMPORTANT)
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    res.write(
      `data: ${JSON.stringify({
        type: "complete",
        analyzed: completed,
        errors,
        message: "Full repository AI analysis completed safely"
      })}\n\n`
    );

    res.end();

  } catch (error) {
    console.error("AI analysis error:", error);
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ type: "error", error: "Analysis failed" })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: "Failed to analyze functions" });
    }
  }
});

  // Get AI analysis status for a repository
  app.get("/api/repositories/:id/ai-analysis", async (req, res) => {
    try {
      const { id } = req.params;
      const functions = await storage.getFunctionsByRepository(id);
      
      const analyzed = functions.filter(fn => fn.aiPurpose);
      const pending = functions.filter(fn => !fn.aiPurpose);

      res.json({
        repositoryId: id,
        totalFunctions: functions.length,
        analyzedCount: analyzed.length,
        pendingCount: pending.length,
        percentComplete: functions.length > 0 
          ? Math.round((analyzed.length / functions.length) * 100) 
          : 0,
        functions: analyzed.map(fn => ({
          id: fn.id,
          name: fn.name,
          filePath: fn.filePath,
          startLine: fn.startLine,
          endLine: fn.endLine,
          isAsync: fn.isAsync === 1,
          isExported: fn.isExported === 1,
          parameters: fn.parameters,
          returnType: fn.returnType,
          aiPurpose: fn.aiPurpose,
          aiHowItHelps: fn.aiHowItHelps,
          aiInputOutput: fn.aiInputOutput,
          aiComplexity: fn.aiComplexity,
          aiAnalyzedAt: fn.aiAnalyzedAt,
        })),
      });
    } catch (error) {
      console.error("AI analysis status error:", error);
      res.status(500).json({ error: "Failed to get AI analysis status" });
    }
  });

  // Download AI analysis as JSON
  app.get("/api/repositories/:id/ai-analysis/download", async (req, res) => {
    try {
      const { id } = req.params;
      const repo = await storage.getRepository(id);
      if (!repo) {
        return res.status(404).json({ error: "Repository not found" });
      }

      const functions = await storage.getFunctionsByRepository(id);
      const analyzed = functions.filter(fn => fn.aiPurpose);

      const exportData = {
        repository: {
          name: repo.fullName,
          url: repo.url,
          description: repo.description,
          analyzedAt: new Date().toISOString(),
        },
        summary: {
          totalFunctions: functions.length,
          analyzedFunctions: analyzed.length,
          complexityBreakdown: {
            simple: analyzed.filter(fn => fn.aiComplexity === "simple").length,
            moderate: analyzed.filter(fn => fn.aiComplexity === "moderate").length,
            complex: analyzed.filter(fn => fn.aiComplexity === "complex").length,
          },
        },
        functions: analyzed.map(fn => ({
          name: fn.name,
          filePath: fn.filePath,
          startLine: fn.startLine,
          endLine: fn.endLine,
          isAsync: fn.isAsync === 1,
          isExported: fn.isExported === 1,
          parameters: fn.parameters,
          returnType: fn.returnType,
          aiAnalysis: {
            purpose: fn.aiPurpose,
            howItHelps: fn.aiHowItHelps,
            inputOutput: fn.aiInputOutput,
            complexity: fn.aiComplexity,
            analyzedAt: fn.aiAnalyzedAt,
          },
        })),
      };

      const filename = `${repo.fullName.replace(/\//g, "_")}_ai_analysis.json`;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(JSON.stringify(exportData, null, 2));
    } catch (error) {
      console.error("AI analysis download error:", error);
      res.status(500).json({ error: "Failed to download AI analysis" });
    }
  });

  return httpServer;
}
