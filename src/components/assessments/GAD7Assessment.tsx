import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GAD7AssessmentProps {
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
    text: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 }
    ]
  },
  {
    id: 2,
    text: "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 }
    ]
  },
  {
    id: 3,
    text: "Over the last 2 weeks, how often have you been bothered by worrying too much about different things?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 }
    ]
  },
  {
    id: 4,
    text: "Over the last 2 weeks, how often have you been bothered by trouble relaxing?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 }
    ]
  },
  {
    id: 5,
    text: "Over the last 2 weeks, how often have you been bothered by being so restless that it is hard to sit still?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 }
    ]
  },
  {
    id: 6,
    text: "Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 }
    ]
  },
  {
    id: 7,
    text: "Over the last 2 weeks, how often have you been bothered by feeling afraid as if something awful might happen?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 }
    ]
  }
];

export const GAD7Assessment = ({ open, onOpenChange, clientName }: GAD7AssessmentProps) => {
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
    if (score < 5) {
      return {
        level: "Minimal Anxiety",
        description: "Your score suggests minimal anxiety symptoms.",
        recommendation: "No treatment recommended. Continue with normal activities and stress management techniques.",
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      };
    } else if (score <= 9) {
      return {
        level: "Mild Anxiety",
        description: "Your score suggests mild anxiety symptoms.",
        recommendation: "Watchful waiting. Consider stress management techniques, relaxation exercises, or lifestyle modifications.",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      };
    } else if (score <= 14) {
      return {
        level: "Moderate Anxiety",
        description: "Your score suggests moderate anxiety symptoms that may benefit from treatment.",
        recommendation: "Consider counseling, therapy, or other professional treatment. Active treatment and monitoring recommended.",
        color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      };
    } else {
      return {
        level: "Severe Anxiety",
        description: "Your score suggests severe anxiety symptoms requiring immediate attention.",
        recommendation: "Active treatment strongly recommended. Consider immediate professional consultation for therapy and/or medication.",
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
            <DialogTitle>GAD-7 Assessment Results</DialogTitle>
            {clientName && (
              <div className="text-sm text-muted-foreground">Client: {clientName}</div>
            )}
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-primary">{score}</div>
              <div className="text-lg text-muted-foreground">Total Score (out of 21)</div>
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
                  <li>• 0-4: Minimal anxiety</li>
                  <li>• 5-9: Mild anxiety</li>
                  <li>• 10-14: Moderate anxiety</li>
                  <li>• 15-21: Severe anxiety</li>
                </ul>
                <div className="mt-2 text-xs text-muted-foreground">
                  Note: For GAD diagnosis, sensitivity is 89% and specificity is 82% with a cut-off score of 10.
                </div>
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
          <DialogTitle>GAD-7 Assessment</DialogTitle>
          {clientName && (
            <div className="text-sm text-muted-foreground">Client: {clientName}</div>
          )}
          <div className="text-sm text-muted-foreground">
            Generalized Anxiety Disorder 7-item Scale
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