
import { useState, useEffect } from 'react';
import { Circle, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';

type Status = 'pending' | 'connecting' | 'active' | 'disconnected' | 'ended';

interface InterviewStatusProps {
  status: Status;
  onEndInterview?: () => void;
}

export default function InterviewStatus({ status, onEndInterview }: InterviewStatusProps) {
  const [currentTime, setCurrentTime] = useState<string>('00:00');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (status === 'active') {
      intervalId = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [status]);
  
  useEffect(() => {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    setCurrentTime(`${formattedMinutes}:${formattedSeconds}`);
  }, [elapsedSeconds]);
  
  const getStatusIndicator = () => {
    switch (status) {
      case 'pending':
        return <Circle className="h-3 w-3 text-yellow-500 animate-pulse" />;
      case 'connecting':
        return <Circle className="h-3 w-3 text-blue-500 animate-pulse" />;
      case 'active':
        return <Circle className="h-3 w-3 text-green-500 animate-pulse" />;
      case 'disconnected':
        return <XCircle className="h-3 w-3 text-red-500" />;
      case 'ended':
        return <CheckCircle className="h-3 w-3 text-gray-500" />;
      default:
        return <HelpCircle className="h-3 w-3 text-gray-500" />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Waiting for interview to start';
      case 'connecting':
        return 'Connecting...';
      case 'active':
        return 'Interview in progress';
      case 'disconnected':
        return 'Connection lost';
      case 'ended':
        return 'Interview ended';
      default:
        return 'Unknown status';
    }
  };
  
  const showEndButton = status === 'active' && onEndInterview && 
    currentUser?.role === 'psychologist';
  
  return (
    <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
      <div className="flex items-center gap-2">
        {getStatusIndicator()}
        <span>{getStatusText()}</span>
      </div>
      <div className="flex items-center gap-3">
        {status === 'active' && (
          <span className="font-mono">{currentTime}</span>
        )}
        {showEndButton && (
          <Button 
            variant="outline" 
            size="sm"
            className="h-7 px-2"
            onClick={onEndInterview}
          >
            End Interview
          </Button>
        )}
      </div>
    </div>
  );
}
