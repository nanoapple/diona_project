
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Plus } from "lucide-react";
import { CaseDocument } from "@/types";
import { formatDate } from "@/lib/utils";

interface ExternalUploadsProps {
  uploads: CaseDocument[];
  canShare: boolean;
  onCreateItem: () => void;
}

const ExternalUploads = ({ uploads, canShare, onCreateItem }: ExternalUploadsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">External Uploads</h3>
        {canShare && (
          <Button size="sm" onClick={onCreateItem}>
            <Plus className="w-4 h-4 mr-1" /> Request External Upload
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {uploads.length === 0 ? (
          <div className="text-center py-8">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
            <h3 className="mt-3 text-lg font-medium">No external uploads</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
              {canShare 
                ? "Request documents from external parties like a GP or rehab provider"
                : "No external party uploads available"
              }
            </p>
            {canShare && (
              <Button className="mt-4" size="sm" variant="outline" onClick={onCreateItem}>
                <Plus className="w-4 h-4 mr-1" /> Request Upload
              </Button>
            )}
          </div>
        ) : (
          uploads.map(doc => (
            <div key={doc.id} className="p-3 border rounded-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded bg-blue-50 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{doc.name}</p>
                    <Badge variant="outline" className="text-xs">External</Badge>
                  </div>
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

export default ExternalUploads;
