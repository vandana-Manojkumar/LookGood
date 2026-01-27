import { GitCommit, Plus, Minus, FileText, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Commit } from "@shared/schema";

interface GitHistoryProps {
  commits: Commit[];
}

export function GitHistory({ commits }: GitHistoryProps) {
  if (commits.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <GitCommit className="h-10 w-10 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">No commits found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <h3 className="text-base font-medium flex items-center gap-2 px-2">
          <GitCommit className="h-4 w-4 text-primary" />
          Commit History ({commits.length})
        </h3>
        <div className="relative">
          <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-3">
            {commits.map((commit, idx) => (
              <div key={commit.id} className="relative pl-10">
                <div className="absolute left-[16px] top-3 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                <Card data-testid={`card-commit-${idx}`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium line-clamp-2">
                        {commit.message}
                      </p>
                      <code className="text-xs font-mono text-muted-foreground">
                        {commit.sha.substring(0, 7)}
                      </code>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {commit.author && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{commit.author}</span>
                        </div>
                      )}
                      {commit.date && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(commit.date), "MMM d, yyyy HH:mm")}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {commit.additions !== undefined && commit.additions > 0 && (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                          <Plus className="h-3 w-3 mr-1" />
                          {commit.additions}
                        </Badge>
                      )}
                      {commit.deletions !== undefined && commit.deletions > 0 && (
                        <Badge variant="secondary" className="bg-red-500/10 text-red-600 dark:text-red-400">
                          <Minus className="h-3 w-3 mr-1" />
                          {commit.deletions}
                        </Badge>
                      )}
                      {commit.filesChanged !== undefined && commit.filesChanged > 0 && (
                        <Badge variant="secondary">
                          <FileText className="h-3 w-3 mr-1" />
                          {commit.filesChanged} files
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
