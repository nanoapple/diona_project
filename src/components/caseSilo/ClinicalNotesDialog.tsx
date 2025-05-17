
import { Share, Edit, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ClinicalNotesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clinicalNotes: string;
  onShare: () => void;
}

const ClinicalNotesDialog = ({ isOpen, onOpenChange, clinicalNotes, onShare }: ClinicalNotesDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Clinical Notes</DialogTitle>
          <DialogDescription>
            Full clinical documentation for this session.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="whitespace-pre-wrap font-mono text-sm border p-4 rounded-md bg-muted/20 max-h-[60vh] overflow-y-auto">
            {clinicalNotes}
          </div>
        </div>
        <DialogFooter className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-1" /> Edit
            </Button>
            <Button variant="outline">
              <Save className="w-4 h-4 mr-1" /> Save
            </Button>
          </div>
          <Button onClick={onShare}>
            <Share className="w-4 h-4 mr-1" /> Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClinicalNotesDialog;
