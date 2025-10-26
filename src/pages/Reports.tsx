
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  FileText, 
  Save, 
  ClipboardCheck, 
  CheckCircle2, 
  Download, 
  ChevronRight, 
  ChevronDown 
} from "lucide-react";
import { formatDate } from '@/lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { Report, ReportStatus, ReportType } from '@/types';

// Interface for client data
interface Client {
  id: string;
  name: string;
  caseType: string;
  status: string;
}

// Interface for case data
interface Case {
  id: string;
  name: string;
  type: string;
  createdDate: string;
}

// Report sections based on the structure provided
const reportSections = [
  { id: 'client_details', title: '1. Client Details' },
  { id: 'introduction', title: '2. Introduction' },
  { id: 'background', title: '3. Background and Issues' },
  { id: 'employment', title: '4. Suitable Employment Requirements' },
  { id: 'investigation', title: '5. Investigation and Enquiry' },
  { id: 'injury_history', title: '6. Injury History' },
  { id: 'capacity', title: '7. Capacity' },
  { id: 'return_to_work', title: '8. Return to Work History' },
  { id: 'training', title: '9. Training and Employment History' },
  { id: 'cognitive', title: '10. Cognitive Impacts on Employability' },
  { id: 'skills', title: '11. Retained Knowledge, Skills and Abilities (KSAs)' },
  { id: 'rehabilitation', title: '12. Workplace Rehabilitation and Injury Management Plans' },
  { id: 'vocational', title: '13. Vocational Assessment Review' },
  { id: 'retraining', title: '14. Retraining' },
  { id: 'work_trial', title: '15. Work Trial' },
  { id: 'job_seeker', title: '16. Job Seeker Training' },
  { id: 'injury_management', title: '17. Injury Management Plans' },
  { id: 'employment_profile', title: '18. Employment Profile' },
  { id: 'labour_market', title: '19. Labour Market Analysis' },
  { id: 'job_matches', title: '20. Opinion on Job Matches' },
  { id: 'work_capacity', title: '21. Work Capacity Decision Review' },
  { id: 'summary', title: '22. Summary and Conclusion' },
  { id: 'declaration', title: '23. Expert Declaration' },
  { id: 'signature', title: '24. Signature and date' }
];

