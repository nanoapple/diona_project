
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ClipboardCheck, ClipboardList, FileText, User, Calendar, AlertCircle, Plus } from 'lucide-react';

interface LegalTask {
  id: string;
  title: string;
  type: 'intake' | 'evidence' | 'timeline' | 'consent' | 'mediation' | 'qa';
  status: 'not_started' | 'in_progress' | 'completed' | 'waiting_client';
  clientId: string;
  clientName: string;
  dueDate?: string;
  completionPercent: number;
  description: string;
  caseType: string;
  caseId?: string;
}

const LegalTasks = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<LegalTask[]>([
    {
      id: '1',
      title: 'Complete Legal Intake Form',
      type: 'intake',
      status: 'in_progress',
      clientId: '1',
      clientName: 'John Doe',
      dueDate: '2023-05-20',
      completionPercent: 65,
      description: 'Collect initial information for WorkCover claim including incident details, employer information, and injury description.',
      caseType: 'Workers Compensation',
      caseId: '1'
    },
    {
      id: '2',
      title: 'Gather Medical Evidence',
      type: 'evidence',
      status: 'waiting_client',
      clientId: '1',
      clientName: 'John Doe',
      dueDate: '2023-05-25',
      completionPercent: 30,
      description: 'Request medical records from treating physicians and specialists to support WorkCover claim.',
      caseType: 'Workers Compensation',
      caseId: '1'
    },
    {
      id: '3',
      title: 'Complete TPD Claim Form',
      type: 'intake',
      status: 'not_started',
      clientId: '1',
      clientName: 'John Doe',
      completionPercent: 0,
      description: 'Fill out Total Permanent Disability claim form with client details and employment history.',
      caseType: 'TPD',
      caseId: '2'
    },
    {
      id: '4',
      title: 'Prepare Client for Mediation',
      type: 'mediation',
      status: 'not_started',
      clientId: '2',
      clientName: 'Jane Smith',
      dueDate: '2023-06-10',
      completionPercent: 0,
      description: 'Review settlement options and prepare client for upcoming mediation session.',
      caseType: 'CTP',
      caseId: '3'
    },
    {
      id: '5',
      title: 'Collect Witness Statements',
      type: 'evidence',
      status: 'in_progress',
      clientId: '2',
      clientName: 'Jane Smith',
      dueDate: '2023-05-30',
      completionPercent: 50,
      description: 'Collect statements from witnesses present at the motor vehicle accident scene.',
      caseType: 'CTP',
      caseId: '3'
    },
  ]);

  const [activeTab, setActiveTab] = useState('all');
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<LegalTask>>({
    title: '',
    type: 'intake',
    status: 'not_started',
    clientId: '',
    clientName: '',
    completionPercent: 0,
    description: '',
    caseType: ''
  });

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.clientName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const task: LegalTask = {
      id: Date.now().toString(),
      title: newTask.title || '',
      type: newTask.type || 'intake',
      status: newTask.status || 'not_started',
      clientId: newTask.clientId || '1',
      clientName: newTask.clientName || '',
      dueDate: newTask.dueDate,
      completionPercent: 0,
      description: newTask.description || '',
      caseType: newTask.caseType || '',
      caseId: newTask.caseId
    };

    setTasks([...tasks, task]);
    setIsNewTaskDialogOpen(false);
    setNewTask({
      title: '',
      type: 'intake',
      status: 'not_started',
      clientId: '',
      clientName: '',
      completionPercent: 0,
      description: '',
      caseType: ''
    });
    
    toast({
      title: "Task created",
      description: "New legal task has been added successfully"
    });
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'intake':
        return <ClipboardList className="h-6 w-6" />;
      case 'evidence':
        return <FileText className="h-6 w-6" />;
      case 'timeline':
        return <Calendar className="h-6 w-6" />;
      case 'mediation':
        return <User className="h-6 w-6" />;
      case 'consent':
        return <ClipboardCheck className="h-6 w-6" />;
      case 'qa':
        return <AlertCircle className="h-6 w-6" />;
      default:
        return <ClipboardList className="h-6 w-6" />;
    }
  };

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case 'intake':
        return 'Legal Intake';
      case 'evidence':
        return 'Evidence Collection';
      case 'timeline':
        return 'Timeline Event';
      case 'mediation':
        return 'Mediation Prep';
      case 'consent':
        return 'Client Consent';
      case 'qa':
        return 'Client Q&A';
      default:
        return 'Task';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'not_started':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'waiting_client':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'not_started':
        return 'Not Started';
      case 'waiting_client':
        return 'Waiting on Client';
      default:
        return status.replace('_', ' ');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    return task.type === activeTab;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Legal Tasks</h1>
          <p className="text-muted-foreground">
            Manage your legal workflow and client tasks
          </p>
        </div>
        
        <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Legal Task</DialogTitle>
              <DialogDescription>
                Add a new task for client intake, evidence collection, or other legal processes
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pr-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input 
                    id="title" 
                    value={newTask.title} 
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Enter task title" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Task Type *</Label>
                  <Select 
                    value={newTask.type} 
                    onValueChange={(value: any) => setNewTask({...newTask, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="intake">Legal Intake</SelectItem>
                      <SelectItem value="evidence">Evidence Collection</SelectItem>
                      <SelectItem value="timeline">Timeline Event</SelectItem>
                      <SelectItem value="mediation">Mediation Preparation</SelectItem>
                      <SelectItem value="consent">Client Consent</SelectItem>
                      <SelectItem value="qa">Client Q&A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input 
                    id="clientName" 
                    value={newTask.clientName} 
                    onChange={(e) => setNewTask({...newTask, clientName: e.target.value})}
                    placeholder="Client name" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="caseType">Case Type *</Label>
                  <Select 
                    value={newTask.caseType} 
                    onValueChange={(value) => setNewTask({...newTask, caseType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select case type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Workers Compensation">Workers Compensation</SelectItem>
                      <SelectItem value="CTP">CTP</SelectItem>
                      <SelectItem value="TPD">TPD</SelectItem>
                      <SelectItem value="Public Liability">Public Liability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input 
                    id="dueDate" 
                    type="date" 
                    value={newTask.dueDate} 
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Task Description</Label>
                  <Textarea 
                    id="description" 
                    value={newTask.description} 
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Enter task details" 
                    rows={4}
                  />
                </div>
              </div>
            </ScrollArea>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask}>
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="intake">Intake</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="mediation">Mediation</TabsTrigger>
          <TabsTrigger value="consent">Consent</TabsTrigger>
          <TabsTrigger value="qa">Q&A</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="grid gap-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <Card key={task.id} className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-4">
                    <div className="bg-primary/10 p-6 flex items-start md:items-center justify-center flex-col">
                      <div className="bg-background p-3 rounded-full">
                        {getTaskIcon(task.type)}
                      </div>
                      <div className="mt-4 text-center">
                        <Badge variant="outline" className={`${getStatusColor(task.status)} border`}>
                          {getStatusLabel(task.status)}
                        </Badge>
                        <p className="text-sm mt-2">{getTaskTypeLabel(task.type)}</p>
                      </div>
                    </div>
                    
                    <div className="p-6 md:col-span-3">
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{task.title}</h3>
                          <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-2 text-sm text-muted-foreground mt-1">
                            <Link to={`/client-details/${task.clientId}`} className="hover:underline">
                              <span>Client: {task.clientName}</span>
                            </Link>
                            <span className="hidden md:inline">•</span>
                            <span>Case Type: {task.caseType}</span>
                            {task.caseId && (
                              <>
                                <span className="hidden md:inline">•</span>
                                <Link to={`/case-silo`} className="hover:underline">
                                  <span>Case Management: #{task.caseId}</span>
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {task.dueDate && (
                          <div className="mt-2 md:mt-0 text-sm flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Due: {formatDate(task.dueDate)}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {task.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{task.completionPercent}%</span>
                        </div>
                        <Progress value={task.completionPercent} className="h-2" />
                      </div>
                      
                      <div className="mt-6 flex flex-wrap gap-2">
                        <Button size="sm">
                          Open Task
                        </Button>
                        <Button variant="outline" size="sm">
                          Update Status
                        </Button>
                        {task.type === 'evidence' && (
                          <Button variant="outline" size="sm">
                            Request Documents
                          </Button>
                        )}
                        {task.type === 'intake' && (
                          <Button variant="outline" size="sm">
                            Edit Form
                          </Button>
                        )}
                        {task.type === 'consent' && (
                          <Button variant="outline" size="sm">
                            Generate Form
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-10 text-center">
                <div className="flex flex-col items-center">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mb-2" />
                  <CardTitle className="mb-2">No Tasks Found</CardTitle>
                  <CardDescription>
                    There are no {activeTab !== 'all' ? getTaskTypeLabel(activeTab).toLowerCase() : ''} tasks available.
                  </CardDescription>
                  <Button className="mt-4" onClick={() => setIsNewTaskDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Task
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalTasks;
