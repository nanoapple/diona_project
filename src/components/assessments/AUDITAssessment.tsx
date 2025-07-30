import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AUDITAssessmentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName?: string;
}

interface Question {
  id: number;
  text: string;
  options: { text: string; value: number }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "How often do you have a drink containing alcohol?",
    options: [
      { text: "Never", value: 0 },
      { text: "Monthly or less", value: 1 },
      { text: "2-4 times a month", value: 2 },
      { text: "2-3 times a week", value: 3 },
      { text: "4 or more times a week", value: 4 }
    ]
  },
  {
    id: 2,
    text: "How many standard drinks containing alcohol do you have on a typical day when drinking?",
    options: [
      { text: "1 or 2", value: 0 },
      { text: "3 or 4", value: 1 },
      { text: "5 or 6", value: 2 },
      { text: "7 to 9", value: 3 },
      { text: "10 or more", value: 4 }
    ]
  },
  {
    id: 3,
    text: "How often do you have six or more drinks on one occasion?",
    options: [
      { text: "Never", value: 0 },
      { text: "Less than monthly", value: 1 },
      { text: "Monthly", value: 2 },
      { text: "Weekly", value: 3 },
      { text: "Daily or almost daily", value: 4 }
    ]
  },
  {
    id: 4,
    text: "During the past year, how often have you found that you were not able to stop drinking once you had started?",
    options: [
      { text: "Never", value: 0 },
      { text: "Less than monthly", value: 1 },
      { text: "Monthly", value: 2 },
      { text: "Weekly", value: 3 },
      { text: "Daily or almost daily", value: 4 }
    ]
  },
  {
    id: 5,
    text: "During the past year, how often have you failed to do what was normally expected of you because of drinking?",
    options: [
      { text: "Never", value: 0 },
      { text: "Less than monthly", value: 1 },
      { text: "Monthly", value: 2 },
      { text: "Weekly", value: 3 },
      { text: "Daily or almost daily", value: 4 }
    ]
  },
  {
    id: 6,
    text: "During the past year, how often have you needed a drink in the morning to get yourself going after a heavy drinking session?",
    options: [
      { text: "Never", value: 0 },
      { text: "Less than monthly", value: 1 },
      { text: "Monthly", value: 2 },
      { text: "Weekly", value: 3 },
      { text: "Daily or almost daily", value: 4 }
    ]
  },
  {
    id: 7,
    text: "During the past year, how often have you had a feeling of guilt or remorse after drinking?",
    options: [
      { text: "Never", value: 0 },
      { text: "Less than monthly", value: 1 },
      { text: "Monthly", value: 2 },
      { text: "Weekly", value: 3 },
      { text: "Daily or almost daily", value: 4 }
    ]
  },
  {
    id: 8,
    text: "During the past year, how often have you been unable to remember what happened the night before because you had been drinking?",
    options: [
      { text: "Never", value: 0 },
      { text: "Less than monthly", value: 1 },
      { text: "Monthly", value: 2 },
      { text: "Weekly", value: 3 },
      { text: "Daily or almost daily", value: 4 }
    ]
  },
  {
    id: 9,
    text: "Have you or someone else been injured as a result of your drinking?",
    options: [
      { text: "No", value: 0 },
      { text: "Yes, but not in the past year", value: 2 },
      { text: "Yes, during the past year", value: 4 }
    ]
  },
  {
    id: 10,
    text: "Has a relative or friend, doctor or other health worker been concerned about your drinking or suggested you cut down?",
    options: [
      { text: "No", value: 0 },
      { text: "Yes, but not in the past year", value: 2 },
      { text: "Yes, during the past year", value: 4 }
    ]
  }
];

export const AUDITAssessment = ({ open, onOpenChange, clientName }: AUDITAssessmentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((total, score) => total + score, 0);
  };

  const getInterpretation = (score: number) => {
    if (score < 8) {
      return {
        level: "Low Risk",
        description: "Your drinking is likely not harmful to your health at this time.",
        recommendation: "Continue to drink responsibly and within recommended guidelines.",
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      };
    } else if (score <= 15) {
      return {
        level: "Hazardous Drinking",
        description: "Your drinking pattern puts you at risk for health problems.",
        recommendation: "Consider reducing your alcohol consumption. Simple advice focused on reduction of hazardous drinking is recommended.",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      };
    } else if (score <= 19) {
      return {
        level: "Harmful Drinking",
        description: "Your drinking is likely causing harm to your health.",
        recommendation: "Brief counseling and continued monitoring are suggested. Consider seeking professional help.",
        color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      };
    } else {
      return {
        level: "Alcohol Dependence",
        description: "Your drinking pattern suggests possible alcohol dependence.",
        recommendation: "Further diagnostic evaluation for alcohol dependence is warranted. Please seek professional help immediately.",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
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

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestion];
  const canProceed = answers[currentQuestionData?.id] !== undefined;

  if (showResults) {
    const score = calculateScore();
    const interpretation = getInterpretation(score);

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AUDIT Assessment Results</DialogTitle>
            {clientName && (
              <div className="text-sm text-muted-foreground">Client: {clientName}</div>
            )}
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-primary">{score}</div>
              <div className="text-lg text-muted-foreground">Total Score (out of 40)</div>
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
                  <li>• 0-7: Low risk drinking</li>
                  <li>• 8-15: Hazardous drinking (simple advice recommended)</li>
                  <li>• 16-19: Harmful drinking (brief counseling recommended)</li>
                  <li>• 20+: Possible alcohol dependence (diagnostic evaluation recommended)</li>
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
          <DialogTitle>AUDIT Assessment</DialogTitle>
          {clientName && (
            <div className="text-sm text-muted-foreground">Client: {clientName}</div>
          )}
          <div className="text-sm text-muted-foreground">
            Alcohol Use Disorders Identification Test
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

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

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
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