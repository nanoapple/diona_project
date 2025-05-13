import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'scale' | 'multiple' | 'text';
  options?: string[];
  answer?: any;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed';
  completionPercentage: number;
  assignedTo: string;
  questions?: AssessmentQuestion[];
}

const Assessments = () => {
  const [activeTab, setActiveTab] = useState('assigned');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAssessments: Assessment[] = [
        {
          id: '1',
          title: 'Work-Related Stress Assessment',
          description: 'Evaluate your levels of workplace stress and its impacts on your daily functioning',
          date: '2023-04-15',
          status: 'pending',
          completionPercentage: 0,
          assignedTo: 'John Doe',
          questions: [
            {
              id: '1',
              question: 'How often do you feel overwhelmed by your workload?',
              type: 'scale',
              options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
            },
            {
              id: '2',
              question: 'Which of the following symptoms have you experienced due to work stress?',
              type: 'multiple',
              options: ['Headaches', 'Sleep disturbances', 'Irritability', 'Difficulty concentrating', 'None of the above']
            },
            {
              id: '3',
              question: 'Describe how your work injury has affected your mental health:',
              type: 'text'
            }
          ]
        },
        {
          id: '2',
          title: 'Post-Accident Trauma Screening',
          description: 'Assessment of psychological impacts following a motor vehicle accident',
          date: '2023-04-10',
          status: 'in_progress',
          completionPercentage: 60,
          assignedTo: 'John Doe'
        },
        {
          id: '3',
          title: 'Depression, Anxiety & Stress Scale (DASS-21)',
          description: 'Evaluate symptoms of depression, anxiety and stress',
          date: '2023-03-28',
          status: 'completed',
          completionPercentage: 100,
          assignedTo: 'Jane Smith'
        }
      ];
      
      setAssessments(mockAssessments);
      setLoading(false);
    };
    
    fetchAssessments();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleStartAssessment = (assessment: Assessment) => {
    setActiveAssessment(assessment);
    setCurrentQuestionIndex(0);
  };

  const handleAnswerQuestion = (answer: any) => {
    if (!activeAssessment || !activeAssessment.questions) return;

    const updatedQuestions = [...activeAssessment.questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      answer: answer
    };

    const updatedAssessment = {
      ...activeAssessment,
      questions: updatedQuestions,
      completionPercentage: Math.min(((currentQuestionIndex + 1) / activeAssessment.questions.length) * 100, 100)
    };

    setAssessments(assessments.map(a => a.id === activeAssessment.id ? updatedAssessment : a));
    setActiveAssessment(updatedAssessment);
  };

  const handleNextQuestion = () => {
    if (!activeAssessment || !activeAssessment.questions) return;
    if (currentQuestionIndex < activeAssessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      toast({
        title: "Assessment Complete",
        description: "You've reached the end of the assessment.",
      });
    }
  };

  const handleCompleteAssessment = () => {
    if (!activeAssessment) return;

    const updatedAssessment = {
      ...activeAssessment,
      status: 'completed',
      completionPercentage: 100
    };

    setAssessments(assessments.map(a => a.id === activeAssessment.id ? updatedAssessment : a));
    setActiveAssessment(null);

    toast({
      title: "Assessment Completed",
      description: "Thank you for completing the assessment.",
    });
  };

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in_progress':
        return <Progress className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderAssessmentQuestion = () => {
    if (!activeAssessment || !activeAssessment.questions) return null;

    const question = activeAssessment.questions[currentQuestionIndex];

    if (!question) return <div>No question available.</div>;

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Question {currentQuestionIndex + 1} of {activeAssessment.questions.length}</CardTitle>
          <CardDescription>{question.question}</CardDescription>
        </CardHeader>
        <CardContent>
          {question.type === 'scale' && question.options && (
            <div className="grid gap-2">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full"
                  onClick={() => handleAnswerQuestion(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}
          {question.type === 'multiple' && question.options && (
            <div className="grid gap-2">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full"
                  onClick={() => handleAnswerQuestion(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}
          {question.type === 'text' && (
            <textarea
              className="w-full h-32 border rounded p-2"
              onChange={(e) => handleAnswerQuestion(e.target.value)}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => handleAnswerQuestion(null)}
          >
            Clear Answer
          </Button>
          <Button onClick={handleNextQuestion}>Next Question</Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">Assessments</h1>
      <p className="text-muted-foreground mb-6">
        Manage and complete your assigned assessments
      </p>

      {activeAssessment ? (
        <Card>
          <CardHeader>
            <CardTitle>{activeAssessment.title}</CardTitle>
            <CardDescription>{activeAssessment.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderAssessmentQuestion()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveAssessment(null)}>
              Cancel Assessment
            </Button>
            <Button onClick={handleCompleteAssessment}>
              Complete Assessment
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList>
              <TabsTrigger value="assigned" onClick={() => handleTabChange('assigned')}>Assigned to Me</TabsTrigger>
              <TabsTrigger value="completed" onClick={() => handleTabChange('completed')}>Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="assigned">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {assessments
                    .filter(assessment => assessment.status !== 'completed')
                    .map(assessment => (
                      <Card key={assessment.id}>
                        <CardHeader>
                          <CardTitle>{assessment.title}</CardTitle>
                          <CardDescription>{assessment.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2">
                            {renderStatusIcon(assessment.status)}
                            <span className="text-sm font-medium">Assigned to: {assessment.assignedTo}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Date: {formatDate(assessment.date)}
                          </div>
                          <Progress value={assessment.completionPercentage} className="mt-2" />
                          <div className="text-xs text-muted-foreground mt-1">
                            {assessment.completionPercentage}% Completed
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button onClick={() => handleStartAssessment(assessment)}>
                            Start Assessment
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {assessments
                    .filter(assessment => assessment.status === 'completed')
                    .map(assessment => (
                      <Card key={assessment.id}>
                        <CardHeader>
                          <CardTitle>{assessment.title}</CardTitle>
                          <CardDescription>{assessment.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2">
                            {renderStatusIcon(assessment.status)}
                            <span className="text-sm font-medium">Assigned to: {assessment.assignedTo}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Date: {formatDate(assessment.date)}
                          </div>
                          <Badge variant="outline" className="mt-2">Completed</Badge>
                        </CardContent>
                        <CardFooter>
                          <Button variant="secondary">View Results</Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Assessments;
