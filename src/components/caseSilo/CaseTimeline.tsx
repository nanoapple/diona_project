
import { FileText, ClipboardCheck, Book, MessageSquare } from "lucide-react";
import { CaseDocument, Assessment, Report, CaseNote } from "@/types";
import { formatDate } from "@/lib/utils";

interface CaseTimelineProps {
  documents: CaseDocument[];
  assessments: Assessment[];
  reports: Report[];
  notes: CaseNote[];
  externalUploads: CaseDocument[];
}

const CaseTimeline = ({ documents, assessments, reports, notes, externalUploads }: CaseTimelineProps) => {
  // Combine all items into a single array with type indicators
  const allItems = [
    ...documents.map(doc => ({ ...doc, itemType: 'document' })),
    ...assessments.map(assessment => ({ ...assessment, itemType: 'assessment' })),
    ...reports.map(report => ({ ...report, itemType: 'report' })),
    ...notes.map(note => ({ ...note, itemType: 'note' })),
    ...externalUploads.map(doc => ({ ...doc, itemType: 'external' }))
  ];
  
  // Sort items by date (newest first)
  const sortedItems = allItems.sort((a, b) => {
    const dateA = new Date(a.uploadDate || a.date || a.createdAt || a.lastEdited);
    const dateB = new Date(b.uploadDate || b.date || b.createdAt || b.lastEdited);
    return dateB.getTime() - dateA.getTime();
  });
  
  const renderTimelineItem = (item: any) => {
    const { itemType } = item;
    
    const getIcon = () => {
      switch (itemType) {
        case 'document': 
        case 'external':
          return <FileText className="w-4 h-4" />;
        case 'assessment': 
          return <ClipboardCheck className="w-4 h-4" />;
        case 'report': 
          return <Book className="w-4 h-4" />;
        case 'note': 
          return <MessageSquare className="w-4 h-4" />;
        default: 
          return <FileText className="w-4 h-4" />;
      }
    };
    
    const getTitle = () => {
      switch (itemType) {
        case 'document': 
        case 'external':
          return item.name;
        case 'assessment': 
        case 'report': 
          return item.title;
        case 'note': 
          return 'Case Note Added';
        default: 
          return 'Item';
      }
    };
    
    const getDescription = () => {
      switch (itemType) {
        case 'document': 
        case 'external':
          return `Uploaded by ${item.uploadedBy}`;
        case 'assessment': 
          return item.description || '';
        case 'report': 
          return `Report for ${item.patientName}`;
        case 'note': 
          return item.content.substring(0, 50) + (item.content.length > 50 ? '...' : '');
        default: 
          return '';
      }
    };
    
    const getDate = () => {
      return formatDate(item.uploadDate || item.date || item.createdAt || item.lastEdited);
    };
    
    return (
      <div key={item.id} className="flex gap-3 mb-4 relative">
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 shrink-0">
          {getIcon()}
        </div>
        <div className="relative pb-8 border-l border-muted ml-4 pl-4 -mt-2">
          <h4 className="text-sm font-medium">{getTitle()}</h4>
          <p className="text-xs text-muted-foreground">{getDescription()}</p>
          <span className="text-xs text-muted-foreground absolute top-0 right-0">
            {getDate()}
          </span>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Case Timeline</h3>
      
      {sortedItems.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
          <h3 className="mt-3 text-lg font-medium">No timeline events</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Activities will appear here as they occur
          </p>
        </div>
      ) : (
        <div className="relative pb-4">
          {sortedItems.map(item => renderTimelineItem(item))}
        </div>
      )}
    </div>
  );
};

export default CaseTimeline;
