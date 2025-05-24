
import * as React from "react";
import { cn } from "@/lib/utils";

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
  const getStatusColor = (status: string) => {
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
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-sm"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
          <span>Not Started</span>
        </div>
      </div>
    </div>
  );
});

SegmentedReportProgress.displayName = "SegmentedReportProgress";

export { SegmentedReportProgress };
