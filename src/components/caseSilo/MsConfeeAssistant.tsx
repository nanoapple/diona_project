
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Send, MessageCircle } from "lucide-react";
import { CaseSilo } from "@/types";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
}

const getAiResponse = (message: string, caseData: CaseSilo, activeTab: string, milestones: Milestone[]) => {
  const lowerCaseMessage = message.toLowerCase();

  if (lowerCaseMessage.includes("summary") || lowerCaseMessage.includes("overview")) {
    return `Here's a quick summary of the case:\n- Claimant: ${caseData.claimantName}\n- Case Type: ${caseData.caseType}\n- Current Stage: ${caseData.currentStage}`;
  }

  if (lowerCaseMessage.includes("documents")) {
    return `There are ${caseData.documents?.length || 0} documents in this case.`;
  }

  if (lowerCaseMessage.includes("assessments")) {
    return `There are ${caseData.assessments?.length || 0} assessments in this case.`;
  }

  if (lowerCaseMessage.includes("reports")) {
    return `There are ${caseData.reports?.length || 0} reports in this case.`;
  }

  if (lowerCaseMessage.includes("notes")) {
    return `There are ${caseData.notes?.length || 0} notes in this case.`;
  }

  if (lowerCaseMessage.includes("timeline")) {
    return `Navigating to the timeline tab.`;
  }

  if (lowerCaseMessage.includes("info requests")) {
    return `There are ${caseData.infoRequests?.length || 0} info requests in this case.`;
  }

  if (lowerCaseMessage.includes("external uploads")) {
    return `There are ${caseData.externalUploads?.length || 0} external uploads in this case.`;
  }

  if (lowerCaseMessage.includes("milestones")) {
    return `There are ${milestones?.length || 0} milestones in this case.`;
  }

  if (lowerCaseMessage.includes("help")) {
    return `I can provide summaries, tell you about documents, assessments, reports, notes, and more. Just ask!`;
  }

  return "I'm sorry, I didn't understand your request. Please try again.";
};

interface MsConfeeAssistantProps {
  caseData: CaseSilo;
  activeTab: string;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  type: string;
  title: string;
  date: string;
  description: string;
  status: string;
  relatedItemId?: string;
}

const MsConfeeAssistant = ({ caseData, activeTab, milestones }: MsConfeeAssistantProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isAssistantEnabled, setIsAssistantEnabled] = useState(true);

  // Generate summary based on active tab
  const getSummary = () => {
    switch (activeTab) {
      case 'overview':
        return `This is a ${caseData.caseType} case for ${caseData.claimantName}. Current stage: ${caseData.currentStage}. The case involves categories like ${caseData.categoryTags?.join(', ')}. Should I prepare a comprehensive case analysis?`;
      
      case 'documents':
        const docCount = caseData.documents?.length || 0;
        return `There are ${docCount} documents in this case, including assessment reports and medical records. All documents are properly organized and accessible. Would you like me to help categorize or review any specific documents?`;
      
      case 'assessments':
        const assessmentCount = caseData.assessments?.length || 0;
        const completedAssessments = caseData.assessments?.filter(a => a.status === 'completed').length || 0;
        return `${completedAssessments} of ${assessmentCount} assessments have been completed. The client has made good progress through the assessment process. Should I recommend additional assessment tools?`;
      
      case 'reports':
        const reportCount = caseData.reports?.length || 0;
        const completedReports = caseData.reports?.filter(r => r.status === 'completed').length || 0;
        return `${completedReports} of ${reportCount} reports are complete. The psychological findings show clear patterns consistent with the injury type. Would you like me to draft a summary report?`;
      
      case 'notes':
        const noteCount = caseData.notes?.length || 0;
        return `There are ${noteCount} case notes documenting the client's progress and key sessions. The therapeutic relationship is developing well with consistent attendance. Should I highlight key therapeutic milestones?`;
      
      case 'timeline':
        return `The case timeline shows steady progress from intake through current assessments. Key milestones have been achieved on schedule. Would you like me to identify any potential delays or accelerate certain processes?`;
      
      case 'info-requests':
        const requestCount = caseData.infoRequests?.length || 0;
        return `There are ${requestCount} information requests, helping gather comprehensive background details. Client cooperation has been excellent. Should I prepare follow-up questions?`;
      
      case 'external':
        const externalCount = caseData.externalUploads?.length || 0;
        return `${externalCount} external documents have been uploaded, including medical certificates and third-party reports. All documentation supports the case narrative. Would you like me to cross-reference these with our assessments?`;
      
      default:
        return `I'm here to assist with your case management needs. How can I help you today?`;
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: String(messages.length + 1),
      text: input,
      isUser: true,
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponseText = getAiResponse(input, caseData, activeTab, milestones);
      const aiMessage: ChatMessage = {
        id: String(messages.length + 2),
        text: aiResponseText,
        isUser: false,
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    }, 500);
  };

  if (!isAssistantEnabled) {
    return (
      <div className="fixed top-20 right-4 z-50">
        <Card className="w-80 shadow-lg border-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">👩🏻‍💻</span>
                <CardTitle className="text-sm">Ms. Confee</CardTitle>
              </div>
              <Switch
                checked={isAssistantEnabled}
                onCheckedChange={setIsAssistantEnabled}
                size="sm"
              />
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-50">
      <Card className="w-80 shadow-lg border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">👩🏻‍💻</span>
              <CardTitle className="text-sm">Ms. Confee</CardTitle>
            </div>
            <Switch
              checked={isAssistantEnabled}
              onCheckedChange={setIsAssistantEnabled}
              size="sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-3">
          {/* Summary Section */}
          <div className="mb-3 p-2 bg-blue-50 rounded-md text-xs text-gray-700">
            {getSummary()}
          </div>
          
          {/* Chat Messages */}
          {messages.length > 0 && (
            <div className="h-32 overflow-y-auto p-2 bg-gray-50 rounded-md mb-3 text-xs">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-1 p-1 rounded text-xs ${
                    message.isUser ? 'bg-blue-100 text-blue-800 ml-auto w-fit max-w-[80%]' : 'bg-white text-gray-800 mr-auto w-fit max-w-[80%]'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
          )}
          
          {/* Input Area */}
          <div className="flex items-center space-x-1">
            <Input
              type="text"
              placeholder="Ask Ms. Confee..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              className="text-xs h-8"
            />
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MsConfeeAssistant;
