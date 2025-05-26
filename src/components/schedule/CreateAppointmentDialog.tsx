
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
    title: '',
    type: '',
    date: selectedDate || new Date(),
    startTime: selectedTime || '',
    endTime: '',
    duration: '60',
    isRecurring: false,
    recurringType: '',
    caseSilo: '',
    client: '',
    isMilestone: false,
    milestoneType: '',
    mode: 'in-person',
    location: '',
    attendees: [] as string[],
    notes: '',
    reminders: true,
    colorTag: 'blue',
    privacy: 'shared'
  });

  const [newAttendee, setNewAttendee] = useState('');

  // Role-based appointment types
  const getAppointmentTypes = () => {
    const commonTypes = ['Team Meeting', 'Admin', 'Reminder'];
    
    switch (currentUser?.role) {
      case 'psychologist':
        return ['Client Session', 'Assessment', 'Clinical Review', ...commonTypes];
      case 'lawyer':
        return ['Legal Briefing', 'Case Review', 'Document Review', 'Court Appearance', ...commonTypes];
      case 'claimant':
        return ['Consultation', 'Appointment'];
      default:
        return commonTypes;
    }
  };

  const timeSlots = Array.from({ length: 40 }, (_, i) => {
    const hour = Math.floor(i / 4) + 9;
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const durationOptions = ['15', '30', '45', '60', '90', '120'];
  const milestoneTypes = ['Key Session', 'Document', 'Assessment', 'Report', 'Decision'];
  const recurringTypes = ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'];
  const colorTags = [
    { value: 'green', label: 'Clinical', color: 'bg-green-500' },
    { value: 'blue', label: 'Legal', color: 'bg-blue-500' },
    { value: 'yellow', label: 'Admin', color: 'bg-yellow-500' },
    { value: 'red', label: 'Urgent', color: 'bg-red-500' },
    { value: 'purple', label: 'Personal', color: 'bg-purple-500' }
  ];

  const mockCaseSilos = ['Case #2024-001: John Doe - Work Injury', 'Case #2024-002: Jane Smith - MVA', 'Case #2024-003: Bob Wilson - Stress Claim'];
  const mockClients = ['John Doe', 'Jane Smith', 'Bob Wilson', 'Sarah Johnson', 'Mike Brown'];

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
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">1. Appointment Basics</h3>
              
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Jane Smith – Return to Work Plan"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  disabled={isLimitedUser}
                />
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  disabled={isLimitedUser}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAppointmentTypes().map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.date && "text-muted-foreground"
                        )}
                        disabled={isLimitedUser}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
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

            {/* Case/Client Association */}
            {!isLimitedUser && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">2. Case/Client Association</h3>
                
                <div>
                  <Label htmlFor="caseSilo">Link to Case Silo</Label>
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

                <div>
                  <Label htmlFor="client">Link to Client</Label>
                  <Select
                    value={formData.client}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, client: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients.map(client => (
                        <SelectItem key={client} value={client}>{client}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="milestone"
                      checked={formData.isMilestone}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isMilestone: checked }))}
                    />
                    <Label htmlFor="milestone">Mark this session as a Key Milestone</Label>
                  </div>
                  {formData.isMilestone && (
                    <Select
                      value={formData.milestoneType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, milestoneType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select milestone type" />
                      </SelectTrigger>
                      <SelectContent>
                        {milestoneTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Location & Modality */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">3. Location & Modality</h3>
              
              <div>
                <Label>Mode</Label>
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
                  {formData.mode === 'in-person' ? 'Location' : 'Meeting Link/Phone'}
                </Label>
                <Input
                  id="location"
                  placeholder={
                    formData.mode === 'in-person' 
                      ? "Enter address" 
                      : formData.mode === 'telehealth' 
                        ? "Enter Zoom link" 
                        : "Enter phone number"
                  }
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  disabled={isLimitedUser}
                />
              </div>
            </div>

            {/* Collaborators / Attendees */}
            {!isLimitedUser && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">4. Collaborators / Attendees</h3>
                
                <div>
                  <Label htmlFor="attendees">Invite Others</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter email or name"
                      value={newAttendee}
                      onChange={(e) => setNewAttendee(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addAttendee()}
                    />
                    <Button type="button" size="sm" onClick={addAttendee}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.attendees.map(attendee => (
                      <div key={attendee} className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded text-sm">
                        {attendee}
                        <button onClick={() => removeAttendee(attendee)}>
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notes & Smart Suggestions */}
            <div className="space-y-3">
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

              {!isLimitedUser && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 <strong>Confee Suggestion:</strong> Would you like to review the DASS-21 result before this meeting?
                  </p>
                </div>
              )}
            </div>

            {/* Reminders & Visual Labels */}
            <div className="space-y-3">
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
                <Label>Colour Tag / Category</Label>
                <div className="flex gap-2 mt-2">
                  {colorTags.map(tag => (
                    <button
                      key={tag.value}
                      className={cn(
                        "px-3 py-1 rounded text-sm text-white",
                        tag.color,
                        formData.colorTag === tag.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                      )}
                      onClick={() => setFormData(prev => ({ ...prev, colorTag: tag.value }))}
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
                      <SelectItem value="private">Private (user only)</SelectItem>
                      <SelectItem value="shared">Shared with Case Silo participants</SelectItem>
                      <SelectItem value="team">Team only</SelectItem>
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
          <Button onClick={handleSave} disabled={!formData.title || !formData.type}>
            Save Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentDialog;
