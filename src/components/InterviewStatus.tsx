
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

type InterviewStatusProps = {
  caseId: string;
  interviewStatus: {
    isStarted: boolean;
    isCompleted: boolean;
    progressPercentage: number;
    lastUpdated: string;
  };
};

const InterviewStatus = ({ caseId, interviewStatus }: InterviewStatusProps) => {
  const { currentUser } = useAuth();
  const isClaimant = currentUser?.role === 'victim';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Self-Guided Interview</span>
          {interviewStatus.isCompleted && (
            <Badge variant="success" className="bg-emerald-600">
              <CheckCircle className="h-3 w-3 mr-1" /> Completed
            </Badge>
          )}
          {!interviewStatus.isCompleted && interviewStatus.isStarted && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              In Progress
            </Badge>
          )}
          {!interviewStatus.isStarted && (
            <Badge variant="outline">Not Started</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {interviewStatus.isStarted && !interviewStatus.isCompleted && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{Math.round(interviewStatus.progressPercentage)}%</span>
            </div>
            <Progress value={interviewStatus.progressPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">
              Last updated: {interviewStatus.lastUpdated}
            </div>
          </div>
        )}

        <div className="text-sm">
          {interviewStatus.isCompleted ? (
            <p>
              The interview has been completed and the responses are available for review.
            </p>
          ) : interviewStatus.isStarted ? (
            <p>
              The interview is in progress. {isClaimant && "You can continue from where you left off."}
            </p>
          ) : (
            <p>
              {isClaimant ? "You haven't started the self-guided interview yet." : "The claimant hasn't started the self-guided interview yet."}
            </p>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          {isClaimant ? (
            <Button 
              as={Link} 
              to={`/interview/${caseId}`}
              className="flex items-center gap-2"
            >
              {interviewStatus.isStarted ? "Continue Interview" : "Start Interview"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              as={Link} 
              to={`/interview/${caseId}`}
              variant="outline"
            >
              View Interview
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewStatus;
