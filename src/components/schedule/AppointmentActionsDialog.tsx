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
      title: "Session Management",
      icon: Calendar,
      actions: [
        { label: "Edit / Reschedule (date, time, duration)", icon: Edit, action: "reschedule" },
        { label: "Change session type or delivery method", icon: RefreshCw, action: "change-type" },
        { label: "Cancel or mark as DNA (Did Not Attend)", icon: XCircle, action: "cancel" },
        { label: "Duplicate or create recurring session", icon: Copy, action: "duplicate" }
      ]
    },
    {
      title: "Billing & Claims",
      icon: DollarSign,
      actions: [
        { label: "Mark as invoiced / paid", icon: Receipt, action: "mark-invoiced" },
        { label: "Add or edit billing notes", icon: Edit, action: "edit-billing-notes" },
        { label: "Link to insurer / claim reference", icon: Link2, action: "link-insurer" },
        { label: "Submit to claim system", icon: Upload, action: "submit-claim" }
      ]
    },
    {
      title: "Clinical Records",
      icon: FileText,
      actions: [
        { label: "Mark session notes as complete", icon: CheckCircle, action: "mark-notes-complete" },
        { label: "Attach / view case documents", icon: Paperclip, action: "attach-documents" },
        { label: "Flag for review / supervision", icon: Flag, action: "flag-review" },
        { label: "Track documentation status", icon: Clock, action: "track-status" }
      ]
    },
    {
      title: "Client History & Communication",
      icon: MessageSquare,
      actions: [
        { label: "Send rescheduling / follow-up message", icon: Mail, action: "send-notification" },
        { label: "Add interpreter / accessibility note", icon: Languages, action: "add-note" },
        { label: "View change log", icon: History, action: "view-changelog" },
        { label: "Review past attendance / cancellations", icon: CalendarX, action: "review-attendance" },
        { label: "See upcoming appointments", icon: TrendingUp, action: "view-history" }
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
          <div className="grid grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <div 
                key={index} 
                className="border rounded-xl p-5 bg-card hover:shadow-lg transition-all duration-200 hover:border-primary/30"
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base">{section.title}</h3>
                </div>
                
                <div className="space-y-1.5">
                  {section.actions.map((actionItem, actionIndex) => (
                    <Button
                      key={actionIndex}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2.5 px-3 hover:bg-primary/5 hover:text-primary transition-colors"
                      onClick={() => handleAction(actionItem.action)}
                    >
                      <actionItem.icon className="h-4 w-4 mr-3 flex-shrink-0 opacity-70" />
                      <span className="text-sm leading-snug">{actionItem.label}</span>
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
