import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarIcon, Plus, Trash, X } from 'lucide-react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from '@/lib/utils';
import { CaseSilo, ExternalContributor, CategoryTag } from '@/types';

interface CreateCaseSiloProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSilo: (silo: CaseSilo) => void;
}

// Define category tags
const CATEGORY_TAGS: CategoryTag[] = [
  { id: 'ANX', name: 'Anxiety / Stress', abbreviation: 'ANX' },
  { id: 'MOOD', name: 'Mood Disorders', abbreviation: 'MOOD' },
  { id: 'TRM', name: 'Trauma / PTSD', abbreviation: 'TRM' },
  { id: 'PERS', name: 'Personality / Behaviour', abbreviation: 'PERS' },
  { id: 'REL', name: 'Relationships / Families', abbreviation: 'REL' },
  { id: 'LIFE', name: 'Life Changes / Grief', abbreviation: 'LIFE' },
  { id: 'WORK', name: 'Workplace Stress / Bullying', abbreviation: 'WORK' },
  { id: 'LEGAL', name: 'Legal / Compensation Issues', abbreviation: 'LEGAL' },
  { id: 'PAIN', name: 'Pain / Physical Injury', abbreviation: 'PAIN' },
  { id: 'NDV', name: 'Neurodiversity Support', abbreviation: 'NDV' },
  { id: 'EDU', name: 'Academic / School Challenges', abbreviation: 'EDU' },
  { id: 'EXIS', name: 'Existential / Spiritual Crises', abbreviation: 'EXIS' },
  { id: 'SOC', name: 'Cultural / Social Oppression', abbreviation: 'SOC' },
  { id: 'IDEN', name: 'Identity / Affirmation', abbreviation: 'IDEN' },
  { id: 'JUST', name: 'Forensic / Justice Involvement', abbreviation: 'JUST' },
  { id: 'MED', name: 'Medical / Health Psychology', abbreviation: 'MED' },
  { id: 'ADDX', name: 'Addiction / Compulsive Behaviour', abbreviation: 'ADDX' },
  { id: 'COG', name: 'Cognitive Decline / Dementia', abbreviation: 'COG' },
];

// Mock clients for demo with expanded information
const MOCK_CLIENTS = [
  { 
    id: 'client1', 
    name: 'John Doe', 
    dob: '1980-05-15',
    gender: 'Male',
    mobile: '0412 345 678',
    email: 'john.doe@example.com',
    address: '123 Main St, Sydney NSW 2000',
    referral: 'Smith & Associates'
  },
  { 
    id: 'client2', 
    name: 'Jane Smith', 
    dob: '1992-11-23',
    gender: 'Female',
    mobile: '0423 456 789',
    email: 'jane.smith@example.com',
    address: '45 Park Ave, Melbourne VIC 3000',
    referral: 'Johnson Legal'
  },
  { 
    id: 'client3', 
    name: 'Robert Johnson', 
    dob: '1975-08-04',
    gender: 'Male',
    mobile: '0434 567 890',
    email: 'robert.johnson@example.com',
    address: '78 Queen St, Brisbane QLD 4000',
    referral: 'Brisbane Medical Centre'
  },
  { 
    id: 'client4', 
    name: 'Emily Wilson', 
    dob: '1988-03-30',
    gender: 'Female',
    mobile: '0445 678 901',
    email: 'emily.wilson@example.com',
    address: '56 King St, Perth WA 6000',
    referral: 'Wilson & Partners'
  },
];

