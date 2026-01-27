import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { GitBranch, Code2, FileSearch, History, Layers, Sparkles, Zap, Download, ArrowRight } from "lucide-react";
import { RepositoryInput } from "@/components/repository-input";
import { ThemeToggle } from "@/components/theme-toggle";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async ({ url, token }: { url: string; token?: string }) => {
      const response = await apiRequest("POST", "/api/repositories/analyze", { url, token });
      return response.json();
    },
    onSuccess: (data) => {
      setLocation(`/analysis/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze repository",
        variant: "destructive",
      });
    },
  });

  const features = [
    {
      icon: FileSearch,
      title: "Complete File Analysis",
      description: "Extract every file, folder, and their relationships with full source code content",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Code2,
      title: "Function Documentation",
      description: "Detailed analysis of every function - parameters, returns, purpose, and dependencies",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: History,
      title: "Git History Timeline",
      description: "Complete commit history with authors, changes, additions, and deletions",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Layers,
      title: "Dependency Mapping",
      description: "Visual graph of module imports and how components connect together",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Download,
      title: "PDF Export",
      description: "Generate comprehensive documentation PDF perfect for training AI agents",
      gradient: "from-indigo-500 to-violet-500",
    },
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Fast extraction powered by GitHub API with support for private repositories",
      gradient: "from-yellow-500 to-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-30 pointer-events-none" />
      
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4 px-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25">
              <GitBranch className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">CodeBase Analyzer</span>
          </motion.div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container px-6 py-16 relative">
        <div className="mx-auto max-w-5xl space-y-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              AI-Ready Documentation Generator
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
              Deep Codebase
              <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Understanding
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform any GitHub repository into comprehensive documentation.
              Extract functions, analyze dependencies, and export detailed PDFs
              perfect for training AI agents.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <RepositoryInput
              onAnalyze={(url, token) => analyzeMutation.mutate({ url, token })}
              isLoading={analyzeMutation.isPending}
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                className="group relative p-6 rounded-2xl border bg-card/50 backdrop-blur-sm hover-elevate"
                data-testid={`feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground">
              Works with public and private repositories
              <ArrowRight className="inline h-4 w-4 mx-2" />
              Add your GitHub token for private repo access
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
