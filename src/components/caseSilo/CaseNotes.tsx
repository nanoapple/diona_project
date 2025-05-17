
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Eye, EyeOff } from "lucide-react";
import { CaseNote } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { UserRole } from "@/types";
import CaseNoteItem from './CaseNoteItem';
import NoteVerificationDialog from './NoteVerificationDialog';
import ClinicalNotesDialog from './ClinicalNotesDialog';
import ShareNotesDialog from './ShareNotesDialog';

interface CaseNotesProps {
  notes: CaseNote[];
  canView: boolean;
  canCreate: boolean;
  onCreateItem: () => void;
  currentUserRole?: UserRole;
}

// Sample clinical notes for demo purposes
const sampleClinicalNotes = `Clinical Notes
Client: [Redacted]
Date: [Redacted]

Presenting Issue:
Chronic insomnia with delayed sleep onset (≥2 hours) and frequent nocturnal awakenings, persisting for 6 months prior to treatment.

Symptoms:
Daytime fatigue, irritability, and difficulty concentrating.
Pre-sleep anxiety (e.g., racing thoughts, catastrophizing about sleep loss).
Secondary depressive symptoms (low mood, reduced motivation).

Affect:
Anxious (pre-session self-rating: 6/10), with periods of flat affect. Noted slight improvement in energy during discussion of recent sleep gains.

Thought Form:
Catastrophizing: "If I don't sleep, I'll ruin my health/relationships."
All-or-nothing thinking: "One bad night means I've failed at improving sleep."
Improved insight: Acknowledges medication (SSRI) as a "tool, not a cure."

Observation:
Alert, engaged, and cooperative.
Reports reduced nighttime anxiety since starting medication.
Sleep diary shows 1.5-hour reduction in sleep latency over 4 weeks.

Barriers:
Mild medication side effects (e.g., morning grogginess).
Reluctance to reduce medication dependence due to fear of relapse.
Inconsistent sleep hygiene (e.g., weekend screen use).

Interventions:
CBT-I: Targeted cognitive distortions via Socratic questioning and behavioral experiments (e.g., delayed bedtime).
Relaxation Training: Guided progressive muscle relaxation (PMR) for pre-sleep tension.
Sleep Hygiene Education: Set screen curfew (1 hour pre-bed) and consistent wake-up time.
Collaborative Care: Coordinated with psychiatrist to monitor medication efficacy/side effects.

Progress:
Client reports "7/10 improvement in sleep quality" and reduced daytime fatigue. Plans to gradually taper medication under medical supervision while reinforcing behavioral strategies.

Next Steps:
Introduce mindfulness-based stress reduction (MBSR) for residual anxiety.
Schedule follow-up to assess maintenance of sleep gains.

Note: Client motivated but requires ongoing support to address ambivalence about medication reduction.`;

const CaseNotes = ({ notes, canView, canCreate, onCreateItem, currentUserRole }: CaseNotesProps) => {
  const { toast } = useToast();
  const [showPrivateNotes, setShowPrivateNotes] = useState(true);
  const [selectedNote, setSelectedNote] = useState<CaseNote | null>(null);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [shareCode, setShareCode] = useState("");
  const [therapistName, setTherapistName] = useState("");
  const [hasConsent, setHasConsent] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  
  // Demo verification code
  const correctVerificationCode = "778899";

  // Filter notes based on visibility permissions
  const filteredNotes = notes.filter(note => {
    // Always show notes that aren't private
    if (!note.isPrivate) return true;
    
    // If showing private notes and user can view them and their role is allowed to see this note
    return showPrivateNotes && 
           canView && 
           note.visibleTo?.includes(currentUserRole as UserRole);
  });

  const handleNoteClick = (note: CaseNote) => {
    setSelectedNote(note);
    setVerificationCode("");
    setIsVerifyDialogOpen(true);
  };

  const handleVerifyCode = () => {
    if (verificationCode === correctVerificationCode) {
      setIsVerifyDialogOpen(false);
      setIsNotesDialogOpen(true);
    } else {
      toast({
        title: "Verification Failed",
        description: "The code you entered is incorrect. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShareClick = () => {
    setIsShareDialogOpen(true);
    setShareCode("");
    setTherapistName("");
    setHasConsent(false);
    setRecipientEmail("");
  };

  const handleShareSubmit = () => {
    if (shareCode !== correctVerificationCode) {
      toast({
        title: "Verification Failed",
        description: "The security code you entered is incorrect.",
        variant: "destructive"
      });
      return;
    }

    if (!therapistName || !hasConsent || !recipientEmail) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Notes Shared Successfully",
      description: `Clinical notes have been shared with ${recipientEmail}.`,
    });
    setIsShareDialogOpen(false);
  };

  const getNoteType = (noteId: string) => {
    // This is just a demo implementation
    // In a real app, this would be stored in the note data
    if (noteId === "note1") return "Transcribed";
    return "Written";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Case Notes</h3>
        <div className="flex items-center gap-2">
          {canView && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowPrivateNotes(!showPrivateNotes)}
              className="flex items-center"
            >
              {showPrivateNotes ? 
                <><Eye className="w-4 h-4 mr-1" /> Show All</> : 
                <><EyeOff className="w-4 h-4 mr-1" /> Hide Private</>
              }
            </Button>
          )}
          
          {canCreate && (
            <Button size="sm" onClick={onCreateItem}>
              <Plus className="w-4 h-4 mr-1" /> Add Note
            </Button>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
            <h3 className="mt-3 text-lg font-medium">No case notes</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
              {canCreate 
                ? "Add notes to track important case information"
                : "No notes have been added yet"
              }
            </p>
            {canCreate && (
              <Button className="mt-4" size="sm" variant="outline" onClick={onCreateItem}>
                <Plus className="w-4 h-4 mr-1" /> Add Note
              </Button>
            )}
          </div>
        ) : (
          filteredNotes.map(note => (
            <CaseNoteItem 
              key={note.id}
              note={note}
              onViewNote={handleNoteClick}
              isPrivateNote={!!note.isPrivate}
              noteType={getNoteType(note.id) as 'Transcribed' | 'Written'}
            />
          ))
        )}
      </div>
      
      {/* Verification Dialog */}
      <NoteVerificationDialog
        isOpen={isVerifyDialogOpen}
        onOpenChange={setIsVerifyDialogOpen}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        onVerify={handleVerifyCode}
      />
      
      {/* Clinical Notes Dialog */}
      <ClinicalNotesDialog
        isOpen={isNotesDialogOpen}
        onOpenChange={setIsNotesDialogOpen}
        clinicalNotes={sampleClinicalNotes}
        onShare={handleShareClick}
      />
      
      {/* Share Dialog */}
      <ShareNotesDialog
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        shareCode={shareCode}
        setShareCode={setShareCode}
        therapistName={therapistName}
        setTherapistName={setTherapistName}
        hasConsent={hasConsent}
        setHasConsent={setHasConsent}
        recipientEmail={recipientEmail}
        setRecipientEmail={setRecipientEmail}
        onShare={handleShareSubmit}
      />
    </div>
  );
};

export default CaseNotes;
