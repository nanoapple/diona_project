
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Book, Download, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';

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
  };
  lastEdited?: string;
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
        recommendations: ''
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
    setEditedContent({...report.content});
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
          : 'Trauma-focused cognitive behavioral therapy and EMDR therapy, weekly sessions for 16 weeks. Medication evaluation recommended for sleep disturbances and anxiety. Driving desensitization therapy should be considered as part of the treatment plan.'
      };
      
      setEditedContent(aiGeneratedContent);
      setIsGenerating(false);
      
      toast({
        title: "AI content generated",
        description: "The report has been populated with AI-generated content that you can now edit",
      });
    }, 2000);
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
                <div className="flex justify-between items-center">
                  <CardTitle>AI Assistant</CardTitle>
                  <Button onClick={generateAIContent} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      'Generate Content'
                    )}
                  </Button>
                </div>
                <CardDescription>
                  Use AI to help generate the report content based on assessment data
                </CardDescription>
              </CardHeader>
            </Card>
          )}
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {activeReport.status === 'draft' ? (
                  <Textarea
                    value={editedContent.summary || ''}
                    onChange={(e) => setEditedContent({...editedContent, summary: e.target.value})}
                    placeholder="Enter clinical summary here"
                    className="min-h-[150px]"
                  />
                ) : (
                  <div className="prose max-w-none">
                    <p>{activeReport.content?.summary}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Diagnosis</CardTitle>
              </CardHeader>
              <CardContent>
                {activeReport.status === 'draft' ? (
                  <Textarea
                    value={editedContent.diagnosis || ''}
                    onChange={(e) => setEditedContent({...editedContent, diagnosis: e.target.value})}
                    placeholder="Enter diagnosis here"
                    className="min-h-[100px]"
                  />
                ) : (
                  <div className="prose max-w-none">
                    <p>{activeReport.content?.diagnosis}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Symptoms & Clinical Observations</CardTitle>
              </CardHeader>
              <CardContent>
                {activeReport.status === 'draft' ? (
                  <Textarea
                    value={editedContent.symptoms || ''}
                    onChange={(e) => setEditedContent({...editedContent, symptoms: e.target.value})}
                    placeholder="Enter symptoms and observations here"
                    className="min-h-[150px]"
                  />
                ) : (
                  <div className="prose max-w-none">
                    <p>{activeReport.content?.symptoms}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Treatment Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                {activeReport.status === 'draft' ? (
                  <Textarea
                    value={editedContent.recommendations || ''}
                    onChange={(e) => setEditedContent({...editedContent, recommendations: e.target.value})}
                    placeholder="Enter treatment recommendations here"
                    className="min-h-[150px]"
                  />
                ) : (
                  <div className="prose max-w-none">
                    <p>{activeReport.content?.recommendations}</p>
                  </div>
                )}
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
