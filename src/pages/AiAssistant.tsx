
import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const AiAssistant = () => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      id: '1',
      content: `Hi ${currentUser?.name || 'there'}! I'm your AI assistant. How can I help you with your injury claim today?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  const faqs: FAQ[] = [
    {
      question: "What documentation do I need for a work injury claim?",
      answer: "You typically need medical records, incident reports, witness statements, and employment records. Your employer should provide an injury report form, and you'll need medical documentation of your injuries. Keep copies of all communications with your employer and insurance company.",
      category: "documentation"
    },
    {
      question: "How long does the compensation claim process take?",
      answer: "The timeframe varies depending on the complexity of your case, but most compensation claims take between 6-18 months to resolve. Simple cases with clear liability might settle faster, while complex cases or those involving permanent disability may take longer.",
      category: "process"
    },
    {
      question: "What compensation am I entitled to after a car accident?",
      answer: "After a car accident, you may be entitled to compensation for medical expenses, lost wages, pain and suffering, property damage, and loss of future earning capacity. The exact amount depends on factors like fault determination, injury severity, and insurance coverage limits.",
      category: "compensation"
    },
    {
      question: "Will I need to attend a medical assessment?",
      answer: "Yes, most compensation claims require independent medical assessments to evaluate your injuries and their impact on your life and work capacity. Your lawyer will arrange these appointments, and the reports will be important evidence for your claim.",
      category: "medical"
    },
    {
      question: "What does a psychological assessment involve?",
      answer: "A psychological assessment typically involves clinical interviews, standardized tests, and questionnaires to evaluate your mental health and how your injury has affected you psychologically. It may assess for conditions like PTSD, depression, or anxiety resulting from your injury.",
      category: "medical"
    },
    {
      question: "Can I change lawyers during my claim process?",
      answer: "Yes, you can change lawyers during your claim if you're not satisfied with their service. However, consider timing carefully as switching late in a case may cause delays. Your new lawyer will request your file from your previous representative.",
      category: "legal"
    }
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      // This would be replaced with a real API call to an AI service
      const aiResponses: { [key: string]: string } = {
        default: "I understand you have questions about your claim. Could you provide more specific details so I can give you the most accurate information?",
        compensation: "Compensation amounts vary based on several factors including the severity of your injury, impact on your ability to work, medical expenses, and more. Your lawyer can provide a more accurate estimate based on your specific case details.",
        time: "The timeline for resolving claims varies widely. Simple claims might be resolved in a few months, while more complex cases can take a year or longer. Factors that affect the timeline include the complexity of your injuries, whether liability is disputed, and the cooperation of all parties involved.",
        documents: "You'll typically need medical records, accident reports, witness statements, and evidence of your financial losses. Your lawyer will guide you through collecting all necessary documentation.",
        assessment: "Psychological assessments are an important part of many injury claims. They help document the mental and emotional impact of your injury, which can be significant components of your overall compensation."
      };
      
      // Very basic keyword matching for demo purposes
      let responseContent = aiResponses.default;
      const lowerCaseMessage = userMessage.content.toLowerCase();
      
      if (lowerCaseMessage.includes('how much') || lowerCaseMessage.includes('compensation') || lowerCaseMessage.includes('money')) {
        responseContent = aiResponses.compensation;
      } else if (lowerCaseMessage.includes('how long') || lowerCaseMessage.includes('time') || lowerCaseMessage.includes('duration')) {
        responseContent = aiResponses.time;
      } else if (lowerCaseMessage.includes('document') || lowerCaseMessage.includes('paperwork') || lowerCaseMessage.includes('need to provide')) {
        responseContent = aiResponses.documents;
      } else if (lowerCaseMessage.includes('psychological') || lowerCaseMessage.includes('assessment') || lowerCaseMessage.includes('mental health')) {
        responseContent = aiResponses.assessment;
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestedQuestionClick = (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: question,
      sender: 'user',
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Find matching FAQ
    const matchedFaq = faqs.find(faq => faq.question === question);
    
    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: matchedFaq ? matchedFaq.answer : "I don't have a specific answer for that question. Let me find out more information for you.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-1">AI Assistant</h1>
      <p className="text-muted-foreground mb-6">
        Get instant answers to your questions about the claims process
      </p>
      
      <Tabs defaultValue="chat">
        <TabsList className="mb-6">
          <TabsTrigger value="chat">Chat with AI</TabsTrigger>
          <TabsTrigger value="faqs">Common Questions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Chat with ClaimBot</CardTitle>
              <CardDescription>
                Ask any questions about your injury claim process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 h-[400px] overflow-y-auto p-2">
                {chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${
                        msg.sender === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <Avatar className={`h-8 w-8 ${msg.sender === 'user' ? 'bg-primary' : 'bg-muted'}`}>
                        <AvatarFallback>
                          {msg.sender === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <MessageSquare className="h-4 w-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          msg.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <Avatar className="h-8 w-8 bg-muted">
                        <AvatarFallback>
                          <MessageSquare className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <form onSubmit={handleSubmit} className="w-full flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your question here..."
                  className="flex-1 min-h-[60px]"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !message.trim()}>
                  Send
                </Button>
              </form>
            </CardFooter>
          </Card>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Suggested Questions</h3>
            <div className="flex flex-wrap gap-2">
              {faqs.slice(0, 3).map((faq) => (
                <Button 
                  key={faq.question} 
                  variant="outline" 
                  className="text-sm" 
                  onClick={() => handleSuggestedQuestionClick(faq.question)}
                  disabled={isLoading}
                >
                  {faq.question}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="faqs">
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq, index) => (
              <Card key={index} className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="text-xs" 
                    size="sm"
                    onClick={() => handleSuggestedQuestionClick(faq.question)}
                  >
                    Ask in chat
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiAssistant;
