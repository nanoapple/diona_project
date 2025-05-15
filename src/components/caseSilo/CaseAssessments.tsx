
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Plus } from "lucide-react";
import { Assessment } from "@/types";
import { formatDate } from "@/lib/utils";

interface CaseAssessmentsProps {
  assessments: Assessment[];
  canAdd: boolean;
  onCreateItem: () => void;
}

const CaseAssessments = ({ assessments, canAdd, onCreateItem }: CaseAssessmentsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Assessments</h3>
        {canAdd && (
          <Button size="sm" onClick={onCreateItem}>
            <Plus className="w-4 h-4 mr-1" /> Add Assessment
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {assessments.length === 0 ? (
          <div className="text-center py-8">
            <ClipboardCheck className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
            <h3 className="mt-3 text-lg font-medium">No assessments</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
              {canAdd 
                ? "Create assessments for the client to complete"
                : "No assessments have been assigned yet"
              }
            </p>
            {canAdd && (
              <Button className="mt-4" size="sm" variant="outline" onClick={onCreateItem}>
                <Plus className="w-4 h-4 mr-1" /> Create Assessment
              </Button>
            )}
          </div>
        ) : (
          assessments.map(assessment => (
            <div key={assessment.id} className="p-3 border rounded-md">
              <div className="flex items-center justify-between">
                <p className="font-medium">{assessment.title}</p>
                <Badge variant={assessment.status === "completed" ? "default" : "outline"}>
                  {assessment.status === "completed" ? "Completed" : "In Progress"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{assessment.description}</p>
              <div className="mt-2 text-sm">
                <div className="bg-muted h-2 rounded-full mt-1">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${assessment.completionPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Completion: {assessment.completionPercentage}%</span>
                  <span>Date: {formatDate(assessment.date)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CaseAssessments;
