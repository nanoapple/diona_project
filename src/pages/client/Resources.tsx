import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Headphones, Video, Phone, AlertCircle, Heart, Brain, Sparkles } from 'lucide-react';

const Resources = () => {
  const audioResources = [
    {
      id: '1',
      title: '5-Minute Breathing Exercise',
      description: 'Quick breathing technique for immediate stress relief',
      duration: '5 min',
      category: 'Breathing'
    },
    {
      id: '2',
      title: 'Guided Body Scan Meditation',
      description: 'Progressive relaxation through body awareness',
      duration: '15 min',
      category: 'Meditation'
    },
    {
      id: '3',
      title: 'Sleep Preparation Meditation',
      description: 'Wind down and prepare for restful sleep',
      duration: '20 min',
      category: 'Sleep'
    },
    {
      id: '4',
      title: 'Anxiety Relief Meditation',
      description: 'Calm your mind and reduce anxious thoughts',
      duration: '12 min',
      category: 'Anxiety'
    }
  ];

  const readingResources = [
    {
      id: '1',
      title: 'Understanding Cognitive Behavioral Therapy',
      description: 'Learn the basics of CBT and how it can help you',
      type: 'Article'
    },
    {
      id: '2',
      title: 'Managing Panic Attacks: A Guide',
      description: 'Practical strategies for handling panic situations',
      type: 'Guide'
    },
    {
      id: '3',
      title: 'The Power of Mindfulness',
      description: 'Introduction to mindfulness practices',
      type: 'eBook'
    },
    {
      id: '4',
      title: 'Sleep Hygiene Best Practices',
      description: 'Tips for improving your sleep quality',
      type: 'Article'
    }
  ];

  const courses = [
    {
      id: '1',
      title: 'Mindfulness for Beginners',
      description: '8-week introduction to mindfulness practices',
      progress: 25,
      lessons: 8
    },
    {
      id: '2',
      title: 'Managing Anxiety',
      description: 'Comprehensive anxiety management techniques',
      progress: 0,
      lessons: 12
    },
    {
      id: '3',
      title: 'Building Resilience',
      description: 'Develop emotional strength and adaptability',
      progress: 0,
      lessons: 10
    }
  ];

  const crisisResources = [
    {
      id: '1',
      name: 'National Suicide Prevention Lifeline',
      phone: '1-800-273-8255',
      description: '24/7 free and confidential support',
      availability: '24/7'
    },
    {
      id: '2',
      name: 'Crisis Text Line',
      phone: 'Text HOME to 741741',
      description: 'Free, 24/7 crisis support via text',
      availability: '24/7'
    },
    {
      id: '3',
      name: 'SAMHSA National Helpline',
      phone: '1-800-662-4357',
      description: 'Treatment referral and information service',
      availability: '24/7'
    },
    {
      id: '4',
      name: 'Emergency Services',
      phone: '911',
      description: 'For immediate life-threatening emergencies',
      availability: '24/7'
    }
  ];

  const dailyTasks = [
    'Practice 5 minutes of deep breathing',
    'Write down three things you\'re grateful for',
    'Take a 10-minute walk outside',
    'Complete your mood tracker entry',
    'Do one thing that brings you joy'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Resources & Self-Care</h1>
        <p className="text-muted-foreground">Tools and resources to support your mental health journey</p>
      </div>

      {/* Daily Task Card */}
      <Card className="border-2 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle>Today's Self-Care Task</CardTitle>
          </div>
          <CardDescription>Small actions that make a big difference</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-background border-2 border-primary/20">
            <p className="text-lg font-medium text-foreground mb-4">
              {dailyTasks[new Date().getDay() % dailyTasks.length]}
            </p>
            <Button className="w-full">Mark as Complete</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="audio" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="audio">
            <Headphones className="w-4 h-4 mr-2" />
            Audio
          </TabsTrigger>
          <TabsTrigger value="reading">
            <Book className="w-4 h-4 mr-2" />
            Reading
          </TabsTrigger>
          <TabsTrigger value="courses">
            <Video className="w-4 h-4 mr-2" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="crisis">
            <AlertCircle className="w-4 h-4 mr-2" />
            Crisis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audio" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {audioResources.map((resource) => (
              <Card key={resource.id} className="border-2 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Headphones className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base">{resource.title}</CardTitle>
                        <Badge variant="secondary">{resource.duration}</Badge>
                      </div>
                      <CardDescription className="mt-1">{resource.description}</CardDescription>
                      <Badge className="mt-2 bg-blue-500/10 text-blue-700 dark:text-blue-400" variant="secondary">
                        {resource.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    <Headphones className="w-4 h-4 mr-2" />
                    Listen Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reading" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {readingResources.map((resource) => (
              <Card key={resource.id} className="border-2 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Book className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base">{resource.title}</CardTitle>
                        <Badge variant="secondary">{resource.type}</Badge>
                      </div>
                      <CardDescription className="mt-1">{resource.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    <Book className="w-4 h-4 mr-2" />
                    Read Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id} className="border-2 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Video className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{course.title}</CardTitle>
                        <CardDescription className="mt-1">{course.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{course.lessons} lessons</Badge>
                    </div>
                    {course.progress > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">{course.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  {course.progress > 0 ? 'Continue Course' : 'Start Course'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="crisis" className="space-y-6">
          <Card className="border-2 bg-red-500/5 border-red-500/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <CardTitle className="text-red-700 dark:text-red-400">If You're in Crisis</CardTitle>
              </div>
              <CardDescription>
                If you're having thoughts of suicide or self-harm, please reach out for help immediately. You're not alone.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {crisisResources.map((resource) => (
              <Card key={resource.id} className="border-2">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <Phone className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-base">{resource.name}</CardTitle>
                          <CardDescription className="mt-1">{resource.description}</CardDescription>
                        </div>
                        <Badge variant="secondary">{resource.availability}</Badge>
                      </div>
                      <div className="mt-3">
                        <Button className="w-full" variant="outline" size="lg">
                          <Phone className="w-4 h-4 mr-2" />
                          {resource.phone}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="border-2 bg-blue-500/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-blue-500" />
                <CardTitle>Additional Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-foreground">
              <p>• Reach out to a trusted friend or family member</p>
              <p>• Contact your therapist's emergency line</p>
              <p>• Visit your nearest emergency room</p>
              <p>• Use the crisis text line for immediate support</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Resources;
