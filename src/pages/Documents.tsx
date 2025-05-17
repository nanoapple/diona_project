import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent, TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { FileText, UploadCloud, Download, CheckCircle, X, File } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '@/lib/utils';
import { UserRole } from '@/contexts/AuthContext';

interface Document {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  fileName: string;
  uploadedBy: string;
}

const DocumentsPage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      title: 'Medical Report',
      description: 'Initial medical assessment following the workplace incident',
      date: '2023-03-15',
      type: 'medical',
      status: 'approved',
      fileName: 'medical_report_march.pdf',
      uploadedBy: 'Dr. Johnson'
    },
    {
      id: '2',
      title: 'Incident Report',
      description: 'Official workplace incident report filed with HR department',
      date: '2023-03-10',
      type: 'incident',
      status: 'approved',
      fileName: 'incident_report_10032023.pdf',
      uploadedBy: 'John Smith'
    },
    {
      id: '3',
      title: 'Insurance Claim Form',
      description: 'Completed insurance claim form for workers compensation',
      date: '2023-03-20',
      type: 'insurance',
      status: 'pending',
      fileName: 'insurance_claim_form.pdf',
      uploadedBy: 'Jane Lawyer'
    }
  ]);

  const [newDocument, setNewDocument] = useState({
    title: '',
    description: '',
    type: 'medical'
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const documentTypeOptions = [
    { value: 'medical', label: 'Medical Report' },
    { value: 'incident', label: 'Incident Report' },
    { value: 'insurance', label: 'Insurance Document' },
    { value: 'legal', label: 'Legal Document' },
    { value: 'assessment', label: 'Psychological Assessment' },
    { value: 'other', label: 'Other' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    if (!newDocument.title) {
      toast({
        title: "Title required",
        description: "Please provide a title for the document",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      const newDoc: Document = {
        id: (Date.now()).toString(),
        title: newDocument.title,
        description: newDocument.description,
        type: newDocument.type,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        fileName: selectedFile.name,
        uploadedBy: currentUser?.name || 'Unknown User'
      };

      setDocuments(prev => [...prev, newDoc]);
      
      setNewDocument({
        title: '',
        description: '',
        type: 'medical'
      });
      setSelectedFile(null);
      setIsUploading(false);
      setIsDialogOpen(false);

      toast({
        title: "Document uploaded",
        description: "Your document has been successfully uploaded",
      });
    }, 1500);
  };

  const approveDocument = (id: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, status: 'approved' } : doc
      )
    );
    
    toast({
      title: "Document approved",
      description: "The document has been approved and is now accessible",
    });
  };

  const rejectDocument = (id: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, status: 'rejected' } : doc
      )
    );
    
    toast({
      title: "Document rejected",
      description: "The document has been rejected",
      variant: "destructive"
    });
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center text-green-600 text-xs font-medium">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center text-red-600 text-xs font-medium">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </div>
        );
      default:
        return (
          <div className="flex items-center text-yellow-600 text-xs font-medium">
            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path d="M12 8v4l3 3" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Pending
          </div>
        );
    }
  };

  const isClaimant = currentUser?.role === 'claimant';

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Documents</h1>
          <p className="text-muted-foreground">
            Manage and access case documents
          </p>
        </div>
        
        {currentUser?.role !== 'victim' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UploadCloud className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Add a new document to the case file
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Document Title</Label>
                  <Input 
                    id="title" 
                    value={newDocument.title}
                    onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                    placeholder="Enter document title" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Document Type</Label>
                  <select 
                    id="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newDocument.type}
                    onChange={(e) => setNewDocument({...newDocument, type: e.target.value})}
                  >
                    {documentTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={newDocument.description}
                    onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                    placeholder="Enter a brief description of the document" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file">File</Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-md p-6 text-center">
                    <Input 
                      id="file" 
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Label htmlFor="file" className="cursor-pointer flex flex-col items-center justify-center">
                      <UploadCloud className="h-8 w-8 mb-2 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {selectedFile ? selectedFile.name : 'Click to upload a file'}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOCX, JPG up to 10MB'}
                      </span>
                    </Label>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    'Upload'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-16 flex items-center justify-center p-4 bg-primary/10">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <CardContent className="p-6 flex-1 border-l">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-medium">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                        <div className="flex flex-wrap gap-2 items-center mt-2">
                          <div className="text-xs bg-secondary px-2 py-1 rounded capitalize">
                            {doc.type}
                          </div>
                          {renderStatusBadge(doc.status)}
                          <span className="text-xs text-muted-foreground">
                            Uploaded on {formatDate(doc.date)} by {doc.uploadedBy}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center mt-4 md:mt-0">
                        {/* For lawyers, show approve/reject buttons for pending documents */}
                        {currentUser?.role === 'lawyer' && doc.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600"
                              onClick={() => approveDocument(doc.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => rejectDocument(doc.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {/* Download button for all approved documents */}
                        {doc.status === 'approved' && (
                          <Button size="sm" variant="outline" className="ml-2">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}

            {documents.length === 0 && (
              <Card className="p-10 text-center">
                <div className="flex flex-col items-center">
                  <File className="h-10 w-10 text-muted-foreground mb-2" />
                  <CardTitle className="mb-2">No Documents</CardTitle>
                  <CardDescription>
                    There are no documents available in this category yet.
                  </CardDescription>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {['medical', 'legal', 'insurance'].map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-4">
              {documents.filter(doc => doc.type === category).map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-16 flex items-center justify-center p-4 bg-primary/10">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <CardContent className="p-6 flex-1 border-l">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-medium">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                          <div className="flex flex-wrap gap-2 items-center mt-2">
                            <div className="text-xs bg-secondary px-2 py-1 rounded capitalize">
                              {doc.type}
                            </div>
                            {renderStatusBadge(doc.status)}
                            <span className="text-xs text-muted-foreground">
                              Uploaded on {formatDate(doc.date)} by {doc.uploadedBy}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center mt-4 md:mt-0">
                          {currentUser?.role === 'lawyer' && doc.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600"
                                onClick={() => approveDocument(doc.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600"
                                onClick={() => rejectDocument(doc.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}

                          {doc.status === 'approved' && (
                            <Button size="sm" variant="outline" className="ml-2">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}

              {documents.filter(doc => doc.type === category).length === 0 && (
                <Card className="p-10 text-center">
                  <div className="flex flex-col items-center">
                    <File className="h-10 w-10 text-muted-foreground mb-2" />
                    <CardTitle className="mb-2">No Documents</CardTitle>
                    <CardDescription>
                      There are no {category} documents available yet.
                    </CardDescription>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DocumentsPage;
