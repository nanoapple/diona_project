
import { useState } from 'react';
import { Share, Edit, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface ClinicalNotesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clinicalNotes: string;
  onShare: () => void;
}

const ClinicalNotesDialog = ({ isOpen, onOpenChange, clinicalNotes, onShare }: ClinicalNotesDialogProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(clinicalNotes);

  const handleEdit = () => {
    setEditedNotes(clinicalNotes);
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Notes saved",
      description: "Clinical notes have been updated successfully.",
    });
  };

  // Reset editing state when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsEditing(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Clinical Notes</DialogTitle>
          <DialogDescription>
            Full clinical documentation for this session.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isEditing ? (
            <Textarea 
              className="font-mono text-sm min-h-[60vh]"
              value={editedNotes} 
              onChange={(e) => setEditedNotes(e.target.value)}
            />
          ) : (
            <div className="whitespace-pre-wrap font-mono text-sm border p-4 rounded-md bg-muted/20 max-h-[60vh] overflow-y-auto">
              {clinicalNotes}
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between items-center">
          <div className="flex gap-2">
            {isEditing ? (
              <Button variant="outline" onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
            ) : (
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
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
