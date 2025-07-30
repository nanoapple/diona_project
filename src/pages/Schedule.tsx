
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, startOfWeek, endOfWeek, addDays, isSameWeek, isSameDay } from 'date-fns';
import { Plus, CheckCircle, AlertCircle, RotateCcw, XCircle } from 'lucide-react';
import CreateAppointmentDialog from '@/components/schedule/CreateAppointmentDialog';
import AppointmentDetailsDialog from '@/components/schedule/AppointmentDetailsDialog';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogDate, setDialogDate] = useState<Date>();
  const [dialogTime, setDialogTime] = useState<string>();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isAppointmentDetailsOpen, setIsAppointmentDetailsOpen] = useState(false);

  const handleDateClick = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedWeek(startOfWeek(date, { weekStartsOn: 1 })); // Monday as start of week
    }
  };

  const handleSlotClick = (slotId: string) => {
    setSelectedSlot(selectedSlot === slotId ? null : slotId);
  };

  const handleAddClick = (slotId: string) => {
    const [dayName, time] = slotId.split('-');
    const weekDays = generateWeekDays();
    const selectedDay = weekDays.find(day => day.dayName === dayName);
    
    if (selectedDay) {
      setDialogDate(selectedDay.date);
      setDialogTime(time);
      setIsDialogOpen(true);
    }
  };

  // Generate time slots from 9:00 AM to 6:00 PM with 15-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === 18 && minute > 0) break; // Stop at 6:00 PM
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time,
          isHour: minute === 0,
          display: minute === 0 ? `${hour}:00` : time // Show actual time for intervals
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Generate days of the week starting from Monday
  const generateWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(selectedWeek, i);
      days.push({
        date: day,
        dayName: format(day, 'EEE'),
        dayNumber: format(day, 'd'),
        isWeekend: i >= 5, // Saturday and Sunday
      });
    }
    return days;
  };

  const weekDays = generateWeekDays();

  // Mock appointments data - now using state to allow updates
  const [appointments, setAppointments] = useState([
    {
      id: 'apt1',
      title: 'Initial Assessment',
      clientName: 'John Doe',
      clientGender: 'Male',
      clientDOB: '15/03/1985',
      date: weekDays[1]?.date, // Tuesday
      startTime: '10:15',
      endTime: '11:00',
      type: 'in-person' as const,
      arrivalStatus: 'Arrived' as const,
      notes: 'First session focusing on work-related stress and anxiety management techniques.',
      appointmentNumber: 3,
      financialYear: 'Yr 24/25',
      dayName: 'Tue',
      startSlot: 5, // 10:15 is the 5th slot (starting from 9:00)
      duration: 3 // 45 minutes = 3 slots
    },
    {
      id: 'apt2',
      title: 'Follow-up Session',
      clientName: 'Jane Smith',
      clientGender: 'Female',
      clientDOB: '22/08/1992',
      date: weekDays[3]?.date, // Thursday
      startTime: '14:30',
      endTime: '15:15',
      type: 'telehealth' as const,
      arrivalStatus: '' as any, // Blank status
      notes: 'Continuation of CBT therapy for anxiety disorders. Review homework assignments.',
      appointmentNumber: 7,
      financialYear: 'Yr 24/25',
      dayName: 'Thu',
      startSlot: 22, // 14:30 (2:30 PM)
      duration: 3 // 45 minutes
    },
    {
      id: 'apt3',
      title: 'Crisis Session',
      clientName: 'Bob Wilson',
      clientGender: 'Male',
      clientDOB: '10/12/1978',
      date: weekDays[0]?.date, // Monday
      startTime: '16:00',
      endTime: '17:00',
      type: 'phone' as const,
      arrivalStatus: 'Late' as const,
      notes: 'Emergency session to address acute stress response following workplace incident.',
      appointmentNumber: 1,
      financialYear: 'Yr 24/25',
      dayName: 'Mon',
      startSlot: 28, // 16:00 (4:00 PM)
      duration: 4 // 60 minutes
    }
  ]);

  // Handler to update appointment status
  const handleStatusUpdate = (appointmentId: string, status: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, arrivalStatus: status as any }
        : apt
    ));
  };

  // Function to check if a slot has an appointment
  const getAppointmentForSlot = (dayName: string, slotIndex: number) => {
    return appointments.find(apt => 
      apt.dayName === dayName && 
      slotIndex >= apt.startSlot && 
      slotIndex < apt.startSlot + apt.duration
    );
  };

  // Function to handle appointment click
  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsAppointmentDetailsOpen(true);
  };

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Arrived':
        return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'Late':
        return <AlertCircle className="h-3 w-3 text-yellow-600" />;
      case 'Rescheduled':
        return <RotateCcw className="h-3 w-3 text-blue-600" />;
      case 'Missed':
        return <XCircle className="h-3 w-3 text-red-600" />;
      default:
        return null;
    }
  };

  // Mock stats for the selected week
  const weekStats = {
    clients: 12,
    assessments: 8,
    reports: 5,
    notes: 23,
    meetings: 9
  };

  // Mock key events for the selected week
  const keyEvents = [
    "Team Meeting - Monday 10:00 AM",
    "Client Assessment - Tuesday 2:00 PM", 
    "Report Review - Wednesday 11:00 AM",
    "Case Conference - Thursday 3:30 PM",
    "Weekly Planning - Friday 4:00 PM"
  ];

  return (
    <div className="h-screen flex flex-col p-4 pt-2 overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <div className="text-sm text-muted-foreground">
          Week of {format(selectedWeek, 'MMM d, yyyy')}
        </div>
      </div>

      {/* Main content area - condensed weekday panels */}
      <div className="h-[calc(65vh-80px)] grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day, index) => (
          <Card 
            key={index} 
            className={`${day.isWeekend ? 'bg-green-50' : 'bg-blue-50'} rounded-lg overflow-hidden`}
          >
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-sm font-medium text-center">
                {day.dayName} {day.dayNumber}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <div className="space-y-0 overflow-y-auto h-[calc(65vh-140px)]">
                {timeSlots.map((slot, slotIndex) => {
                  const slotId = `${day.dayName}-${slot.time}`;
                  const isSelected = selectedSlot === slotId;
                  const appointment = getAppointmentForSlot(day.dayName, slotIndex);
                  
                  if (appointment) {
                    // Check if this is the first slot of the appointment to show the full content
                    const isFirstSlot = slotIndex === appointment.startSlot;
                    const isLastSlot = slotIndex === appointment.startSlot + appointment.duration - 1;
                    
                    return (
                      <div
                        key={slotIndex}
                        className={`px-2 py-1 text-xs cursor-pointer transition-colors relative ${
                          appointment.type === 'in-person' ? 'bg-orange-200 hover:bg-orange-300' :
                          appointment.type === 'telehealth' ? 'bg-green-200 hover:bg-green-300' :
                          'bg-purple-200 hover:bg-purple-300'
                        } ${!isLastSlot ? 'border-b-0' : 'border-b border-gray-400'}`}
                        style={{ height: '14px', minHeight: '14px', maxHeight: '14px' }}
                        onClick={() => handleAppointmentClick(appointment)}
                      >
                        {isFirstSlot && (
                          <div className="text-black font-medium overflow-hidden">
                            <div className="truncate leading-3">
                              {appointment.clientName}
                            </div>
                          </div>
                        )}
                        {!isFirstSlot && !isLastSlot && (
                          <div className="text-black font-medium overflow-hidden">
                            <div className="truncate leading-3 text-[10px] opacity-80">
                              {appointment.notes}
                            </div>
                          </div>
                        )}
                        {/* Status indicator in the last slot */}
                        {isLastSlot && appointment.arrivalStatus && appointment.arrivalStatus !== '' && (
                          <div className="absolute bottom-0 right-1">
                            <div className={`px-1 py-0.5 text-[8px] font-bold text-white rounded ${
                              appointment.arrivalStatus === 'Arrived' ? 'bg-green-600' :
                              appointment.arrivalStatus === 'Late' ? 'bg-yellow-600' :
                              appointment.arrivalStatus === 'Rescheduled' ? 'bg-blue-600' :
                              appointment.arrivalStatus === 'Missed' ? 'bg-red-600' : ''
                            }`}>
                              {appointment.arrivalStatus}
                            </div>
                          </div>
                        )}
                        {!isFirstSlot && slot.display && (
                          <span className="text-transparent select-none">{slot.display}</span>
                        )}
                      </div>
                    );
                  }
                  
                  return (
                    <div
                      key={slotIndex}
                      className={`px-2 py-1 text-xs cursor-pointer transition-colors relative group ${
                        slot.isHour 
                          ? 'border-b border-gray-400 font-medium' 
                          : 'border-b border-dotted border-gray-300'
                      } ${isSelected ? 'bg-blue-200' : 'hover:bg-gray-100'}`}
                      style={{ height: '14px', minHeight: '14px', maxHeight: '14px' }}
                      onClick={() => handleSlotClick(slotId)}
                    >
                      {slot.display && (
                        <span className={slot.isHour ? 'text-black' : 'text-white'}>
                          {slot.display}
                        </span>
                      )}
                      {isSelected && (
                        <Button
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-4 px-1 text-xs min-w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddClick(slotId);
                          }}
                        >
                          <Plus size={10} />
                          Add
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom section - reorganized layout */}
      <div className="h-[calc(35vh)] flex gap-6">
        {/* Calendar - condensed and resized to match Mon+Tue width */}
        <div className="w-[calc(28.57%*2+0.5rem)]"> {/* Width of 2 columns plus gap */}
          <Card className="h-full">
            <CardContent className="p-1 h-full flex items-center justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateClick}
                className="rounded-md border-0 scale-75 origin-center"
                weekStartsOn={1}
                modifiers={{
                  selectedWeek: (date) => selectedDate ? isSameWeek(date, selectedDate, { weekStartsOn: 1 }) : false
                }}
                modifiersStyles={{
                  selectedWeek: { backgroundColor: '#dbeafe', fontWeight: 'bold' }
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Weekly Stats - adjusted width */}
        <div className="w-[calc(28.57%*2.5)]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Week Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Clients:</span>
                <span className="font-medium">{weekStats.clients}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Assessments:</span>
                <span className="font-medium">{weekStats.assessments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Reports:</span>
                <span className="font-medium">{weekStats.reports}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Notes:</span>
                <span className="font-medium">{weekStats.notes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Meetings:</span>
                <span className="font-medium">{weekStats.meetings}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Events - adjusted width */}
        <div className="w-[calc(28.57%*2.5)]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Key Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 overflow-y-auto">
              {keyEvents.map((event, index) => (
                <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                  {event}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Appointment Dialog */}
      <CreateAppointmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedDate={dialogDate}
        selectedTime={dialogTime}
      />

      {/* Appointment Details Dialog */}
      <AppointmentDetailsDialog
        open={isAppointmentDetailsOpen}
        onOpenChange={setIsAppointmentDetailsOpen}
        appointment={selectedAppointment}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default Schedule;
