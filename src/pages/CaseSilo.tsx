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
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const CaseSiloPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'assessments' | 'reports' | 'notes' | 'timeline' | 'external' | 'info-requests'>('overview');
  const [showCreateSilo, setShowCreateSilo] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  // Fetch case silos from Supabase
  const { data: caseSilos = [], isLoading, error, refetch } = useQuery({
    queryKey: ['case_silos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_silos')
        .select(`
          *,
          case_documents(*),
          assessments(*),
          reports(*),
          case_notes(*),
          info_requests(*),
          timeline_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database records to match CaseSiloType
      return (data || []).map(record => ({
        id: record.id,
        claimantName: record.claimant_name,
        caseType: record.case_type,
        claimNumber: record.case_number || '',
        referralSource: '',
        injuryDate: record.incident_date || '',
        currentStage: record.claim_stage || 'Intake & Triage',
        status: record.status as 'active' | 'expiring_soon' | 'expired',
        createdDate: record.created_at?.split('T')[0] || '',
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 months from now
        participants: {
          claimantId: '',
          lawyerId: record.assigned_lawyer_id || '',
          psychologistId: record.assigned_psychologist_id || '',
        },
        documents: (record.case_documents || []).map((doc: any) => ({
          id: doc.id,
          name: doc.title,
          type: doc.file_type || 'application/pdf',
          uploadedBy: 'Unknown',
          uploadRole: 'psychologist',
          uploadDate: doc.created_at?.split('T')[0] || '',
          url: doc.file_url,
          size: doc.file_size ? `${(doc.file_size / 1024 / 1024).toFixed(1)} MB` : 'N/A'
        })),
        assessments: (record.assessments || []).map((assess: any) => ({
          id: assess.id,
          title: assess.title,
          description: assess.type,
          status: assess.status as 'pending' | 'in_progress' | 'completed',
          completionPercentage: assess.status === 'completed' ? 100 : assess.status === 'in_progress' ? 50 : 0,
          date: assess.due_date || assess.created_at?.split('T')[0] || '',
          assignedTo: 'Client'
        })),
        reports: (record.reports || []).map((report: any) => ({
          id: report.id,
          title: report.title,
          patientName: record.claimant_name,
          date: report.due_date || report.created_at?.split('T')[0] || '',
          type: report.type as any,
          status: report.status as any,
          content: report.content || {},
          lastEdited: report.updated_at?.split('T')[0] || ''
        })),
        notes: (record.case_notes || []).map((note: any) => ({
          id: note.id,
          content: note.content,
          createdBy: 'Unknown',
          createdAt: note.created_at?.split('T')[0] || '',
          isPrivate: note.is_private || false,
          visibleTo: ['lawyer', 'psychologist']
        })),
        infoRequests: (record.info_requests || []).map((req: any) => ({
          id: req.id,
          title: req.title,
          questions: [req.description],
          requestedBy: 'Unknown',
          dateRequested: req.created_at?.split('T')[0] || '',
          status: req.status as 'pending' | 'completed',
          dueDate: req.due_date || ''
        })),
        externalUploads: [],
        completedStages: getCompletedStages(record.claim_stage),
        categoryTags: getCategoryTags(record.case_type)
      })) as CaseSiloType[];
    },
  });

  // Helper to determine completed stages based on current stage
  function getCompletedStages(currentStage: string | null): ClaimStage[] {
    const allStages: ClaimStage[] = ['Intake & Triage', 'Legal Review', 'Assessment', 'Report', 'Lodgement', 'Outcome'];
    const stageMap: Record<string, number> = {
      'intake': 0,
      'legal_review': 1,
      'assessment': 2,
      'report': 3,
      'lodgement': 4,
      'outcome': 5
    };
    const idx = stageMap[currentStage || 'intake'] || 0;
    return allStages.slice(0, idx);
  }

  // Helper to generate category tags based on case type
  function getCategoryTags(caseType: string): string[] {
    const tagMap: Record<string, string[]> = {
      'Workplace Injury': ['TRM', 'WORK', 'LEGAL'],
      'Car Accident': ['TRM', 'ANX'],
      'Personal Injury': ['TRM', 'PAIN'],
      'Family & Relationships': ['REL', 'MOOD'],
      'Anxiety & Stress': ['ANX', 'MOOD'],
      'Trauma & PTSD': ['TRM', 'ANX'],
    };
    return tagMap[caseType] || ['LEGAL'];
  }

  // Fetch milestones when a case is selected
  useEffect(() => {
    if (selectedCaseId) {
      // For now, generate mock milestones - could be fetched from timeline_items
      const selectedCase = caseSilos.find(c => c.id === selectedCaseId);
      if (selectedCase) {
        const mockMilestones: Milestone[] = [
          {
            id: "m1",
            type: "intake",
            title: "Case Created",
            date: selectedCase.createdDate,
            description: "Client onboarded and case created",
            status: "completed"
          }
        ];
        setMilestones(mockMilestones);
      }
    }
  }, [selectedCaseId, caseSilos]);

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
    refetch(); // Refresh the list from database
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
    return <ErrorDisplay message={error instanceof Error ? error.message : 'Failed to load cases'} onRetry={() => refetch()} />;
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
