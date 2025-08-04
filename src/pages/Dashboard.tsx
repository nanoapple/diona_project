import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress, SegmentedProgress } from '@/components/ui/progress';
import { SegmentedReportProgress } from '@/components/ui/segmented-progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Clock, AlertCircle, FileText, Calendar, Flag } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import MilestoneTracker, { Milestone } from '@/components/caseSilo/MilestoneTracker';
import { toast } from "@/components/ui/use-toast";

interface CaseUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'document' | 'status' | 'appointment';
}

interface Case {
  id: string;
  title: string;
  status: 'active' | 'pending' | 'completed';
  progress: number;
  currentStage: number;
  updates: CaseUpdate[];
  type: string;
  client?: string;
}

// Define our progress stages
const progressStages = [
  {
    title: 'Intake & Triage',
    description: 'Claimant signs up, completes symptom screener, uploads incident documents',
    complete: true,
    tasks: []
  },
  {
    title: 'Legal & Clinical Review',
    description: 'Lawyer and psychologist review documents, determine eligibility and next steps',
    complete: true,
    tasks: []
  },
  {
    title: 'Assessment Phase',
    description: 'Psychological assessments assigned, GP info requested, claimant completes interviews',
    complete: false,
    active: true,
    tasks: []
  },
  {
    title: 'Report Preparation',
    description: 'AI-supported report drafted (Capacity or Vocational), reviewed by psychologist',
    complete: false,
    tasks: []
  },
  {
    title: 'Lodgement & Action',
    description: 'Lawyer compiles report with other evidence, submits to insurer/SIRA',
    complete: false,
    tasks: []
  },
  {
    title: 'Outcome & Review',
    description: 'Claimant notified of decision, may request appeal, follow-up or rehab plan',
    complete: false,
    tasks: []
  }
];

// Role-specific tasks for each stage
const getTasksForStage = (stageIndex: number, userRole: string) => {
  switch(userRole) {
    case 'claimant':
    case 'client':
      switch(stageIndex) {
        case 0: // Intake & Triage
          return [
            { description: 'Complete signup form', complete: true },
            { description: 'Fill out symptom screener', complete: true },
            { description: 'Upload incident report', complete: true }
          ];
        case 1: // Legal & Clinical Review
          return [
            { description: 'Attend initial consultation', complete: true },
            { description: 'Sign consent forms', complete: true }
          ];
        case 2: // Assessment Phase
          return [
            { description: 'Complete PCL-5 assessment', complete: true },
            { description: 'Attend psychological interview', complete: false },
            { description: 'Provide GP contact details', complete: true }
          ];
        case 3: // Report Preparation
          return [
            { description: 'Review draft report for accuracy', complete: false }
          ];
        case 4: // Lodgement & Action
          return [
            { description: 'Sign final documents', complete: false }
          ];
        case 5: // Outcome & Review
          return [
            { description: 'Complete feedback survey', complete: false },
            { description: 'Schedule follow-up appointment', complete: false }
          ];
        default:
          return [];
      }
    case 'lawyer':
      switch(stageIndex) {
        case 0: // Intake & Triage
          return [
            { description: 'Review client intake form', complete: true },
            { description: 'Assess case eligibility', complete: true }
          ];
        case 1: // Legal & Clinical Review
          return [
            { description: 'Create case silo', complete: true },
            { description: 'Request medical records', complete: true },
            { description: 'Document initial legal advice', complete: true }
          ];
        case 2: // Assessment Phase
          return [
            { description: 'Review preliminary assessment', complete: false },
            { description: 'Request additional evidence if needed', complete: true }
          ];
        case 3: // Report Preparation
          return [
            { description: 'Review psychological report', complete: false },
            { description: 'Prepare legal summary', complete: false }
          ];
        case 4: // Lodgement & Action
          return [
            { description: 'Compile all evidence', complete: false },
            { description: 'Submit claim to insurer/SIRA', complete: false }
          ];
        case 5: // Outcome & Review
          return [
            { description: 'Analyze decision', complete: false },
            { description: 'Advise client on next steps', complete: false }
          ];
        default:
          return [];
      }
    case 'psychologist':
    case 'therapist':
      switch(stageIndex) {
        case 0: // Intake & Triage
          return [
            { description: 'Review symptom screener', complete: true }
          ];
        case 1: // Legal & Clinical Review
          return [
            { description: 'Plan assessment approach', complete: true },
            { description: 'Schedule initial consultation', complete: true }
          ];
        case 2: // Assessment Phase
          return [
            { description: 'Assign psychological assessments', complete: true },
            { description: 'Conduct clinical interview', complete: false },
            { description: 'Analyze assessment results', complete: false }
          ];
        case 3: // Report Preparation
          return [
            { description: 'Draft psychological assessment report', complete: false },
            { description: 'Document capacity evaluation', complete: false },
            { description: 'Finalize report', complete: false }
          ];
        case 4: // Lodgement & Action
          return [
            { description: 'Provide expert testimony if required', complete: false }
          ];
        case 5: // Outcome & Review
          return [
            { description: 'Plan rehabilitation strategy', complete: false },
            { description: 'Schedule follow-up assessment', complete: false }
          ];
        default:
          return [];
      }
    default:
      return [];
  }
};

