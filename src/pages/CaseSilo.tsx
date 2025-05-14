import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, AlertCircle, Plus, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { CaseSilo as CaseSiloType, CaseSiloStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const CaseSilo = () => {
  const { currentUser } = useAuth();
  const [caseSilos, setCaseSilos] = useState<CaseSiloType[]>([
    {
      id: '1',
      claimantName: 'John Doe',
      caseType: 'Workplace Injury',
      status: 'active',
      createdDate: '2023-03-15',
      expiryDate: '2023-09-15',
      participants: {
        claimantId: 'victim-1',
        lawyerId: 'lawyer-1',
        psychologistId: 'psych-1'
      },
      documents: [
        {
          id: 'doc-1',
          name: 'Medical Report',
          type: 'PDF',
          uploadedBy: 'Dr. Smith',
          uploadDate: '2023-04-01',
          url: '#',
          size: '1.2 MB'
        },
        {
          id: 'doc-2',
          name: 'Incident Report',
          type: 'DOCX',
          uploadedBy: 'John Doe',
          uploadDate: '2023-03-16',
          url: '#',
          size: '850 KB'
        }
      ],
      assessments: [
        {
          id: 'a-1',
          title: 'Initial Psychological Assessment',
          description: 'Evaluate psychological impact of workplace injury',
          status: 'completed',
          completionPercentage: 100,
          date: '2023-04-05',
          assignedTo: 'John Doe'
        }
      ],
      reports: [
        {
          id: 'r-1',
          title: 'Psychological Impact Report',
          patientName: 'John Doe',
          date: '2023-04-10',
          type: 'workers_comp',
          status: 'completed',
          content: 'Report content here',
          lastEdited: '2023-04-08'
        }
      ],
      notes: [
        {
          id: 'note-1',
          content: 'Client reported increased pain levels during yesterday\'s session',
          createdBy: 'Dr. Smith',
          createdAt: '2023-04-02'
        }
      ],
      externalUploads: [
        {
          id: 'ext-1',
          name: 'GP Medical Certificate',
          type: 'PDF',
          uploadedBy: 'Dr. Johnson (GP)',
          uploadDate: '2023-03-20',
          url: '#',
          size: '500 KB',
          isExternal: true
        }
      ]
    },
    {
      id: '2',
      claimantName: 'John Doe',
      caseType: 'Car Accident',
      status: 'active',
      createdDate: '2023-04-10',
      expiryDate: '2023-10-10',
      participants: {
        claimantId: 'victim-1',
        lawyerId: 'lawyer-1',
        psychologistId: 'psych-1'
      },
      documents: [
        {
          id: 'doc-3',
          name: 'Police Report',
          type: 'PDF',
          uploadedBy: 'Jane Smith',
          uploadDate: '2023-04-11',
          url: '#',
          size: '1.5 MB'
        }
      ],
      assessments: [],
      reports: [],
      notes: [
        {
          id: 'note-2',
          content: 'Initial consultation scheduled for next week',
          createdBy: 'Legal Team',
          createdAt: '2023-04-12'
        }
      ],
      externalUploads: []
    },
    {
      id: '3',
      claimantName: 'Robert Brown',
      caseType: 'Workplace Injury',
      status: 'expired',
      createdDate: '2022-10-15',
      expiryDate: '2023-04-15',
      participants: {
        claimantId: 'victim-3',
        lawyerId: 'lawyer-2',
        psychologistId: 'psych-1'
      },
      documents: [],
      assessments: [],
      reports: [],
      notes: [],
      externalUploads: []
    },
    {
      id: '4',
      claimantName: 'Sarah Johnson',
      caseType: 'Medical Negligence',
      status: 'active',
      createdDate: '2023-02-20',
      expiryDate: '2023-08-20',
      participants: {
        claimantId: 'victim-4',
        lawyerId: 'lawyer-1',
        psychologistId: 'psych-1'
      },
      documents: [
        {
          id: 'doc-4',
          name: 'Hospital Records',
          type: 'PDF',
          uploadedBy: 'Sarah Johnson',
          uploadDate: '2023-02-22',
          url: '#',
          size: '3.2 MB'
        }
      ],
      assessments: [
        {
          id: 'a-2',
          title: 'Trauma Assessment',
          description: 'Evaluate psychological impact of medical procedure',
          status: 'in_progress',
          completionPercentage: 60,
          date: '2023-03-10',
          assignedTo: 'Sarah Johnson'
        }
      ],
      reports: [],
      notes: [
        {
          id: 'note-3',
          content: 'Client has provided all requested medical documentation',
          createdBy: 'Dr. Smith',
          createdAt: '2023-03-05'
        }
      ],
      externalUploads: [
        {
          id: 'ext-2',
          name: 'Specialist Consultation Notes',
          type: 'PDF',
          uploadedBy: 'Dr. Williams (Specialist)',
          uploadDate: '2023-03-01',
          url: '#',
          size: '1.1 MB',
          isExternal: true
        }
      ]
    }
  ]);
  
  const [filter, setFilter] = useState<CaseSiloStatus | 'all'>('all');
  const [selectedSilo, setSelectedSilo] = useState<CaseSiloType | null>(null);
  const [filteredSilos, setFilteredSilos] = useState<CaseSiloType[]>([]);

  // Filter silos based on current user and selected filter
  useEffect(() => {
    if (currentUser) {
      // Filter silos based on user role
      let userSilos: CaseSiloType[];
      
      if (currentUser.role === 'victim') {
        // For victims/claimants, only show cases where they are the claimant
        userSilos = caseSilos.filter(silo => 
          silo.participants.claimantId === currentUser.id || 
          // For demo purposes, also show cases where claimantName matches John Doe (for demo victim account)
          silo.claimantName === 'John Doe'
        );
      } else if (currentUser.role === 'lawyer') {
        // For lawyers, show cases where they are assigned
        userSilos = caseSilos.filter(silo => 
          silo.participants.lawyerId === currentUser.id ||
          // For demo purposes, include cases assigned to lawyer-1
          silo.participants.lawyerId === 'lawyer-1'
        );
      } else if (currentUser.role === 'psychologist') {
        // For psychologists, show cases where they are assigned
        userSilos = caseSilos.filter(silo => 
          silo.participants.psychologistId === currentUser.id ||
          // For demo purposes, include cases assigned to psych-1
          silo.participants.psychologistId === 'psych-1'
        );
      } else {
        userSilos = [];
      }

      // Apply status filter
      const statusFiltered = filter === 'all' 
        ? userSilos 
        : userSilos.filter(silo => silo.status === filter);
        
      setFilteredSilos(statusFiltered);
      
      // For demonstration purposes, show a toast notification about the available cases
      if (userSilos.length > 0 && !selectedSilo) {
        const roleText = currentUser.role === 'victim' ? 'your' : 'assigned';
        toast({
          title: `${userSilos.length} case silo${userSilos.length > 1 ? 's' : ''} available`,
          description: `You can view ${roleText} case silos and access shared information.`,
          duration: 5000,
        });
      }
    }
  }, [currentUser, caseSilos, filter, selectedSilo]);

  const handleSelectSilo = (silo: CaseSiloType) => {
    setSelectedSilo(silo);
  };

  const handleBackToList = () => {
    setSelectedSilo(null);
  };

  const calculateDaysRemaining = (expiryDate: string): number => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const renderStatusBadge = (status: CaseSiloStatus, expiryDate: string) => {
    if (status === 'expired') {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    const daysRemaining = calculateDaysRemaining(expiryDate);
    if (daysRemaining <= 30) {
      return <Badge variant="secondary" className="bg-amber-500">Expires in {daysRemaining} days</Badge>;
    }
    
    return <Badge variant="default" className="bg-emerald-600">Active</Badge>;
  };

  const renderSiloList = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Case Silos</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setFilter('all')}>
            All
          </Button>
          <Button variant="outline" size="sm" onClick={() => setFilter('active')}>
            Active
          </Button>
          <Button variant="outline" size="sm" onClick={() => setFilter('expired')}>
            Expired
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" /> New Silo
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSilos.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No case silos found. {filter !== 'all' && "Try changing your filter."}
          </div>
        ) : (
          filteredSilos.map(silo => (
            <Card 
              key={silo.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${silo.status === 'expired' ? 'opacity-75' : ''}`}
              onClick={() => handleSelectSilo(silo)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{currentUser?.role === 'victim' ? "My Case" : silo.claimantName}</CardTitle>
                    <CardDescription>{silo.caseType}</CardDescription>
                  </div>
                  {renderStatusBadge(silo.status, silo.expiryDate)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created: {formatDate(silo.createdDate)}
                </div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {silo.status === 'expired' 
                    ? `Expired: ${formatDate(silo.expiryDate)}`
                    : `Expires: ${formatDate(silo.expiryDate)}`}
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <div>Documents: {silo.documents.length}</div>
                  <div>Assessments: {silo.assessments.length}</div>
                  <div>Reports: {silo.reports.length}</div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );

  const renderSiloDetail = () => {
    if (!selectedSilo) return null;
    
    const isExpired = selectedSilo.status === 'expired';
    const daysRemaining = calculateDaysRemaining(selectedSilo.expiryDate);
    
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="ghost" size="sm" onClick={handleBackToList} className="mb-2">
              &larr; Back to Case Silos
            </Button>
            <h1 className="text-3xl font-bold">
              {currentUser?.role === 'victim' ? "My Case" : selectedSilo.claimantName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-muted-foreground">{selectedSilo.caseType}</span>
              {renderStatusBadge(selectedSilo.status, selectedSilo.expiryDate)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Created on {formatDate(selectedSilo.createdDate)}</div>
            <div className="text-sm text-muted-foreground">
              {isExpired 
                ? `Expired on ${formatDate(selectedSilo.expiryDate)}`
                : `Expires on ${formatDate(selectedSilo.expiryDate)}`}
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Claimant</span>
                <span className="font-medium">{currentUser?.role === 'victim' ? "Me" : selectedSilo.claimantName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Case Type</span>
                <span className="font-medium">{selectedSilo.caseType}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Status</span>
                <div className="font-medium flex items-center">
                  {isExpired ? (
                    <span className="flex items-center text-destructive">
                      <AlertCircle className="w-4 h-4 mr-1" /> Expired
                    </span>
                  ) : (
                    <span className="flex items-center text-emerald-600">
                      <Clock className="w-4 h-4 mr-1" /> {daysRemaining} days remaining
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notes">Case Notes</TabsTrigger>
            {currentUser?.role !== 'victim' && (
              <TabsTrigger value="external">External Uploads</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Documents</CardTitle>
                  {!isExpired && (
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Upload Document
                    </Button>
                  )}
                </div>
                <CardDescription>Documents shared within this case silo</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedSilo.documents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No documents have been uploaded to this case silo yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedSilo.documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-md">
                        <div className="flex items-center">
                          <div className="p-2 bg-primary/10 rounded-md mr-3">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {doc.type} • {doc.size} • Uploaded by {doc.uploadedBy} on {formatDate(doc.uploadDate)}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assessments">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Assessments</CardTitle>
                  {!isExpired && currentUser?.role === 'psychologist' && (
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Assign Assessment
                    </Button>
                  )}
                </div>
                <CardDescription>Psychological assessments related to this case</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedSilo.assessments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No assessments have been assigned for this case yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedSilo.assessments.map(assessment => (
                      <div key={assessment.id} className="p-3 bg-muted/40 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{assessment.title}</div>
                            <div className="text-sm text-muted-foreground">{assessment.description}</div>
                          </div>
                          <Badge variant={assessment.status === 'completed' ? 'default' : 'outline'}>
                            {assessment.status === 'completed' ? 'Completed' : 
                             assessment.status === 'in_progress' ? 'In Progress' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Assigned to: {assessment.assignedTo} • Date: {formatDate(assessment.date)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Reports</CardTitle>
                  {!isExpired && currentUser?.role === 'psychologist' && (
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Create Report
                    </Button>
                  )}
                </div>
                <CardDescription>Case-related reports and assessments</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedSilo.reports.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No reports have been created for this case yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedSilo.reports.map(report => (
                      <div key={report.id} className="p-3 bg-muted/40 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{report.title}</div>
                            <div className="text-sm text-muted-foreground">
                              Patient: {report.patientName} • Type: {report.type === 'workers_comp' ? 'Workers Compensation' : 'Medico-Legal'}
                            </div>
                          </div>
                          <Badge variant={report.status === 'completed' ? 'default' : 'outline'}>
                            {report.status === 'completed' ? 'Completed' : 'Draft'}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Created: {formatDate(report.date)} • Last edited: {formatDate(report.lastEdited)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Case Notes</CardTitle>
                  {!isExpired && (
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Add Note
                    </Button>
                  )}
                </div>
                <CardDescription>Chronological notes visible to all participants</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedSilo.notes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No case notes have been added yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedSilo.notes.map(note => (
                      <div key={note.id} className="p-3 bg-muted/40 rounded-md">
                        <div className="flex justify-between">
                          <div className="font-medium">{note.createdBy}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</div>
                        </div>
                        <div className="text-sm mt-1">{note.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {currentUser?.role !== 'victim' && (
            <TabsContent value="external">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>External Uploads</CardTitle>
                    {!isExpired && (
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-1" /> Send Upload Link
                      </Button>
                    )}
                  </div>
                  <CardDescription>Files uploaded by external contributors (not visible to claimant)</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedSilo.externalUploads.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No external uploads have been received yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedSilo.externalUploads.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-md">
                          <div className="flex items-center">
                            <div className="p-2 bg-amber-100 rounded-md mr-3">
                              <FileText className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <div className="font-medium">{doc.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {doc.type} • {doc.size} • Uploaded by {doc.uploadedBy} on {formatDate(doc.uploadDate)}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </>
    );
  };

  return (
    <div>
      {selectedSilo ? renderSiloDetail() : renderSiloList()}
    </div>
  );
};

export default CaseSilo;
