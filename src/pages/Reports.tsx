import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Book, Download, FileText, User, ClipboardCheck, CheckCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Report {
  id: string;
  title: string;
  patientName: string;
  date: string;
  status: 'draft' | 'completed';
  type: 'workers_comp' | 'medico_legal';
  content?: {
    summary?: string;
    diagnosis?: string;
    symptoms?: string;
    recommendations?: string;
    sections?: {
      [key: string]: string;
    };
  };
  lastEdited?: string;
}

interface Client {
  id: string;
  name: string;
  dateOfBirth: string;
  dateOfInjury: string;
  injuryType: string;
  assessments: {
    id: string;
    title: string;
    date: string;
    type: string;
    status: 'completed' | 'in_progress' | 'pending';
    score?: string;
  }[];
  interviews: {
    id: string;
    title: string;
    date: string;
    status: 'completed' | 'in_progress' | 'pending';
    summary?: string;
  }[];
}

const Reports = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      title: 'Workers Compensation Psychological Assessment',
      patientName: 'John Doe',
      date: '2023-04-05',
      status: 'completed',
      type: 'workers_comp',
      lastEdited: '2023-04-10',
      content: {
        summary: 'Mr. Doe is a 35-year-old male who sustained a workplace injury on January 15, 2023. He reports significant psychological distress following the incident.',
        diagnosis: 'Adjustment Disorder with Anxiety and Depressed Mood (309.28)',
        symptoms: 'The patient reports persistent anxiety, difficulty sleeping, irritability, and decreased interest in previously enjoyed activities.',
        recommendations: 'Cognitive-behavioral therapy, weekly sessions for 10 weeks. Reassessment after this period to determine further treatment needs.'
      }
    },
    {
      id: '2',
      title: 'Medico-Legal Report for MVA Case',
      patientName: 'Jane Smith',
      date: '2023-03-20',
      status: 'draft',
      type: 'medico_legal',
      lastEdited: '2023-04-12',
      content: {
        summary: 'Ms. Smith is a 42-year-old female who was involved in a motor vehicle accident on February 5, 2023. She presents with symptoms consistent with post-traumatic stress disorder.',
        diagnosis: 'Post-Traumatic Stress Disorder (309.81)',
        symptoms: 'The patient reports intrusive thoughts about the accident, avoidance of driving, hypervigilance, and sleep disturbances.',
        recommendations: 'EMDR therapy and trauma-focused CBT, twice weekly for 8 weeks. Consider medication management for sleep issues.'
      }
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [editedContent, setEditedContent] = useState<any>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    patientName: '',
    type: 'workers_comp' as 'workers_comp' | 'medico_legal'
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('');
  const [selectedInterviewId, setSelectedInterviewId] = useState<string>('');
  const [importModalOpen, setImportModalOpen] = useState(false);

  useEffect(() => {
    // Fetch clients data
    const fetchClients = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockClients: Client[] = [
        {
          id: '1',
          name: 'John Doe',
          dateOfBirth: '1985-06-12',
          dateOfInjury: '2023-01-15',
          injuryType: 'Workplace Injury - Back',
          assessments: [
            {
              id: '1',
              title: 'Work-Related Stress Assessment',
              date: '2023-02-15',
              type: 'Psychological',
              status: 'completed',
              score: 'Moderate (65/100)'
            },
            {
              id: '2',
              title: 'Depression, Anxiety & Stress Scale (DASS-21)',
              date: '2023-03-05',
              type: 'Psychological',
              status: 'completed',
              score: 'Severe (78/100)'
            }
          ],
          interviews: [
            {
              id: '1',
              title: 'Initial Self-Guided Interview',
              date: '2023-02-12',
              status: 'completed',
              summary: 'Client reports significant pain and emotional distress following workplace incident. Unable to return to previous duties.'
            }
          ]
        },
        {
          id: '2',
          name: 'Jane Smith',
          dateOfBirth: '1978-09-23',
          dateOfInjury: '2023-02-05',
          injuryType: 'Motor Vehicle Accident',
          assessments: [
            {
              id: '3',
              title: 'Post-Accident Trauma Screening',
              date: '2023-03-10',
              type: 'Psychological',
              status: 'completed',
              score: 'Significant (72/100)'
            }
          ],
          interviews: [
            {
              id: '2',
              title: 'Structured Clinical Interview',
              date: '2023-03-15',
              status: 'completed',
              summary: 'Client demonstrates symptoms consistent with PTSD following MVA. Reports flashbacks and anxiety when in vehicles.'
            }
          ]
        }
      ];
      
      setClients(mockClients);
    };
    
    fetchClients();
  }, []);
  
  // Report section templates
  const reportSectionTemplates = [
    { id: 'clientDetails', title: '1. Client Details', placeholder: 'Enter client details including name, DOB, address, etc.' },
    { id: 'introduction', title: '2. Introduction', placeholder: 'Introduce the purpose of this report and assessment.' },
    { id: 'backgroundAndIssues', title: '3. Background and Issues', placeholder: 'Describe the background of the case and the client\'s issues.' },
    { id: 'suitableEmploymentRequirements', title: '4. Suitable Employment Requirements', placeholder: 'Define the requirements for suitable employment considering the client\'s condition.' },
    { id: 'investigationAndEnquiry', title: '5. Investigation and Enquiry', placeholder: 'Detail the investigation and enquiry process undertaken.' },
    { id: 'injuryHistory', title: '6. Injury History', placeholder: 'Provide a comprehensive history of the injury and its progression.' },
    { id: 'capacity', title: '7. Capacity', placeholder: 'Assess the client\'s current capacity for work and daily activities.' },
    { id: 'returnToWorkHistory', title: '8. Return to Work History', placeholder: 'Document any attempts to return to work and their outcomes.' },
    { id: 'trainingAndEmploymentHistory', title: '9. Training and Employment History', placeholder: 'Detail the client\'s educational background, qualifications, and employment history.' },
    { id: 'cognitiveImpacts', title: '10. Cognitive Impacts on Employability', placeholder: 'Assess how cognitive functioning affects employability.' },
    { id: 'retainedKSAs', title: '11. Retained Knowledge, Skills and Abilities', placeholder: 'Identify the KSAs the client has maintained despite their injury.' },
    { id: 'rehabilitationPlans', title: '12. Workplace Rehabilitation and Injury Management Plans', placeholder: 'Outline rehabilitation plans and their effectiveness.' },
    { id: 'vocationalAssessment', title: '13. Vocational Assessment Review', placeholder: 'Review results of any vocational assessments.' },
    { id: 'retraining', title: '14. Retraining', placeholder: 'Discuss retraining options and recommendations.' },
    { id: 'workTrial', title: '15. Work Trial', placeholder: 'Detail any work trials undertaken and their outcomes.' },
    { id: 'jobSeekerTraining', title: '16. Job Seeker Training', placeholder: 'Outline any job seeking skills training completed or recommended.' },
    { id: 'injuryManagementPlans', title: '17. Injury Management Plans', placeholder: 'Detail injury management plans and their implementation.' },
    { id: 'employmentProfile', title: '18. Employment Profile', placeholder: 'Create a profile of suitable employment options.' },
    { id: 'labourMarketAnalysis', title: '19. Labour Market Analysis', placeholder: 'Analyze the labor market for suitable employment options.' },
    { id: 'opinionOnJobMatches', title: '20. Opinion on Job Matches', placeholder: 'Provide expert opinion on specific job matches.' },
    { id: 'workCapacityDecisionReview', title: '21. Work Capacity Decision Review', placeholder: 'Review any work capacity decisions made.' },
    { id: 'summaryAndConclusion', title: '22. Summary and Conclusion', placeholder: 'Summarize findings and provide conclusions.' },
    { id: 'expertDeclaration', title: '23. Expert Declaration', placeholder: 'Include your expert declaration.' },
    { id: 'signatureAndDate', title: '24. Signature and Date', placeholder: 'Space for signature and date.' }
  ];

  const createNewReport = () => {
    if (!newReport.title || !newReport.patientName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const report: Report = {
      id: Date.now().toString(),
      title: newReport.title,
      patientName: newReport.patientName,
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      type: newReport.type,
      lastEdited: new Date().toISOString().split('T')[0],
      content: {
        summary: '',
        diagnosis: '',
        symptoms: '',
        recommendations: '',
        sections: reportSectionTemplates.reduce((acc, section) => {
          acc[section.id] = '';
          return acc;
        }, {} as {[key: string]: string})
      }
    };

    setReports([...reports, report]);
    setNewReport({
      title: '',
      patientName: '',
      type: 'workers_comp'
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Report created",
      description: "New report has been created as a draft",
    });
  };

  const openReport = (report: Report) => {
    setActiveReport(report);
    if (report.content?.sections) {
      setEditedContent({...report.content});
    } else {
      const initialSections = reportSectionTemplates.reduce((acc, section) => {
        acc[section.id] = '';
        return acc;
      }, {} as {[key: string]: string});
      
      setEditedContent({
        ...report.content,
        sections: initialSections
      });
    }
  };

  const closeReport = () => {
    setActiveReport(null);
    setEditedContent({});
  };

  const saveReportChanges = () => {
    if (!activeReport) return;

    const updatedReports = reports.map(report => 
      report.id === activeReport.id 
        ? {
            ...report,
            content: editedContent,
            lastEdited: new Date().toISOString().split('T')[0]
          }
        : report
    );

    setReports(updatedReports);
    toast({
      title: "Changes saved",
      description: "Your report changes have been saved",
    });
  };

  const finalizeReport = () => {
    if (!activeReport) return;

    const updatedReports = reports.map(report => 
      report.id === activeReport.id 
        ? {
            ...report,
            status: 'completed',
            content: editedContent,
            lastEdited: new Date().toISOString().split('T')[0]
          }
        : report
    );

    setReports(updatedReports);
    setActiveReport(null);
    setEditedContent({});
    
    toast({
      title: "Report finalized",
      description: "The report has been completed and is ready for sharing",
    });
  };

  const generateAIContent = () => {
    if (!activeReport) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const aiGeneratedContent = {
        summary: activeReport.type === 'workers_comp'
          ? `${activeReport.patientName} is presenting with symptoms following a workplace incident. Based on thorough psychological assessment, the patient demonstrates significant psychological distress that appears directly related to the workplace injury.`
          : `${activeReport.patientName} was involved in a motor vehicle accident and is experiencing psychological symptoms consistent with trauma. The assessment indicates that these symptoms are directly attributable to the accident in question.`,
        
        diagnosis: activeReport.type === 'workers_comp'
          ? 'Adjustment Disorder with Mixed Anxiety and Depressed Mood (309.28)'
          : 'Post-Traumatic Stress Disorder (309.81)',
        
        symptoms: activeReport.type === 'workers_comp'
          ? 'The patient reports persistent anxiety, depressed mood, difficulty sleeping, irritability, reduced concentration, and impaired work functioning. The symptoms meet the criteria for Adjustment Disorder and appear to be a direct result of the workplace incident.'
          : 'The patient exhibits intrusive memories, nightmares, avoidance behaviors, negative alterations in cognition and mood, and increased arousal and reactivity. These symptoms meet the full criteria for PTSD according to DSM-5 guidelines.',
        
        recommendations: activeReport.type === 'workers_comp'
          ? 'Cognitive-behavioral therapy focused on work-related trauma, weekly sessions for 12 weeks. Gradual return-to-work plan with accommodations. Follow-up assessment in 3 months to evaluate progress and work capacity.'
          : 'Trauma-focused cognitive behavioral therapy and EMDR therapy, weekly sessions for 16 weeks. Medication evaluation recommended for sleep disturbances and anxiety. Driving desensitization therapy should be considered as part of the treatment plan.',
        
        sections: {
          clientDetails: `Full Name: ${activeReport.patientName}\nDate of Assessment: ${activeReport.date}\nDate of Birth: [Client DOB]\nContact Details: [Client Contact Info]\nReferral Source: [Referral Source]`,
          
          introduction: `This report has been prepared at the request of [Referrer] regarding ${activeReport.patientName}'s psychological condition following ${activeReport.type === 'workers_comp' ? 'a workplace incident' : 'a motor vehicle accident'} that occurred on [Date of Incident]. The purpose of this assessment is to evaluate the psychological impact of the incident and provide recommendations regarding treatment and work capacity.`,
          
          backgroundAndIssues: `${activeReport.patientName} was involved in ${activeReport.type === 'workers_comp' ? 'a workplace incident on [Date] while performing duties as [Occupation]' : 'a motor vehicle accident on [Date] while [circumstances of accident]'}. The client reports experiencing [key symptoms] since the incident, which have significantly impacted daily functioning and ability to work.`,
          
          suitableEmploymentRequirements: 'Based on the client\'s current psychological presentation, suitable employment would need to accommodate the following requirements: [list requirements]',
          
          summaryAndConclusion: `In summary, ${activeReport.patientName} continues to experience significant psychological symptoms as a direct result of the ${activeReport.type === 'workers_comp' ? 'workplace incident' : 'motor vehicle accident'}. These symptoms are having a substantial impact on daily functioning and work capacity. With appropriate treatment as outlined in this report, prognosis for improvement is [prognosis].`,
          
          expertDeclaration: 'I declare that I have made all the inquiries that I believe are desirable and appropriate, and that no matters of significance that I regard as relevant have, to my knowledge, been withheld from the court.',
          
          signatureAndDate: '[Expert Name]\n[Credentials]\n[Date]'
        }
      };
      
      setEditedContent(aiGeneratedContent);
      setIsGenerating(false);
      
      toast({
        title: "AI content generated",
        description: "The report has been populated with AI-generated content that you can now edit",
      });
    }, 2000);
  };

  const importClientData = () => {
    if (!selectedClientId) {
      toast({
        title: "No client selected",
        description: "Please select a client to import data from",
        variant: "destructive"
      });
      return;
    }
    
    // Find the selected client
    const selectedClient = clients.find(client => client.id === selectedClientId);
    if (!selectedClient) return;
    
    // Get assessment data if applicable
    const assessmentData = selectedAssessmentId 
      ? selectedClient.assessments.find(a => a.id === selectedAssessmentId)
      : null;
      
    // Get interview data if applicable
    const interviewData = selectedInterviewId
      ? selectedClient.interviews.find(i => i.id === selectedInterviewId)
      : null;
    
    // Create new sections object with client data
    const updatedSections = { ...editedContent.sections };
    
    // Update client details section
    updatedSections.clientDetails = 
      `Full Name: ${selectedClient.name}\n` +
      `Date of Birth: ${formatDate(selectedClient.dateOfBirth)}\n` + 
      `Date of Injury: ${formatDate(selectedClient.dateOfInjury)}\n` +
      `Injury Type: ${selectedClient.injuryType}\n`;
    
    // Update background section with assessment data
    if (assessmentData) {
      updatedSections.backgroundAndIssues = 
        (updatedSections.backgroundAndIssues || '') + 
        `\n\nPsychological Assessment: ${assessmentData.title} (${formatDate(assessmentData.date)})\n` +
        `Result: ${assessmentData.score || 'Not specified'}`;
    }
    
    // Update background section with interview data
    if (interviewData && interviewData.summary) {
      updatedSections.backgroundAndIssues = 
        (updatedSections.backgroundAndIssues || '') + 
        `\n\nInterview Findings (${formatDate(interviewData.date)}):\n${interviewData.summary}`;
    }
    
    // Update edited content
    setEditedContent({
      ...editedContent,
      sections: updatedSections
    });
    
    setImportModalOpen(false);
    
    toast({
      title: "Client data imported",
      description: "The selected client data has been added to the report",
    });
  };

  return (
    <div className="container mx-auto max-w-6xl">
      {activeReport ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">{activeReport.title}</h1>
              <p className="text-muted-foreground">
                Patient: {activeReport.patientName} | Status: <span className="capitalize">{activeReport.status}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={closeReport}>
                Back to Reports
              </Button>
              {activeReport.status === 'draft' && (
                <Button onClick={saveReportChanges}>
                  Save Changes
                </Button>
              )}
            </div>
          </div>
          
          {activeReport.status === 'draft' && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <CardTitle>Report Tools</CardTitle>
                  <div className="flex gap-2">
                    <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <User className="h-4 w-4 mr-2" />
                          Import Client Data
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Import Client Data</DialogTitle>
                          <DialogDescription>
                            Import client information, assessments, and interviews into this report
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="client">Select Client</Label>
                            <Select 
                              value={selectedClientId} 
                              onValueChange={setSelectedClientId}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a client" />
                              </SelectTrigger>
                              <SelectContent>
                                {clients.map(client => (
                                  <SelectItem key={client.id} value={client.id}>
                                    {client.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {selectedClientId && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="assessment">Include Assessment</Label>
                                <Select 
                                  value={selectedAssessmentId} 
                                  onValueChange={setSelectedAssessmentId}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an assessment (optional)" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="">None</SelectItem>
                                    {clients
                                      .find(c => c.id === selectedClientId)?.assessments
                                      .filter(a => a.status === 'completed')
                                      .map(assessment => (
                                        <SelectItem key={assessment.id} value={assessment.id}>
                                          {assessment.title}
                                        </SelectItem>
                                      ))
                                    }
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="interview">Include Interview</Label>
                                <Select 
                                  value={selectedInterviewId} 
                                  onValueChange={setSelectedInterviewId}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an interview (optional)" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="">None</SelectItem>
                                    {clients
                                      .find(c => c.id === selectedClientId)?.interviews
                                      .filter(i => i.status === 'completed')
                                      .map(interview => (
                                        <SelectItem key={interview.id} value={interview.id}>
                                          {interview.title}
                                        </SelectItem>
                                      ))
                                    }
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}
                        </div>
                        
                        <DialogFooter>
                          <Button onClick={importClientData} disabled={!selectedClientId}>
                            Import Data
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button onClick={generateAIContent} disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <ClipboardCheck className="h-4 w-4 mr-2" />
                          Generate Content
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Use these tools to help generate and import data for the report
                </CardDescription>
              </CardHeader>
            </Card>
          )}
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Sections</CardTitle>
                <CardDescription>
                  Complete each section of the report below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <Accordion type="multiple" className="w-full">
                    {reportSectionTemplates.map((section) => (
                      <AccordionItem key={section.id} value={section.id}>
                        <AccordionTrigger className="text-left">
                          {section.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          {activeReport.status === 'draft' ? (
                            <Textarea
                              value={editedContent.sections?.[section.id] || ''}
                              onChange={(e) => setEditedContent({
                                ...editedContent, 
                                sections: {
                                  ...editedContent.sections,
                                  [section.id]: e.target.value
                                }
                              })}
                              placeholder={section.placeholder}
                              className="min-h-[150px]"
                            />
                          ) : (
                            <div className="prose max-w-none whitespace-pre-wrap">
                              {activeReport.content?.sections?.[section.id] || 'No content provided.'}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          {activeReport.status === 'draft' && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={saveReportChanges}>
                Save Draft
              </Button>
              <Button onClick={finalizeReport}>
                Finalize Report
              </Button>
            </div>
          )}
          
          {activeReport.status === 'completed' && (
            <div className="flex justify-end">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Reports</h1>
              <p className="text-muted-foreground">
                Generate and manage psychological reports
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Create New Report</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Report</DialogTitle>
                  <DialogDescription>
                    Create a new psychological report for a client
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Report Title</Label>
                    <Input 
                      id="title" 
                      value={newReport.title}
                      onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                      placeholder="Enter report title" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input 
                      id="patientName" 
                      value={newReport.patientName}
                      onChange={(e) => setNewReport({...newReport, patientName: e.target.value})}
                      placeholder="Enter patient name" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Report Type</Label>
                    <Select 
                      value={newReport.type} 
                      onValueChange={(value: 'workers_comp' | 'medico_legal') => setNewReport({...newReport, type: value})}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workers_comp">Workers Compensation</SelectItem>
                        <SelectItem value="medico_legal">Medico-Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createNewReport}>
                    Create Report
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            {['all', 'draft', 'completed'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="grid gap-4">
                  {reports
                    .filter(r => tab === 'all' || r.status === tab)
                    .map((report) => (
                      <Card key={report.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-16 flex items-center justify-center p-4 bg-primary/10">
                            {report.type === 'workers_comp' ? (
                              <FileText className="h-8 w-8 text-primary" />
                            ) : (
                              <Book className="h-8 w-8 text-primary" />
                            )}
                          </div>
                          <CardContent className="p-6 flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-medium">{report.title}</h3>
                                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                                    report.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                  }`}>
                                    {report.status}
                                  </span>
                                </div>
                                
                                <p className="text-sm text-muted-foreground">Patient: {report.patientName}</p>
                                <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                                  <div>Created: {formatDate(report.date)}</div>
                                  {report.lastEdited && (
                                    <div>Last edited: {formatDate(report.lastEdited)}</div>
                                  )}
                                </div>
                                <div className="mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded inline-block">
                                  {report.type === 'workers_comp' ? 'Workers Compensation' : 'Medico-Legal'}
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button onClick={() => openReport(report)}>
                                  {report.status === 'draft' ? 'Edit Report' : 'View Report'}
                                </Button>
                                {report.status === 'completed' && (
                                  <Button variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                    
                  {reports.filter(r => tab === 'all' || r.status === tab).length === 0 && (
                    <Card className="p-10 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                        <CardTitle className="mb-2">No Reports</CardTitle>
                        <CardDescription>
                          There are no {tab === 'all' ? '' : tab} reports available.
                        </CardDescription>
                      </div>
                    </Card>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Reports;
