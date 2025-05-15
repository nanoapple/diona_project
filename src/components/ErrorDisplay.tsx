
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay = ({ message, onRetry }: ErrorDisplayProps) => {
  return (
    <div className="text-center py-12">
      <AlertCircle className="h-12 w-12 mx-auto text-destructive opacity-50" />
      <h3 className="mt-4 text-lg font-medium">Error</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
        {message}
      </p>
      {onRetry && (
        <Button className="mt-4" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorDisplay;
