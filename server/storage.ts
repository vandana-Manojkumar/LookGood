import { randomUUID } from "crypto";
import type {
  User,
  InsertUser,
  Repository,
  InsertRepository,
  Folder,
  InsertFolder,
  File,
  InsertFile,
  Function,
  InsertFunction,
  Commit,
  InsertCommit,
  ModuleDependency,
  InsertModuleDependency,
  RepositoryAnalysis,
  RepositoryStats,
  FileVersion,
  InsertFileVersion,
  FunctionVersion,
  InsertFunctionVersion,
  FunctionParameter,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Repository methods
  getRepository(id: string): Promise<Repository | undefined>;
  createRepository(repo: InsertRepository): Promise<Repository>;
  getRepositoryAnalysis(id: string): Promise<RepositoryAnalysis | null>;

  // Folder methods
  createFolder(folder: InsertFolder): Promise<Folder>;
  getFoldersByRepository(repositoryId: string): Promise<Folder[]>;

  // File methods
  createFile(file: InsertFile): Promise<File>;
  getFilesByRepository(repositoryId: string): Promise<File[]>;

  // Function methods
  createFunction(fn: InsertFunction): Promise<Function>;
  bulkCreateFunctions(fns: InsertFunction[]): Promise<Function[]>;
  getFunctionsByRepository(repositoryId: string): Promise<Function[]>;
  getFunctionsByFile(fileId: string): Promise<Function[]>;
  updateFunctionAIAnalysis(
    functionId: string,
    analysis: { aiPurpose: string; aiHowItHelps: string; aiInputOutput: string; aiComplexity: string }
  ): Promise<Function | undefined>;

  // Commit methods
  createCommit(commit: InsertCommit): Promise<Commit>;
  getCommitsByRepository(repositoryId: string): Promise<Commit[]>;

  // Module Dependency methods
  createModuleDependency(dep: InsertModuleDependency): Promise<ModuleDependency>;
  bulkCreateModuleDependencies(deps: InsertModuleDependency[]): Promise<ModuleDependency[]>;
  getDependenciesByRepository(repositoryId: string): Promise<ModuleDependency[]>;

  // Version-aware methods
  createFileVersion(fileVersion: InsertFileVersion): Promise<FileVersion>;
  getFileVersionsByCommit(commitId: string): Promise<FileVersion[]>;
  getFileVersionByPath(repositoryId: string, filePath: string, version?: string): Promise<FileVersion | undefined>;
  
  createFunctionVersion(fnVersion: InsertFunctionVersion): Promise<FunctionVersion>;
  getFunctionVersionsByFileVersion(fileVersionId: string): Promise<FunctionVersion[]>;
  searchFunctionsByKeyword(repositoryId: string, keyword: string, version?: string): Promise<FunctionVersion[]>;
  
  getIndexedCommits(repositoryId: string): Promise<Commit[]>;
  getCommitByTag(repositoryId: string, tag: string): Promise<Commit | undefined>;
  getLatestCommit(repositoryId: string): Promise<Commit | undefined>;
  markCommitIndexed(commitId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private repositories: Map<string, Repository>;
  private folders: Map<string, Folder>;
  private files: Map<string, File>;
  private functions: Map<string, Function>;
  private commits: Map<string, Commit>;
  private moduleDependencies: Map<string, ModuleDependency>;
  private fileVersions: Map<string, FileVersion>;
  private functionVersions: Map<string, FunctionVersion>;

  constructor() {
    this.users = new Map();
    this.repositories = new Map();
    this.folders = new Map();
    this.files = new Map();
    this.functions = new Map();
    this.commits = new Map();
    this.moduleDependencies = new Map();
    this.fileVersions = new Map();
    this.functionVersions = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Repository methods
  async getRepository(id: string): Promise<Repository | undefined> {
    return this.repositories.get(id);
  }

  async createRepository(insertRepo: InsertRepository): Promise<Repository> {
    const id = randomUUID();
    const repo: Repository = {
      id,
      name: insertRepo.name,
      fullName: insertRepo.fullName,
      url: insertRepo.url,
      description: insertRepo.description ?? null,
      language: insertRepo.language ?? null,
      stars: insertRepo.stars ?? null,
      forks: insertRepo.forks ?? null,
      defaultBranch: insertRepo.defaultBranch ?? null,
      analyzedAt: new Date(),
    };
    this.repositories.set(id, repo);
    return repo;
  }

  async getRepositoryAnalysis(id: string): Promise<RepositoryAnalysis | null> {
    const repository = this.repositories.get(id);
    if (!repository) return null;

    const folders = await this.getFoldersByRepository(id);
    const files = await this.getFilesByRepository(id);
    const functions = await this.getFunctionsByRepository(id);
    const commits = await this.getCommitsByRepository(id);
    const dependencies = await this.getDependenciesByRepository(id);

    // Calculate stats
    const languageCount: Record<string, number> = {};
    const fileTypeCount: Record<string, number> = {};
    let totalLines = 0;

    files.forEach((file) => {
      if (file.language) {
        languageCount[file.language] = (languageCount[file.language] || 0) + 1;
      }
      if (file.fileType) {
        fileTypeCount[file.fileType] = (fileTypeCount[file.fileType] || 0) + 1;
      }
      totalLines += file.lineCount || 0;
    });

    const totalFiles = files.length;
    const languages = Object.entries(languageCount)
      .map(([language, count]) => ({
        language,
        count,
        percentage: (count / totalFiles) * 100,
      }))
      .sort((a, b) => b.count - a.count);

    const fileTypes = Object.entries(fileTypeCount)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    const stats: RepositoryStats = {
      totalFolders: folders.length,
      totalFiles,
      totalFunctions: functions.length,
      totalCommits: commits.length,
      totalLines,
      languages,
      fileTypes,
    };

    return {
      repository,
      stats,
      folders,
      files,
      functions,
      commits,
      dependencies,
    };
  }

  // Folder methods
  async createFolder(insertFolder: InsertFolder): Promise<Folder> {
    const id = randomUUID();
    const folder: Folder = {
      id,
      repositoryId: insertFolder.repositoryId,
      path: insertFolder.path,
      name: insertFolder.name,
      parentPath: insertFolder.parentPath ?? null,
      purpose: insertFolder.purpose ?? null,
      fileCount: insertFolder.fileCount ?? null,
    };
    this.folders.set(id, folder);
    return folder;
  }

  async getFoldersByRepository(repositoryId: string): Promise<Folder[]> {
    return Array.from(this.folders.values()).filter(
      (folder) => folder.repositoryId === repositoryId
    );
  }

  // File methods
  async createFile(insertFile: InsertFile): Promise<File> {
    const id = randomUUID();
    const file: File = {
      id,
      repositoryId: insertFile.repositoryId,
      path: insertFile.path,
      name: insertFile.name,
      folderPath: insertFile.folderPath ?? null,
      extension: insertFile.extension ?? null,
      language: insertFile.language ?? null,
      size: insertFile.size ?? null,
      lineCount: insertFile.lineCount ?? null,
      purpose: insertFile.purpose ?? null,
      fileType: insertFile.fileType ?? null,
      content: insertFile.content ?? null,
    };
    this.files.set(id, file);
    return file;
  }

  async getFilesByRepository(repositoryId: string): Promise<File[]> {
    return Array.from(this.files.values()).filter(
      (file) => file.repositoryId === repositoryId
    );
  }

  // Function methods
  async createFunction(insertFn: InsertFunction): Promise<Function> {
    const id = randomUUID();
    const fn: Function = {
      id,
      repositoryId: insertFn.repositoryId,
      fileId: insertFn.fileId,
      filePath: insertFn.filePath,
      name: insertFn.name,
      startLine: insertFn.startLine ?? null,
      endLine: insertFn.endLine ?? null,
      parameters: (insertFn.parameters as FunctionParameter[] | null) ?? null,
      returnType: insertFn.returnType ?? null,
      description: insertFn.description ?? null,
      docstring: insertFn.docstring ?? null,
      dependencies: insertFn.dependencies ?? null,
      exceptions: insertFn.exceptions ?? null,
      isAsync: insertFn.isAsync ?? null,
      isExported: insertFn.isExported ?? null,
      aiPurpose: null,
      aiHowItHelps: null,
      aiInputOutput: null,
      aiComplexity: null,
      aiAnalyzedAt: null,
    };
    this.functions.set(id, fn);
    return fn;
  }

  async bulkCreateFunctions(insertFns: InsertFunction[]): Promise<Function[]> {
    const functions: Function[] = [];
    for (const insertFn of insertFns) {
      const id = randomUUID();
      const fn: Function = {
        id,
        repositoryId: insertFn.repositoryId,
        fileId: insertFn.fileId,
        filePath: insertFn.filePath,
        name: insertFn.name,
        startLine: insertFn.startLine ?? null,
        endLine: insertFn.endLine ?? null,
        parameters: (insertFn.parameters as FunctionParameter[] | null) ?? null,
        returnType: insertFn.returnType ?? null,
        description: insertFn.description ?? null,
        docstring: insertFn.docstring ?? null,
        dependencies: insertFn.dependencies ?? null,
        exceptions: insertFn.exceptions ?? null,
        isAsync: insertFn.isAsync ?? null,
        isExported: insertFn.isExported ?? null,
        aiPurpose: null,
        aiHowItHelps: null,
        aiInputOutput: null,
        aiComplexity: null,
        aiAnalyzedAt: null,
      };
      this.functions.set(id, fn);
      functions.push(fn);
    }
    return functions;
  }

  async updateFunctionAIAnalysis(
    functionId: string,
    analysis: {
      aiPurpose: string;
      aiHowItHelps: string;
      aiInputOutput: string;
      aiComplexity: string;
    }
  ): Promise<Function | undefined> {
    const fn = this.functions.get(functionId);
    if (!fn) return undefined;
    
    const updated: Function = {
      ...fn,
      aiPurpose: analysis.aiPurpose,
      aiHowItHelps: analysis.aiHowItHelps,
      aiInputOutput: analysis.aiInputOutput,
      aiComplexity: analysis.aiComplexity,
      aiAnalyzedAt: new Date(),
    };
    this.functions.set(functionId, updated);
    return updated;
  }

  async getFunctionsByRepository(repositoryId: string): Promise<Function[]> {
    return Array.from(this.functions.values()).filter(
      (fn) => fn.repositoryId === repositoryId
    );
  }

  async getFunctionsByFile(fileId: string): Promise<Function[]> {
    return Array.from(this.functions.values()).filter(
      (fn) => fn.fileId === fileId
    );
  }

  // Commit methods
  async createCommit(insertCommit: InsertCommit): Promise<Commit> {
    const id = randomUUID();
    const commit: Commit = {
      id,
      repositoryId: insertCommit.repositoryId,
      sha: insertCommit.sha,
      message: insertCommit.message,
      author: insertCommit.author ?? null,
      authorEmail: insertCommit.authorEmail ?? null,
      date: insertCommit.date ?? null,
      additions: insertCommit.additions ?? null,
      deletions: insertCommit.deletions ?? null,
      filesChanged: insertCommit.filesChanged ?? null,
      tag: insertCommit.tag ?? null,
      isLatest: insertCommit.isLatest ?? null,
      isIndexed: insertCommit.isIndexed ?? null,
    };
    this.commits.set(id, commit);
    return commit;
  }

  async getCommitsByRepository(repositoryId: string): Promise<Commit[]> {
    return Array.from(this.commits.values())
      .filter((commit) => commit.repositoryId === repositoryId)
      .sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }

  // Module Dependency methods
  async createModuleDependency(
    insertDep: InsertModuleDependency
  ): Promise<ModuleDependency> {
    const id = randomUUID();
    const dep: ModuleDependency = {
      id,
      repositoryId: insertDep.repositoryId,
      sourceModule: insertDep.sourceModule,
      targetModule: insertDep.targetModule,
      importType: insertDep.importType ?? null,
      importedItems: insertDep.importedItems ?? null,
    };
    this.moduleDependencies.set(id, dep);
    return dep;
  }

  async bulkCreateModuleDependencies(
    insertDeps: InsertModuleDependency[]
  ): Promise<ModuleDependency[]> {
    const dependencies: ModuleDependency[] = [];
    for (const insertDep of insertDeps) {
      const id = randomUUID();
      const dep: ModuleDependency = {
        id,
        repositoryId: insertDep.repositoryId,
        sourceModule: insertDep.sourceModule,
        targetModule: insertDep.targetModule,
        importType: insertDep.importType ?? null,
        importedItems: insertDep.importedItems ?? null,
      };
      this.moduleDependencies.set(id, dep);
      dependencies.push(dep);
    }
    return dependencies;
  }

  async getDependenciesByRepository(
    repositoryId: string
  ): Promise<ModuleDependency[]> {
    return Array.from(this.moduleDependencies.values()).filter(
      (dep) => dep.repositoryId === repositoryId
    );
  }

  // Version-aware File Version methods
  async createFileVersion(insertFileVersion: InsertFileVersion): Promise<FileVersion> {
    const id = randomUUID();
    const fileVersion: FileVersion = {
      id,
      repositoryId: insertFileVersion.repositoryId,
      commitId: insertFileVersion.commitId,
      filePath: insertFileVersion.filePath,
      language: insertFileVersion.language ?? null,
      codeSnapshot: insertFileVersion.codeSnapshot ?? null,
      lineCount: insertFileVersion.lineCount ?? null,
      createdAt: new Date(),
    };
    this.fileVersions.set(id, fileVersion);
    return fileVersion;
  }

  async getFileVersionsByCommit(commitId: string): Promise<FileVersion[]> {
    return Array.from(this.fileVersions.values()).filter(
      (fv) => fv.commitId === commitId
    );
  }

  async getFileVersionByPath(
    repositoryId: string,
    filePath: string,
    version?: string
  ): Promise<FileVersion | undefined> {
    const allVersions = Array.from(this.fileVersions.values()).filter(
      (fv) => fv.repositoryId === repositoryId && fv.filePath === filePath
    );
    
    if (!version || version === "latest") {
      const latestCommit = await this.getLatestCommit(repositoryId);
      if (latestCommit) {
        return allVersions.find((fv) => fv.commitId === latestCommit.id);
      }
      return allVersions[0];
    }
    
    const commit = await this.getCommitByTag(repositoryId, version);
    if (commit) {
      return allVersions.find((fv) => fv.commitId === commit.id);
    }
    return undefined;
  }

  // Version-aware Function Version methods
  async createFunctionVersion(insertFnVersion: InsertFunctionVersion): Promise<FunctionVersion> {
    const id = randomUUID();
    const fnVersion: FunctionVersion = {
      id,
      repositoryId: insertFnVersion.repositoryId,
      fileVersionId: insertFnVersion.fileVersionId,
      functionName: insertFnVersion.functionName,
      startLine: insertFnVersion.startLine ?? null,
      endLine: insertFnVersion.endLine ?? null,
      codeSnapshot: insertFnVersion.codeSnapshot ?? null,
      parameters: (insertFnVersion.parameters as FunctionParameter[] | null) ?? null,
      returnType: insertFnVersion.returnType ?? null,
      isAsync: insertFnVersion.isAsync ?? null,
      isExported: insertFnVersion.isExported ?? null,
      createdAt: new Date(),
    };
    this.functionVersions.set(id, fnVersion);
    return fnVersion;
  }

  async getFunctionVersionsByFileVersion(fileVersionId: string): Promise<FunctionVersion[]> {
    return Array.from(this.functionVersions.values()).filter(
      (fv) => fv.fileVersionId === fileVersionId
    );
  }

  async searchFunctionsByKeyword(
    repositoryId: string,
    keyword: string,
    version?: string
  ): Promise<FunctionVersion[]> {
    let targetCommitId: string | null = null;
    
    if (!version || version === "latest") {
      const latestCommit = await this.getLatestCommit(repositoryId);
      targetCommitId = latestCommit?.id ?? null;
    } else {
      const commit = await this.getCommitByTag(repositoryId, version);
      targetCommitId = commit?.id ?? null;
    }

    const relevantFileVersions = targetCommitId
      ? await this.getFileVersionsByCommit(targetCommitId)
      : Array.from(this.fileVersions.values()).filter(
          (fv) => fv.repositoryId === repositoryId
        );

    const fileVersionIds = new Set(relevantFileVersions.map((fv) => fv.id));
    const keywordLower = keyword.toLowerCase();

    return Array.from(this.functionVersions.values()).filter(
      (fn) =>
        fileVersionIds.has(fn.fileVersionId) &&
        (fn.functionName.toLowerCase().includes(keywordLower) ||
          fn.codeSnapshot?.toLowerCase().includes(keywordLower))
    );
  }

  // Indexed commits methods
  async getIndexedCommits(repositoryId: string): Promise<Commit[]> {
    return Array.from(this.commits.values())
      .filter((c) => c.repositoryId === repositoryId && c.isIndexed === 1)
      .sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }

  async getCommitByTag(repositoryId: string, tag: string): Promise<Commit | undefined> {
    return Array.from(this.commits.values()).find(
      (c) => c.repositoryId === repositoryId && c.tag === tag
    );
  }

  async getLatestCommit(repositoryId: string): Promise<Commit | undefined> {
    return Array.from(this.commits.values()).find(
      (c) => c.repositoryId === repositoryId && c.isLatest === 1
    );
  }

  async markCommitIndexed(commitId: string): Promise<void> {
    const commit = this.commits.get(commitId);
    if (commit) {
      commit.isIndexed = 1;
      this.commits.set(commitId, commit);
    }
  }
}

export const storage = new MemStorage();
