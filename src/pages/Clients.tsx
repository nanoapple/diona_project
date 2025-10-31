
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Users, User, FileText, ClipboardCheck, FileCheck, File, Search, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import AddClientDialog from '@/components/clients/AddClientDialog';
import { useTheme } from '@/components/ThemeProvider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface Client {
  id: string;
  // Personal Details
  title?: string;
  firstName?: string;
  lastName?: string;
  name: string;
  preferredFirstName?: string;
  dateOfBirth: string;
  sex?: string;
  genderIdentity?: string;
  pronouns?: string;
  culturalIdentity?: string;
  
  // Contact
  email: string;
  phone: string;
  mobilePhone?: string;
  alternatePhone?: string;
  address: string;
  addressLine1?: string;
  addressLine2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  timeZone?: string;
  
  // Communication
  appointmentReminders?: string[];
  marketingMessages?: boolean;
  
  // NDIS
  ndisParticipantNumber?: string;
  ndisFundingType?: string;
  ndisStartDate?: string;
  ndisEndDate?: string;
  ndisAmountRemaining?: string;
  
  // Clinical
  dateOfInjury: string;
  injuryType: string;
  primaryReason?: string;
  concessionType?: string;
  insurer?: string;
  lawyerSolicitor?: string;
  
  // Legal
  hasLegalIssues?: boolean;
  courtOrder?: boolean;
  detention?: boolean;
  communityService?: boolean;
  legalNotes?: string;
  
  // Billing
  invoiceTo?: string;
  emailInvoiceTo?: string;
  invoiceExtraInfo?: string;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  emergencyContactEmail?: string;
  
  // Referral
  referralSource: string;
  referringPractitioner?: string;
  referralType?: string;
  
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
  const { theme } = useTheme();
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      // Personal
      title: 'Mr',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      preferredFirstName: 'Johnny',
      dateOfBirth: '1985-06-12',
      sex: 'Male',
      genderIdentity: 'Man',
      pronouns: 'he/him',
      culturalIdentity: 'Australian, Anglo-Celtic background',
      
      // Contact
      email: 'john.doe@example.com',
      phone: '0412 345 678',
      mobilePhone: '0412 345 678',
      alternatePhone: '02 9876 5432',
      address: '123 Main St, Unit 5, Sydney NSW 2000',
      addressLine1: '123 Main Street',
      addressLine2: 'Unit 5',
      suburb: 'Sydney',
      state: 'NSW',
      postcode: '2000',
      country: 'Australia',
      timeZone: 'Australia/Sydney',
      
      // Communication
      appointmentReminders: ['SMS', 'Email'],
      marketingMessages: false,
      
      // NDIS
      ndisParticipantNumber: '4300123456',
      ndisFundingType: 'Plan Managed',
      ndisStartDate: '2023-01-01',
      ndisEndDate: '2024-12-31',
      ndisAmountRemaining: '$45,000',
      
      // Clinical
      dateOfInjury: '2023-01-15',
      injuryType: 'Workplace Injury - Back',
      primaryReason: 'Workplace Injury - Back and psychological adjustment',
      concessionType: 'Healthcare Card',
      insurer: 'WorkCover NSW',
      lawyerSolicitor: 'Smith & Partners Legal',
      
      // Legal
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
      referralSource: 'WorkCover Insurance',
      referringPractitioner: 'Dr. Michael Chen',
      referralType: 'GP Referral',
      
      notes: 'Client has reported significant psychological distress following the workplace incident. Initial assessment indicates development of adjustment disorder with anxiety features. Prefers morning appointments.',
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
      // Personal
      title: 'Ms',
      firstName: 'Jane',
      lastName: 'Smith',
      name: 'Jane Smith',
      preferredFirstName: 'Jane',
      dateOfBirth: '1978-09-23',
      sex: 'Female',
      genderIdentity: 'Woman',
      pronouns: 'she/her',
      culturalIdentity: 'Australian, South Asian heritage',
      
      // Contact
      email: 'jane.smith@example.com',
      phone: '0456 789 012',
      mobilePhone: '0456 789 012',
      alternatePhone: '03 8765 4321',
      address: '456 Park Ave, Melbourne VIC 3000',
      addressLine1: '456 Park Avenue',
      addressLine2: '',
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      country: 'Australia',
      timeZone: 'Australia/Melbourne',
      
      // Communication
      appointmentReminders: ['Email', 'SMS'],
      marketingMessages: true,
      
      // NDIS
      ndisParticipantNumber: '4300654321',
      ndisFundingType: 'Self Managed',
      ndisStartDate: '2023-07-01',
      ndisEndDate: '2025-06-30',
      ndisAmountRemaining: '$38,500',
      
      // Clinical
      dateOfInjury: '2023-02-05',
      injuryType: 'Motor Vehicle Accident',
      primaryReason: 'Post-traumatic stress and anxiety following motor vehicle accident',
      concessionType: 'Pension Card',
      insurer: 'TAC Victoria',
      lawyerSolicitor: 'Smith & Associates Law Firm',
      
      // Legal
      hasLegalIssues: true,
      courtOrder: false,
      detention: false,
      communityService: false,
      legalNotes: 'Third-party claim in progress with TAC. Awaiting independent medical examination report. Legal proceedings expected to continue for 12-18 months.',
      
      // Billing
      invoiceTo: 'TAC Victoria',
      emailInvoiceTo: 'claims@tac.vic.gov.au',
      invoiceExtraInfo: 'TAC Claim Number: TAC-2023-789012. Include claim number and client name on all correspondence.',
      
      // Emergency Contact
      emergencyContactName: 'Robert Smith',
      emergencyContactRelationship: 'Brother',
      emergencyContactPhone: '0487 654 321',
      emergencyContactEmail: 'robert.smith@example.com',
      
      // Referral
      referralSource: 'Smith & Associates Law Firm',
      referringPractitioner: 'Dr. Emily Watson',
      referralType: 'Legal Referral',
      
      notes: 'Client was involved in a significant motor vehicle accident as a passenger. Displaying symptoms consistent with PTSD including flashbacks, avoidance behaviors, and heightened anxiety when in vehicles. Unable to use public transport.',
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [orderBy, setOrderBy] = useState<'firstName' | 'surname'>('firstName');

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

  // Filter clients based on search term, selected letter, and order
  const filteredClients = clients.filter(client => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.injuryType.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Letter filter
    if (!matchesSearch) return false;
    if (!selectedLetter) return true;
    
    if (orderBy === 'firstName') {
      const firstName = client.firstName || client.name.split(' ')[0];
      return firstName.toUpperCase().startsWith(selectedLetter);
    } else {
      const lastName = client.lastName || client.name.split(' ')[1] || '';
      return lastName.toUpperCase().startsWith(selectedLetter);
    }
  });

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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

            <TabsContent value="profile" className="space-y-6">
              {/* Personal Details Section */}
              <Card className={theme === 'e-ink' ? 'border-l-4 border-[hsl(210,15%,65%)]' : 'border-l-4 border-blue-500'}>
                <CardHeader className={theme === 'e-ink' ? 'bg-[hsl(210,15%,88%)]' : 'bg-blue-50'}>
                  <CardTitle className={theme === 'e-ink' ? 'text-[hsl(210,20%,25%)]' : 'text-blue-700'}>Personal Details</CardTitle>
                  <CardDescription>Basic personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Title</p>
                      <p className="text-base">{activeClient.title || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">First Name</p>
                      <p className="text-base font-medium">{activeClient.firstName || activeClient.name.split(' ')[0]}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                      <p className="text-base font-medium">{activeClient.lastName || activeClient.name.split(' ')[1]}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeClient.preferredFirstName && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Preferred First Name</p>
                        <p className="text-base">{activeClient.preferredFirstName}</p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p className="text-base">{formatDate(activeClient.dateOfBirth)}</p>
                      </div>
                    </div>
                    {activeClient.sex && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Sex</p>
                        <p className="text-base">{activeClient.sex}</p>
                      </div>
                    )}
                    {activeClient.genderIdentity && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Gender Identity</p>
                        <p className="text-base">{activeClient.genderIdentity}</p>
                      </div>
                    )}
                    {activeClient.pronouns && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Pronouns</p>
                        <p className="text-base">{activeClient.pronouns}</p>
                      </div>
                    )}
                    {activeClient.culturalIdentity && (
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Cultural Identity / Language</p>
                        <p className="text-base">{activeClient.culturalIdentity}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information Section */}
              <Card className={theme === 'e-ink' ? 'border-l-4 border-[hsl(270,15%,65%)]' : 'border-l-4 border-purple-500'}>
                <CardHeader className={theme === 'e-ink' ? 'bg-[hsl(270,15%,88%)]' : 'bg-purple-50'}>
                  <CardTitle className={theme === 'e-ink' ? 'text-[hsl(270,20%,25%)]' : 'text-purple-700'}>Contact Information</CardTitle>
                  <CardDescription>Contact details and address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <p className="text-base">{activeClient.email}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Mobile Phone</p>
                      <p className="text-base">{activeClient.mobilePhone || activeClient.phone}</p>
                    </div>
                    {activeClient.alternatePhone && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Alternate Phone</p>
                        <p className="text-base">{activeClient.alternatePhone}</p>
                      </div>
                    )}
                    {activeClient.timeZone && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Time Zone</p>
                        <p className="text-base">{activeClient.timeZone}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="text-base">{activeClient.address}</p>
                    </div>
                  </div>
                  
                  {activeClient.appointmentReminders && activeClient.appointmentReminders.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Communication Preferences</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Reminders: {activeClient.appointmentReminders.join(', ')}</Badge>
                        {activeClient.marketingMessages !== undefined && (
                          <Badge variant={activeClient.marketingMessages ? "default" : "secondary"}>
                            Marketing: {activeClient.marketingMessages ? 'Yes' : 'No'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* NDIS Details Section */}
              {activeClient.ndisParticipantNumber && (
                <Card className={theme === 'e-ink' ? 'border-l-4 border-[hsl(180,15%,65%)]' : 'border-l-4 border-green-500'}>
                  <CardHeader className={theme === 'e-ink' ? 'bg-[hsl(180,15%,88%)]' : 'bg-green-50'}>
                    <CardTitle className={theme === 'e-ink' ? 'text-[hsl(180,20%,25%)]' : 'text-green-700'}>NDIS Plan Details</CardTitle>
                    <CardDescription>National Disability Insurance Scheme information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Participant Number</p>
                        <p className="text-base font-mono">{activeClient.ndisParticipantNumber}</p>
                      </div>
                      {activeClient.ndisFundingType && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Funding Type</p>
                          <Badge>{activeClient.ndisFundingType}</Badge>
                        </div>
                      )}
                      {activeClient.ndisStartDate && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Plan Start Date</p>
                          <p className="text-base">{formatDate(activeClient.ndisStartDate)}</p>
                        </div>
                      )}
                      {activeClient.ndisEndDate && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Plan End Date</p>
                          <p className="text-base">{formatDate(activeClient.ndisEndDate)}</p>
                        </div>
                      )}
                      {activeClient.ndisAmountRemaining && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Amount Remaining</p>
                          <p className="text-base font-semibold text-green-600">{activeClient.ndisAmountRemaining}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Clinical & Case Information Section */}
              <Card className={theme === 'e-ink' ? 'border-l-4 border-[hsl(40,15%,65%)]' : 'border-l-4 border-orange-500'}>
                <CardHeader className={theme === 'e-ink' ? 'bg-[hsl(40,15%,88%)]' : 'bg-orange-50'}>
                  <CardTitle className={theme === 'e-ink' ? 'text-[hsl(40,20%,25%)]' : 'text-orange-700'}>Clinical & Case Information</CardTitle>
                  <CardDescription>Treatment and case details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Date of Injury/Incident</p>
                      <p className="text-base">{formatDate(activeClient.dateOfInjury)}</p>
                    </div>
                    {activeClient.concessionType && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Concession Type</p>
                        <Badge variant="outline">{activeClient.concessionType}</Badge>
                      </div>
                    )}
                    <div className="space-y-1 md:col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Primary Reason for Service</p>
                      <p className="text-base">{activeClient.primaryReason || activeClient.injuryType}</p>
                    </div>
                    {activeClient.insurer && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Insurer</p>
                        <p className="text-base">{activeClient.insurer}</p>
                      </div>
                    )}
                    {activeClient.lawyerSolicitor && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Lawyer/Solicitor</p>
                        <p className="text-base">{activeClient.lawyerSolicitor}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Clinical Notes</p>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-sm whitespace-pre-wrap">{activeClient.notes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Legal Issues Section */}
              {activeClient.hasLegalIssues && (
                <Card className={theme === 'e-ink' ? 'border-l-4 border-[hsl(340,15%,65%)]' : 'border-l-4 border-red-500'}>
                  <CardHeader className={theme === 'e-ink' ? 'bg-[hsl(340,15%,88%)]' : 'bg-red-50'}>
                    <CardTitle className={theme === 'e-ink' ? 'text-[hsl(340,20%,25%)]' : 'text-red-700'}>Legal Issues</CardTitle>
                    <CardDescription>Active legal matters and court orders</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex flex-wrap gap-2">
                      {activeClient.courtOrder && <Badge variant="destructive">Court Order</Badge>}
                      {activeClient.detention && <Badge variant="destructive">Detention</Badge>}
                      {activeClient.communityService && <Badge variant="outline">Community Service</Badge>}
                    </div>
                    
                    {activeClient.legalNotes && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Legal Notes</p>
                        <div className="bg-muted/50 p-3 rounded-md">
                          <p className="text-sm whitespace-pre-wrap">{activeClient.legalNotes}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Billing Information Section */}
              {activeClient.invoiceTo && (
                <Card className={theme === 'e-ink' ? 'border-l-4 border-[hsl(50,15%,65%)]' : 'border-l-4 border-indigo-500'}>
                  <CardHeader className={theme === 'e-ink' ? 'bg-[hsl(50,15%,88%)]' : 'bg-indigo-50'}>
                    <CardTitle className={theme === 'e-ink' ? 'text-[hsl(50,20%,25%)]' : 'text-indigo-700'}>Billing & Invoicing</CardTitle>
                    <CardDescription>Payment and invoicing details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Invoice To</p>
                        <p className="text-base">{activeClient.invoiceTo}</p>
                      </div>
                      {activeClient.emailInvoiceTo && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Email Invoice To</p>
                          <p className="text-base">{activeClient.emailInvoiceTo}</p>
                        </div>
                      )}
                    </div>
                    
                    {activeClient.invoiceExtraInfo && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Additional Information</p>
                        <div className="bg-muted/50 p-3 rounded-md">
                          <p className="text-sm whitespace-pre-wrap">{activeClient.invoiceExtraInfo}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Emergency Contact Section */}
              {activeClient.emergencyContactName && (
                <Card className={theme === 'e-ink' ? 'border-l-4 border-[hsl(25,15%,65%)]' : 'border-l-4 border-pink-500'}>
                  <CardHeader className={theme === 'e-ink' ? 'bg-[hsl(25,15%,88%)]' : 'bg-pink-50'}>
                    <CardTitle className={theme === 'e-ink' ? 'text-[hsl(25,20%,25%)]' : 'text-pink-700'}>Emergency Contact</CardTitle>
                    <CardDescription>Emergency contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <p className="text-base font-medium">{activeClient.emergencyContactName}</p>
                        </div>
                      </div>
                      {activeClient.emergencyContactRelationship && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Relationship</p>
                          <p className="text-base">{activeClient.emergencyContactRelationship}</p>
                        </div>
                      )}
                      {activeClient.emergencyContactPhone && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Phone</p>
                          <p className="text-base">{activeClient.emergencyContactPhone}</p>
                        </div>
                      )}
                      {activeClient.emergencyContactEmail && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Email</p>
                          <p className="text-base">{activeClient.emergencyContactEmail}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Referral Information Section */}
              <Card className={theme === 'e-ink' ? 'border-l-4 border-[hsl(140,15%,65%)]' : 'border-l-4 border-teal-500'}>
                <CardHeader className={theme === 'e-ink' ? 'bg-[hsl(140,15%,88%)]' : 'bg-teal-50'}>
                  <CardTitle className={theme === 'e-ink' ? 'text-[hsl(140,20%,25%)]' : 'text-teal-700'}>Referral Information</CardTitle>
                  <CardDescription>Referral source and details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeClient.referringPractitioner && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Referring Practitioner</p>
                        <p className="text-base">{activeClient.referringPractitioner}</p>
                      </div>
                    )}
                    {activeClient.referralType && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Referral Type</p>
                        <Badge>{activeClient.referralType}</Badge>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Referral Source</p>
                      <p className="text-base">{activeClient.referralSource}</p>
                    </div>
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

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients by name, email, or injury type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Alphabetic Filter with Order Toggle */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <ToggleGroup 
                type="single" 
                value={orderBy} 
                onValueChange={(value) => {
                  if (value) setOrderBy(value as 'firstName' | 'surname');
                }}
                className="justify-start"
              >
                <ToggleGroupItem value="firstName" aria-label="Order by first name" className="text-xs">
                  Order by First Name
                </ToggleGroupItem>
                <ToggleGroupItem value="surname" aria-label="Order by surname" className="text-xs">
                  Order by Surname
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <div className="flex flex-wrap gap-1">
              <Button
                variant={selectedLetter === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLetter('')}
                className="h-8 w-12 text-xs"
              >
                All
              </Button>
              {alphabet.map((letter) => (
                <Button
                  key={letter}
                  variant={selectedLetter === letter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLetter(letter)}
                  className="h-8 w-8 text-xs p-0"
                >
                  {letter}
                </Button>
              ))}
            </div>
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
                {filteredClients.map((client) => {
                  // Demo status based on client name
                  const isEnabled = client.name === "John Doe";
                  const hasNewActivity = client.name === "John Doe";
                  
                  return (
                    <div key={client.id} className="flex gap-4 items-stretch">
                      <Card className="overflow-hidden hover:bg-accent/50 cursor-pointer transition-colors flex-1" onClick={() => handleSelectClient(client)}>
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
                      <Button 
                        variant="outline" 
                        className={`h-full px-6 min-w-fit transition-colors flex flex-col items-center justify-center gap-0 leading-none ${
                          isEnabled 
                            ? 'bg-green-100 hover:bg-green-600 hover:text-white text-green-700 border-green-300' 
                            : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-100 cursor-default'
                        }`}
                        disabled={!isEnabled}
                      >
                        <span className="text-sm">Engagement</span>
                        <span className="text-sm leading-none">&</span>
                        <span className="text-sm mb-1">Homework</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-bold">
                            {isEnabled ? 'Enabled' : 'Inactive'}
                          </span>
                          {hasNewActivity && (
                            <MessageSquare className="h-3.5 w-3.5" fill="currentColor" />
                          )}
                        </div>
                      </Button>
                    </div>
                  );
                })}
                
                {filteredClients.length === 0 && clients.length > 0 && (
                  <Card className="p-10 text-center">
                    <div className="flex flex-col items-center">
                      <Users className="h-10 w-10 text-muted-foreground mb-2" />
                      <CardTitle className="mb-2">No Matching Clients</CardTitle>
                      <CardDescription>
                        No clients match your current search or filter criteria.
                      </CardDescription>
                      <Button className="mt-4" variant="outline" onClick={() => {
                        setSearchTerm('');
                        setSelectedLetter('');
                      }}>
                        Clear Filters
                      </Button>
                    </div>
                  </Card>
                )}
                
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