// Mock report sections data
const getReportSections = (reportType: string) => {
  const johnDoeWorkInjuryReportSections = [
    { id: 1, title: 'Executive Summary', status: 'completed' as const },
    { id: 2, title: 'Background Information', status: 'completed' as const },
    { id: 3, title: 'Clinical Assessment', status: 'completed' as const },
    { id: 4, title: 'Psychological Testing', status: 'not-started' as const },
    { id: 5, title: 'Functional Assessment', status: 'not-started' as const },
    { id: 6, title: 'Recommendations', status: 'not-started' as const },
    { id: 7, title: 'Prognosis', status: 'not-started' as const },
    { id: 8, title: 'Conclusion', status: 'not-started' as const }
  ];

  const janeSmithMvaReportSections = [
    { id: 1, title: 'Executive Summary', status: 'completed' as const },
    { id: 2, title: 'Incident Details', status: 'completed' as const },
    { id: 3, title: 'Medical History', status: 'completed' as const },
    { id: 4, title: 'PTSD Assessment', status: 'completed' as const },
    { id: 5, title: 'Cognitive Assessment', status: 'completed' as const },
    { id: 6, title: 'Functional Capacity', status: 'completed' as const },
    { id: 7, title: 'Vocational Impact', status: 'completed' as const },
    { id: 8, title: 'Treatment History', status: 'completed' as const },
    { id: 9, title: 'Current Symptoms', status: 'completed' as const },
    { id: 10, title: 'Impact Analysis', status: 'completed' as const },
    { id: 11, title: 'Treatment Plan', status: 'completed' as const },
    { id: 12, title: 'Recommendations', status: 'not-started' as const },
    { id: 13, title: 'Prognosis', status: 'not-started' as const },
    { id: 14, title: 'Legal Considerations', status: 'not-started' as const },
    { id: 15, title: 'Conclusion', status: 'not-started' as const }
  ];

  const robertBrownWorkplaceStressSections = [
    { id: 1, title: 'Background', status: 'completed' as const },
    { id: 2, title: 'Workplace Factors', status: 'completed' as const },
    { id: 3, title: 'Psychological Assessment', status: 'completed' as const },
    { id: 4, title: 'Stress Indicators', status: 'completed' as const },
    { id: 5, title: 'Functional Impact', status: 'completed' as const },
    { id: 6, title: 'Coping Mechanisms', status: 'completed' as const },
    { id: 7, title: 'Treatment Response', status: 'completed' as const },
    { id: 8, title: 'Recommendations', status: 'not-started' as const },
    { id: 9, title: 'Return to Work Plan', status: 'not-started' as const },
    { id: 10, title: 'Follow-up Strategy', status: 'not-started' as const }
  ];

  switch (reportType) {
    case 'work-injury':
      return johnDoeWorkInjuryReportSections;
    case 'mva':
      return janeSmithMvaReportSections;
    case 'workplace-stress':
      return robertBrownWorkplaceStressSections;
    default:
      return johnDoeWorkInjuryReportSections;
  }
};

