import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import InterviewStatus from '@/components/InterviewStatus';
import ErrorDisplay from '@/components/ErrorDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';

const Interview = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [interviewStatus, setInterviewStatus] = useState<'pending' | 'connecting' | 'active' | 'disconnected' | 'ended'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Simulate interview connection process
    const connectToInterview = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate successful connection
        setInterviewStatus('connecting');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setInterviewStatus('active');
      } catch (err) {
        setError('Failed to connect to the interview. Please try again.');
        setInterviewStatus('disconnected');
      } finally {
        setIsLoading(false);
      }
    };

    if (caseId) {
      connectToInterview();
    } else {
      setError('Case ID is missing.');
      setIsLoading(false);
    }
  }, [caseId]);

  const endInterview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate ending the interview
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInterviewStatus('ended');
      navigate(`/case/${caseId}`); // Redirect to case details page
    } catch (err) {
      setError('Failed to end the interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update the role comparison to use the proper UserRole type
  const isPsychologist = currentUser?.role === 'psychologist';
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">Interview with Client</CardTitle>
          <CardDescription>
            Conducting interview for case ID: {caseId}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InterviewStatus status={interviewStatus} onEndInterview={endInterview} />
          <Separator />
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/150?img=5" alt="Client Avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Client Name</p>
              <p className="text-sm text-muted-foreground">Client Role</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={currentUser?.avatar || "https://i.pravatar.cc/150?img=9"} alt="Your Avatar" />
              <AvatarFallback>{currentUser?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{currentUser?.name}</p>
              <p className="text-sm text-muted-foreground">{currentUser?.title} at {currentUser?.company}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Interview;
