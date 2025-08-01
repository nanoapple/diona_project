
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, startOfWeek, endOfWeek, addDays, isSameWeek, isSameDay } from 'date-fns';
import { Plus, CheckCircle, AlertCircle, RotateCcw, XCircle, Check } from 'lucide-react';
import CreateAppointmentDialog from '@/components/schedule/CreateAppointmentDialog';
import AppointmentDetailsDialog from '@/components/schedule/AppointmentDetailsDialog';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedWeek, setSelectedWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
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
      type: 'General Session' as const,
      deliveryMethod: 'in-person' as const,
      arrivalStatus: 'Arrived' as const,
      notes: 'First session focusing on work-related stress and anxiety management techniques.',
      appointmentNumber: 3,
      financialYear: 'Yr 24/25',
      dayName: 'Tue',
      startSlot: 5, // 10:15 is the 5th slot (starting from 9:00)
      duration: 3, // 45 minutes = 3 slots
      sessionNoteDone: true, // For demonstration
      assessmentDone: true // For demonstration
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
      type: 'General Session' as const,
      deliveryMethod: 'telehealth' as const,
      arrivalStatus: '' as any, // Blank status
      notes: 'Continuation of CBT therapy for anxiety disorders. Review homework assignments.',
      appointmentNumber: 7,
      financialYear: 'Yr 24/25',
      dayName: 'Thu',
      startSlot: 22, // 14:30 (2:30 PM)
      duration: 3, // 45 minutes
      sessionNoteDone: false,
      assessmentDone: false
    },
    {
      id: 'apt3',
      title: 'Therapy Session',
      clientName: 'Robert Johnson',
      clientGender: 'Male',
      clientDOB: '08/12/1982',
      date: weekDays[0]?.date, // Monday
      startTime: '11:00',
      endTime: '11:45',
      type: 'General Session' as const,
      deliveryMethod: 'in-person' as const,
      arrivalStatus: '' as any,
      notes: 'Stress management and coping strategies discussion.',
      appointmentNumber: 4,
      financialYear: 'Yr 24/25',
      dayName: 'Mon',
      startSlot: 8, // 11:00
      duration: 3, // 45 minutes
      sessionNoteDone: false,
      assessmentDone: false
    },
    {
      id: 'apt4',
      title: 'Initial Consultation',
      clientName: 'Sarah Wilson',
      clientGender: 'Female',
      clientDOB: '05/11/1988',
      date: weekDays[2]?.date, // Wednesday
      startTime: '11:00',
      endTime: '11:45',
      type: 'Intake Session' as const,
      deliveryMethod: 'in-person' as const,
      arrivalStatus: '' as any, // No status - not started
      notes: 'First consultation to assess client needs and develop treatment plan.',
      appointmentNumber: 1,
      financialYear: 'Yr 24/25',
      dayName: 'Wed',
      startSlot: 8, // 11:00
      duration: 3, // 45 minutes
      sessionNoteDone: false,
      assessmentDone: false
    },
    {
      id: 'apt5',
      title: 'Therapy Session',
      clientName: 'Michael Brown',
      clientGender: 'Male',
      clientDOB: '18/07/1975',
      date: weekDays[4]?.date, // Friday
      startTime: '09:30',
      endTime: '10:15',
      type: 'General Session' as const,
      deliveryMethod: 'telehealth' as const,
      arrivalStatus: '' as any, // No status - not started
      notes: 'Cognitive behavioral therapy session for depression management.',
      appointmentNumber: 5,
      financialYear: 'Yr 24/25',
      dayName: 'Fri',
      startSlot: 2, // 09:30
      duration: 3, // 45 minutes
      sessionNoteDone: false,
      assessmentDone: false
    },
    {
      id: 'apt6',
      title: 'Assessment Session',
      clientName: 'Emma Davis',
      clientGender: 'Female',
      clientDOB: '12/09/1990',
      date: weekDays[1]?.date, // Tuesday
      startTime: '13:45',
      endTime: '14:30',
      type: 'Assessment Session' as const,
      deliveryMethod: 'in-person' as const,
      arrivalStatus: '' as any, // No status - not started
      notes: 'Comprehensive psychological assessment for anxiety and mood disorders.',
      appointmentNumber: 2,
      financialYear: 'Yr 24/25',
      dayName: 'Tue',
      startSlot: 19, // 13:45
      duration: 3, // 45 minutes
      sessionNoteDone: false,
      assessmentDone: false
    },
    {
      id: 'apt7',
      title: 'Therapy Session',
      clientName: 'Lisa Anderson',
      clientGender: 'Female',
      clientDOB: '25/04/1991',
      date: weekDays[0]?.date, // Monday
      startTime: '14:00',
      endTime: '14:45',
      type: 'General Session' as const,
      deliveryMethod: 'in-person' as const,
      arrivalStatus: '' as any,
      notes: 'PTSD treatment using EMDR therapy techniques.',
      appointmentNumber: 8,
      financialYear: 'Yr 24/25',
      dayName: 'Mon',
      startSlot: 20, // 14:00
      duration: 3, // 45 minutes
      sessionNoteDone: false,
      assessmentDone: false
    },
    {
      id: 'apt8',
      title: 'Follow-up Session',
      clientName: 'David Miller',
      clientGender: 'Male',
      clientDOB: '16/01/1979',
      date: weekDays[2]?.date, // Wednesday
      startTime: '15:30',
      endTime: '16:15',
      type: 'General Session' as const,
      deliveryMethod: 'telehealth' as const,
      arrivalStatus: '' as any,
      notes: 'Progress review and adjustment of treatment goals.',
      appointmentNumber: 12,
      financialYear: 'Yr 24/25',
      dayName: 'Wed',
      startSlot: 26, // 15:30
      duration: 3, // 45 minutes
      sessionNoteDone: false,
      assessmentDone: false
    },
    {
      id: 'apt9',
      title: 'Group Session',
      clientName: 'Michelle Torres',
      clientGender: 'Female',
      clientDOB: '03/06/1987',
      date: weekDays[3]?.date, // Thursday
      startTime: '10:00',
      endTime: '10:45',
      type: 'General Session' as const,
      deliveryMethod: 'in-person' as const,
      arrivalStatus: '' as any,
      notes: 'Group therapy session focusing on social anxiety management.',
      appointmentNumber: 6,
      financialYear: 'Yr 24/25',
      dayName: 'Thu',
      startSlot: 4, // 10:00
      duration: 3, // 45 minutes
      sessionNoteDone: false,
      assessmentDone: false
    },
    {
      id: 'apt10',
      title: 'Therapy Session',
      clientName: 'Thomas Wilson',
      clientGender: 'Male',
      clientDOB: '29/10/1984',
      date: weekDays[4]?.date, // Friday
      startTime: '13:00',
      endTime: '13:45',
      type: 'General Session' as const,
      deliveryMethod: 'in-person' as const,
      arrivalStatus: '' as any,
      notes: 'Anger management and emotional regulation techniques.',
      appointmentNumber: 9,
      financialYear: 'Yr 24/25',
      dayName: 'Fri',
      startSlot: 16, // 13:00
      duration: 3, // 45 minutes
      sessionNoteDone: false,
      assessmentDone: false
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

  // Function to get appointment color based on type
  const getAppointmentColor = (type: string) => {
    if (type === 'General Session') return 'bg-orange-200 hover:bg-orange-300';
    if (type === 'Intake Session') return 'bg-emerald-200 hover:bg-emerald-300';
    if (type === 'Discharge Session') return 'bg-rose-200 hover:bg-rose-300';
    if (type === 'Assessment Session') return 'bg-blue-200 hover:bg-blue-300';
    if (type.includes('Team Meeting')) return 'bg-green-200 hover:bg-green-300';
    if (type === 'Supervision') return 'bg-purple-200 hover:bg-purple-300';
    if (type === 'Administrative Task') return 'bg-yellow-200 hover:bg-yellow-300';
    return 'bg-gray-200 hover:bg-gray-300';
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
                        className={`px-2 py-1 text-xs cursor-pointer transition-colors relative ${getAppointmentColor(appointment.type)} ${!isLastSlot ? 'border-b-0' : 'border-b border-gray-400'}`}
                        style={{ height: '20px', minHeight: '20px', maxHeight: '20px' }}
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
                          <div className="absolute top-1/2 right-1 transform -translate-y-1/2 flex items-center gap-1">
                            <div className={`px-1 text-[9px] font-medium text-white rounded-md border ${
                              appointment.arrivalStatus === 'Arrived' ? 'bg-green-600 border-green-600' :
                              appointment.arrivalStatus === 'Late' ? 'bg-yellow-600 border-yellow-600' :
                              appointment.arrivalStatus === 'Rescheduled' ? 'bg-blue-600 border-blue-600' :
                              appointment.arrivalStatus === 'Missed' ? 'bg-red-600 border-red-600' : ''
                            }`}>
                              {appointment.arrivalStatus}
                            </div>
                            {/* Show tick icons only for Arrived and Late status */}
                            {(appointment.arrivalStatus === 'Arrived' || appointment.arrivalStatus === 'Late') && (
                              <div className="flex items-center gap-0.5">
                                {/* Green tick for session note completion */}
                                {appointment.sessionNoteDone && (
                                  <div className="w-3 h-3 bg-green-600 rounded-full flex items-center justify-center">
                                    <Check size={6} className="text-white" />
                                  </div>
                                )}
                                {/* Black tick for assessment completion */}
                                {appointment.assessmentDone && (
                                  <div className="w-3 h-3 bg-black rounded-full flex items-center justify-center">
                                    <Check size={6} className="text-white" />
                                  </div>
                                )}
                              </div>
                            )}
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
                      style={{ height: '20px', minHeight: '20px', maxHeight: '20px' }}
                      onClick={() => handleSlotClick(slotId)}
                    >
                      {slot.display && (
                        <span className={`text-xs ${slot.isHour ? 'text-gray-800 font-medium' : 'text-gray-400 font-normal'}`}>
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
