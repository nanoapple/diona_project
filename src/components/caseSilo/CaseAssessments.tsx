
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Plus } from "lucide-react";
import { Assessment } from "@/types";
import { formatDate } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DASS21Assessment } from "@/components/assessments/DASS21Assessment";
import { AssessmentResults } from "@/components/assessments/AssessmentResults";
import { AddAssessmentDialog } from "@/components/assessments/AddAssessmentDialog";

interface CaseAssessmentsProps {
  assessments: Assessment[];
  canAdd: boolean;
  onCreateItem: () => void;
}

const CaseAssessments = ({ assessments, canAdd, onCreateItem }: CaseAssessmentsProps) => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<any>(null);

  const handleCreateAssessment = () => {
    setAddDialogOpen(true);
  };

  const handleAssessmentClick = (assessment: Assessment) => {
    // For completed assessments, show results
    if (assessment.status === "completed" && assessment.results) {
      setActiveAssessment(assessment);
      setAssessmentResults(assessment.results);
      setShowResults(true);
    } else {
      // For in-progress or not started assessments, open the assessment
      setActiveAssessment(assessment);
      setShowResults(false);
    }
  };

  const handleAssessmentComplete = (results: any) => {
    if (!activeAssessment) return;
    
    // In a real app, we would update the assessment in the database
    setAssessmentResults(results);
    setShowResults(true);
    
    onCreateItem(); // Notify parent component that an assessment was completed
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Assessments</h3>
        {canAdd && (
          <Button size="sm" onClick={handleCreateAssessment}>
            <Plus className="w-4 h-4 mr-1" /> Add/Assign Assessment
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
              <Button className="mt-4" size="sm" variant="outline" onClick={handleCreateAssessment}>
                <Plus className="w-4 h-4 mr-1" /> Add Assessment
              </Button>
            )}
          </div>
        ) : (
          assessments.map(assessment => (
            <div 
              key={assessment.id} 
              className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
              onClick={() => handleAssessmentClick(assessment)}
            >
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

      {/* Add/Assign Assessment Dialog */}
      <AddAssessmentDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddAssessment={(assessment) => {
          onCreateItem(); // Notify parent component
          setAddDialogOpen(false);
        }}
        clientName="John Doe"
        clientInfo={{
          gender: "Male",
          age: 42,
          caseNumber: "WC2023-12345",
          sessionNumber: 3
        }}
      />

      {/* Active Assessment Dialog */}
      {activeAssessment && !showResults && (
        <Dialog 
          open={!!activeAssessment && !showResults} 
          onOpenChange={(open) => !open && setActiveAssessment(null)}
        >
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DASS21Assessment 
              assessment={activeAssessment} 
              onComplete={handleAssessmentComplete}
              onCancel={() => setActiveAssessment(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Assessment Results Dialog */}
      {activeAssessment && showResults && assessmentResults && (
        <Dialog 
          open={showResults} 
          onOpenChange={(open) => {
            if (!open) {
              setShowResults(false);
              setActiveAssessment(null);
              setAssessmentResults(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[800px]">
            <AssessmentResults 
              assessment={activeAssessment}
              results={assessmentResults}
              onClose={() => {
                setShowResults(false);
                setActiveAssessment(null);
                setAssessmentResults(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CaseAssessments;
