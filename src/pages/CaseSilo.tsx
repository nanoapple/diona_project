
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
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
import { CaseSilo as CaseSiloType, CaseDocument, Assessment, Report, CaseNote, CaseSiloStatus } from '@/types';
import CaseOverview from '@/components/caseSilo/CaseOverview';
import CaseDocuments from '@/components/caseSilo/CaseDocuments';
import CaseAssessments from '@/components/caseSilo/CaseAssessments';
import CaseReports from '@/components/caseSilo/CaseReports';
import CaseNotes from '@/components/caseSilo/CaseNotes';
import CaseTimeline from '@/components/caseSilo/CaseTimeline';
import ExternalUploads from '@/components/caseSilo/ExternalUploads';
import CaseSiloList from '@/components/caseSilo/CaseSiloList';
import ErrorDisplay from '@/components/ErrorDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';

const CaseSiloPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
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
  }, []);

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

  // Role-specific permission checks
  const canViewInternalNotes = () => currentUser?.role === 'lawyer' || currentUser?.role === 'psychologist';
  const canAddAssessments = () => currentUser?.role === 'psychologist';
  const canEditReports = () => currentUser?.role === 'psychologist';
  const canCreateSilo = () => currentUser?.role === 'lawyer';
  const canShareAccess = () => currentUser?.role === 'lawyer';
  const canUploadDocuments = () => true; // All roles can upload

  const renderCaseDetail = () => {
    if (!selectedCase) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive opacity-50" />
          <h3 className="mt-4 text-lg font-medium">Case Not Found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            The selected case could not be found
          </p>
          <Button className="mt-4" onClick={() => setSelectedCaseId(null)}>
            Back to Cases
          </Button>
        </div>
      );
    }

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
            <TabsContent value="overview" className="mt-0">
              <CaseOverview caseData={selectedCase} />
            </TabsContent>
            
            <TabsContent value="documents" className="mt-0">
              <CaseDocuments 
                documents={selectedCase.documents} 
                canUpload={canUploadDocuments()} 
                onCreateItem={() => handleCreateItem('document')} 
              />
            </TabsContent>
            
            <TabsContent value="assessments" className="mt-0">
              <CaseAssessments 
                assessments={selectedCase.assessments} 
                canAdd={canAddAssessments()} 
                onCreateItem={() => handleCreateItem('assessment')} 
              />
            </TabsContent>
            
            <TabsContent value="reports" className="mt-0">
              <CaseReports 
                reports={selectedCase.reports} 
                canEdit={canEditReports()} 
                onCreateItem={() => handleCreateItem('report')} 
              />
            </TabsContent>
            
            <TabsContent value="notes" className="mt-0">
              <CaseNotes 
                notes={selectedCase.notes} 
                canView={canViewInternalNotes()} 
                onCreateItem={() => handleCreateItem('note')} 
              />
            </TabsContent>
            
            <TabsContent value="timeline" className="mt-0">
              <CaseTimeline 
                documents={selectedCase.documents}
                assessments={selectedCase.assessments}
                reports={selectedCase.reports}
                notes={selectedCase.notes}
                externalUploads={selectedCase.externalUploads}
              />
            </TabsContent>
            
            <TabsContent value="external" className="mt-0">
              <ExternalUploads 
                uploads={selectedCase.externalUploads} 
                canShare={canShareAccess()} 
                onCreateItem={() => handleCreateItem('external')} 
              />
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (error) {
    return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {selectedCaseId ? (
        renderCaseDetail()
      ) : (
        <>
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
          
          <CaseSiloList 
            caseSilos={filteredCaseSilos} 
            onSelectCase={setSelectedCaseId} 
            searchTerm={searchTerm}
          />
        </>
      )}
    </div>
  );
};

export default CaseSiloPage;
