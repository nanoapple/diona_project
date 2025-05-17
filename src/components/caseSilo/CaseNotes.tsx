
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Eye, EyeOff, User, UserCheck, Edit, Save, Share, FileText, X } from "lucide-react";
import { CaseNote } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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
           note.visibleTo?.includes(currentUserRole as any);
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
            <div 
              key={note.id} 
              className="p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => canView && handleNoteClick(note)}
            >
              <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    <User className="h-3 w-3" /> {note.createdBy}
                  </Badge>
                  
                  {note.isPrivate && (
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                      <EyeOff className="h-3 w-3" /> Private
                    </Badge>
                  )}
                  
                  {!note.isPrivate && (
                    <Badge variant="default" className="flex items-center gap-1 text-xs">
                      <UserCheck className="h-3 w-3" /> Shared
                    </Badge>
                  )}
                  
                  {/* Note type badge (Transcribed or Written) */}
                  <Badge variant="outline" className={`flex items-center gap-1 text-xs ${
                    getNoteType(note.id) === "Transcribed" ? "bg-blue-100 text-blue-800 border-blue-300" : "bg-green-100 text-green-800 border-green-300"
                  }`}>
                    <FileText className="h-3 w-3" /> {getNoteType(note.id)}
                  </Badge>
                </div>
                
                <span className="text-xs text-muted-foreground">
                  {formatDate(note.createdAt)}
                </span>
              </div>
              
              <p className="whitespace-pre-wrap">{note.content}</p>
              
              {note.visibleTo && note.isPrivate && canView && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <span>Visible to: {note.visibleTo.join(', ')}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Verification Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify Access</DialogTitle>
            <DialogDescription>
              Please enter the 6-digit security code from your authentication app to view the clinical notes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label>Security Code</Label>
              <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <p className="text-xs text-muted-foreground">For demo purposes, use code: 778899</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerifyDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleVerifyCode}>Verify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Clinical Notes Dialog */}
      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Clinical Notes</DialogTitle>
            <DialogDescription>
              Full clinical documentation for this session.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="whitespace-pre-wrap font-mono text-sm border p-4 rounded-md bg-muted/20 max-h-[60vh] overflow-y-auto">
              {sampleClinicalNotes}
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button variant="outline">
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
            </div>
            <Button onClick={handleShareClick}>
              <Share className="w-4 h-4 mr-1" /> Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share Dialog */}
      <AlertDialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Share Clinical Notes</AlertDialogTitle>
            <AlertDialogDescription>
              Please verify your identity and consent to share these notes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Security Code</Label>
              <InputOTP maxLength={6} value={shareCode} onChange={setShareCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <p className="text-xs text-muted-foreground">Enter the code from your authenticator app</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="therapist-name">Therapist Name</Label>
              <Input 
                id="therapist-name" 
                value={therapistName} 
                onChange={e => setTherapistName(e.target.value)} 
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="consent" checked={hasConsent} onCheckedChange={(checked) => setHasConsent(!!checked)} />
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I consent to share these notes <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipient-email">Recipient Email</Label>
              <Input 
                id="recipient-email" 
                type="email"
                value={recipientEmail} 
                onChange={e => setRecipientEmail(e.target.value)} 
                placeholder="Enter recipient's email"
                disabled={!hasConsent}
                className={!hasConsent ? "bg-muted cursor-not-allowed" : ""}
              />
            </div>
            
            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
              <p>The recipient will need the security code generated by the therapist's App to open the sharing link.</p>
            </div>
          </div>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleShareSubmit}>Share Notes</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CaseNotes;
