
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

interface SegmentedProgressProps {
  stages: {
    title: string
    description: string
    complete: boolean
    active?: boolean
    tasks?: Array<{
      description: string
      complete: boolean
    }>
  }[]
  className?: string
  currentStage: number
}

const SegmentedProgress = ({
  stages,
  className,
  currentStage,
}: SegmentedProgressProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex w-full justify-between mb-2">
        {stages.map((stage, index) => (
          <div 
            key={index} 
            className={cn(
              "flex flex-col items-center relative z-10",
              index < currentStage ? "text-primary" : 
              index === currentStage ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                index < currentStage ? "bg-primary text-primary-foreground" : 
                index === currentStage ? "border-2 border-primary bg-background" : "border border-muted-foreground bg-background"
              )}
            >
              {index < currentStage ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span className="text-sm">{index + 1}</span>
              )}
            </div>
            <span className="text-xs font-medium text-center max-w-[80px]">{stage.title}</span>
          </div>
        ))}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0">
          <div 
            className="h-full bg-primary transition-all" 
            style={{ 
              width: `${currentStage > 0 ? (currentStage / (stages.length - 1)) * 100 : 0}%`
            }}
          />
        </div>
      </div>

      <div className="mt-4 p-4 border rounded-md bg-background">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">{stages[currentStage].title}</h4>
          <span className="text-xs text-muted-foreground">Stage {currentStage + 1} of {stages.length}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{stages[currentStage].description}</p>
        
        {stages[currentStage].tasks && stages[currentStage].tasks.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Tasks:</h5>
            {stages[currentStage].tasks.map((task, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className={cn(
                  "w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center",
                  task.complete ? "bg-primary border-primary" : "border-muted-foreground"
                )}>
                  {task.complete && <CheckCircle className="h-3 w-3 text-primary-foreground" />}
                </div>
                <span className={cn(
                  "text-sm",
                  task.complete ? "line-through text-muted-foreground" : ""
                )}>
                  {task.description}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { Progress, SegmentedProgress }
