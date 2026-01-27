import { useState } from "react";
import { Download, FileText, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { RepositoryAnalysis, Function as FunctionType, File, Folder } from "@shared/schema";

interface PdfExportProps {
  analysis: RepositoryAnalysis;
}

export function PdfExport({ analysis }: PdfExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const getFunctionPurpose = (fn: FunctionType, file: File | undefined): string => {
    if (fn.description) return fn.description;
    if (fn.docstring) return fn.docstring;
    
    const name = fn.name.toLowerCase();
    if (name.startsWith("get")) return `Retrieves ${name.slice(3).replace(/([A-Z])/g, ' $1').trim()} data`;
    if (name.startsWith("set")) return `Updates ${name.slice(3).replace(/([A-Z])/g, ' $1').trim()} value`;
    if (name.startsWith("is") || name.startsWith("has") || name.startsWith("can")) return `Checks if ${name.replace(/([A-Z])/g, ' $1').trim()}`;
    if (name.startsWith("handle")) return `Handles ${name.slice(6).replace(/([A-Z])/g, ' $1').trim()} events`;
    if (name.startsWith("on")) return `Event handler for ${name.slice(2).replace(/([A-Z])/g, ' $1').trim()}`;
    if (name.startsWith("create") || name.startsWith("make") || name.startsWith("build")) return `Creates ${name.replace(/^(create|make|build)/i, '').replace(/([A-Z])/g, ' $1').trim()}`;
    if (name.startsWith("delete") || name.startsWith("remove")) return `Removes ${name.replace(/^(delete|remove)/i, '').replace(/([A-Z])/g, ' $1').trim()}`;
    if (name.startsWith("update")) return `Updates ${name.slice(6).replace(/([A-Z])/g, ' $1').trim()}`;
    if (name.startsWith("fetch") || name.startsWith("load")) return `Loads ${name.replace(/^(fetch|load)/i, '').replace(/([A-Z])/g, ' $1').trim()} from source`;
    if (name.startsWith("validate") || name.startsWith("check")) return `Validates ${name.replace(/^(validate|check)/i, '').replace(/([A-Z])/g, ' $1').trim()}`;
    if (name.startsWith("parse")) return `Parses ${name.slice(5).replace(/([A-Z])/g, ' $1').trim()} data`;
    if (name.startsWith("format")) return `Formats ${name.slice(6).replace(/([A-Z])/g, ' $1').trim()} for display`;
    if (name.startsWith("convert") || name.startsWith("transform")) return `Converts ${name.replace(/^(convert|transform)/i, '').replace(/([A-Z])/g, ' $1').trim()} to new format`;
    if (name.startsWith("init") || name.startsWith("setup")) return `Initializes ${name.replace(/^(init|setup)/i, '').replace(/([A-Z])/g, ' $1').trim()}`;
    if (name.startsWith("render")) return `Renders ${name.slice(6).replace(/([A-Z])/g, ' $1').trim()} component`;
    if (name.startsWith("use")) return `React hook for ${name.slice(3).replace(/([A-Z])/g, ' $1').trim()}`;
    
    const fileType = file?.fileType;
    if (fileType === "component") return `Component function handling ${name.replace(/([A-Z])/g, ' $1').trim()} logic`;
    if (fileType === "hook") return `Custom React hook for ${name.replace(/([A-Z])/g, ' $1').trim()}`;
    if (fileType === "service") return `Service function for ${name.replace(/([A-Z])/g, ' $1').trim()} operations`;
    if (fileType === "controller") return `Controller handling ${name.replace(/([A-Z])/g, ' $1').trim()} requests`;
    if (fileType === "utility") return `Utility function for ${name.replace(/([A-Z])/g, ' $1').trim()}`;
    
    return `Function performing ${name.replace(/([A-Z])/g, ' $1').trim()} operations`;
  };

  const getHowItHelps = (fn: FunctionType, file: File | undefined): string => {
    const fileType = file?.fileType || "unknown";
    const isAsync = fn.isAsync === 1;
    const isExported = fn.isExported === 1;
    
    let helpText = "";
    
    if (isExported) {
      helpText += "This function is exported and can be imported by other modules. ";
    }
    if (isAsync) {
      helpText += "It performs asynchronous operations, likely involving API calls or database access. ";
    }
    
    switch (fileType) {
      case "component":
        helpText += "As a component function, it contributes to the UI rendering and user interaction.";
        break;
      case "hook":
        helpText += "As a hook, it provides reusable stateful logic that can be shared across components.";
        break;
      case "service":
        helpText += "As a service function, it encapsulates business logic and data operations.";
        break;
      case "controller":
        helpText += "As a controller function, it handles incoming requests and coordinates responses.";
        break;
      case "utility":
        helpText += "As a utility function, it provides helper functionality used throughout the application.";
        break;
      case "model":
        helpText += "As a model function, it defines data structures and database interactions.";
        break;
      default:
        helpText += "This function contributes to the overall application functionality.";
    }
    
    return helpText;
  };

  const generatePdf = async () => {
    setIsGenerating(true);
    setProgress(0);
    setIsComplete(false);

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    const addHeader = (text: string, size: number = 16) => {
      if (yPos > pageHeight - 40) {
        pdf.addPage();
        yPos = margin;
      }
      pdf.setFontSize(size);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 64, 175);
      pdf.text(text, margin, yPos);
      yPos += size * 0.5 + 5;
    };

    const addSubHeader = (text: string) => {
      if (yPos > pageHeight - 30) {
        pdf.addPage();
        yPos = margin;
      }
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(60, 60, 60);
      pdf.text(text, margin, yPos);
      yPos += 8;
    };

    const addText = (text: string, indent: number = 0) => {
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(80, 80, 80);
      const maxWidth = pageWidth - margin * 2 - indent;
      const lines = pdf.splitTextToSize(text, maxWidth);
      for (const line of lines) {
        if (yPos > pageHeight - 20) {
          pdf.addPage();
          yPos = margin;
        }
        pdf.text(line, margin + indent, yPos);
        yPos += 5;
      }
    };

    const addSeparator = () => {
      yPos += 3;
      pdf.setDrawColor(220, 220, 220);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;
    };

    pdf.setFillColor(30, 64, 175);
    pdf.rect(0, 0, pageWidth, 50, "F");
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(255, 255, 255);
    pdf.text("CodeBase Documentation", pageWidth / 2, 25, { align: "center" });
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(analysis.repository.fullName, pageWidth / 2, 38, { align: "center" });
    
    yPos = 70;
    setProgress(5);

    addHeader("Executive Summary", 18);
    addText(`This document provides comprehensive documentation of the ${analysis.repository.name} repository. It contains detailed analysis of ${analysis.stats.totalFiles} files, ${analysis.stats.totalFunctions} functions, and ${analysis.stats.totalCommits} commits. This documentation is designed to help understand the codebase structure and can be used to train AI agents.`);
    yPos += 10;

    addHeader("Repository Statistics", 16);
    const statsData = [
      ["Total Files", analysis.stats.totalFiles.toString()],
      ["Total Folders", analysis.stats.totalFolders.toString()],
      ["Total Functions", analysis.stats.totalFunctions.toString()],
      ["Total Commits", analysis.stats.totalCommits.toString()],
      ["Total Lines of Code", analysis.stats.totalLines.toLocaleString()],
      ["Primary Language", analysis.repository.language || "Multiple"],
      ["Stars", (analysis.repository.stars || 0).toLocaleString()],
      ["Forks", (analysis.repository.forks || 0).toLocaleString()],
    ];

    autoTable(pdf, {
      startY: yPos,
      head: [["Metric", "Value"]],
      body: statsData,
      margin: { left: margin, right: margin },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [30, 64, 175] },
    });

    yPos = (pdf as any).lastAutoTable.finalY + 15;
    setProgress(15);

    if (analysis.stats.languages.length > 0) {
      addHeader("Languages Distribution", 16);
      const langData = analysis.stats.languages.slice(0, 10).map(l => [
        l.language,
        l.count.toString(),
        `${l.percentage.toFixed(1)}%`
      ]);

      autoTable(pdf, {
        startY: yPos,
        head: [["Language", "Files", "Percentage"]],
        body: langData,
        margin: { left: margin, right: margin },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [30, 64, 175] },
      });

      yPos = (pdf as any).lastAutoTable.finalY + 15;
    }
    setProgress(25);

    pdf.addPage();
    yPos = margin;
    addHeader("Folder Structure", 18);
    addText("The following folders comprise the repository structure:");
    yPos += 5;

    const folderData = analysis.folders.slice(0, 50).map(f => [
      f.path,
      f.purpose || "Contains project files"
    ]);

    if (folderData.length > 0) {
      autoTable(pdf, {
        startY: yPos,
        head: [["Folder Path", "Purpose"]],
        body: folderData,
        margin: { left: margin, right: margin },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [30, 64, 175] },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 'auto' }
        }
      });
      yPos = (pdf as any).lastAutoTable.finalY + 15;
    }
    setProgress(35);

    pdf.addPage();
    yPos = margin;
    addHeader("File Index", 18);
    addText("Complete list of files in the repository with their details:");
    yPos += 5;

    const fileData = analysis.files.slice(0, 100).map(f => [
      f.name,
      f.path.split("/").slice(0, -1).join("/") || "/",
      f.language || "N/A",
      (f.lineCount || 0).toString(),
      f.fileType || "source"
    ]);

    if (fileData.length > 0) {
      autoTable(pdf, {
        startY: yPos,
        head: [["File Name", "Location", "Language", "Lines", "Type"]],
        body: fileData,
        margin: { left: margin, right: margin },
        styles: { fontSize: 8 },
        headStyles: { fillColor: [30, 64, 175] },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 50 },
          2: { cellWidth: 25 },
          3: { cellWidth: 15 },
          4: { cellWidth: 25 }
        }
      });
      yPos = (pdf as any).lastAutoTable.finalY + 15;
    }
    setProgress(50);

    pdf.addPage();
    yPos = margin;
    addHeader("Function Encyclopedia", 18);
    addText("Detailed documentation of every function in the codebase. Each function is documented with its purpose, parameters, return type, and how it contributes to the project.");
    yPos += 10;

    const fileMap = new Map(analysis.files.map(f => [f.id, f]));
    const functionsByFile = new Map<string, FunctionType[]>();
    
    for (const fn of analysis.functions) {
      const existing = functionsByFile.get(fn.fileId) || [];
      existing.push(fn);
      functionsByFile.set(fn.fileId, existing);
    }

    let fnCount = 0;
    const totalFns = analysis.functions.length;

    for (const [fileId, functions] of functionsByFile) {
      const file = fileMap.get(fileId);
      if (!file) continue;

      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = margin;
      }

      pdf.setFillColor(245, 247, 250);
      pdf.rect(margin - 5, yPos - 5, pageWidth - margin * 2 + 10, 15, "F");
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 64, 175);
      pdf.text(`${file.name}`, margin, yPos + 5);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${file.path}`, margin, yPos + 12);
      yPos += 22;

      for (const fn of functions) {
        fnCount++;
        setProgress(50 + Math.floor((fnCount / totalFns) * 35));

        if (yPos > pageHeight - 50) {
          pdf.addPage();
          yPos = margin;
        }

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(60, 60, 60);
        
        let signature = fn.name;
        if (fn.parameters && fn.parameters.length > 0) {
          const params = fn.parameters.map(p => p.type ? `${p.name}: ${p.type}` : p.name).join(", ");
          signature += `(${params})`;
        } else {
          signature += "()";
        }
        if (fn.returnType) {
          signature += `: ${fn.returnType}`;
        }
        
        const badges: string[] = [];
        if (fn.isAsync === 1) badges.push("async");
        if (fn.isExported === 1) badges.push("exported");
        
        pdf.text(`${fn.isExported === 1 ? "export " : ""}${fn.isAsync === 1 ? "async " : ""}function ${signature}`, margin + 5, yPos);
        yPos += 7;

        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(30, 64, 175);
        pdf.text("What it does:", margin + 5, yPos);
        yPos += 5;
        
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(80, 80, 80);
        const purpose = getFunctionPurpose(fn, file);
        const purposeLines = pdf.splitTextToSize(purpose, pageWidth - margin * 2 - 10);
        for (const line of purposeLines) {
          if (yPos > pageHeight - 20) {
            pdf.addPage();
            yPos = margin;
          }
          pdf.text(line, margin + 10, yPos);
          yPos += 4;
        }
        yPos += 2;

        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(30, 64, 175);
        pdf.text("How it helps the project:", margin + 5, yPos);
        yPos += 5;
        
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(80, 80, 80);
        const helpText = getHowItHelps(fn, file);
        const helpLines = pdf.splitTextToSize(helpText, pageWidth - margin * 2 - 10);
        for (const line of helpLines) {
          if (yPos > pageHeight - 20) {
            pdf.addPage();
            yPos = margin;
          }
          pdf.text(line, margin + 10, yPos);
          yPos += 4;
        }
        yPos += 2;

        if (fn.parameters && fn.parameters.length > 0) {
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(30, 64, 175);
          pdf.text("Parameters:", margin + 5, yPos);
          yPos += 5;
          
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(80, 80, 80);
          for (const param of fn.parameters) {
            if (yPos > pageHeight - 20) {
              pdf.addPage();
              yPos = margin;
            }
            const paramText = param.type ? `${param.name} (${param.type})` : param.name;
            pdf.text(`- ${paramText}`, margin + 10, yPos);
            yPos += 4;
          }
        }

        pdf.setFontSize(9);
        pdf.setTextColor(120, 120, 120);
        pdf.text(`Lines ${fn.startLine || 0} - ${fn.endLine || 0}`, margin + 5, yPos);
        yPos += 10;

        pdf.setDrawColor(230, 230, 230);
        pdf.line(margin, yPos - 3, pageWidth - margin, yPos - 3);
        yPos += 5;
      }
    }
    setProgress(90);

    pdf.addPage();
    yPos = margin;
    addHeader("Git Commit History", 18);
    addText("Recent commit history showing the evolution of the codebase:");
    yPos += 5;

    const commitData = analysis.commits.slice(0, 50).map(c => [
      c.sha.substring(0, 7),
      c.author || "Unknown",
      c.message.substring(0, 60) + (c.message.length > 60 ? "..." : ""),
      c.date ? new Date(c.date).toLocaleDateString() : "N/A"
    ]);

    if (commitData.length > 0) {
      autoTable(pdf, {
        startY: yPos,
        head: [["SHA", "Author", "Message", "Date"]],
        body: commitData,
        margin: { left: margin, right: margin },
        styles: { fontSize: 8 },
        headStyles: { fillColor: [30, 64, 175] },
        columnStyles: {
          0: { cellWidth: 20, font: "courier" },
          1: { cellWidth: 30 },
          2: { cellWidth: 80 },
          3: { cellWidth: 25 }
        }
      });
      yPos = (pdf as any).lastAutoTable.finalY + 15;
    }
    setProgress(95);

    pdf.addPage();
    yPos = margin;
    addHeader("Module Dependencies", 18);
    addText("Import relationships showing how modules depend on each other:");
    yPos += 5;

    const depData = analysis.dependencies.slice(0, 100).map(d => [
      d.sourceModule.split("/").pop() || d.sourceModule,
      d.targetModule,
      d.importType || "import",
      (d.importedItems || []).slice(0, 3).join(", ") + (d.importedItems && d.importedItems.length > 3 ? "..." : "")
    ]);

    if (depData.length > 0) {
      autoTable(pdf, {
        startY: yPos,
        head: [["Source File", "Imports From", "Type", "Items"]],
        body: depData,
        margin: { left: margin, right: margin },
        styles: { fontSize: 8 },
        headStyles: { fillColor: [30, 64, 175] },
      });
    }

    setProgress(100);

    const fileName = `${analysis.repository.name}-documentation.pdf`;
    pdf.save(fileName);
    
    setIsComplete(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsComplete(false);
      setProgress(0);
    }, 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2" data-testid="button-export-pdf">
          <Download className="h-4 w-4" />
          Export PDF Documentation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Export Documentation
          </DialogTitle>
          <DialogDescription>
            Generate a comprehensive PDF document with detailed analysis of every function,
            file, and module in the repository.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2 text-sm">
            <p className="font-medium">The PDF will include:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Executive summary and statistics</li>
              <li>Complete folder structure</li>
              <li>All {analysis.stats.totalFiles} files with details</li>
              <li>All {analysis.stats.totalFunctions} functions with:</li>
              <ul className="list-disc list-inside ml-4">
                <li>What the function does</li>
                <li>How it helps the project</li>
                <li>Parameters and return types</li>
                <li>Location (file and line numbers)</li>
              </ul>
              <li>Git commit history</li>
              <li>Module dependency map</li>
            </ul>
          </div>

          {isGenerating && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Generating PDF...</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              {isComplete && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Download started!</span>
                </div>
              )}
            </div>
          )}

          <Button 
            onClick={generatePdf} 
            disabled={isGenerating}
            className="w-full"
            data-testid="button-generate-pdf"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate & Download PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
