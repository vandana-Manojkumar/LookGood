import { ArrowRight, Box, Link2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ModuleDependency } from "@shared/schema";

interface DependencyGraphProps {
  dependencies: ModuleDependency[];
}

export function DependencyGraph({ dependencies }: DependencyGraphProps) {
  if (dependencies.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <Link2 className="h-10 w-10 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">No dependencies found</p>
      </div>
    );
  }

  const groupedDeps = dependencies.reduce((acc, dep) => {
    if (!acc[dep.sourceModule]) {
      acc[dep.sourceModule] = [];
    }
    acc[dep.sourceModule].push(dep);
    return acc;
  }, {} as Record<string, ModuleDependency[]>);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <h3 className="text-base font-medium flex items-center gap-2 px-2">
          <Link2 className="h-4 w-4 text-primary" />
          Module Dependencies
        </h3>
        <div className="space-y-4">
          {Object.entries(groupedDeps).map(([source, deps]) => (
            <Card key={source} data-testid={`card-module-${source.replace(/\//g, "-")}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-mono flex items-center gap-2">
                  <Box className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate">{source}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {deps.map((dep, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <code className="text-xs font-mono text-muted-foreground truncate block">
                        {dep.targetModule}
                      </code>
                      {dep.importedItems && dep.importedItems.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {dep.importedItems.slice(0, 5).map((item, i) => (
                            <Badge key={i} variant="secondary" className="text-xs font-mono">
                              {item}
                            </Badge>
                          ))}
                          {dep.importedItems.length > 5 && (
                            <span className="text-xs text-muted-foreground">
                              +{dep.importedItems.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {dep.importType && (
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {dep.importType}
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
