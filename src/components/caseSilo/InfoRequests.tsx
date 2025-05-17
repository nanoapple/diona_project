
// Fix the comparison with UserRole
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle, Clock, AlertCircle, MessageSquare } from "lucide-react";
import { InfoRequest } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { UserRole } from "@/types";

interface InfoRequestsProps {
  requests: InfoRequest[];
  canCreate: boolean;
  onCreateItem: () => void;
  userRole?: UserRole;
}

const InfoRequests = ({ requests, canCreate, onCreateItem, userRole }: InfoRequestsProps) => {
  // Fixed TypeScript issue: Use proper UserRole type instead of string literal
  const isClaimant = userRole === "claimant";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Information Requests</h3>
        {canCreate && (
          <Button size="sm" onClick={onCreateItem}>
            <PlusCircle className="w-4 h-4 mr-1" /> New Request
          </Button>
        )}
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
          <h3 className="mt-3 text-lg font-medium">No information requests</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
            {canCreate 
              ? "Create requests for additional information from clients"
              : "No requests have been made yet"
            }
          </p>
          {canCreate && (
            <Button className="mt-4" size="sm" variant="outline" onClick={onCreateItem}>
              <PlusCircle className="w-4 h-4 mr-1" /> New Request
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <Card key={request.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{request.title}</CardTitle>
                  <Badge 
                    variant={
                      request.status === "completed" ? "default" : 
                      request.status === "pending" ? "secondary" : "outline"
                    }
                    className="ml-2"
                  >
                    {request.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {request.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                    {request.status === "failed" && <AlertCircle className="w-3 h-3 mr-1" />}
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription>
                  Requested by {request.requestedBy} on {formatDate(request.requestedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {request.questions.map((question, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="min-w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mt-0.5">
                        {idx + 1}
                      </div>
                      <p>{question}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                {isClaimant && request.status === "pending" && (
                  <Button size="sm" className="ml-auto">
                    Respond to Request
                  </Button>
                )}
                {!isClaimant && (
                  <Button size="sm" variant="outline" className="ml-auto">
                    View Details
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InfoRequests;
