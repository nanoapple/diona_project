
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CaseSilo } from "@/types";
import { formatDate } from "@/lib/utils";
import { FileText, ClipboardCheck, Book, MessageSquare } from "lucide-react";

interface CaseOverviewProps {
  caseData: CaseSilo;
}

const CaseOverview = ({ caseData }: CaseOverviewProps) => {
  const getCaseProgress = (caseData: CaseSilo) => {
    // Calculate progress based on documents, assessments and reports
    const totalItems = 
      caseData.documents.length + 
      caseData.assessments.length + 
      caseData.reports.length;
    
    // Count completed items
    const completedAssessments = caseData.assessments.filter(a => a.status === 'completed').length;
    const completedReports = caseData.reports.filter(r => r.status === 'completed').length;
    
    // Documents are always considered "completed" once uploaded
    const completedItems = caseData.documents.length + completedAssessments + completedReports;
    
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const renderTimelineItem = (item: any, type: string) => {
    const getIcon = () => {
      switch (type) {
        case 'document': return <FileText className="w-4 h-4" />;
        case 'assessment': return <ClipboardCheck className="w-4 h-4" />;
        case 'report': return <Book className="w-4 h-4" />;
        case 'note': return <MessageSquare className="w-4 h-4" />;
        default: return <FileText className="w-4 h-4" />;
      }
    };

    return (
      <div key={item.id} className="flex gap-3 mb-4 relative">
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 shrink-0">
          {getIcon()}
        </div>
        <div className="relative pb-8 border-l border-muted ml-4 pl-4 -mt-2">
          <h4 className="text-sm font-medium">{type === 'note' ? 'Case Note Added' : item.name || item.title}</h4>
          <p className="text-xs text-muted-foreground">
            {type === 'document' || type === 'external' 
              ? `Uploaded by ${item.uploadedBy}`
              : type === 'note' 
                ? item.content.substring(0, 50) + (item.content.length > 50 ? '...' : '')
                : item.description || ''}
          </p>
          <span className="text-xs text-muted-foreground absolute top-0 right-0">
            {formatDate(item.uploadDate || item.date || item.createdAt)}
          </span>
        </div>
      </div>
    );
  };

  // Get participant name by role
  const getParticipantName = (role: string) => {
    switch(role) {
      case 'lawyer':
        return "Lawyer Name";
      case 'psychologist':
        return "Psychologist Name";
      case 'caseManager':
        return "Case Manager Name";
      default:
        return `${role} Name`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Case Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between p-2 bg-muted/20 rounded-md">
              <span className="font-medium">Case Type</span>
              <span>{caseData.caseType}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted/20 rounded-md">
              <span className="font-medium">Status</span>
              <Badge variant={caseData.status === "active" ? "default" : "outline"}>
                {caseData.status === "active" ? "Active" : "Expired"}
              </Badge>
            </div>
            <div className="flex justify-between p-2 bg-muted/20 rounded-md">
              <span className="font-medium">Created</span>
              <span>{formatDate(caseData.createdDate)}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted/20 rounded-md">
              <span className="font-medium">Expiry</span>
              <span>{formatDate(caseData.expiryDate)}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted/20 rounded-md">
              <span className="font-medium">Case Progress</span>
              <span>{getCaseProgress(caseData)}%</span>
            </div>
            {caseData.categoryTags && caseData.categoryTags.length > 0 && (
              <div className="p-2 bg-muted/20 rounded-md">
                <span className="font-medium">Categories</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {caseData.categoryTags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Key Participants</h3>
          <div className="space-y-3">
            <div className="p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">C</div>
                <div>
                  <p className="font-medium">{caseData.claimantName}</p>
                  <p className="text-xs text-muted-foreground">Claimant</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">L</div>
                <div>
                  <p className="font-medium">Lawyer Name</p>
                  <p className="text-xs text-muted-foreground">Legal Representative</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">P</div>
                <div>
                  <p className="font-medium">Psychologist Name</p>
                  <p className="text-xs text-muted-foreground">Clinical Psychologist</p>
                </div>
              </div>
            </div>
            
            {/* External contributors */}
            {caseData.participants?.others && caseData.participants.others.length > 0 && 
              caseData.participants.others.map((contributor, index) => (
                <div key={contributor.id} className="p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                      {contributor.role.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{contributor.email.split('@')[0]}</p>
                      <p className="text-xs text-muted-foreground">{contributor.role}</p>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Case Activity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <FileText className="w-4 h-4 mr-1 text-primary" /> 
                <h4 className="text-sm font-medium">Documents</h4>
              </div>
              <div className="text-2xl font-bold">{caseData.documents.length}</div>
              <p className="text-xs text-muted-foreground">files uploaded</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <ClipboardCheck className="w-4 h-4 mr-1 text-primary" />
                <h4 className="text-sm font-medium">Assessments</h4>
              </div>
              <div className="text-2xl font-bold">{caseData.assessments.length}</div>
              <p className="text-xs text-muted-foreground">
                {caseData.assessments.filter(a => a.status === 'completed').length} completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Book className="w-4 h-4 mr-1 text-primary" />
                <h4 className="text-sm font-medium">Reports</h4>
              </div>
              <div className="text-2xl font-bold">{caseData.reports.length}</div>
              <p className="text-xs text-muted-foreground">
                {caseData.reports.filter(r => r.status === 'completed').length} finalized
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <MessageSquare className="w-4 h-4 mr-1 text-primary" />
                <h4 className="text-sm font-medium">Notes</h4>
              </div>
              <div className="text-2xl font-bold">{caseData.notes.length}</div>
              <p className="text-xs text-muted-foreground">case notes</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
        <div className="space-y-4">
          {caseData.notes.length > 0 && renderTimelineItem(caseData.notes[0], 'note')}
          {caseData.documents.length > 0 && renderTimelineItem(caseData.documents[0], 'document')}
          {caseData.assessments.length > 0 && renderTimelineItem(caseData.assessments[0], 'assessment')}
        </div>
      </div>
    </div>
  );
};

export default CaseOverview;
