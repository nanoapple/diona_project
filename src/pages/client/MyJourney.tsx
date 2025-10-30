import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, FileText, Target, TrendingUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Session {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'upcoming' | 'missed';
  summary?: string;
  materials?: string[];
}

const MyJourney = () => {
  const currentGoals = [
    { id: '1', title: 'Anxiety Management', progress: 65, description: 'Learning coping strategies' },
    { id: '2', title: 'Sleep Quality', progress: 45, description: 'Establishing better sleep routine' },
    { id: '3', title: 'Social Connections', progress: 30, description: 'Building meaningful relationships' }
  ];

  const sessions: Session[] = [
    {
      id: '1',
      title: 'Initial Consultation',
      date: '2025-01-15',
      status: 'completed',
      summary: 'We discussed your concerns and established initial goals for therapy.',
      materials: ['Welcome Pack.pdf', 'Self-Assessment Guide.pdf']
    },
    {
      id: '2',
      title: 'Cognitive Behavioral Therapy - Session 1',
      date: '2025-01-22',
      status: 'completed',
      summary: 'Explored thought patterns and introduced cognitive restructuring techniques.',
      materials: ['Thought Record Worksheet.pdf']
    },
    {
      id: '3',
      title: 'CBT - Session 2',
      date: '2025-01-29',
      status: 'completed',
      summary: 'Practiced identifying automatic negative thoughts and challenging them.',
      materials: ['Cognitive Distortions Guide.pdf']
    },
    {
      id: '4',
      title: 'Anxiety Management Session',
      date: '2025-02-05',
      status: 'completed',
      summary: 'Learned breathing exercises and grounding techniques for managing anxiety.'
    },
    {
      id: '5',
      title: 'Progress Review',
      date: '2025-02-12',
      status: 'upcoming'
    }
  ];

  const getStatusIcon = (status: Session['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'upcoming':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'missed':
        return <Clock className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: Session['status']) => {
    const variants: Record<Session['status'], string> = {
      completed: 'bg-green-500/10 text-green-700 dark:text-green-400',
      upcoming: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
      missed: 'bg-red-500/10 text-red-700 dark:text-red-400'
    };
    
    return (
      <Badge className={variants[status]} variant="secondary">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Journey</h1>
        <p className="text-muted-foreground">Track your therapy progress and review past sessions</p>
      </div>

      {/* Current Goals Section */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <CardTitle>Current Goals & Progress</CardTitle>
          </div>
          <CardDescription>Your active therapy goals and how you're progressing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentGoals.map((goal) => (
            <div key={goal.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-foreground">{goal.progress}%</span>
                </div>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Session Timeline */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <CardTitle>Session Timeline</CardTitle>
          </div>
          <CardDescription>Your therapy journey at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="relative space-y-6 before:absolute before:left-4 before:top-2 before:h-[calc(100%-2rem)] before:w-0.5 before:bg-border">
              {sessions.map((session, index) => (
                <div key={session.id} className="relative pl-12">
                  <div className="absolute left-0 top-1 flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-border">
                    {getStatusIcon(session.status)}
                  </div>
                  
                  <Card className="hover:shadow-md transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-base">{session.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {new Date(session.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(session.status)}
                      </div>
                    </CardHeader>
                    
                    {session.summary && (
                      <CardContent className="space-y-3">
                        <p className="text-sm text-foreground leading-relaxed">{session.summary}</p>
                        
                        {session.materials && session.materials.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Materials Provided:</p>
                            <div className="flex flex-wrap gap-2">
                              {session.materials.map((material, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  className="h-auto py-2 px-3"
                                >
                                  <FileText className="w-3 h-3 mr-2" />
                                  {material}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyJourney;
