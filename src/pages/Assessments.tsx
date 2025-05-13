
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, ClipboardCheck, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Assessment {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'in_progress';
  assignedTo: string;
  completionPercentage: number;
  questions?: AssessmentQuestion[];
}

interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'likert' | 'text' | 'multiple_choice';
  options?: string[];
  answer?: string | number;
}

const Assessments = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: '1',
      title: 'Psychological Impact Assessment',
      description: 'Evaluate the psychological impact of your workplace injury on daily life and functioning',
      date: '2023-04-15',
      status: 'pending',
      assignedTo: 'Dr. Smith',
      completionPercentage: 0,
      questions: [
        {
          id: '1',
          question: 'How often do you experience anxiety related to your injury?',
          type: 'likert',
          options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
        },
        {
          id: '2',
          question: 'On a scale of 1-5, how would you rate your sleep quality since the injury?',
          type: 'likert',
          options: ['1 (Very Poor)', '2 (Poor)', '3 (Fair)', '4 (Good)', '5 (Very Good)']
        },
        {
          id: '3',
          question: 'Describe how the injury has affected your daily activities:',
          type: 'text'
        },
        {
          id: '4',
          question: 'Which of the following symptoms do you experience? (Select all that apply)',
          type: 'multiple_choice',
          options: ['Flashbacks', 'Nightmares', 'Avoidance behaviors', 'Hypervigilance', 'None of the above']
        }
      ]
    },
    {
      id: '2',
      title: 'Functional Capacity Evaluation',
      description: 'Assessment of your current work capabilities and limitations',
      date: '2023-04-10',
      status: 'in_progress',
      assignedTo: 'Dr. Johnson',
      completionPercentage: 40
    }
  ]);

  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[questionId: string]: string | number}>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    description: '',
    assignedTo: ''
  });

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const startAssessment = (assessment: Assessment) => {
    setActiveAssessment(assessment);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleNextQuestion = () => {
    if (!activeAssessment?.questions) return;
    
    const currentQuestion = activeAssessment.questions[currentQuestionIndex];
    
    // Validate answer exists for current question
    if (!answers[currentQuestion.id] && currentQuestion.type !== 'text') {
      toast({
        title: "Answer required",
        description: "Please provide an answer before continuing",
        variant: "destructive"
      });
      return;
    }
    
    if (currentQuestionIndex < activeAssessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Assessment completion
      const updatedAssessments = assessments.map(assess => 
        assess.id === activeAssessment.id 
          ? { ...assess, status: 'completed', completionPercentage: 100 } 
          : assess
      );
      
      setAssessments(updatedAssessments);
      setActiveAssessment(null);
      
      toast({
        title: "Assessment completed",
        description: "Thank you for completing the assessment",
      });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const createNewAssessment = () => {
    if (!newAssessment.title || !newAssessment.description || !newAssessment.assignedTo) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const newAssessmentObj: Assessment = {
      id: Date.now().toString(),
      title: newAssessment.title,
      description: newAssessment.description,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      assignedTo: newAssessment.assignedTo,
      completionPercentage: 0
    };
    
    setAssessments([...assessments, newAssessmentObj]);
    setNewAssessment({
      title: '',
      description: '',
      assignedTo: ''
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Assessment created",
      description: "The new assessment has been successfully created",
    });
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center text-green-600 text-xs font-medium">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex items-center text-blue-600 text-xs font-medium">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </div>
        );
      default:
        return (
          <div className="flex items-center text-yellow-600 text-xs font-medium">
            <ClipboardCheck className="h-3 w-3 mr-1" />
            Pending
          </div>
        );
    }
  };

  const renderAssessmentQuestion = () => {
    if (!activeAssessment?.questions || activeAssessment.questions.length === 0) {
      return <div>No questions available</div>;
    }

    const question = activeAssessment.questions[currentQuestionIndex];

    return (
      <div className="space-y-4">
        <div className="text-lg font-medium">{question.question}</div>
        
        {question.type === 'likert' && (
          <RadioGroup 
            value={answers[question.id]?.toString() || ""} 
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            <div className="grid gap-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="font-normal">{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
        
        {question.type === 'text' && (
          <Textarea 
            value={answers[question.id]?.toString() || ""} 
            onChange={(e) => handleAnswerChange(question.id, e.target.value)} 
            placeholder="Enter your answer here..."
            className="min-h-[120px]"
          />
        )}
        
        {question.type === 'multiple_choice' && (
          <RadioGroup 
            value={answers[question.id]?.toString() || ""} 
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            <div className="grid gap-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="font-normal">{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-6xl">
      {activeAssessment ? (
        <Card className="border shadow-md">
          <CardHeader>
            <CardTitle>{activeAssessment.title}</CardTitle>
            <CardDescription>{activeAssessment.description}</CardDescription>
            <Progress 
              value={((currentQuestionIndex + 1) / (activeAssessment.questions?.length || 1)) * 100} 
              className="h-2 mt-2"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Question {currentQuestionIndex + 1} of {activeAssessment.questions?.length || 0}
            </div>
          </CardHeader>
          <CardContent>
            {renderAssessmentQuestion()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex === (activeAssessment.questions?.length || 0) - 1 ? 'Submit' : 'Next'}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Assessments</h1>
              <p className="text-muted-foreground">
                {currentUser?.role === 'victim' 
                  ? 'Complete your psychological assessments' 
                  : 'Manage and review client assessments'}
              </p>
            </div>
            
            {currentUser?.role === 'psychologist' && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Create Assessment</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Assessment</DialogTitle>
                    <DialogDescription>
                      Create a new psychological assessment for a client
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Assessment Title</Label>
                      <Input 
                        id="title" 
                        value={newAssessment.title}
                        onChange={(e) => setNewAssessment({...newAssessment, title: e.target.value})}
                        placeholder="Enter assessment title" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        value={newAssessment.description}
                        onChange={(e) => setNewAssessment({...newAssessment, description: e.target.value})}
                        placeholder="Enter a brief description of the assessment" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="assignedTo">Assigned To</Label>
                      <Input 
                        id="assignedTo" 
                        value={newAssessment.assignedTo}
                        onChange={(e) => setNewAssessment({...newAssessment, assignedTo: e.target.value})}
                        placeholder="Client name" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createNewAssessment}>
                      Create Assessment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Assessments</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            {['all', 'pending', 'in_progress', 'completed'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="grid gap-4">
                  {assessments
                    .filter(a => tab === 'all' || a.status === tab)
                    .map((assessment) => (
                      <Card key={assessment.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-16 flex items-center justify-center p-4 bg-primary/10">
                            <ClipboardCheck className="h-8 w-8 text-primary" />
                          </div>
                          <CardContent className="p-6 flex-1">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex flex-wrap gap-2 items-center mb-2">
                                  {renderStatusBadge(assessment.status)}
                                  <span className="text-xs text-muted-foreground">
                                    Created on {formatDate(assessment.date)}
                                  </span>
                                </div>
                                <h3 className="text-lg font-medium">{assessment.title}</h3>
                                <p className="text-sm text-muted-foreground">{assessment.description}</p>
                                <div className="mt-2 text-xs">
                                  <span className="font-medium">
                                    {currentUser?.role === 'victim' ? 'Assigned by: ' : 'Assigned to: '}
                                  </span>
                                  {assessment.assignedTo}
                                </div>
                                
                                {assessment.status !== 'pending' && (
                                  <div className="mt-2">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs">Completion</span>
                                      <span className="text-xs">{assessment.completionPercentage}%</span>
                                    </div>
                                    <Progress value={assessment.completionPercentage} className="h-2" />
                                  </div>
                                )}
                              </div>
                              
                              <div>
                                {currentUser?.role === 'victim' && assessment.status === 'pending' && (
                                  <Button onClick={() => startAssessment(assessment)}>
                                    Start Assessment
                                  </Button>
                                )}
                                
                                {currentUser?.role === 'victim' && assessment.status === 'in_progress' && (
                                  <Button onClick={() => startAssessment(assessment)}>
                                    Continue Assessment
                                  </Button>
                                )}
                                
                                {currentUser?.role === 'psychologist' && (
                                  <Button variant="outline">
                                    View Details
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                    
                  {assessments.filter(a => tab === 'all' || a.status === tab).length === 0 && (
                    <Card className="p-10 text-center">
                      <div className="flex flex-col items-center">
                        <ClipboardCheck className="h-10 w-10 text-muted-foreground mb-2" />
                        <CardTitle className="mb-2">No Assessments</CardTitle>
                        <CardDescription>
                          There are no {tab === 'all' ? '' : tab} assessments available.
                        </CardDescription>
                      </div>
                    </Card>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Assessments;
