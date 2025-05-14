
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Filter, Plus, Clock } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '@/lib/utils';
import { Report, ReportStatus, ReportType } from '@/types';

interface Client {
  id: string;
  name: string;
  caseType: string;
  status: string;
}

const Reports = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'all' | ReportStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | ReportType>('all');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch reports
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // Mock clients data
      const mockClients: Client[] = [
        { 
          id: "client1", 
          name: "John Doe", 
          caseType: "Workplace Injury", 
          status: "Active" 
        },
        { 
          id: "client2", 
          name: "Jane Smith", 
          caseType: "Car Accident", 
          status: "Active" 
        },
        { 
          id: "client3", 
          name: "Robert Johnson", 
          caseType: "Workplace Injury", 
          status: "Closed" 
        }
      ];
      
      // Mock reports data
      const mockReports: Report[] = [
        {
          id: "1",
          title: "Initial Psychological Assessment",
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
          id: "2",
          title: "Vocational Assessment Report",
          patientName: "Jane Smith",
          date: "2023-05-02",
          type: "medico_legal",
          status: "draft",
          content: {
            overview: "Partial draft of vocational assessment following motor vehicle accident.",
            findings: [
              "Limited mobility in right shoulder",
              "Unable to perform previous job duties"
            ],
            recommendations: "Pending final evaluation"
          },
          lastEdited: "2023-05-01"
        },
        {
          id: "3",
          title: "Return to Work Capacity Report",
          patientName: "John Doe",
          date: "2023-05-10",
          type: "workers_comp",
          status: "draft",
          content: {
            overview: "Draft assessment of capacity to return to modified duties.",
            findings: [
              "Improved anxiety symptoms",
              "Residual stress in high-pressure situations"
            ],
            recommendations: "Gradual return to work with reduced hours initially"
          },
          lastEdited: "2023-05-09"
        }
      ];
      
      setClients(mockClients);
      setReports(mockReports);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  const handleCreateReport = () => {
    // Create a new draft report
    const newReport: Report = {
      id: `new-${Date.now()}`,
      title: "New Report",
      patientName: selectedClientId ? clients.find(c => c.id === selectedClientId)?.name || "" : "",
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
    setSelectedReportId(newReport.id);
  };

  const filteredReports = reports.filter(report => {
    // Filter by tab (status)
    if (selectedTab !== 'all' && report.status !== selectedTab) return false;
    
    // Filter by type
    if (filterType !== 'all' && report.type !== filterType) return false;
    
    // Filter by client
    if (selectedClientId && report.patientName !== clients.find(c => c.id === selectedClientId)?.name) return false;
    
    // Filter by search term
    if (searchTerm && !report.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !report.patientName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const selectedReport = selectedReportId 
    ? reports.find(report => report.id === selectedReportId) 
    : null;

  const renderReportStatusBadge = (status: ReportStatus) => {
    return status === 'completed' 
      ? <Badge>Completed</Badge>
      : <Badge variant="outline" className="bg-amber-100 text-amber-700 hover:bg-amber-100">Draft</Badge>;
  };

  const renderReportTypeBadge = (type: ReportType) => {
    return type === 'workers_comp'
      ? <Badge variant="secondary">Workers Comp</Badge>
      : <Badge variant="secondary">Medico-Legal</Badge>;
  };

  const renderReportList = () => {
    return (
      <>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex flex-1 gap-2">
            <div className="flex-1">
              <Input 
                placeholder="Search reports..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={(value) => setFilterType(value as 'all' | ReportType)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="workers_comp">Workers Comp</SelectItem>
                  <SelectItem value="medico_legal">Medico-Legal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Select value={selectedClientId || ''} onValueChange={setSelectedClientId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="">All Clients</SelectItem>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No reports found. {' '}
              {selectedClientId && (
                <button className="text-primary hover:underline" onClick={handleCreateReport}>
                  Create a new report?
                </button>
              )}
            </div>
          ) : (
            filteredReports.map(report => (
              <Card 
                key={report.id} 
                className="overflow-hidden cursor-pointer hover:shadow-md"
                onClick={() => setSelectedReportId(report.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{report.title}</CardTitle>
                      <CardDescription>Patient: {report.patientName}</CardDescription>
                    </div>
                    <div className="flex gap-2 flex-col items-end">
                      {renderReportStatusBadge(report.status)}
                      {renderReportTypeBadge(report.type)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" /> Last edited: {formatDate(report.lastEdited)}
                    </div>
                    <div>Created: {formatDate(report.date)}</div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </>
    );
  };

  const renderReportDetail = () => {
    if (!selectedReport) return null;

    return (
      <div>
        <Button variant="ghost" onClick={() => setSelectedReportId(null)} className="mb-4">
          &larr; Back to Reports
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>{selectedReport.title}</CardTitle>
                <CardDescription>Patient: {selectedReport.patientName}</CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                {renderReportStatusBadge(selectedReport.status)}
                {renderReportTypeBadge(selectedReport.type)}
                <div className="text-sm text-muted-foreground">
                  Last edited: {formatDate(selectedReport.lastEdited)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Overview</Label>
              <div className="mt-2 p-4 bg-muted/30 rounded-md">
                {selectedReport.content.overview || "No overview provided"}
              </div>
            </div>
            
            <div>
              <Label>Findings</Label>
              <div className="mt-2 p-4 bg-muted/30 rounded-md">
                {selectedReport.content.findings && selectedReport.content.findings.length > 0 ? (
                  <ul className="list-disc pl-4 space-y-1">
                    {selectedReport.content.findings.map((finding, index) => (
                      <li key={index}>{finding}</li>
                    ))}
                  </ul>
                ) : (
                  "No findings recorded"
                )}
              </div>
            </div>
            
            <div>
              <Label>Recommendations</Label>
              <div className="mt-2 p-4 bg-muted/30 rounded-md">
                {selectedReport.content.recommendations || "No recommendations provided"}
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline">
                Download as PDF
              </Button>
              
              {selectedReport.status === 'draft' && (
                <div className="flex gap-2">
                  <Button variant="outline">
                    Save Draft
                  </Button>
                  <Button>
                    Finalize Report
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedReportId) {
    return renderReportDetail();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Reports</h1>
      <p className="text-muted-foreground mb-6">
        Manage your clinical and medico-legal reports
      </p>
      
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="all" value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'all' | ReportStatus)}>
          <TabsList>
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button onClick={handleCreateReport} disabled={!selectedClientId}>
          <Plus className="w-4 h-4 mr-1" /> New Report
        </Button>
      </div>
      
      {renderReportList()}
    </div>
  );
};

export default Reports;
