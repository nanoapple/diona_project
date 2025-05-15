
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import { CaseNote } from "@/types";
import { formatDate } from "@/lib/utils";

interface CaseNotesProps {
  notes: CaseNote[];
  canView: boolean;
  onCreateItem: () => void;
}

const CaseNotes = ({ notes, canView, onCreateItem }: CaseNotesProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Case Notes</h3>
        {canView && (
          <Button size="sm" onClick={onCreateItem}>
            <Plus className="w-4 h-4 mr-1" /> Add Note
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {notes.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
            <h3 className="mt-3 text-lg font-medium">No case notes</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
              {canView 
                ? "Add notes to track important case information"
                : "No notes have been added yet"
              }
            </p>
            {canView && (
              <Button className="mt-4" size="sm" variant="outline" onClick={onCreateItem}>
                <Plus className="w-4 h-4 mr-1" /> Add Note
              </Button>
            )}
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="p-3 border rounded-md">
              <p className="whitespace-pre-wrap">{note.content}</p>
              <div className="mt-2 text-sm text-muted-foreground">
                <span>{note.createdBy} - {formatDate(note.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CaseNotes;
