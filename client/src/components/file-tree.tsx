import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, FileCode, FileJson, File as FileIcon, FileType } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TreeNode } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileTreeProps {
  nodes: TreeNode[];
  selectedPath?: string;
  onSelect: (node: TreeNode) => void;
}

const getFileIcon = (extension?: string) => {
  switch (extension) {
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
      return <FileCode className="h-4 w-4 text-blue-500" />;
    case "json":
      return <FileJson className="h-4 w-4 text-yellow-500" />;
    case "md":
    case "txt":
      return <FileText className="h-4 w-4 text-muted-foreground" />;
    case "css":
    case "scss":
      return <FileType className="h-4 w-4 text-pink-500" />;
    case "py":
      return <FileCode className="h-4 w-4 text-green-500" />;
    default:
      return <FileIcon className="h-4 w-4 text-muted-foreground" />;
  }
};

interface TreeItemProps {
  node: TreeNode;
  level: number;
  selectedPath?: string;
  onSelect: (node: TreeNode) => void;
}

function TreeItem({ node, level, selectedPath, onSelect }: TreeItemProps) {
  const [isOpen, setIsOpen] = useState(level < 2);
  const isFolder = node.type === "folder";
  const isSelected = selectedPath === node.path;
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = () => {
    if (isFolder && hasChildren) {
      setIsOpen(!isOpen);
    }
    onSelect(node);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm hover-elevate active-elevate-2",
          isSelected && "bg-accent text-accent-foreground"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        data-testid={`tree-item-${node.path.replace(/\//g, "-")}`}
      >
        {isFolder ? (
          <>
            {hasChildren ? (
              isOpen ? (
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              )
            ) : (
              <span className="w-3.5" />
            )}
            {isOpen ? (
              <FolderOpen className="h-4 w-4 shrink-0 text-amber-500" />
            ) : (
              <Folder className="h-4 w-4 shrink-0 text-amber-500" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5" />
            {getFileIcon(node.extension)}
          </>
        )}
        <span className="truncate font-mono text-xs">{node.name}</span>
      </button>
      {isFolder && isOpen && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeItem
              key={child.path}
              node={child}
              level={level + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ nodes, selectedPath, onSelect }: FileTreeProps) {
  if (nodes.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <Folder className="h-10 w-10 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">No files to display</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        {nodes.map((node) => (
          <TreeItem
            key={node.path}
            node={node}
            level={0}
            selectedPath={selectedPath}
            onSelect={onSelect}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