const Reports = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for report creation/editing
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list');
  const [activeSection, setActiveSection] = useState<string>('client_details');
  const [expandedSections, setExpandedSections] = useState<string[]>(['client_details']);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [reportProgress, setReportProgress] = useState<number>(0);
  
  useEffect(() => {
    // Simulate loading data
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // Mock clients data
      const mockClients: Client[] = [
        { id: "client1", name: "John Doe", caseType: "Workplace Injury", status: "Active" },
        { id: "client2", name: "Jane Smith", caseType: "Car Accident", status: "Active" },
        { id: "client3", name: "Robert Johnson", caseType: "Workplace Injury", status: "Closed" }
      ];
      
      // Mock cases data
      const mockCases: Case[] = [
        { id: "case1", name: "Workplace Injury - ABC Company", type: "Workplace Injury", createdDate: "2023-03-15" },
        { id: "case2", name: "Car Accident - Highway 101", type: "Car Accident", createdDate: "2023-04-20" }
      ];
      
      // Mock reports data
      const mockReports: Report[] = [
        {
          id: "1",
          title: "Vocational Assessment Report - John Doe",
          patientName: "John Doe",
          date: "2023-04-15",
          type: "workers_comp",
          status: "completed",
          content: {
            overview: "Comprehensive vocational assessment for workplace injury claim",
            findings: [
              "Client has moderate physical restrictions affecting lifting capacity",
              "Suitable for sedentary to light work",
              "Has transferable skills in administrative roles"
            ],
            recommendations: "Gradual return to work with modified duties recommended"
          },
          lastEdited: "2023-04-14"
        },
        {
          id: "2",
          title: "Initial Assessment - Jane Smith",
          patientName: "Jane Smith",
          date: "2023-05-02",
          type: "medico_legal",
          status: "draft",
          content: {
            overview: "Initial vocational assessment following motor vehicle accident",
            findings: [
              "Client reports significant pain limiting mobility",
              "Previously employed in construction sector",
              "Limited transferable skills identified"
            ],
            recommendations: "Additional functional capacity evaluation needed"
          },
          lastEdited: "2023-05-01"
        }
      ];
      
      setClients(mockClients);
      setCases(mockCases);
      setReports(mockReports);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);
  
  // Effect to calculate progress when report changes
  useEffect(() => {
    if (currentReport) {
      // Simple calculation based on content length
      const contentStr = JSON.stringify(currentReport.content);
      // Calculate completion percentage based on content length
      // This is a simplified example - in a real app, you'd track each section's completion
      const progress = Math.min(Math.floor((contentStr.length / 1000) * 10), 100);
      setReportProgress(progress);
    } else {
      setReportProgress(0);
    }
  }, [currentReport]);
  
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    setSelectedCaseId(""); // Reset case selection when client changes
    
    // Filter cases for this client
    // In a real app, you would fetch cases for this client from the backend
  };
  
  const handleCaseChange = (caseId: string) => {
    setSelectedCaseId(caseId);
  };
  
  const handleCreateReport = () => {
    if (!selectedClientId || !selectedCaseId) {
      toast({
        title: "Missing information",
        description: "Please select both a client and a case before creating a report.",
        variant: "destructive"
      });
      return;
    }
    
    const selectedClient = clients.find(client => client.id === selectedClientId);
    const selectedCase = cases.find(case_ => case_.id === selectedCaseId);
    
    if (!selectedClient || !selectedCase) return;
    
    // Create a new report draft
    const newReport: Report = {
      id: `new-${Date.now()}`,
      title: `Vocational Assessment Report - ${selectedClient.name}`,
      patientName: selectedClient.name,
      date: new Date().toISOString().split('T')[0],
      type: "workers_comp",
      status: "draft",
      content: {
        overview: "",
        findings: [],
        recommendations: ""
      },
      lastEdited: new Date().toISOString().split('T')[0]
    };
    
    setReports([...reports, newReport]);
    setCurrentReport(newReport);
    setCurrentView('create');
    setActiveSection('client_details');
    setExpandedSections(['client_details']);
    
    toast({
      title: "Report Created",
      description: "New report draft has been created."
    });
  };
  
  const handleSaveReport = () => {
    if (!currentReport) return;
    
    // Update the report in the reports list
    const updatedReports = reports.map(report => 
      report.id === currentReport.id
        ? { ...currentReport, lastEdited: new Date().toISOString().split('T')[0] }
        : report
    );
    
    setReports(updatedReports);
    
    toast({
      title: "Report Saved",
      description: "Your report has been saved successfully."
    });
  };
  
  const handleFinalizeReport = () => {
    if (!currentReport) return;
    
    // Update status to completed
    const finalizedReport = { ...currentReport, status: "completed" as ReportStatus };
    
    // Update the report in the reports list
    const updatedReports = reports.map(report => 
      report.id === currentReport.id ? finalizedReport : report
    );
    
    setReports(updatedReports);
    setCurrentReport(finalizedReport);
    
    toast({
      title: "Report Finalized",
      description: "Your report has been finalized and is ready for review."
    });
  };
  
  const handleEditReport = (reportId: string) => {
    const reportToEdit = reports.find(report => report.id === reportId);
    if (reportToEdit) {
      setCurrentReport(reportToEdit);
      setCurrentView('edit');
      setActiveSection('client_details');
      setExpandedSections(['client_details']);
    }
  };

  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
    setActiveSection(sectionId);
  };
  
  const updateSectionContent = (sectionId: string, content: string) => {
    if (!currentReport) return;
    
    const updatedContent = { ...currentReport.content };
    
    // Update the specific section content
    // In a real app, you'd have a more structured approach to store each section's content
    if (sectionId === 'client_details') {
      updatedContent.overview = content;
    } else if (sectionId === 'summary') {
      updatedContent.recommendations = content;
    } else {
      // For other sections, store in findings array
      const existingIndex = updatedContent.findings.findIndex(f => f.startsWith(`${sectionId}:`));
      if (existingIndex >= 0) {
        updatedContent.findings[existingIndex] = `${sectionId}: ${content}`;
      } else {
        updatedContent.findings.push(`${sectionId}: ${content}`);
      }
    }
    
    setCurrentReport({ ...currentReport, content: updatedContent });
  };
  
  const getAIRecommendations = (sectionId: string) => {
    toast({
      title: "Generating Recommendations",
      description: "AI is analyzing assessment data and generating recommendations..."
    });
    
    // Simulate AI processing
    setTimeout(() => {
      const sampleContent = `Based on the client's interview and assessment data, the following recommendations are provided for ${sectionId.replace('_', ' ')}:\n\n1. Consider gradual reintroduction to workplace tasks\n2. Implement ergonomic workstation adjustments\n3. Schedule regular follow-up assessments`;
      
      updateSectionContent(sectionId, sampleContent);
      
      toast({
        title: "AI Recommendations Ready",
        description: "Recommendations have been generated based on client data."
      });
    }, 2000);
  };
  
  // Render the reports list view
  const renderReportsList = () => {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-1">Reports</h1>
        <p className="text-muted-foreground mb-6">
          Create and manage vocational assessment reports
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <Card className="w-full md:w-2/3">
            <CardHeader>
              <CardTitle>Report Creation</CardTitle>
              <CardDescription>
                Select a client and case to generate a new report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Client</label>
                  <Select value={selectedClientId} onValueChange={handleClientChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Clients</SelectLabel>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name} - {client.caseType}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Case</label>
                  <Select 
                    value={selectedCaseId} 
                    onValueChange={handleCaseChange} 
                    disabled={!selectedClientId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a case" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Cases</SelectLabel>
                        {cases.map((case_) => (
                          <SelectItem key={case_.id} value={case_.id}>
                            {case_.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleCreateReport} 
                disabled={!selectedClientId || !selectedCaseId}
              >
                Generate New Report
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="w-full md:w-1/3">
            <CardHeader>
              <CardTitle>Report Statistics</CardTitle>
              <CardDescription>
                Overview of your reporting activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span>Completed Reports</span>
                    <span className="font-medium">{reports.filter(r => r.status === 'completed').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Draft Reports</span>
                    <span className="font-medium">{reports.filter(r => r.status === 'draft').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Reports</span>
                    <span className="font-medium">{reports.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Your Reports</h2>
        
        <Tabs defaultValue="all">
          <div className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderReportCards(reports)}
            </div>
          </TabsContent>
          
          <TabsContent value="draft" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderReportCards(reports.filter(report => report.status === 'draft'))}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderReportCards(reports.filter(report => report.status === 'completed'))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };
  
  // Helper function to render report cards
  const renderReportCards = (reports: Report[]) => {
    if (reports.length === 0) {
      return (
        <div className="col-span-full text-center py-10">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No reports found</h3>
          <p className="text-muted-foreground mt-2">
            Select a client and case to create your first report
          </p>
        </div>
      );
    }
    
    return reports.map(report => (
      <Card key={report.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleEditReport(report.id)}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{report.title}</CardTitle>
            <Badge variant={report.status === "completed" ? "default" : "outline"} className="ml-2">
              {report.status === "completed" ? "Completed" : "Draft"}
            </Badge>
          </div>
          <CardDescription>Patient: {report.patientName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Created: {formatDate(report.date)}</span>
            <span>Last edited: {formatDate(report.lastEdited)}</span>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Completion</span>
              <span>{report.status === 'completed' ? '100%' : '60%'}</span>
            </div>
            <Progress value={report.status === 'completed' ? 100 : 60} className="h-1" />
          </div>
        </CardContent>
      </Card>
    ));
  };
  
  // Render the report creation/editing view
  const renderReportEdit = () => {
    if (!currentReport) return null;
    
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <Button onClick={() => setCurrentView('list')} className="bg-accent text-accent-foreground hover:bg-accent/90 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Reports
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span>Completion:</span>
              <Progress value={reportProgress} className="w-32 h-2" />
              <span className="font-medium">{reportProgress}%</span>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveReport} className="flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Draft
              </Button>
              
              <Button onClick={handleFinalizeReport} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Finalize Report
              </Button>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{currentReport.title}</CardTitle>
            <CardDescription>
              <div className="flex flex-wrap gap-4 mt-2">
                <div>
                  <span className="text-muted-foreground">Patient: </span>
                  <span className="font-medium">{currentReport.patientName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date: </span>
                  <span className="font-medium">{formatDate(currentReport.date)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status: </span>
                  <Badge variant={currentReport.status === "completed" ? "default" : "outline"}>
                    {currentReport.status === "completed" ? "Completed" : "Draft"}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Type: </span>
                  <Badge variant="secondary">
                    {currentReport.type === "workers_comp" ? "Workers Comp" : "Medico-Legal"}
                  </Badge>
                </div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 p-4 rounded-lg bg-muted/50">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" /> Import Assessment Results
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" /> Import Interview Data
              </Button>
            </div>
            
            <div className="space-y-4">
              {reportSections.map(section => (
                <div key={section.id} className="border rounded-lg overflow-hidden">
                  <div 
                    className={`flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 ${activeSection === section.id ? 'bg-muted/50' : ''}`}
                    onClick={() => toggleSection(section.id)}
                  >
                    <h3 className="font-medium text-md">{section.title}</h3>
                    {expandedSections.includes(section.id) ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </div>
                  
                  {expandedSections.includes(section.id) && (
                    <div className="p-4 border-t">
                      <Textarea 
                        placeholder={`Enter content for ${section.title}...`}
                        className="min-h-[150px] mb-4"
                        value={
                          section.id === 'client_details' 
                            ? currentReport.content.overview
                            : section.id === 'summary'
                              ? currentReport.content.recommendations
                              : currentReport.content.findings.find(f => f.startsWith(`${section.id}:`))?.substring(section.id.length + 1) || ''
                        }
                        onChange={(e) => updateSectionContent(section.id, e.target.value)}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => getAIRecommendations(section.id)}
                          className="flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" /> Generate with AI
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Determine which view to render
  if (currentView === 'list') {
    return renderReportsList();
  } else {
    return renderReportEdit();
  }
};

export default Reports;
