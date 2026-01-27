import { Copy, Check, FileCode, Hash, Clock, Tag, Box, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { File, Function } from "@shared/schema";

interface FileDetailProps {
  file: File;
  functions: Function[];
  onFunctionSelect?: (fn: Function) => void;
}

export function FileDetail({ file, functions, onFunctionSelect }: FileDetailProps) {
  const [copied, setCopied] = useState(false);

  const copyPath = () => {
    navigator.clipboard.writeText(file.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageBadgeColor = (lang?: string | null) => {
    const colors: Record<string, string> = {
      typescript: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      javascript: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      python: "bg-green-500/10 text-green-600 dark:text-green-400",
      java: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      go: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      rust: "bg-red-500/10 text-red-600 dark:text-red-400",
    };
    return colors[lang?.toLowerCase() || ""] || "bg-muted text-muted-foreground";
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileCode className="h-5 w-5 text-primary shrink-0" />
                <h2 className="text-xl font-semibold truncate" data-testid="text-file-name">
                  {file.name}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono text-muted-foreground truncate">
                  {file.path}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 shrink-0"
                  onClick={copyPath}
                  data-testid="button-copy-path"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
            {file.language && (
              <Badge className={getLanguageBadgeColor(file.language)} variant="secondary">
                {file.language}
              </Badge>
            )}
          </div>

          {file.purpose && (
            <p className="text-sm text-muted-foreground" data-testid="text-file-purpose">
              {file.purpose}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Hash className="h-4 w-4" />
              <span>{file.lineCount?.toLocaleString() || 0} lines</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{((file.size || 0) / 1024).toFixed(1)} KB</span>
            </div>
            {file.fileType && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span className="capitalize">{file.fileType}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium flex items-center gap-2">
              <Box className="h-4 w-4 text-primary" />
              Functions ({functions.length})
            </h3>
          </div>

          {functions.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No functions found in this file
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {functions.map((fn) => (
                <Card
                  key={fn.id}
                  className="hover-elevate cursor-pointer"
                  onClick={() => onFunctionSelect?.(fn)}
                  data-testid={`card-function-${fn.name}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="font-mono font-medium text-sm">
                            {fn.name}
                          </code>
                          {fn.isAsync === 1 && (
                            <Badge variant="outline" className="text-xs">
                              async
                            </Badge>
                          )}
                          {fn.isExported === 1 && (
                            <Badge variant="secondary" className="text-xs">
                              exported
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {fn.description || fn.docstring || "No description available"}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                    {fn.parameters && fn.parameters.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {fn.parameters.slice(0, 4).map((param, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs font-mono"
                          >
                            {param.name}
                            {param.type && (
                              <span className="text-muted-foreground">
                                : {param.type}
                              </span>
                            )}
                          </span>
                        ))}
                        {fn.parameters.length > 4 && (
                          <span className="text-xs text-muted-foreground">
                            +{fn.parameters.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {file.content && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-base font-medium">Source Code</h3>
              <div className="relative">
                <pre className="rounded-lg bg-muted p-4 overflow-x-auto text-xs font-mono">
                  <code>{file.content}</code>
                </pre>
              </div>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
