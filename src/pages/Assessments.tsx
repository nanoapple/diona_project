import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, ClipboardList, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Assessment, AssessmentQuestion, AssessmentStatus } from '@/types';
import { UserRole } from '@/contexts/AuthContext';

const mockAssessments: Assessment[] = [
  {
    id: "1",
    title: "Mental Health Assessment",
    description: "This assessment is designed to evaluate your current mental health state in relation to your workplace injury.",
    status: "pending",
    completionPercentage: 0,
    date: "2023-05-10",
    assignedTo: "John Doe",
    questions: [
      {
        id: "q1",
        text: "How often have you felt down, depressed, or hopeless over the last two weeks?",
        type: "multiple_choice",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
      },
      {
        id: "q2",
        text: "On a scale from 1 to 10, how would you rate your current anxiety level?",
        type: "scale",
        options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
      },
      {
        id: "q3",
        text: "Please describe how your injury has affected your daily life and routines.",
        type: "text"
      }
    ]
  },
  {
    id: "2",
    title: "PTSD Screening",
    description: "Assessment for symptoms of Post-Traumatic Stress Disorder related to your accident.",
    status: "in_progress",
    completionPercentage: 60,
    date: "2023-05-15",
    assignedTo: "John Doe"
  },
  {
    id: "3",
    title: "Vocational Assessment",
    description: "Evaluation of your ability to return to work and any accommodations that may be needed.",
    status: "completed",
    completionPercentage: 100,
    date: "2023-04-20",
    assignedTo: "John Doe"
  }
];

const mockClientAssessments: Assessment[] = [
  {
    id: "4",
    title: "Initial Mental Health Assessment",
    description: "Comprehensive assessment of mental health status",
    status: "completed",
    completionPercentage: 100,
    date: "2023-05-01",
    assignedTo: "Jane Smith"
  },
  {
    id: "5",
    title: "Work Stress Evaluation",
    description: "Assessment to measure occupational stress levels",
    status: "in_progress",
    completionPercentage: 30,
    date: "2023-05-12",
    assignedTo: "Robert Johnson"
  },
  {
    id: "6",
    title: "Return to Work Assessment",
    description: "Evaluation of readiness to resume work duties",
    status: "pending",
    completionPercentage: 0,
    date: "2023-05-20",
    assignedTo: "Sarah Williams"
  }
];

