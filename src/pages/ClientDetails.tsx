
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';
import { User, Calendar, Phone, Mail, MapPin, FileText, Archive, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClientDetail {
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
  caseIds: string[];
}

interface Case {
  id: string;
  title: string;
  status: 'active' | 'pending' | 'completed';
  type: string;
  lastUpdated: string;
}

const ClientDetails = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { toast } = useToast();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        // In a real app, this would be an API call to fetch client details
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockClient: ClientDetail = {
          id: clientId || '1',
          name: 'John Doe',
          dateOfBirth: '1985-06-12',
          email: 'john.doe@example.com',
          phone: '555-123-4567',
          address: '123 Main St, Sydney NSW 2000',
          dateOfInjury: '2023-01-15',
          injuryType: 'Workplace Injury - Back',
          referralSource: 'WorkCover Insurance',
          notes: 'Client has reported significant psychological distress following the workplace incident. Initial assessment indicates development of adjustment disorder with anxiety features.',
          caseIds: ['1', '2']
        };
        
        const mockCases: Case[] = [
          {
            id: '1',
            title: 'WorkCover Claim - Back Injury',
            status: 'active',
            type: 'Workers Compensation',
            lastUpdated: '2023-04-10'
          },
          {
            id: '2',
            title: 'TPD Claim - Insurance',
            status: 'pending',
            type: 'Total Permanent Disability',
            lastUpdated: '2023-03-25'
          }
        ];
        
        setClient(mockClient);
        setCases(mockCases);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching client details:', error);
        toast({
          title: "Error",
          description: "Failed to load client details. Please try again.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchClientDetails();
  }, [clientId, toast]);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">Client Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            We couldn't find the client you're looking for.
          </p>
          <Button asChild className="mt-4">
            <Link to="/clients">Back to Clients</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-1">{client.name}</h1>
          <p className="text-muted-foreground">
            Client since {formatDate('2023-01-01')} | {client.injuryType}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/clients">Back to Clients List</Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cases">Cases</TabsTrigger>
          <TabsTrigger value="notes">Legal Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>Personal and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{client.name}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{formatDate(client.dateOfBirth)}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{client.phone}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{client.email}</p>
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{client.address}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date of Injury</p>
                    <p className="font-medium">{formatDate(client.dateOfInjury)}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Injury Type</p>
                    <p className="font-medium">{client.injuryType}</p>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm text-muted-foreground">Referral Source</p>
                    <p className="font-medium">{client.referralSource}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Case Summary</CardTitle>
                <CardDescription>Active and pending cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cases.map((caseItem) => (
                    <div key={caseItem.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{caseItem.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {caseItem.type} • Updated {formatDate(caseItem.lastUpdated)}
                        </p>
                      </div>
                      {renderStatusBadge(caseItem.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link to={`/case-silo`}>
                    <Archive className="h-4 w-4 mr-2" />
                    View All Cases
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Client Notes</CardTitle>
              <CardDescription>Important information about the client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
                {client.notes}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cases">
          <Card>
            <CardHeader>
              <CardTitle>Client Cases</CardTitle>
              <CardDescription>All cases associated with this client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cases.map((caseItem) => (
                  <Card key={caseItem.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-2 bg-primary" 
                        style={{
                          backgroundColor: caseItem.status === 'active' ? 'green' : 
                                         caseItem.status === 'pending' ? 'orange' : 'blue'
                        }} 
                      />
                      <CardContent className="p-6 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">{caseItem.title}</h3>
                            <div className="flex flex-col md:flex-row md:items-center text-sm text-muted-foreground mt-1">
                              <span>{caseItem.type}</span>
                              <span className="hidden md:inline mx-2">•</span>
                              <span>Last updated: {formatDate(caseItem.lastUpdated)}</span>
                            </div>
                            <div className="mt-2">
                              {renderStatusBadge(caseItem.status)}
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 flex gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/case-silo`}>
                                <Archive className="h-4 w-4 mr-1" />
                                Open Case Silo
                              </Link>
                            </Button>
                            <Button asChild size="sm">
                              <Link to={`/legal-tasks`}>
                                <FileText className="h-4 w-4 mr-1" />
                                Manage Tasks
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Legal Notes</CardTitle>
              <CardDescription>Private notes for legal team only</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Initial Consultation Notes</h4>
                      <p className="text-xs text-muted-foreground">Added by: Sarah Johnson • {formatDate('2023-01-10')}</p>
                    </div>
                    <Badge variant="outline">Confidential</Badge>
                  </div>
                  <p className="text-sm mt-2">
                    Client appears to have a strong case for workers compensation. Employer failed to provide appropriate safety equipment despite prior complaints. Medical evidence supports causation between the workplace incident and physical injury. Mental health symptoms developed afterward and appear related.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Case Strategy Notes</h4>
                      <p className="text-xs text-muted-foreground">Added by: Michael Brown • {formatDate('2023-02-15')}</p>
                    </div>
                    <Badge variant="outline">Confidential</Badge>
                  </div>
                  <p className="text-sm mt-2">
                    Focus strategy on both physical and psychological injury components. Need to gather additional evidence regarding prior complaints about safety equipment. Consider requesting witness statements from colleagues who were present during the incident. Psychological assessment will be key to establishing extent of mental health impact.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Add New Note</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetails;
