import { Folder, FileText, Code, GitCommit, Hash, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { RepositoryStats } from "@shared/schema";

interface StatsDashboardProps {
  stats: RepositoryStats;
}

export function StatsDashboard({ stats }: StatsDashboardProps) {
  const statCards = [
    {
      title: "Folders",
      value: stats.totalFolders,
      icon: Folder,
      color: "text-amber-500",
    },
    {
      title: "Files",
      value: stats.totalFiles,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Functions",
      value: stats.totalFunctions,
      icon: Code,
      color: "text-green-500",
    },
    {
      title: "Commits",
      value: stats.totalCommits,
      icon: GitCommit,
      color: "text-purple-500",
    },
    {
      title: "Lines of Code",
      value: stats.totalLines,
      icon: Hash,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} data-testid={`card-stat-${stat.title.toLowerCase()}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-semibold tabular-nums">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Languages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.languages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No languages detected</p>
            ) : (
              stats.languages.map((lang) => (
                <div key={lang.language} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{lang.language}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {lang.count} files ({lang.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={lang.percentage} className="h-2" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              File Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.fileTypes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No file types detected</p>
            ) : (
              stats.fileTypes.map((type) => (
                <div key={type.type} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{type.type || "other"}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {type.count} files
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
