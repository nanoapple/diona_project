import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MDQAssessmentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName?: string;
}

interface Question {
  id: number;
  text: string;
  options: { text: string; value: number }[];
  type?: "binary" | "severity";
}

const questions: Question[] = [
  {
    id: 1,
    text: "Has there ever been a period of time when you were not your usual self and you felt so good or so hyper that other people thought you were not your normal self or you were so hyper that you got into trouble?",
    options: [
      { text: "Yes", value: 1 },
      { text: "No", value: 0 }
    ],
    type: "binary"
  },
  {
    id: 2,
    text: "Has there ever been a period of time when you were not your usual self and you were so irritable that you shouted at people or started fights or arguments?",
    options: [
      { text: "Yes", value: 1 },
      { text: "No", value: 0 }
    ],
    type: "binary"
  },
  {
    id: 3,
    text: "Has there ever been a period of time when you were not your usual self and you felt much more self-confident than usual?",
    options: [
      { text: "Yes", value: 1 },
      { text: "No", value: 0 }
    ],
    type: "binary"
  },
  {
    id: 4,
    text: "Has there ever been a period of time when you were not your usual self and you got much less sleep than usual and found you didn't really miss it?",
    options: [
      { text: "Yes", value: 1 },
      { text: "No", value: 0 }
    ],
    type: "binary"
  },
  {
    id: 5,
    text: "Has there ever been a period of time when you were not your usual self and you were much more talkative or spoke faster than usual?",
    options: [
      { text: "Yes", value: 1 },
      { text: "No", value: 0 }
    ],
    type: "binary"
  },
  {
    id: 6,
    text: "Has there ever been a period of time when you were not your usual self and thoughts raced through your head or you couldn't slow your mind down?",
    options: [
      { text: "Yes", value: 1 },
      { text: "No", value: 0 }
    ],
    type: "binary"
  },
  {
    id: 7,
    text: "Has there ever been a period of time when you were not your usual self and you were so easily distracted by things around you that you had trouble concentrating or staying on track?",
    options: [
      { text: "Yes", value: 1 },
      { text: "No", value: 0 }
    ],
    type: "binary"
  },
  {
    id: 8,
    text: "Has there ever been a period of time when you were not your usual self and you had much more energy than usual?",
    options: [
      { text: "Yes", value: 1 },
      { text: "No", value: 0 }
    ],
    type: "binary"
  },
  {
    id: 9,
    text: "Has there ever been a period of time when you were not your usual self and you were much more active or did many more things than usual?",
    options: [
      { text: "Yes", value: 1 },
      { text: "No", value: 0 }
    ],
    type: "binary"
  },
  {
    id: 10,
    text: "Has there ever been a period of time when you were not your usual self and you were much more social or outgoing than usual, for example, you telephoned friends in the middle of the night?",
    options: [
      { text: "Yes", value: 1 },
      { text: "No", value: 0 }
    ],
    type: "binary"
  },
  {
    id: 11,
    text: "Has there ever been a period of time when you were not your usual self and you were much more interested in sex than usual?",
    options: [
      { text: "Yes", value: 1 },
      { text: "No", value: 0 }
    ],
    type: "binary"
  },
  {
    id: 12,
    text: "Has there ever been a period of time when you were not your usual self and you did things that were unusual for you or that other people might have thought were excessive, foolish, or risky?",
    options: [
      { text: "Yes", value: 1 },
      { text: "No", value: 0 }
    ],
    type: "binary"
  },
  {
    id: 13,
    text: "Has there ever been a period of time when you were not your usual self and spending money got you or your family in trouble?",
    options: [
      { text: "Yes", value: 1 },
      { text: "No", value: 0 }
    ],
    type: "binary"
  },
  {
    id: 14,
    text: "If you checked YES to more than one of the above, have several of these ever happened during the same period of time?",
    options: [
      { text: "Yes", value: 1 },
      { text: "No", value: 0 }
    ],
    type: "binary"
  },
  {
    id: 15,
    text: "How much of a problem did any of these cause you — like being able to work; having family, money, or legal troubles; getting into arguments or fights?",
    options: [
      { text: "No problem", value: 0 },
      { text: "Minor problem", value: 1 },
      { text: "Moderate problem", value: 2 },
      { text: "Serious problem", value: 3 }
    ],
    type: "severity"
  }
];

