import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';

interface ClientGenogramProps {
  clientId: string;
}

interface GenogramData {
  mermaid_code: string;
}

const ClientGenogram = ({ clientId }: ClientGenogramProps) => {
  const [genogramData, setGenogramData] = useState<GenogramData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        
        const response = await fetch(`/api/genogram/${clientId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch genogram data');
        }
        
        const data: GenogramData = await response.json();
        setGenogramData(data);
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
    // Trigger re-fetch by updating a dependency
    const fetchGenogram = async () => {
      try {
        const response = await fetch(`/api/genogram/${clientId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch genogram data');
        }
        
        const data: GenogramData = await response.json();
        setGenogramData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGenogram();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Client Genogram</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {loading && <LoadingSpinner />}
        
        {error && (
          <ErrorDisplay 
            message={error} 
            onRetry={handleRetry}
          />
        )}
        
        {!loading && !error && genogramData && (
          <div 
            ref={mermaidRef}
            className="w-full overflow-auto"
            style={{ minHeight: '400px' }}
          />
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