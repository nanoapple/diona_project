import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface PCL5AssessmentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName?: string;
}

const PCL5_QUESTIONS = [
  "For each of the subsequent questions, you'll be asked to answer the following question \"In the past month, how much were you bothered by...\"",
  "Repeated, disturbing, and unwanted memories of the stressful experience?",
  "Repeated, disturbing dreams of the stressful experience?",
  "Suddenly feeling or acting as if the stressful experience were actually happening again (as if you were actually back there reliving it)?",
  "Feeling very upset when something reminded you of the stressful experience?",
  "Having strong physical reactions when something reminded you of the stressful experience (for example, heart pounding, trouble breathing, sweating)?",
  "Avoiding memories, thoughts, or feelings related to the stressful experience?",
  "Avoiding external reminders of the stressful experience (for example, people, places, conversations, activities, objects, or situations)?",
  "Trouble remembering important parts of the stressful experience?",
  "Having strong negative beliefs about yourself, other people, or the world (for example, having thoughts such as: I am bad, there is something seriously wrong with me, no one can be trusted, the world is completely dangerous)?",
  "Blaming yourself or someone else for the stressful experience or what happened after it?",
  "Having strong negative feelings such as fear, horror, anger, guilt, or shame?",
  "Loss of interest in activities that you used to enjoy?",
  "Feeling distant or cut off from other people?",
  "Trouble experiencing positive feelings (for example, being unable to feel happiness or have loving feelings for people close to you)?",
  "Irritable behavior, angry outbursts, or acting aggressively?",
  "Taking too many risks or doing things that could cause you harm?",
  "Being \"superalert\" or watchful or on guard?",
  "Feeling jumpy or easily startled?",
  "Having difficulty concentrating?",
  "Trouble falling or staying asleep?"
];

const ANSWER_OPTIONS = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "A little bit" },
  { value: "2", label: "Moderately" },
  { value: "3", label: "Quite a bit" },
  { value: "4", label: "Extremely" }
];

export const PCL5Assessment = ({ open, onOpenChange, clientName }: PCL5AssessmentProps) => {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const totalQuestions = PCL5_QUESTIONS.length;
  const progress = (currentQuestion / totalQuestions) * 100;

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion === 0) {
      // First question is just instructions
      setCurrentQuestion(1);
      return;
    }

    if (!answers[currentQuestion]) {
      toast({
        title: "Please select an answer",
        description: "You must select an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + parseInt(value), 0);
    setShowResults(true);
    
    toast({
      title: "Assessment Completed",
      description: `PCL-5 assessment completed for ${clientName || 'client'}.`,
    });
  };

  const getScoreInterpretation = () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + parseInt(value), 0);
    
    if (totalScore >= 33) {
      return {
        level: "High",
        description: "Score suggests probable PTSD. Professional evaluation recommended.",
        color: "text-red-600"
      };
    } else if (totalScore >= 31) {
      return {
        level: "Moderate-High",
        description: "Score suggests possible PTSD. Further assessment may be warranted.",
        color: "text-orange-600"
      };
    } else {
      return {
        level: "Low",
        description: "Score below typical PTSD threshold.",
        color: "text-green-600"
      };
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleClose = () => {
    resetAssessment();
    onOpenChange(false);
  };

  if (showResults) {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + parseInt(value), 0);
    const interpretation = getScoreInterpretation();

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>PCL-5 Assessment Results</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Results for {clientName || 'Client'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{totalScore}</div>
                  <div className="text-sm text-muted-foreground">Total Score (0-80)</div>
                </div>
                
                <div className={`text-center ${interpretation.color}`}>
                  <div className="text-xl font-semibold">{interpretation.level}</div>
                  <div className="text-sm mt-2">{interpretation.description}</div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Scoring Information:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Score 0-30: Below PTSD threshold</li>
                    <li>• Score 31-32: Possible PTSD</li>
                    <li>• Score 33+: Probable PTSD</li>
                    <li>• 5+ point change: Indicates treatment response</li>
                    <li>• 10+ point change: Clinically meaningful improvement</li>
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> The PCL-5 is a screening tool and should not be used as a stand-alone diagnostic instrument. 
                    Professional clinical evaluation is recommended for definitive diagnosis.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={resetAssessment} variant="outline" className="flex-1">
                Retake Assessment
              </Button>
              <Button onClick={handleClose} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>PCL-5: Post-Traumatic Stress Disorder Assessment</DialogTitle>
          <div className="text-sm text-muted-foreground">
            20 questions that assess DSM-5 symptoms of PTSD for {clientName || 'client'}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {totalQuestions}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="text-lg font-medium leading-relaxed">
                  {currentQuestion === 0 ? (
                    <div className="text-center space-y-4">
                      <div className="text-xl font-semibold">Instructions</div>
                      <div className="text-base">
                        For each of the following questions, you'll be asked to answer:
                      </div>
                      <div className="text-lg font-medium bg-muted p-4 rounded-lg">
                        "In the past month, how much were you bothered by..."
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Please select the answer that best describes how much you were bothered by each symptom.
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4 text-sm text-muted-foreground">
                        In the past month, how much were you bothered by...
                      </div>
                      <div className="text-lg">
                        {PCL5_QUESTIONS[currentQuestion]}
                      </div>
                    </div>
                  )}
                </div>

                {currentQuestion > 0 && (
                  <RadioGroup
                    value={answers[currentQuestion] || ""}
                    onValueChange={handleAnswer}
                    className="space-y-3"
                  >
                    {ANSWER_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                        <Label 
                          htmlFor={`option-${option.value}`} 
                          className="flex-1 cursor-pointer text-base"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button 
              onClick={handlePrevious} 
              variant="outline"
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            <Button onClick={handleNext}>
              {currentQuestion === totalQuestions - 1 ? 'Complete Assessment' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};