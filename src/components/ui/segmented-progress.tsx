
import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

export interface ReportSection {
  id: number;
  title: string;
  status: 'completed' | 'in-progress' | 'not-started';
}

interface SegmentedReportProgressProps {
  sections: ReportSection[];
  title: string;
  className?: string;
}

const SegmentedReportProgress = React.forwardRef<
  HTMLDivElement,
  SegmentedReportProgressProps
>(({ sections, title, className, ...props }, ref) => {
  const { theme } = useTheme();
  
  const getStatusColor = (status: string) => {
    if (theme === 'e-ink') {
      switch (status) {
        case 'completed':
          return 'bg-[hsl(217,2%,65%)]';
        case 'in-progress':
          return 'bg-[hsl(45,2%,75%)]';
        case 'not-started':
          return 'bg-[hsl(0,0%,85%)]';
        default:
          return 'bg-[hsl(0,0%,85%)]';
      }
    }
    
    switch (status) {
      case 'completed':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'not-started':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'not-started':
        return 'Not Started';
      default:
        return 'Not Started';
    }
  };

  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">
          {sections.filter(s => s.status === 'completed').length} of {sections.length} sections
        </span>
      </div>
      
      <div className="flex gap-1">
        {sections.map((section) => (
          <div
            key={section.id}
            className={cn(
              "h-2 flex-1 rounded-sm transition-colors",
              getStatusColor(section.status)
            )}
            title={`Section ${section.id}: ${section.title} - ${getStatusLabel(section.status)}`}
          />
        ))}
      </div>
    </div>
  );
});

SegmentedReportProgress.displayName = "SegmentedReportProgress";

export { SegmentedReportProgress };
