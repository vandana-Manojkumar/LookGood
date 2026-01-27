import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Repository table
export const repositories = pgTable("repositories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  language: text("language"),
  stars: integer("stars").default(0),
  forks: integer("forks").default(0),
  defaultBranch: text("default_branch").default("main"),
  analyzedAt: timestamp("analyzed_at").defaultNow(),
});

export const insertRepositorySchema = createInsertSchema(repositories).omit({ id: true, analyzedAt: true });
export type InsertRepository = z.infer<typeof insertRepositorySchema>;
export type Repository = typeof repositories.$inferSelect;

// Folder structure
export const folders = pgTable("folders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  repositoryId: varchar("repository_id").notNull(),
  path: text("path").notNull(),
  name: text("name").notNull(),
  parentPath: text("parent_path"),
  purpose: text("purpose"),
  fileCount: integer("file_count").default(0),
});

export const insertFolderSchema = createInsertSchema(folders).omit({ id: true });
export type InsertFolder = z.infer<typeof insertFolderSchema>;
export type Folder = typeof folders.$inferSelect;

// Files
export const files = pgTable("files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  repositoryId: varchar("repository_id").notNull(),
  path: text("path").notNull(),
  name: text("name").notNull(),
  folderPath: text("folder_path"),
  extension: text("extension"),
  language: text("language"),
  size: integer("size").default(0),
  lineCount: integer("line_count").default(0),
  purpose: text("purpose"),
  fileType: text("file_type"), // utility, controller, service, model, etc.
  content: text("content"),
});

export const insertFileSchema = createInsertSchema(files).omit({ id: true });
export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;

// Functions
export const functions = pgTable("functions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  repositoryId: varchar("repository_id").notNull(),
  fileId: varchar("file_id").notNull(),
  filePath: text("file_path").notNull(),
  name: text("name").notNull(),
  startLine: integer("start_line"),
  endLine: integer("end_line"),
  parameters: jsonb("parameters").$type<FunctionParameter[]>(),
  returnType: text("return_type"),
  description: text("description"),
  docstring: text("docstring"),
  dependencies: text("dependencies").array(),
  exceptions: text("exceptions").array(),
  isAsync: integer("is_async").default(0),
  isExported: integer("is_exported").default(0),
  aiPurpose: text("ai_purpose"),
  aiHowItHelps: text("ai_how_it_helps"),
  aiInputOutput: text("ai_input_output"),
  aiComplexity: text("ai_complexity"),
  aiAnalyzedAt: timestamp("ai_analyzed_at"),
});

export interface FunctionParameter {
  name: string;
  type?: string;
  description?: string;
  defaultValue?: string;
}

export const insertFunctionSchema = createInsertSchema(functions).omit({ id: true });
export type InsertFunction = z.infer<typeof insertFunctionSchema>;
export type Function = typeof functions.$inferSelect;

// Git Commits (Version-Aware)
export const commits = pgTable("commits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  repositoryId: varchar("repository_id").notNull(),
  sha: text("sha").notNull(),
  message: text("message").notNull(),
  author: text("author"),
  authorEmail: text("author_email"),
  date: timestamp("date"),
  additions: integer("additions").default(0),
  deletions: integer("deletions").default(0),
  filesChanged: integer("files_changed").default(0),
  tag: text("tag"),
  isLatest: integer("is_latest").default(0),
  isIndexed: integer("is_indexed").default(0),
});

export const insertCommitSchema = createInsertSchema(commits).omit({ id: true });
export type InsertCommit = z.infer<typeof insertCommitSchema>;
export type Commit = typeof commits.$inferSelect;

// File Versions (Snapshots per commit)
export const fileVersions = pgTable("file_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  repositoryId: varchar("repository_id").notNull(),
  commitId: varchar("commit_id").notNull(),
  filePath: text("file_path").notNull(),
  language: text("language"),
  codeSnapshot: text("code_snapshot"),
  lineCount: integer("line_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFileVersionSchema = createInsertSchema(fileVersions).omit({ id: true, createdAt: true });
export type InsertFileVersion = z.infer<typeof insertFileVersionSchema>;
export type FileVersion = typeof fileVersions.$inferSelect;

// Function Versions (Snapshots per file version)
export const functionVersions = pgTable("function_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  repositoryId: varchar("repository_id").notNull(),
  fileVersionId: varchar("file_version_id").notNull(),
  functionName: text("function_name").notNull(),
  startLine: integer("start_line"),
  endLine: integer("end_line"),
  codeSnapshot: text("code_snapshot"),
  parameters: jsonb("parameters").$type<FunctionParameter[]>(),
  returnType: text("return_type"),
  isAsync: integer("is_async").default(0),
  isExported: integer("is_exported").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFunctionVersionSchema = createInsertSchema(functionVersions).omit({ id: true, createdAt: true });
export type InsertFunctionVersion = z.infer<typeof insertFunctionVersionSchema>;
export type FunctionVersion = typeof functionVersions.$inferSelect;

// Module Dependencies
export const moduleDependencies = pgTable("module_dependencies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  repositoryId: varchar("repository_id").notNull(),
  sourceModule: text("source_module").notNull(),
  targetModule: text("target_module").notNull(),
  importType: text("import_type"), // default, named, namespace
  importedItems: text("imported_items").array(),
});

export const insertModuleDependencySchema = createInsertSchema(moduleDependencies).omit({ id: true });
export type InsertModuleDependency = z.infer<typeof insertModuleDependencySchema>;
export type ModuleDependency = typeof moduleDependencies.$inferSelect;

// Users table (keep for auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Frontend-only types for analysis results
export interface RepositoryAnalysis {
  repository: Repository;
  stats: RepositoryStats;
  folders: Folder[];
  files: File[];
  functions: Function[];
  commits: Commit[];
  dependencies: ModuleDependency[];
  fileVersions?: FileVersion[];
  functionVersions?: FunctionVersion[];
  indexedVersions?: { commitId: string; tag: string | null; sha: string; date: Date | null }[];
}

export interface RepositoryStats {
  totalFolders: number;
  totalFiles: number;
  totalFunctions: number;
  totalCommits: number;
  totalLines: number;
  languages: { language: string; count: number; percentage: number }[];
  fileTypes: { type: string; count: number }[];
}

export interface TreeNode {
  id: string;
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  extension?: string;
  language?: string;
}
