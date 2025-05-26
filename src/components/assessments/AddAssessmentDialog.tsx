
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Assessment, AssessmentCategory } from "@/types";
import { useMemo } from "react";
import { v4 as uuidv4 } from '@/lib/utils';

interface AddAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAssessment: (assessment: Assessment) => void;
  clientName: string;
  clientInfo?: {
    gender?: string;
    age?: number;
    caseNumber?: string;
    sessionNumber?: number;
  };
}

export function AddAssessmentDialog({
  open,
  onOpenChange,
  onAddAssessment,
  clientName,
  clientInfo
}: AddAssessmentDialogProps) {
  const [mode, setMode] = useState<"add" | "assign">("add");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedScale, setSelectedScale] = useState<string>("");
  const [assessmentPurpose, setAssessmentPurpose] = useState<string>("session");
  const [email, setEmail] = useState<string>("");
  const [emailMessage, setEmailMessage] = useState<string>("");

  // Mock assessment categories data
  const assessmentCategories: AssessmentCategory[] = useMemo(() => [
    {
      id: "depression",
      name: "Depression",
      scales: [
        { id: "phq9", name: "Patient Health Questionnaire-9", abbreviation: "PHQ-9", available: false },
        { id: "bdi2", name: "Beck Depression Inventory-II", abbreviation: "BDI-II", available: false },
        { id: "hrsd", name: "Hamilton Rating Scale for Depression", abbreviation: "HRSD", available: false },
        { id: "dass21", name: "Depression, Anxiety, and Stress Scale - 21 Items", abbreviation: "DASS-21", available: true }
      ]
    },
    {
      id: "anxiety",
      name: "Anxiety Disorders",
      scales: [
        { id: "gad7", name: "Generalized Anxiety Disorder-7", abbreviation: "GAD-7", available: false },
        { id: "stai", name: "State-Trait Anxiety Inventory", abbreviation: "STAI", available: false },
        { id: "bai", name: "Beck Anxiety Inventory", abbreviation: "BAI", available: false },
        { id: "dass21", name: "Depression, Anxiety, and Stress Scale - 21 Items", abbreviation: "DASS-21", available: true }
      ]
    },
    {
      id: "trauma",
      name: "PTSD/Trauma",
      scales: [
        { id: "pcl5", name: "PTSD Checklist for DSM-5", abbreviation: "PCL-5", available: false },
        { id: "caps5", name: "Clinician-Administered PTSD Scale for DSM-5", abbreviation: "CAPS-5", available: false },
        { id: "pcptsd", name: "Primary Care PTSD Screen", abbreviation: "PC-PTSD", available: false },
        { id: "dass21", name: "Depression, Anxiety, and Stress Scale - 21 Items", abbreviation: "DASS-21", available: true }
      ]
    },
    {
      id: "stress",
      name: "Stress (General/Workplace)",
      scales: [
        { id: "pss", name: "Perceived Stress Scale", abbreviation: "PSS", available: false },
        { id: "osi", name: "Occupational Stress Inventory", abbreviation: "OSI", available: false },
        { id: "dass21", name: "Depression, Anxiety, and Stress Scale - 21 Items", abbreviation: "DASS-21", available: true }
      ]
    }
  ], []);

  // Default email message when assigning an assessment
  useEffect(() => {
    if (clientName) {
      setEmailMessage(
        `Dear ${clientName},\n\nAs discussed, I am sending you the ${selectedScale || "[Assessment Name]"} to complete as part of your ongoing assessment.\n\nPlease complete this at your earliest convenience.\n\nThank you,\nDr. Emma Wilson`
      );
    }
  }, [clientName, selectedScale]);

  const handleAddAssessment = () => {
    if (!selectedScale) {
      toast({
        title: "No assessment selected",
        description: "Please select an assessment scale before proceeding.",
        variant: "destructive"
      });
      return;
    }

    // Find the selected scale details
    const scale = assessmentCategories.flatMap(cat => cat.scales).find(s => s.id === selectedScale);
    
    if (scale && !scale.available) {
      toast({
        title: "Test is currently unavailable",
        description: "The selected assessment is not available at this time.",
      });
      return;
    }

    const now = new Date();
    const newAssessment: Assessment = {
      id: uuidv4(),
      title: scale?.name || "Unknown Assessment",
      patientName: clientName,
      status: mode === "add" ? "in_progress" : "not_started",
      assignedDate: now.toISOString(),
      date: now.toISOString(),
      completionPercentage: mode === "add" ? 0 : 0,
      type: selectedCategory !== "all" ? selectedCategory : undefined,
      description: `${scale?.abbreviation || "Assessment"} - ${mode === "add" ? "In-session" : "Self-guided"} - ${assessmentPurpose}`
    };

    onAddAssessment(newAssessment);
    
    if (mode === "assign" && email) {
      toast({
        title: "Assessment assigned",
        description: `An email has been sent to ${email} with the assessment link.`,
      });
    } else {
      toast({
        title: "Assessment added",
        description: "The assessment has been added to the case.",
      });
    }
    
    onOpenChange(false);
  };

  const filteredScales = useMemo(() => {
    let scales: { id: string, name: string, abbreviation: string, available: boolean, category: string }[] = [];
    
    if (selectedCategory === "all") {
      // Get all scales from all categories
      assessmentCategories.forEach(category => {
        scales = [...scales, ...category.scales.map(scale => ({
          ...scale,
          category: category.name
        }))];
      });
    } else {
      // Get scales from the selected category
      const category = assessmentCategories.find(cat => cat.id === selectedCategory);
      if (category) {
        scales = category.scales.map(scale => ({
          ...scale,
          category: category.name
        }));
      }
    }
    
    return scales;
  }, [selectedCategory, assessmentCategories]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Assessment" : "Assign Self-Guided Assessment"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Add an assessment to complete during the current session." 
              : "Assign a self-guided assessment for the client to complete remotely."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex items-center space-x-4">
            <Label htmlFor="mode" className="flex-shrink-0">Mode:</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="mode-toggle" className={mode === "add" ? "text-primary font-medium" : "text-muted-foreground"}>
                In-session assessment
              </Label>
              <Switch
                id="mode-toggle"
                checked={mode === "assign"}
                onCheckedChange={(checked) => setMode(checked ? "assign" : "add")}
              />
              <Label htmlFor="mode-toggle" className={mode === "assign" ? "text-primary font-medium" : "text-muted-foreground"}>
                Self-Guided assessment
              </Label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Client Information</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="flex">
                <span className="font-medium w-20">Name:</span>
                <span className="text-muted-foreground">{clientName}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-20">Case Number:</span>
                <span className="text-muted-foreground">{clientInfo?.caseNumber || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-20">Gender:</span>
                <span className="text-muted-foreground">{clientInfo?.gender || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-20">Age:</span>
                <span className="text-muted-foreground">{clientInfo?.age?.toString() || "N/A"}</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="assessment-purpose">Assessment Purpose</Label>
              <Select value={assessmentPurpose} onValueChange={setAssessmentPurpose}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assessment purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intake">Intake</SelectItem>
                  <SelectItem value="session">Session</SelectItem>
                  <SelectItem value="vocational">Vocational</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Select Assessment Scale</h3>
            <div>
              <Label htmlFor="category-select">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {assessmentCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="scale-select">Assessment Scale</Label>
              <Select value={selectedScale} onValueChange={setSelectedScale}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an assessment scale" />
                </SelectTrigger>
                <SelectContent>
                  {filteredScales.map((scale) => (
                    <SelectItem key={scale.id} value={scale.id}>
                      {scale.abbreviation} - {scale.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {mode === "assign" && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Delivery Details</h3>
              <div>
                <Label htmlFor="email">Client Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="client@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email-message">Email Message</Label>
                <Textarea 
                  id="email-message" 
                  rows={4} 
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAddAssessment}>
            {mode === "add" ? "Add Assessment" : "Assign and Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
