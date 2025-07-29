import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarIcon, ChevronDown, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ClientFormData {
  // Personal Details
  title: string;
  firstName: string;
  lastName: string;
  preferredFirstName: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  sex: string;
  genderIdentity: string;
  pronouns: string;
  customPronouns: string;
  culturalIdentity: string;
  ndisNumber: string;

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
  bookingConfirmationEmails: boolean;
  bookingCancellationEmails: boolean;

  // Consent & Privacy
  privacyPolicyConsent: boolean;
  shareDataWithTeam: boolean;
  emergencyConsentNotes: string;

  // Clinical & Case Info
  dateOfInjury: Date | undefined;
  primaryReason: string;
  appointmentNotes: string;
  concessionType: string;
  openingBalance: string;

  // Billing & Invoicing
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
}

interface AddClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated: (client: any) => void;
}

const DRAFT_KEY = 'addClientDraft';

export function AddClientDialog({ isOpen, onOpenChange, onClientCreated }: AddClientDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ClientFormData>({
    title: '',
    firstName: '',
    lastName: '',
    preferredFirstName: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    sex: '',
    genderIdentity: '',
    pronouns: '',
    customPronouns: '',
    culturalIdentity: '',
    ndisNumber: '',
    email: '',
    mobilePhone: '',
    alternatePhone: '',
    addressLine1: '',
    addressLine2: '',
    suburb: '',
    state: '',
    postcode: '',
    country: 'Australia',
    timeZone: 'Australia/Sydney',
    appointmentReminders: [],
    marketingMessages: false,
    bookingConfirmationEmails: true,
    bookingCancellationEmails: true,
    privacyPolicyConsent: false,
    shareDataWithTeam: true,
    emergencyConsentNotes: '',
    dateOfInjury: undefined,
    primaryReason: '',
    appointmentNotes: '',
    concessionType: 'None',
    openingBalance: '0.00',
    invoiceTo: '',
    emailInvoiceTo: '',
    invoiceExtraInfo: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    referringPractitioner: '',
    referralType: '',
    referralSource: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emergencyContactOpen, setEmergencyContactOpen] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData({ ...formData, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved draft:', error);
      }
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  // Clear draft after 24 hours
  useEffect(() => {
    const now = Date.now();
    const lastSaved = localStorage.getItem(`${DRAFT_KEY}_timestamp`);
    if (lastSaved && now - parseInt(lastSaved) > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(`${DRAFT_KEY}_timestamp`);
    } else {
      localStorage.setItem(`${DRAFT_KEY}_timestamp`, now.toString());
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.birthDay || !formData.birthMonth || !formData.birthYear) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!formData.sex) {
      newErrors.sex = 'Sex is required';
    }
    if (!formData.mobilePhone.trim()) {
      newErrors.mobilePhone = 'Mobile phone is required';
    }
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }
    if (!formData.privacyPolicyConsent) {
      newErrors.privacyPolicyConsent = 'Privacy policy consent is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newClient = {
      id: Date.now().toString(),
      name: `${formData.firstName} ${formData.lastName}`,
      preferredName: formData.preferredFirstName,
      dateOfBirth: formData.birthDay && formData.birthMonth && formData.birthYear 
        ? `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`
        : '',
      email: formData.email,
      phone: formData.mobilePhone,
      address: `${formData.addressLine1}${formData.addressLine2 ? ', ' + formData.addressLine2 : ''}, ${formData.suburb} ${formData.state} ${formData.postcode}`,
      dateOfInjury: formData.dateOfInjury?.toISOString().split('T')[0],
      injuryType: formData.primaryReason,
      referralSource: formData.referralSource,
      notes: formData.appointmentNotes,
      assessments: [],
      interviews: [],
      documents: [],
      ...formData
    };

    onClientCreated(newClient);
    
    // Clear form and draft
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(`${DRAFT_KEY}_timestamp`);
    
    toast({
      title: "Client record created",
      description: "New client has been added successfully"
    });

    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const updateField = (field: keyof ClientFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateReminderPreference = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      appointmentReminders: checked 
        ? [...prev.appointmentReminders, type]
        : prev.appointmentReminders.filter(item => item !== type)
    }));
  };

  const DatePicker = ({ value, onChange, placeholder, error }: { 
    value: Date | undefined; 
    onChange: (date: Date | undefined) => void; 
    placeholder: string;
    error?: string;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            error && "border-destructive"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );

  const isFormValid = formData.firstName.trim() && 
                      formData.lastName.trim() && 
                      formData.birthDay && formData.birthMonth && formData.birthYear && 
                      formData.sex && 
                      formData.mobilePhone.trim() && 
                      formData.addressLine1.trim() && 
                      formData.privacyPolicyConsent;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Create a comprehensive client record with all relevant information
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <div className="space-y-8">
            {/* Personal Details */}
            <section className="space-y-4 border-b border-border pb-6">
              <h3 className="text-lg font-semibold text-slate-700">Personal Details</h3>
              
              {/* Top row: Title, First name, Last name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Title</Label>
                  <Select value={formData.title} onValueChange={(value) => updateField('title', value)}>
                    <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-primary">
                      <SelectValue placeholder="Select title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mr">Mr</SelectItem>
                      <SelectItem value="mrs">Mrs</SelectItem>
                      <SelectItem value="ms">Ms</SelectItem>
                      <SelectItem value="miss">Miss</SelectItem>
                      <SelectItem value="dr">Dr</SelectItem>
                      <SelectItem value="prof">Prof</SelectItem>
                      <SelectItem value="mx">Mx</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700">
                    First name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    className={cn(
                      "focus-visible:ring-2 focus-visible:ring-primary",
                      errors.firstName && "border-destructive"
                    )}
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  />
                  {errors.firstName && (
                    <p id="firstName-error" className="text-sm text-destructive">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold text-slate-700">
                    Last name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    className={cn(
                      "focus-visible:ring-2 focus-visible:ring-primary",
                      errors.lastName && "border-destructive"
                    )}
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  />
                  {errors.lastName && (
                    <p id="lastName-error" className="text-sm text-destructive">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Preferred first name - full width */}
              <div className="space-y-2">
                <Label htmlFor="preferredFirstName" className="text-sm font-semibold text-slate-700">Preferred first name</Label>
                <Input
                  id="preferredFirstName"
                  value={formData.preferredFirstName}
                  onChange={(e) => updateField('preferredFirstName', e.target.value)}
                  className="focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Date of birth <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Select value={formData.birthDay} onValueChange={(value) => updateField('birthDay', value)}>
                      <SelectTrigger className={cn(errors.dateOfBirth && "border-destructive")}>
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={formData.birthMonth} onValueChange={(value) => updateField('birthMonth', value)}>
                      <SelectTrigger className={cn(errors.dateOfBirth && "border-destructive")}>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">January</SelectItem>
                        <SelectItem value="2">February</SelectItem>
                        <SelectItem value="3">March</SelectItem>
                        <SelectItem value="4">April</SelectItem>
                        <SelectItem value="5">May</SelectItem>
                        <SelectItem value="6">June</SelectItem>
                        <SelectItem value="7">July</SelectItem>
                        <SelectItem value="8">August</SelectItem>
                        <SelectItem value="9">September</SelectItem>
                        <SelectItem value="10">October</SelectItem>
                        <SelectItem value="11">November</SelectItem>
                        <SelectItem value="12">December</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={formData.birthYear} onValueChange={(value) => updateField('birthYear', value)}>
                      <SelectTrigger className={cn(errors.dateOfBirth && "border-destructive")}>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 100 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.dateOfBirth && (
                    <p className="text-sm text-destructive">{errors.dateOfBirth}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Sex <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.sex} onValueChange={(value) => updateField('sex', value)}>
                    <SelectTrigger className={cn(errors.sex && "border-destructive")}>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                      <SelectItem value="X">Non-binary</SelectItem>
                      <SelectItem value="Intersex">Intersex</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.sex && (
                    <p className="text-sm text-destructive">{errors.sex}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genderIdentity">Gender Identity</Label>
                  <Input
                    id="genderIdentity"
                    value={formData.genderIdentity}
                    onChange={(e) => updateField('genderIdentity', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Pronouns</Label>
                  <RadioGroup
                    value={formData.pronouns}
                    onValueChange={(value) => updateField('pronouns', value)}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="she/her" id="she-her" />
                      <Label htmlFor="she-her">she/her</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="he/him" id="he-him" />
                      <Label htmlFor="he-him">he/him</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="they/them" id="they-them" />
                      <Label htmlFor="they-them">they/them</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom-pronouns" />
                      <Label htmlFor="custom-pronouns">custom</Label>
                    </div>
                  </RadioGroup>
                  {formData.pronouns === 'custom' && (
                    <Input
                      placeholder="Enter custom pronouns"
                      value={formData.customPronouns}
                      onChange={(e) => updateField('customPronouns', e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="culturalIdentity">Cultural Identity / Language</Label>
                  <Input
                    id="culturalIdentity"
                    value={formData.culturalIdentity}
                    onChange={(e) => updateField('culturalIdentity', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ndisNumber">NDIS Number</Label>
                  <Input
                    id="ndisNumber"
                    value={formData.ndisNumber}
                    onChange={(e) => updateField('ndisNumber', e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="space-y-4 border-b border-border pb-6">
              <h3 className="text-lg font-semibold text-slate-700">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobilePhone" className="text-sm font-semibold text-slate-700">
                    Mobile Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="mobilePhone"
                    value={formData.mobilePhone}
                    onChange={(e) => updateField('mobilePhone', e.target.value)}
                    className={cn(errors.mobilePhone && "border-destructive")}
                  />
                  {errors.mobilePhone && (
                    <p className="text-sm text-destructive">{errors.mobilePhone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alternatePhone">Alternate Phone</Label>
                  <Input
                    id="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={(e) => updateField('alternatePhone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine1" className="text-sm font-semibold text-slate-700">
                    Address Line 1 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="addressLine1"
                    value={formData.addressLine1}
                    onChange={(e) => updateField('addressLine1', e.target.value)}
                    className={cn(errors.addressLine1 && "border-destructive")}
                  />
                  {errors.addressLine1 && (
                    <p className="text-sm text-destructive">{errors.addressLine1}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    value={formData.addressLine2}
                    onChange={(e) => updateField('addressLine2', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suburb">Suburb</Label>
                  <Input
                    id="suburb"
                    value={formData.suburb}
                    onChange={(e) => updateField('suburb', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select value={formData.state} onValueChange={(value) => updateField('state', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NSW">NSW</SelectItem>
                      <SelectItem value="VIC">VIC</SelectItem>
                      <SelectItem value="QLD">QLD</SelectItem>
                      <SelectItem value="SA">SA</SelectItem>
                      <SelectItem value="WA">WA</SelectItem>
                      <SelectItem value="TAS">TAS</SelectItem>
                      <SelectItem value="NT">NT</SelectItem>
                      <SelectItem value="ACT">ACT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    value={formData.postcode}
                    onChange={(e) => updateField('postcode', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <Select value={formData.timeZone} onValueChange={(value) => updateField('timeZone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Australia/Sydney">Australia/Sydney</SelectItem>
                      <SelectItem value="Australia/Melbourne">Australia/Melbourne</SelectItem>
                      <SelectItem value="Australia/Brisbane">Australia/Brisbane</SelectItem>
                      <SelectItem value="Australia/Adelaide">Australia/Adelaide</SelectItem>
                      <SelectItem value="Australia/Perth">Australia/Perth</SelectItem>
                      <SelectItem value="Australia/Darwin">Australia/Darwin</SelectItem>
                      <SelectItem value="Australia/Hobart">Australia/Hobart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Communication Preferences */}
            <section className="space-y-4 border-b border-border pb-6">
              <h3 className="text-lg font-semibold text-slate-700">Communication Preferences</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Appointment Reminders</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sms-reminders"
                        checked={formData.appointmentReminders.includes('SMS')}
                        onCheckedChange={(checked) => updateReminderPreference('SMS', checked as boolean)}
                      />
                      <Label htmlFor="sms-reminders">SMS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="email-reminders"
                        checked={formData.appointmentReminders.includes('Email')}
                        onCheckedChange={(checked) => updateReminderPreference('Email', checked as boolean)}
                      />
                      <Label htmlFor="email-reminders">Email</Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketing-messages"
                    checked={formData.marketingMessages}
                    onCheckedChange={(checked) => updateField('marketingMessages', checked)}
                  />
                  <Label htmlFor="marketing-messages">Marketing Messages (opt-in)</Label>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="booking-confirmation">Booking Confirmation Emails</Label>
                  <Switch
                    id="booking-confirmation"
                    checked={formData.bookingConfirmationEmails}
                    onCheckedChange={(checked) => updateField('bookingConfirmationEmails', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="booking-cancellation">Booking Cancellation Emails</Label>
                  <Switch
                    id="booking-cancellation"
                    checked={formData.bookingCancellationEmails}
                    onCheckedChange={(checked) => updateField('bookingCancellationEmails', checked)}
                  />
                </div>
              </div>
            </section>

            {/* Consent & Privacy */}
            <section className="space-y-4 border-b border-border pb-6">
              <h3 className="text-lg font-semibold text-slate-700">Consent & Privacy</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="privacy-consent"
                    checked={formData.privacyPolicyConsent}
                    onCheckedChange={(checked) => updateField('privacyPolicyConsent', checked)}
                    className={cn(errors.privacyPolicyConsent && "border-destructive")}
                  />
                  <Label htmlFor="privacy-consent" className="text-sm font-semibold text-slate-700">
                    Privacy Policy Consent <span className="text-destructive">*</span>
                  </Label>
                </div>
                {errors.privacyPolicyConsent && (
                  <p className="text-sm text-destructive">{errors.privacyPolicyConsent}</p>
                )}

                <div className="flex items-center justify-between">
                  <Label htmlFor="share-data">Share Data With Treating Team?</Label>
                  <Switch
                    id="share-data"
                    checked={formData.shareDataWithTeam}
                    onCheckedChange={(checked) => updateField('shareDataWithTeam', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency-consent">Emergency Consent Notes</Label>
                  <Textarea
                    id="emergency-consent"
                    value={formData.emergencyConsentNotes}
                    onChange={(e) => updateField('emergencyConsentNotes', e.target.value)}
                    rows={3}
                    placeholder="Any special emergency consent or contact instructions"
                  />
                </div>
              </div>
            </section>

            {/* Clinical & Case Info */}
            <section className="space-y-4 border-b border-border pb-6">
              <h3 className="text-lg font-semibold text-slate-700">Clinical & Case Info</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div className="space-y-2">
                  <Label>Date of Injury/Incident</Label>
                  <DatePicker
                    value={formData.dateOfInjury}
                    onChange={(date) => updateField('dateOfInjury', date)}
                    placeholder="Pick a date"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Concession / Card Type</Label>
                  <Select value={formData.concessionType} onValueChange={(value) => updateField('concessionType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Pension">Pension</SelectItem>
                      <SelectItem value="DVA">DVA</SelectItem>
                      <SelectItem value="Tertiary">Tertiary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="opening-balance">Opening Balance</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input
                      id="opening-balance"
                      value={formData.openingBalance}
                      onChange={(e) => updateField('openingBalance', e.target.value)}
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="primary-reason">Primary Reason / Presenting Issue</Label>
                  <Textarea
                    id="primary-reason"
                    value={formData.primaryReason}
                    onChange={(e) => updateField('primaryReason', e.target.value)}
                    rows={3}
                    placeholder="Describe the primary reason for treatment or presenting issue"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="appointment-notes">Appointment Notes</Label>
                  <Textarea
                    id="appointment-notes"
                    value={formData.appointmentNotes}
                    onChange={(e) => updateField('appointmentNotes', e.target.value)}
                    rows={3}
                    placeholder="Notes that will be displayed on calendar cards"
                  />
                </div>
              </div>
            </section>

            {/* Billing & Invoicing */}
            <section className="space-y-4 border-b border-border pb-6">
              <h3 className="text-lg font-semibold text-slate-700">Billing & Invoicing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div className="space-y-2">
                  <Label htmlFor="invoice-to">Invoice To</Label>
                  <Input
                    id="invoice-to"
                    value={formData.invoiceTo}
                    onChange={(e) => updateField('invoiceTo', e.target.value)}
                    placeholder="Name or organization for invoicing"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-invoice-to">Email Invoice To</Label>
                  <Input
                    id="email-invoice-to"
                    type="email"
                    value={formData.emailInvoiceTo}
                    onChange={(e) => updateField('emailInvoiceTo', e.target.value)}
                    placeholder="Email address for invoices"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="invoice-extra-info">Invoice Extra Information</Label>
                  <Input
                    id="invoice-extra-info"
                    value={formData.invoiceExtraInfo}
                    onChange={(e) => updateField('invoiceExtraInfo', e.target.value)}
                    placeholder="e.g. Claim #, Reference number"
                  />
                </div>
              </div>
            </section>

            {/* Emergency Contact */}
            <Collapsible open={emergencyContactOpen} onOpenChange={setEmergencyContactOpen}>
              <section className="space-y-4 border-b border-border pb-6">
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h3 className="text-lg font-semibold text-slate-700">Emergency Contact</h3>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    emergencyContactOpen && "rotate-180"
                  )} />
                </CollapsibleTrigger>
                
                <CollapsibleContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="emergency-name">Contact Name</Label>
                      <Input
                        id="emergency-name"
                        value={formData.emergencyContactName}
                        onChange={(e) => updateField('emergencyContactName', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergency-relationship">Relationship</Label>
                      <Input
                        id="emergency-relationship"
                        value={formData.emergencyContactRelationship}
                        onChange={(e) => updateField('emergencyContactRelationship', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergency-phone">Phone</Label>
                      <Input
                        id="emergency-phone"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => updateField('emergencyContactPhone', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergency-email">Email</Label>
                      <Input
                        id="emergency-email"
                        type="email"
                        value={formData.emergencyContactEmail}
                        onChange={(e) => updateField('emergencyContactEmail', e.target.value)}
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </section>
            </Collapsible>

            {/* Referral */}
            <Collapsible open={referralOpen} onOpenChange={setReferralOpen}>
              <section className="space-y-4">
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h3 className="text-lg font-semibold text-slate-700">Referral</h3>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    referralOpen && "rotate-180"
                  )} />
                </CollapsibleTrigger>
                
                <CollapsibleContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="referring-practitioner">Referring Practitioner</Label>
                      <Input
                        id="referring-practitioner"
                        value={formData.referringPractitioner}
                        onChange={(e) => updateField('referringPractitioner', e.target.value)}
                        placeholder="Name of referring practitioner"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Referral Type</Label>
                      <Select value={formData.referralType} onValueChange={(value) => updateField('referralType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select referral type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GP Mental Health Plan">GP Mental Health Plan</SelectItem>
                          <SelectItem value="Specialist">Specialist</SelectItem>
                          <SelectItem value="Self">Self</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="referral-source">Referral Source</Label>
                      <Input
                        id="referral-source"
                        value={formData.referralSource}
                        onChange={(e) => updateField('referralSource', e.target.value)}
                        placeholder="Marketing source or how client found us"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </section>
            </Collapsible>
          </div>
        </ScrollArea>

        <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="min-w-[120px]"
          >
            Create Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddClientDialog;