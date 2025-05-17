
import { CaseNote } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, EyeOff, UserCheck, FileText, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface CaseNoteItemProps {
  note: CaseNote;
  onViewNote: (note: CaseNote) => void;
  isPrivateNote: boolean;
  noteType: 'Transcribed' | 'Written';
}

const CaseNoteItem = ({ note, onViewNote, isPrivateNote, noteType }: CaseNoteItemProps) => {
  return (
    <div className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <User className="h-3 w-3" /> {note.createdBy}
          </Badge>
          
          {isPrivateNote && (
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <EyeOff className="h-3 w-3" /> Private
            </Badge>
          )}
          
          {!isPrivateNote && (
            <Badge variant="default" className="flex items-center gap-1 text-xs">
              <UserCheck className="h-3 w-3" /> Shared
            </Badge>
          )}
          
          {/* Note type badge (Transcribed or Written) */}
          <Badge variant="outline" className={`flex items-center gap-1 text-xs ${
            noteType === "Transcribed" ? "bg-blue-100 text-blue-800 border-blue-300" : "bg-green-100 text-green-800 border-green-300"
          }`}>
            <FileText className="h-3 w-3" /> {noteType}
          </Badge>
        </div>
        
        <span className="text-xs text-muted-foreground">
          {formatDate(note.createdAt)}
        </span>
      </div>
      
      <p className="whitespace-pre-wrap">{note.content}</p>
      
      {note.visibleTo && isPrivateNote && (
        <div className="mt-2 text-xs text-muted-foreground">
          <span>Visible to: {note.visibleTo.join(', ')}</span>
        </div>
      )}
      
      <div className="mt-3 flex justify-end">
        <Button 
          size="sm" 
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => onViewNote(note)}
        >
          <Eye className="h-3 w-3" /> View Note
        </Button>
      </div>
    </div>
  );
};

export default CaseNoteItem;
