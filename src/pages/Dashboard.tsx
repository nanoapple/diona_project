
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress, SegmentedProgress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Clock, AlertCircle, FileText, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

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
    case 'victim':
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

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const renderVictimDashboard = () => (
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
              <CardTitle>Claim Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {cases.length > 0 && (
                <SegmentedProgress 
                  stages={progressStages.map((stage, index) => ({
                    ...stage,
                    tasks: getTasksForStage(index, 'victim')
                  }))}
                  currentStage={cases[0].currentStage}
                />
              )}
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
            <CardTitle>Case Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="case1">
              <TabsList className="mb-4">
                {cases.map(c => (
                  <TabsTrigger key={c.id} value={`case${c.id}`}>{c.client} - {c.title}</TabsTrigger>
                ))}
              </TabsList>
              {cases.map(c => (
                <TabsContent key={c.id} value={`case${c.id}`}>
                  <div className="space-y-4">
                    <SegmentedProgress 
                      stages={progressStages.map((stage, index) => ({
                        ...stage,
                        tasks: getTasksForStage(index, 'lawyer')
                      }))}
                      currentStage={c.currentStage}
                    />
                    
                    <div className="space-y-3 mt-6">
                      <h4 className="text-sm font-medium">Recent Updates:</h4>
                      {c.updates.map(update => (
                        <div key={update.id} className="flex items-start gap-3">
                          <div className="p-1 rounded-full bg-primary/10 mt-0.5">
                            {renderUpdateIcon(update.type)}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{update.title}</div>
                            <div className="text-xs text-muted-foreground">{formatDate(update.date)}</div>
                            <p className="text-sm mt-1">{update.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
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
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-medium">John Doe - Work Injury Report</div>
                  <div className="text-xs">Stage 3 of 6</div>
                </div>
                <Progress value={50} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-medium">Jane Smith - MVA Report</div>
                  <div className="text-xs">Stage 2 of 6</div>
                </div>
                <Progress value={33} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-medium">Robert Brown - Workplace Stress</div>
                  <div className="text-xs">Stage 1 of 6</div>
                </div>
                <Progress value={16} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Scheduled Appointments</CardTitle>
            <CardDescription>Your upcoming client appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
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
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Case Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="case1">
              <TabsList className="mb-4">
                {cases.map(c => (
                  <TabsTrigger key={c.id} value={`case${c.id}`}>{c.client} - {c.title}</TabsTrigger>
                ))}
              </TabsList>
              {cases.map(c => (
                <TabsContent key={c.id} value={`case${c.id}`}>
                  <SegmentedProgress 
                    stages={progressStages.map((stage, index) => ({
                      ...stage,
                      tasks: getTasksForStage(index, 'psychologist')
                    }))}
                    currentStage={c.currentStage}
                  />
                </TabsContent>
              ))}
            </Tabs>
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
      case 'victim':
        return renderVictimDashboard();
      case 'lawyer':
        return renderLawyerDashboard();
      case 'psychologist':
        return renderPsychologistDashboard();
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
