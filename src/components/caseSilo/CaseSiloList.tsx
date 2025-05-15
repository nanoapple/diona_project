
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  ClipboardCheck, 
  Book, 
  MessageSquare, 
  Archive,
  AlertCircle,
  Clock
} from "lucide-react";
import { CaseSilo, CaseSiloStatus } from "@/types";
import { formatDate } from '@/lib/utils';

interface CaseSiloListProps {
  caseSilos: CaseSilo[];
  searchTerm: string;
  onSelectCase: (id: string) => void;
}

const CaseSiloList = ({ caseSilos, searchTerm, onSelectCase }: CaseSiloListProps) => {
  const getCaseProgress = (caseData: CaseSilo) => {
    // Calculate progress based on completed stages
    const allStages = [
      'Intake & Triage', 
      'Legal Review', 
      'Assessment', 
      'Report', 
      'Lodgement', 
      'Outcome'
    ];
    
    const completedCount = caseData.completedStages?.length || 0;
    return Math.round((completedCount / allStages.length) * 100);
  };

  // Get status display details
  const getStatusDetails = (status: CaseSiloStatus) => {
    switch(status) {
      case 'active':
        return {
          label: "Active",
          variant: "default" as const,
          icon: null
        };
      case 'expiring_soon':
        return {
          label: "Expiring Soon",
          variant: "warning" as const,
          icon: <Clock className="w-3 h-3 mr-1" />
        };
      case 'expired':
        return {
          label: "Expired",
          variant: "destructive" as const,
          icon: <AlertCircle className="w-3 h-3 mr-1" />
        };
    }
  };

  if (caseSilos.length === 0) {
    return (
      <div className="text-center py-12">
        <Archive className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No cases found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {searchTerm ? "Try adjusting your search terms" : "No cases are available at this time"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {caseSilos.map(caseSilo => {
        const statusDetails = getStatusDetails(caseSilo.status);
        
        return (
          <Card 
            key={caseSilo.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectCase(caseSilo.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="flex-1 truncate">{caseSilo.claimantName}</CardTitle>
                <Badge variant={statusDetails.variant} className="flex items-center whitespace-nowrap ml-2">
                  {statusDetails.icon}
                  {statusDetails.label}
                </Badge>
              </div>
              <CardDescription className="flex flex-col">
                <span>{caseSilo.caseType}</span>
                {caseSilo.claimNumber && (
                  <span className="text-xs">Claim #{caseSilo.claimNumber}</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(caseSilo.createdDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Stage:</span>
                  <span>{caseSilo.currentStage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires:</span>
                  <span>{formatDate(caseSilo.expiryDate)}</span>
                </div>
                
                <div className="mt-3 mb-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{getCaseProgress(caseSilo)}%</span>
                  </div>
                  <div className="w-full bg-muted h-1.5 rounded-full">
                    <div 
                      className="bg-primary h-1.5 rounded-full" 
                      style={{ width: `${getCaseProgress(caseSilo)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="flex flex-col items-center p-1 bg-muted/30 rounded">
                    <FileText className="w-4 h-4 text-muted-foreground mb-1" />
                    <span className="text-xs">{caseSilo.documents.length} docs</span>
                  </div>
                  <div className="flex flex-col items-center p-1 bg-muted/30 rounded">
                    <ClipboardCheck className="w-4 h-4 text-muted-foreground mb-1" />
                    <span className="text-xs">{caseSilo.assessments.length} assess.</span>
                  </div>
                  <div className="flex flex-col items-center p-1 bg-muted/30 rounded">
                    <Book className="w-4 h-4 text-muted-foreground mb-1" />
                    <span className="text-xs">{caseSilo.reports.length} reports</span>
                  </div>
                  <div className="flex flex-col items-center p-1 bg-muted/30 rounded">
                    <MessageSquare className="w-4 h-4 text-muted-foreground mb-1" />
                    <span className="text-xs">{caseSilo.notes.length} notes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CaseSiloList;
