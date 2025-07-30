import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EPDSAssessmentProps {
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
    text: "In the past 7 days, how much have you been able to laugh and see the funny side of things?",
    options: [
      { text: "As much as I always could", value: 0 },
      { text: "Not quite so much now", value: 1 },
      { text: "Definitely not so much now", value: 2 },
      { text: "Not at all", value: 3 }
    ]
  },
  {
    id: 2,
    text: "In the past 7 days, how much have you looked forward with enjoyment to things?",
    options: [
      { text: "As much as I ever did", value: 0 },
      { text: "Rather less than I used to", value: 1 },
      { text: "Definitely less than I used to", value: 2 },
      { text: "Hardly at all", value: 3 }
    ]
  },
  {
    id: 3,
    text: "In the past 7 days, how much have you blamed yourself unnecessarily when things went wrong?",
    options: [
      { text: "Never", value: 0 },
      { text: "Not very often", value: 1 },
      { text: "Yes, some of the time", value: 2 },
      { text: "Yes, most of the time", value: 3 }
    ]
  },
  {
    id: 4,
    text: "In the past 7 days, how much have you felt anxious or worried for no good reason?",
    options: [
      { text: "No, not at all", value: 0 },
      { text: "Hardly ever", value: 1 },
      { text: "Yes, sometimes", value: 2 },
      { text: "Yes, very often", value: 3 }
    ]
  },
  {
    id: 5,
    text: "In the past 7 days, how much have you felt scared or panicky for no very good reason?",
    options: [
      { text: "No, not at all", value: 0 },
      { text: "No, not much", value: 1 },
      { text: "Yes, sometimes", value: 2 },
      { text: "Yes, quite a lot", value: 3 }
    ]
  },
  {
    id: 6,
    text: "In the past 7 days, how much have things been getting on top of you?",
    options: [
      { text: "No, I have been coping as well as ever", value: 0 },
      { text: "No, most of the time I have coped quite well", value: 1 },
      { text: "Yes, sometimes I haven't been coping as well as usual", value: 2 },
      { text: "Yes, most of the time I haven't been able to cope at all", value: 3 }
    ]
  },
  {
    id: 7,
    text: "In the past 7 days, how much have you been so unhappy that you have had difficulty sleeping?",
    options: [
      { text: "No, not at all", value: 0 },
      { text: "Not very often", value: 1 },
      { text: "Yes, sometimes", value: 2 },
      { text: "Yes, most of the time", value: 3 }
    ]
  },
  {
    id: 8,
    text: "In the past 7 days, how much have you felt sad or miserable?",
    options: [
      { text: "No, not at all", value: 0 },
      { text: "Not very often", value: 1 },
      { text: "Yes, quite often", value: 2 },
      { text: "Yes, most of the time", value: 3 }
    ]
  },
  {
    id: 9,
    text: "In the past 7 days, how much have you been so unhappy that you have been crying?",
    options: [
      { text: "No, never", value: 0 },
      { text: "Only occasionally", value: 1 },
      { text: "Yes, quite often", value: 2 },
      { text: "Yes, most of the time", value: 3 }
    ]
  },
  {
    id: 10,
    text: "In the past 7 days, how much have you had thoughts of harming yourself?",
    options: [
      { text: "Never", value: 0 },
      { text: "Hardly ever", value: 1 },
      { text: "Sometimes", value: 2 },
      { text: "Yes, quite often", value: 3 }
    ]
  }
];

export const EPDSAssessment = ({ open, onOpenChange, clientName }: EPDSAssessmentProps) => {
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
    const suicidalThoughts = answers[10] > 0;
    
    if (suicidalThoughts) {
      return {
        level: "Immediate Risk",
        description: "Thoughts of self-harm were reported. This requires immediate attention.",
        recommendation: "URGENT: Immediate clinical assessment and intervention required. Consider emergency services if necessary.",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      };
    } else if (score < 10) {
      return {
        level: "Low Risk",
        description: "Score suggests minimal likelihood of postnatal depression.",
        recommendation: "Continue monitoring. Provide support and follow-up as part of routine care.",
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      };
    } else if (score <= 12) {
      return {
        level: "Moderate Risk",
        description: "Score suggests possible postnatal depression requiring further assessment.",
        recommendation: "Clinical assessment recommended. Consider professional support and monitoring.",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      };
    } else {
      return {
        level: "High Risk",
        description: "Score suggests probable postnatal depression requiring immediate attention.",
        recommendation: "Immediate clinical assessment and intervention required. Professional treatment strongly recommended.",
        color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
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
            <DialogTitle>EPDS Assessment Results</DialogTitle>
            {clientName && (
              <div className="text-sm text-muted-foreground">Client: {clientName}</div>
            )}
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-primary">{score}</div>
              <div className="text-lg text-muted-foreground">Total Score (out of 30)</div>
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
                  <li>• 0-9: Low risk of postnatal depression</li>
                  <li>• 10-12: Moderate risk (further assessment recommended)</li>
                  <li>• 13+: High risk (immediate attention required)</li>
                  <li>• Any positive response to question 10 requires immediate clinical attention</li>
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
          <DialogTitle>EPDS Assessment</DialogTitle>
          {clientName && (
            <div className="text-sm text-muted-foreground">Client: {clientName}</div>
          )}
          <div className="text-sm text-muted-foreground">
            Edinburgh Postnatal Depression Scale
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