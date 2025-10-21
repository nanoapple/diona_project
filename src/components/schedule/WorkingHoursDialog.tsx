import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorkingHoursDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workingHours: Record<string, { start: number; end: number }>;
  onSave: (hours: Record<string, { start: number; end: number }>) => void;
}

export default function WorkingHoursDialog({ open, onOpenChange, workingHours, onSave }: WorkingHoursDialogProps) {
  const [localHours, setLocalHours] = useState(workingHours);

  const days = [
    { key: 'Mon', label: 'Monday' },
    { key: 'Tue', label: 'Tuesday' },
    { key: 'Wed', label: 'Wednesday' },
    { key: 'Thu', label: 'Thursday' },
    { key: 'Fri', label: 'Friday' },
    { key: 'Sat', label: 'Saturday' },
    { key: 'Sun', label: 'Sunday' },
  ];

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleStartChange = (day: string, hour: number) => {
    setLocalHours(prev => ({
      ...prev,
      [day]: { ...prev[day], start: hour }
    }));
  };

  const handleEndChange = (day: string, hour: number) => {
    setLocalHours(prev => ({
      ...prev,
      [day]: { ...prev[day], end: hour }
    }));
  };

  const handleSave = () => {
    onSave(localHours);
    onOpenChange(false);
  };

  const handleReset = () => {
    const defaultHours = {
      Mon: { start: 9, end: 18 },
      Tue: { start: 9, end: 18 },
      Wed: { start: 9, end: 18 },
      Thu: { start: 9, end: 18 },
      Fri: { start: 9, end: 18 },
      Sat: { start: 9, end: 18 },
      Sun: { start: 9, end: 18 },
    };
    setLocalHours(defaultHours);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Working Hours</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {days.map(day => (
            <div key={day.key} className="grid grid-cols-[100px_1fr_1fr] gap-4 items-center">
              <Label className="text-sm font-medium">{day.label}</Label>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Start</Label>
                <Select
                  value={localHours[day.key]?.start.toString()}
                  onValueChange={(value) => handleStartChange(day.key, parseInt(value))}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map(hour => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour.toString().padStart(2, '0')}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">End</Label>
                <Select
                  value={localHours[day.key]?.end.toString()}
                  onValueChange={(value) => handleEndChange(day.key, parseInt(value))}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map(hour => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour.toString().padStart(2, '0')}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
