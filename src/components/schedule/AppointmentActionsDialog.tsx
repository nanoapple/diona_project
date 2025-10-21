import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  DollarSign, 
  FileText, 
  History,
  Edit,
  RefreshCw,
  Phone,
  Copy,
  XCircle,
  UserX,
  CreditCard,
  Mail,
  Languages,
  Receipt,
  Link2,
  Upload,
  CheckCircle,
  Flag,
  Paperclip,
  Clock,
  CalendarX,
  TrendingUp
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AppointmentActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: any;
}

const AppointmentActionsDialog = ({ open, onOpenChange, appointment }: AppointmentActionsDialogProps) => {
  const handleAction = (action: string) => {
    console.log(`Action clicked: ${action}`);
    // TODO: Implement action handlers
  };

  const sections = [
    {
      title: "Appointment Management",
      icon: Calendar,
      actions: [
        { label: "Reschedule or edit (date, time, duration)", icon: Edit, action: "reschedule" },
        { label: "Change appointment type (e.g. General → Discharge)", icon: RefreshCw, action: "change-type" },
        { label: "Modify delivery method (in-person / telehealth / phone)", icon: Phone, action: "change-delivery" },
        { label: "Duplicate or create recurring sessions", icon: Copy, action: "duplicate" }
      ]
    },
    {
      title: "Attendance & Cancellations",
      icon: UserX,
      actions: [
        { label: "Cancel (with reason and optional client notification)", icon: XCircle, action: "cancel" },
        { label: 'Mark as "Did Not Attend (DNA)"', icon: CalendarX, action: "mark-dna" },
        { label: "Record cancellation billing status (billable / non-billable)", icon: CreditCard, action: "billing-status" }
      ]
    },
    {
      title: "Client Communication",
      icon: MessageSquare,
      actions: [
        { label: "Send rescheduling or follow-up request (SMS/email)", icon: Mail, action: "send-notification" },
        { label: "Add interpreter or accessibility note", icon: Languages, action: "add-note" }
      ]
    },
    {
      title: "Billing & Financials",
      icon: DollarSign,
      actions: [
        { label: "Mark as invoiced or paid", icon: Receipt, action: "mark-invoiced" },
        { label: "Add or edit billing notes", icon: Edit, action: "edit-billing-notes" },
        { label: "Link to insurer / claim reference", icon: Link2, action: "link-insurer" },
        { label: "Submit or export to claim system", icon: Upload, action: "submit-claim" }
      ]
    },
    {
      title: "Clinical Documentation",
      icon: FileText,
      actions: [
        { label: "Mark session notes as complete", icon: CheckCircle, action: "mark-notes-complete" },
        { label: "Flag for review / supervision", icon: Flag, action: "flag-review" },
        { label: "Attach or view linked case documents", icon: Paperclip, action: "attach-documents" },
        { label: "Track documentation status per session", icon: Clock, action: "track-status" }
      ]
    },
    {
      title: "History & Insights",
      icon: History,
      actions: [
        { label: "View appointment change log", icon: Clock, action: "view-changelog" },
        { label: "Review past attendance or cancellations", icon: CalendarX, action: "review-attendance" },
        { label: "See client's appointment history and upcoming sessions", icon: TrendingUp, action: "view-history" }
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Appointment Configuration</DialogTitle>
          {appointment && (
            <p className="text-sm text-muted-foreground">
              {appointment.clientName} - {appointment.startTime} to {appointment.endTime} ({appointment.type})
            </p>
          )}
        </DialogHeader>

        <ScrollArea className="h-[calc(85vh-120px)] pr-4">
          <div className="grid grid-cols-3 gap-4">
            {sections.map((section, index) => (
              <div 
                key={index} 
                className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <section.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-sm">{section.title}</h3>
                </div>
                
                <div className="space-y-2">
                  {section.actions.map((actionItem, actionIndex) => (
                    <Button
                      key={actionIndex}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2 px-2 hover:bg-accent"
                      onClick={() => handleAction(actionItem.action)}
                    >
                      <actionItem.icon className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                      <span className="text-xs leading-tight">{actionItem.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentActionsDialog;
