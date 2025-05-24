import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { CaseSilo, Assessment, Document, Report } from "@/types";
import { Milestone } from "./MilestoneTracker";

interface MsConfeeAssistantProps {
  caseData: CaseSilo | null;
  activeTab: string;
  milestones: Milestone[];
}

const MsConfeeAssistant: React.FC<MsConfeeAssistantProps> = ({
  caseData,
  activeTab,
  milestones
}) => {
  const [enabled, setEnabled] = useState(true);
  const [message, setMessage] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);

  // Generate AI assistant message based on the active tab and case data
  useEffect(() => {
    if (!caseData || !enabled) {
      setMessage("");
      return;
    }

    // Generate different messages based on the active tab
    switch(activeTab) {
      case "overview":
        generateOverviewMessage(caseData);
        break;
      case "documents":
        generateDocumentsMessage(caseData.documents);
        break;
      case "assessments":
        generateAssessmentsMessage(caseData.assessments);
        break;
      case "reports":
        generateReportsMessage(caseData.reports);
        break;
      case "notes":
        generateNotesMessage(caseData.notes);
        break;
      case "timeline":
        generateTimelineMessage(caseData, milestones);
        break;
      case "info-requests":
        generateInfoRequestsMessage(caseData.infoRequests);
        break;
      case "external":
        generateExternalUploadsMessage(caseData.externalUploads);
        break;
      default:
        setMessage("I'm here to help you navigate this case. What would you like to know?");
    }
  }, [caseData, activeTab, enabled, milestones]);

  const generateOverviewMessage = (caseData: CaseSilo) => {
    const injuryType = caseData.caseType;
    const categories = caseData.categoryTags ? caseData.categoryTags.join(", ") : "not specified";
    const documentCount = caseData.documents.length;
    const assessmentCount = caseData.assessments.length;
    const completedAssessments = caseData.assessments.filter(a => a.status === "completed").length;
    const reportCount = caseData.reports.length;
    
    let suggestion = "";
    if (documentCount === 0) {
      suggestion = "Should we request some medical records to support this claim?";
    } else if (assessmentCount === 0) {
      suggestion = "Would you like me to prepare an assessment for the client?";
    } else if (completedAssessments > 0 && reportCount === 0) {
      suggestion = "Should I prepare a draft psychological report based on the completed assessments?";
    } else {
      suggestion = "Is there anything specific you'd like me to help with on this case?";
    }

    setMessage(`
      I've looked at this ${injuryType} case for you. The client presents with categories including ${categories}. 
      
      You've got ${documentCount} document${documentCount !== 1 ? 's' : ''}, ${completedAssessments}/${assessmentCount} completed assessment${assessmentCount !== 1 ? 's' : ''}, and ${reportCount} report${reportCount !== 1 ? 's' : ''} in this case.
      
      ${suggestion}
    `);
  };

  const generateDocumentsMessage = (documents: Document[]) => {
    if (documents.length === 0) {
      setMessage("There are no documents uploaded for this case yet. Would you like me to prepare a document request template?");
      return;
    }

    const recentDocument = documents[0];
    const documentCount = documents.length;
    
    setMessage(`
      You have ${documentCount} document${documentCount !== 1 ? 's' : ''} in this case. 
      
      The most recent document is "${recentDocument.name}" uploaded by ${recentDocument.uploadedBy}.
      
      Would you like me to help you organize these documents or create a summary of their contents?
    `);
  };

  const generateAssessmentsMessage = (assessments: Assessment[]) => {
    if (assessments.length === 0) {
      setMessage("No assessments have been assigned to this client yet. Would you like me to recommend suitable assessment tools for this case type?");
      return;
    }

    const completedCount = assessments.filter(a => a.status === "completed").length;
    const inProgressCount = assessments.filter(a => a.status !== "completed").length;
    
    let suggestion = "";
    if (inProgressCount > 0) {
      suggestion = "Should I send a reminder to the client about the pending assessments?";
    } else if (completedCount > 0) {
      suggestion = "Would you like me to generate a preliminary analysis of the assessment results?";
    }

    setMessage(`
      I see ${completedCount} completed and ${inProgressCount} pending assessments for this client.
      
      ${suggestion}
    `);
  };

  const generateReportsMessage = (reports: Report[]) => {
    if (reports.length === 0) {
      setMessage("There are no reports created for this case yet. Should I prepare a report template based on the case information and assessments?");
      return;
    }

    const completedReports = reports.filter(r => r.status === "completed").length;
    const draftReports = reports.filter(r => r.status !== "completed").length;
    
    setMessage(`
      You have ${completedReports} finalized and ${draftReports} draft reports for this case.
      
      Would you like me to help review the draft reports or suggest additional sections based on the latest assessments?
    `);
  };

  const generateNotesMessage = (notes: any[]) => {
    if (notes.length === 0) {
      setMessage("No case notes have been added yet. Would you like me to create a template for session notes?");
      return;
    }

    const recentNote = notes[0];
    const noteCount = notes.length;
    
    setMessage(`
      There are ${noteCount} case notes recorded.
      
      The most recent note was added by ${recentNote.createdBy} on ${new Date(recentNote.createdAt).toLocaleDateString()}.
      
      Would you like me to summarize the key themes across all notes for quick reference?
    `);
  };

  const generateTimelineMessage = (caseData: CaseSilo, milestones: Milestone[]) => {
    const milestoneCount = milestones.length;
    const days = Math.floor((new Date().getTime() - new Date(caseData.createdDate).getTime()) / (1000 * 3600 * 24));
    
    setMessage(`
      This case has been active for ${days} days with ${milestoneCount} key milestones recorded.
      
      Would you like me to identify any potential gaps in the timeline that might need addressing?
    `);
  };

  const generateInfoRequestsMessage = (requests: any[]) => {
    if (!requests || requests.length === 0) {
      setMessage("There are no information requests for this case. Would you like me to create a template request for additional client information?");
      return;
    }

    const pendingRequests = requests.filter(r => r.status === "pending").length;
    
    setMessage(`
      You have ${requests.length} information request${requests.length !== 1 ? 's' : ''} with ${pendingRequests} still pending response.
      
      Should I draft a follow-up message for the outstanding requests?
    `);
  };

  const generateExternalUploadsMessage = (uploads: any[]) => {
    if (!uploads || uploads.length === 0) {
      setMessage("No external documents have been uploaded. Would you like me to prepare a secure upload link for external parties?");
      return;
    }
    
    setMessage(`
      There are ${uploads.length} external document${uploads.length !== 1 ? 's' : ''} uploaded to this case.
      
      Would you like me to organize these into categories or prepare a summary for your review?
    `);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // Add user message to chat history
    setChatHistory(prev => [...prev, { role: 'user', content: userInput }]);
    
    // Generate AI response based on user input
    let response = "";
    const input = userInput.toLowerCase();
    
    if (input.includes('report') || input.includes('draft')) {
      response = "I can help you prepare a psychological report draft. Based on the completed assessments, I'll include sections on background, assessment findings, and recommendations. Would you like me to start with a specific format?";
    } else if (input.includes('assessment') || input.includes('test')) {
      response = "I can recommend suitable assessments for this case type. Given the workplace injury and trauma categories, tools like PCL-5 for PTSD screening or DASS-21 for general psychological distress would be appropriate. Should I prepare an assessment plan?";
    } else if (input.includes('document') || input.includes('record')) {
      response = "I can help organize the case documents or suggest additional records that might be needed. Would you like me to create a document request template or review what's currently available?";
    } else if (input.includes('timeline') || input.includes('milestone')) {
      response = "I can help track case milestones and identify any gaps in the treatment timeline. Should I highlight the key dates or suggest next steps for case progression?";
    } else {
      response = "I'm here to assist with all aspects of this case. I can help with report writing, assessment planning, document organization, or case strategy. What specific area would you like to focus on?";
    }
    
    // Add AI response to chat history
    setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    
    // Clear input
    setUserInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!enabled) {
    return (
      <Card className="fixed top-20 right-4 w-64 bg-background/70 backdrop-blur-sm shadow-lg border border-primary/10 z-10">
        <CardHeader className="pb-2 pt-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center">
              <span className="mr-2">👩🏻‍💻</span> Ms Confee
            </CardTitle>
            <Switch 
              checked={enabled} 
              onCheckedChange={setEnabled} 
              size="sm"
            />
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="fixed top-20 right-4 w-80 bg-background/70 backdrop-blur-sm shadow-lg border border-primary/10 z-10">
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center">
            <span className="mr-2">👩🏻‍💻</span> Ms Confee
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="ms-confee-toggle" className="sr-only">Enable Ms Confee</Label>
            <Switch 
              id="ms-confee-toggle"
              checked={enabled} 
              onCheckedChange={setEnabled} 
              size="sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Main AI message */}
        <div className="mb-3">
          {message.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-xs mb-2 leading-relaxed">
              {paragraph.trim()}
            </p>
          ))}
        </div>
        
        {/* Chat history */}
        {chatHistory.length > 0 && (
          <div className="max-h-32 overflow-y-auto mb-3 space-y-2 border-t border-muted pt-2">
            {chatHistory.slice(-4).map((chat, i) => (
              <div key={i} className={`text-xs ${chat.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-2 rounded-lg max-w-full ${
                  chat.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {chat.content}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Interactive input */}
        <div className="flex gap-2 mt-3">
          <Input
            placeholder="Ask Ms Confee..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-xs h-8 flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            size="sm" 
            className="h-8 w-8 p-0"
            disabled={!userInput.trim()}
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MsConfeeAssistant;