const AssessmentsPage = () => {
  const { currentUser } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [selectedTab, setSelectedTab] = useState("pending");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch assessments
    const fetchAssessments = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      if (currentUser?.role === 'victim') {
        setAssessments(mockAssessments);
      } else if (currentUser?.role === 'psychologist') {
        setAssessments(mockClientAssessments);
      }
      
      setIsLoading(false);
    };
    
    fetchAssessments();
  }, [currentUser?.role]);

  const handleStartAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
  };

  const handleAnswer = (questionId: string, value: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextQuestion = () => {
    if (selectedAssessment?.questions && currentQuestionIndex < selectedAssessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitAssessment = () => {
    setIsSubmitting(true);
    
    // Simulate API call to submit assessment
    setTimeout(() => {
      // Update the assessment status in our local state
      const updatedAssessments = assessments.map(a => 
        a.id === selectedAssessment?.id 
          ? { ...a, status: 'completed' as AssessmentStatus, completionPercentage: 100 } 
          : a
      );
      
      setAssessments(updatedAssessments);
      setSelectedAssessment(null);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setIsSubmitting(false);
    }, 1500);
  };

  const handleBack = () => {
    setSelectedAssessment(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };
  
  const getFilteredAssessments = () => {
    return assessments.filter(assessment => assessment.status === selectedTab);
  };

  const renderAssessmentStatusIcon = (status: AssessmentStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <ClipboardList className="w-5 h-5 text-gray-500" />;
    }
  };

  const renderAssessmentList = () => {
    const filteredAssessments = getFilteredAssessments();
    
    return (
      <div className="space-y-4">
        {filteredAssessments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No {selectedTab} assessments found.
          </div>
        ) : (
          filteredAssessments.map(assessment => (
            <Card key={assessment.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>{assessment.title}</CardTitle>
                    <CardDescription>{assessment.description}</CardDescription>
                  </div>
                  <div className="flex items-center">
                    {renderAssessmentStatusIcon(assessment.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-muted-foreground">
                    Date: {assessment.date}
                  </div>
                  
                  {assessment.status === 'in_progress' && (
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{assessment.completionPercentage}%</span>
                      </div>
                      <Progress value={assessment.completionPercentage} />
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-2">
                    {assessment.status === 'pending' && currentUser?.role === 'victim' && (
                      <Button onClick={() => handleStartAssessment(assessment)}>
                        Start Assessment
                      </Button>
                    )}
                    
                    {assessment.status === 'in_progress' && currentUser?.role === 'victim' && (
                      <Button onClick={() => handleStartAssessment(assessment)}>
                        Continue Assessment
                      </Button>
                    )}
                    
                    {assessment.status === 'completed' && (
                      <Button variant="outline">View Results</Button>
                    )}
                    
                    {currentUser?.role === 'psychologist' && (
                      <div className="flex gap-2">
                        <Badge variant="outline">Assigned to: {assessment.assignedTo}</Badge>
                        <Button variant="outline">View Details</Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  };

  const renderQuestionComponent = (question: AssessmentQuestion) => {
    const answer = answers[question.id];
    
    switch (question.type) {
      case 'multiple_choice':
        return (
          <RadioGroup value={answer as string} onValueChange={value => handleAnswer(question.id, value)}>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );
      case 'scale':
        return (
          <div className="flex justify-between mt-4">
            {question.options?.map((option, index) => (
              <Button
                key={index}
                variant={answer === option ? "default" : "outline"}
                className="w-10 h-10 rounded-full"
                onClick={() => handleAnswer(question.id, option)}
              >
                {option}
              </Button>
            ))}
          </div>
        );
      case 'text':
        return (
          <textarea
            className="w-full h-32 p-2 border rounded-md"
            value={answer as string || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder="Type your answer here..."
          />
        );
      default:
        return null;
    }
  };

  const renderAssessmentQuestions = () => {
    if (!selectedAssessment || !selectedAssessment.questions) return null;
    
    const currentQuestion = selectedAssessment.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === selectedAssessment.questions.length - 1;
    const isFirstQuestion = currentQuestionIndex === 0;
    
    return (
      <div>
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          &larr; Back to Assessments
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>{selectedAssessment.title}</CardTitle>
            <CardDescription>{selectedAssessment.description}</CardDescription>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all" 
                style={{ width: `${((currentQuestionIndex + 1) / selectedAssessment.questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Question {currentQuestionIndex + 1} of {selectedAssessment.questions.length}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg font-medium mb-4">{currentQuestion.text}</div>
            
            {renderQuestionComponent(currentQuestion)}
            
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={handlePreviousQuestion} 
                disabled={isFirstQuestion}
              >
                Previous
              </Button>
              
              {isLastQuestion ? (
                <Button 
                  onClick={handleSubmitAssessment} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                </Button>
              ) : (
                <Button 
                  onClick={handleNextQuestion} 
                  disabled={!answers[currentQuestion.id]}
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedAssessment) {
    return renderAssessmentQuestions();
  }

  const canCreateAssessments = currentUser?.role === 'psychologist';
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Assessments</h1>
      <p className="text-muted-foreground mb-6">
        {currentUser?.role === 'victim' 
          ? 'Complete psychological assessments related to your claim' 
          : 'Manage client psychological assessments'}
      </p>
      
      <Tabs defaultValue="pending" value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          {canCreateAssessments && (
            <Button>
              Create Assessment
            </Button>
          )}
        </div>
        
        <TabsContent value="pending">
          {renderAssessmentList()}
        </TabsContent>
        <TabsContent value="in_progress">
          {renderAssessmentList()}
        </TabsContent>
        <TabsContent value="completed">
          {renderAssessmentList()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssessmentsPage;
