import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { InfoRequest } from "@/types";
import { formatDate } from "@/lib/utils";
import { UserRole } from "@/types";

interface InfoRequestsProps {
  requests: InfoRequest[];
  canCreate: boolean;
  onCreateItem: () => void;
  userRole?: UserRole;
}

const InfoRequests = ({ requests, canCreate, onCreateItem, userRole }: InfoRequestsProps) => {
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  
  const toggleExpand = (id: string) => {
    setExpandedRequestId(expandedRequestId === id ? null : id);
  };
  
  const canAnswer = (status: string) => {
    return userRole === 'victim' && status === 'pending';
  };
  
  const handleAnswer = () => {
    // In a real implementation, this would open an answer form
    alert('This would open a form to answer the questions');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Information Requests</h3>
        {canCreate && (
          <Button size="sm" onClick={onCreateItem}>
            <Plus className="w-4 h-4 mr-1" /> Add Request
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
            <h3 className="mt-3 text-lg font-medium">No information requests</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
              {canCreate 
                ? "Create structured questions for the claimant to answer"
                : "No information has been requested"
              }
            </p>
            {canCreate && (
              <Button className="mt-4" size="sm" variant="outline" onClick={onCreateItem}>
                <Plus className="w-4 h-4 mr-1" /> Create Request
              </Button>
            )}
          </div>
        ) : (
          requests.map(request => (
            <div key={request.id} className="border rounded-md overflow-hidden">
              <div 
                className="p-3 bg-muted/30 flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(request.id)}
              >
                <div className="flex items-center gap-2">
                  {request.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  )}
                  <h4 className="font-medium">{request.title}</h4>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={request.status === 'completed' ? 'default' : 'outline'}>
                    {request.status === 'completed' ? 'Complete' : 'Pending'}
                  </Badge>
                </div>
              </div>
              
              {expandedRequestId === request.id && (
                <div className="p-4">
                  <div className="text-sm text-muted-foreground mb-3">
                    <p>Requested by: {request.requestedBy}</p>
                    <p>Date: {formatDate(request.requestedAt)}</p>
                    {request.completedAt && (
                      <p>Completed: {formatDate(request.completedAt)}</p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {request.questions.map((question, index) => (
                      <div key={index} className="border-l-2 border-primary/50 pl-3 py-1">
                        <p className="font-medium">Question {index + 1}:</p>
                        <p>{question}</p>
                        {request.answers && request.answers[index] && (
                          <div className="mt-2 bg-muted/40 p-2 rounded-md">
                            <p className="text-sm font-medium">Answer:</p>
                            <p className="text-sm">{request.answers[index]}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {canAnswer(request.status) && (
                    <div className="mt-4">
                      <Button onClick={handleAnswer} size="sm">
                        Provide Answers
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InfoRequests;

console.warn('InfoRequests.tsx contains type errors that need manual fixing');
