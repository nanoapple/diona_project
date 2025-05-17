
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Plus, Tag, X } from "lucide-react";
import { CaseDocument } from "@/types";
import { formatDate } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Document tags with associated colors
export const documentTags = [
  { name: "School/University", color: "bg-blue-500" },
  { name: "Research Institute", color: "bg-indigo-500" },
  { name: "Hospitals/Clinic", color: "bg-red-500" },
  { name: "Police", color: "bg-blue-900" },
  { name: "Courts", color: "bg-amber-700" },
  { name: "Prison/Correctional Facilities", color: "bg-gray-700" },
  { name: "Law firm", color: "bg-purple-700" },
  { name: "EAP Providers", color: "bg-emerald-600" },
  { name: "Government Agencies", color: "bg-cyan-600" },
  { name: "CentreLink", color: "bg-green-700" },
  { name: "NGO", color: "bg-orange-500" },
  { name: "Media", color: "bg-pink-500" },
  { name: "Personal", color: "bg-violet-500" },
  { name: "Military/Defense Sector", color: "bg-slate-700" },
  { name: "LGBTQ+", color: "bg-pink-600" },
  { name: "Employer", color: "bg-blue-600" },
  { name: "Rehabilitation", color: "bg-teal-600" },
  { name: "Church", color: "bg-yellow-600" },
  { name: "Association", color: "bg-rose-600" },
  { name: "Others", color: "bg-gray-500" }
];

interface CaseDocumentsProps {
  documents: CaseDocument[];
  canUpload: boolean;
  onCreateItem: () => void;
}

const CaseDocuments = ({ documents, canUpload, onCreateItem }: CaseDocumentsProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentNotes, setDocumentNotes] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!documentTitle) {
        // Set document title to file name without extension
        const fileName = file.name.split('.').slice(0, -1).join('.');
        setDocumentTitle(fileName);
      }
    }
  };

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(tag => tag !== tagName));
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tagName]);
    } else {
      toast({
        title: "Maximum tags reached",
        description: "You can only select up to 5 tags per document.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }

    if (!documentTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for the document.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    // Simulate upload process
    setTimeout(() => {
      // In a real application, this would call an API to upload the file
      onCreateItem();
      
      setIsUploading(false);
      setIsDialogOpen(false);
      
      // Reset form
      setSelectedFile(null);
      setDocumentTitle("");
      setDocumentNotes("");
      setSelectedTags([]);

      toast({
        title: "Document uploaded successfully",
        description: "Your document has been added to the case.",
      });
    }, 1500);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setDocumentTitle("");
    setDocumentNotes("");
    setSelectedTags([]);
  };

  const getTagColor = (tagName: string): string => {
    const tag = documentTags.find(t => t.name === tagName);
    return tag?.color || "bg-gray-500";
  };

  const renderTags = (tags: string[]) => {
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {tags.map(tag => (
          <Badge key={tag} className={`${getTagColor(tag)} text-white text-xs`}>
            {tag}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Documents</h3>
        {canUpload && (
          <Button size="sm" onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}>
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
              <Button className="mt-4" size="sm" variant="outline" onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}>
                <Upload className="w-4 h-4 mr-1" /> Upload Document
              </Button>
            )}
          </div>
        ) : (
          documents.map(doc => (
            <div key={doc.id} className="p-3 border rounded-md flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <div className="text-sm text-muted-foreground">
                      Uploaded by {doc.uploadedBy} on {formatDate(doc.uploadDate)}
                    </div>
                    {/* Render mock tags for existing documents */}
                    {doc.id === 'doc1' && renderTags(['Hospitals/Clinic', 'Personal'])}
                    {doc.id === 'doc2' && renderTags(['Medical', 'Research Institute', 'Personal'])}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {doc.size}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Document Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document to this case and add relevant tags.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file">Document File</Label>
              <div 
                className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">
                  {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOCX, or image files up to 10MB
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Document Title</Label>
              <Input 
                id="title" 
                value={documentTitle} 
                onChange={(e) => setDocumentTitle(e.target.value)} 
                placeholder="Enter document title"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label>Document Tags (max 5)</Label>
                <span className="text-xs text-muted-foreground">
                  {selectedTags.length}/5 selected
                </span>
              </div>
              <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {documentTags.map((tag) => (
                    <Badge 
                      key={tag.name}
                      className={`${selectedTags.includes(tag.name) 
                        ? tag.color + ' text-white' 
                        : 'bg-muted hover:bg-muted/80 cursor-pointer'}`}
                      onClick={() => toggleTag(tag.name)}
                    >
                      {tag.name}
                      {selectedTags.includes(tag.name) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <Label className="w-full mb-1">Selected Tags:</Label>
                {selectedTags.map(tag => (
                  <Badge 
                    key={tag} 
                    className={`${getTagColor(tag)} text-white`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag} <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea 
                id="notes" 
                value={documentNotes} 
                onChange={(e) => setDocumentNotes(e.target.value)} 
                placeholder="Add any relevant notes about this document"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              disabled={isUploading || !selectedFile || !documentTitle.trim()}
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> Uploading...
                </>
              ) : (
                <>Upload Document</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaseDocuments;
