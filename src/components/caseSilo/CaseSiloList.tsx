
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CaseSilo } from '@/types';
import { formatDate } from '@/lib/utils';
import { Clock, AlertCircle, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CaseSiloListProps {
  caseSilos: CaseSilo[];
  onSelectCase: (caseId: string) => void;
  searchTerm?: string;
}

// Function to get tag color variant
const getTagColorVariant = (tag: string) => {
  const tagGroups: Record<string, string> = {
    'ANX': 'bg-blue-100 text-blue-800',
    'MOOD': 'bg-purple-100 text-purple-800',
    'TRM': 'bg-red-100 text-red-800',
    'PERS': 'bg-orange-100 text-orange-800',
    'REL': 'bg-pink-100 text-pink-800',
    'LIFE': 'bg-yellow-100 text-yellow-800',
    'WORK': 'bg-green-100 text-green-800',
    'LEGAL': 'bg-slate-100 text-slate-800',
    'PAIN': 'bg-rose-100 text-rose-800',
    'NDV': 'bg-indigo-100 text-indigo-800',
    'EDU': 'bg-cyan-100 text-cyan-800',
    'EXIS': 'bg-violet-100 text-violet-800',
    'SOC': 'bg-amber-100 text-amber-800',
    'IDEN': 'bg-lime-100 text-lime-800',
    'JUST': 'bg-gray-100 text-gray-800',
    'MED': 'bg-emerald-100 text-emerald-800',
    'ADDX': 'bg-fuchsia-100 text-fuchsia-800',
    'COG': 'bg-teal-100 text-teal-800',
  };
  
  return tagGroups[tag] || 'bg-gray-100 text-gray-800';
};

// Get status display
const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'active':
      return { icon: <Clock className="h-4 w-4 text-blue-500" />, text: 'Active', class: 'text-blue-500' };
    case 'expiring_soon':
      return { icon: <Clock className="h-4 w-4 text-amber-500" />, text: 'Expiring Soon', class: 'text-amber-500' };
    case 'expired':
      return { icon: <AlertCircle className="h-4 w-4 text-red-500" />, text: 'Expired', class: 'text-red-500' };
    default:
      return { icon: <Clock className="h-4 w-4 text-gray-500" />, text: 'Unknown', class: 'text-gray-500' };
  }
};

const CaseSiloList: React.FC<CaseSiloListProps> = ({ caseSilos, onSelectCase, searchTerm = '' }) => {
  if (caseSilos.length === 0) {
    return searchTerm ? (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium">No matching cases</h3>
        <p className="text-sm text-muted-foreground">
          No cases found matching "{searchTerm}"
        </p>
      </div>
    ) : (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium">No cases available</h3>
        <p className="text-sm text-muted-foreground">
          You don't have any cases in your silo yet
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {caseSilos.map((caseSilo) => {
        const status = getStatusDisplay(caseSilo.status);
        
        return (
          <Card 
            key={caseSilo.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectCase(caseSilo.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{caseSilo.claimantName}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {status.icon}
                    <span className={`text-sm ${status.class}`}>{status.text}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{caseSilo.caseType}</p>
                  {caseSilo.claimNumber && (
                    <p className="text-sm text-muted-foreground">Claim #{caseSilo.claimNumber}</p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-1 mt-4">
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="w-20">Created:</span>
                  <span>{formatDate(caseSilo.createdDate)}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="w-20">Expires:</span>
                  <span>{formatDate(caseSilo.expiryDate)}</span>
                </div>
              </div>
              
              {/* Show category tags at the bottom right */}
              {caseSilo.categoryTags && caseSilo.categoryTags.length > 0 && (
                <div className="flex flex-wrap justify-end gap-1 mt-2">
                  {caseSilo.categoryTags.map(tag => (
                    <span 
                      key={tag} 
                      className={`text-xs px-2 py-1 rounded-full ${getTagColorVariant(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <Button className="w-full mt-3" variant="outline" onClick={() => onSelectCase(caseSilo.id)}>
                <User className="mr-2 h-4 w-4" /> View Case
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export const CaseSiloListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
            <Skeleton className="h-9 w-full mt-3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CaseSiloList;
