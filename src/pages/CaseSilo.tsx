import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { 
  Archive, 
  Search, 
  User, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Clock as ClockIcon, 
  AlertCircle,
  Upload,
  ArrowLeftCircle
} from "lucide-react";
import { formatDate, v4 } from '@/lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { 
  CaseSilo as CaseSiloType, 
  ClaimStage
} from '@/types';
import CaseOverview from '@/components/caseSilo/CaseOverview';
import CaseDocuments from '@/components/caseSilo/CaseDocuments';
import CaseAssessments from '@/components/caseSilo/CaseAssessments';
import CaseReports from '@/components/caseSilo/CaseReports';
import CaseNotes from '@/components/caseSilo/CaseNotes';
import CaseTimeline from '@/components/caseSilo/CaseTimeline';
import ExternalUploads from '@/components/caseSilo/ExternalUploads';
import CaseSiloList from '@/components/caseSilo/CaseSiloList';
import InfoRequests from '@/components/caseSilo/InfoRequests';
import ErrorDisplay from '@/components/ErrorDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Progress } from '@/components/ui/progress';
import { CreateCaseSilo } from '@/components/caseSilo/CreateCaseSilo';
import MilestoneTracker, { Milestone } from '@/components/caseSilo/MilestoneTracker';
import CaseMilestoneSummary from '@/components/caseSilo/CaseMilestoneSummary';
import MsConfeeAssistant from '@/components/caseSilo/MsConfeeAssistant';

const CaseSiloPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [caseSilos, setCaseSilos] = useState<CaseSiloType[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'assessments' | 'reports' | 'notes' | 'timeline' | 'external' | 'info-requests'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateSilo, setShowCreateSilo] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

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
            claimNumber: "WC2023-12345",
            referralSource: "Smith & Associates",
            injuryDate: "2023-02-10",
            currentStage: "Assessment",
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
                uploadRole: "psychologist",
                uploadDate: "2023-03-20",
                url: "#",
                size: "1.2 MB"
              },
              {
                id: "doc2",
                name: "Medical Records.pdf",
                type: "application/pdf",
                uploadedBy: "Dr. Johnson",
                uploadRole: "external",
                uploadDate: "2023-03-25",
                url: "#",
                size: "3.4 MB"
              }
            ],
            assessments: [
              {
                id: "assess1",
                title: "DASS-21 Psychological Assessment",
                description: "Depression, Anxiety and Stress Scale",
                status: "completed",
                completionPercentage: 100,
                date: "2023-04-05",
                assignedTo: "John Doe"
              },
              {
                id: "assess2",
                title: "PCL-5 Assessment",
                description: "PTSD Checklist for DSM-5",
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
              },
              {
                id: "report2",
                title: "Vocational Assessment Report",
                patientName: "John Doe",
                date: "2023-04-20",
                type: "vocational",
                status: "for_review",
                content: {
                  overview: "Analysis of return to work capabilities and restrictions.",
                  findings: [
                    "Limited lifting capacity (5kg maximum)",
                    "Unable to perform repetitive movements",
                    "Mental health considerations for workplace reintegration"
                  ],
                  recommendations: "Graduated return to work plan with accommodations"
                },
                lastEdited: "2023-04-19"
              }
            ],
            notes: [
              {
                id: "note1",
                content: "Client reported improvement in sleep patterns after beginning medication.",
                createdBy: "Dr. Smith",
                createdAt: "2023-04-20",
                isPrivate: true,
                visibleTo: ["lawyer", "psychologist"]
              },
              {
                id: "note2",
                content: "Discussed potential return to work strategies and accommodations.",
                createdBy: "Dr. Smith",
                createdAt: "2023-05-02",
                isPrivate: false,
                visibleTo: ["lawyer", "psychologist", "claimant"]
              }
            ],
            infoRequests: [
              {
                id: "info1",
                title: "Additional Medical Information",
                questions: [
                  "Please provide the name and contact details of your current GP.",
                  "Have you had any previous similar injuries?",
                  "Are you currently taking any medication for pain management?"
                ],
                requestedBy: "John Smith, Lawyer",
                dateRequested: "2023-04-10",
                status: "pending",
                dueDate: "2023-04-25"
              }
            ],
            externalUploads: [
              {
                id: "ext1",
                name: "GP Medical Certificate.pdf",
                type: "application/pdf",
                uploadedBy: "Dr. Reynolds (GP)",
                uploadRole: "external",
                uploadDate: "2023-04-10",
                url: "#",
                size: "0.8 MB",
                isExternal: true
              }
            ],
            completedStages: ["Intake & Triage", "Legal Review"],
            categoryTags: ["TRM", "WORK", "LEGAL"]
          },
          {
            id: "2",
            claimantName: "Jane Smith",
            caseType: "Car Accident",
            claimNumber: "CTP2023-7890",
            referralSource: "Johnson Legal",
            injuryDate: "2023-01-05",
            currentStage: "Legal Review",
            status: "expiring_soon",
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
                uploadRole: "external",
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
                createdAt: "2023-02-28",
                isPrivate: true,
                visibleTo: ["psychologist"]
              }
            ],
            infoRequests: [],
            externalUploads: [],
            completedStages: ["Intake & Triage"],
            categoryTags: ["ANX", "TRM"]
          }
        ];
        
        // Generate mock milestones for the selected case
        if (selectedCaseId) {
          const mockMilestones: Milestone[] = [
            {
              id: "m1",
              type: "intake",
              title: "Initial Intake Session",
              date: "2023-03-18",
              description: "Client onboarded and case created",
              status: "completed"
            },
            {
              id: "m2",
              type: "document",
              title: "Medical Records Added",
              date: "2023-03-25",
              description: "GP medical records uploaded",
              status: "completed",
              relatedItemId: "doc1"
            },
            {
              id: "m3",
              type: "assessment",
              title: "DASS-21 Completed",
              date: "2023-04-05",
              description: "Client completed psychological assessment",
              status: "completed",
              relatedItemId: "assess1"
            },
            {
              id: "m4",
              type: "key_session",
              title: "Trauma Processing Session",
              date: "2023-04-12",
              description: "Key therapeutic session - trauma narrative",
              status: "completed"
            },
            {
              id: "m5",
              type: "report",
              title: "Initial Report Completed",
              date: "2023-04-15",
              description: "Psychological assessment report finalized",
              status: "completed",
              relatedItemId: "report1"
            }
          ];
          setMilestones(mockMilestones);
        }
        
        // Filter cases based on user role
        // If user is a claimant, only show cases where they are the claimant
        let filteredSilos = mockCaseSilos;
        if (currentUser?.role === 'claimant') {
          filteredSilos = mockCaseSilos.filter(caseSilo => 
            caseSilo.participants.claimantId === currentUser.id
          );
          
          // For demo purposes, if no cases match the current user's ID, just show the first case
          // In a real app, this would be removed and only the user's actual cases would be shown
          if (filteredSilos.length === 0 && mockCaseSilos.length > 0) {
            filteredSilos = [mockCaseSilos[0]];
          }
        }
        
        setCaseSilos(filteredSilos);
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
  }, [currentUser, selectedCaseId]);

  const filteredCaseSilos = caseSilos.filter(caseSilo => 
    caseSilo.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseSilo.caseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (caseSilo.claimNumber && caseSilo.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedCase = selectedCaseId ? caseSilos.find(cs => cs.id === selectedCaseId) : null;

  // Function to get tag color classes
  const getTagColorClasses = (tag: string) => {
    const tagColors: Record<string, string> = {
      'ANX': 'bg-blue-500 text-white',
      'MOOD': 'bg-purple-500 text-white',
      'TRM': 'bg-red-500 text-white',
      'PERS': 'bg-orange-500 text-white',
      'REL': 'bg-pink-500 text-white',
      'LIFE': 'bg-yellow-500 text-black',
      'WORK': 'bg-green-500 text-white',
      'LEGAL': 'bg-slate-500 text-white',
      'PAIN': 'bg-rose-500 text-white',
      'NDV': 'bg-indigo-500 text-white',
      'EDU': 'bg-cyan-500 text-white',
      'EXIS': 'bg-violet-500 text-white',
      'SOC': 'bg-amber-500 text-black',
      'IDEN': 'bg-lime-500 text-black',
      'JUST': 'bg-gray-500 text-white',
      'MED': 'bg-emerald-500 text-white',
      'ADDX': 'bg-fuchsia-500 text-white',
      'COG': 'bg-teal-500 text-white',
    };
    
    return tagColors[tag] || 'bg-gray-400 text-white';
  };

  // Handle navigation to interview
  const handleInterviewClick = (caseId: string) => {
    navigate(`/interview/${caseId}`);
  };

  // Handle new item creation
  const handleCreateItem = (type: 'document' | 'assessment' | 'report' | 'note' | 'external' | 'info-request') => {
    if (!selectedCaseId) return;
    
    toast({
      title: `New ${type} created`,
      description: `A new ${type} has been added to the case.`,
    });
  };

  // Handle creation of a new case silo
  const handleCreateSilo = (newSilo: CaseSiloType) => {
    setCaseSilos([newSilo, ...caseSilos]);
    toast({
      title: "Case created",
      description: `New case for ${newSilo.claimantName} has been created successfully.`,
    });
    // Select the newly created case
    setSelectedCaseId(newSilo.id);
  };

  // Calculate progress through claim stages
  const calculateClaimProgress = (caseSilo: CaseSiloType) => {
    const allStages: ClaimStage[] = [
      'Intake & Triage', 
      'Legal Review', 
      'Assessment', 
      'Report', 
      'Lodgement', 
      'Outcome'
    ];
    
    const completedCount = caseSilo.completedStages?.length || 0;
    return (completedCount / allStages.length) * 100;
  };

  // Role-specific permission checks
  const canViewInternalNotes = () => currentUser?.role === 'lawyer' || currentUser?.role === 'psychologist';
  const canAddAssessments = () => currentUser?.role === 'psychologist';
  const canEditReports = () => currentUser?.role === 'psychologist';
  const canCreateSilo = () => currentUser?.role === 'lawyer' || currentUser?.role === 'psychologist';
  const canShareAccess = () => currentUser?.role === 'lawyer';
  const canUploadDocuments = () => true; // All roles can upload
  const canCreateInfoRequests = () => currentUser?.role === 'lawyer' || currentUser?.role === 'psychologist';
  const canManageExpiryDate = () => currentUser?.role === 'lawyer';

  // Check if silo is expired to determine if edits are allowed
  const canEdit = (caseStatus: string) => caseStatus !== 'expired';

  // Calculate days until expiry for a case
  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get status display details
  const getStatusDetails = (status: string, expiryDate: string) => {
    const daysLeft = getDaysUntilExpiry(expiryDate);
    
    switch(status) {
      case 'active':
        return {
          label: "Active",
          variant: "default" as const,
          message: `Expires in ${daysLeft} days`
        };
      case 'expiring_soon':
        return {
          label: "Expiring Soon",
          variant: "secondary" as const,
          message: `Expires in ${daysLeft} days`
        };
      case 'expired':
        return {
          label: "Expired",
          variant: "destructive" as const,
          message: "Read only access"
        };
      default:
        return {
          label: status.charAt(0).toUpperCase() + status.slice(1),
          variant: "outline" as const,
          message: `Expires in ${daysLeft} days`
        };
    }
  };

  const handleMilestoneClick = (milestone: Milestone) => {
    // Handle milestone click based on type and relatedItemId
    if (milestone.relatedItemId) {
      // Navigate to the appropriate tab and item
      switch (milestone.type) {
        case 'document':
          setActiveTab('documents');
          break;
        case 'assessment':
          setActiveTab('assessments');
          break;
        case 'report':
          setActiveTab('reports');
          break;
        case 'external':
          setActiveTab('external');
          break;
        case 'letter':
        case 'meeting':
        case 'referral':
        default:
          // For other types, just show a toast message for now
          toast({
            title: milestone.title,
            description: milestone.description,
          });
      }
    } else {
      // Show details in a toast if no related item
      toast({
        title: milestone.title,
        description: milestone.description,
      });
    }
  };
  
  const handleMarkMilestone = (type: Milestone['type'], itemId?: string) => {
    // This function would be called when a user marks an item as a milestone
    toast({
      title: "Milestone marked",
      description: `Item has been marked as a milestone.`,
    });
    
    // In a real app, you would save this to your backend
    const newMilestone: Milestone = {
      id: v4(),
      type: type,
      title: `New ${type} milestone`,
      date: new Date().toISOString(),
      description: `This ${type} has been marked as a milestone`,
      status: "completed",
      relatedItemId: itemId
    };
    
    setMilestones(prev => [newMilestone, ...prev]);
  };

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

    const statusDetails = getStatusDetails(selectedCase.status, selectedCase.expiryDate);

    // Map of category tag IDs to full names for display
    const CATEGORY_FULL_NAMES: Record<string, string> = {
      'ANX': 'Anxiety / Stress',
      'MOOD': 'Mood Disorders',
      'TRM': 'Trauma / PTSD',
      'PERS': 'Personality / Behaviour',
      'REL': 'Relationships / Families',
      'LIFE': 'Life Changes / Grief',
      'WORK': 'Workplace Stress / Bullying',
      'LEGAL': 'Legal / Compensation Issues',
      'PAIN': 'Pain / Physical Injury',
      'NDV': 'Neurodiversity Support',
      'EDU': 'Academic / School Challenges',
      'EXIS': 'Existential / Spiritual Crises',
      'SOC': 'Cultural / Social Oppression',
      'IDEN': 'Identity / Affirmation',
      'JUST': 'Forensic / Justice Involvement',
      'MED': 'Medical / Health Psychology',
      'ADDX': 'Addiction / Compulsive Behaviour',
      'COG': 'Cognitive Decline / Dementia',
    };

    return (
      <div>
        {/* Ms Confee AI Assistant - Floating */}
        <MsConfeeAssistant 
          caseData={selectedCase}
          activeTab={activeTab}
          milestones={milestones}
        />
        
        <Button 
          className="bg-accent text-accent-foreground hover:bg-accent/90 hover:text-white mb-4"
          onClick={() => setSelectedCaseId(null)} 
        >
          <ArrowLeftCircle className="w-4 h-4 mr-2" />
          Back to Cases
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{selectedCase.claimantName}</h1>
              <Badge variant={statusDetails.variant}>{statusDetails.label}</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-muted-foreground">{selectedCase.caseType}</p>
              {selectedCase.claimNumber && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <p className="text-muted-foreground">Claim #{selectedCase.claimNumber}</p>
                </>
              )}
              <span className="text-muted-foreground">•</span>
              <p className="text-muted-foreground">{statusDetails.message}</p>
            </div>
            
            {/* Case Categories with full names and colors */}
            {selectedCase.categoryTags && selectedCase.categoryTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedCase.categoryTags.map(tag => (
                  <Badge 
                    key={tag} 
                    className={`text-xs ${getTagColorClasses(tag)} border-0`}
                  >
                    {CATEGORY_FULL_NAMES[tag] || tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-3">
              <div className="flex items-center gap-1">
                <Calendar className="text-muted-foreground w-4 h-4" />
                <span className="text-sm text-muted-foreground">Created: {formatDate(selectedCase.createdDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="text-muted-foreground w-4 h-4" />
                <span className="text-sm text-muted-foreground">Expires: {formatDate(selectedCase.expiryDate)}</span>
              </div>
              {selectedCase.injuryDate && (
                <div className="flex items-center gap-1">
                  <AlertCircle className="text-muted-foreground w-4 h-4" />
                  <span className="text-sm text-muted-foreground">Injury Date: {formatDate(selectedCase.injuryDate)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3 mt-2 sm:mt-0">
            <div className="flex gap-2">
              {canShareAccess() && canEdit(selectedCase.status) && (
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Manage Access
                </Button>
              )}
              
              {canManageExpiryDate() && (
                <Button size="sm" variant={selectedCase.status === 'expired' ? 'default' : 'outline'} className="flex items-center gap-2">
                  {selectedCase.status === 'expired' ? 'Reactivate' : 'Extend'} Silo
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Case Milestones</h3>
          <MilestoneTracker 
            milestones={milestones} 
            onMilestoneClick={handleMilestoneClick}
          />
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
                  <TabsTrigger value="info-requests">Info Requests</TabsTrigger>
                  <TabsTrigger value="external">External Uploads</TabsTrigger>
                </TabsList>
              </div>
              <CardContent className="pt-4">
                <TabsContent value="overview" className="mt-0">
                  <CaseOverview caseData={selectedCase} />
                </TabsContent>
                
                <TabsContent value="documents" className="mt-0">
                  <CaseDocuments 
                    documents={selectedCase.documents} 
                    canUpload={canUploadDocuments() && canEdit(selectedCase.status)} 
                    onCreateItem={() => handleCreateItem('document')} 
                  />
                </TabsContent>
                
                <TabsContent value="assessments" className="mt-0">
                  <CaseAssessments 
                    assessments={selectedCase.assessments} 
                    canAdd={canAddAssessments() && canEdit(selectedCase.status)} 
                    onCreateItem={() => handleCreateItem('assessment')} 
                  />
                </TabsContent>
                
                <TabsContent value="reports" className="mt-0">
                  <CaseReports 
                    reports={selectedCase.reports} 
                    canEdit={canEditReports() && canEdit(selectedCase.status)} 
                    onCreateItem={() => handleCreateItem('report')} 
                  />
                </TabsContent>
                
                <TabsContent value="notes" className="mt-0">
                  <CaseNotes 
                    notes={selectedCase.notes} 
                    canView={canViewInternalNotes()} 
                    canCreate={canViewInternalNotes() && canEdit(selectedCase.status)}
                    onCreateItem={() => handleCreateItem('note')} 
                    currentUserRole={currentUser?.role}
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
                
                <TabsContent value="info-requests" className="mt-0">
                  <InfoRequests 
                    requests={selectedCase.infoRequests} 
                    canCreate={canCreateInfoRequests() && canEdit(selectedCase.status)}
                    onCreateItem={() => handleCreateItem('info-request')}
                    userRole={currentUser?.role}
                  />
                </TabsContent>
                
                <TabsContent value="external" className="mt-0">
                  <ExternalUploads 
                    uploads={selectedCase.externalUploads} 
                    canShare={canShareAccess() && canEdit(selectedCase.status)} 
                    onCreateItem={() => handleCreateItem('external')} 
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </CardHeader>
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
          <h1 className="text-3xl font-bold mb-1">Case Management</h1>
          <p className="text-muted-foreground mb-6">
            Access all information related to your {currentUser?.role === 'claimant' ? '' : 'clients\''} cases in one secure location
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
              <Button onClick={() => setShowCreateSilo(true)}>
                <Plus className="w-4 h-4 mr-1" /> New Case
              </Button>
            )}
          </div>
          
          <CaseSiloList 
            caseSilos={filteredCaseSilos} 
            onSelectCase={setSelectedCaseId} 
            searchTerm={searchTerm}
          />
          
          <CreateCaseSilo 
            open={showCreateSilo}
            onOpenChange={setShowCreateSilo}
            onCreateSilo={handleCreateSilo}
          />
        </>
      )}
    </div>
  );
};

export default CaseSiloPage;
