
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Eye, EyeOff, User, UserCheck } from "lucide-react";
import { CaseNote } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types";

interface CaseNotesProps {
  notes: CaseNote[];
  canView: boolean;
  canCreate: boolean;
  onCreateItem: () => void;
  currentUserRole?: UserRole;
}

const CaseNotes = ({ notes, canView, canCreate, onCreateItem, currentUserRole }: CaseNotesProps) => {
  const [showPrivateNotes, setShowPrivateNotes] = useState(true);

  // Filter notes based on visibility permissions
  const filteredNotes = notes.filter(note => {
    // Always show notes that aren't private
    if (!note.isPrivate) return true;
    
    // If showing private notes and user can view them and their role is allowed to see this note
    return showPrivateNotes && 
           canView && 
           note.visibleTo?.includes(currentUserRole as any);
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Case Notes</h3>
        <div className="flex items-center gap-2">
          {canView && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowPrivateNotes(!showPrivateNotes)}
              className="flex items-center"
            >
              {showPrivateNotes ? 
                <><Eye className="w-4 h-4 mr-1" /> Show All</> : 
                <><EyeOff className="w-4 h-4 mr-1" /> Hide Private</>
              }
            </Button>
          )}
          
          {canCreate && (
            <Button size="sm" onClick={onCreateItem}>
              <Plus className="w-4 h-4 mr-1" /> Add Note
            </Button>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
            <h3 className="mt-3 text-lg font-medium">No case notes</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
              {canCreate 
                ? "Add notes to track important case information"
                : "No notes have been added yet"
              }
            </p>
            {canCreate && (
              <Button className="mt-4" size="sm" variant="outline" onClick={onCreateItem}>
                <Plus className="w-4 h-4 mr-1" /> Add Note
              </Button>
            )}
          </div>
        ) : (
          filteredNotes.map(note => (
            <div key={note.id} className="p-3 border rounded-md">
              <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    <User className="h-3 w-3" /> {note.createdBy}
                  </Badge>
                  
                  {note.isPrivate && (
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                      <EyeOff className="h-3 w-3" /> Private
                    </Badge>
                  )}
                  
                  {!note.isPrivate && (
                    <Badge variant="default" className="flex items-center gap-1 text-xs">
                      <UserCheck className="h-3 w-3" /> Shared
                    </Badge>
                  )}
                </div>
                
                <span className="text-xs text-muted-foreground">
                  {formatDate(note.createdAt)}
                </span>
              </div>
              
              <p className="whitespace-pre-wrap">{note.content}</p>
              
              {note.visibleTo && note.isPrivate && canView && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <span>Visible to: {note.visibleTo.join(', ')}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CaseNotes;
