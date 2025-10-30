import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, Star, ThumbsUp, Clock, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Slider } from '@/components/ui/slider';

interface Message {
  id: string;
  from: 'therapist' | 'client';
  content: string;
  timestamp: string;
  read: boolean;
}

interface SessionFeedback {
  id: string;
  sessionTitle: string;
  sessionDate: string;
  submitted: boolean;
  rating?: number;
  feedback?: string;
}

const Messages = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'therapist',
      content: 'Hi! I hope you\'re doing well this week. I wanted to check in and see how the breathing exercises we discussed are working for you?',
      timestamp: '2025-02-03T10:30:00',
      read: true
    },
    {
      id: '2',
      from: 'client',
      content: 'Hi Dr. Wilson! They\'re really helpful, especially in the morning. I\'ve been practicing them daily as you suggested.',
      timestamp: '2025-02-03T14:20:00',
      read: true
    },
    {
      id: '3',
      from: 'therapist',
      content: 'That\'s wonderful to hear! Consistency is key. Remember, if you notice any anxiety triggers this week, try using the grounding technique we practiced. Looking forward to our session on Thursday.',
      timestamp: '2025-02-04T09:15:00',
      read: false
    }
  ]);

  const [sessionFeedbacks, setSessionFeedbacks] = useState<SessionFeedback[]>([
    {
      id: '1',
      sessionTitle: 'CBT - Session 2',
      sessionDate: '2025-01-29',
      submitted: false
    },
    {
      id: '2',
      sessionTitle: 'Anxiety Management Session',
      sessionDate: '2025-02-05',
      submitted: false
    }
  ]);

  const [currentFeedback, setCurrentFeedback] = useState<{
    sessionId: string;
    rating: number;
    helpful: string;
    improve: string;
  } | null>(null);

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast({
        title: "Message is empty",
        description: "Please type a message before sending",
        variant: "destructive"
      });
      return;
    }

    const message: Message = {
      id: Date.now().toString(),
      from: 'client',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true
    };

    setMessages([...messages, message]);
    setNewMessage('');

    toast({
      title: "Message sent",
      description: "Your therapist will receive your message and respond soon.",
    });
  };

  const submitFeedback = (sessionId: string) => {
    if (!currentFeedback || currentFeedback.sessionId !== sessionId) {
      toast({
        title: "Please complete the feedback form",
        variant: "destructive"
      });
      return;
    }

    setSessionFeedbacks(sessionFeedbacks.map(sf => 
      sf.id === sessionId ? { ...sf, submitted: true, rating: currentFeedback.rating } : sf
    ));

    setCurrentFeedback(null);

    toast({
      title: "Feedback submitted",
      description: "Thank you for your feedback! It helps us improve your care.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Messages & Feedback</h1>
        <p className="text-muted-foreground">Stay connected with your therapist and share your feedback</p>
      </div>

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="messages">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <Star className="w-4 h-4 mr-2" />
            Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Secure Messages</CardTitle>
                  <CardDescription>Private communication with your therapist</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                  {messages.filter(m => !m.read && m.from === 'therapist').length} New
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.from === 'client' ? 'flex-row-reverse' : ''}`}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={message.from === 'therapist' ? 'https://i.pravatar.cc/150?u=therapist' : 'https://i.pravatar.cc/150?u=client'} />
                      <AvatarFallback>{message.from === 'therapist' ? 'DW' : 'ME'}</AvatarFallback>
                    </Avatar>
                    
                    <div className={`flex-1 max-w-[70%] ${message.from === 'client' ? 'items-end' : ''}`}>
                      <div className={`p-4 rounded-lg ${
                        message.from === 'therapist' 
                          ? 'bg-muted' 
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1 px-1">
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </span>
                        {message.from === 'client' && (
                          <CheckCircle className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Textarea
                  placeholder="Type your message here..."
                  className="min-h-[120px]"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Messages are typically responded to within 24-48 hours
                  </p>
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-base">Communication Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-foreground">
              <p>• This is not for emergencies. If you're in crisis, please call emergency services.</p>
              <p>• Messages are secure and HIPAA-compliant</p>
              <p>• Typical response time is 24-48 hours</p>
              <p>• For urgent scheduling changes, please call the office directly</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Session Feedback</CardTitle>
              <CardDescription>Help us improve your therapy experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {sessionFeedbacks.map((feedback) => (
                <Card key={feedback.id} className={`border-2 ${feedback.submitted ? 'bg-muted/30' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{feedback.sessionTitle}</CardTitle>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {new Date(feedback.sessionDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      {feedback.submitted ? (
                        <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Submitted
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  {!feedback.submitted && (
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">
                          How helpful was today's session?
                        </label>
                        <div className="flex items-center gap-4">
                          <Slider
                            defaultValue={[3]}
                            max={5}
                            step={1}
                            className="flex-1"
                            onValueChange={(value) => {
                              setCurrentFeedback({
                                sessionId: feedback.id,
                                rating: value[0],
                                helpful: currentFeedback?.helpful || '',
                                improve: currentFeedback?.improve || ''
                              });
                            }}
                          />
                          <span className="text-2xl">
                            {currentFeedback?.sessionId === feedback.id && currentFeedback.rating >= 4 ? '😊' : 
                             currentFeedback?.sessionId === feedback.id && currentFeedback.rating >= 2 ? '😐' : '😟'}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Not helpful</span>
                          <span>Very helpful</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          What was most helpful about today's session? (Optional)
                        </label>
                        <Textarea
                          placeholder="Share what worked well..."
                          className="min-h-[80px]"
                          onChange={(e) => {
                            setCurrentFeedback({
                              sessionId: feedback.id,
                              rating: currentFeedback?.rating || 3,
                              helpful: e.target.value,
                              improve: currentFeedback?.improve || ''
                            });
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Is there anything that could be improved? (Optional)
                        </label>
                        <Textarea
                          placeholder="Share your suggestions..."
                          className="min-h-[80px]"
                          onChange={(e) => {
                            setCurrentFeedback({
                              sessionId: feedback.id,
                              rating: currentFeedback?.rating || 3,
                              helpful: currentFeedback?.helpful || '',
                              improve: e.target.value
                            });
                          }}
                        />
                      </div>

                      <Button 
                        onClick={() => submitFeedback(feedback.id)}
                        className="w-full"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Submit Feedback
                      </Button>
                    </CardContent>
                  )}
                  
                  {feedback.submitted && feedback.rating && (
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>Rated {feedback.rating}/5 - Thank you for your feedback!</span>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;
