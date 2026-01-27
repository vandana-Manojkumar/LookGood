import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import {
  GitBranch,
  Home,
  FolderTree,
  FileText,
  Code,
  GitCommit,
  Link2,
  BarChart3,
  Loader2,
  ChevronLeft,
  ExternalLink,
  Star,
  GitFork,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileTree } from "@/components/file-tree";
import { FileDetail } from "@/components/file-detail";
import { FunctionDetail } from "@/components/function-detail";
import { GitHistory } from "@/components/git-history";
import { StatsDashboard } from "@/components/stats-dashboard";
import { DependencyGraph } from "@/components/dependency-graph";
import { PdfExport } from "@/components/pdf-export";
import { AIAnalysis } from "@/components/ai-analysis";
import type { RepositoryAnalysis, TreeNode, File, Function as FunctionType } from "@shared/schema";

export default function Analysis() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const repoId = params.id;

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<FunctionType | null>(null);

  const { data: analysis, isLoading, error } = useQuery<RepositoryAnalysis>({
    queryKey: ["/api/repositories", repoId],
    enabled: !!repoId,
  });

  const buildFileTree = (folders: RepositoryAnalysis['folders'], files: RepositoryAnalysis['files']): TreeNode[] => {
    const nodeMap = new Map<string, TreeNode>();
    const rootNodes: TreeNode[] = [];

    folders.forEach((folder) => {
      nodeMap.set(folder.path, {
        id: folder.id,
        name: folder.name,
        path: folder.path,
        type: "folder",
        children: [],
      });
    });

    files.forEach((file) => {
      nodeMap.set(file.path, {
        id: file.id,
        name: file.name,
        path: file.path,
        type: "file",
        extension: file.extension || undefined,
        language: file.language || undefined,
      });
    });

    nodeMap.forEach((node, path) => {
      const parentPath = path.split("/").slice(0, -1).join("/");
      if (parentPath && nodeMap.has(parentPath)) {
        nodeMap.get(parentPath)!.children = nodeMap.get(parentPath)!.children || [];
        nodeMap.get(parentPath)!.children!.push(node);
      } else if (!parentPath || !nodeMap.has(parentPath)) {
        rootNodes.push(node);
      }
    });

    const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.sort((a, b) => {
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name);
      }).map((node) => ({
        ...node,
        children: node.children ? sortNodes(node.children) : undefined,
      }));
    };

    return sortNodes(rootNodes);
  };

  const handleNodeSelect = (node: TreeNode) => {
    setSelectedNode(node);
    setSelectedFunction(null);
    if (node.type === "file" && analysis) {
      const file = analysis.files.find((f) => f.path === node.path);
      setSelectedFile(file || null);
      if (file) {
        setActiveTab("files");
      }
    } else {
      setSelectedFile(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading repository analysis...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">Failed to load repository analysis</p>
        <Button variant="outline" onClick={() => setLocation("/")}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </Button>
      </div>
    );
  }

  const fileTree = buildFileTree(analysis.folders, analysis.files);
  const fileFunctions = selectedFile
    ? analysis.functions.filter((fn) => fn.fileId === selectedFile.id)
    : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              data-testid="button-home"
            >
              <Home className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-primary" />
              <span className="font-semibold truncate max-w-[200px] md:max-w-none" data-testid="text-repo-name">
                {analysis.repository.fullName}
              </span>
            </div>
            {analysis.repository.language && (
              <Badge variant="secondary">{analysis.repository.language}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>{analysis.repository.stars?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="h-4 w-4" />
                <span>{analysis.repository.forks?.toLocaleString() || 0}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <a
                href={analysis.repository.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-github"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <AIAnalysis 
              repositoryId={repoId || ""} 
              totalFunctions={analysis.functions.length}
              repoName={analysis.repository.fullName}
            />
            <PdfExport analysis={analysis} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 shrink-0 border-r bg-sidebar overflow-hidden flex flex-col">
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 text-sm font-medium text-sidebar-foreground">
              <FolderTree className="h-4 w-4" />
              File Explorer
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <FileTree
              nodes={fileTree}
              selectedPath={selectedNode?.path}
              onSelect={handleNodeSelect}
            />
          </div>
        </aside>

        <main className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b px-4">
              <TabsList className="h-11">
                <TabsTrigger value="overview" className="gap-1.5" data-testid="tab-overview">
                  <BarChart3 className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="files" className="gap-1.5" data-testid="tab-files">
                  <FileText className="h-4 w-4" />
                  Files
                </TabsTrigger>
                <TabsTrigger value="functions" className="gap-1.5" data-testid="tab-functions">
                  <Code className="h-4 w-4" />
                  Functions
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-1.5" data-testid="tab-history">
                  <GitCommit className="h-4 w-4" />
                  History
                </TabsTrigger>
                <TabsTrigger value="dependencies" className="gap-1.5" data-testid="tab-dependencies">
                  <Link2 className="h-4 w-4" />
                  Dependencies
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="overview" className="h-full m-0 p-6 overflow-auto">
                <div className="max-w-6xl mx-auto space-y-6">
                  {analysis.repository.description && (
                    <p className="text-muted-foreground" data-testid="text-repo-description">
                      {analysis.repository.description}
                    </p>
                  )}
                  <StatsDashboard stats={analysis.stats} />
                </div>
              </TabsContent>

              <TabsContent value="files" className="h-full m-0 overflow-hidden">
                {selectedFunction ? (
                  <FunctionDetail
                    fn={selectedFunction}
                    onBack={() => setSelectedFunction(null)}
                  />
                ) : selectedFile ? (
                  <FileDetail
                    file={selectedFile}
                    functions={fileFunctions}
                    onFunctionSelect={setSelectedFunction}
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
                    <FileText className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground text-center">
                      Select a file from the sidebar to view its details
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="functions" className="h-full m-0 overflow-auto">
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    All Functions ({analysis.functions.length})
                  </h3>
                  <div className="grid gap-3">
                    {analysis.functions.map((fn) => (
                      <div
                        key={fn.id}
                        className="p-4 rounded-lg border bg-card hover-elevate cursor-pointer"
                        onClick={() => {
                          const file = analysis.files.find((f) => f.id === fn.fileId);
                          if (file) {
                            setSelectedFile(file);
                            setSelectedFunction(fn);
                            setActiveTab("files");
                          }
                        }}
                        data-testid={`list-function-${fn.name}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <code className="font-mono font-medium">{fn.name}</code>
                              {fn.isAsync === 1 && (
                                <Badge variant="outline" className="text-xs">async</Badge>
                              )}
                            </div>
                            <code className="text-xs text-muted-foreground font-mono truncate block">
                              {fn.filePath}
                            </code>
                          </div>
                          {fn.returnType && (
                            <Badge variant="secondary" className="shrink-0 font-mono text-xs">
                              {fn.returnType}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="h-full m-0 overflow-hidden">
                <GitHistory commits={analysis.commits} />
              </TabsContent>

              <TabsContent value="dependencies" className="h-full m-0 overflow-hidden">
                <DependencyGraph dependencies={analysis.dependencies} />
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
