import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Client {
  id: string;
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
  ndisParticipantNumber?: string;
  ndisFundingType?: string;
  ndisStartDate?: string;
  ndisEndDate?: string;
  ndisAmountRemaining?: string;
  dateOfInjury: string;
  injuryType: string;
  primaryReason?: string;
  concessionType?: string;
  insurer?: string;
  lawyerSolicitor?: string;
  hasLegalIssues?: boolean;
  courtOrder?: boolean;
  detention?: boolean;
  communityService?: boolean;
  legalNotes?: string;
  invoiceTo?: string;
  emailInvoiceTo?: string;
  invoiceExtraInfo?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  emergencyContactEmail?: string;
  referralSource: string;
  referringPractitioner?: string;
  referralType?: string;
  notes: string;
}

interface EditClientDialogProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (client: Partial<Client>) => void;
}

export default function EditClientDialog({ client, open, onOpenChange, onSave }: EditClientDialogProps) {
  const [editedClient, setEditedClient] = useState<Partial<Client>>({});
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (client) {
      setEditedClient({ ...client });
    }
  }, [client]);

  const handleSave = () => {
    onSave(editedClient);
    onOpenChange(false);
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Client Profile</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="clinical">Clinical</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[50vh] mt-4 pr-4">
            <TabsContent value="personal" className="space-y-4 mt-0">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Select
                    value={editedClient.title || ''}
                    onValueChange={(value) => setEditedClient({ ...editedClient, title: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                      <SelectItem value="Ms">Ms</SelectItem>
                      <SelectItem value="Miss">Miss</SelectItem>
                      <SelectItem value="Dr">Dr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={editedClient.firstName || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={editedClient.lastName || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredFirstName">Preferred First Name</Label>
                  <Input
                    id="preferredFirstName"
                    value={editedClient.preferredFirstName || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, preferredFirstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={editedClient.dateOfBirth || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, dateOfBirth: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sex">Sex</Label>
                  <Select
                    value={editedClient.sex || ''}
                    onValueChange={(value) => setEditedClient({ ...editedClient, sex: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Intersex">Intersex</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genderIdentity">Gender Identity</Label>
                  <Input
                    id="genderIdentity"
                    value={editedClient.genderIdentity || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, genderIdentity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pronouns">Pronouns</Label>
                  <Input
                    id="pronouns"
                    value={editedClient.pronouns || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, pronouns: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="culturalIdentity">Cultural Identity / Language</Label>
                <Input
                  id="culturalIdentity"
                  value={editedClient.culturalIdentity || ''}
                  onChange={(e) => setEditedClient({ ...editedClient, culturalIdentity: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedClient.email || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobilePhone">Mobile Phone</Label>
                  <Input
                    id="mobilePhone"
                    value={editedClient.mobilePhone || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, mobilePhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternatePhone">Alternate Phone</Label>
                <Input
                  id="alternatePhone"
                  value={editedClient.alternatePhone || ''}
                  onChange={(e) => setEditedClient({ ...editedClient, alternatePhone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  value={editedClient.addressLine1 || ''}
                  onChange={(e) => setEditedClient({ ...editedClient, addressLine1: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  value={editedClient.addressLine2 || ''}
                  onChange={(e) => setEditedClient({ ...editedClient, addressLine2: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="suburb">Suburb</Label>
                  <Input
                    id="suburb"
                    value={editedClient.suburb || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, suburb: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={editedClient.state || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, state: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    value={editedClient.postcode || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, postcode: e.target.value })}
                  />
                </div>
              </div>

              <h4 className="font-medium pt-4">Emergency Contact</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Name</Label>
                  <Input
                    id="emergencyContactName"
                    value={editedClient.emergencyContactName || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, emergencyContactName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                  <Input
                    id="emergencyContactRelationship"
                    value={editedClient.emergencyContactRelationship || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, emergencyContactRelationship: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Phone</Label>
                  <Input
                    id="emergencyContactPhone"
                    value={editedClient.emergencyContactPhone || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, emergencyContactPhone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactEmail">Email</Label>
                  <Input
                    id="emergencyContactEmail"
                    value={editedClient.emergencyContactEmail || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, emergencyContactEmail: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="clinical" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfInjury">Date of Injury/Incident</Label>
                  <Input
                    id="dateOfInjury"
                    type="date"
                    value={editedClient.dateOfInjury || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, dateOfInjury: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="concessionType">Concession Type</Label>
                  <Input
                    id="concessionType"
                    value={editedClient.concessionType || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, concessionType: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryReason">Primary Reason for Service</Label>
                <Textarea
                  id="primaryReason"
                  value={editedClient.primaryReason || ''}
                  onChange={(e) => setEditedClient({ ...editedClient, primaryReason: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insurer">Insurer</Label>
                  <Input
                    id="insurer"
                    value={editedClient.insurer || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, insurer: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lawyerSolicitor">Lawyer/Solicitor</Label>
                  <Input
                    id="lawyerSolicitor"
                    value={editedClient.lawyerSolicitor || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, lawyerSolicitor: e.target.value })}
                  />
                </div>
              </div>

              <h4 className="font-medium pt-4">NDIS Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ndisParticipantNumber">Participant Number</Label>
                  <Input
                    id="ndisParticipantNumber"
                    value={editedClient.ndisParticipantNumber || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, ndisParticipantNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ndisFundingType">Funding Type</Label>
                  <Input
                    id="ndisFundingType"
                    value={editedClient.ndisFundingType || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, ndisFundingType: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ndisStartDate">Plan Start Date</Label>
                  <Input
                    id="ndisStartDate"
                    type="date"
                    value={editedClient.ndisStartDate || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, ndisStartDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ndisEndDate">Plan End Date</Label>
                  <Input
                    id="ndisEndDate"
                    type="date"
                    value={editedClient.ndisEndDate || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, ndisEndDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Clinical Notes</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  value={editedClient.notes || ''}
                  onChange={(e) => setEditedClient({ ...editedClient, notes: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="other" className="space-y-4 mt-0">
              <h4 className="font-medium">Legal Issues</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasLegalIssues"
                  checked={editedClient.hasLegalIssues || false}
                  onCheckedChange={(checked) => setEditedClient({ ...editedClient, hasLegalIssues: !!checked })}
                />
                <Label htmlFor="hasLegalIssues">Has Legal Issues</Label>
              </div>

              {editedClient.hasLegalIssues && (
                <div className="space-y-4 pl-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="courtOrder"
                        checked={editedClient.courtOrder || false}
                        onCheckedChange={(checked) => setEditedClient({ ...editedClient, courtOrder: !!checked })}
                      />
                      <Label htmlFor="courtOrder">Court Order</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="detention"
                        checked={editedClient.detention || false}
                        onCheckedChange={(checked) => setEditedClient({ ...editedClient, detention: !!checked })}
                      />
                      <Label htmlFor="detention">Detention</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="communityService"
                        checked={editedClient.communityService || false}
                        onCheckedChange={(checked) => setEditedClient({ ...editedClient, communityService: !!checked })}
                      />
                      <Label htmlFor="communityService">Community Service</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="legalNotes">Legal Notes</Label>
                    <Textarea
                      id="legalNotes"
                      value={editedClient.legalNotes || ''}
                      onChange={(e) => setEditedClient({ ...editedClient, legalNotes: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <h4 className="font-medium pt-4">Billing Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceTo">Invoice To</Label>
                  <Input
                    id="invoiceTo"
                    value={editedClient.invoiceTo || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, invoiceTo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailInvoiceTo">Email Invoice To</Label>
                  <Input
                    id="emailInvoiceTo"
                    type="email"
                    value={editedClient.emailInvoiceTo || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, emailInvoiceTo: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceExtraInfo">Additional Invoice Info</Label>
                <Textarea
                  id="invoiceExtraInfo"
                  value={editedClient.invoiceExtraInfo || ''}
                  onChange={(e) => setEditedClient({ ...editedClient, invoiceExtraInfo: e.target.value })}
                />
              </div>

              <h4 className="font-medium pt-4">Referral Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="referringPractitioner">Referring Practitioner</Label>
                  <Input
                    id="referringPractitioner"
                    value={editedClient.referringPractitioner || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, referringPractitioner: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referralType">Referral Type</Label>
                  <Input
                    id="referralType"
                    value={editedClient.referralType || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, referralType: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="referralSource">Referral Source</Label>
                <Input
                  id="referralSource"
                  value={editedClient.referralSource || ''}
                  onChange={(e) => setEditedClient({ ...editedClient, referralSource: e.target.value })}
                />
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
