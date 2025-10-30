import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, FileText, Lightbulb, MessageSquare, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
  notes?: string;
  category: 'homework' | 'reflection' | 'practice';
}

const ReflectionsAndTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Thought Record Exercise',
      description: 'Complete the thought record worksheet for situations that trigger anxiety this week. Record at least 3 instances.',
      dueDate: '2025-02-10',
      status: 'pending',
      category: 'homework'
    },
    {
      id: '2',
      title: 'Daily Breathing Practice',
      description: 'Practice the 4-7-8 breathing technique twice daily (morning and evening) for the next week.',
      dueDate: '2025-02-12',
      status: 'pending',
      category: 'practice'
    },
    {
      id: '3',
      title: 'Weekly Reflection',
      description: 'Reflect on moments this week when you successfully used coping strategies.',
      dueDate: '2025-02-11',
      status: 'pending',
      category: 'reflection'
    },
    {
      id: '4',
      title: 'Sleep Diary',
      description: 'Track your sleep patterns including bedtime, wake time, and sleep quality.',
      dueDate: '2025-02-09',
      status: 'completed',
      notes: 'Completed sleep diary for 7 days. Notice improvement in sleep quality when avoiding screens before bed.',
      category: 'homework'
    }
  ]);

  const practiceLibrary = [
    {
      id: 'p1',
      title: '5 Senses Grounding',
      description: 'A grounding technique to help you stay present',
      duration: '5 min'
    },
    {
      id: 'p2',
      title: 'Progressive Muscle Relaxation',
      description: 'Release physical tension through systematic muscle relaxation',
      duration: '15 min'
    },
    {
      id: 'p3',
      title: 'Gratitude Journal',
      description: 'Daily practice of noting things you\'re grateful for',
      duration: '10 min'
    },
    {
      id: 'p4',
      title: 'Mindful Breathing',
      description: 'Simple breathing exercise for stress reduction',
      duration: '5 min'
    }
  ];

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task?.status === 'pending') {
      toast({
        title: "Task completed!",
        description: "Great job completing your assignment.",
      });
    }
  };

  const getCategoryBadge = (category: Task['category']) => {
    const config = {
      homework: { label: 'Homework', className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
      reflection: { label: 'Reflection', className: 'bg-purple-500/10 text-purple-700 dark:text-purple-400' },
      practice: { label: 'Practice', className: 'bg-green-500/10 text-green-700 dark:text-green-400' }
    };
    
    const { label, className } = config[category];
    return <Badge className={className} variant="secondary">{label}</Badge>;
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reflections & Tasks</h1>
        <p className="text-muted-foreground">Complete assignments and engage in self-practice exercises</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                <p className="text-3xl font-bold text-foreground mt-1">{pendingTasks.length}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-foreground mt-1">{completedTasks.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                </p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="library">Practice Library</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          {pendingTasks.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Pending Tasks</h2>
              {pendingTasks.map((task) => (
                <Card key={task.id} className="border-2 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={task.status === 'completed'}
                        onCheckedChange={() => toggleTaskStatus(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                          {getCategoryBadge(task.category)}
                        </div>
                        <CardDescription className="text-foreground/80">{task.description}</CardDescription>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Add notes or reflections:</label>
                      <Textarea
                        placeholder="Share your thoughts, challenges, or insights..."
                        className="min-h-[100px]"
                        defaultValue={task.notes}
                      />
                      <Button size="sm" className="mt-2">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Save Notes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {completedTasks.length > 0 && (
            <div className="space-y-4 mt-8">
              <h2 className="text-xl font-semibold">Completed Tasks</h2>
              {completedTasks.map((task) => (
                <Card key={task.id} className="border-2 bg-muted/30">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={true}
                        onCheckedChange={() => toggleTaskStatus(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <CardTitle className="text-lg line-through text-muted-foreground">{task.title}</CardTitle>
                          {getCategoryBadge(task.category)}
                        </div>
                        {task.notes && (
                          <div className="mt-3 p-3 bg-background rounded-lg border">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Your notes:</p>
                            <p className="text-sm text-foreground">{task.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Self-Help Practice Library</h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {practiceLibrary.map((practice) => (
              <Card key={practice.id} className="border-2 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Lightbulb className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{practice.title}</CardTitle>
                      <CardDescription className="mt-1">{practice.description}</CardDescription>
                      <Badge variant="secondary" className="mt-3">
                        {practice.duration}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReflectionsAndTasks;
