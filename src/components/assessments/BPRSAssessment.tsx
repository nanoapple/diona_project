import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BPRSAssessmentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName?: string;
}

interface Question {
  id: number;
  text: string;
  description: string;
  options: { text: string; value: number }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "Somatic Concern",
    description: "Degree of concern over present bodily health. Rate the degree to which physical health is perceived as a problem by the individual, whether complaints have realistic bases or not.",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  },
  {
    id: 2,
    text: "Anxiety",
    description: "Worry, fear, over-concern for present or future, uneasiness.",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  },
  {
    id: 3,
    text: "Emotional Withdrawal",
    description: "Lack of spontaneous interaction, isolation deficiency in relating to others.",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  },
  {
    id: 4,
    text: "Conceptual Disorganization",
    description: "Thought processes confused, disconnected, disorganized, disrupted.",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  },
  {
    id: 5,
    text: "Guilt",
    description: "Self-blame, shame, remorse for past behavior.",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  },
  {
    id: 6,
    text: "Tension",
    description: "Physical and motor manifestations of nervousness, over-activation.",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  },
  {
    id: 7,
    text: "Mannerisms and Posturing",
    description: "Peculiar, bizarre unnatural motor behavior (not including tics).",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  },
  {
    id: 8,
    text: "Grandiosity",
    description: "Exaggerated self-esteem, arrogance, conviction of unusual power or abilities.",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  },
  {
    id: 9,
    text: "Depression",
    description: "Sorrow, sadness, despondency, pessimism.",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  },
  {
    id: 10,
    text: "Hostility",
    description: "Animosity, contempt, belligerence, disdain for others.",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  },
  {
    id: 11,
    text: "Suspiciousness",
    description: "Mistrust, belief others harbor malicious or discriminatory intent.",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  },
  {
    id: 12,
    text: "Hallucinations",
    description: "Perceptions without corresponding reality stimulus.",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  },
  {
    id: 13,
    text: "Motor Retardation",
    description: "Slowed weakened movements or speech, reduced body tone.",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  },
  {
    id: 14,
    text: "Uncooperativeness",
    description: "Resistance, guardedness, rejection of authority.",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  },
  {
    id: 15,
    text: "Unusual Thought Content",
    description: "Unusual, odd, strange, bizarre thought content.",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  },
  {
    id: 16,
    text: "Blunted Affect",
    description: "Reduced emotional responsiveness, diminished affect.",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  },
  {
    id: 17,
    text: "Excitement",
    description: "Heightened emotional tone, agitation, increased reactivity.",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  },
  {
    id: 18,
    text: "Disorientation",
    description: "Confusion or lack of proper association for person, place, or time.",
    options: [
      { text: "Not assessed", value: 0 },
      { text: "Not present", value: 1 },
      { text: "Very mild", value: 2 },
      { text: "Mild", value: 3 },
      { text: "Moderate", value: 4 },
      { text: "Moderately severe", value: 5 },
      { text: "Severe", value: 6 },
      { text: "Extremely severe", value: 7 }
    ]
  }
];

export const BPRSAssessment = ({ open, onOpenChange, clientName }: BPRSAssessmentProps) => {
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
    return Object.values(answers).reduce((total, score) => total + score, 0);
  };

  const getInterpretation = (score: number) => {
    if (score <= 30) {
      return {
        level: "Minimal Symptoms",
        description: "Scores indicate minimal psychiatric symptoms.",
        recommendation: "No immediate intervention required. Continue monitoring.",
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      };
    } else if (score <= 40) {
      return {
        level: "Mild Symptoms",
        description: "Mild level of psychiatric symptoms present.",
        recommendation: "Consider further assessment and monitoring. Mild intervention may be beneficial.",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      };
    } else if (score <= 52) {
      return {
        level: "Moderate Symptoms",
        description: "Moderate level of psychiatric symptoms that require attention.",
        recommendation: "Treatment intervention recommended. Regular monitoring advised.",
        color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      };
    } else {
      return {
        level: "Severe Symptoms",
        description: "Significant psychiatric symptoms requiring immediate attention.",
        recommendation: "Immediate treatment intervention required. Close monitoring and comprehensive care needed.",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
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
    const score = calculateScore();
    const interpretation = getInterpretation(score);

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>BPRS Assessment Results</DialogTitle>
            {clientName && (
              <div className="text-sm text-muted-foreground">Client: {clientName}</div>
            )}
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-primary">{score}</div>
              <div className="text-lg text-muted-foreground">Total Score (out of 126)</div>
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
                <h4 className="font-medium mb-2">Scoring Guidelines:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 18-30: Minimal symptoms</li>
                  <li>• 31-40: Mild symptoms</li>
                  <li>• 41-52: Moderate symptoms</li>
                  <li>• 53+: Severe symptoms</li>
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
          <DialogTitle>BPRS Assessment</DialogTitle>
          {clientName && (
            <div className="text-sm text-muted-foreground">Client: {clientName}</div>
          )}
          <div className="text-sm text-muted-foreground">
            Brief Psychiatric Rating Scale
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
              <div className="text-xl font-semibold">About the BPRS</div>
              <div className="space-y-4 text-left">
                <p className="text-muted-foreground">
                  The Brief Psychiatric Rating Scale (BPRS) is an 18-item scale used to measure psychiatric symptoms such as depression, 
                  anxiety, hallucinations, psychosis and unusual behaviour. It is one of the oldest, most widely used scales to measure psychotic symptoms.
                </p>
                <p className="text-muted-foreground">
                  The BPRS should be administered by a clinician knowledgeable about symptom domains and severe mental health disorders. 
                  It is particularly useful in gauging the efficacy of treatment in patients who have moderate to severe psychoses.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Instructions:</h4>
                  <p className="text-sm text-muted-foreground">
                    Rate each item based on your clinical observation and patient interview. 
                    Each item is rated from 1 (not present) to 7 (extremely severe).
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium leading-relaxed">
                {currentQuestionData.text}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentQuestionData.description}
              </p>

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