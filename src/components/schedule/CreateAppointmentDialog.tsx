
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

const CreateAppointmentDialog = ({ open, onOpenChange, selectedDate, selectedTime }: CreateAppointmentDialogProps) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    appointmentType: '',
    sessionTitle: '',
    date: selectedDate || new Date(),
    startTime: selectedTime || '',
    duration: '60',
    isRecurring: false,
    recurringType: '',
    caseSilo: '',
    client: '',
    isMilestone: false,
    mode: 'in-person',
    location: '',
    attendees: [] as string[],
    notes: '',
    reminders: true,
    colorTags: [] as string[],
    privacy: 'shared',
    // Intake session specific fields
    referralSource: '',
    presentingIssues: [] as string[],
    consentConfirmed: false,
    // Discharge session specific fields
    dischargeReason: '',
    followUpPlan: ''
  });

  const [newAttendee, setNewAttendee] = useState('');

  // Appointment types for all users
  const appointmentTypes = [
    'General Session',
    'Intake Session',
    'Discharge Session',
    'Assessment Session', 
    'Team Meeting (Internal)',
    'Team Meeting (External)',
    'Supervision',
    'Administrative Task',
    'Other'
  ];

  const timeSlots = Array.from({ length: 40 }, (_, i) => {
    const hour = Math.floor(i / 4) + 9;
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const durationOptions = ['15', '30', '45', '60', '90', '120'];
  const recurringTypes = ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'];
  const colorTags = [
    { value: 'clinical', label: 'Clinical', color: 'bg-green-500' },
    { value: 'legal', label: 'Legal', color: 'bg-blue-500' },
    { value: 'admin', label: 'Admin', color: 'bg-yellow-500' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
    { value: 'personal', label: 'Personal', color: 'bg-purple-500' },
    { value: 'ndis', label: 'NDIS', color: 'bg-orange-500' }
  ];

  const mockCaseSilos = ['Case #2024-001: John Doe - Work Injury', 'Case #2024-002: Jane Smith - MVA', 'Case #2024-003: Bob Wilson - Stress Claim'];
  const mockClients = [
    { name: 'John Doe', mobile: '+61 412 345 678' },
    { name: 'Jane Smith', mobile: '+61 423 456 789' },
    { name: 'Bob Wilson', mobile: '+61 434 567 890' },
    { name: 'Sarah Johnson', mobile: '+61 445 678 901' },
    { name: 'Mike Brown', mobile: '+61 456 789 012' }
  ];

  const addAttendee = () => {
    if (newAttendee.trim() && !formData.attendees.includes(newAttendee.trim())) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee.trim()]
      }));
      setNewAttendee('');
    }
  };

  const removeAttendee = (attendee: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(a => a !== attendee)
    }));
  };

  // Check if client-facing appointment type
  const isClientFacing = formData.appointmentType === 'General Session' || 
                          formData.appointmentType === 'Intake Session' || 
                          formData.appointmentType === 'Discharge Session' || 
                          formData.appointmentType === 'Assessment Session';

  // Generate smart suggestions based on appointment type
  const getSmartSuggestion = () => {
    switch (formData.appointmentType) {
      case 'General Session':
        return 'Would you like to review the DASS-21 result before this meeting?';
      case 'Intake Session':
        return 'Prepare intake forms and review referral information.';
      case 'Discharge Session':
        return 'Review treatment outcomes and prepare discharge summary.';
      case 'Assessment Session':
        return 'Consider preparing assessment materials and reviewing previous session notes.';
      case 'Team Meeting (Internal)':
        return 'Review agenda items and prepare case updates for discussion.';
      default:
        return 'Would you like to review the DASS-21 result before this meeting?';
    }
  };

  const handleSave = () => {
    console.log('Saving appointment:', formData);
    // Here you would typically save to your backend
    onOpenChange(false);
  };

  // Check if user has limited permissions
  const isLimitedUser = currentUser?.role === 'claimant';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📌 New Appointment
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Appointment Basics */}
            <div className="space-y-3 p-4 bg-blue-100/50 rounded-lg border border-blue-200/60 shadow-sm">
              <h3 className="font-semibold text-lg">1. Appointment Basics</h3>
              
              <div>
                <Label htmlFor="appointmentType">Appointment Type *</Label>
                <Select
                  value={formData.appointmentType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, appointmentType: value }))}
                  disabled={isLimitedUser}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sessionTitle">Session Title</Label>
                <Input
                  id="sessionTitle"
                  placeholder="e.g., Jane Smith – Trauma Intake, or Weekly Case Review"
                  value={formData.sessionTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, sessionTitle: e.target.value }))}
                  disabled={isLimitedUser}
                />
              </div>
            </div>

            {/* Case/Client Association - Move after session title */}
            {!isLimitedUser && isClientFacing && (
              <div className="space-y-3 p-4 bg-blue-100/50 rounded-lg border border-blue-200/60 shadow-sm">
                <h3 className="font-semibold text-lg">2. Case/Client Association</h3>
                
                <div>
                  <Label htmlFor="client">Client Search Field</Label>
                  <Select
                    value={formData.client}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, client: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients.map(client => (
                        <SelectItem key={client.name} value={client.name}>{client.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.client && (
                  <div>
                    <Label htmlFor="caseSilo">Auto-Link to Case Silo</Label>
                    <Select
                      value={formData.caseSilo}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, caseSilo: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select case silo" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCaseSilos.map(caseSilo => (
                          <SelectItem key={caseSilo} value={caseSilo}>{caseSilo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="milestone"
                    checked={formData.isMilestone}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isMilestone: checked }))}
                  />
                  <Label htmlFor="milestone">Mark this session as a Key Milestone</Label>
                </div>
              </div>
            )}

            {/* Non-client facing appointments show greyed out section */}
            {!isLimitedUser && !isClientFacing && (
              <div className="space-y-3 p-4 bg-blue-100/50 rounded-lg border border-blue-200/60 shadow-sm opacity-50">
                <h3 className="font-semibold text-lg">2. Case/Client Association</h3>
                <p className="text-sm text-muted-foreground">
                  Client linking not available for this appointment type
                </p>
              </div>
            )}

            {/* Date and Time Section */}
            <div className="space-y-3 p-4 bg-blue-100/50 rounded-lg border border-blue-200/60 shadow-sm">
              <h3 className="font-semibold text-lg">3. Date & Time</h3>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Date</Label>
                  <Input
                    value={formData.date ? format(formData.date, "PPP") : ""}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Select
                    value={formData.startTime}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}
                    disabled={isLimitedUser}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Start" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                    disabled={isLimitedUser}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map(duration => (
                        <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {!isLimitedUser && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recurring"
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: checked }))}
                  />
                  <Label htmlFor="recurring">Recurring Event</Label>
                  {formData.isRecurring && (
                    <Select
                      value={formData.recurringType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, recurringType: value }))}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {recurringTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}
            </div>

            {/* Location & Modality */}
            <div className="space-y-3 p-4 bg-blue-100/50 rounded-lg border border-blue-200/60 shadow-sm">
              <h3 className="font-semibold text-lg">4. Location & Modality</h3>
              
              <div>
                <Label>Session Mode</Label>
                <RadioGroup
                  value={formData.mode}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, mode: value }))}
                  disabled={isLimitedUser}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in-person" id="in-person" />
                    <Label htmlFor="in-person">In-person</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="telehealth" id="telehealth" />
                    <Label htmlFor="telehealth">Telehealth (Zoom)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="phone" />
                    <Label htmlFor="phone">Phone</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="location">
                  {formData.mode === 'in-person' && 'Location *'}
                  {formData.mode === 'telehealth' && 'Meeting Link'}
                  {formData.mode === 'phone' && 'Client Mobile Number'}
                </Label>
                {formData.mode === 'phone' ? (
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                    disabled={isLimitedUser || !formData.client}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.client ? "Select client's mobile number" : "Please select a client first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients
                        .filter(client => client.name === formData.client)
                        .map(client => (
                          <SelectItem key={client.mobile} value={client.mobile}>
                            {client.mobile}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="location"
                    placeholder={
                      formData.mode === 'in-person' 
                        ? "Clinic" 
                        : formData.mode === 'telehealth' 
                        ? "Please provide the meeting link here." 
                        : "Enter address"
                    }
                    value={formData.mode === 'in-person' && !formData.location ? 'Clinic' : formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={isLimitedUser}
                    required={formData.mode === 'in-person'}
                  />
                )}
              </div>
            </div>

            {/* Intake Session Specific Fields */}
            {formData.appointmentType === 'Intake Session' && (
              <div className="space-y-3 p-4 bg-emerald-100/50 rounded-lg border border-emerald-200/60 shadow-sm">
                <h3 className="font-semibold text-lg">Intake Session Details</h3>
                
                <div>
                  <Label htmlFor="referralSource">Referral Source</Label>
                  <Select
                    value={formData.referralSource}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, referralSource: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select referral source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gp">GP</SelectItem>
                      <SelectItem value="ndis">NDIS</SelectItem>
                      <SelectItem value="self">Self</SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="presentingIssues">Presenting Issues (Tags)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Anxiety', 'PTSD', 'Work Stress', 'Depression', 'Trauma', 'Sleep Issues'].map(issue => (
                      <Button
                        key={issue}
                        type="button"
                        variant={formData.presentingIssues.includes(issue) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            presentingIssues: prev.presentingIssues.includes(issue)
                              ? prev.presentingIssues.filter(i => i !== issue)
                              : [...prev.presentingIssues, issue]
                          }));
                        }}
                      >
                        {issue}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="consentConfirmed"
                    checked={formData.consentConfirmed}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consentConfirmed: checked }))}
                  />
                  <Label htmlFor="consentConfirmed">Consent Confirmed</Label>
                </div>
              </div>
            )}

            {/* Discharge Session Specific Fields */}
            {formData.appointmentType === 'Discharge Session' && (
              <div className="space-y-3 p-4 bg-rose-100/50 rounded-lg border border-rose-200/60 shadow-sm">
                <h3 className="font-semibold text-lg">Discharge Session Details</h3>
                
                <div>
                  <Label htmlFor="dischargeReason">Reason for Discharge</Label>
                  <Select
                    value={formData.dischargeReason}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, dischargeReason: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select discharge reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="01">01 Service completed</SelectItem>
                      <SelectItem value="02">02 Transferred/referred to another service</SelectItem>
                      <SelectItem value="03">03 Left without notice</SelectItem>
                      <SelectItem value="04">04 Left against advice</SelectItem>
                      <SelectItem value="05">05 Left Involuntarily (non-compliance)</SelectItem>
                      <SelectItem value="06">06 Moved out of area</SelectItem>
                      <SelectItem value="07">07 Sanctioned by drug court/court diversion program</SelectItem>
                      <SelectItem value="08">08 Imprisoned, other than drug court sanction</SelectItem>
                      <SelectItem value="09">09 Released from prison</SelectItem>
                      <SelectItem value="10">10 Died</SelectItem>
                      <SelectItem value="98">98 Other</SelectItem>
                      <SelectItem value="99">99 Not stated/inadequately described</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="followUpPlan">Follow-up Plan (Optional)</Label>
                  <Select
                    value={formData.followUpPlan}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, followUpPlan: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select follow-up plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="periodic">Periodic check-in</SelectItem>
                      <SelectItem value="referred">Referred to another service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Notes & Smart Suggestions */}
            <div className="space-y-3 p-4 bg-blue-100/50 rounded-lg border border-blue-200/60 shadow-sm">
              <h3 className="font-semibold text-lg">5. Notes & Smart Suggestions</h3>
              
              <div>
                <Label htmlFor="notes">Agenda / Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter agenda items or notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  disabled={isLimitedUser}
                  rows={3}
                />
              </div>

              {!isLimitedUser && formData.appointmentType && (
                <div className="p-3 bg-blue-200/70 border border-blue-300/70 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Confee Suggestion:</strong> {getSmartSuggestion()}
                  </p>
                </div>
              )}
            </div>

            {/* Reminders & Visual Labels */}
            <div className="space-y-3 p-4 bg-blue-100/50 rounded-lg border border-blue-200/60 shadow-sm">
              <h3 className="font-semibold text-lg">6. Reminders & Visual Labels</h3>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="reminders"
                  checked={formData.reminders}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, reminders: checked }))}
                />
                <Label htmlFor="reminders">Enable Reminders (In-app, Email)</Label>
              </div>

              <div>
                <Label>Colour Tag / Category (multi-select)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colorTags.map(tag => (
                    <button
                      key={tag.value}
                      className={cn(
                        "px-3 py-1 rounded text-sm text-white transition-all",
                        tag.color,
                        formData.colorTags.includes(tag.value) ? 'ring-2 ring-offset-2 ring-blue-500 scale-105' : 'opacity-70 hover:opacity-100'
                      )}
                      onClick={() => {
                        const isSelected = formData.colorTags.includes(tag.value);
                        setFormData(prev => ({
                          ...prev,
                          colorTags: isSelected 
                            ? prev.colorTags.filter(t => t !== tag.value)
                            : [...prev.colorTags, tag.value]
                        }));
                      }}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {!isLimitedUser && (
                  <div>
                    <Label>Privacy Control</Label>
                    <Select
                      value={formData.privacy}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, privacy: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shared">Shared with Case Silo team</SelectItem>
                        <SelectItem value="private">Private to session organiser</SelectItem>
                        <SelectItem value="internal">Internal use only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.appointmentType || (formData.mode === 'in-person' && !formData.location)}>
            Save Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentDialog;
