import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Phone, Video, User, PlayCircle, MessageSquare, ClipboardList, Mic, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import AddNotesDialog from '@/components/caseSilo/AddNotesDialog';
import { AddAssessmentDialog } from '@/components/assessments/AddAssessmentDialog';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

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

const AppointmentDetailsDialog = ({ open, onOpenChange, appointment, onStatusUpdate }: AppointmentDetailsDialogProps) => {
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [showSplitView, setShowSplitView] = useState(false);
  const [arrivalStatus, setArrivalStatus] = useState<'Arrived' | 'Late' | 'Rescheduled' | 'Missed' | ''>(appointment?.arrivalStatus || '');
  
  // State for additional fields
  const [referralSource, setReferralSource] = useState('');
  const [presentingIssues, setPresentingIssues] = useState<string[]>([]);
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [dischargeReason, setDischargeReason] = useState('');
  const [followUpPlan, setFollowUpPlan] = useState('');

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
    'Anxiety', 'PTSD', 'Work stress', 'Depression', 'Grief', 'Relationship issues',
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
            <Label>Presenting Issues (Tags)</Label>
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
              Go to case silo
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
                {/* Left Panel - Add Case Note */}
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="p-4 bg-blue-50/30 border-r border-blue-200 h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Add Case Note</h3>
                    </div>
                    <div className="bg-white rounded-lg p-4 h-[calc(100%-4rem)] border overflow-y-auto">
                      <p className="text-sm text-muted-foreground mb-4">
                        Choose how you'd like to create your case note:
                      </p>
                      
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full h-12 justify-start text-left"
                          onClick={() => setIsNotesDialogOpen(true)}
                        >
                          <div className="flex items-center gap-3">
                            <MessageSquare className="w-4 h-4 text-primary" />
                            <div>
                              <div className="font-medium text-sm">Write your own notes</div>
                              <div className="text-xs text-muted-foreground">Manually enter structured clinical notes</div>
                            </div>
                          </div>
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="w-full h-12 justify-start text-left"
                          onClick={() => setIsNotesDialogOpen(true)}
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
                          onClick={() => setIsNotesDialogOpen(true)}
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
                    </div>
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                {/* Right Panel - Add Assessment */}
                <ResizablePanel defaultSize={50} minSize={30}>
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

      {/* Separate dialogs for Add Notes and Add Assessment */}
      <AddNotesDialog 
        open={isNotesDialogOpen} 
        onOpenChange={setIsNotesDialogOpen}
        onSave={(noteData) => {
          console.log('Note saved:', noteData);
          setIsNotesDialogOpen(false);
        }}
      />

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
    </>
  );
};

export default AppointmentDetailsDialog;