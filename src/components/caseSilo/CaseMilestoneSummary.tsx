
import React from "react";
import { Milestone } from "./MilestoneTracker";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Check, Clock } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface CaseMilestoneSummaryProps {
  recentMilestones: Milestone[];
  pendingTasks: Array<{
    id: string;
    title: string;
    dueDate?: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  onMilestoneClick: (milestone: Milestone) => void;
  onTaskClick: (taskId: string) => void;
}

// Sample hover messages for each milestone type
const getSampleMessage = (type: Milestone['type']) => {
  const messages: Record<Milestone['type'], string> = {
    intake: "Client completed intake interview and consented to psychological assessment.",
    key_session: "Breakthrough session addressing trauma triggers. Client showed increased emotional regulation.",
    document: "Medical report from GP uploaded by Dr. Johnson for review and claim substantiation.",
    assessment: "Client submitted DASS-21 responses online. Moderate stress and depressive symptoms noted.",
    report: "Psychological report drafted and submitted to legal team. Awaiting feedback.",
    letter: "Formal letter to insurer outlining client's psychological condition and supporting evidence.",
    external: "External specialist consultation completed, confirming diagnosis and treatment plan.",
    meeting: "Case conference with legal and clinical team to discuss strategy and next steps.",
    referral: "Client referred to specialist trauma therapist for ongoing treatment.",
    closing: "Final case review completed. All documentation finalized for submission."
  };
  return messages[type];
};

const CaseMilestoneSummary: React.FC<CaseMilestoneSummaryProps> = ({
  recentMilestones,
  pendingTasks,
  onMilestoneClick,
  onTaskClick
}) => {
  // Show at most 2 recent milestones
  const displayedMilestones = recentMilestones.slice(0, 2);
  
  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };
  
  // Get milestone color
  const getMilestoneColor = (type: Milestone['type']) => {
    const colors: Record<Milestone['type'], string> = {
      intake: "border-l-blue-500",
      key_session: "border-l-green-500",
      document: "border-l-amber-500",
      assessment: "border-l-purple-500",
      report: "border-l-indigo-500",
      letter: "border-l-rose-500",
      external: "border-l-teal-500",
      meeting: "border-l-cyan-500",
      referral: "border-l-orange-500",
      closing: "border-l-gray-500"
    };
    return colors[type];
  };

  return (
    <div className="space-y-3">
      {/* Recent Milestones */}
      {displayedMilestones.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Milestones</h4>
          {displayedMilestones.map((milestone) => (
            <HoverCard key={milestone.id}>
              <HoverCardTrigger asChild>
                <div 
                  onClick={() => onMilestoneClick(milestone)}
                  className={`border-l-4 ${getMilestoneColor(milestone.type)} bg-background hover:bg-muted/20 px-3 py-2 rounded-md cursor-pointer transition-colors`}
                >
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <div className="font-medium text-sm">{milestone.title}</div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs">Click for details</span>
                    <span className="text-xs text-muted-foreground">{formatDate(milestone.date)}</span>
                  </div>
                </div>
              </HoverCardTrigger>
              
              <HoverCardContent className="w-64 p-3 bg-white rounded-md shadow-lg border text-left">
                <div className="text-sm font-medium">{milestone.title}</div>
                <div className="text-xs mt-1">
                  {milestone.description || getSampleMessage(milestone.type)}
                </div>
                <div className="text-xs mt-1 text-muted-foreground">{formatDate(milestone.date)}</div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      )}
      
      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Pending Tasks</h4>
          {pendingTasks.map((task) => (
            <div 
              key={task.id}
              onClick={() => onTaskClick(task.id)}
              className="border-l-4 border-l-amber-500 bg-background hover:bg-muted/20 px-3 py-2 rounded-md cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <Clock className={`h-4 w-4 ${getPriorityColor(task.priority)}`} />
                <div className="font-medium text-sm">{task.title}</div>
              </div>
              {task.dueDate && (
                <div className="text-xs text-right text-muted-foreground mt-1">
                  Due: {formatDate(task.dueDate)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CaseMilestoneSummary;
