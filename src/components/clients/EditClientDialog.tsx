import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const clientSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, 'First name is required').max(100, 'Max 100 characters'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Max 100 characters'),
  preferredFirstName: z.string().max(100, 'Max 100 characters').optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  sex: z.string().min(1, 'Sex is required'),
  genderIdentity: z.string().max(100, 'Max 100 characters').optional(),
  pronouns: z.string().max(50, 'Max 50 characters').optional(),
  culturalIdentity: z.string().max(200, 'Max 200 characters').optional(),
  email: z.string().email('Invalid email address').max(255, 'Max 255 characters').or(z.literal('')).optional(),
  mobilePhone: z.string().min(1, 'Mobile phone is required').max(20, 'Max 20 characters'),
  alternatePhone: z.string().max(20, 'Max 20 characters').optional(),
  addressLine1: z.string().min(1, 'Address is required').max(200, 'Max 200 characters'),
  addressLine2: z.string().max(200, 'Max 200 characters').optional(),
  suburb: z.string().max(100, 'Max 100 characters').optional(),
  state: z.string().max(50, 'Max 50 characters').optional(),
  postcode: z.string().max(10, 'Max 10 characters').optional(),
  emergencyContactName: z.string().max(100, 'Max 100 characters').optional(),
  emergencyContactRelationship: z.string().max(100, 'Max 100 characters').optional(),
  emergencyContactPhone: z.string().max(20, 'Max 20 characters').optional(),
  emergencyContactEmail: z.string().email('Invalid email').max(255).or(z.literal('')).optional(),
  dateOfInjury: z.string().optional(),
  primaryReason: z.string().max(500, 'Max 500 characters').optional(),
  concessionType: z.string().max(100, 'Max 100 characters').optional(),
  insurer: z.string().max(200, 'Max 200 characters').optional(),
  lawyerSolicitor: z.string().max(200, 'Max 200 characters').optional(),
  ndisParticipantNumber: z.string().max(50, 'Max 50 characters').optional(),
  ndisFundingType: z.string().max(100, 'Max 100 characters').optional(),
  ndisStartDate: z.string().optional(),
  ndisEndDate: z.string().optional(),
  notes: z.string().max(2000, 'Max 2000 characters').optional(),
  hasLegalIssues: z.boolean().optional(),
  courtOrder: z.boolean().optional(),
  detention: z.boolean().optional(),
  communityService: z.boolean().optional(),
  legalNotes: z.string().max(1000, 'Max 1000 characters').optional(),
  invoiceTo: z.string().max(200, 'Max 200 characters').optional(),
  emailInvoiceTo: z.string().email('Invalid email').max(255).or(z.literal('')).optional(),
  invoiceExtraInfo: z.string().max(500, 'Max 500 characters').optional(),
  referringPractitioner: z.string().max(200, 'Max 200 characters').optional(),
  referralType: z.string().max(100, 'Max 100 characters').optional(),
  referralSource: z.string().max(200, 'Max 200 characters').optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

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

const RequiredIndicator = () => <span className="text-destructive ml-1">*</span>;

export default function EditClientDialog({ client, open, onOpenChange, onSave }: EditClientDialogProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      title: '',
      firstName: '',
      lastName: '',
      preferredFirstName: '',
      dateOfBirth: '',
      sex: '',
      genderIdentity: '',
      pronouns: '',
      culturalIdentity: '',
      email: '',
      mobilePhone: '',
      alternatePhone: '',
      addressLine1: '',
      addressLine2: '',
      suburb: '',
      state: '',
      postcode: '',
      emergencyContactName: '',
      emergencyContactRelationship: '',
      emergencyContactPhone: '',
      emergencyContactEmail: '',
      dateOfInjury: '',
      primaryReason: '',
      concessionType: '',
      insurer: '',
      lawyerSolicitor: '',
      ndisParticipantNumber: '',
      ndisFundingType: '',
      ndisStartDate: '',
      ndisEndDate: '',
      notes: '',
      hasLegalIssues: false,
      courtOrder: false,
      detention: false,
      communityService: false,
      legalNotes: '',
      invoiceTo: '',
      emailInvoiceTo: '',
      invoiceExtraInfo: '',
      referringPractitioner: '',
      referralType: '',
      referralSource: '',
    },
  });

  useEffect(() => {
    if (client && open) {
      form.reset({
        title: client.title || '',
        firstName: client.firstName || client.name?.split(' ')[0] || '',
        lastName: client.lastName || client.name?.split(' ')[1] || '',
        preferredFirstName: client.preferredFirstName || '',
        dateOfBirth: client.dateOfBirth || '',
        sex: client.sex || '',
        genderIdentity: client.genderIdentity || '',
        pronouns: client.pronouns || '',
        culturalIdentity: client.culturalIdentity || '',
        email: client.email || '',
        mobilePhone: client.mobilePhone || client.phone || '',
        alternatePhone: client.alternatePhone || '',
        addressLine1: client.addressLine1 || '',
        addressLine2: client.addressLine2 || '',
        suburb: client.suburb || '',
        state: client.state || '',
        postcode: client.postcode || '',
        emergencyContactName: client.emergencyContactName || '',
        emergencyContactRelationship: client.emergencyContactRelationship || '',
        emergencyContactPhone: client.emergencyContactPhone || '',
        emergencyContactEmail: client.emergencyContactEmail || '',
        dateOfInjury: client.dateOfInjury || '',
        primaryReason: client.primaryReason || '',
        concessionType: client.concessionType || '',
        insurer: client.insurer || '',
        lawyerSolicitor: client.lawyerSolicitor || '',
        ndisParticipantNumber: client.ndisParticipantNumber || '',
        ndisFundingType: client.ndisFundingType || '',
        ndisStartDate: client.ndisStartDate || '',
        ndisEndDate: client.ndisEndDate || '',
        notes: client.notes || '',
        hasLegalIssues: client.hasLegalIssues || false,
        courtOrder: client.courtOrder || false,
        detention: client.detention || false,
        communityService: client.communityService || false,
        legalNotes: client.legalNotes || '',
        invoiceTo: client.invoiceTo || '',
        emailInvoiceTo: client.emailInvoiceTo || '',
        invoiceExtraInfo: client.invoiceExtraInfo || '',
        referringPractitioner: client.referringPractitioner || '',
        referralType: client.referralType || '',
        referralSource: client.referralSource || '',
      });
    }
  }, [client, open, form]);

  const handleSubmit = (data: ClientFormData) => {
    onSave(data);
    onOpenChange(false);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen && form.formState.isDirty) {
      setShowConfirmDialog(true);
    } else {
      onOpenChange(isOpen);
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    form.reset();
    onOpenChange(false);
  };

  if (!client) return null;

  const hasLegalIssues = form.watch('hasLegalIssues');


  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Client Profile</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="clinical">Clinical</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[50vh] mt-4 pr-4">
                <TabsContent value="personal" className="space-y-4 mt-0">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select title" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mr">Mr</SelectItem>
                              <SelectItem value="Mrs">Mrs</SelectItem>
                              <SelectItem value="Ms">Ms</SelectItem>
                              <SelectItem value="Miss">Miss</SelectItem>
                              <SelectItem value="Dr">Dr</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name<RequiredIndicator /></FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name<RequiredIndicator /></FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="preferredFirstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth<RequiredIndicator /></FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="sex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sex<RequiredIndicator /></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select sex" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Intersex">Intersex</SelectItem>
                              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="genderIdentity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender Identity</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pronouns"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pronouns</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="culturalIdentity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cultural Identity / Language</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="contact" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mobilePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Phone<RequiredIndicator /></FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="alternatePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternate Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1<RequiredIndicator /></FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="suburb"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Suburb</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postcode</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <h4 className="font-medium pt-4">Emergency Contact</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="emergencyContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergencyContactRelationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergencyContactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergencyContactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="clinical" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dateOfInjury"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Injury/Incident</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="concessionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Concession Type</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="primaryReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Reason for Service</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="insurer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurer</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lawyerSolicitor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lawyer/Solicitor</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <h4 className="font-medium pt-4">NDIS Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ndisParticipantNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Participant Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ndisFundingType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Funding Type</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ndisStartDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plan Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ndisEndDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plan End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clinical Notes</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="other" className="space-y-4 mt-0">
                  <h4 className="font-medium">Legal Issues</h4>
                  <FormField
                    control={form.control}
                    name="hasLegalIssues"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Has Legal Issues</FormLabel>
                      </FormItem>
                    )}
                  />

                  {hasLegalIssues && (
                    <div className="space-y-4 pl-6">
                      <div className="flex flex-wrap gap-4">
                        <FormField
                          control={form.control}
                          name="courtOrder"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Court Order</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="detention"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Detention</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="communityService"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Community Service</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="legalNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Legal Notes</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <h4 className="font-medium pt-4">Billing Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="invoiceTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice To</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emailInvoiceTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Invoice To</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="invoiceExtraInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Invoice Info</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <h4 className="font-medium pt-4">Referral Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="referringPractitioner"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Referring Practitioner</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="referralType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Referral Type</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="referralSource"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referral Source</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </ScrollArea>
            </Tabs>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

    <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. Are you sure you want to close without saving?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continue Editing</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmClose}>Discard Changes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
