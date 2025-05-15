
import { Button } from "@/components/ui/button";
import { FileText, Upload, Plus } from "lucide-react";
import { CaseDocument } from "@/types";
import { formatDate } from "@/lib/utils";

interface CaseDocumentsProps {
  documents: CaseDocument[];
  canUpload: boolean;
  onCreateItem: () => void;
}

const CaseDocuments = ({ documents, canUpload, onCreateItem }: CaseDocumentsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Documents</h3>
        {canUpload && (
          <Button size="sm" onClick={onCreateItem}>
            <Plus className="w-4 h-4 mr-1" /> Add Document
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
            <h3 className="mt-3 text-lg font-medium">No documents</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
              {canUpload 
                ? "Upload documents related to this case"
                : "No documents have been uploaded yet"
              }
            </p>
            {canUpload && (
              <Button className="mt-4" size="sm" variant="outline" onClick={onCreateItem}>
                <Upload className="w-4 h-4 mr-1" /> Upload Document
              </Button>
            )}
          </div>
        ) : (
          documents.map(doc => (
            <div key={doc.id} className="p-3 border rounded-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <div className="text-sm text-muted-foreground">
                    Uploaded by {doc.uploadedBy} on {formatDate(doc.uploadDate)}
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {doc.size}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CaseDocuments;
