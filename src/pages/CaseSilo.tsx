
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Archive, Search, User, FileText, ClipboardCheck, Book, Plus } from "lucide-react";
import { formatDate } from '@/lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { CaseSilo, CaseDocument, Assessment, Report, CaseNote } from '@/types';

const CaseSiloPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [caseSilos, setCaseSilos] = useState<CaseSilo[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'documents' | 'assessments' | 'reports' | 'notes'>('documents');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch mock case silos
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        
        // Mock data
        const mockCaseSilos: CaseSilo[] = [
          {
            id: "1",
            claimantName: "John Doe",
            caseType: "Workplace Injury",
            status: "active",
            createdDate: "2023-03-15",
            expiryDate: "2023-09-15",
            participants: {
              claimantId: "user1",
              lawyerId: "user2",
              psychologistId: "user3",
            },
            documents: [
              {
                id: "doc1",
                name: "Initial Assessment Report.pdf",
                type: "application/pdf",
                uploadedBy: "Dr. Smith",
                uploadDate: "2023-03-20",
                url: "#",
                size: "1.2 MB"
              },
              {
                id: "doc2",
                name: "Medical Records.pdf",
                type: "application/pdf",
                uploadedBy: "Dr. Johnson",
                uploadDate: "2023-03-25",
                url: "#",
                size: "3.4 MB"
              }
            ],
            assessments: [
              {
                id: "assess1",
                title: "Psychological Assessment",
                description: "Initial psychological evaluation",
                status: "completed",
                completionPercentage: 100,
                date: "2023-04-05",
                assignedTo: "John Doe"
              },
              {
                id: "assess2",
                title: "Follow-up Assessment",
                description: "30-day follow-up evaluation",
                status: "in_progress",
                completionPercentage: 60,
                date: "2023-05-05",
                assignedTo: "John Doe"
              }
            ],
            reports: [
              {
                id: "report1",
                title: "Initial Psychological Report",
                patientName: "John Doe",
                date: "2023-04-15",
                type: "workers_comp",
                status: "completed",
                content: {
                  overview: "Patient exhibits symptoms consistent with adjustment disorder following workplace injury.",
                  findings: [
                    "Moderate anxiety symptoms",
                    "Sleep disturbances",
                    "Reduced concentration"
                  ],
                  recommendations: "Cognitive behavioral therapy, 10 sessions"
                },
                lastEdited: "2023-04-14"
              }
            ],
            notes: [
              {
                id: "note1",
                content: "Client reported improvement in sleep patterns after beginning medication.",
                createdBy: "Dr. Smith",
                createdAt: "2023-04-20"
              },
              {
                id: "note2",
                content: "Discussed potential return to work strategies and accommodations.",
                createdBy: "Dr. Smith",
                createdAt: "2023-05-02"
              }
            ],
            externalUploads: []
          },
          {
            id: "2",
            claimantName: "Jane Smith",
            caseType: "Car Accident",
            status: "active",
            createdDate: "2023-02-10",
            expiryDate: "2023-08-10",
            participants: {
              claimantId: "user4",
              lawyerId: "user5",
              psychologistId: "user3",
            },
            documents: [
              {
                id: "doc3",
                name: "Accident Report.pdf",
                type: "application/pdf",
                uploadedBy: "Officer Miller",
                uploadDate: "2023-02-11",
                url: "#",
                size: "2.7 MB"
              }
            ],
            assessments: [
              {
                id: "assess3",
                title: "PTSD Screening",
                description: "Initial trauma assessment",
                status: "completed",
                completionPercentage: 100,
                date: "2023-02-25",
                assignedTo: "Jane Smith"
              }
            ],
            reports: [],
            notes: [
              {
                id: "note3",
                content: "Client shows signs of post-traumatic stress. Recommended weekly therapy sessions.",
                createdBy: "Dr. Johnson",
                createdAt: "2023-02-28"
              }
            ],
            externalUploads: []
          }
        ];
        
        setCaseSilos(mockCaseSilos);
      } catch (error) {
        console.error("Error fetching case data:", error);
        toast({
          title: "Error",
          description: "Failed to load case data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const filteredCaseSilos = caseSilos.filter(caseSilo => 
    caseSilo.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseSilo.caseType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCase = selectedCaseId ? caseSilos.find(cs => cs.id === selectedCaseId) : null;

  // Handle navigation to interview
  const handleInterviewClick = (caseId: string) => {
    navigate(`/interview/${caseId}`);
  };

  // Handle new document/assessment/report creation
  const handleCreateItem = (type: 'document' | 'assessment' | 'report' | 'note') => {
    if (!selectedCaseId) return;
    
    toast({
      title: `New ${type} created`,
      description: `A new ${type} has been added to the case.`,
    });

    // In a real app, you would create the item and update the state
    // For demonstration purposes, we'll just show a toast
  };

  const renderCaseGrid = () => {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredCaseSilos.map(caseSilo => (
          <Card 
            key={caseSilo.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedCaseId(caseSilo.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle>{caseSilo.claimantName}</CardTitle>
                <Badge variant={caseSilo.status === "active" ? "default" : "outline"}>
                  {caseSilo.status === "active" ? "Active" : "Expired"}
                </Badge>
              </div>
              <CardDescription>{caseSilo.caseType}</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(caseSilo.createdDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires:</span>
                  <span>{formatDate(caseSilo.expiryDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Documents:</span>
                  <span>{caseSilo.documents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assessments:</span>
                  <span>{caseSilo.assessments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reports:</span>
                  <span>{caseSilo.reports.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderCaseDetail = () => {
    if (!selectedCase) return null;

    return (
      <div>
        <Button variant="ghost" onClick={() => setSelectedCaseId(null)} className="mb-4">
          &larr; Back to Cases
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{selectedCase.claimantName}</h1>
            <p className="text-muted-foreground">{selectedCase.caseType}</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Badge variant={selectedCase.status === "active" ? "default" : "outline"} className="mb-2">
              {selectedCase.status === "active" ? "Active" : "Expired"}
            </Badge>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => handleInterviewClick(selectedCase.id)}
            >
              <User className="w-4 h-4" /> View Interview
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <Tabs defaultValue="documents" value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
              <TabsList>
                <TabsTrigger value="documents" className="flex items-center gap-1">
                  <FileText className="w-4 h-4" /> Documents
                </TabsTrigger>
                <TabsTrigger value="assessments" className="flex items-center gap-1">
                  <ClipboardCheck className="w-4 h-4" /> Assessments
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-1">
                  <Book className="w-4 h-4" /> Reports
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-1">
                  <FileText className="w-4 h-4" /> Notes
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-4">
            <TabsContent value="documents" className="mt-0 space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Documents</h3>
                <Button size="sm" onClick={() => handleCreateItem('document')}>
                  <Plus className="w-4 h-4 mr-1" /> Add Document
                </Button>
              </div>
              
              <div className="space-y-2">
                {selectedCase.documents.length === 0 ? (
                  <p className="text-muted-foreground">No documents available</p>
                ) : (
                  selectedCase.documents.map(doc => (
                    <div key={doc.id} className="p-3 border rounded-md flex items-center justify-between">
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <div className="text-sm text-muted-foreground">
                          Uploaded by {doc.uploadedBy} on {formatDate(doc.uploadDate)}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {doc.size}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="assessments" className="mt-0 space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Assessments</h3>
                <Button size="sm" onClick={() => handleCreateItem('assessment')}>
                  <Plus className="w-4 h-4 mr-1" /> Add Assessment
                </Button>
              </div>
              
              <div className="space-y-2">
                {selectedCase.assessments.length === 0 ? (
                  <p className="text-muted-foreground">No assessments available</p>
                ) : (
                  selectedCase.assessments.map(assessment => (
                    <div key={assessment.id} className="p-3 border rounded-md">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{assessment.title}</p>
                        <Badge variant={assessment.status === "completed" ? "default" : "outline"}>
                          {assessment.status === "completed" ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{assessment.description}</p>
                      <div className="mt-2 text-sm">
                        <div className="bg-muted h-2 rounded-full mt-1">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${assessment.completionPercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>Completion: {assessment.completionPercentage}%</span>
                          <span>Date: {formatDate(assessment.date)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="mt-0 space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Reports</h3>
                <Button size="sm" onClick={() => handleCreateItem('report')}>
                  <Plus className="w-4 h-4 mr-1" /> Add Report
                </Button>
              </div>
              
              <div className="space-y-2">
                {selectedCase.reports.length === 0 ? (
                  <p className="text-muted-foreground">No reports available</p>
                ) : (
                  selectedCase.reports.map(report => (
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
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="mt-0 space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Notes</h3>
                <Button size="sm" onClick={() => handleCreateItem('note')}>
                  <Plus className="w-4 h-4 mr-1" /> Add Note
                </Button>
              </div>
              
              <div className="space-y-2">
                {selectedCase.notes.length === 0 ? (
                  <p className="text-muted-foreground">No notes available</p>
                ) : (
                  selectedCase.notes.map(note => (
                    <div key={note.id} className="p-3 border rounded-md">
                      <p className="whitespace-pre-wrap">{note.content}</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span>{note.createdBy} - {formatDate(note.createdAt)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedCaseId) {
    return renderCaseDetail();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Case Silo</h1>
      <p className="text-muted-foreground mb-6">
        Access all information related to your cases in one secure location
      </p>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {currentUser?.role === 'lawyer' && (
          <Button>
            <Plus className="w-4 h-4 mr-1" /> Create New Case
          </Button>
        )}
      </div>
      
      {filteredCaseSilos.length === 0 ? (
        <div className="text-center py-12">
          <Archive className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No cases found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchTerm ? "Try adjusting your search terms" : "No cases are available at this time"}
          </p>
        </div>
      ) : (
        renderCaseGrid()
      )}
    </div>
  );
};

export default CaseSiloPage;
