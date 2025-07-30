
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Assessment } from "@/types";
import { v4 as uuidv4 } from '@/lib/utils';
import { ChevronDown } from "lucide-react";
import { AssessmentScaleSelector } from "./AssessmentScaleSelector";

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showScaleSelector, setShowScaleSelector] = useState<boolean>(false);
  const [selectedScale, setSelectedScale] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock client list
  const clientList = [
    "Michael Brown",
    "Emily Zhang",
    "David Wilson",
    "Sarah Johnson",
    "Alex Thompson",
    "Maria Garcia",
    "John Smith",
    "Lisa Anderson"
  ];

  // Filter clients based on search term
  const filteredClients = clientList.filter(client => 
    client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClientSelect = (client: string) => {
    setSelectedClient(client);
    setSearchTerm(client);
    setShowDropdown(false);
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setSelectedClient(value);
    setShowDropdown(true);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddAssessment = () => {
    if (!selectedClient) {
      toast({
        title: "No client selected",
        description: "Please select a client before proceeding.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedScale) {
      // Open the scale selector instead of showing error
      setShowScaleSelector(true);
      return;
    }

    const now = new Date();
    const newAssessment: Assessment = {
      id: uuidv4(),
      title: selectedScale.name || "Assessment",
      patientName: selectedClient,
      status: mode === "add" ? "in_progress" : "not_started",
      assignedDate: now.toISOString(),
      date: now.toISOString(),
      completionPercentage: 0,
      description: `${selectedScale.name} - ${mode === "add" ? "In-session" : "Self-guided"} assessment`
    };

    onAddAssessment(newAssessment);
    
    toast({
      title: mode === "add" ? "Assessment added" : "Assessment assigned",
      description: `The ${selectedScale.name} has been ${mode === "add" ? "added for" : "assigned to"} ${selectedClient}.`,
    });
    
    // Reset form
    setSelectedClient("");
    setSearchTerm("");
    setSelectedScale(null);
    onOpenChange(false);
  };

  const handleScaleSelect = (scale: any) => {
    setSelectedScale(scale);
    setShowScaleSelector(false);
    
    // Automatically proceed with assessment creation
    setTimeout(() => {
      handleAddAssessment();
    }, 100);
  };


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
            <div className="relative" ref={dropdownRef}>
              <Label htmlFor="client-search">Client Name</Label>
              <div className="relative">
                <Input
                  id="client-search"
                  type="text"
                  placeholder="Search for a client..."
                  value={searchTerm}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  className="pr-8"
                />
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              
              {showDropdown && filteredClients.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                  {filteredClients.map((client, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 cursor-pointer hover:bg-muted text-sm"
                      onClick={() => handleClientSelect(client)}
                    >
                      {client}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAddAssessment} disabled={!selectedClient}>
            {selectedScale ? `Add ${selectedScale.name}` : (mode === "add" ? "Select Assessment Scale" : "Select Assessment Scale")}
          </Button>
        </DialogFooter>
      </DialogContent>
      
      <AssessmentScaleSelector
        open={showScaleSelector}
        onOpenChange={setShowScaleSelector}
        onSelectScale={handleScaleSelect}
        clientName={selectedClient || clientName}
      />
    </Dialog>
  );
}
