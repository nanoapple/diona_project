
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, startOfWeek, endOfWeek, addDays, isSameWeek, isSameDay } from 'date-fns';
import { Plus } from 'lucide-react';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleDateClick = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedWeek(startOfWeek(date, { weekStartsOn: 1 })); // Monday as start of week
    }
  };

  const handleSlotClick = (slotId: string) => {
    setSelectedSlot(selectedSlot === slotId ? null : slotId);
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
          display: minute === 0 ? `${hour}:00` : ''
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
    <div className="h-screen flex flex-col p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Schedule</h1>
        <div className="text-sm text-muted-foreground">
          Week of {format(selectedWeek, 'MMM d, yyyy')}
        </div>
      </div>

      {/* Main content area - condensed weekday panels */}
      <div className="h-[calc(65vh-100px)] grid grid-cols-7 gap-2 mb-4">
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
              <div className="space-y-0 overflow-y-auto h-[calc(65vh-160px)]">
                {timeSlots.map((slot, slotIndex) => {
                  const slotId = `${day.dayName}-${slot.time}`;
                  const isSelected = selectedSlot === slotId;
                  
                  return (
                    <div
                      key={slotIndex}
                      className={`px-2 py-1 text-xs cursor-pointer transition-colors relative group ${
                        slot.isHour 
                          ? 'border-b border-gray-400 font-medium' 
                          : 'border-b border-dotted border-gray-300'
                      } ${isSelected ? 'bg-blue-200' : 'hover:bg-gray-100'}`}
                      style={{ minHeight: '17px' }}
                      onClick={() => handleSlotClick(slotId)}
                    >
                      {slot.display && (
                        <span className="text-gray-600">{slot.display}</span>
                      )}
                      {isSelected && (
                        <Button
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-4 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log(`Add event at ${slotId}`);
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
        {/* Calendar - moved to bottom left, original size */}
        <div className="w-[35%]">
          <Card className="h-full">
            <CardContent className="p-3 h-full flex items-center justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateClick}
                className="rounded-md border-0"
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
        <div className="w-[30%]">
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
        <div className="w-[35%]">
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
    </div>
  );
};

export default Schedule;
