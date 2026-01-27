import { ArrowLeft, Code, Box, AlertTriangle, Link2, FileText, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Function as FunctionType } from "@shared/schema";

interface FunctionDetailProps {
  fn: FunctionType;
  onBack: () => void;
}

export function FunctionDetail({ fn, onBack }: FunctionDetailProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="-ml-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to file
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-5 w-5 text-primary shrink-0" />
                <h2 className="text-xl font-mono font-semibold" data-testid="text-function-name">
                  {fn.name}()
                </h2>
              </div>
              <code className="text-xs font-mono text-muted-foreground">
                {fn.filePath}:{fn.startLine}
              </code>
            </div>
            <div className="flex items-center gap-2">
              {fn.isAsync === 1 && (
                <Badge variant="outline">async</Badge>
              )}
              {fn.isExported === 1 && (
                <Badge variant="secondary">exported</Badge>
              )}
            </div>
          </div>

          {(fn.description || fn.docstring) && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-sm" data-testid="text-function-description">
                    {fn.description || fn.docstring}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {fn.aiPurpose && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Analysis
                  {fn.aiComplexity && (
                    <Badge 
                      variant={fn.aiComplexity === "simple" ? "secondary" : fn.aiComplexity === "complex" ? "destructive" : "outline"}
                      className="ml-auto"
                    >
                      {fn.aiComplexity}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Brain className="h-3 w-3" /> Purpose
                  </p>
                  <p className="text-sm" data-testid="text-ai-purpose">{fn.aiPurpose}</p>
                </div>
                {fn.aiHowItHelps && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">How it helps</p>
                    <p className="text-sm" data-testid="text-ai-how-it-helps">{fn.aiHowItHelps}</p>
                  </div>
                )}
                {fn.aiInputOutput && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Input/Output</p>
                    <p className="text-sm font-mono text-xs" data-testid="text-ai-input-output">{fn.aiInputOutput}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-base font-medium flex items-center gap-2">
            <Box className="h-4 w-4 text-primary" />
            Parameters
          </h3>
          {!fn.parameters || fn.parameters.length === 0 ? (
            <div className="rounded-lg border border-dashed p-4 text-center">
              <p className="text-sm text-muted-foreground">No parameters</p>
            </div>
          ) : (
            <div className="space-y-2">
              {fn.parameters.map((param, idx) => (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="font-mono font-medium text-sm">
                            {param.name}
                          </code>
                          {param.type && (
                            <span className="text-xs text-muted-foreground font-mono">
                              : {param.type}
                            </span>
                          )}
                        </div>
                        {param.description && (
                          <p className="text-xs text-muted-foreground">
                            {param.description}
                          </p>
                        )}
                      </div>
                      {param.defaultValue && (
                        <Badge variant="outline" className="shrink-0 font-mono text-xs">
                          = {param.defaultValue}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {fn.returnType && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-base font-medium">Returns</h3>
              <Card>
                <CardContent className="p-4">
                  <code className="font-mono text-sm">{fn.returnType}</code>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {fn.dependencies && fn.dependencies.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-base font-medium flex items-center gap-2">
                <Link2 className="h-4 w-4 text-primary" />
                Dependencies ({fn.dependencies.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {fn.dependencies.map((dep, idx) => (
                  <Badge key={idx} variant="secondary" className="font-mono text-xs">
                    {dep}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {fn.exceptions && fn.exceptions.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-base font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Exceptions
              </h3>
              <div className="flex flex-wrap gap-2">
                {fn.exceptions.map((exc, idx) => (
                  <Badge key={idx} variant="destructive" className="font-mono text-xs">
                    {exc}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {fn.startLine && fn.endLine && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-base font-medium">Location</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Start Line</span>
                  <p className="font-mono">{fn.startLine}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">End Line</span>
                  <p className="font-mono">{fn.endLine}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
