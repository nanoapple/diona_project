import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Phone, Video, User, PlayCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import AddNotesDialog from '@/components/caseSilo/AddNotesDialog';

interface Appointment {
  id: string;
  title: string;
  clientName: string;
  clientGender: string;
  clientDOB: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'in-person' | 'telehealth' | 'phone';
  arrivalStatus: 'Arrived' | 'Late' | 'Rescheduled' | 'Missed' | 'Pending';
  notes: string;
  appointmentNumber: number;
  financialYear: string;
}

interface AppointmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
}

const AppointmentDetailsDialog = ({ open, onOpenChange, appointment }: AppointmentDetailsDialogProps) => {
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [arrivalStatus, setArrivalStatus] = useState<'Arrived' | 'Late' | 'Rescheduled' | 'Missed' | 'Pending'>(appointment?.arrivalStatus || 'Pending');

  if (!appointment) return null;

  // Update local state when appointment changes
  if (appointment && arrivalStatus !== appointment.arrivalStatus) {
    setArrivalStatus(appointment.arrivalStatus);
  }

  const arrivalStatusOptions = [
    { value: 'Pending' as const, label: 'Pending' },
    { value: 'Arrived' as const, label: 'Arrived' },
    { value: 'Late' as const, label: 'Late' },
    { value: 'Rescheduled' as const, label: 'Rescheduled' },
    { value: 'Missed' as const, label: 'Missed' }
  ];

  const handleArrivalStatusChange = (value: string) => {
    setArrivalStatus(value as 'Arrived' | 'Late' | 'Rescheduled' | 'Missed' | 'Pending');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              The {appointment.appointmentNumber} appointment of {appointment.financialYear}
            </DialogTitle>
          </DialogHeader>
          
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
                  {getTypeIcon(appointment.type)}
                  <span><strong>Type:</strong> {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}</span>
                </div>
              </div>
            </div>

            {/* Arrival Status */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">Arrival Status:</span>
              </div>
              <Select value={arrivalStatus} onValueChange={handleArrivalStatusChange}>
                <SelectTrigger className="w-48 bg-background border shadow-sm">
                  <SelectValue />
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

            {/* Contextual Info */}
            {appointment.notes && (
              <div>
                <div className="font-medium mb-2">Contextual Info:</div>
                <div className="bg-yellow-50 p-3 rounded text-sm">
                  {appointment.notes}
                </div>
              </div>
            )}

            {/* Start Session Button */}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={() => setIsNotesDialogOpen(true)}
                className="flex items-center gap-2"
                size="lg"
              >
                <PlayCircle className="h-5 w-5" />
                Start Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Notes Dialog */}
      <AddNotesDialog 
        open={isNotesDialogOpen} 
        onOpenChange={setIsNotesDialogOpen}
        onSave={(noteData) => {
          console.log('Note saved:', noteData);
          setIsNotesDialogOpen(false);
        }}
      />
    </>
  );
};

export default AppointmentDetailsDialog;