import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight } from "lucide-react";
import moCATrailDiagram from "@/assets/moca-trail-diagram.png";
import moCAcube from "@/assets/moca-cube.png";
import moCAanimals from "@/assets/moca-animals.png";

interface MoCAAssessmentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName?: string;
}

interface MoCAScore {
  education: number;
  visuospatialExecutive: number;
  naming: number;
  attention: number;
  language: number;
  abstraction: number;
  delayedRecall: number;
  orientation: number;
}

export const MoCAAssessment = ({ open, onOpenChange, clientName }: MoCAAssessmentProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      section: "Education Adjustment",
      question: "Does the patient have more than 12 years of education?",
      note: "Do not include kindergarten years",
      options: [
        { value: "yes", label: "Yes", score: 0 },
        { value: "no", label: "No", score: 1 }
      ]
    },
    // Visuospatial/Executive (5 points total)
    {
      section: "Visuospatial/Executive",
      question: "Trail Making: Ask patient to trace the diagram in order",
      image: moCATrailDiagram,
      options: [
        { value: "correct", label: "Completed correctly", score: 1 },
        { value: "incorrect", label: "Did not complete correctly", score: 0 }
      ]
    },
    {
      section: "Visuospatial/Executive",
      question: "Cube Copy: Ask patient to copy cube",
      image: moCAcube,
      options: [
        { value: "correct", label: "Completed correctly", score: 1 },
        { value: "incorrect", label: "Did not complete correctly", score: 0 }
      ]
    },
    {
      section: "Visuospatial/Executive",
      question: "Clock Drawing: Ask patient to draw a clock (ten past eleven)",
      options: [
        { value: "all_features", label: "Correctly drew all features (contour, numbers, and hands)", score: 3 },
        { value: "two_features", label: "Correctly drew two out of three features", score: 2 },
        { value: "contour_only", label: "Correctly drew contour only", score: 1 },
        { value: "numbers_only", label: "Correctly drew numbers only", score: 1 },
        { value: "hands_only", label: "Correctly drew hands only", score: 1 },
        { value: "none", label: "None of the above", score: 0 }
      ]
    },
    // Naming (3 points total)
    {
      section: "Naming",
      question: "Animal Naming: Ask patient to name the animals",
      image: moCAanimals,
      note: "Show the image and ask patient to name each animal",
      multiSelect: true,
      options: [
        { value: "lion", label: "Named lion", score: 1 },
        { value: "rhinoceros", label: "Named rhinoceros", score: 1 },
        { value: "camel", label: "Named camel", score: 1 }
      ]
    },
    // Attention (6 points total)
    {
      section: "Attention",
      question: "Digit Span Forward: Read list of digits (2, 1, 8, 5, 4) at 1 digit/sec and ask patient to repeat them in forward order",
      options: [
        { value: "correct", label: "Repeated correctly", score: 1 },
        { value: "incorrect", label: "Did not repeat correctly", score: 0 }
      ]
    },
    {
      section: "Attention",
      question: "Digit Span Backward: Read list of digits (7, 4, 2) at 1 digit/sec and ask patient to repeat them in backward order",
      options: [
        { value: "correct", label: "Repeated correctly", score: 1 },
        { value: "incorrect", label: "Did not repeat correctly", score: 0 }
      ]
    },
    {
      section: "Attention",
      question: "Vigilance: Read list of letters and ask patient to tap with their hand at each letter A: FBAC MNAA JKLB AFAK DEAA AJAM OFAAB",
      options: [
        { value: "less_than_2_errors", label: "<2 errors", score: 1 },
        { value: "2_or_more_errors", label: "≥2 errors", score: 0 }
      ]
    },
    {
      section: "Attention",
      question: "Serial 7s: Ask patient to do five serial 7 subtractions starting at 100 (93, 86, 79, 72, 65)",
      options: [
        { value: "4_or_5_correct", label: "4 or 5 correct", score: 3 },
        { value: "2_or_3_correct", label: "2 or 3 correct", score: 2 },
        { value: "1_correct", label: "1 correct", score: 1 },
        { value: "0_correct", label: "0 correct", score: 0 }
      ]
    },
    // Language (3 points total)
    {
      section: "Language",
      question: "Sentence Repetition 1: Ask patient to repeat: \"I only know that John is the one to help today\"",
      options: [
        { value: "correct", label: "Repeated correctly", score: 1 },
        { value: "incorrect", label: "Did not repeat correctly", score: 0 }
      ]
    },
    {
      section: "Language",
      question: "Sentence Repetition 2: Ask patient to repeat: \"The cat always hid under the couch when dogs were in the room\"",
      options: [
        { value: "correct", label: "Repeated correctly", score: 1 },
        { value: "incorrect", label: "Did not repeat correctly", score: 0 }
      ]
    },
    {
      section: "Language",
      question: "Verbal Fluency: Ask patient to name maximum number of words in 1 minute that begin with the letter F",
      options: [
        { value: "11_or_more", label: "Named ≥11 words", score: 1 },
        { value: "less_than_11", label: "Named <11 words", score: 0 }
      ]
    },
    // Abstraction (2 points total)
    {
      section: "Abstraction",
      question: "Similarity 1: Ask patient similarity between train and bicycle (e.g. both are modes of transportation)",
      options: [
        { value: "correct", label: "Answered correctly", score: 1 },
        { value: "incorrect", label: "Did not answer correctly", score: 0 }
      ]
    },
    {
      section: "Abstraction",
      question: "Similarity 2: Ask patient similarity between watch and ruler (e.g. both are measuring tools)",
      options: [
        { value: "correct", label: "Answered correctly", score: 1 },
        { value: "incorrect", label: "Did not answer correctly", score: 0 }
      ]
    },
    // Delayed Recall (5 points total)
    {
      section: "Delayed Recall",
      question: "Memory Recall: Ask patient to recall the words with no cue (\"Face\", \"Velvet\", \"Church\", \"Daisy\", \"Red\")",
      note: "These words should have been presented earlier in the assessment",
      options: [
        { value: "5_words", label: "Recalled all 5 words", score: 5 },
        { value: "4_words", label: "Recalled 4 words", score: 4 },
        { value: "3_words", label: "Recalled 3 words", score: 3 },
        { value: "2_words", label: "Recalled 2 words", score: 2 },
        { value: "1_word", label: "Recalled 1 word", score: 1 },
        { value: "0_words", label: "Did not recall any words", score: 0 }
      ]
    },
    // Orientation (6 points total)
    {
      section: "Orientation",
      question: "Orientation: Ask patient the date, month, year, day, place, and city",
      options: [
        { value: "all_correct", label: "All 6 correct", score: 6 },
        { value: "5_correct", label: "5 correct", score: 5 },
        { value: "4_correct", label: "4 correct", score: 4 },
        { value: "3_correct", label: "3 correct", score: 3 },
        { value: "2_correct", label: "2 correct", score: 2 },
        { value: "1_correct", label: "1 correct", score: 1 },
        { value: "none_correct", label: "None correct", score: 0 }
      ]
    }
  ];

  const handleAnswer = (questionIndex: number, value: string) => {
    setAnswers({
      ...answers,
      [questionIndex]: value
    });
  };

  const handleMultiSelectAnswer = (questionIndex: number, optionValue: string, checked: boolean) => {
    const currentAnswers = answers[questionIndex] ? answers[questionIndex].split(',') : [];
    let newAnswers;
    
    if (checked) {
      newAnswers = [...currentAnswers, optionValue];
    } else {
      newAnswers = currentAnswers.filter(a => a !== optionValue);
    }
    
    setAnswers({
      ...answers,
      [questionIndex]: newAnswers.join(',')
    });
  };

  const calculateScore = (): MoCAScore => {
    const score: MoCAScore = {
      education: 0,
      visuospatialExecutive: 0,
      naming: 0,
      attention: 0,
      language: 0,
      abstraction: 0,
      delayedRecall: 0,
      orientation: 0
    };

    questions.forEach((question, index) => {
      const answer = answers[index];
      if (!answer) return;

      if (question.multiSelect) {
        const selectedAnswers = answer.split(',');
        const totalScore = selectedAnswers.reduce((sum, selectedAnswer) => {
          const option = question.options.find(opt => opt.value === selectedAnswer);
          return sum + (option?.score || 0);
        }, 0);
        
        if (question.section === "Naming") {
          score.naming += totalScore;
        }
      } else {
        const selectedOption = question.options.find(opt => opt.value === answer);
        const points = selectedOption?.score || 0;

        switch (question.section) {
          case "Education Adjustment":
            score.education += points;
            break;
          case "Visuospatial/Executive":
            score.visuospatialExecutive += points;
            break;
          case "Naming":
            score.naming += points;
            break;
          case "Attention":
            score.attention += points;
            break;
          case "Language":
            score.language += points;
            break;
          case "Abstraction":
            score.abstraction += points;
            break;
          case "Delayed Recall":
            score.delayedRecall += points;
            break;
          case "Orientation":
            score.orientation += points;
            break;
        }
      }
    });

    return score;
  };

  const getTotalScore = () => {
    const score = calculateScore();
    return (
      score.visuospatialExecutive +
      score.naming +
      score.attention +
      score.language +
      score.abstraction +
      score.delayedRecall +
      score.orientation +
      score.education
    );
  };

  const getInterpretation = (totalScore: number) => {
    if (totalScore >= 26) {
      return {
        level: "Normal",
        description: "Score suggests normal cognitive function",
        severity: "normal" as const
      };
    } else if (totalScore >= 18) {
      return {
        level: "Mild Cognitive Impairment",
        description: "Score suggests mild cognitive impairment. Further assessment recommended.",
        severity: "mild" as const
      };
    } else {
      return {
        level: "Significant Cognitive Impairment",
        description: "Score suggests significant cognitive impairment. Comprehensive evaluation needed.",
        severity: "severe" as const
      };
    }
  };

  const nextStep = () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetAssessment = () => {
    setCurrentStep(1);
    setAnswers({});
    setShowResults(false);
  };

  const currentQuestion = questions[currentStep - 1];
  const totalScore = getTotalScore();
  const interpretation = getInterpretation(totalScore);
  const score = calculateScore();

  // Show disclaimer first when assessment opens
  if (currentStep === 0 && Object.keys(answers).length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Montreal Cognitive Assessment (MoCA) - Instructions</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About the MoCA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The MoCA was initially derived by Nasreddine et al 2005 in a cohort of 94 patients with mild cognitive impairment (MCI), 93 with mild Alzheimer's disease, and 90 healthy controls. The authors found that at a cutoff score of 26, the MoCA identified 90% of patients with mild cognitive impairment, compared with 18% for the reference standard at the time (MMSE). The MoCA was also 87% specific at the same cutoff.
                </p>
                <p className="text-sm text-muted-foreground">
                  To be used as a screening tool for adults with self or family reported concerns of cognitive impairment not explained by an alternative medical or psychiatric condition. This score identifies the mild cognitive impairment that may precede various forms of dementia, but does not diagnose specific dementia subtypes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Important Notes:</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>This assessment should be administered by a trained healthcare professional</li>
                    <li>Ensure patient is comfortable and the environment is quiet</li>
                    <li>Have paper and pencil available for drawing tasks</li>
                    <li>The memory words should be read early in the assessment and recalled later</li>
                    <li>Total administration time is approximately 10 minutes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Disclaimer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Medical Disclaimer:</strong> This assessment tool is for screening purposes only and should not be used as a sole diagnostic instrument. Results should be interpreted by qualified healthcare professionals in conjunction with clinical judgment and other diagnostic information. This tool does not replace comprehensive neuropsychological evaluation or clinical assessment.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setCurrentStep(1)}
                className="bg-primary text-primary-foreground"
              >
                Begin Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showResults) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>MoCA Assessment Results</DialogTitle>
            {clientName && (
              <p className="text-sm text-muted-foreground">Client: {clientName}</p>
            )}
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-center">
                    {totalScore}/30
                  </div>
                  <div className="text-center mt-2">
                    <Badge 
                      variant={
                        interpretation.severity === "normal" ? "default" :
                        interpretation.severity === "mild" ? "secondary" : "destructive"
                      }
                    >
                      {interpretation.level}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interpretation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{interpretation.description}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Domain Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <strong>Visuospatial/Executive:</strong>
                    <div>{score.visuospatialExecutive}/5</div>
                  </div>
                  <div>
                    <strong>Naming:</strong>
                    <div>{score.naming}/3</div>
                  </div>
                  <div>
                    <strong>Attention:</strong>
                    <div>{score.attention}/6</div>
                  </div>
                  <div>
                    <strong>Language:</strong>
                    <div>{score.language}/3</div>
                  </div>
                  <div>
                    <strong>Abstraction:</strong>
                    <div>{score.abstraction}/2</div>
                  </div>
                  <div>
                    <strong>Delayed Recall:</strong>
                    <div>{score.delayedRecall}/5</div>
                  </div>
                  <div>
                    <strong>Orientation:</strong>
                    <div>{score.orientation}/6</div>
                  </div>
                  <div>
                    <strong>Education Bonus:</strong>
                    <div>+{score.education}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Clinical Notes:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>A score of 26 or above is considered normal</li>
                <li>Scores below 26 may indicate mild cognitive impairment</li>
                <li>This assessment should be followed by comprehensive clinical evaluation</li>
                <li>Consider cultural and educational factors when interpreting results</li>
              </ul>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={resetAssessment}>
                Start New Assessment
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Montreal Cognitive Assessment (MoCA) - Question {currentStep} of {questions.length}
          </DialogTitle>
          {clientName && (
            <p className="text-sm text-muted-foreground">Client: {clientName}</p>
          )}
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Badge variant="outline">{currentQuestion.section}</Badge>
            <div className="text-sm text-muted-foreground">
              Progress: {currentStep}/{questions.length}
            </div>
          </div>

          <Separator />

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">
                {currentQuestion.question}
              </h3>
              
              {currentQuestion.note && (
                <p className="text-sm text-muted-foreground mb-4">
                  {currentQuestion.note}
                </p>
              )}

              {currentQuestion.image && (
                <div className="mb-6 flex justify-center">
                  <img 
                    src={currentQuestion.image} 
                    alt="Assessment visual"
                    className="max-w-full h-auto border rounded-lg"
                  />
                </div>
              )}

              {currentQuestion.multiSelect ? (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const currentAnswers = answers[currentStep] ? answers[currentStep].split(',') : [];
                    const isChecked = currentAnswers.includes(option.value);
                    
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`option-${index}`}
              checked={isChecked}
              onChange={(e) => handleMultiSelectAnswer(currentStep - 1, option.value, e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor={`option-${index}`} className="flex-1">
                          {option.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <RadioGroup
                  value={answers[currentStep - 1] || ""}
                  onValueChange={(value) => handleAnswer(currentStep - 1, value)}
                >
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={!answers[currentStep - 1]}
            >
              {currentStep === questions.length ? "Complete Assessment" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Create a wrapper component that starts with disclaimer
export const MoCAAssessmentWithDisclaimer = (props: MoCAAssessmentProps) => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  if (showDisclaimer) {
    return (
      <MoCAAssessment
        {...props}
        // Override currentStep to show disclaimer first
      />
    );
  }

  return <MoCAAssessment {...props} />;
};