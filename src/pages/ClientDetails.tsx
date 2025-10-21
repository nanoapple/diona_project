
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
import { useTheme } from '@/components/ThemeProvider';

interface ClientDetail {
  id: string;
  // Personal Details
  title: string;
  firstName: string;
  lastName: string;
  preferredFirstName: string;
  dateOfBirth: string;
  sex: string;
  genderIdentity: string;
  pronouns: string;
  culturalIdentity: string;
  
  // Contact Information
  email: string;
  mobilePhone: string;
  alternatePhone: string;
  addressLine1: string;
  addressLine2: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  timeZone: string;
  
  // Communication Preferences
  appointmentReminders: string[];
  marketingMessages: boolean;
  
  // NDIS Details
  ndisParticipantNumber: string;
  ndisFundingType: string;
  ndisStartDate: string;
  ndisEndDate: string;
  ndisAmountRemaining: string;
  
  // Clinical & Case Info
  dateOfInjury: string;
  primaryReason: string;
  appointmentNotes: string;
  concessionType: string;
  insurer: string;
  lawyerSolicitor: string;
  
  // Legal Issues
  hasLegalIssues: boolean;
  courtOrder: boolean;
  detention: boolean;
  communityService: boolean;
  legalNotes: string;
  
  // Billing
  invoiceTo: string;
  emailInvoiceTo: string;
  invoiceExtraInfo: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
  
  // Referral
  referringPractitioner: string;
  referralType: string;
  referralSource: string;
  
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
  const { theme } = useTheme();
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
          // Personal Details
          title: 'Mr',
          firstName: 'John',
          lastName: 'Doe',
          preferredFirstName: 'Johnny',
          dateOfBirth: '1985-06-12',
          sex: 'Male',
          genderIdentity: 'Man',
          pronouns: 'he/him',
          culturalIdentity: 'Australian, Anglo-Celtic background',
          
          // Contact Information
          email: 'john.doe@example.com',
          mobilePhone: '0412 345 678',
          alternatePhone: '02 9876 5432',
          addressLine1: '123 Main Street',
          addressLine2: 'Unit 5',
          suburb: 'Sydney',
          state: 'NSW',
          postcode: '2000',
          country: 'Australia',
          timeZone: 'Australia/Sydney',
          
          // Communication Preferences
          appointmentReminders: ['SMS', 'Email'],
          marketingMessages: false,
          
          // NDIS Details
          ndisParticipantNumber: '4300123456',
          ndisFundingType: 'Plan Managed',
          ndisStartDate: '2023-01-01',
          ndisEndDate: '2024-12-31',
          ndisAmountRemaining: '$45,000',
          
          // Clinical & Case Info
          dateOfInjury: '2023-01-15',
          primaryReason: 'Workplace Injury - Back and psychological adjustment',
          appointmentNotes: 'Client has reported significant psychological distress following the workplace incident. Initial assessment indicates development of adjustment disorder with anxiety features. Prefers morning appointments.',
          concessionType: 'Healthcare Card',
          insurer: 'WorkCover NSW',
          lawyerSolicitor: 'Smith & Partners Legal',
          
          // Legal Issues
          hasLegalIssues: true,
          courtOrder: false,
          detention: false,
          communityService: true,
          legalNotes: 'Ongoing WorkCover claim. Currently under review for permanent impairment assessment. Legal representation secured for claim proceedings.',
          
          // Billing
          invoiceTo: 'WorkCover NSW',
          emailInvoiceTo: 'claims@workcover.nsw.gov.au',
          invoiceExtraInfo: 'Claim Reference: WC-2023-045678. Please include claim number in all invoices.',
          
          // Emergency Contact
          emergencyContactName: 'Sarah Doe',
          emergencyContactRelationship: 'Spouse',
          emergencyContactPhone: '0423 456 789',
          emergencyContactEmail: 'sarah.doe@example.com',
          
          // Referral
          referringPractitioner: 'Dr. Michael Chen',
          referralType: 'GP Referral',
          referralSource: 'WorkCover Insurance',
          
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
          <h1 className="text-3xl font-bold mb-1">{client.firstName} {client.lastName}</h1>
          <p className="text-muted-foreground">
            DOB: {formatDate(client.dateOfBirth)} | Case Type: {client.primaryReason}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/clients">Back to Clients</Link>
          </Button>
          <Button asChild>
            <Link to={`/clients/${clientId}/edit`}>Edit Profile</Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Personal Details Section */}
          <Card className={theme === 'e-ink' ? 'border-l-4 border-[hsl(217,15%,72%)]' : 'border-l-4 border-blue-500'}>
            <CardHeader className={theme === 'e-ink' ? 'bg-[hsl(217,12%,88%)]' : 'bg-blue-50'}>
              <CardTitle className={theme === 'e-ink' ? 'text-[hsl(217,8%,35%)]' : 'text-blue-700'}>Personal Details</CardTitle>
              <CardDescription>Basic personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Title</p>
                  <p className="text-base">{client.title}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">First Name</p>
                  <p className="text-base font-medium">{client.firstName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                  <p className="text-base font-medium">{client.lastName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Preferred First Name</p>
                  <p className="text-base">{client.preferredFirstName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{formatDate(client.dateOfBirth)}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Sex</p>
                  <p className="text-base">{client.sex}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Gender Identity</p>
                  <p className="text-base">{client.genderIdentity}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Pronouns</p>
                  <p className="text-base">{client.pronouns}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Cultural Identity / Language</p>
                  <p className="text-base">{client.culturalIdentity}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Section */}
          <Card className={theme === 'e-ink' ? 'border-l-4 border-[hsl(270,15%,72%)]' : 'border-l-4 border-purple-500'}>
            <CardHeader className={theme === 'e-ink' ? 'bg-[hsl(270,12%,88%)]' : 'bg-purple-50'}>
              <CardTitle className={theme === 'e-ink' ? 'text-[hsl(270,8%,35%)]' : 'text-purple-700'}>Contact Information</CardTitle>
              <CardDescription>Contact details and address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{client.email}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Mobile Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{client.mobilePhone}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Alternate Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{client.alternatePhone}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Time Zone</p>
                  <p className="text-base">{client.timeZone}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-base">{client.addressLine1}</p>
                    {client.addressLine2 && <p className="text-base">{client.addressLine2}</p>}
                    <p className="text-base">{client.suburb} {client.state} {client.postcode}</p>
                    <p className="text-base">{client.country}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Communication Preferences</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Appointment Reminders: {client.appointmentReminders.join(', ')}</Badge>
                  <Badge variant={client.marketingMessages ? "default" : "secondary"}>
                    Marketing Messages: {client.marketingMessages ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NDIS Details Section */}
          {client.ndisParticipantNumber && (
            <Card className={theme === 'e-ink' ? 'border-l-4 border-[hsl(140,18%,72%)]' : 'border-l-4 border-green-500'}>
              <CardHeader className={theme === 'e-ink' ? 'bg-[hsl(140,15%,88%)]' : 'bg-green-50'}>
                <CardTitle className={theme === 'e-ink' ? 'text-[hsl(140,8%,35%)]' : 'text-green-700'}>NDIS Plan Details</CardTitle>
                <CardDescription>National Disability Insurance Scheme information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Participant Number</p>
                    <p className="text-base font-mono">{client.ndisParticipantNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Funding Type</p>
                    <Badge>{client.ndisFundingType}</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Plan Start Date</p>
                    <p className="text-base">{formatDate(client.ndisStartDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Plan End Date</p>
                    <p className="text-base">{formatDate(client.ndisEndDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Amount Remaining</p>
                    <p className="text-base font-semibold text-green-600">{client.ndisAmountRemaining}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Clinical & Case Information Section */}
          <Card className={theme === 'e-ink' ? 'border-l-4 border-[hsl(35,22%,72%)]' : 'border-l-4 border-orange-500'}>
            <CardHeader className={theme === 'e-ink' ? 'bg-[hsl(35,18%,88%)]' : 'bg-orange-50'}>
              <CardTitle className={theme === 'e-ink' ? 'text-[hsl(35,8%,35%)]' : 'text-orange-700'}>Clinical & Case Information</CardTitle>
              <CardDescription>Treatment and case details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Date of Injury/Incident</p>
                  <p className="text-base">{formatDate(client.dateOfInjury)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Concession Type</p>
                  <Badge variant="outline">{client.concessionType}</Badge>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Primary Reason for Service</p>
                  <p className="text-base">{client.primaryReason}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Insurer</p>
                  <p className="text-base">{client.insurer}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Lawyer/Solicitor</p>
                  <p className="text-base">{client.lawyerSolicitor}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Appointment Notes</p>
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{client.appointmentNotes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Issues Section */}
          {client.hasLegalIssues && (
            <Card className={theme === 'e-ink' ? 'border-l-4 border-[hsl(0,15%,72%)]' : 'border-l-4 border-red-500'}>
              <CardHeader className={theme === 'e-ink' ? 'bg-[hsl(0,12%,88%)]' : 'bg-red-50'}>
                <CardTitle className={theme === 'e-ink' ? 'text-[hsl(0,8%,35%)]' : 'text-red-700'}>Legal Issues</CardTitle>
                <CardDescription>Active legal matters and court orders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex flex-wrap gap-2">
                  {client.courtOrder && <Badge variant="destructive">Court Order</Badge>}
                  {client.detention && <Badge variant="destructive">Detention</Badge>}
                  {client.communityService && <Badge variant="outline">Community Service</Badge>}
                </div>
                
                {client.legalNotes && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Legal Notes</p>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-sm whitespace-pre-wrap">{client.legalNotes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Billing Information Section */}
          <Card className={theme === 'e-ink' ? 'border-l-4 border-[hsl(240,12%,72%)]' : 'border-l-4 border-indigo-500'}>
            <CardHeader className={theme === 'e-ink' ? 'bg-[hsl(240,10%,88%)]' : 'bg-indigo-50'}>
              <CardTitle className={theme === 'e-ink' ? 'text-[hsl(240,8%,35%)]' : 'text-indigo-700'}>Billing & Invoicing</CardTitle>
              <CardDescription>Payment and invoicing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Invoice To</p>
                  <p className="text-base">{client.invoiceTo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email Invoice To</p>
                  <p className="text-base">{client.emailInvoiceTo}</p>
                </div>
              </div>
              
              {client.invoiceExtraInfo && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Additional Information</p>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{client.invoiceExtraInfo}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contact Section */}
          <Card className={theme === 'e-ink' ? 'border-l-4 border-[hsl(330,12%,72%)]' : 'border-l-4 border-pink-500'}>
            <CardHeader className={theme === 'e-ink' ? 'bg-[hsl(330,10%,88%)]' : 'bg-pink-50'}>
              <CardTitle className={theme === 'e-ink' ? 'text-[hsl(330,8%,35%)]' : 'text-pink-700'}>Emergency Contact</CardTitle>
              <CardDescription>Emergency contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base font-medium">{client.emergencyContactName}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Relationship</p>
                  <p className="text-base">{client.emergencyContactRelationship}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{client.emergencyContactPhone}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{client.emergencyContactEmail}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral Information Section */}
          <Card className={theme === 'e-ink' ? 'border-l-4 border-[hsl(190,18%,72%)]' : 'border-l-4 border-teal-500'}>
            <CardHeader className={theme === 'e-ink' ? 'bg-[hsl(190,15%,88%)]' : 'bg-teal-50'}>
              <CardTitle className={theme === 'e-ink' ? 'text-[hsl(190,8%,35%)]' : 'text-teal-700'}>Referral Information</CardTitle>
              <CardDescription>Referral source and details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Referring Practitioner</p>
                  <p className="text-base">{client.referringPractitioner}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Referral Type</p>
                  <Badge>{client.referralType}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Referral Source</p>
                  <p className="text-base">{client.referralSource}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Case Summary Card */}

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
        </TabsContent>

        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle>Assessments</CardTitle>
              <CardDescription>Completed psychological assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Assessment history will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interviews">
          <Card>
            <CardHeader>
              <CardTitle>Interviews</CardTitle>
              <CardDescription>Client interview records</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Interview records will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Uploaded documents and files</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Document library will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cases" className="hidden">
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

        <TabsContent value="notes" className="hidden">
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
