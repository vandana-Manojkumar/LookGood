import { useState } from "react";
import { Search, GitBranch, Loader2, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface RepositoryInputProps {
  onAnalyze: (url: string, token?: string) => void;
  isLoading?: boolean;
}

export function RepositoryInput({ onAnalyze, isLoading }: RepositoryInputProps) {
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState("");

  const validateGitHubUrl = (input: string): boolean => {
    const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?$/;
    return githubPattern.test(input) || /^[\w.-]+\/[\w.-]+$/.test(input);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!url.trim()) {
      setError("Please enter a repository URL");
      return;
    }

    if (!validateGitHubUrl(url.trim())) {
      setError("Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo or owner/repo)");
      return;
    }

    onAnalyze(url.trim(), token.trim() || undefined);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
          <GitBranch className="h-7 w-7 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold">Analyze Repository</CardTitle>
        <CardDescription className="text-base">
          Enter a GitHub repository URL to extract comprehensive documentation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="https://github.com/owner/repository or owner/repository"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              className="pl-10 h-11"
              data-testid="input-repository-url"
            />
          </div>
          <Collapsible open={showToken} onOpenChange={setShowToken}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" type="button" className="w-full justify-start text-muted-foreground text-sm">
                <Key className="mr-2 h-4 w-4" />
                {showToken ? "Hide" : "Add"} GitHub Token (for private repos)
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <Input
                type="password"
                placeholder="GitHub Personal Access Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="h-11"
                data-testid="input-github-token"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Required for private repositories. Create one at GitHub Settings &gt; Developer settings &gt; Personal access tokens
              </p>
            </CollapsibleContent>
          </Collapsible>
          {error && (
            <p className="text-sm text-destructive" data-testid="text-error">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            data-testid="button-analyze"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Repository...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze Repository
              </>
            )}
          </Button>
        </form>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {["facebook/react", "vercel/next.js", "microsoft/vscode"].map((repo) => (
            <button
              key={repo}
              type="button"
              onClick={() => setUrl(`https://github.com/${repo}`)}
              className="rounded-md bg-muted px-2 py-1 text-xs font-mono hover-elevate active-elevate-2"
              data-testid={`button-example-${repo.replace("/", "-")}`}
            >
              {repo}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
