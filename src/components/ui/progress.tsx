
import * as React from "react";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: number;
    max?: number;
    complete?: boolean;
  }
>(({ className, value, max = 100, complete = false, ...props }, ref) => {
  const percentage = (value / max) * 100;
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full flex-1 bg-primary transition-all",
          complete ? "bg-green-600" : ""
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
});
Progress.displayName = "Progress";

export interface TaskItem {
  description: string;
  complete: boolean;
}

export interface ProgressStage {
  title: string;
  description: string;
  complete?: boolean;
  active?: boolean;
  tasks: TaskItem[];
}

interface SegmentedProgressProps {
  stages: ProgressStage[];
  currentStage: number;
}

const SegmentedProgress = ({
  stages,
  currentStage
}: SegmentedProgressProps) => {
  const [expandedStage, setExpandedStage] = React.useState<number>(currentStage);
  
  return (
    <div className="space-y-8">
      <div className="flex items-center w-full justify-between">
        {stages.map((stage, index) => {
          const isComplete = index < currentStage;
          const isActive = index === currentStage;
          
          return (
            <div key={index} className="flex flex-col items-center relative">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white",
                  isComplete ? "bg-green-600" : isActive ? "bg-blue-600" : "bg-gray-300"
                )}
              >
                {isComplete ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="text-xs text-center mt-2 font-medium max-w-[80px]">
                {stage.title}
              </div>
              {index < stages.length - 1 && (
                <div 
                  className={cn(
                    "absolute h-0.5 top-5 -right-full w-full",
                    isComplete ? "bg-green-600" : "bg-gray-300"
                  )}
                  style={{ width: "calc(100% - 10px)", left: "calc(50% + 5px)" }}
                />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div
            key={index}
            className={cn(
              "border rounded-lg overflow-hidden",
              expandedStage === index ? "border-primary" : "border-muted"
            )}
          >
            <div 
              className={cn(
                "p-4 flex justify-between items-center cursor-pointer",
                expandedStage === index ? "bg-muted/50" : ""
              )}
              onClick={() => setExpandedStage(index)}
            >
              <div>
                <h3 className="font-medium">{stage.title}</h3>
                <p className="text-sm text-muted-foreground">{stage.description}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                {index < currentStage ? "Completed" : 
                 index === currentStage ? "In Progress" : "Pending"}
              </div>
            </div>
            
            {expandedStage === index && stage.tasks.length > 0 && (
              <div className="px-4 pb-4 pt-2 border-t border-muted">
                <h4 className="text-sm font-medium mb-2">Tasks</h4>
                <ul className="space-y-2">
                  {stage.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-start gap-2">
                      <div className={cn(
                        "mt-0.5 w-4 h-4 rounded-full flex items-center justify-center",
                        task.complete ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                      )}>
                        {task.complete ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-current" />
                        )}
                      </div>
                      <span className={cn(
                        "text-sm",
                        task.complete ? "line-through text-muted-foreground" : ""
                      )}>
                        {task.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { Progress, SegmentedProgress };
