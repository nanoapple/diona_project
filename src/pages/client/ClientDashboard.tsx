import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, Heart, MessageSquare, Target, TrendingUp } from 'lucide-react';

const ClientDashboard = () => {
  const navigate = useNavigate();

  const upcomingSession = {
    title: 'Progress Review Session',
    date: '2025-02-12',
    time: '2:00 PM',
    therapist: 'Dr. Emma Wilson'
  };

  const pendingTasks = [
    { id: '1', title: 'Complete thought record worksheet', dueDate: '2025-02-10' },
    { id: '2', title: 'Daily breathing practice', dueDate: '2025-02-12' },
    { id: '3', title: 'Weekly reflection', dueDate: '2025-02-11' }
  ];

  const recentProgress = {
    anxietyReduction: 30,
    sessionCompletion: 75,
    taskCompletion: 80,
    overallWellbeing: 65
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 rounded-xl p-8 border-2">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Sarah! 👋</h1>
        <p className="text-lg text-muted-foreground">Let's continue your journey towards better mental health</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold text-foreground mt-1">{recentProgress.overallWellbeing}%</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Improvement</p>
                <p className="text-2xl font-bold text-foreground mt-1">+{recentProgress.anxietyReduction}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks Done</p>
                <p className="text-2xl font-bold text-foreground mt-1">{recentProgress.taskCompletion}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sessions</p>
                <p className="text-2xl font-bold text-foreground mt-1">{recentProgress.sessionCompletion}%</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Session */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <CardTitle>Next Session</CardTitle>
            </div>
            <CardDescription>Your upcoming appointment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h3 className="font-semibold text-lg mb-2">{upcomingSession.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(upcomingSession.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{upcomingSession.time}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="w-4 h-4" />
                  <span>{upcomingSession.therapist}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Join Session</Button>
              <Button variant="outline" className="flex-1">Reschedule</Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <CardTitle>Tasks & Reflections</CardTitle>
              </div>
              <Badge variant="secondary">{pendingTasks.length} pending</Badge>
            </div>
            <CardDescription>Complete these before your next session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="w-5 h-5 rounded border-2 border-muted-foreground"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={() => navigate('/client/reflections')}
            >
              View All Tasks
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card 
          className="border-2 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => navigate('/client/journey')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Target className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">My Journey</h3>
                <p className="text-sm text-muted-foreground">View progress & goals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-2 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => navigate('/client/mood-tracker')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Heart className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold">Mood Tracker</h3>
                <p className="text-sm text-muted-foreground">Log today's mood</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-2 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => navigate('/client/messages')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <MessageSquare className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">Messages</h3>
                <p className="text-sm text-muted-foreground">Contact therapist</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Your Journey Highlights</CardTitle>
          <CardDescription>Recent progress and achievements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Completed 4 sessions this month</p>
                <p className="text-xs text-muted-foreground">Great consistency!</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5">
              <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Anxiety levels decreased by 30%</p>
                <p className="text-xs text-muted-foreground">Your coping strategies are working</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/5">
              <Heart className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Completed all homework assignments</p>
                <p className="text-xs text-muted-foreground">Keep up the excellent work!</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
