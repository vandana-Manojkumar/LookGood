import { useState } from "react";
import { Brain, Loader2, CheckCircle, AlertCircle, Sparkles, Download, FileJson, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface AIAnalysisProps {
  repositoryId: string;
  totalFunctions: number;
  repoName?: string;
  onComplete?: () => void;
}

interface ProgressEvent {
  type: "started" | "progress" | "complete" | "error";
  total?: number;
  completed?: number;
  function?: string;
  analyzed?: number;
  errors?: number;
  message?: string;
  error?: string;
}

interface AnalyzedFunction {
  name: string;
  filePath: string;
  startLine?: number;
  endLine?: number;
  isAsync?: boolean;
  isExported?: boolean;
  parameters?: Array<{ name: string; type?: string }>;
  returnType?: string;
  aiPurpose?: string;
  aiHowItHelps?: string;
  aiInputOutput?: string;
  aiComplexity?: string;
}

export function AIAnalysis({ repositoryId, totalFunctions, repoName, onComplete }: AIAnalysisProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFunction, setCurrentFunction] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/repositories/${repositoryId}/ai-analysis`);
      if (!response.ok) throw new Error("Failed to fetch analysis");
      
      const data = await response.json();
      const functions: AnalyzedFunction[] = data.functions || [];
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      doc.setFontSize(20);
      doc.setTextColor(59, 130, 246);
      doc.text("AI Function Analysis Report", pageWidth / 2, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(repoName || "Repository", pageWidth / 2, 30, { align: "center" });
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 37, { align: "center" });
      
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Summary", 14, 50);
      
      doc.setFontSize(10);
      doc.setTextColor(60);
      const simple = functions.filter(f => f.aiComplexity === "simple").length;
      const moderate = functions.filter(f => f.aiComplexity === "moderate").length;
      const complex = functions.filter(f => f.aiComplexity === "complex").length;
      
      doc.text(`Total Functions Analyzed: ${functions.length}`, 14, 58);
      doc.text(`Simple: ${simple}  |  Moderate: ${moderate}  |  Complex: ${complex}`, 14, 65);
      
      let yPos = 80;
      
      functions.forEach((fn, index) => {
        if (yPos > 230) {
          doc.addPage();
          yPos = 20;
        }
        
        const folder = fn.filePath.split("/").slice(0, -1).join("/") || "root";
        const fileName = fn.filePath.split("/").pop() || fn.filePath;
        
        doc.setFillColor(245, 247, 250);
        doc.rect(10, yPos - 5, pageWidth - 20, 8, "F");
        
        doc.setFontSize(11);
        doc.setTextColor(59, 130, 246);
        doc.text(`${index + 1}. ${fn.name}()`, 14, yPos);
        
        const complexityColor = fn.aiComplexity === "simple" ? [34, 197, 94] : 
                                fn.aiComplexity === "complex" ? [239, 68, 68] : [234, 179, 8];
        doc.setTextColor(complexityColor[0], complexityColor[1], complexityColor[2]);
        doc.setFontSize(10);
        doc.text(`[${fn.aiComplexity?.toUpperCase() || "N/A"}]`, pageWidth - 35, yPos);
        
        yPos += 8;
        
        doc.setFontSize(8);
        doc.setTextColor(80);
        doc.text(`File: ${fileName}`, 14, yPos);
        yPos += 4;
        doc.text(`Folder: ${folder}`, 14, yPos);
        yPos += 4;
        doc.text(`Lines: ${fn.startLine || "?"} - ${fn.endLine || "?"}`, 14, yPos);
        
        const badges: string[] = [];
        if (fn.isAsync) badges.push("async");
        if (fn.isExported) badges.push("exported");
        if (badges.length > 0) {
          doc.text(`Tags: ${badges.join(", ")}`, 80, yPos);
        }
        
        yPos += 8;
        
        doc.setFontSize(9);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("Purpose:", 14, yPos);
        doc.setFont("helvetica", "normal");
        
        const purpose = fn.aiPurpose || "Not analyzed";
        const purposeLines = doc.splitTextToSize(purpose, pageWidth - 45);
        doc.text(purposeLines, 35, yPos);
        yPos += purposeLines.length * 4 + 4;
        
        if (fn.aiHowItHelps) {
          doc.setFont("helvetica", "bold");
          doc.text("How it helps:", 14, yPos);
          doc.setFont("helvetica", "normal");
          const helpLines = doc.splitTextToSize(fn.aiHowItHelps, pageWidth - 55);
          doc.text(helpLines, 45, yPos);
          yPos += helpLines.length * 4 + 4;
        }
        
        if (fn.aiInputOutput) {
          doc.setFont("helvetica", "bold");
          doc.text("I/O:", 14, yPos);
          doc.setFont("helvetica", "normal");
          const ioLines = doc.splitTextToSize(fn.aiInputOutput, pageWidth - 30);
          doc.text(ioLines, 25, yPos);
          yPos += ioLines.length * 4 + 4;
        }
        
        doc.setDrawColor(220);
        doc.line(14, yPos + 2, pageWidth - 14, yPos + 2);
        
        yPos += 12;
      });
      
      const filename = `${(repoName || "repository").replace(/\//g, "_")}_ai_analysis.pdf`;
      doc.save(filename);
      
      toast({
        title: "PDF Downloaded",
        description: `Saved ${functions.length} function analyses to PDF`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    setCompleted(0);
    setResult(null);
    setCurrentFunction("");

    try {
      const response = await fetch(`/api/repositories/${repositoryId}/analyze-functions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to start analysis");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          try {
            const event: ProgressEvent = JSON.parse(line.slice(6));

            switch (event.type) {
              case "started":
                setTotal(event.total || 0);
                break;
              case "progress":
                setCompleted(event.completed || 0);
                setCurrentFunction(event.function || "");
                if (event.total) {
                  setProgress(Math.round(((event.completed || 0) / event.total) * 100));
                }
                break;
              case "complete":
                setResult({
                  success: true,
                  message: event.message || `Analyzed ${event.analyzed} functions`,
                });
                setProgress(100);
                onComplete?.();
                break;
              case "error":
                setResult({
                  success: false,
                  message: event.error || "Analysis failed",
                });
                break;
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Analysis failed",
      });
      toast({
        title: "Analysis Failed",
        description: "Could not complete AI analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" data-testid="button-ai-analysis">
          <Brain className="h-4 w-4" />
          AI Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Function Analysis
          </DialogTitle>
          <DialogDescription>
            Use AI to analyze your functions and generate intelligent descriptions explaining what each function does and how it helps the project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isAnalyzing && !result && (
            <div className="text-center space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p>This will analyze each function using AI to generate:</p>
                <ul className="list-disc list-inside mt-2 text-left">
                  <li>Purpose description</li>
                  <li>How it helps the project</li>
                  <li>Input/output summary</li>
                  <li>Complexity rating</li>
                </ul>
              </div>
              <Button onClick={startAnalysis} className="gap-2" data-testid="button-start-ai-analysis">
                <Brain className="h-4 w-4" />
                Start AI Analysis
              </Button>
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing: {currentFunction || "Starting..."}</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                {completed} of {total} functions analyzed ({progress}%)
              </p>
            </div>
          )}

          {result && (
            <div className={`flex items-start gap-3 p-4 rounded-lg ${
              result.success ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
            }`}>
              {result.success ? (
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium">{result.success ? "Analysis Complete" : "Analysis Failed"}</p>
                <p className="text-sm opacity-80">{result.message}</p>
              </div>
            </div>
          )}

          {result?.success && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">Download your analysis:</p>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="flex-1 gap-2"
                  onClick={downloadPDF}
                  disabled={isDownloading}
                  data-testid="button-download-pdf"
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  PDF Report
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => {
                    window.location.href = `/api/repositories/${repositoryId}/ai-analysis/download`;
                  }}
                  data-testid="button-download-json"
                >
                  <FileJson className="h-4 w-4" />
                  JSON Data
                </Button>
              </div>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setIsOpen(false)}
                data-testid="button-close-ai-analysis"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
