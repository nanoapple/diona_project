
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { User, FileText, ClipboardCheck, Search, Calendar, Download, Phone, Mail, MapPin, Clipboard, FileUp } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  dateOfInjury: string;
  injuryType: string;
  referralSource: string;
  referralDate: string;
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
  documents: {
    id: string;
    title: string;
    type: string;
    uploadedBy: string;
    date: string;
    fileSize: string;
  }[];
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedClient, setEditedClient] = useState<Partial<Client>>({});

  useEffect(() => {
    const fetchClients = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockClients: Client[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '(555) 123-4567',
          address: '123 Main St, Anytown, CA 90210',
          dateOfBirth: '1985-06-12',
          dateOfInjury: '2023-01-15',
          injuryType: 'Workplace Injury - Back',
          referralSource: 'Dr. Smith (GP)',
          referralDate: '2023-02-10',
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
          ],
          documents: [
            {
              id: '1',
              title: 'Medical Report - Initial Assessment',
              type: 'Medical',
              uploadedBy: 'Jane Smith (Lawyer)',
              date: '2023-02-08',
              fileSize: '1.2 MB'
            },
            {
              id: '2',
              title: 'Workplace Incident Report',
              type: 'Legal',
              uploadedBy: 'Jane Smith (Lawyer)',
              date: '2023-01-17',
              fileSize: '3.5 MB'
            }
          ]
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '(555) 987-6543',
          address: '456 Oak Ave, Somewhere, CA 92101',
          dateOfBirth: '1978-09-23',
          dateOfInjury: '2023-02-05',
          injuryType: 'Motor Vehicle Accident',
          referralSource: 'Dr. Johnson (Specialist)',
          referralDate: '2023-03-01',
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
          ],
          documents: [
            {
              id: '3',
              title: 'Police Report - Accident',
              type: 'Legal',
              uploadedBy: 'Michael Johnson (Lawyer)',
              date: '2023-02-06',
              fileSize: '2.1 MB'
            },
            {
              id: '4',
              title: 'Hospital Discharge Summary',
              type: 'Medical',
              uploadedBy: 'Jane Smith',
              date: '2023-02-07',
              fileSize: '1.8 MB'
            }
          ]
        }
      ];
      
      setClients(mockClients);
      setIsLoading(false);
    };
    
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectClient = (client: Client) => {
    setActiveClient(client);
    setEditedClient({});
    setEditMode(false);
  };

  const handleStartEdit = () => {
    if (!activeClient) return;
    setEditedClient({...activeClient});
    setEditMode(true);
  };

  const handleSaveChanges = () => {
    if (!activeClient || !editedClient) return;
    
    const updatedClients = clients.map(client => 
      client.id === activeClient.id ? {...client, ...editedClient} as Client : client
    );
    
    setClients(updatedClients);
    setActiveClient({...activeClient, ...editedClient} as Client);
    setEditMode(false);
  };

  const handleUploadDocument = () => {
    // This would be implemented to handle document uploads
    alert('Document upload functionality would be implemented here.');
  };

  return (
    <div className="container mx-auto max-w-7xl">
      {activeClient ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">{activeClient.name}</h1>
              <p className="text-muted-foreground">
                {activeClient.injuryType} | Referred on {formatDate(activeClient.referralDate)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setActiveClient(null)}>
                Back to Clients
              </Button>
              {!editMode ? (
                <Button onClick={handleStartEdit}>Edit Profile</Button>
              ) : (
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Client Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!editMode ? (
                  <>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{activeClient.email}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{activeClient.phone}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Address</div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{activeClient.address}</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Date of Birth</div>
                      <div>{formatDate(activeClient.dateOfBirth)}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Date of Injury</div>
                      <div>{formatDate(activeClient.dateOfInjury)}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Injury Type</div>
                      <div>{activeClient.injuryType}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Referral Source</div>
                      <div>{activeClient.referralSource}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        value={editedClient.email || ''}
                        onChange={(e) => setEditedClient({...editedClient, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        value={editedClient.phone || ''}
                        onChange={(e) => setEditedClient({...editedClient, phone: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        value={editedClient.address || ''}
                        onChange={(e) => setEditedClient({...editedClient, address: e.target.value})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input 
                        id="dob" 
                        type="date"
                        value={editedClient.dateOfBirth || ''}
                        onChange={(e) => setEditedClient({...editedClient, dateOfBirth: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="injuryDate">Date of Injury</Label>
                      <Input 
                        id="injuryDate" 
                        type="date"
                        value={editedClient.dateOfInjury || ''}
                        onChange={(e) => setEditedClient({...editedClient, dateOfInjury: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="injuryType">Injury Type</Label>
                      <Input 
                        id="injuryType" 
                        value={editedClient.injuryType || ''}
                        onChange={(e) => setEditedClient({...editedClient, injuryType: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="referralSource">Referral Source</Label>
                      <Input 
                        id="referralSource" 
                        value={editedClient.referralSource || ''}
                        onChange={(e) => setEditedClient({...editedClient, referralSource: e.target.value})}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <Tabs defaultValue="assessments">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Client Records</CardTitle>
                    <TabsList>
                      <TabsTrigger value="assessments">Assessments</TabsTrigger>
                      <TabsTrigger value="interviews">Interviews</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                    </TabsList>
                  </div>
                </CardHeader>
                <CardContent>
                  <TabsContent value="assessments" className="space-y-4">
                    {activeClient.assessments.length > 0 ? (
                      activeClient.assessments.map(assessment => (
                        <Card key={assessment.id}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                              <div>
                                <div className="font-medium">{assessment.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(assessment.date)} • {assessment.type}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={assessment.status === 'completed' ? 'default' : 'secondary'}>
                                  {assessment.status}
                                </Badge>
                                {assessment.status === 'completed' && (
                                  <Button variant="outline" size="sm">
                                    View Results
                                  </Button>
                                )}
                              </div>
                            </div>
                            {assessment.score && (
                              <div className="text-sm mt-2">
                                <span className="font-medium">Score:</span> {assessment.score}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No assessments available for this client.
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="interviews" className="space-y-4">
                    {activeClient.interviews.length > 0 ? (
                      activeClient.interviews.map(interview => (
                        <Card key={interview.id}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                              <div>
                                <div className="font-medium">{interview.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(interview.date)}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={interview.status === 'completed' ? 'default' : 'secondary'}>
                                  {interview.status}
                                </Badge>
                                {interview.status === 'completed' && (
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                )}
                              </div>
                            </div>
                            {interview.summary && (
                              <div className="text-sm mt-2">
                                <span className="font-medium">Summary:</span> {interview.summary}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No interviews available for this client.
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="documents" className="space-y-4">
                    <div className="flex justify-end mb-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <FileUp className="h-4 w-4 mr-2" />
                            Upload Document
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Upload Document</DialogTitle>
                            <DialogDescription>
                              Upload a document relevant to this client's case
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="docTitle">Document Title</Label>
                              <Input id="docTitle" placeholder="Enter document title" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="docType">Document Type</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select document type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="medical">Medical</SelectItem>
                                  <SelectItem value="legal">Legal</SelectItem>
                                  <SelectItem value="assessment">Assessment</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="file">File</Label>
                              <Input id="file" type="file" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleUploadDocument}>Upload</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    {activeClient.documents.length > 0 ? (
                      activeClient.documents.map(document => (
                        <Card key={document.id}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                              <div>
                                <div className="font-medium">{document.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(document.date)} • {document.type} • {document.fileSize}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{document.type}</Badge>
                                <Button variant="outline" size="sm">
                                  <Download className="h-3 w-3 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Uploaded by: {document.uploadedBy}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No documents available for this client.
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Clients</h1>
              <p className="text-muted-foreground">
                Manage your clients and their assessments
              </p>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search clients by name or email..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredClients.length > 0 ? (
            <div className="grid gap-4">
              {filteredClients.map(client => (
                <Card key={client.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-16 flex items-center justify-center p-4 bg-primary/10">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <CardContent className="p-6 flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-medium">{client.name}</h3>
                          <div className="flex flex-col gap-1 mt-1">
                            <div className="text-sm text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {client.email}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <ClipboardCheck className="h-3 w-3" /> {client.injuryType}
                              </span>
                            </div>
                          </div>
                          <div className="mt-1">
                            <Badge variant="outline" className="mr-2">
                              {client.assessments.length} Assessments
                            </Badge>
                            <Badge variant="outline">
                              {client.documents.length} Documents
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3 md:mt-0">
                          <Button onClick={() => handleSelectClient(client)}>
                            View Client
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-10 text-center">
              <div className="flex flex-col items-center">
                <User className="h-10 w-10 text-muted-foreground mb-2" />
                <CardTitle className="mb-2">No Clients Found</CardTitle>
                <CardDescription>
                  No clients match your search criteria.
                </CardDescription>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Clients;
