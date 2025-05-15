
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, FileText, User, Plus } from "lucide-react";
import { Report } from "@/types";
import { formatDate } from "@/lib/utils";

interface CaseReportsProps {
  reports: Report[];
  canEdit: boolean;
  onCreateItem: () => void;
}

const CaseReports = ({ reports, canEdit, onCreateItem }: CaseReportsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Reports</h3>
        {canEdit && (
          <Button size="sm" onClick={onCreateItem}>
            <Plus className="w-4 h-4 mr-1" /> Add Report
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <Book className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
            <h3 className="mt-3 text-lg font-medium">No reports</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
              {canEdit 
                ? "Create reports based on assessments and interviews"
                : "No reports have been created yet"
              }
            </p>
            {canEdit && (
              <Button className="mt-4" size="sm" variant="outline" onClick={onCreateItem}>
                <Plus className="w-4 h-4 mr-1" /> Create Report
              </Button>
            )}
          </div>
        ) : (
          reports.map(report => (
            <div key={report.id} className="p-3 border rounded-md">
              <div className="flex items-center justify-between">
                <p className="font-medium">{report.title}</p>
                <Badge variant={report.status === "completed" ? "default" : "outline"}>
                  {report.status === "completed" ? "Completed" : "Draft"}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>Patient: {report.patientName}</div>
                <div>Date: {formatDate(report.date)}</div>
                <div>Last edited: {formatDate(report.lastEdited)}</div>
              </div>
              {report.status === "completed" && (
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline">
                    <FileText className="w-3 h-3 mr-1" /> View
                  </Button>
                  <Button size="sm" variant="outline">
                    <User className="w-3 h-3 mr-1" /> Share
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CaseReports;
