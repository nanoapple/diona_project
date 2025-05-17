
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CircleHelp,
  CheckCircle,
  Clock,
  Plus, 
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { InfoRequest, UserRole } from '@/types';
import { formatDate } from '@/lib/utils';

interface InfoRequestsProps {
  requests: InfoRequest[];
  canCreate: boolean;
  onCreateItem: () => void;
  userRole?: UserRole;
}

const InfoRequests = ({ requests, canCreate, onCreateItem, userRole }: InfoRequestsProps) => {
  const [expandedRequests, setExpandedRequests] = useState<string[]>([]);
  
  const toggleExpand = (id: string) => {
    setExpandedRequests(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  const getStatusBadge = (status: 'pending' | 'completed') => {
    if (status === 'pending') {
      return (
        <Badge variant="secondary" className="flex gap-1 items-center text-xs">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    }

    return (
      <Badge variant="default" className="flex gap-1 items-center text-xs bg-green-600">
        <CheckCircle className="h-3 w-3" />
        Completed
      </Badge>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Information Requests</h3>
        {canCreate && (
          <Button size="sm" onClick={onCreateItem}>
            <Plus className="w-4 h-4 mr-1" /> Create Request
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <CircleHelp className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
            <h3 className="mt-3 text-lg font-medium">No Information Requests</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
              {canCreate 
                ? "Create requests to gather information from others involved in the case"
                : "There are currently no active information requests"
              }
            </p>
            {canCreate && (
              <Button className="mt-4" size="sm" variant="outline" onClick={onCreateItem}>
                <Plus className="w-4 h-4 mr-1" /> Create Request
              </Button>
            )}
          </div>
        ) : (
          requests.map(request => (
            <div key={request.id} className="border rounded-md overflow-hidden">
              <div 
                className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer"
                onClick={() => toggleExpand(request.id)}
              >
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {request.title}
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Requested by: {request.requestedBy} • {formatDate(request.requestedAt)}
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  {expandedRequests.includes(request.id) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {expandedRequests.includes(request.id) && (
                <div className="p-3 border-t bg-accent/20">
                  <h4 className="text-sm font-medium mb-2">Questions:</h4>
                  <ol className="list-decimal list-inside space-y-2">
                    {request.questions.map((question, index) => (
                      <li key={index} className="text-sm">
                        {question}
                      </li>
                    ))}
                  </ol>
                  
                  {(userRole === 'claimant' && request.status === 'pending') && (
                    <div className="mt-4 flex justify-end">
                      <Button>Respond to Request</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InfoRequests;
