import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Calendar, Clock, MapPin, Phone, Video, User, PlayCircle, MessageSquare, ClipboardList, Mic, FileText, MicOff, Upload, Loader2, Edit, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { AddAssessmentDialog } from '@/components/assessments/AddAssessmentDialog';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useToast } from '@/components/ui/use-toast';

interface Appointment {
  id: string;
  title: string;
  clientName: string;
  clientGender: string;
  clientDOB: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: string;
  deliveryMethod: 'in-person' | 'telehealth' | 'phone';
  arrivalStatus: 'Arrived' | 'Late' | 'Rescheduled' | 'Missed' | '';
  notes: string;
  appointmentNumber: number;
  financialYear: string;
  interpreterLanguage?: string;
}

interface AppointmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  onStatusUpdate?: (appointmentId: string, status: string) => void;
}

type NoteMode = 'selection' | 'write' | 'dictate' | 'ocr';

const noteStructure = [
  {
    id: 'presenting_concerns',
    title: '1. Presenting Concerns',
    description: 'Concise summary of key issue(s) prompting the session/referral.'
  },
  {
    id: 'presentation_mental_state',
    title: '2. Presentation, Mental State & Affect',
    description: 'Brief observations of mood, energy, behaviour, and emotional tone.'
  },
  {
    id: 'cognitive_themes',
    title: '3. Cognitive Themes & Thought Style',
    description: 'Cognitive functions, distortions, insight, internal conflicts.'
  },
  {
    id: 'functional_impact',
    title: '4. Functional Impact',
    description: 'ADLs; Work/school performance; Relationships; Role functioning'
  },
  {
    id: 'psychological_history',
    title: '5. Psychological History & Maintaining Factors',
    description: 'Brief background and perpetuating dynamics.'
  },
  {
    id: 'treatment_focus',
    title: '6. Treatment Focus & Interventions',
    description: 'Current modality used, strategies applied, therapeutic stance.'
  },
  {
    id: 'progress_indicators',
    title: '7. Progress Indicators (optional)',
    description: 'Client feedback, symptom trajectory, compliance with tasks, new insight.'
  },
  {
    id: 'barriers_to_change',
    title: '8. Barriers to Change',
    description: 'Any ambivalence, structural or internalised blocks to therapy or recovery.'
  },
  {
    id: 'risk_protective_factors',
    title: '9. Risk & Protective Factors',
    description: 'Suicidal ideation, psychosocial strengths, medication stability'
  },
  {
    id: 'plan_next_steps',
    title: '10. Plan / Next Steps',
    description: 'Short-term goals, upcoming focus, coordination needs, home practice.'
  }
];

