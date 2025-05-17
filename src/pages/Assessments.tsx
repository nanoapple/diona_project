
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar as CalendarIcon,
  ChevronRight,
  Plus
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn, formatDate } from "@/lib/utils";
import { Assessment, AssessmentResults } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { AddAssessmentDialog } from "@/components/assessments/AddAssessmentDialog";
import { DASS21Assessment } from "@/components/assessments/DASS21Assessment";
import { AssessmentResults as AssessmentResultsComponent } from "@/components/assessments/AssessmentResults";

const Assessments = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResults | null>(null);
  
  // Mock data for assessments
  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: "assess1",
      title: "Anxiety and Depression Scale",
      patientName: "Sarah Johnson",
      status: "completed",
      assignedDate: "2025-04-05T10:30:00",
      completionDate: "2025-04-10T14:15:00",
      score: 75,
      type: "Psychological"
    },
    {
      id: "assess2",
      title: "PTSD Screening Assessment",
      patientName: "Michael Brown",
      status: "in_progress",
      assignedDate: "2025-04-28T09:00:00",
      dueDate: "2025-05-12T17:00:00",
      type: "Trauma",
      completionPercentage: 45
    },
    {
      id: "assess3",
      title: "Cognitive Functioning Assessment",
      patientName: "Emily Zhang",
      status: "not_started",
      assignedDate: "2025-05-01T11:30:00",
      dueDate: "2025-05-20T16:00:00",
      type: "Neuropsychological"
    },
    {
      id: "assess4",
      title: "Personality Test Bundle",
      patientName: "David Wilson",
      status: "not_started",
      assignedDate: "2025-05-05T13:45:00",
      dueDate: "2025-05-25T15:30:00",
      type: "Personality"
    },
    {
      id: "assess5",
      title: "WorkCover Injury Assessment",
      patientName: "Jessica Robinson",
      status: "completed",
      assignedDate: "2025-04-15T08:30:00",
      completionDate: "2025-04-22T10:45:00",
      score: 62,
      type: "Occupational"
    }
  ]);
  
  // Filter assessments based on status
  const completedAssessments = assessments.filter(
    assessment => assessment.status === "completed"
  );
  
  const pendingAssessments = assessments.filter(
    assessment => assessment.status === "in_progress" || assessment.status === "not_started"
  );
  
  const handleAssessmentClick = (assessment: Assessment) => {
    // For completed assessments, show results
    if (assessment.status === "completed") {
      // In a real app, we would fetch the results from the backend
      if (assessment.results) {
        setAssessmentResults(assessment.results);
        setActiveAssessment(assessment);
        setShowResults(true);
      } else {
        toast({
          title: "Assessment Results",
          description: "Results data is not available for this assessment.",
        });
      }
    } else {
      // For in-progress or not started assessments, open the assessment
      setActiveAssessment(assessment);
    }
  };

  const handleStartAssessment = (assessmentId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    const assessment = assessments.find(a => a.id === assessmentId);
    if (assessment) {
      if (assessment.title.includes("DASS-21")) {
        setActiveAssessment(assessment);
      } else {
        toast({
          title: "Test is currently unavailable",
          description: "Only DASS-21 is available for demonstration purposes.",
        });
      }
    }
  };

  const handleAddAssessment = (assessment: Assessment) => {
    setAssessments([assessment, ...assessments]);
  };

  const handleAssessmentComplete = (results: AssessmentResults) => {
    if (activeAssessment) {
      // Update the assessment with results and mark as completed
      const updatedAssessment = {
        ...activeAssessment,
        status: "completed" as const,
        completionDate: new Date().toISOString(),
        completionPercentage: 100,
        results: results
      };
      
      setAssessments(assessments.map(a => 
        a.id === activeAssessment.id ? updatedAssessment : a
      ));
      
      // Show results
      setActiveAssessment(updatedAssessment);
      setAssessmentResults(results);
      setShowResults(true);
      
      toast({
        title: "Assessment Completed",
        description: "The assessment has been completed and results are available.",
      });
    }
  };

  // Calculate the assessment progress percentage
  const getProgress = (assessment: Assessment) => {
    if (assessment.status === "completed") return 100;
    if (assessment.status === "not_started") return 0;
    return assessment.completionPercentage || 45; // default to 45% if not specified
  };
  
  // Format due date and determine if it's overdue
  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return { formattedDate: "No due date", isOverdue: false };
    
    const due = new Date(dueDate);
    const today = new Date();
    const isOverdue = due < today && due.toDateString() !== today.toDateString();
    
    return {
      formattedDate: formatDate(dueDate),
      isOverdue
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assessments</h1>
        <p className="text-muted-foreground">
          {currentUser?.role === "psychologist" 
            ? "Manage and conduct psychological assessments for your clients." 
            : "View and complete your assigned psychological assessments."}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Calendar Widget */}
        <Card className="w-full md:w-[300px] md:h-fit">
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>View upcoming assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? formatDate(date.toISOString()) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => {
              toast({
                title: "Feature coming soon",
                description: "Schedule management will be available in a future update.",
              });
            }}>
              View Schedule
            </Button>
          </CardFooter>
        </Card>

        {/* Assessments Tabs */}
        <Card className="flex-1">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>My Assessments</CardTitle>
                <CardDescription>
                  {currentUser?.role === "psychologist" 
                    ? "Assessments for your clients" 
                    : "Your psychological assessments"}
                </CardDescription>
              </div>
              {currentUser?.role === "psychologist" && (
                <Button onClick={() => setAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add/Assign Assessment
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Pending ({pendingAssessments.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedAssessments.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending" className="space-y-4">
                {pendingAssessments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No pending assessments found</p>
                  </div>
                ) : (
                  pendingAssessments.map(assessment => {
                    const { formattedDate, isOverdue } = formatDueDate(assessment.dueDate);
                    return (
                      <div 
                        key={assessment.id}
                        className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleAssessmentClick(assessment)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{assessment.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Patient: {assessment.patientName}
                            </p>
                            {assessment.description && (
                              <p className="text-sm text-muted-foreground">
                                {assessment.description}
                              </p>
                            )}
                          </div>
                          <Badge 
                            variant={assessment.status === "in_progress" ? "default" : "outline"}
                          >
                            {assessment.status === "in_progress" ? "In Progress" : "Not Started"}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span>{getProgress(assessment)}%</span>
                          </div>
                          <Progress value={getProgress(assessment)} className="h-2" />
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center text-sm">
                              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                              <span className={cn(
                                "text-muted-foreground",
                                isOverdue && "text-destructive"
                              )}>
                                Due: {formattedDate}
                                {isOverdue && (
                                  <span className="ml-1 font-medium">(Overdue)</span>
                                )}
                              </span>
                            </div>
                            
                            {(currentUser?.role === "claimant" || 
                             (currentUser?.role === "psychologist" && assessment.title.includes("DASS-21"))) && 
                             assessment.status === "not_started" && (
                              <Button size="sm" onClick={(e) => handleStartAssessment(assessment.id, e)}>
                                Start <ArrowUpRight className="ml-1 h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4">
                {completedAssessments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No completed assessments found</p>
                  </div>
                ) : (
                  completedAssessments.map(assessment => (
                    <div 
                      key={assessment.id}
                      className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer transition-colors flex justify-between items-center"
                      onClick={() => handleAssessmentClick(assessment)}
                    >
                      <div>
                        <div className="flex items-center mb-1">
                          <h3 className="font-medium mr-2">{assessment.title}</h3>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            <CheckCircle className="mr-1 h-3 w-3" /> Completed
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Patient: {assessment.patientName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Completed on: {assessment.completionDate && formatDate(assessment.completionDate)}
                        </p>
                      </div>
                      
                      <div className="flex items-center">
                        {assessment.score !== undefined && (
                          <div className="mr-4 text-center">
                            <div className="text-2xl font-bold">{assessment.score}</div>
                            <div className="text-xs text-muted-foreground">Score</div>
                          </div>
                        )}
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {currentUser?.role === "claimant" && (
        <Card>
          <CardHeader>
            <CardTitle>Assessment Information</CardTitle>
            <CardDescription>What to expect from your psychological assessments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-4 bg-muted/50">
              <h3 className="font-medium mb-2 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
                About Psychological Assessments
              </h3>
              <p className="text-sm">
                Psychological assessments help us understand your mental health needs and guide your care. They typically take 30-60 minutes to complete and will ask questions about your thoughts, feelings, and experiences.
              </p>
            </div>
            
            <div className="rounded-md border p-4 bg-muted/50">
              <h3 className="font-medium mb-2">Privacy and Confidentiality</h3>
              <p className="text-sm">
                Your assessment results are kept confidential and are only shared with your care team. The information will be used solely for treatment planning and to support your insurance claim.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Assign Assessment Dialog */}
      <AddAssessmentDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddAssessment={handleAddAssessment}
        clientName="John Doe"
        clientInfo={{
          gender: "Male",
          age: 42,
          caseNumber: "WC2023-12345",
          sessionNumber: 3
        }}
      />

      {/* Active Assessment Dialog */}
      {activeAssessment && !showResults && (
        <Dialog open={!!activeAssessment} onOpenChange={(open) => !open && setActiveAssessment(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assessment</DialogTitle>
              <DialogDescription>
                Complete the assessment questions below.
              </DialogDescription>
            </DialogHeader>
            
            <DASS21Assessment 
              assessment={activeAssessment} 
              onComplete={handleAssessmentComplete}
              onCancel={() => setActiveAssessment(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Assessment Results Dialog */}
      {activeAssessment && showResults && assessmentResults && (
        <Dialog 
          open={showResults} 
          onOpenChange={(open) => {
            if (!open) {
              setShowResults(false);
              setActiveAssessment(null);
              setAssessmentResults(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[800px]">
            <AssessmentResultsComponent 
              assessment={activeAssessment}
              results={assessmentResults}
              onClose={() => {
                setShowResults(false);
                setActiveAssessment(null);
                setAssessmentResults(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Assessments;