export function CreateCaseSilo({ open, onOpenChange, onCreateSilo }: CreateCaseSiloProps) {
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [externalCaseNo, setExternalCaseNo] = useState<string>('');
  const [injuryDate, setInjuryDate] = useState<Date | undefined>(undefined);
  const [dateOpen, setDateOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [externalContributors, setExternalContributors] = useState<ExternalContributor[]>([]);
  const [newContributor, setNewContributor] = useState({
    name: '',
    role: 'Other' as const,
    email: ''
  });

  const clientInfo = MOCK_CLIENTS.find(c => c.id === selectedClient);

  const handleTagSelection = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(t => t !== tagId));
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleAddContributor = () => {
    if (newContributor.name && newContributor.email) {
      setExternalContributors([
        ...externalContributors,
        { ...newContributor, id: uuidv4() }
      ]);
      setNewContributor({ name: '', role: 'Other', email: '' });
    }
  };

  const handleRemoveContributor = (id: string) => {
    setExternalContributors(externalContributors.filter(c => c.id !== id));
  };

  const handleCreateSilo = () => {
    if (!selectedClient) return;

    // Generate a case number
    const caseNumber = `CS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Get full case type from selected tags
    const caseType = selectedTags.length > 0 
      ? selectedTags.map(tag => CATEGORY_TAGS.find(t => t.id === tag)?.name).join(' | ')
      : 'General Case';

    const newSilo: CaseSilo = {
      id: uuidv4(),
      claimantName: clientInfo?.name || 'Unknown Client',
      caseType,
      claimNumber: caseNumber,
      externalCaseNumber: externalCaseNo || undefined,
      injuryDate: injuryDate ? format(injuryDate, 'yyyy-MM-dd') : undefined,
      status: 'active',
      createdDate: format(new Date(), 'yyyy-MM-dd'),
      expiryDate: format(new Date(new Date().setMonth(new Date().getMonth() + 6)), 'yyyy-MM-dd'),
      participants: {
        claimantId: selectedClient,
        psychologistId: 'user3', // Assuming current logged in user
        others: externalContributors.map(c => ({
          id: c.id,
          role: c.role,
          email: c.email
        }))
      },
      documents: [],
      assessments: [],
      reports: [],
      notes: [],
      infoRequests: [],
      externalUploads: [],
      completedStages: ['Intake & Triage'],
      currentStage: 'Assessment',
      categoryTags: selectedTags
    };

    onCreateSilo(newSilo);
    onOpenChange(false);
    
    // Reset form
    setSelectedClient('');
    setExternalCaseNo('');
    setInjuryDate(undefined);
    setSelectedTags([]);
    setExternalContributors([]);
  };

  // Function to get tag color classes
  const getTagColorClasses = (tag: string) => {
    const tagColors: Record<string, string> = {
      'ANX': 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500',
      'MOOD': 'bg-purple-500 hover:bg-purple-600 text-white border-purple-500',
      'TRM': 'bg-red-500 hover:bg-red-600 text-white border-red-500',
      'PERS': 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500',
      'REL': 'bg-pink-500 hover:bg-pink-600 text-white border-pink-500',
      'LIFE': 'bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-500',
      'WORK': 'bg-green-500 hover:bg-green-600 text-white border-green-500',
      'LEGAL': 'bg-slate-500 hover:bg-slate-600 text-white border-slate-500',
      'PAIN': 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500',
      'NDV': 'bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-500',
      'EDU': 'bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500',
      'EXIS': 'bg-violet-500 hover:bg-violet-600 text-white border-violet-500',
      'SOC': 'bg-amber-500 hover:bg-amber-600 text-black border-amber-500',
      'IDEN': 'bg-lime-500 hover:bg-lime-600 text-black border-lime-500',
      'JUST': 'bg-gray-500 hover:bg-gray-600 text-white border-gray-500',
      'MED': 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500',
      'ADDX': 'bg-fuchsia-500 hover:bg-fuchsia-600 text-white border-fuchsia-500',
      'COG': 'bg-teal-500 hover:bg-teal-600 text-white border-teal-500',
    };
    
    return tagColors[tag] || 'bg-gray-400 hover:bg-gray-500 text-white border-gray-400';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Case Management</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Client Section */}
          <div className="space-y-3">
            <Label htmlFor="client">Client</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_CLIENTS.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {clientInfo && (
              <div className="mt-3 space-y-2 p-3 border rounded-md bg-muted/10">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-muted-foreground">Gender:</span>
                    <p className="text-sm">{clientInfo.gender}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Date of Birth:</span>
                    <p className="text-sm">{format(new Date(clientInfo.dob), 'dd MMM yyyy')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-muted-foreground">Mobile:</span>
                    <p className="text-sm">{clientInfo.mobile}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Email:</span>
                    <p className="text-sm">{clientInfo.email}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Address:</span>
                  <p className="text-sm">{clientInfo.address}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Referral Source:</span>
                  <p className="text-sm">{clientInfo.referral}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Categories Section */}
          <div className="space-y-3">
            <Label>Category Tags (Select up to 3)</Label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
              {CATEGORY_TAGS.map(tag => (
                <Badge 
                  key={tag.id} 
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-1 justify-between ${
                    selectedTags.includes(tag.id) ? 
                    getTagColorClasses(tag.id) : 
                    'hover:bg-gray-100'
                  }`}
                  onClick={() => handleTagSelection(tag.id)}
                >
                  {tag.name} ({tag.abbreviation})
                </Badge>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map(tagId => {
                  const tag = CATEGORY_TAGS.find(t => t.id === tagId);
                  return (
                    <Badge 
                      key={tagId} 
                      className={`gap-1 ${getTagColorClasses(tagId)}`}
                    >
                      {tag?.name}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setSelectedTags(selectedTags.filter(t => t !== tagId))}
                      />
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          <Separator />

          {/* Case Numbers and Dates Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="externalCaseNo">External Case # (Optional)</Label>
              <Input
                id="externalCaseNo"
                value={externalCaseNo}
                onChange={(e) => setExternalCaseNo(e.target.value)}
                placeholder="External reference number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="injuryDate">Injury/Incident Date (Optional)</Label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {injuryDate ? format(injuryDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={injuryDate}
                    onSelect={(date) => {
                      setInjuryDate(date);
                      setDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Separator />

          {/* External Contributors Section */}
          <div className="space-y-4">
            <div>
              <Label>External Contributors</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add people who need upload-only access to this case
              </p>
            </div>
            
            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="contributorName">Name</Label>
                <Input 
                  id="contributorName"
                  value={newContributor.name}
                  onChange={(e) => setNewContributor({...newContributor, name: e.target.value})}
                  placeholder="Name"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="contributorRole">Role</Label>
                <Select 
                  value={newContributor.role}
                  onValueChange={(value: any) => setNewContributor({...newContributor, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lawyer">Lawyer</SelectItem>
                    <SelectItem value="Case Manager">Case Manager</SelectItem>
                    <SelectItem value="Support Coordinator">Support Coordinator</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="contributorEmail">Email</Label>
                <Input 
                  id="contributorEmail"
                  type="email"
                  value={newContributor.email}
                  onChange={(e) => setNewContributor({...newContributor, email: e.target.value})}
                  placeholder="Email"
                />
              </div>
              <Button 
                size="icon" 
                onClick={handleAddContributor}
                disabled={!newContributor.name || !newContributor.email}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {externalContributors.length > 0 && (
              <div className="space-y-2 mt-2">
                <p className="text-sm font-medium">Added Contributors:</p>
                {externalContributors.map(contributor => (
                  <div key={contributor.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="font-medium">{contributor.name}</p>
                      <p className="text-sm text-muted-foreground">{contributor.role} • {contributor.email}</p>
                    </div>
                    <Button
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveContributor(contributor.id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreateSilo} disabled={!selectedClient}>Create Case Management</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
