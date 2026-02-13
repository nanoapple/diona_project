
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Users, User, FileText, ClipboardCheck, FileCheck, File, Search, ClipboardList, Brain, MessageSquare as MessageSquareIcon, BookOpen, Mail, Smartphone } from 'lucide-react';
import newMessageIcon from '@/assets/new-message-icon.png';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import AddClientDialog from '@/components/clients/AddClientDialog';
import EditClientDialog from '@/components/clients/EditClientDialog';
import { useTheme } from '@/components/ThemeProvider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useClients, Client as DBClient } from '@/hooks/useClients';

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
  const { clients: dbClients, isLoading, updateClient } = useClients();
  
  // Convert DB clients to UI clients format
  const clients: Client[] = dbClients.map((dbClient) => ({
    id: dbClient.id,
    title: dbClient.title,
    firstName: dbClient.first_name,
    lastName: dbClient.last_name,
    name: `${dbClient.first_name} ${dbClient.last_name}`,
    preferredFirstName: dbClient.preferred_first_name,
    dateOfBirth: dbClient.date_of_birth,
    sex: dbClient.sex,
    genderIdentity: dbClient.gender_identity,
    pronouns: dbClient.pronouns,
    culturalIdentity: dbClient.cultural_identity,
    email: dbClient.email || '',
    phone: dbClient.mobile_phone,
    mobilePhone: dbClient.mobile_phone,
    alternatePhone: dbClient.alternate_phone,
    address: `${dbClient.address_line1}${dbClient.address_line2 ? ', ' + dbClient.address_line2 : ''}${dbClient.suburb ? ', ' + dbClient.suburb : ''} ${dbClient.state || ''} ${dbClient.postcode || ''}`,
    addressLine1: dbClient.address_line1,
    addressLine2: dbClient.address_line2,
    suburb: dbClient.suburb,
    state: dbClient.state,
    postcode: dbClient.postcode,
    country: dbClient.country,
    timeZone: dbClient.time_zone,
    appointmentReminders: dbClient.communication_preferences?.appointmentReminders || [],
    marketingMessages: dbClient.communication_preferences?.marketingMessages || false,
    ndisParticipantNumber: dbClient.ndis_participant_number,
    ndisFundingType: dbClient.ndis_funding_type,
    ndisStartDate: dbClient.ndis_start_date,
    ndisEndDate: dbClient.ndis_end_date,
    ndisAmountRemaining: dbClient.ndis_amount_remaining,
    dateOfInjury: dbClient.date_of_injury || '',
    injuryType: dbClient.injury_type || dbClient.primary_reason || '',
    primaryReason: dbClient.primary_reason,
    concessionType: dbClient.concession_type,
    insurer: dbClient.insurer,
    lawyerSolicitor: dbClient.lawyer_solicitor,
    hasLegalIssues: dbClient.has_legal_issues,
    courtOrder: dbClient.legal_details?.courtOrder,
    detention: dbClient.legal_details?.detention,
    communityService: dbClient.legal_details?.communityService,
    legalNotes: dbClient.legal_details?.notes,
    invoiceTo: dbClient.billing_details?.invoiceTo,
    emailInvoiceTo: dbClient.billing_details?.emailInvoiceTo,
    invoiceExtraInfo: dbClient.billing_details?.extraInfo,
    emergencyContactName: dbClient.emergency_contact?.name,
    emergencyContactRelationship: dbClient.emergency_contact?.relationship,
    emergencyContactPhone: dbClient.emergency_contact?.phone,
    emergencyContactEmail: dbClient.emergency_contact?.email,
    referralSource: dbClient.referral_details?.source || '',
    referringPractitioner: dbClient.referral_details?.referringPractitioner,
    referralType: dbClient.referral_details?.referralType,
    notes: dbClient.notes || '',
    assessments: [],
    interviews: [],
    documents: [],
  }));
  
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedClient, setEditedClient] = useState<Partial<Client>>({});
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [orderBy, setOrderBy] = useState<'firstName' | 'surname'>('firstName');
  const [isEngagementDialogOpen, setIsEngagementDialogOpen] = useState(false);
  const [engagementClient, setEngagementClient] = useState<Client | null>(null);
  const [smsMessage, setSmsMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  const handleSelectClient = (client: Client) => {
    setActiveClient(client);
    setEditedClient({...client});
    setActiveTab('profile');
  };

  const handleEditToggle = () => {
    setIsEditDialogOpen(true);
  };

  const handleSaveClient = async (editedData: Partial<Client>) => {
    if (activeClient) {
      try {
        // Map camelCase form data to snake_case DB columns
        const dbData: Record<string, any> = {};
        const keyMap: Record<string, string> = {
          firstName: 'first_name',
          lastName: 'last_name',
          preferredFirstName: 'preferred_first_name',
          dateOfBirth: 'date_of_birth',
          genderIdentity: 'gender_identity',
          culturalIdentity: 'cultural_identity',
          mobilePhone: 'mobile_phone',
          alternatePhone: 'alternate_phone',
          addressLine1: 'address_line1',
          addressLine2: 'address_line2',
          timeZone: 'time_zone',
          ndisParticipantNumber: 'ndis_participant_number',
          ndisFundingType: 'ndis_funding_type',
          ndisStartDate: 'ndis_start_date',
          ndisEndDate: 'ndis_end_date',
          ndisAmountRemaining: 'ndis_amount_remaining',
          dateOfInjury: 'date_of_injury',
          injuryType: 'injury_type',
          primaryReason: 'primary_reason',
          concessionType: 'concession_type',
          lawyerSolicitor: 'lawyer_solicitor',
          hasLegalIssues: 'has_legal_issues',
          legalDetails: 'legal_details',
          billingDetails: 'billing_details',
          emergencyContact: 'emergency_contact',
          referralDetails: 'referral_details',
          communicationPreferences: 'communication_preferences',
          engagementEnabled: 'engagement_enabled',
        };

        for (const [key, value] of Object.entries(editedData)) {
          if (key === 'id' || key === 'name' || key === 'address' || key === 'phone') continue;
          const dbKey = keyMap[key] || key;
          dbData[dbKey] = value;
        }

        await updateClient({
          id: activeClient.id,
          ...dbData,
        } as any);
        setActiveClient({ ...activeClient, ...editedData } as Client);
      } catch (error) {
        console.error('Error updating client:', error);
      }
    }
  };

  const handleCreateClient = () => {
    // Client is created via the hook, just close the dialog
    // The hook will automatically refetch and update the list
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
                Edit Profile
              </Button>
            </div>
          </div>

          <EditClientDialog
            client={activeClient}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSave={handleSaveClient}
          />

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
                        className={`h-full px-6 w-44 transition-colors flex flex-col items-center justify-center gap-0 leading-none relative ${
                          isEnabled 
                            ? 'bg-green-100 hover:bg-green-600 hover:text-white text-green-700 border-green-300' 
                            : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
                        }`}
                        onClick={() => {
                          if (isEnabled) {
                            setEngagementClient(client);
                            setIsEngagementDialogOpen(true);
                          }
                        }}
                      >
                        <span className="text-sm">Engagement</span>
                        <span className="text-sm leading-none">&</span>
                        <span className="text-sm">Homework</span>
                        <div className={`flex items-center gap-1.5 mt-3 px-3 py-1 rounded ${
                          isEnabled 
                            ? 'bg-green-700 text-white' 
                            : 'bg-gray-600 text-white'
                        }`}>
                          <span className="text-xs font-bold">
                            {isEnabled ? 'Enabled' : 'Click to enable'}
                          </span>
                        </div>
                        {hasNewActivity && (
                          <img src={newMessageIcon} alt="New message" className="h-6 w-6 absolute right-2 bottom-2" />
                        )}
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
      
      {/* Engagement & Homework Dialog */}
      <Dialog open={isEngagementDialogOpen} onOpenChange={setIsEngagementDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Engagement & Homework - {engagementClient?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* 2x2 Grid of Client Sections */}
            <div className="grid grid-cols-2 gap-4">
              {/* Tasks & Reflections */}
              <Button 
                variant="outline" 
                className="h-24 bg-violet-500 hover:bg-violet-600 text-white border-violet-600 flex items-center justify-center gap-3 text-lg font-semibold"
              >
                <ClipboardList className="h-6 w-6" />
                Tasks & Reflections
              </Button>
              
              {/* Mood Tracker */}
              <Button 
                variant="outline" 
                className="h-24 bg-pink-500 hover:bg-pink-600 text-white border-pink-600 flex items-center justify-center gap-3 text-lg font-semibold"
              >
                <Brain className="h-6 w-6" />
                Mood Tracker
              </Button>
              
              {/* Messages */}
              <Button 
                variant="outline" 
                className="h-24 bg-amber-500 hover:bg-amber-600 text-white border-amber-600 flex items-center justify-center gap-3 text-lg font-semibold"
              >
                <MessageSquareIcon className="h-6 w-6" />
                Messages
              </Button>
              
              {/* Resources */}
              <Button 
                variant="outline" 
                className="h-24 bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-600 flex items-center justify-center gap-3 text-lg font-semibold"
              >
                <BookOpen className="h-6 w-6" />
                Resources
              </Button>
            </div>
            
            {/* SMS and Email Input Boxes */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sms-message" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Send SMS
                </Label>
                <Textarea
                  id="sms-message"
                  placeholder="Type your SMS message here..."
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  rows={3}
                />
                <Button className="w-full" onClick={() => {
                  toast({
                    title: "SMS Sent",
                    description: `Message sent to ${engagementClient?.name}`,
                  });
                  setSmsMessage('');
                }}>
                  Send SMS
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-message" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Send Email
                </Label>
                <Textarea
                  id="email-message"
                  placeholder="Type your email message here..."
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={3}
                />
                <Button className="w-full" onClick={() => {
                  toast({
                    title: "Email Sent",
                    description: `Email sent to ${engagementClient?.name}`,
                  });
                  setEmailMessage('');
                }}>
                  Send Email
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
