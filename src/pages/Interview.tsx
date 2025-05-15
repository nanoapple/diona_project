
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { Mic, Type, Save, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../contexts/AuthContext';

const Interview = () => {
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [answerMethod, setAnswerMethod] = useState<'text' | 'voice'>('text');
  const { currentUser } = useAuth();
  
  // State for interview answers
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Interview sections with their questions
  const interviewSections = [
    {
      id: 'about',
      title: 'About You & Your Injury',
      description: 'We\'ll start with some basics so we can personalise your assessment.',
      icon: '👤',
      questions: [
        {
          id: 'fullName',
          text: 'Your full name and date of birth',
          type: 'text'
        },
        {
          id: 'contact',
          text: 'Your postcode and preferred contact method',
          type: 'text'
        },
        {
          id: 'injuryType',
          text: 'Type of injury:',
          type: 'select',
          options: ['Physical', 'Psychological', 'Both']
        },
        {
          id: 'injuryDescription',
          text: 'What happened, and when did it happen?',
          type: 'textarea'
        },
        {
          id: 'treatment',
          text: 'Are you still receiving treatment? From whom?',
          type: 'textarea'
        }
      ]
    },
    {
      id: 'work',
      title: 'Work Background & Experience',
      description: 'Let\'s understand your work history and skills.',
      icon: '💼',
      questions: [
        {
          id: 'education',
          text: 'What is your highest level of education?',
          type: 'select',
          options: ['High School', 'Certificate/Diploma', 'Bachelor\'s Degree', 'Masters/PhD', 'Other']
        },
        {
          id: 'workHistory',
          text: 'What jobs have you had in the past 10 years?',
          type: 'textarea'
        },
        {
          id: 'skills',
          text: 'Do you hold any licenses, certificates or trade skills?',
          type: 'textarea'
        },
        {
          id: 'responsibilities',
          text: 'What were your key responsibilities in your most recent job?',
          type: 'textarea'
        }
      ]
    },
    {
      id: 'impact',
      title: 'Impact of the Injury',
      description: 'Tell us how the injury affects your ability to work or function day to day.',
      icon: '🩹',
      questions: [
        {
          id: 'difficulties',
          text: 'What physical or mental tasks are difficult for you now?',
          type: 'textarea'
        },
        {
          id: 'symptoms',
          text: 'Do you experience pain, fatigue, concentration or memory issues?',
          type: 'textarea'
        },
        {
          id: 'lifestyle',
          text: 'How has your injury changed your day-to-day life?',
          type: 'textarea'
        },
        {
          id: 'readiness',
          text: 'On a scale of 1–10, how ready do you feel to return to work?',
          type: 'range',
          min: 1,
          max: 10
        }
      ]
    },
    {
      id: 'preferences',
      title: 'Employment Preferences & Restrictions',
      description: 'We\'d like to understand what type of work feels realistic or motivating.',
      icon: '🔍',
      questions: [
        {
          id: 'comfortableWork',
          text: 'What kinds of work do you feel comfortable doing now?',
          type: 'textarea'
        },
        {
          id: 'avoidWork',
          text: 'What jobs or tasks should be avoided due to your injury?',
          type: 'textarea'
        },
        {
          id: 'environment',
          text: 'Do you have a preferred work environment (e.g. indoors, remote, flexible)?',
          type: 'textarea'
        },
        {
          id: 'hours',
          text: 'What hours per week would feel manageable for you?',
          type: 'select',
          options: ['Less than 10', '10-20', '20-30', '30-40', 'Full time (40+)']
        }
      ]
    },
    {
      id: 'experience',
      title: 'Return to Work & Rehab Experience',
      description: 'If you\'ve tried returning to work or training, tell us how it went.',
      icon: '🔄',
      questions: [
        {
          id: 'returnAttempt',
          text: 'Have you attempted to return to work or study? What happened?',
          type: 'textarea'
        },
        {
          id: 'rehab',
          text: 'Have you participated in any rehab, work trials or job-seeking programs?',
          type: 'textarea'
        },
        {
          id: 'support',
          text: 'Did you feel supported in these processes?',
          type: 'textarea'
        },
        {
          id: 'workCapacity',
          text: 'Have you received a Work Capacity Decision? Did you agree with it?',
          type: 'textarea'
        }
      ]
    },
    {
      id: 'opportunities',
      title: 'Local Job Opportunities',
      description: 'Let\'s explore what\'s available around you and what barriers may exist.',
      icon: '🌐',
      questions: [
        {
          id: 'localJobs',
          text: 'Are there local jobs that you believe suit your skills and limitations?',
          type: 'textarea'
        },
        {
          id: 'jobSeeking',
          text: 'Are you currently looking for work? With what support?',
          type: 'textarea'
        },
        {
          id: 'barriers',
          text: 'Do you have transport or digital access issues?',
          type: 'textarea'
        },
        {
          id: 'retraining',
          text: 'Would you be open to retraining? In what areas?',
          type: 'textarea'
        }
      ]
    },
    {
      id: 'final',
      title: 'Final Thoughts & Consent',
      description: 'Last few questions to wrap up this process.',
      icon: '📝',
      questions: [
        {
          id: 'outcome',
          text: 'What outcome would you like from this report?',
          type: 'textarea'
        },
        {
          id: 'additional',
          text: 'Is there anything else we should know about your situation?',
          type: 'textarea'
        },
        {
          id: 'consent',
          text: 'Do you consent to this information being used for vocational or legal reporting purposes?',
          type: 'radio',
          options: ['Yes, I consent', 'No, I do not consent']
        }
      ]
    }
  ];

  const currentSectionData = interviewSections[currentSection];

  const handleInputChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Autosave functionality
    saveProgress(true);
  };

  const startRecording = (questionId: string) => {
    if (isRecording) {
      stopRecording();
      return;
    }

    setIsRecording(true);
    toast({
      title: "Recording started",
      description: "Speak clearly into your microphone"
    });

    // In a real implementation, this would connect to a voice recording service
    // and then transcribe the audio via a backend API
    setTimeout(() => {
      // Simulating recording for demo purposes
      toast({
        title: "Recording complete",
        description: "Your answer has been transcribed"
      });
      setIsRecording(false);
      
      // Simulate a transcribed response
      const simulatedResponse = "This is a simulated transcribed response for demonstration purposes.";
      handleInputChange(questionId, simulatedResponse);
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording stopped"
    });
  };

  const saveProgress = (isAutoSave = false) => {
    // In a real application, this would send the data to your backend
    console.log("Saving progress:", answers);
    
    if (!isAutoSave) {
      toast({
        title: "Progress saved",
        description: "Your answers have been saved"
      });
    }
  };

  const goToNextSection = () => {
    if (currentSection < interviewSections.length - 1) {
      saveProgress();
      setCurrentSection(currentSection + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      saveProgress();
      setCurrentSection(currentSection - 1);
      window.scrollTo(0, 0);
    }
  };

  const submitInterview = () => {
    saveProgress();
    toast({
      title: "Interview submitted",
      description: "Thank you for completing your interview"
    });
    // In a real application, this would finalize the submission
    // and perhaps redirect the user or show a completion screen
  };

  const renderQuestion = (question: any) => {
    const value = answers[question.id] || '';
    
    const renderInputField = () => {
      if (answerMethod === 'voice') {
        return (
          <div className="mt-1 flex items-center gap-2">
            <Button 
              type="button" 
              onClick={() => startRecording(question.id)} 
              variant={isRecording ? "destructive" : "secondary"}
              className="flex items-center gap-2"
            >
              <Mic size={16} />
              {isRecording ? 'Stop Recording' : 'Record Answer'}
            </Button>
            {answers[question.id] && (
              <div className="ml-2 text-sm text-muted-foreground">
                Answer recorded
              </div>
            )}
          </div>
        );
      }

      switch (question.type) {
        case 'text':
          return <Input value={value} onChange={e => handleInputChange(question.id, e.target.value)} className="mt-1" />;
        case 'textarea':
          return <Textarea value={value} onChange={e => handleInputChange(question.id, e.target.value)} className="mt-1" rows={4} />;
        case 'select':
          return (
            <Select value={value} onValueChange={val => handleInputChange(question.id, val)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option: string) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        case 'range':
          return (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                {[...Array(10)].map((_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={value || 5}
                onChange={e => handleInputChange(question.id, e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs mt-1">
                <span>Not ready</span>
                <span>Very ready</span>
              </div>
            </div>
          );
        case 'radio':
          return (
            <RadioGroup value={value} onValueChange={val => handleInputChange(question.id, val)} className="mt-3">
              {question.options?.map((option: string) => (
                <div className="flex items-center space-x-2 mt-1" key={option}>
                  <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                  <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          );
        default:
          return <Input value={value} onChange={e => handleInputChange(question.id, e.target.value)} className="mt-1" />;
      }
    };

    return (
      <div key={question.id} className="mb-6 border p-4 rounded-md bg-card">
        <div className="flex justify-between mb-2">
          <Label className="text-md font-medium">{question.text}</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={answerMethod === 'text' ? 'default' : 'outline'}
              className="h-8 px-2"
              onClick={() => setAnswerMethod('text')}
            >
              <Type size={14} className="mr-1" /> Text
            </Button>
            <Button
              type="button"
              size="sm"
              variant={answerMethod === 'voice' ? 'default' : 'outline'}
              className="h-8 px-2" 
              onClick={() => setAnswerMethod('voice')}
            >
              <Mic size={14} className="mr-1" /> Voice
            </Button>
          </div>
        </div>
        {renderInputField()}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-3xl font-bold mb-1">Self-Guided Interview</h1>
      <p className="text-muted-foreground mb-6">
        This information will help your case assessment.
      </p>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm">
            Step {currentSection + 1} of {interviewSections.length}: <span className="font-medium">{currentSectionData.title}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Auto-saving enabled
          </div>
        </div>
        <Progress value={(currentSection / (interviewSections.length - 1)) * 100} className="h-2" />
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="text-2xl">{currentSectionData.icon}</div>
            <div>
              <CardTitle>{currentSectionData.title}</CardTitle>
              <CardDescription>{currentSectionData.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentSectionData.questions.map(renderQuestion)}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button 
            type="button" 
            onClick={goToPreviousSection}
            variant="outline"
            disabled={currentSection === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Previous Section
          </Button>

          <Button 
            type="button" 
            onClick={saveProgress}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Save size={16} />
            Save Progress
          </Button>
          
          {currentSection < interviewSections.length - 1 ? (
            <Button 
              type="button" 
              onClick={goToNextSection}
              className="flex items-center gap-2"
            >
              Next Section
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={submitInterview}
              className="flex items-center gap-2"
            >
              Submit Interview
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <AlertCircle size={16} />
        <span>If you need to take a break, click Save Progress. You can continue later.</span>
      </div>
    </div>
  );
};

export default Interview;
