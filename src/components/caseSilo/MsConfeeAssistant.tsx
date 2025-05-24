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

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    text: "Hi, I'm Ms. Confee, your AI assistant for this case. How can I help you today?",
    isUser: false,
  },
];

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
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isAssistantEnabled, setIsAssistantEnabled] = useState(true);

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

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Ms. Confee AI Assistant</CardTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="assistant-enabled">Enable Assistant</Label>
            <Switch
              id="assistant-enabled"
              checked={isAssistantEnabled}
              onCheckedChange={setIsAssistantEnabled}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="h-64 overflow-y-auto p-2 bg-gray-50 rounded-md">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 p-2 rounded-md ${
                  message.isUser ? 'bg-blue-100 text-blue-800 ml-auto w-fit' : 'bg-gray-100 text-gray-800 mr-auto w-fit'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              disabled={!isAssistantEnabled}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!isAssistantEnabled}
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MsConfeeAssistant;
