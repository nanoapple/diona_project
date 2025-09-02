import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { Send } from 'lucide-react';

interface ClientGenogramProps {
  clientId: string;
}

interface GenogramData {
  mermaid_code: string;
  generated_date: string;
}

const ClientGenogram = ({ clientId }: ClientGenogramProps) => {
  const [genogramData, setGenogramData] = useState<GenogramData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [updating, setUpdating] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const diagramId = `genogram-${clientId}-${Date.now()}`;

  useEffect(() => {
    // Initialize Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit'
    });
  }, []);

  useEffect(() => {
    const fetchGenogram = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock data for now - replace with actual API call when backend is ready
        const mockData: GenogramData = {
          mermaid_code: `graph TD
    %% Family of origin
    Father[Father ♂] -.distant.-> Client[Client ♂<br/>Migrant, Depression, Bipolar hx, Smoker]
    Mother((Mother ♀)) -.distant.-> Client
    Brother[Brother ♂] -.distant.-> Client

    %% First marriage (distant)
    Client -.distant.-> ExWife((Ex-Wife ♀))
    ExWife --- Son1[Son 1 ♂]
    ExWife --- Son2[Son 2 ♂]

    %% Current partner (normal)
    Client --- Partner((Current Partner ♀))
    Partner --- StepDaughter((Stepdaughter ♀))

    %% Life events
    Work[Work injury<br/>10 months ago<br/>Bullying] -->|Abuse| Client
    Accident[Car accident<br/>Recent] ---|Current issue| Client
    
    %% Styles
    style Client fill:#fdd,stroke:#f66,stroke-width:2px
    style Work fill:#ffd,stroke:#fc3
    style Accident fill:#ffd,stroke:#f93,stroke-width:4px`,
          generated_date: new Date().toISOString()
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setGenogramData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchGenogram();
    }
  }, [clientId]);

  useEffect(() => {
    const renderDiagram = async () => {
      if (genogramData?.mermaid_code && mermaidRef.current) {
        try {
          // Clear previous diagram
          mermaidRef.current.innerHTML = '';
          
          // Render new diagram
          const { svg } = await mermaid.render(diagramId, genogramData.mermaid_code);
          mermaidRef.current.innerHTML = svg;
        } catch (err) {
          console.error('Error rendering Mermaid diagram:', err);
          setError('Failed to render genogram diagram');
        }
      }
    };

    renderDiagram();
  }, [genogramData, diagramId]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Trigger re-fetch with mock data
    const fetchGenogram = async () => {
      try {
        const mockData: GenogramData = {
          mermaid_code: `graph TD
    %% Family of origin
    Father[Father ♂] -.distant.-> Client[Client ♂<br/>Migrant, Depression, Bipolar hx, Smoker]
    Mother((Mother ♀)) -.distant.-> Client
    Brother[Brother ♂] -.distant.-> Client

    %% First marriage (distant)
    Client -.distant.-> ExWife((Ex-Wife ♀))
    ExWife --- Son1[Son 1 ♂]
    ExWife --- Son2[Son 2 ♂]

    %% Current partner (normal)
    Client --- Partner((Current Partner ♀))
    Partner --- StepDaughter((Stepdaughter ♀))

    %% Life events
    Work[Work injury<br/>10 months ago<br/>Bullying] -->|Abuse| Client
    Accident[Car accident<br/>Recent] ---|Current issue| Client
    
    %% Styles
    style Client fill:#fdd,stroke:#f66,stroke-width:2px
    style Work fill:#ffd,stroke:#fc3
    style Accident fill:#ffd,stroke:#f93,stroke-width:4px`,
          generated_date: new Date().toISOString()
        };
        
        await new Promise(resolve => setTimeout(resolve, 500));
        setGenogramData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGenogram();
  };

  const handleUpdateGenogram = async () => {
    if (!prompt.trim()) return;
    
    setUpdating(true);
    try {
      // Simulate API call to update genogram based on prompt
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just update the generated date
      if (genogramData) {
        setGenogramData({
          ...genogramData,
          generated_date: new Date().toISOString()
        });
      }
      
      setPrompt('');
    } catch (err) {
      setError('Failed to update genogram');
    } finally {
      setUpdating(false);
    }
  };

  const formatGeneratedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        {loading && <LoadingSpinner />}
        
        {error && (
          <ErrorDisplay 
            message={error} 
            onRetry={handleRetry}
          />
        )}
        
        {!loading && !error && genogramData && (
          <>
            {/* Generation date and prompt input */}
            <div className="mb-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Last updated: {formatGeneratedDate(genogramData.generated_date)}
              </p>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Enter prompt to update genogram..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateGenogram()}
                  disabled={updating}
                  className="flex-1"
                />
                <Button 
                  onClick={handleUpdateGenogram}
                  disabled={!prompt.trim() || updating}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Genogram diagram */}
            <div 
              ref={mermaidRef}
              className="w-full overflow-auto border rounded-md bg-background"
              style={{ minHeight: '400px' }}
            />
          </>
        )}
        
        {!loading && !error && !genogramData && (
          <div className="text-center py-12 text-muted-foreground">
            No genogram data available for this client
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientGenogram;