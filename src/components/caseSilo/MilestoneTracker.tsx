
import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface Milestone {
  id: string;
  type: 'intake' | 'key_session' | 'document' | 'assessment' | 'report' | 'letter' | 'external' | 'meeting' | 'referral' | 'closing';
  title: string;
  date: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  relatedItemId?: string; // ID of the related item (document, assessment, etc.)
}

interface MilestoneTrackerProps {
  milestones: Milestone[];
  onMilestoneClick: (milestone: Milestone) => void;
}

// Map milestone types to colors
const getMilestoneColor = (type: Milestone['type']) => {
  const colors: Record<Milestone['type'], string> = {
    intake: "bg-blue-100 border-blue-200",
    key_session: "bg-green-100 border-green-200",
    document: "bg-amber-100 border-amber-200",
    assessment: "bg-purple-100 border-purple-200",
    report: "bg-indigo-100 border-indigo-200",
    letter: "bg-rose-100 border-rose-200",
    external: "bg-teal-100 border-teal-200",
    meeting: "bg-cyan-100 border-cyan-200",
    referral: "bg-orange-100 border-orange-200",
    closing: "bg-gray-100 border-gray-200"
  };
  return colors[type];
};

// Map milestone types to display names
const getMilestoneTypeName = (type: Milestone['type']) => {
  const names: Record<Milestone['type'], string> = {
    intake: "Intake",
    key_session: "Key Session",
    document: "Document",
    assessment: "Assessment",
    report: "Report",
    letter: "Letter",
    external: "External",
    meeting: "Meeting",
    referral: "Referral",
    closing: "Closing"
  };
  return names[type];
};

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

const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ milestones, onMilestoneClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
      
      // Check if scrolling is needed at all
      setCanScrollRight(scrollContainer.scrollWidth > scrollContainer.clientWidth);
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [milestones]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Adjust as needed
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount 
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Only enable scroll buttons if there are more than 10 milestones
  const showScrollButtons = milestones.length > 10;

  return (
    <div className="relative w-full">
      {showScrollButtons && (
        <Button
          variant="outline"
          size="icon"
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background border shadow-sm ${
            canScrollLeft ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto py-2 px-1 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {milestones.map((milestone) => (
          <div 
            key={milestone.id}
            className="shrink-0 cursor-pointer relative flex flex-col items-center"
            onClick={() => onMilestoneClick(milestone)}
          >
            <Card 
              className={`w-[120px] h-[90px] flex flex-col justify-between p-3 border rounded-md transition-all ${
                getMilestoneColor(milestone.type)
              } hover:shadow-md`}
            >
              <div className="text-xs font-medium">
                {getMilestoneTypeName(milestone.type)}
              </div>
              <div className="text-sm truncate">{milestone.title}</div>
              <div className="text-xs text-muted-foreground">{formatDate(milestone.date)}</div>
            </Card>
            
            {/* Tooltip positioned below the tile */}
            <div className="w-56 p-2 mt-2 bg-white rounded-md shadow-lg border text-left">
              <div className="text-sm font-medium">{milestone.title}</div>
              <div className="text-xs mt-1">
                {milestone.description || getSampleMessage(milestone.type)}
              </div>
              <div className="text-xs mt-1 text-muted-foreground">{formatDate(milestone.date)}</div>
            </div>
          </div>
        ))}
      </div>
      
      {showScrollButtons && (
        <Button
          variant="outline"
          size="icon"
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background border shadow-sm ${
            canScrollRight ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default MilestoneTracker;