// Mock milestones data for each case
const getCaseMilestones = (caseId: string): Milestone[] => {
  if (caseId === '1') {
    return [
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
        status: "completed"
      },
      {
        id: "m3",
        type: "assessment",
        title: "DASS-21 Completed",
        date: "2023-04-05",
        description: "Client completed psychological assessment",
        status: "completed"
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
        status: "completed"
      }
    ];
  } else if (caseId === '2') {
    return [
      {
        id: "m6",
        type: "intake",
        title: "Initial Consultation",
        date: "2023-02-12",
        description: "Case silo created and client onboarded",
        status: "completed"
      },
      {
        id: "m7",
        type: "document",
        title: "Accident Report Filed",
        date: "2023-02-15",
        description: "Police accident report uploaded",
        status: "completed"
      },
      {
        id: "m8",
        type: "assessment",
        title: "PTSD Screening Done",
        date: "2023-02-25",
        description: "Initial trauma assessment completed",
        status: "completed"
      }
    ];
  }
  return [];
};

const getPendingTasks = (caseId: string) => {
  if (caseId === '1') {
    return [
      {
        id: "task1",
        title: "Complete PCL-5 Assessment",
        dueDate: "2023-05-05",
        priority: 'high' as const
      },
      {
        id: "task2", 
        title: "Review Vocational Report",
        dueDate: "2023-04-25",
        priority: 'medium' as const
      }
    ];
  }
  return [];
};


