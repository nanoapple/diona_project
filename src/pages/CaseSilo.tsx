
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  Archive, 
  Search, 
  User, 
  FileText, 
  ClipboardCheck, 
  Book, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Clock as ClockIcon, 
  AlertCircle,
  Upload,
  MessageSquare 
} from "lucide-react";
import { formatDate } from '@/lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { CaseSilo as CaseSiloType, CaseDocument, Assessment, Report, CaseNote, CaseSiloStatus, CaseType } from '@/types';

const CaseSiloPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [caseSilos, setCaseSilos] = useState<CaseSiloType[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'assessments' | 'reports' | 'notes' | 'timeline' | 'external'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch mock case silos
    const fetchData = async () => {
      try {
        setError(null);
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        
        // Mock data
        const mockCaseSilos: CaseSiloType[] = [
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
            externalUploads: [
              {
                id: "ext1",
                name: "GP Medical Certificate.pdf",
                type: "application/pdf",
                uploadedBy: "Dr. Reynolds (GP)",
                uploadDate: "2023-04-10",
                url: "#",
                size: "0.8 MB",
                isExternal: true
              }
            ]
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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching case data:", error);
        setError("Failed to load case data. Please try again.");
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load case data. Please try again later.",
          variant: "destructive",
        });
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

  // Handle new item creation
  const handleCreateItem = (type: 'document' | 'assessment' | 'report' | 'note' | 'external') => {
    if (!selectedCaseId) return;
    
    toast({
      title: `New ${type} created`,
      description: `A new ${type} has been added to the case.`,
    });
  };

  const renderStatusIcon = (status: CaseSiloStatus) => {
    switch (status) {
      case 'active':
        return <ClockIcon className="w-4 h-4 text-blue-500" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCaseProgress = (caseData: CaseSiloType) => {
    // Calculate progress based on documents, assessments and reports
    const totalItems = 
      caseData.documents.length + 
      caseData.assessments.length + 
      caseData.reports.length;
    
    // Count completed items
    const completedAssessments = caseData.assessments.filter(a => a.status === 'completed').length;
    const completedReports = caseData.reports.filter(r => r.status === 'completed').length;
    
    // Documents are always considered "completed" once uploaded
    const completedItems = caseData.documents.length + completedAssessments + completedReports;
    
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const renderTimelineItem = (item: any, type: string) => {
    const getIcon = () => {
      switch (type) {
        case 'document': return <FileText className="w-4 h-4" />;
        case 'assessment': return <ClipboardCheck className="w-4 h-4" />;
        case 'report': return <Book className="w-4 h-4" />;
        case 'note': return <MessageSquare className="w-4 h-4" />;
        default: return <FileText className="w-4 h-4" />;
      }
    };

    return (
      <div key={item.id} className="flex gap-3 mb-4 relative">
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 shrink-0">
          {getIcon()}
        </div>
        <div className="relative pb-8 border-l border-muted ml-4 pl-4 -mt-2">
          <h4 className="text-sm font-medium">{type === 'note' ? 'Case Note Added' : item.name || item.title}</h4>
          <p className="text-xs text-muted-foreground">
            {type === 'document' || type === 'external' 
              ? `Uploaded by ${item.uploadedBy}`
              : type === 'note' 
                ? item.content.substring(0, 50) + (item.content.length > 50 ? '...' : '')
                : item.description || ''}
          </p>
          <span className="text-xs text-muted-foreground absolute top-0 right-0">
            {formatDate(item.uploadDate || item.date || item.createdAt)}
          </span>
        </div>
      </div>
    );
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
                
                <div className="mt-3 mb-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{getCaseProgress(caseSilo)}%</span>
                  </div>
                  <div className="w-full bg-muted h-1.5 rounded-full">
                    <div 
                      className="bg-primary h-1.5 rounded-full" 
                      style={{ width: `${getCaseProgress(caseSilo)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="flex flex-col items-center p-1 bg-muted/30 rounded">
                    <FileText className="w-4 h-4 text-muted-foreground mb-1" />
                    <span className="text-xs">{caseSilo.documents.length} docs</span>
                  </div>
                  <div className="flex flex-col items-center p-1 bg-muted/30 rounded">
                    <ClipboardCheck className="w-4 h-4 text-muted-foreground mb-1" />
                    <span className="text-xs">{caseSilo.assessments.length} assess.</span>
                  </div>
                  <div className="flex flex-col items-center p-1 bg-muted/30 rounded">
                    <Book className="w-4 h-4 text-muted-foreground mb-1" />
                    <span className="text-xs">{caseSilo.reports.length} reports</span>
                  </div>
                  <div className="flex flex-col items-center p-1 bg-muted/30 rounded">
                    <MessageSquare className="w-4 h-4 text-muted-foreground mb-1" />
                    <span className="text-xs">{caseSilo.notes.length} notes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Role-specific permission checks
  const canViewInternalNotes = () => currentUser?.role === 'lawyer' || currentUser?.role === 'psychologist';
  const canAddAssessments = () => currentUser?.role === 'psychologist';
  const canEditReports = () => currentUser?.role === 'psychologist';
  const canCreateSilo = () => currentUser?.role === 'lawyer';
  const canShareAccess = () => currentUser?.role === 'lawyer';
  const canUploadDocuments = () => true; // All roles can upload

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
            <div className="flex items-center gap-1 mt-1">
              <span className="text-sm text-muted-foreground">Created: {formatDate(selectedCase.createdDate)}</span>
              <span className="text-sm text-muted-foreground mx-2">•</span>
              <span className="text-sm text-muted-foreground">Expires: {formatDate(selectedCase.expiryDate)}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge variant={selectedCase.status === "active" ? "default" : "outline"} className="mb-2">
              {selectedCase.status === "active" ? "Active" : "Expired"}
            </Badge>
            
            <div className="flex gap-2">
              {currentUser?.role === 'psychologist' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => handleInterviewClick(selectedCase.id)}
                >
                  <User className="w-4 h-4" /> Interview Client
                </Button>
              )}
              
              {canShareAccess() && (
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Manage Access
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <Tabs 
              defaultValue="overview" 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as any)}
              className="w-full"
            >
              <div className="overflow-auto">
                <TabsList className="grid grid-flow-col auto-cols-max gap-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="assessments">Assessments</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="notes">Case Notes</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="external">External Uploads</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-4">
            <TabsContent value="overview" className="mt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Case Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-2 bg-muted/20 rounded-md">
                      <span className="font-medium">Case Type</span>
                      <span>{selectedCase.caseType}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/20 rounded-md">
                      <span className="font-medium">Status</span>
                      <Badge variant={selectedCase.status === "active" ? "default" : "outline"}>
                        {selectedCase.status === "active" ? "Active" : "Expired"}
                      </Badge>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/20 rounded-md">
                      <span className="font-medium">Created</span>
                      <span>{formatDate(selectedCase.createdDate)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/20 rounded-md">
                      <span className="font-medium">Expiry</span>
                      <span>{formatDate(selectedCase.expiryDate)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/20 rounded-md">
                      <span className="font-medium">Case Progress</span>
                      <span>{getCaseProgress(selectedCase)}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Key Participants</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">C</div>
                        <div>
                          <p className="font-medium">{selectedCase.claimantName}</p>
                          <p className="text-xs text-muted-foreground">Claimant</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">L</div>
                        <div>
                          <p className="font-medium">Lawyer Name</p>
                          <p className="text-xs text-muted-foreground">Legal Representative</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">P</div>
                        <div>
                          <p className="font-medium">Psychologist Name</p>
                          <p className="text-xs text-muted-foreground">Clinical Psychologist</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Case Activity</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm flex items-center">
                        <FileText className="w-4 h-4 mr-1" /> Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3 pt-0">
                      <div className="text-2xl font-bold">{selectedCase.documents.length}</div>
                      <p className="text-xs text-muted-foreground">files uploaded</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm flex items-center">
                        <ClipboardCheck className="w-4 h-4 mr-1" /> Assessments
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3 pt-0">
                      <div className="text-2xl font-bold">{selectedCase.assessments.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {selectedCase.assessments.filter(a => a.status === 'completed').length} completed
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm flex items-center">
                        <Book className="w-4 h-4 mr-1" /> Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3 pt-0">
                      <div className="text-2xl font-bold">{selectedCase.reports.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {selectedCase.reports.filter(r => r.status === 'completed').length} finalized
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" /> Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3 pt-0">
                      <div className="text-2xl font-bold">{selectedCase.notes.length}</div>
                      <p className="text-xs text-muted-foreground">case notes</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
                <div className="space-y-4">
                  {selectedCase.notes.length > 0 && renderTimelineItem(selectedCase.notes[0], 'note')}
                  {selectedCase.documents.length > 0 && renderTimelineItem(selectedCase.documents[0], 'document')}
                  {selectedCase.assessments.length > 0 && renderTimelineItem(selectedCase.assessments[0], 'assessment')}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-0 space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Documents</h3>
                {canUploadDocuments() && (
                  <Button size="sm" onClick={() => handleCreateItem('document')}>
                    <Plus className="w-4 h-4 mr-1" /> Add Document
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                {selectedCase.documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
                    <h3 className="mt-3 text-lg font-medium">No documents</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                      {canUploadDocuments() 
                        ? "Upload documents related to this case"
                        : "No documents have been uploaded yet"
                      }
                    </p>
                    {canUploadDocuments() && (
                      <Button className="mt-4" size="sm" variant="outline" onClick={() => handleCreateItem('document')}>
                        <Upload className="w-4 h-4 mr-1" /> Upload Document
                      </Button>
                    )}
                  </div>
                ) : (
                  selectedCase.documents.map(doc => (
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
            </TabsContent>
            
            <TabsContent value="assessments" className="mt-0 space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Assessments</h3>
                {canAddAssessments() && (
                  <Button size="sm" onClick={() => handleCreateItem('assessment')}>
                    <Plus className="w-4 h-4 mr-1" /> Add Assessment
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                {selectedCase.assessments.length === 0 ? (
                  <div className="text-center py-8">
                    <ClipboardCheck className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
                    <h3 className="mt-3 text-lg font-medium">No assessments</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                      {canAddAssessments() 
                        ? "Create assessments for the client to complete"
                        : "No assessments have been assigned yet"
                      }
                    </p>
                    {canAddAssessments() && (
                      <Button className="mt-4" size="sm" variant="outline" onClick={() => handleCreateItem('assessment')}>
                        <Plus className="w-4 h-4 mr-1" /> Create Assessment
                      </Button>
                    )}
                  </div>
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
                {canEditReports() && (
                  <Button size="sm" onClick={() => handleCreateItem('report')}>
                    <Plus className="w-4 h-4 mr-1" /> Add Report
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                {selectedCase.reports.length === 0 ? (
                  <div className="text-center py-8">
                    <Book className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
                    <h3 className="mt-3 text-lg font-medium">No reports</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                      {canEditReports() 
                        ? "Create reports based on assessments and interviews"
                        : "No reports have been created yet"
                      }
                    </p>
                    {canEditReports() && (
                      <Button className="mt-4" size="sm" variant="outline" onClick={() => handleCreateItem('report')}>
                        <Plus className="w-4 h-4 mr-1" /> Create Report
                      </Button>
                    )}
                  </div>
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
            </TabsContent>
            
            <TabsContent value="notes" className="mt-0 space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Case Notes</h3>
                {canViewInternalNotes() && (
                  <Button size="sm" onClick={() => handleCreateItem('note')}>
                    <Plus className="w-4 h-4 mr-1" /> Add Note
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                {selectedCase.notes.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
                    <h3 className="mt-3 text-lg font-medium">No case notes</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                      {canViewInternalNotes() 
                        ? "Add notes to track important case information"
                        : "No notes have been added yet"
                      }
                    </p>
                    {canViewInternalNotes() && (
                      <Button className="mt-4" size="sm" variant="outline" onClick={() => handleCreateItem('note')}>
                        <Plus className="w-4 h-4 mr-1" /> Add Note
                      </Button>
                    )}
                  </div>
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
            
            <TabsContent value="timeline" className="mt-0">
              <h3 className="text-lg font-medium mb-4">Case Timeline</h3>
              
              <div className="relative pb-4">
                {selectedCase.documents.map(doc => renderTimelineItem(doc, 'document'))}
                {selectedCase.assessments.map(assessment => renderTimelineItem(assessment, 'assessment'))}
                {selectedCase.reports.map(report => renderTimelineItem(report, 'report'))}
                {selectedCase.notes.map(note => renderTimelineItem(note, 'note'))}
              </div>
            </TabsContent>
            
            <TabsContent value="external" className="mt-0 space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">External Uploads</h3>
                {canShareAccess() && (
                  <Button size="sm" onClick={() => handleCreateItem('external')}>
                    <Plus className="w-4 h-4 mr-1" /> Request External Upload
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                {selectedCase.externalUploads.length === 0 ? (
                  <div className="text-center py-8">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
                    <h3 className="mt-3 text-lg font-medium">No external uploads</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                      {canShareAccess() 
                        ? "Request documents from external parties like a GP or rehab provider"
                        : "No external party uploads available"
                      }
                    </p>
                    {canShareAccess() && (
                      <Button className="mt-4" size="sm" variant="outline" onClick={() => handleCreateItem('external')}>
                        <Plus className="w-4 h-4 mr-1" /> Request Upload
                      </Button>
                    )}
                  </div>
                ) : (
                  selectedCase.externalUploads.map(doc => (
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
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-destructive opacity-50" />
        <h3 className="mt-4 text-lg font-medium">Error Loading Case Data</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {error}
        </p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

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
        
        {canCreateSilo() && (
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
