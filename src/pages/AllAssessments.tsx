import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AssessmentScaleSelector } from "@/components/assessments/AssessmentScaleSelector";
import { useNavigate } from "react-router-dom";

interface AssessmentScale {
  id: string;
  name: string;
  category: string;
  description: string;
  specialty?: string;
  questions?: number;
}

export default function AllAssessments() {
  const navigate = useNavigate();

  const handleSelectScale = (scale: AssessmentScale) => {
    console.log("Selected scale:", scale);
    // Handle scale selection - could navigate to assessment or show in modal
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/assessments")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessments
          </Button>
          <h1 className="text-2xl font-bold">All Assessment Scales</h1>
        </div>
      </div>

      {/* Content - Fill remaining space */}
      <div className="flex-1 p-4">
        <AssessmentScaleSelector
          open={true}
          onOpenChange={undefined} // Page mode - no dialog wrapper
          onSelectScale={handleSelectScale}
        />
      </div>
    </div>
  );
}