const AppointmentDetailsDialog = ({ open, onOpenChange, appointment, onStatusUpdate }: AppointmentDetailsDialogProps) => {
  const { toast } = useToast();
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [showSplitView, setShowSplitView] = useState(false);
  const [arrivalStatus, setArrivalStatus] = useState<'Arrived' | 'Late' | 'Rescheduled' | 'Missed' | ''>(appointment?.arrivalStatus || '');
  
  // State for additional fields
  const [referralSource, setReferralSource] = useState('');
  const [presentingIssues, setPresentingIssues] = useState<string[]>([]);
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [dischargeReason, setDischargeReason] = useState('');
  const [followUpPlan, setFollowUpPlan] = useState('');

  // Note-taking state
  const [noteMode, setNoteMode] = useState<NoteMode>('selection');
  const [noteData, setNoteData] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isTemplateMode, setIsTemplateMode] = useState(true);
  const [freestyleText, setFreestyleText] = useState('');
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'toggle' | 'back' | null>(null);

  if (!appointment) return null;

  // Update local state when appointment changes
  if (appointment && arrivalStatus !== appointment.arrivalStatus) {
    setArrivalStatus(appointment.arrivalStatus);
  }

  // Reset split view when dialog is closed
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setShowSplitView(false);
    }
    onOpenChange(open);
  };

  // Handle starting the session - show split view
  const handleStartSession = () => {
    setShowSplitView(true);
  };

  // Handle adding assessment 
  const handleAddAssessment = (assessment: any) => {
    console.log('Assessment added:', assessment);
  };

  // Note-taking helper functions
  const handleModeSelect = (selectedMode: NoteMode) => {
    setNoteMode(selectedMode);
    setNoteData({});
    setAudioFile(null);
    setUploadedFile(null);
  };

  const handleNoteChange = (sectionId: string, value: string) => {
    setNoteData(prev => ({
      ...prev,
      [sectionId]: value
    }));
  };

  const handleRecordingToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      const mockAudioFile = new File([''], 'recording.wav', { type: 'audio/wav' });
      setAudioFile(mockAudioFile);
      toast({
        title: "Recording stopped",
        description: "Your recording has been saved. Click 'Summarise' to process it.",
      });
    } else {
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Start speaking about your session...",
      });
    }
  };

  const handleSummarize = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockSummary = {
      presenting_concerns: "Client presents with persistent anxiety and sleep disturbances following workplace incident.",
      presentation_mental_state: "Appeared tense, fidgety, with flat affect. Energy levels reported as low.",
      cognitive_themes: "Evident catastrophic thinking patterns, rumination about future incidents.",
      functional_impact: "Significant impairment in work performance, avoiding driving, strained relationships.",
      psychological_history: "No prior mental health treatment. Recent trauma appears to be precipitating factor.",
      treatment_focus: "CBT approach focusing on trauma processing and anxiety management techniques.",
      progress_indicators: "Client engaged well, completed homework assignments, slight improvement noted.",
      barriers_to_change: "Fear of retraumatization, financial stress affecting session attendance.",
      risk_protective_factors: "No suicidal ideation. Strong family support system, stable housing.",
      plan_next_steps: "Continue weekly sessions, introduce exposure exercises, coordinate with GP."
    };
    
    setNoteData(mockSummary);
    setIsProcessing(false);
    
    toast({
      title: "Summary complete",
      description: "AI has summarized your recording. Please review and edit as needed.",
    });
  };

  const handleOCR = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a handwritten note file first.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockOCRSummary = {
      presenting_concerns: "Anxiety, sleep issues",
      presentation_mental_state: "Tense, low energy",
      cognitive_themes: "Catastrophic thinking",
      functional_impact: "Work problems, avoidance",
      psychological_history: "First time seeking help",
      treatment_focus: "CBT, anxiety management",
      progress_indicators: "Good engagement",
      barriers_to_change: "Fear, financial stress",
      risk_protective_factors: "No SI, family support",
      plan_next_steps: "Weekly sessions, exposure work"
    };
    
    setNoteData(mockOCRSummary);
    setIsProcessing(false);
    
    toast({
      title: "OCR processing complete",
      description: "Handwritten notes have been processed. Please review and expand as needed.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded. Click 'OCR' to process.`,
      });
    }
  };

  const handleSaveNote = () => {
    const finalNoteData = {
      id: `note_${Date.now()}`,
      content: noteMode === 'write' ? Object.values(noteData).join('\n\n') : 'Structured clinical note',
      createdBy: "Dr. Smith",
      createdAt: new Date().toISOString(),
      isPrivate: true,
      visibleTo: ["psychologist", "lawyer"],
      type: noteMode,
      structuredData: noteData
    };

    console.log('Note saved:', finalNoteData);
    
    // Reset state
    setNoteMode('selection');
    setNoteData({});
    setAudioFile(null);
    setUploadedFile(null);
    
    toast({
      title: "Note saved",
      description: "Your clinical note has been saved successfully.",
    });
  };

  const handleBackToSelection = () => {
    // Check if there's any data that might be lost
    const hasData = Object.values(noteData).some(value => value && value.trim() !== '') || 
                   freestyleText.trim() !== '' || 
                   audioFile || 
                   uploadedFile;
    
    if (hasData) {
      setPendingAction('back');
      setShowWarningDialog(true);
    } else {
      proceedWithBack();
    }
  };

  const proceedWithBack = () => {
    setNoteMode('selection');
    setNoteData({});
    setAudioFile(null);
    setUploadedFile(null);
    setFreestyleText('');
    setIsTemplateMode(true);
    setShowWarningDialog(false);
    setPendingAction(null);
  };

  const handleToggleMode = () => {
    // Check if there's any data that might be lost
    const hasData = Object.values(noteData).some(value => value && value.trim() !== '') || 
                   freestyleText.trim() !== '';
    
    if (hasData) {
      setPendingAction('toggle');
      setShowWarningDialog(true);
    } else {
      proceedWithToggle();
    }
  };

  const proceedWithToggle = () => {
    setIsTemplateMode(!isTemplateMode);
    setNoteData({});
    setFreestyleText('');
    setShowWarningDialog(false);
    setPendingAction(null);
  };

  const handleWarningConfirm = () => {
    if (pendingAction === 'toggle') {
      proceedWithToggle();
    } else if (pendingAction === 'back') {
      proceedWithBack();
    }
  };

  const handleWarningCancel = () => {
    setShowWarningDialog(false);
    setPendingAction(null);
  };

  const arrivalStatusOptions = [
    { value: 'Arrived' as const, label: 'Arrived' },
    { value: 'Late' as const, label: 'Late' },
    { value: 'Rescheduled' as const, label: 'Rescheduled' },
    { value: 'Missed' as const, label: 'Missed' }
  ];

  const handleArrivalStatusChange = (value: string) => {
    setArrivalStatus(value as 'Arrived' | 'Late' | 'Rescheduled' | 'Missed' | '');
    if (appointment && onStatusUpdate) {
      onStatusUpdate(appointment.id, value);
    }
  };

  const getTypeIcon = (deliveryMethod: string) => {
    switch (deliveryMethod) {
      case 'in-person':
        return <MapPin className="h-4 w-4" />;
      case 'telehealth':
        return <Video className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getArrivalStatusColor = (status: string) => {
    switch (status) {
      case 'Arrived':
        return 'bg-green-100 text-green-800';
      case 'Late':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rescheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Missed':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSessionTypeColor = (type: string) => {
    if (type === 'General Session') return 'text-orange-600';
    if (type === 'Intake Session') return 'text-emerald-600';
    if (type === 'Discharge Session') return 'text-rose-600';
    if (type === 'Assessment Session') return 'text-blue-600';
    if (type.includes('Team Meeting')) return 'text-green-600';
    if (type === 'Supervision') return 'text-purple-600';
    if (type === 'Administrative Task') return 'text-yellow-600';
    return 'text-gray-600';
  };

  const presentingIssuesOptions = [
    'Anxiety', 'PTSD', 'Work stress', 'Depression', 'OCD', 'Bipolar disorder', 'Grief', 'Relationship issues',
    'Substance abuse', 'Eating disorders', 'Sleep disorders', 'Anger management',
    'Bullying / Abuse', 'Neurodivergence', 'Chronic Pain / Injury', 'Legal or Compensation Stress',
    'Isolation / Loneliness', 'Life Transitions', 'Financial Stress', 'Gender / Sexual Identity', 'Academic Pressure'
  ];

  const dischargeReasonOptions = [
    { value: '01', label: '01 Service completed' },
    { value: '02', label: '02 Transferred/referred to another service' },
    { value: '03', label: '03 Left without notice' },
    { value: '04', label: '04 Left against advice' },
    { value: '05', label: '05 Left Involuntarily (non-compliance)' },
    { value: '06', label: '06 Moved out of area' },
    { value: '07', label: '07 Sanctioned by drug court/court diversion program' },
    { value: '08', label: '08 Imprisoned, other than drug court sanction' },
    { value: '09', label: '09 Released from prison' },
    { value: '10', label: '10 Died' },
    { value: '98', label: '98 Other' },
    { value: '99', label: '99 Not stated/inadequately described' }
  ];

  const followUpOptions = [
    'None', 'Periodic check-in', 'Referred to GP', 'Referred to specialist', 'Other service referral'
  ];

  // Render appointment details view
  const renderAppointmentDetails = () => (
    <div className="space-y-4">
      {/* Client Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4" />
          <span className="font-medium">Client Details</span>
        </div>
        <div className="space-y-1 text-sm">
          <div><strong>Name:</strong> {appointment.clientName}</div>
          <div><strong>Gender:</strong> {appointment.clientGender}</div>
          <div><strong>DOB:</strong> {appointment.clientDOB}</div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span><strong>Date:</strong> {format(appointment.date, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span><strong>Time:</strong> {appointment.startTime} - {appointment.endTime}</span>
          </div>
          <div className="flex items-center gap-2">
            {getTypeIcon(appointment.deliveryMethod)}
            <span><strong>Type:</strong> {appointment.type}</span>
          </div>
        </div>
      </div>

      {/* Arrival Status */}
      <div>
        <div className="flex items-center gap-4">
          <span className="font-medium">Arrival Status:</span>
          <Select value={arrivalStatus} onValueChange={handleArrivalStatusChange}>
            <SelectTrigger className="w-48 bg-background border shadow-sm">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-md z-50">
              {arrivalStatusOptions.map(option => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="hover:bg-muted"
                >
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getArrivalStatusColor(option.value)}`}>
                    {option.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contextual Info */}
      {appointment.notes && (
        <div>
          <div className="font-medium mb-2">Contextual Info:</div>
          <div className="bg-yellow-50 p-3 rounded text-sm">
            {appointment.notes}
          </div>
        </div>
      )}

      {/* Additional Fields for Intake Session */}
      {appointment.type === 'Intake Session' && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium text-emerald-600">Intake Session Details</h3>
          
          <div>
            <Label htmlFor="referralSource">Referral Source</Label>
            <Select value={referralSource} onValueChange={setReferralSource}>
              <SelectTrigger className="bg-background border shadow-sm">
                <SelectValue placeholder="Select or type referral source" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-md z-50">
                <SelectItem value="gp">GP</SelectItem>
                <SelectItem value="ndis">NDIS</SelectItem>
                <SelectItem value="self">Self</SelectItem>
                <SelectItem value="employer">Employer</SelectItem>
                <SelectItem value="family">Family/Friend</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Presenting Issues (referral)</Label>
            <div className="grid grid-cols-3 gap-1 mt-2">
              {presentingIssuesOptions.map((issue) => (
                <label key={issue} className="flex items-center space-x-1.5">
                  <input
                    type="checkbox"
                    checked={presentingIssues.includes(issue)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPresentingIssues([...presentingIssues, issue]);
                      } else {
                        setPresentingIssues(presentingIssues.filter(i => i !== issue));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-xs">{issue}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="consent" 
              checked={consentConfirmed}
              onCheckedChange={setConsentConfirmed}
            />
            <Label htmlFor="consent">Consent Confirmed</Label>
          </div>
        </div>
      )}

      {/* Additional Fields for Discharge Session */}
      {appointment.type === 'Discharge Session' && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium text-rose-600">Discharge Session Details</h3>
          
          <div>
            <Label htmlFor="dischargeReason">Reason for Discharge</Label>
            <Select value={dischargeReason} onValueChange={setDischargeReason}>
              <SelectTrigger className="bg-background border shadow-sm">
                <SelectValue placeholder="Select discharge reason" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-md z-50">
                {dischargeReasonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="followUpPlan">Follow-up Plan (Optional)</Label>
            <Select value={followUpPlan} onValueChange={setFollowUpPlan}>
              <SelectTrigger className="bg-background border shadow-sm">
                <SelectValue placeholder="Select follow-up plan" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-md z-50">
                {followUpOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Session Actions */}
      <div className="flex justify-center pt-4">
        {arrivalStatus === 'Arrived' || arrivalStatus === 'Late' ? (
          <div className="text-center space-y-3">
            <div className="text-sm text-green-600 font-medium">
              ✓ Session completed
            </div>
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              size="lg"
            >
              Go to case management
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleStartSession}
            className="flex items-center gap-2"
            size="lg"
          >
            <PlayCircle className="h-5 w-5" />
            Start Session
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className={showSplitView ? "max-w-6xl max-h-[90vh]" : "max-w-lg max-h-[90vh] overflow-y-auto"}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              The {appointment.appointmentNumber} appointment of {appointment.financialYear}
            </DialogTitle>
            <div className="flex justify-between items-center">
              <div className={`text-xl font-bold ${getSessionTypeColor(appointment.type)}`}>
                {appointment.type}
              </div>
              {appointment.interpreterLanguage && (
                <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Interpreter: {appointment.interpreterLanguage}
                </div>
              )}
            </div>
          </DialogHeader>
          
          {!showSplitView ? (
            renderAppointmentDetails()
          ) : (
            <div className="h-[70vh]">
              <ResizablePanelGroup direction="horizontal">
                {/* Left Panel - Case Summary */}
                <ResizablePanel defaultSize={25} minSize={20}>
                  <div className="p-4 bg-purple-50/30 border-r border-purple-200 h-full overflow-y-auto">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-5 w-5 text-purple-600" />
                      <h3 className="text-lg font-semibold">Client Summary</h3>
                    </div>
                    
                    {/* Bio-Psycho-Social Model */}
                    <div className="space-y-4 mb-6">
                      <h4 className="text-sm font-semibold text-purple-700">Bio-Psycho-Social Profile</h4>
                      
                      <div className="bg-white rounded-lg p-3 border space-y-3">
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Biological</div>
                          <p className="text-sm">Chronic sleep issues, medication for anxiety (Sertraline 50mg)</p>
                        </div>
                        
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Psychological</div>
                          <p className="text-sm">Generalized anxiety disorder, history of workplace trauma, cognitive distortions</p>
                        </div>
                        
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Social</div>
                          <p className="text-sm">Married, 2 children, strained work relationships, reduced social engagement</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Last Session Notes */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-purple-700">Last Session Notes</h4>
                      <div className="bg-white rounded-lg p-3 border">
                        <div className="text-xs text-muted-foreground mb-2">Session {appointment.appointmentNumber - 1} - {format(new Date(appointment.date.getTime() - 7 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}</div>
                        <div className="text-sm space-y-2">
                          <p><strong>Progress:</strong> Client showed improved engagement. Completed thought diary homework.</p>
                          <p><strong>Focus:</strong> Cognitive restructuring techniques, challenging catastrophic thinking patterns.</p>
                          <p><strong>Next Steps:</strong> Continue CBT exercises, introduce behavioral activation strategies.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                {/* Middle Panel - Add Case Note */}
                <ResizablePanel defaultSize={40} minSize={30}>
                  <div className="p-4 bg-blue-50/30 border-r border-blue-200 h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Add Case Note</h3>
                    </div>
                    <div className="bg-white rounded-lg p-4 h-[calc(100%-4rem)] border overflow-y-auto">
                      {noteMode === 'selection' && (
                        <>
                          <p className="text-sm text-muted-foreground mb-4">
                            Choose how you'd like to create your case note:
                          </p>
                          
                          <div className="space-y-3">
                            <Button
                              variant="outline"
                              className="w-full h-12 justify-start text-left"
                              onClick={() => handleModeSelect('write')}
                            >
                              <div className="flex items-center gap-3">
                                <Edit className="w-4 h-4 text-primary" />
                                <div>
                                  <div className="font-medium text-sm">Write your own notes</div>
                                  <div className="text-xs text-muted-foreground">Manually enter structured clinical notes</div>
                                </div>
                              </div>
                            </Button>
                            
                            <Button
                              variant="outline"
                              className="w-full h-12 justify-start text-left"
                              onClick={() => handleModeSelect('dictate')}
                            >
                              <div className="flex items-center gap-3">
                                <Mic className="w-4 h-4 text-primary" />
                                <div>
                                  <div className="font-medium text-sm">Dictate-transcribe-summarise</div>
                                  <div className="text-xs text-muted-foreground">Record your session and let AI structure it</div>
                                </div>
                              </div>
                            </Button>
                            
                            <Button
                              variant="outline"
                              className="w-full h-12 justify-start text-left"
                              onClick={() => handleModeSelect('ocr')}
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-primary" />
                                <div>
                                  <div className="font-medium text-sm">Handwritten note OCR</div>
                                  <div className="text-xs text-muted-foreground">Upload handwritten notes for OCR processing</div>
                                </div>
                              </div>
                            </Button>
                          </div>
                        </>
                      )}

                      {noteMode === 'write' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={handleBackToSelection}>
                                ← Back
                              </Button>
                              <span className="font-medium">Write Clinical Notes</span>
                            </div>
                            
                            {/* Toggle Switch */}
                            <div className="flex items-center gap-3">
                              <span className={`text-sm ${isTemplateMode ? 'font-medium' : 'text-muted-foreground'}`}>
                                Template
                              </span>
                              <Switch
                                checked={!isTemplateMode}
                                onCheckedChange={handleToggleMode}
                                aria-label="Toggle between template and freestyle mode"
                              />
                              <span className={`text-sm ${!isTemplateMode ? 'font-medium' : 'text-muted-foreground'}`}>
                                Freestyle
                              </span>
                            </div>
                          </div>
                          
                          {isTemplateMode ? (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              {noteStructure.map((section) => (
                                <div key={section.id} className="space-y-2">
                                  <label className="text-sm font-medium">{section.title}</label>
                                  <p className="text-xs text-muted-foreground">{section.description}</p>
                                  <Textarea
                                    placeholder={`Enter notes for ${section.title.split('.')[1]?.trim()}...`}
                                    value={noteData[section.id] || ''}
                                    onChange={(e) => handleNoteChange(section.id, e.target.value)}
                                    className="min-h-20"
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <Textarea
                                placeholder="Write your notes in freestyle format..."
                                value={freestyleText}
                                onChange={(e) => setFreestyleText(e.target.value)}
                                className="min-h-[400px] resize-none"
                              />
                            </div>
                          )}
                          
                          <div className="flex gap-2 pt-4">
                            <Button variant="outline" onClick={handleBackToSelection}>
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleSaveNote} 
                              disabled={isTemplateMode ? !Object.values(noteData).some(value => value.trim().length > 0) : !freestyleText.trim()}
                            >
                              Save Note
                            </Button>
                          </div>
                        </div>
                      )}

                      {noteMode === 'dictate' && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Button variant="ghost" size="sm" onClick={handleBackToSelection}>
                              ← Back
                            </Button>
                            <span className="font-medium">Dictate Session Notes</span>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-4">
                              Please try to dictate this session in detail by referring to the following structure. 
                              AI will help you to summarise the notes as per the format.
                            </p>
                            
                            <Button
                              onClick={handleRecordingToggle}
                              variant={isRecording ? "destructive" : "default"}
                              size="lg"
                              className="w-32 h-32 rounded-full"
                              disabled={isProcessing}
                            >
                              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                            </Button>
                            
                            <p className="text-sm mt-2">
                              {isRecording ? "Recording..." : "Click to start recording"}
                            </p>
                            
                            {audioFile && (
                              <div className="mt-4 p-3 bg-muted rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">{audioFile.name}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setAudioFile(null)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {audioFile && !isProcessing && Object.keys(noteData).length === 0 && (
                            <Button 
                              onClick={handleSummarize} 
                              className="w-full"
                              disabled={!audioFile}
                            >
                              Summarise
                            </Button>
                          )}
                          
                          {isProcessing && (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="w-6 h-6 animate-spin mr-2" />
                              <span>AI is summarising your recording...</span>
                            </div>
                          )}
                          
                          {Object.keys(noteData).length > 0 && (
                            <div className="space-y-4 max-h-64 overflow-y-auto">
                              {noteStructure.map((section) => (
                                <div key={section.id} className="space-y-2">
                                  <label className="text-sm font-medium">{section.title}</label>
                                  <Textarea
                                    value={noteData[section.id] || ''}
                                    onChange={(e) => handleNoteChange(section.id, e.target.value)}
                                    className="min-h-16"
                                    placeholder="AI generated content will appear here..."
                                  />
                                </div>
                              ))}
                              <div className="flex gap-2 pt-4">
                                <Button variant="outline" onClick={handleBackToSelection}>
                                  Cancel
                                </Button>
                                <Button onClick={handleSaveNote}>
                                  Save Note
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {noteMode === 'ocr' && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Button variant="ghost" size="sm" onClick={handleBackToSelection}>
                              ← Back
                            </Button>
                            <span className="font-medium">OCR Handwritten Notes</span>
                          </div>
                          
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Upload handwritten notes</p>
                              <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, PDF</p>
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileUpload}
                                className="max-w-xs mx-auto"
                              />
                            </div>
                            
                            {uploadedFile && (
                              <div className="mt-4 p-3 bg-muted rounded-lg">
                                <div className="flex items-center justify-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  <span className="text-sm">{uploadedFile.name}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {uploadedFile && !isProcessing && Object.keys(noteData).length === 0 && (
                            <Button 
                              onClick={handleOCR} 
                              className="w-full"
                              disabled={!uploadedFile}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              OCR
                            </Button>
                          )}
                          
                          {isProcessing && (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="w-6 h-6 animate-spin mr-2" />
                              <span>AI is processing your handwritten notes...</span>
                            </div>
                          )}
                          
                          {Object.keys(noteData).length > 0 && (
                            <>
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-800">
                                  <strong>Note:</strong> Based on the recognition of handwritten notes alone, 
                                  the AI is limited in what it can summarise, so it needs more complete input from you.
                                </p>
                              </div>
                              
                              <div className="space-y-4 max-h-64 overflow-y-auto">
                                {noteStructure.map((section) => (
                                  <div key={section.id} className="space-y-2">
                                    <label className="text-sm font-medium">{section.title}</label>
                                    <p className="text-xs text-muted-foreground">{section.description}</p>
                                    <Textarea
                                      value={noteData[section.id] || ''}
                                      onChange={(e) => handleNoteChange(section.id, e.target.value)}
                                      className="min-h-16"
                                      placeholder="Expand on the OCR results..."
                                    />
                                  </div>
                                ))}
                              </div>
                              
                              <div className="flex gap-2 pt-4">
                                <Button variant="outline" onClick={handleBackToSelection}>
                                  Cancel
                                </Button>
                                <Button onClick={handleSaveNote}>
                                  Save Note
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                {/* Right Panel - Add Assessment */}
                <ResizablePanel defaultSize={35} minSize={25}>
                  <div className="p-4 bg-green-50/30 h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <ClipboardList className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Add Assessment</h3>
                    </div>
                    <div className="bg-white rounded-lg p-4 h-[calc(100%-4rem)] border overflow-y-auto">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Label className="flex-shrink-0">Mode:</Label>
                          <div className="flex items-center space-x-2">
                            <Label className="text-primary font-medium text-sm">
                              In-session assessment
                            </Label>
                            <Switch />
                            <Label className="text-muted-foreground text-sm">
                              Self-Guided assessment
                            </Label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Client Information</h4>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm">
                              <div><strong>Name:</strong> {appointment.clientName}</div>
                              <div><strong>Gender:</strong> {appointment.clientGender}</div>
                              <div><strong>Age:</strong> {Math.floor((new Date().getTime() - new Date(appointment.clientDOB).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years</div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Assessment Scale</Label>
                          <Button
                            onClick={() => setIsAssessmentDialogOpen(true)}
                            className="w-full"
                            variant="outline"
                          >
                            Select Assessment Scale
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assessment Dialog */}
      <AddAssessmentDialog 
        open={isAssessmentDialogOpen} 
        onOpenChange={setIsAssessmentDialogOpen}
        onAddAssessment={handleAddAssessment}
        clientName={appointment.clientName}
        clientInfo={{
          gender: appointment.clientGender,
          age: Math.floor((new Date().getTime() - new Date(appointment.clientDOB).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        }}
      />

      {/* Warning Dialog */}
      <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Warning: Data Loss
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction === 'toggle' 
                ? "Switching between Template and Freestyle modes will clear your current notes. Are you sure you want to continue?"
                : "Going back will clear all your current note data. Are you sure you want to continue?"
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleWarningCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleWarningConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AppointmentDetailsDialog;