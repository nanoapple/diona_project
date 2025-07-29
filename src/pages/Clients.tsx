
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Users, User, FileText, ClipboardCheck, FileCheck, File } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import AddClientDialog from '@/components/clients/AddClientDialog';

interface Client {
  id: string;
  name: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  dateOfInjury: string;
  injuryType: string;
  referralSource: string;
  notes: string;
  assessments: Assessment[];
  interviews: Interview[];
  documents: Document[];
}

interface Assessment {
  id: string;
  title: string;
  date: string;
  type: string;
  status: 'completed' | 'in_progress' | 'pending';
  score?: string;
  summary?: string;
}

interface Interview {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'in_progress' | 'pending';
  summary?: string;
}

interface Document {
  id: string;
  title: string;
  date: string;
  type: 'medical' | 'legal' | 'assessment' | 'personal' | 'other';
  uploadedBy: string;
  fileSize: string;
}

const Clients = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'John Doe',
      dateOfBirth: '1985-06-12',
      email: 'john.doe@example.com',
      phone: '555-123-4567',
      address: '123 Main St, Sydney NSW 2000',
      dateOfInjury: '2023-01-15',
      injuryType: 'Workplace Injury - Back',
      referralSource: 'WorkCover Insurance',
      notes: 'Client has reported significant psychological distress following the workplace incident. Initial assessment indicates development of adjustment disorder with anxiety features.',
      assessments: [
        {
          id: '1',
          title: 'Work-Related Stress Assessment',
          date: '2023-02-15',
          type: 'Psychological',
          status: 'completed',
          score: 'Moderate (65/100)',
          summary: 'Assessment indicates moderate levels of work-related stress with significant impact on daily functioning.'
        },
        {
          id: '2',
          title: 'Depression, Anxiety & Stress Scale (DASS-21)',
          date: '2023-03-05',
          type: 'Psychological',
          status: 'completed',
          score: 'Severe (78/100)',
          summary: 'Client shows severe levels of depression and anxiety, moderate levels of stress.'
        }
      ],
      interviews: [
        {
          id: '1',
          title: 'Initial Self-Guided Interview',
          date: '2023-02-12',
          status: 'completed',
          summary: 'Client reports significant pain and emotional distress following workplace incident. Unable to return to previous duties. Experiencing sleep disturbances, irritability, and persistent worries about financial security.'
        }
      ],
      documents: [
        {
          id: '1',
          title: 'Initial Medical Report',
          date: '2023-01-20',
          type: 'medical',
          uploadedBy: 'Dr. Sarah Johnson',
          fileSize: '1.2 MB'
        },
        {
          id: '2',
          title: 'WorkCover Claim Documentation',
          date: '2023-01-25',
          type: 'legal',
          uploadedBy: 'John Doe',
          fileSize: '3.5 MB'
        }
      ]
    },
    {
      id: '2',
      name: 'Jane Smith',
      dateOfBirth: '1978-09-23',
      email: 'jane.smith@example.com',
      phone: '555-987-6543',
      address: '456 Park Ave, Melbourne VIC 3000',
      dateOfInjury: '2023-02-05',
      injuryType: 'Motor Vehicle Accident',
      referralSource: 'Smith & Associates Law Firm',
      notes: 'Client was involved in a significant motor vehicle accident as a passenger. Displaying symptoms consistent with PTSD including flashbacks, avoidance behaviors, and heightened anxiety when in vehicles.',
      assessments: [
        {
          id: '3',
          title: 'Post-Accident Trauma Screening',
          date: '2023-03-10',
          type: 'Psychological',
          status: 'completed',
          score: 'Significant (72/100)',
          summary: 'Client displays clinically significant symptoms of post-traumatic stress including intrusive thoughts, hypervigilance, and avoidance behaviors.'
        }
      ],
      interviews: [
        {
          id: '2',
          title: 'Structured Clinical Interview',
          date: '2023-03-15',
          status: 'completed',
          summary: 'Client demonstrates symptoms consistent with PTSD following MVA. Reports flashbacks and anxiety when in vehicles. Significant impact on daily functioning and inability to return to work due to required travel.'
        }
      ],
      documents: [
        {
          id: '3',
          title: 'Emergency Room Records',
          date: '2023-02-05',
          type: 'medical',
          uploadedBy: 'Melbourne City Hospital',
          fileSize: '2.3 MB'
        },
        {
          id: '4',
          title: 'Insurance Claim Documentation',
          date: '2023-02-15',
          type: 'legal',
          uploadedBy: 'Smith & Associates',
          fileSize: '1.8 MB'
        },
        {
          id: '5',
          title: 'Police Report',
          date: '2023-02-06',
          type: 'legal',
          uploadedBy: 'Melbourne Police Department',
          fileSize: '1.1 MB'
        }
      ]
    }
  ]);
  
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedClient, setEditedClient] = useState<Partial<Client>>({});
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleSelectClient = (client: Client) => {
    setActiveClient(client);
    setEditedClient({...client});
    setActiveTab('profile');
  };

  const handleEditToggle = () => {
    if (editMode) {
      // If we're saving changes
      const updatedClients = clients.map(client => 
        client.id === activeClient?.id 
          ? {...client, ...editedClient} as Client
          : client
      );
      
      setClients(updatedClients);
      setActiveClient({...activeClient!, ...editedClient} as Client);
      
      toast({
        title: "Changes saved",
        description: "Client information has been updated",
      });
    }
    
    setEditMode(!editMode);
  };

  const handleCreateClient = (clientData: any) => {
    const client: Client = {
      id: clientData.id,
      name: clientData.name,
      dateOfBirth: clientData.dateOfBirth,
      email: clientData.email,
      phone: clientData.phone,
      address: clientData.address,
      dateOfInjury: clientData.dateOfInjury,
      injuryType: clientData.injuryType,
      referralSource: clientData.referralSource,
      notes: clientData.notes,
      assessments: [],
      interviews: [],
      documents: []
    };

    setClients([...clients, client]);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return <FileCheck className="h-4 w-4" />;
      case 'legal':
        return <FileText className="h-4 w-4" />;
      case 'assessment':
        return <ClipboardCheck className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto max-w-6xl">
      {activeClient ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">{activeClient.name}</h1>
              <p className="text-muted-foreground">
                DOB: {formatDate(activeClient.dateOfBirth)} | Case Type: {activeClient.injuryType}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setActiveClient(null)}>
                Back to Clients
              </Button>
              <Button onClick={handleEditToggle}>
                {editMode ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                  <CardDescription>
                    Personal information and case details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      {editMode ? (
                        <Input 
                          value={editedClient.name} 
                          onChange={(e) => setEditedClient({...editedClient, name: e.target.value})}
                        />
                      ) : (
                        <p>{activeClient.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      {editMode ? (
                        <Input 
                          type="date"
                          value={editedClient.dateOfBirth} 
                          onChange={(e) => setEditedClient({...editedClient, dateOfBirth: e.target.value})}
                        />
                      ) : (
                        <p>{formatDate(activeClient.dateOfBirth)}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      {editMode ? (
                        <Input 
                          value={editedClient.email} 
                          onChange={(e) => setEditedClient({...editedClient, email: e.target.value})}
                        />
                      ) : (
                        <p>{activeClient.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Phone</Label>
                      {editMode ? (
                        <Input 
                          value={editedClient.phone} 
                          onChange={(e) => setEditedClient({...editedClient, phone: e.target.value})}
                        />
                      ) : (
                        <p>{activeClient.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Address</Label>
                      {editMode ? (
                        <Input 
                          value={editedClient.address} 
                          onChange={(e) => setEditedClient({...editedClient, address: e.target.value})}
                        />
                      ) : (
                        <p>{activeClient.address}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Date of Injury/Incident</Label>
                      {editMode ? (
                        <Input 
                          type="date"
                          value={editedClient.dateOfInjury} 
                          onChange={(e) => setEditedClient({...editedClient, dateOfInjury: e.target.value})}
                        />
                      ) : (
                        <p>{formatDate(activeClient.dateOfInjury)}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Injury Type</Label>
                      {editMode ? (
                        <Input 
                          value={editedClient.injuryType} 
                          onChange={(e) => setEditedClient({...editedClient, injuryType: e.target.value})}
                        />
                      ) : (
                        <p>{activeClient.injuryType}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Referral Source</Label>
                      {editMode ? (
                        <Input 
                          value={editedClient.referralSource} 
                          onChange={(e) => setEditedClient({...editedClient, referralSource: e.target.value})}
                        />
                      ) : (
                        <p>{activeClient.referralSource}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Clinical Notes</Label>
                    {editMode ? (
                      <Textarea 
                        value={editedClient.notes} 
                        onChange={(e) => setEditedClient({...editedClient, notes: e.target.value})}
                        className="min-h-[150px]"
                      />
                    ) : (
                      <div className="bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
                        {activeClient.notes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessments">
              <Card>
                <CardHeader>
                  <CardTitle>Psychological Assessments</CardTitle>
                  <CardDescription>
                    Completed and ongoing psychological assessments for this client
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activeClient.assessments && activeClient.assessments.length > 0 ? (
                    <div className="space-y-4">
                      {activeClient.assessments.map((assessment) => (
                        <Card key={assessment.id}>
                          <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-medium">{assessment.title}</h3>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(assessment.status)}`}>
                                    {assessment.status.replace('_', ' ')}
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {assessment.type} | {formatDate(assessment.date)}
                                </div>
                                {assessment.score && (
                                  <div className="mt-1 text-sm font-medium">
                                    Score: {assessment.score}
                                  </div>
                                )}
                              </div>
                              <Button variant="outline" size="sm">
                                View Full Results
                              </Button>
                            </div>
                            {assessment.summary && (
                              <div className="mt-4 bg-muted/50 p-3 rounded-md text-sm">
                                <p className="font-medium mb-1">Summary:</p>
                                <p>{assessment.summary}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No Assessments</h3>
                      <p className="text-muted-foreground mt-2">
                        This client doesn't have any completed assessments yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interviews">
              <Card>
                <CardHeader>
                  <CardTitle>Self-Guided Interviews</CardTitle>
                  <CardDescription>
                    Completed interview responses and findings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activeClient.interviews && activeClient.interviews.length > 0 ? (
                    <div className="space-y-4">
                      {activeClient.interviews.map((interview) => (
                        <Card key={interview.id}>
                          <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-medium">{interview.title}</h3>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(interview.status)}`}>
                                    {interview.status.replace('_', ' ')}
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Completed on {formatDate(interview.date)}
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                View Complete Interview
                              </Button>
                            </div>
                            {interview.summary && (
                              <div className="mt-4 bg-muted/50 p-3 rounded-md text-sm">
                                <p className="font-medium mb-1">Summary:</p>
                                <p>{interview.summary}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <User className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No Interviews</h3>
                      <p className="text-muted-foreground mt-2">
                        This client hasn't completed any self-guided interviews yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Support documentation provided by the client or legal representatives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activeClient.documents && activeClient.documents.length > 0 ? (
                    <div className="grid gap-4">
                      {activeClient.documents.map((document) => (
                        <div 
                          key={document.id} 
                          className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded">
                              {getDocumentIcon(document.type)}
                            </div>
                            <div>
                              <h3 className="font-medium">{document.title}</h3>
                              <div className="text-xs text-muted-foreground flex gap-3">
                                <span>Uploaded {formatDate(document.date)}</span>
                                <span>•</span>
                                <span>{document.fileSize}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className="ml-2 capitalize">
                              {document.type}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No Documents</h3>
                      <p className="text-muted-foreground mt-2">
                        There are no documents uploaded for this client.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Clients</h1>
              <p className="text-muted-foreground">
                Manage client information and records
              </p>
            </div>
            
            <Button onClick={() => setIsNewDialogOpen(true)}>Add New Client</Button>
            
            <AddClientDialog
              isOpen={isNewDialogOpen}
              onOpenChange={setIsNewDialogOpen}
              onClientCreated={handleCreateClient}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Client List</CardTitle>
              <CardDescription>
                Select a client to view their complete profile and records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {clients.map((client) => (
                  <Card key={client.id} className="overflow-hidden hover:bg-accent/50 cursor-pointer transition-colors" onClick={() => handleSelectClient(client)}>
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-16 flex items-center justify-center p-4 bg-primary/10">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                      <CardContent className="p-6 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-medium">{client.name}</h3>
                            <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-3 mt-1 text-sm text-muted-foreground">
                              <p>Date of Birth: {formatDate(client.dateOfBirth)}</p>
                              <span className="hidden md:inline">•</span>
                              <p>Injury Type: {client.injuryType}</p>
                            </div>
                            <div className="mt-1 text-xs">
                              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {client.assessments.length} Assessments
                              </span>
                              <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {client.documents.length} Documents
                              </span>
                            </div>
                          </div>
                          
                          <Button size="sm">
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
                
                {clients.length === 0 && (
                  <Card className="p-10 text-center">
                    <div className="flex flex-col items-center">
                      <Users className="h-10 w-10 text-muted-foreground mb-2" />
                      <CardTitle className="mb-2">No Clients</CardTitle>
                      <CardDescription>
                        You haven't added any clients yet.
                      </CardDescription>
                      <Button className="mt-4" onClick={() => setIsNewDialogOpen(true)}>
                        Add Your First Client
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Clients;