// Mock case silos data
const mockCaseSilos = [
  {
    id: '1',
    claimantName: 'John Doe',
    caseType: 'Work Injury',
    status: 'active' as const
  },
  {
    id: '2', 
    claimantName: 'Jane Smith',
    caseType: 'MVA',
    status: 'active' as const
  }
];

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  const handleMilestoneClick = (milestone: Milestone) => {
    // Navigate to case silo with appropriate tab
    let tab = 'overview';
    switch (milestone.type) {
      case 'document':
        tab = 'documents';
        break;
      case 'assessment':
        tab = 'assessments';
        break;
      case 'report':
        tab = 'reports';
        break;
      case 'external':
        tab = 'external';
        break;
      default:
        tab = 'overview';
    }
    
    // Navigate to case silo - we need to find which case this milestone belongs to
    const caseForMilestone = mockCaseSilos.find(c => getCaseMilestones(c.id).some(m => m.id === milestone.id));
    if (caseForMilestone) {
      navigate(`/case-silo?case=${caseForMilestone.id}&tab=${tab}`);
    }
  };

  const handleTaskClick = (taskId: string) => {
    toast({
      title: "Task clicked",
      description: "Navigate to task details",
    });
  };

  useEffect(() => {
    // Simulate API call to fetch cases
    const fetchCases = async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCases: Case[] = [
        {
          id: '1',
          title: 'Work Injury Compensation',
          status: 'active',
          progress: 65,
          currentStage: 2, // Assessment Phase (0-indexed)
          type: 'Workplace Injury',
          client: 'John Doe',
          updates: [
            {
              id: '1',
              date: '2023-04-10',
              title: 'Medical Report Received',
              description: 'Your medical assessment report has been received and reviewed.',
              type: 'document'
            },
            {
              id: '2',
              date: '2023-04-05',
              title: 'Claim Status Update',
              description: 'Your claim is being processed by the insurance company.',
              type: 'status'
            },
            {
              id: '3',
              date: '2023-03-28',
              title: 'Psychological Assessment',
              description: 'Appointment scheduled with Dr. Smith for psychological assessment.',
              type: 'appointment'
            }
          ]
        },
        {
          id: '2',
          title: 'Car Accident Claim',
          status: 'pending',
          progress: 30,
          currentStage: 1, // Legal & Clinical Review (0-indexed)
          type: 'Motor Vehicle Accident',
          client: 'Jane Smith',
          updates: [
            {
              id: '1',
              date: '2023-04-12',
              title: 'Insurance Documentation Required',
              description: 'Please provide additional insurance documentation for your claim.',
              type: 'document'
            },
            {
              id: '2',
              date: '2023-04-01',
              title: 'Initial Assessment Complete',
              description: 'Your initial assessment has been completed and reviewed.',
              type: 'status'
            }
          ]
        }
      ];
      
      setCases(mockCases);
      if (mockCases.length > 0) {
        setSelectedCaseId(mockCases[0].id);
      }
      setIsLoading(false);
    };
    
    fetchCases();
  }, []);

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };
  
  const renderUpdateIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'appointment':
        return <Calendar className="w-4 h-4" />;
      case 'status':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const selectedCase = cases.find(c => c.id === selectedCaseId) || (cases.length > 0 ? cases[0] : null);

  const renderClaimantDashboard = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Your Claims</CardTitle>
            <CardDescription>Summary of your ongoing claims</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cases.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active claims in process</p>
            <div className="mt-4 space-y-2">
              {cases.map(c => (
                <div key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {renderStatusIcon(c.status)}
                    <span className="text-sm font-medium">{c.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Stage {c.currentStage + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Things you need to complete</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Complete psychological assessment</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Upload medical documents</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Review case update from your lawyer</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Dr. Smith - Psychological Assessment</div>
                  <div className="text-muted-foreground text-xs">In 3 days</div>
                </div>
                <div className="text-sm text-muted-foreground">April 25, 2023 - 10:00 AM</div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Lawyer Consultation</div>
                  <div className="text-muted-foreground text-xs">In 1 week</div>
                </div>
                <div className="text-sm text-muted-foreground">May 2, 2023 - 2:00 PM</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {cases.length > 0 && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Milestones</CardTitle>
              <CardDescription>Recent milestones for {cases[0].client}</CardDescription>
            </CardHeader>
            <CardContent>
              <MilestoneTracker
                milestones={getCaseMilestones('1')}
                onMilestoneClick={handleMilestoneClick}
              />
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Case Updates</CardTitle>
            <CardDescription>Latest updates on your case</CardDescription>
          </CardHeader>
          <CardContent>
            {cases.length > 0 && cases[0].updates.map(update => (
              <div key={update.id} className="mb-4 pb-4 border-b last:border-0 last:pb-0 last:mb-0">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-primary/10">
                    {renderUpdateIcon(update.type)}
                  </div>
                  <div className="font-medium">{update.title}</div>
                  <div className="text-xs text-muted-foreground ml-auto">{formatDate(update.date)}</div>
                </div>
                <p className="text-sm mt-1 text-muted-foreground pl-7">{update.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  const renderLawyerDashboard = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Cases</CardTitle>
            <CardDescription>Your current caseload</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cases.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active cases you're handling</p>
            <div className="mt-4 space-y-2">
              {cases.map(c => (
                <div key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {renderStatusIcon(c.status)}
                    <span className="text-sm font-medium">{c.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{c.client} • Stage {c.currentStage + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Document Requests</CardTitle>
            <CardDescription>Outstanding document requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Medical records - John Doe</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Employer statement - Jane Smith</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Psychological assessment - John Doe</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Client Meetings</CardTitle>
            <CardDescription>Your scheduled client meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">John Doe - Case Discussion</div>
                  <div className="text-muted-foreground text-xs">Tomorrow</div>
                </div>
                <div className="text-sm text-muted-foreground">April 20, 2023 - 11:00 AM</div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Jane Smith - Initial Consultation</div>
                  <div className="text-muted-foreground text-xs">In 3 days</div>
                </div>
                <div className="text-sm text-muted-foreground">April 23, 2023 - 2:00 PM</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Case Milestones</CardTitle>
            <CardDescription>Recent milestones and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select value={selectedCaseId} onValueChange={setSelectedCaseId}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select a case" />
                </SelectTrigger>
                <SelectContent>
                  {cases.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.client} - {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedCaseId && (
              <MilestoneTracker
                milestones={getCaseMilestones(selectedCaseId)}
                onMilestoneClick={handleMilestoneClick}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  const renderPsychologistDashboard = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Scheduled Appointments</CardTitle>
            <CardDescription>Your upcoming client appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div 
                className="cursor-pointer hover:bg-accent rounded-lg p-2 -m-2 transition-colors"
                onClick={() => navigate('/schedule')}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium">John Doe - Follow-up</div>
                  <div className="text-muted-foreground text-xs">Today</div>
                </div>
                <div className="text-sm text-muted-foreground">April 19, 2023 - 3:00 PM</div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Jane Smith - Initial Assessment</div>
                  <div className="text-muted-foreground text-xs">Tomorrow</div>
                </div>
                <div className="text-sm text-muted-foreground">April 20, 2023 - 10:00 AM</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Assessment Requests</CardTitle>
            <CardDescription>Pending psychological assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">Assessments awaiting completion</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">John Doe - Work Injury Assessment</span>
                </div>
                <span className="text-xs text-muted-foreground">Due in 3 days</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Jane Smith - MVA PTSD Evaluation</span>
                </div>
                <span className="text-xs text-muted-foreground">Urgent</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Report Status</CardTitle>
            <CardDescription>Your report generation progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <SegmentedReportProgress
                title="John Doe - Work Injury Report"
                sections={getReportSections('work-injury')}
              />
              <SegmentedReportProgress
                title="Jane Smith - MVA Report"
                sections={getReportSections('mva')}
              />
              <SegmentedReportProgress
                title="Robert Brown - Workplace Stress"
                sections={getReportSections('workplace-stress')}
              />
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4 pt-4 border-t">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-sm"></div>
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
                <span>Not Started</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Case Milestones</CardTitle>
            <CardDescription>Recent milestones and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select value={selectedCaseId} onValueChange={setSelectedCaseId}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select a case" />
                </SelectTrigger>
                <SelectContent>
                  {cases.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.client} - {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedCaseId && (
              <MilestoneTracker
                milestones={getCaseMilestones(selectedCaseId)}
                onMilestoneClick={handleMilestoneClick}
              />
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Assessment Completions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Robert Johnson</div>
                  <div className="text-sm text-muted-foreground">Work Injury Assessment</div>
                  <div className="text-xs text-muted-foreground mt-1">Completed on {formatDate(new Date(2023, 3, 15))}</div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Findings:</span> Moderate anxiety and depression related to workplace incident.
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Sarah Williams</div>
                  <div className="text-sm text-muted-foreground">Car Accident Trauma Assessment</div>
                  <div className="text-xs text-muted-foreground mt-1">Completed on {formatDate(new Date(2023, 3, 10))}</div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Findings:</span> PTSD symptoms meeting clinical threshold, affecting daily functioning.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderDashboardContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    switch (currentUser?.role) {
      case 'claimant':
      case 'client':
        return renderClaimantDashboard();
      case 'lawyer':
        return renderLawyerDashboard();
      case 'psychologist':
      case 'therapist':
        return renderPsychologistDashboard();
      case 'orgadmin':
      case 'intake':
        return renderLawyerDashboard(); // Show lawyer dashboard for admin roles
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Welcome back, {currentUser?.name}
      </p>
      {renderDashboardContent()}
    </div>
  );
};

export default Dashboard;
