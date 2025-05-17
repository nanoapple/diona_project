
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { DASS21Question, Assessment, AssessmentResults } from "@/types";
import { AlertTriangle } from "lucide-react";

interface DASS21AssessmentProps {
  assessment: Assessment;
  onComplete: (results: AssessmentResults) => void;
  onCancel: () => void;
}

export function DASS21Assessment({ assessment, onComplete, onCancel }: DASS21AssessmentProps) {
  const [questions, setQuestions] = useState<DASS21Question[]>([
    { id: 1, text: "I found it hard to wind down", category: "stress", answer: undefined },
    { id: 2, text: "I was aware of dryness of my mouth", category: "anxiety", answer: undefined },
    { id: 3, text: "I couldn't seem to experience any positive feeling at all", category: "depression", answer: undefined },
    { id: 4, text: "I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion)", category: "anxiety", answer: undefined },
    { id: 5, text: "I found it difficult to work up the initiative to do things", category: "depression", answer: undefined },
    { id: 6, text: "I tended to over-react to situations", category: "stress", answer: undefined },
    { id: 7, text: "I experienced trembling (e.g., in the hands)", category: "anxiety", answer: undefined },
    { id: 8, text: "I felt that I was using a lot of nervous energy", category: "stress", answer: undefined },
    { id: 9, text: "I was worried about situations in which I might panic and make a fool of myself", category: "anxiety", answer: undefined },
    { id: 10, text: "I felt that I had nothing to look forward to", category: "depression", answer: undefined },
    { id: 11, text: "I found myself getting agitated", category: "stress", answer: undefined },
    { id: 12, text: "I found it difficult to relax", category: "stress", answer: undefined },
    { id: 13, text: "I felt down-hearted and blue", category: "depression", answer: undefined },
    { id: 14, text: "I was intolerant of anything that kept me from getting on with what I was doing", category: "stress", answer: undefined },
    { id: 15, text: "I felt I was close to panic", category: "anxiety", answer: undefined },
    { id: 16, text: "I was unable to become enthusiastic about anything", category: "depression", answer: undefined },
    { id: 17, text: "I felt I wasn't worth much as a person", category: "depression", answer: undefined },
    { id: 18, text: "I felt that I was rather touchy", category: "stress", answer: undefined },
    { id: 19, text: "I was aware of the action of my heart in the absence of physical exertion (e.g., sense of heart rate increase, heart missing a beat)", category: "anxiety", answer: undefined },
    { id: 20, text: "I felt scared without any good reason", category: "anxiety", answer: undefined },
    { id: 21, text: "I felt that life was meaningless", category: "depression", answer: undefined },
  ]);

  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 7;

  const handleAnswerChange = (questionId: number, answer: number) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, answer } : q
    ));
  };

  const calculateResults = () => {
    // Check if all questions are answered
    const unansweredQuestions = questions.filter(q => q.answer === undefined);
    
    if (unansweredQuestions.length > 0) {
      toast({
        title: "Incomplete Assessment",
        description: `Please answer all questions before submitting (${unansweredQuestions.length} remaining).`,
        variant: "destructive"
      });
      return;
    }

    // Calculate scores
    const depressionScore = questions
      .filter(q => q.category === "depression")
      .reduce((sum, q) => sum + (q.answer || 0), 0);

    const anxietyScore = questions
      .filter(q => q.category === "anxiety")
      .reduce((sum, q) => sum + (q.answer || 0), 0);

    const stressScore = questions
      .filter(q => q.category === "stress")
      .reduce((sum, q) => sum + (q.answer || 0), 0);

    // Interpret scores (simplified interpretation)
    const getInterpretation = (score: number, category: string) => {
      if (category === "depression") {
        if (score <= 4) return "Normal";
        if (score <= 6) return "Mild";
        if (score <= 10) return "Moderate";
        if (score <= 13) return "Severe";
        return "Extremely Severe";
      } else if (category === "anxiety") {
        if (score <= 3) return "Normal";
        if (score <= 5) return "Mild";
        if (score <= 7) return "Moderate";
        if (score <= 9) return "Severe";
        return "Extremely Severe";
      } else { // stress
        if (score <= 7) return "Normal";
        if (score <= 9) return "Mild";
        if (score <= 12) return "Moderate";
        if (score <= 16) return "Severe";
        return "Extremely Severe";
      }
    };

    const results: AssessmentResults = {
      depression: depressionScore,
      anxiety: anxietyScore,
      stress: stressScore,
      total: depressionScore + anxietyScore + stressScore,
      interpretation: `Depression: ${getInterpretation(depressionScore, "depression")}, Anxiety: ${getInterpretation(anxietyScore, "anxiety")}, Stress: ${getInterpretation(stressScore, "stress")}`
    };

    onComplete(results);
  };

  const currentQuestions = questions.slice(
    currentPage * questionsPerPage, 
    (currentPage + 1) * questionsPerPage
  );

  const totalPages = Math.ceil(questions.length / questionsPerPage);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>DASS-21 Assessment</CardTitle>
        <CardDescription>
          Depression, Anxiety and Stress Scale - 21 Items (DASS-21)
        </CardDescription>
        <div className="text-sm text-muted-foreground mt-2">
          <p>Please read each statement and select a number 0, 1, 2 or 3 which indicates how much the statement applied to you over the past week. There are no right or wrong answers.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
            <div className="text-xs"><strong>0</strong> - Did not apply to me at all</div>
            <div className="text-xs"><strong>1</strong> - Applied to me to some degree, or some of the time</div>
            <div className="text-xs"><strong>2</strong> - Applied to me to a considerable degree, or a good part of time</div>
            <div className="text-xs"><strong>3</strong> - Applied to me very much, or most of the time</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {currentQuestions.map((question) => (
            <div key={question.id} className="space-y-2">
              <div className="flex items-start">
                <span className="font-medium text-sm w-6">{question.id}.</span>
                <span className="text-sm">{question.text}</span>
              </div>
              <RadioGroup 
                value={question.answer?.toString()} 
                onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
                className="flex space-x-2 ml-6"
              >
                {[0, 1, 2, 3].map((value) => (
                  <div key={value} className="flex items-center space-x-1">
                    <RadioGroupItem value={value.toString()} id={`q${question.id}-${value}`} />
                    <Label htmlFor={`q${question.id}-${value}`} className="text-sm">{value}</Label>
                  </div>
                ))}
              </RadioGroup>
              {question.id !== currentQuestions[currentQuestions.length - 1]?.id && <Separator className="mt-4" />}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            {currentPage < totalPages - 1 ? (
              <Button onClick={() => setCurrentPage(p => p + 1)}>
                Next
              </Button>
            ) : (
              <Button onClick={calculateResults}>
                Complete Assessment
              </Button>
            )}
          </div>
        </div>

        {/* Unanswered questions warning */}
        {currentPage === totalPages - 1 && questions.filter(q => q.answer === undefined).length > 0 && (
          <div className="flex items-center gap-2 mt-4 p-2 border border-yellow-200 bg-yellow-50 rounded-md text-sm">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span>
              {questions.filter(q => q.answer === undefined).length} question(s) still need to be answered before submitting.
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="ghost" onClick={onCancel}>
          Cancel Assessment
        </Button>
        <Button 
          disabled={questions.some(q => q.answer === undefined)}
          onClick={calculateResults}
        >
          Complete Assessment
        </Button>
      </CardFooter>
    </Card>
  );
}
