import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { PCL5Assessment } from "./PCL5Assessment";
import { AUDITAssessment } from "./AUDITAssessment";
import { BPRSAssessment } from "./BPRSAssessment";
import { EPDSAssessment } from "./EPDSAssessment";
import { MDQAssessment } from "./MDQAssessment";
import { GAD7Assessment } from "./GAD7Assessment";
import { MoCAAssessment } from "./MoCAAssessment";

interface AssessmentScale {
  id: string;
  name: string;
  category: string;
  description: string;
  specialty?: string;
  questions?: number;
}

interface AssessmentScaleSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectScale: (scale: AssessmentScale) => void;
  clientName?: string;
}

export function AssessmentScaleSelector({ open, onOpenChange, onSelectScale, clientName }: AssessmentScaleSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState<"categories" | "alphabetical" | "mental-health">("alphabetical");
  const [selectedAlphabet, setSelectedAlphabet] = useState<string>("A");
  const [selectedCategory, setSelectedCategory] = useState<string>("Anxiety");
  const [showPCL5Assessment, setShowPCL5Assessment] = useState(false);
  const [showAUDITAssessment, setShowAUDITAssessment] = useState(false);
  const [showBPRSAssessment, setShowBPRSAssessment] = useState(false);
  const [showEPDSAssessment, setShowEPDSAssessment] = useState(false);
  const [showMDQAssessment, setShowMDQAssessment] = useState(false);
  const [showGAD7Assessment, setShowGAD7Assessment] = useState(false);
  const [showMoCAAssessment, setShowMoCAAssessment] = useState(false);

  // Mock assessment scales data
  const assessmentScales: AssessmentScale[] = useMemo(() => [
    // A
    {
      id: "asrs",
      name: "Adult ADHD Self-Report Scale (ASRS)",
      category: "Cognition",
      description: "6 question scale to screen for adult ADHD",
      questions: 6
    },
    {
      id: "audit",
      name: "AUDIT",
      category: "Addictions",
      description: "Alcohol Use Disorders Identification Test for screening hazardous drinking",
      questions: 10
    },
    {
      id: "apgar",
      name: "APGAR Score",
      category: "Pediatrics", 
      description: "Assess newborn condition immediately after birth"
    },
    
    // B
    {
      id: "bprs",
      name: "Brief Psychiatric Rating Scale (BPRS)",
      category: "Psychosis",
      description: "18-item clinical rating scale to assess severity of psychiatric symptoms",
      questions: 18
    },
    {
      id: "bmi",
      name: "BMI Calculator",
      category: "General",
      description: "Calculate Body Mass Index to assess weight status"
    },
    {
      id: "bsa",
      name: "Body Surface Area (BSA)",
      category: "General",
      description: "Calculate body surface area using Mosteller formula"
    },
    {
      id: "bdi",
      name: "Beck Depression Inventory (BDI-II)",
      category: "Depression",
      description: "21-item self-report measure of depression severity",
      questions: 21
    },
    {
      id: "bai",
      name: "Beck Anxiety Inventory (BAI)",
      category: "Anxiety", 
      description: "21-item self-report measure of anxiety symptoms",
      questions: 21
    },

    // C
    {
      id: "cage",
      name: "CAGE Questionnaire",
      category: "Addictions",
      description: "4-item screening tool for alcohol problems",
      questions: 4
    },

    // D
    {
      id: "dass21",
      name: "Depression, Anxiety, and Stress Scale (DASS-21)",
      category: "Depression",
      description: "21-item scale measuring depression, anxiety and stress",
      questions: 21
    },

    // E
    {
      id: "epds",
      name: "Edinburgh Postnatal Depression Scale (EPDS)",
      category: "Depression",
      description: "10-item questionnaire to screen for postnatal depression",
      questions: 10
    },
    {
      id: "eat26",
      name: "Eating Attitudes Test (EAT-26)",
      category: "Eating Disorder",
      description: "26-item screening tool for eating disorders",
      questions: 26
    },

    // G
    {
      id: "gad7",
      name: "GAD-7 Anxiety Scale",
      category: "Anxiety",
      description: "7-item anxiety screening and severity measure",
      questions: 7
    },

    // M
    {
      id: "mdq",
      name: "Mood Disorder Questionnaire (MDQ)",
      category: "Bipolar",
      description: "Screening tool for bipolar spectrum disorders",
      questions: 13
    },
    {
      id: "mmse",
      name: "Mini-Mental State Examination (MMSE)",
      category: "Cognition",
      description: "30-item cognitive screening test",
      questions: 30
    },
    {
      id: "moca",
      name: "Montreal Cognitive Assessment (MoCA)",
      category: "Cognition",
      description: "30-item cognitive screening tool for mild cognitive impairment",
      questions: 30
    },

    // P
    {
      id: "pcl5",
      name: "Post-Traumatic Stress Disorder (PCL-5)",
      category: "Post Traumatic Stress",
      description: "20-item self-report measure for PTSD symptoms",
      questions: 20
    },
    {
      id: "phq9",
      name: "Patient Health Questionnaire (PHQ-9)",
      category: "Depression",
      description: "9-item depression screening and severity measure", 
      questions: 9
    },
    {
      id: "panss",
      name: "Positive and Negative Syndrome Scale (PANSS)",
      category: "Psychosis",
      description: "30-item scale for schizophrenia symptom assessment",
      questions: 30
    },

    // Y
    {
      id: "ybocs",
      name: "Yale-Brown Obsessive Compulsive Scale (Y-BOCS)",
      category: "Obsessive Compulsive Disorder", 
      description: "10-item clinician-administered OCD severity scale",
      questions: 10
    }
  ], []);

  const mentalHealthCategories = [
    "Addictions", "Anxiety", "Bipolar", "Cognition", "Depression", 
    "Eating Disorder", "Obsessive Compulsive Disorder", "Pediatrics",
    "Post Traumatic Stress", "Psychosis", "Psychosomatic", "Sexual Function",
    "Sleep", "Treatment Side Effects"
  ];

  const alphabetLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  const filteredScales = useMemo(() => {
    let filtered = assessmentScales;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(scale => 
        scale.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scale.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scale.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply view-specific filters
    if (activeView === "alphabetical") {
      filtered = filtered.filter(scale => 
        scale.name.charAt(0).toUpperCase() === selectedAlphabet
      );
    } else if (activeView === "mental-health") {
      filtered = filtered.filter(scale => scale.category === selectedCategory);
    }

    return filtered;
  }, [assessmentScales, searchTerm, activeView, selectedAlphabet, selectedCategory]);

  const getAvailableLetters = () => {
    const availableLetters = new Set(
      assessmentScales.map(scale => scale.name.charAt(0).toUpperCase())
    );
    return alphabetLetters.filter(letter => availableLetters.has(letter));
  };

  // If used as a page (open=true and no dialog control), render without dialog wrapper
  const isPageMode = open && !onOpenChange;

  const content = (
    <div className={`${isPageMode ? 'h-full' : 'flex-1'} flex flex-col space-y-4 overflow-hidden`}>
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Type a calculator name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-2">
            <Button
              variant={activeView === "categories" ? "default" : "outline"}
              onClick={() => setActiveView("categories")}
              size="sm"
            >
              Categories
            </Button>
            <Button
              variant={activeView === "alphabetical" ? "default" : "outline"}
              onClick={() => setActiveView("alphabetical")}
              size="sm"
            >
              Alphabetical
            </Button>
            <Button
              variant={activeView === "mental-health" ? "default" : "outline"}
              onClick={() => setActiveView("mental-health")}
              size="sm"
            >
              Mental Health
            </Button>
          </div>

          {/* Alphabet Filter */}
          {activeView === "alphabetical" && (
            <div className="flex flex-wrap gap-2">
              {getAvailableLetters().map((letter) => (
                <Button
                  key={letter}
                  variant={selectedAlphabet === letter ? "default" : "ghost"}
                  onClick={() => setSelectedAlphabet(letter)}
                  size="sm"
                  className="w-8 h-8 p-0"
                >
                  {letter}
                </Button>
              ))}
            </div>
          )}

          {/* Mental Health Categories Filter */}
          {activeView === "mental-health" && (
            <div className="flex flex-wrap gap-2">
              {mentalHealthCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          )}

          {/* Current Letter/Category Display */}
          {activeView === "alphabetical" && (
            <div className="text-2xl font-bold text-muted-foreground">
              {selectedAlphabet}
            </div>
          )}

          {/* Assessment Cards Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {filteredScales.map((scale) => (
                <div
                  key={scale.id}
                  className="border border-l-4 border-l-green-500 rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                >
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{scale.name}</h3>
                    {scale.specialty && (
                      <Badge variant="secondary" className="text-xs mb-2">
                        {scale.specialty}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs mb-2">
                      {scale.category}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {scale.description}
                  </p>
                  
                  {scale.questions && (
                    <p className="text-xs text-muted-foreground">
                      {scale.questions} questions
                    </p>
                  )}

                   <Button
                     onClick={() => {
                       if (scale.id === "pcl5") {
                         setShowPCL5Assessment(true);
                       } else if (scale.id === "audit") {
                         setShowAUDITAssessment(true);
                       } else if (scale.id === "bprs") {
                         setShowBPRSAssessment(true);
                       } else if (scale.id === "epds") {
                         setShowEPDSAssessment(true);
                       } else if (scale.id === "mdq") {
                         setShowMDQAssessment(true);
                        } else if (scale.id === "gad7") {
                          setShowGAD7Assessment(true);
                        } else if (scale.id === "moca") {
                          setShowMoCAAssessment(true);
                        } else {
                          onSelectScale(scale);
                        }
                     }}
                     variant="outline"
                     size="sm"
                     className="w-full"
                   >
                     Calculate
                   </Button>
                </div>
              ))}
            </div>

            {filteredScales.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No assessment scales found matching your criteria.
              </div>
            )}
          </div>
    </div>
  );

  return (
    <>
      {isPageMode ? (
        content
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-[80vw] max-h-[80vh] w-[80vw] h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Select Assessment Scale</DialogTitle>
            </DialogHeader>
            {content}
          </DialogContent>
        </Dialog>
      )}

      <PCL5Assessment 
        open={showPCL5Assessment}
        onOpenChange={setShowPCL5Assessment}
        clientName={clientName}
      />
      <AUDITAssessment 
        open={showAUDITAssessment}
        onOpenChange={setShowAUDITAssessment}
        clientName={clientName}
      />
      <BPRSAssessment 
        open={showBPRSAssessment}
        onOpenChange={setShowBPRSAssessment}
        clientName={clientName}
      />
      <EPDSAssessment 
        open={showEPDSAssessment}
        onOpenChange={setShowEPDSAssessment}
        clientName={clientName}
      />
      <MDQAssessment 
        open={showMDQAssessment}
        onOpenChange={setShowMDQAssessment}
        clientName={clientName}
      />
      <GAD7Assessment 
        open={showGAD7Assessment}
        onOpenChange={setShowGAD7Assessment}
        clientName={clientName}
      />
      <MoCAAssessment 
        open={showMoCAAssessment}
        onOpenChange={setShowMoCAAssessment}
        clientName={clientName}
      />
    </>
  );
}