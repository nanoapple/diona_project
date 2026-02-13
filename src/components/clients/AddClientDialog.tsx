import React, { useState, useEffect, useRef } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ChevronDown, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/ThemeProvider';
import { useClients } from '@/hooks/useClients';

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

  // NDIS Plan Details
  ndisParticipantNumber: string;
  ndisFundingType: string;
  ndisStartDate: Date | undefined;
  ndisEndDate: Date | undefined;
  ndisAmountRemaining: string;

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
  insurer: string;
  lawyerSolicitor: string;

  // Legal Issues
  hasLegalIssues: boolean;
  courtOrder: boolean;
  detention: boolean;
  communityService: boolean;
  legalNotes: string;

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
  const { theme } = useTheme();
  const { createClient, isCreating } = useClients();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
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
    ndisParticipantNumber: '',
    ndisFundingType: '',
    ndisStartDate: undefined,
    ndisEndDate: undefined,
    ndisAmountRemaining: '',
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
    insurer: '',
    lawyerSolicitor: '',
    hasLegalIssues: false,
    courtOrder: false,
    detention: false,
    communityService: false,
    legalNotes: '',
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Format date of birth
      const dateOfBirth = formData.birthDay && formData.birthMonth && formData.birthYear 
        ? `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`
        : '';

      await createClient({
        first_name: formData.firstName,
        last_name: formData.lastName,
        preferred_first_name: formData.preferredFirstName || undefined,
        title: formData.title || undefined,
        date_of_birth: dateOfBirth,
        sex: formData.sex,
        gender_identity: formData.genderIdentity || undefined,
        pronouns: formData.pronouns === 'other' ? formData.customPronouns : formData.pronouns || undefined,
        cultural_identity: formData.culturalIdentity || undefined,
        email: formData.email || undefined,
        mobile_phone: formData.mobilePhone,
        alternate_phone: formData.alternatePhone || undefined,
        address_line1: formData.addressLine1,
        address_line2: formData.addressLine2 || undefined,
        suburb: formData.suburb || undefined,
        state: formData.state || undefined,
        postcode: formData.postcode || undefined,
        country: formData.country || 'Australia',
        time_zone: formData.timeZone || 'Australia/Sydney',
        communication_preferences: {
          appointmentReminders: formData.appointmentReminders,
          marketingMessages: formData.marketingMessages,
          bookingConfirmationEmails: formData.bookingConfirmationEmails,
          bookingCancellationEmails: formData.bookingCancellationEmails,
        },
        ndis_participant_number: formData.ndisParticipantNumber || undefined,
        ndis_funding_type: formData.ndisFundingType || undefined,
        ndis_start_date: formData.ndisStartDate?.toISOString().split('T')[0],
        ndis_end_date: formData.ndisEndDate?.toISOString().split('T')[0],
        ndis_amount_remaining: formData.ndisAmountRemaining || undefined,
        date_of_injury: formData.dateOfInjury?.toISOString().split('T')[0],
        primary_reason: formData.primaryReason || undefined,
        concession_type: formData.concessionType || undefined,
        insurer: formData.insurer || undefined,
        lawyer_solicitor: formData.lawyerSolicitor || undefined,
        has_legal_issues: formData.hasLegalIssues,
        legal_details: formData.hasLegalIssues ? {
          courtOrder: formData.courtOrder,
          detention: formData.detention,
          communityService: formData.communityService,
          notes: formData.legalNotes,
        } : undefined,
        billing_details: {
          invoiceTo: formData.invoiceTo,
          emailInvoiceTo: formData.emailInvoiceTo,
          extraInfo: formData.invoiceExtraInfo,
        },
        emergency_contact: {
          name: formData.emergencyContactName,
          relationship: formData.emergencyContactRelationship,
          phone: formData.emergencyContactPhone,
          email: formData.emergencyContactEmail,
        },
        referral_details: {
          source: formData.referralSource,
          referringPractitioner: formData.referringPractitioner,
          referralType: formData.referralType,
        },
        notes: formData.appointmentNotes || undefined,
        engagement_enabled: false,
      });

      // Clear form and draft
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(`${DRAFT_KEY}_timestamp`);
      
      onOpenChange(false);
      onClientCreated(null); // Trigger refresh in parent
    } catch (error) {
      console.error('Error creating client:', error);
    }
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
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Cascading logic: country → state → timeZone
      if (field === 'country') {
        updated.state = '';
        updated.timeZone = '';
        updated.postcode = '';
      }
      if (field === 'state') {
        const tzMap: Record<string, string> = {
          'NSW': 'Australia/Sydney',
          'VIC': 'Australia/Melbourne',
          'QLD': 'Australia/Brisbane',
          'SA': 'Australia/Adelaide',
          'WA': 'Australia/Perth',
          'TAS': 'Australia/Hobart',
          'NT': 'Australia/Darwin',
          'ACT': 'Australia/Sydney',
        };
        if (updated.country === 'Australia' && tzMap[value as string]) {
          updated.timeZone = tzMap[value as string];
        }
      }
      
      return updated;
    });
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    { id: 'section-1', label: 'Personal', hue: 210, lightColor: 'blue' },
    { id: 'section-2', label: 'Contact', hue: 270, lightColor: 'purple' },
    { id: 'section-3', label: 'Communication', hue: 140, lightColor: 'green' },
    { id: 'section-4', label: 'NDIS', hue: 180, lightColor: 'cyan' },
    { id: 'section-5', label: 'Consent', hue: 50, lightColor: 'amber' },
    { id: 'section-6', label: 'Clinical', hue: 40, lightColor: 'rose' },
    { id: 'section-7', label: 'Legal', hue: 340, lightColor: 'indigo' },
    { id: 'section-8', label: 'Billing', hue: 50, lightColor: 'cyan' },
    { id: 'section-9', label: 'Emergency', hue: 25, lightColor: 'orange' },
    { id: 'section-10', label: 'Referral', hue: 300, lightColor: 'violet' },
  ];

  const getSectionButtonClass = (section: typeof sections[0]) => {
    if (theme === 'e-ink') {
      return `bg-[hsl(${section.hue},15%,88%)] text-[hsl(${section.hue},20%,25%)] border-[hsl(${section.hue},15%,65%)] hover:bg-[hsl(${section.hue},15%,82%)]`;
    } else {
      const colorMap: Record<string, string> = {
        'blue': 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100',
        'purple': 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100',
        'green': 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100',
        'cyan': 'bg-cyan-50 text-cyan-700 border-cyan-300 hover:bg-cyan-100',
        'amber': 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100',
        'rose': 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100',
        'indigo': 'bg-indigo-50 text-indigo-700 border-indigo-300 hover:bg-indigo-100',
        'orange': 'bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100',
        'violet': 'bg-violet-50 text-violet-700 border-violet-300 hover:bg-violet-100',
      };
      return colorMap[section.lightColor] || '';
    }
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

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 pb-4 border-b">
          {sections.map((section) => (
            <Badge
              key={section.id}
              variant="outline"
              className={cn(
                "cursor-pointer transition-colors font-medium",
                getSectionButtonClass(section)
              )}
              onClick={() => scrollToSection(section.id)}
            >
              {section.label}
            </Badge>
          ))}
        </div>

        <ScrollArea className="max-h-[calc(90vh-240px)] pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {/* Personal Details */}
            <section id="section-1" className={theme === 'e-ink' ? 'bg-[hsl(210,15%,88%)] p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-[hsl(210,15%,65%)]' : 'bg-blue-50 p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-blue-500'}>
              <h3 className={theme === 'e-ink' ? 'text-lg font-semibold text-[hsl(210,20%,25%)]' : 'text-lg font-semibold text-blue-700'}>1. Personal Details</h3>
              
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
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Non-binary">Non-binary</SelectItem>
                      <SelectItem value="Intersex">Intersex</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
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
              </div>
            </section>

            {/* Contact Information */}
            <section id="section-2" className={theme === 'e-ink' ? 'bg-[hsl(270,15%,88%)] p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-[hsl(270,15%,65%)]' : 'bg-purple-50 p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-purple-500'}>
              <h3 className={theme === 'e-ink' ? 'text-lg font-semibold text-[hsl(270,20%,25%)]' : 'text-lg font-semibold text-purple-700'}>2. Contact Information</h3>
              
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
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => updateField('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="New Zealand">New Zealand</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State / Region</Label>
                  <Select value={formData.state} onValueChange={(value) => updateField('state', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state/region" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.country === 'Australia' && (
                        <>
                          <SelectItem value="NSW">New South Wales (NSW)</SelectItem>
                          <SelectItem value="VIC">Victoria (VIC)</SelectItem>
                          <SelectItem value="QLD">Queensland (QLD)</SelectItem>
                          <SelectItem value="SA">South Australia (SA)</SelectItem>
                          <SelectItem value="WA">Western Australia (WA)</SelectItem>
                          <SelectItem value="TAS">Tasmania (TAS)</SelectItem>
                          <SelectItem value="NT">Northern Territory (NT)</SelectItem>
                          <SelectItem value="ACT">Australian Capital Territory (ACT)</SelectItem>
                        </>
                      )}
                      {formData.country === 'New Zealand' && (
                        <>
                          <SelectItem value="AUK">Auckland</SelectItem>
                          <SelectItem value="WGN">Wellington</SelectItem>
                          <SelectItem value="CAN">Canterbury</SelectItem>
                          <SelectItem value="WKO">Waikato</SelectItem>
                          <SelectItem value="BOP">Bay of Plenty</SelectItem>
                          <SelectItem value="OTA">Otago</SelectItem>
                        </>
                      )}
                      {formData.country === 'United Kingdom' && (
                        <>
                          <SelectItem value="ENG">England</SelectItem>
                          <SelectItem value="SCT">Scotland</SelectItem>
                          <SelectItem value="WLS">Wales</SelectItem>
                          <SelectItem value="NIR">Northern Ireland</SelectItem>
                        </>
                      )}
                      {formData.country === 'United States' && (
                        <>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="IL">Illinois</SelectItem>
                          <SelectItem value="WA_US">Washington</SelectItem>
                        </>
                      )}
                      {formData.country === 'Canada' && (
                        <>
                          <SelectItem value="ON">Ontario</SelectItem>
                          <SelectItem value="QC">Quebec</SelectItem>
                          <SelectItem value="BC">British Columbia</SelectItem>
                          <SelectItem value="AB">Alberta</SelectItem>
                        </>
                      )}
                      {(!formData.country || formData.country === 'Other') && (
                        <SelectItem value="other">Other</SelectItem>
                      )}
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
                  <Label>Time Zone</Label>
                  <Select value={formData.timeZone} onValueChange={(value) => updateField('timeZone', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.country === 'Australia' && (
                        <>
                          <SelectItem value="Australia/Sydney">Australia/Sydney (AEST)</SelectItem>
                          <SelectItem value="Australia/Melbourne">Australia/Melbourne (AEST)</SelectItem>
                          <SelectItem value="Australia/Brisbane">Australia/Brisbane (AEST)</SelectItem>
                          <SelectItem value="Australia/Adelaide">Australia/Adelaide (ACST)</SelectItem>
                          <SelectItem value="Australia/Perth">Australia/Perth (AWST)</SelectItem>
                          <SelectItem value="Australia/Darwin">Australia/Darwin (ACST)</SelectItem>
                          <SelectItem value="Australia/Hobart">Australia/Hobart (AEST)</SelectItem>
                        </>
                      )}
                      {formData.country === 'New Zealand' && (
                        <>
                          <SelectItem value="Pacific/Auckland">Pacific/Auckland (NZST)</SelectItem>
                          <SelectItem value="Pacific/Chatham">Pacific/Chatham</SelectItem>
                        </>
                      )}
                      {formData.country === 'United Kingdom' && (
                        <SelectItem value="Europe/London">Europe/London (GMT/BST)</SelectItem>
                      )}
                      {formData.country === 'United States' && (
                        <>
                          <SelectItem value="America/New_York">Eastern (ET)</SelectItem>
                          <SelectItem value="America/Chicago">Central (CT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain (MT)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific (PT)</SelectItem>
                        </>
                      )}
                      {formData.country === 'Canada' && (
                        <>
                          <SelectItem value="America/Toronto">Eastern (ET)</SelectItem>
                          <SelectItem value="America/Vancouver">Pacific (PT)</SelectItem>
                          <SelectItem value="America/Edmonton">Mountain (MT)</SelectItem>
                        </>
                      )}
                      {(!formData.country || formData.country === 'Other') && (
                        <SelectItem value="UTC">UTC</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Communication Preferences */}
            <section id="section-3" className={theme === 'e-ink' ? 'bg-[hsl(140,15%,88%)] p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-[hsl(140,15%,65%)]' : 'bg-green-50 p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-green-500'}>
              <h3 className={theme === 'e-ink' ? 'text-lg font-semibold text-[hsl(140,20%,25%)]' : 'text-lg font-semibold text-green-700'}>3. Communication Preferences</h3>
              
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

            {/* NDIS Plan Details */}
            <section id="section-4" className={theme === 'e-ink' ? 'bg-[hsl(180,15%,88%)] p-6 rounded-lg space-y-4 border-l-4 border-[hsl(180,15%,65%)] scroll-mt-4' : 'bg-teal-50 p-6 rounded-lg space-y-4 border-l-4 border-teal-500 scroll-mt-4'}>
              <h3 className={theme === 'e-ink' ? 'text-lg font-semibold text-[hsl(180,20%,25%)]' : 'text-lg font-semibold text-teal-700'}>4. NDIS Plan Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ndisParticipantNumber" className="text-sm font-medium text-slate-700">Participant Number</Label>
                  <Input
                    id="ndisParticipantNumber"
                    value={formData.ndisParticipantNumber}
                    onChange={(e) => updateField('ndisParticipantNumber', e.target.value)}
                    placeholder="Enter participant number"
                    className="focus-visible:ring-2 focus-visible:ring-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ndisFundingType" className="text-sm font-medium text-slate-700">Funding type</Label>
                  <Select value={formData.ndisFundingType} onValueChange={(value) => updateField('ndisFundingType', value)}>
                    <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-teal-500">
                      <SelectValue placeholder="Select funding type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Core Supports">Core Supports</SelectItem>
                      <SelectItem value="Capacity Building">Capacity Building</SelectItem>
                      <SelectItem value="Capital Supports">Capital Supports</SelectItem>
                      <SelectItem value="Plan Management">Plan Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Start Date</Label>
                  <DatePicker
                    value={formData.ndisStartDate}
                    onChange={(date) => updateField('ndisStartDate', date)}
                    placeholder="Select start date"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">End Date</Label>
                  <DatePicker
                    value={formData.ndisEndDate}
                    onChange={(date) => updateField('ndisEndDate', date)}
                    placeholder="Select end date"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ndisAmountRemaining" className="text-sm font-medium text-slate-700">Amount Remaining</Label>
                  <Input
                    id="ndisAmountRemaining"
                    type="text"
                    value={formData.ndisAmountRemaining}
                    onChange={(e) => updateField('ndisAmountRemaining', e.target.value)}
                    placeholder="$0.00"
                    className="focus-visible:ring-2 focus-visible:ring-teal-500"
                  />
                </div>
              </div>

              <p className="text-sm text-slate-600 italic mt-2">
                * The remaining amount only reflects what has been invoiced and paid in coreplus
              </p>
            </section>

            {/* Consent & Privacy */}
            <section id="section-5" className={theme === 'e-ink' ? 'bg-[hsl(50,15%,88%)] p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-[hsl(50,15%,65%)]' : 'bg-amber-50 p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-amber-500'}>
              <h3 className={theme === 'e-ink' ? 'text-lg font-semibold text-[hsl(50,20%,25%)]' : 'text-lg font-semibold text-amber-700'}>5. Consent & Privacy</h3>
              
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
            <section id="section-6" className={theme === 'e-ink' ? 'bg-[hsl(40,15%,88%)] p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-[hsl(40,15%,65%)]' : 'bg-rose-50 p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-rose-500'}>
              <h3 className={theme === 'e-ink' ? 'text-lg font-semibold text-[hsl(40,20%,25%)]' : 'text-lg font-semibold text-rose-700'}>6. Injury or Incident</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div className="space-y-2">
                  <Label>Date of Injury or Incident</Label>
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
                  <Label htmlFor="insurer">Insurer</Label>
                  <Input
                    id="insurer"
                    value={formData.insurer}
                    onChange={(e) => updateField('insurer', e.target.value)}
                    placeholder="Enter insurer name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lawyerSolicitor">Lawyer/Solicitor</Label>
                  <Input
                    id="lawyerSolicitor"
                    value={formData.lawyerSolicitor}
                    onChange={(e) => updateField('lawyerSolicitor', e.target.value)}
                    placeholder="Enter lawyer/solicitor name"
                  />
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

            {/* Legal Issues */}
            <section id="section-7" className={theme === 'e-ink' ? 'bg-[hsl(340,15%,88%)] p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-[hsl(340,15%,65%)]' : 'bg-indigo-50 p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-indigo-500'}>
              <h3 className={theme === 'e-ink' ? 'text-lg font-semibold text-[hsl(340,20%,25%)]' : 'text-lg font-semibold text-indigo-700'}>7. Legal Issues</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has-legal-issues"
                    checked={formData.hasLegalIssues}
                    onCheckedChange={(checked) => updateField('hasLegalIssues', checked)}
                  />
                  <Label htmlFor="has-legal-issues">Client is involved in legal issues</Label>
                </div>

                {formData.hasLegalIssues && (
                  <div className="ml-6 space-y-4 border-l-2 border-blue-200 pl-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="court-order"
                          checked={formData.courtOrder}
                          onCheckedChange={(checked) => updateField('courtOrder', checked)}
                        />
                        <Label htmlFor="court-order">Court Order</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="detention"
                          checked={formData.detention}
                          onCheckedChange={(checked) => updateField('detention', checked)}
                        />
                        <Label htmlFor="detention">Detention</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="community-service"
                          checked={formData.communityService}
                          onCheckedChange={(checked) => updateField('communityService', checked)}
                        />
                        <Label htmlFor="community-service">Community Service</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="legal-notes">Legal Notes</Label>
                      <Textarea
                        id="legal-notes"
                        value={formData.legalNotes}
                        onChange={(e) => updateField('legalNotes', e.target.value)}
                        rows={3}
                        placeholder="Additional details about legal issues..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Billing & Invoicing */}
            <section id="section-8" className={theme === 'e-ink' ? 'bg-[hsl(50,15%,88%)] p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-[hsl(50,15%,65%)]' : 'bg-cyan-50 p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-cyan-500'}>
              <h3 className={theme === 'e-ink' ? 'text-lg font-semibold text-[hsl(50,20%,25%)]' : 'text-lg font-semibold text-cyan-700'}>8. Billing & Invoicing</h3>
              
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
              <section id="section-9" className={theme === 'e-ink' ? 'bg-[hsl(25,15%,88%)] p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-[hsl(25,15%,65%)]' : 'bg-orange-50 p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-orange-500'}>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h3 className={theme === 'e-ink' ? 'text-lg font-semibold text-[hsl(25,20%,25%)]' : 'text-lg font-semibold text-orange-700'}>9. Emergency Contact</h3>
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
              <section id="section-10" className={theme === 'e-ink' ? 'bg-[hsl(140,15%,88%)] p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-[hsl(140,15%,65%)]' : 'bg-violet-50 p-6 rounded-lg space-y-4 scroll-mt-4 border-l-4 border-violet-500'}>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h3 className={theme === 'e-ink' ? 'text-lg font-semibold text-[hsl(140,20%,25%)]' : 'text-lg font-semibold text-violet-700'}>10. Referral</h3>
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
            disabled={!isFormValid || isCreating}
            className="min-w-[120px]"
          >
            {isCreating ? 'Creating...' : 'Create Client'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddClientDialog;