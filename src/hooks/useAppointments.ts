import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, startOfWeek, addDays } from 'date-fns';

export interface Appointment {
  id: string;
  title: string;
  clientName: string;
  clientGender?: string;
  clientDOB?: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'General Session' | 'Intake Session' | 'Discharge Session' | 'Assessment Session' | 'Team Meeting (Internal)' | 'Team Meeting (External)' | 'Supervision' | 'Administrative Task';
  deliveryMethod: 'in-person' | 'telehealth';
  arrivalStatus: 'Arrived' | 'Late' | 'Rescheduled' | 'Missed' | '' | string;
  notes?: string;
  appointmentNumber?: number;
  financialYear?: string;
  dayName: string;
  startSlot: number;
  duration: number;
  sessionNoteDone?: boolean;
  assessmentDone?: boolean;
}

const mapAppointmentType = (type: string): Appointment['type'] => {
  const typeMap: Record<string, Appointment['type']> = {
    'general': 'General Session',
    'consultation': 'Intake Session',
    'intake': 'Intake Session',
    'therapy': 'General Session',
    'assessment': 'Assessment Session',
    'discharge': 'Discharge Session',
    'legal_meeting': 'Team Meeting (External)',
    'medical_exam': 'Assessment Session',
    'team_internal': 'Team Meeting (Internal)',
    'team_external': 'Team Meeting (External)',
    'supervision': 'Supervision',
    'admin': 'Administrative Task',
  };
  return typeMap[type] || 'General Session';
};

const calculateSlotIndex = (time: string, startHour: number = 9): number => {
  const [hours, minutes] = time.split(':').map(Number);
  const hourOffset = hours - startHour;
  const slotOffset = Math.floor(minutes / 15);
  return hourOffset * 4 + slotOffset;
};

const calculateDuration = (startTime: string, endTime: string): number => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  return Math.ceil((endTotalMinutes - startTotalMinutes) / 15);
};

export const useAppointments = (selectedWeek: Date) => {
  const queryClient = useQueryClient();
  
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);

  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['appointments', format(weekStart, 'yyyy-MM-dd')],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('start_time', weekStart.toISOString())
        .lte('start_time', weekEnd.toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;

      return (data || []).map((apt): Appointment => {
        const startDate = parseISO(apt.start_time);
        const endDate = parseISO(apt.end_time);
        const startTime = format(startDate, 'HH:mm');
        const endTime = format(endDate, 'HH:mm');

        return {
          id: apt.id,
          title: apt.title,
          clientName: apt.title, // Will be replaced with actual client name when linked
          date: startDate,
          startTime,
          endTime,
          type: mapAppointmentType(apt.appointment_type),
          deliveryMethod: apt.location?.includes('telehealth') ? 'telehealth' : 'in-person',
          arrivalStatus: (apt.status === 'arrived' ? 'Arrived' : 
                         apt.status === 'late' ? 'Late' : 
                         apt.status === 'rescheduled' ? 'Rescheduled' : 
                         apt.status === 'missed' ? 'Missed' : '') as Appointment['arrivalStatus'],
          notes: apt.notes || '',
          dayName: format(startDate, 'EEE'),
          startSlot: calculateSlotIndex(startTime),
          duration: calculateDuration(startTime, endTime),
          sessionNoteDone: false,
          assessmentDone: false,
        };
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const dbStatus = status.toLowerCase().replace(' ', '_');
      const { error } = await supabase
        .from('appointments')
        .update({ status: dbStatus })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  return {
    appointments,
    isLoading,
    error,
    updateStatus: (id: string, status: string) => updateStatusMutation.mutate({ id, status }),
  };
};
