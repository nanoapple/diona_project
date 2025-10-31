import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Brain, Heart, Moon, Smile, TrendingDown, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from '@/components/ui/use-toast';

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [dailyNote, setDailyNote] = useState('');

  // Mock data for mood trends
  const moodData = [
    { date: 'Jan 29', anxiety: 7, depression: 6, sleep: 5 },
    { date: 'Jan 30', anxiety: 6, depression: 5, sleep: 6 },
    { date: 'Jan 31', anxiety: 5, depression: 5, sleep: 7 },
    { date: 'Feb 1', anxiety: 6, depression: 6, sleep: 6 },
    { date: 'Feb 2', anxiety: 5, depression: 4, sleep: 7 },
    { date: 'Feb 3', anxiety: 4, depression: 4, sleep: 8 },
    { date: 'Feb 4', anxiety: 5, depression: 5, sleep: 7 },
  ];

  const moods = [
    { value: 1, label: '😢', description: 'Very Low', color: 'text-red-500' },
    { value: 2, label: '😟', description: 'Low', color: 'text-orange-500' },
    { value: 3, label: '😐', description: 'Okay', color: 'text-yellow-500' },
    { value: 4, label: '🙂', description: 'Good', color: 'text-green-500' },
    { value: 5, label: '😊', description: 'Great', color: 'text-blue-500' },
  ];

  const handleMoodSubmit = () => {
    if (selectedMood === null) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling today",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Mood logged!",
      description: "Your mood has been recorded for today.",
    });
    
    setSelectedMood(null);
    setDailyNote('');
  };

  const currentWeekAverage = {
    anxiety: 5.3,
    depression: 5.0,
    sleep: 6.6
  };

  const getTrendIcon = (current: number, previous: number = 6) => {
    if (current < previous) return <TrendingDown className="w-4 h-4 text-green-500" />;
    if (current > previous) return <TrendingUp className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mood & Progress Tracker</h1>
        <p className="text-muted-foreground">Monitor your emotional well-being and track patterns over time</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Anxiety Level</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-foreground">{currentWeekAverage.anxiety}</p>
                  <p className="text-sm text-muted-foreground">/10</p>
                  {getTrendIcon(currentWeekAverage.anxiety)}
                </div>
              </div>
              <Brain className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Mood Score</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-foreground">{currentWeekAverage.depression}</p>
                  <p className="text-sm text-muted-foreground">/10</p>
                  {getTrendIcon(currentWeekAverage.depression)}
                </div>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Sleep Quality</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-foreground">{currentWeekAverage.sleep}</p>
                  <p className="text-sm text-muted-foreground">/10</p>
                  {getTrendIcon(currentWeekAverage.sleep, 5)}
                </div>
              </div>
              <Moon className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Three Column Layout - Each column contains metric card + assessment */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Column 1: Anxiety Level + Assessment */}
        <div className="space-y-4">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Anxiety Level</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-foreground">{currentWeekAverage.anxiety}</p>
                    <p className="text-sm text-muted-foreground">/10</p>
                    {getTrendIcon(currentWeekAverage.anxiety)}
                  </div>
                </div>
                <Brain className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Quick Self-Assessment</CardTitle>
              <CardDescription>Rate your anxiety level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Anxiety Level</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level (0 = none, 10 = severe)" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(11)].map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i} - {i === 0 ? 'None' : i <= 3 ? 'Mild' : i <= 6 ? 'Moderate' : 'Severe'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" className="w-full">
                Submit
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Column 2: Mood Score + Mood Selection */}
        <div className="space-y-4">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Mood Score</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-foreground">{currentWeekAverage.depression}</p>
                    <p className="text-sm text-muted-foreground">/10</p>
                    {getTrendIcon(currentWeekAverage.depression)}
                  </div>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Smile className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">How are you feeling today?</CardTitle>
              </div>
              <CardDescription>Select your current mood</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-5 gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedMood === mood.value 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl mb-1">{mood.label}</span>
                    <span className="text-[10px] font-medium text-foreground">{mood.description}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Today's reflection (optional)</label>
                <Textarea
                  placeholder="How has your day been? Any notable events or feelings..."
                  className="min-h-[80px]"
                  value={dailyNote}
                  onChange={(e) => setDailyNote(e.target.value)}
                />
              </div>

              <Button onClick={handleMoodSubmit} className="w-full">
                Log Mood
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Column 3: Sleep Quality + Assessment */}
        <div className="space-y-4">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Sleep Quality</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-foreground">{currentWeekAverage.sleep}</p>
                    <p className="text-sm text-muted-foreground">/10</p>
                    {getTrendIcon(currentWeekAverage.sleep, 5)}
                  </div>
                </div>
                <Moon className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Sleep Quality</CardTitle>
              <CardDescription>Rate your sleep from last night</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Sleep Quality (last night)</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality (0 = very poor, 10 = excellent)" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(11)].map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i} - {i === 0 ? 'Very Poor' : i <= 3 ? 'Poor' : i <= 6 ? 'Fair' : 'Good'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" className="w-full">
                Submit
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trends Chart - Always Visible */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Your Progress Over Time</CardTitle>
          <CardDescription>Track patterns and improvements in your well-being</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  domain={[0, 10]} 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="anxiety" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Anxiety"
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="depression" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Mood"
                  dot={{ fill: '#ef4444', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sleep" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Sleep Quality"
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Insights & Patterns</CardTitle>
          <CardDescription>AI-generated observations from your tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">Positive Trend</p>
            <p className="text-sm text-foreground">Your anxiety levels have decreased by 30% over the past week. Keep up the good work with your coping strategies!</p>
          </div>
          
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Observation</p>
            <p className="text-sm text-foreground">Your sleep quality improves on days when you log higher mood scores. Consider maintaining your current sleep routine.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodTracker;