export const MDQAssessment = ({ open, onOpenChange, clientName }: MDQAssessmentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(-1); // Start with instruction page
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion === -1) {
      setCurrentQuestion(0);
      return;
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > -1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    // Count positive responses to questions 1-13
    const symptomScore = Object.entries(answers)
      .filter(([key, value]) => parseInt(key) <= 13 && value === 1)
      .length;

    const coOccurrence = answers[14] === 1;
    const functionalImpairment = answers[15] >= 2; // Moderate or serious problem

    return {
      symptomScore,
      coOccurrence,
      functionalImpairment,
      totalCriteria: symptomScore >= 7 && coOccurrence && functionalImpairment
    };
  };

  const getInterpretation = (result: any) => {
    if (result.totalCriteria) {
      return {
        level: "Positive Screen",
        description: "Screen suggests possible bipolar disorder. All three criteria are met: 7+ symptoms, co-occurrence, and functional impairment.",
        recommendation: "Comprehensive clinical assessment for bipolar disorder is strongly recommended. This screening tool is not diagnostic but indicates significant risk.",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      };
    } else if (result.symptomScore >= 7 && result.coOccurrence) {
      return {
        level: "Partial Positive",
        description: "Many symptoms present with co-occurrence but minimal functional impairment reported.",
        recommendation: "Clinical evaluation recommended. Monitor for mood episodes and functional changes.",
        color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      };
    } else if (result.symptomScore >= 4) {
      return {
        level: "Some Symptoms",
        description: "Some manic/hypomanic symptoms reported but does not meet full screening criteria.",
        recommendation: "Consider monitoring mood patterns. If symptoms worsen or cause impairment, seek clinical consultation.",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      };
    } else {
      return {
        level: "Negative Screen",
        description: "Screening does not suggest bipolar disorder at this time.",
        recommendation: "Continue routine monitoring. If mood symptoms develop, consider rescreening.",
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      };
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(-1);
    setAnswers({});
    setShowResults(false);
  };

  const handleClose = () => {
    resetAssessment();
    onOpenChange(false);
  };

  const progress = currentQuestion === -1 ? 0 : ((currentQuestion + 1) / questions.length) * 100;
  const currentQuestionData = currentQuestion >= 0 ? questions[currentQuestion] : null;
  const canProceed = currentQuestion === -1 || (currentQuestionData && answers[currentQuestionData.id] !== undefined);

  if (showResults) {
    const result = calculateScore();
    const interpretation = getInterpretation(result);

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>MDQ Assessment Results</DialogTitle>
            {clientName && (
              <div className="text-sm text-muted-foreground">Client: {clientName}</div>
            )}
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{result.symptomScore}</div>
                  <div className="text-sm text-muted-foreground">Symptoms</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{result.coOccurrence ? "Yes" : "No"}</div>
                  <div className="text-sm text-muted-foreground">Co-occurrence</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{result.functionalImpairment ? "Yes" : "No"}</div>
                  <div className="text-sm text-muted-foreground">Impairment</div>
                </div>
              </div>
              <Badge className={interpretation.color} variant="secondary">
                {interpretation.level}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Interpretation</h3>
                <p className="text-muted-foreground">{interpretation.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Recommendation</h3>
                <p className="text-muted-foreground">{interpretation.recommendation}</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Screening Criteria:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Positive screen requires all three criteria:</li>
                  <li>  - 7 or more manic/hypomanic symptoms</li>
                  <li>  - Several symptoms occurred during the same period</li>
                  <li>  - Moderate to serious functional impairment</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={resetAssessment} variant="outline" className="flex-1">
                Take Again
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>MDQ Assessment</DialogTitle>
          {clientName && (
            <div className="text-sm text-muted-foreground">Client: {clientName}</div>
          )}
          <div className="text-sm text-muted-foreground">
            Mood Disorder Questionnaire
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{currentQuestion === -1 ? "Instructions" : `Question ${currentQuestion + 1} of ${questions.length}`}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {currentQuestion === -1 ? (
            <div className="space-y-6 text-center">
              <div className="text-xl font-semibold">About the MDQ</div>
              <div className="space-y-4 text-left">
                <p className="text-muted-foreground">
                  The Mood Disorder Questionnaire (MDQ) was developed as a screening instrument for bipolar spectrum disorders. 
                  It includes 13 yes/no questions about bipolar symptoms and two additional questions about symptom co-occurrence and impaired functioning.
                </p>
                <p className="text-muted-foreground">
                  The MDQ takes about 5 minutes to complete and is most supported for use as a screening tool in Bipolar I disorder. 
                  Any positive screening should be followed up with a comprehensive clinical assessment.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Instructions:</h4>
                  <p className="text-sm text-muted-foreground">
                    Please answer each question as honestly as possible. Think about times when you were in a "high" mood or felt very energetic.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium leading-relaxed">
                {currentQuestionData.text}
              </h3>

              <RadioGroup
                value={answers[currentQuestionData.id]?.toString() || ""}
                onValueChange={(value) => handleAnswer(currentQuestionData.id, parseInt(value))}
                className="space-y-3"
              >
                {currentQuestionData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={option.value.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === -1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed}
            >
              {currentQuestion === questions.length - 1 ? "View Results" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};