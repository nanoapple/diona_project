
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Clock, AlertCircle } from 'lucide-react';
import { CaseSilo } from '@/types';
import { formatDate } from '@/lib/utils';

interface CaseSiloListProps {
  caseSilos: CaseSilo[];
  onSelectCase: (id: string) => void;
  searchTerm: string;
}

const CaseSiloList: React.FC<CaseSiloListProps> = ({ caseSilos, onSelectCase, searchTerm }) => {
  // Calculate days until expiry for a case
  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get badge variant based on status
  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'active':
        return 'default';
      case 'expiring_soon':
        return 'secondary'; // Using secondary instead of warning (which doesn't exist in the badge component)
      case 'expired':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Get status label
  const getStatusLabel = (status: string, expiryDate: string) => {
    const daysLeft = getDaysUntilExpiry(expiryDate);
    
    switch(status) {
      case 'active':
        return `Active (Expires in ${daysLeft} days)`;
      case 'expiring_soon':
        return `Expiring Soon (${daysLeft} days left)`;
      case 'expired':
        return 'Expired (Read Only)';
      default:
        return status;
    }
  };

  const getCategoryTagBadges = (caseSilo: CaseSilo) => {
    if (!caseSilo.categoryTags || caseSilo.categoryTags.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {caseSilo.categoryTags.map(tag => (
          <Badge key={tag} variant="outline" className="text-xs bg-muted/50">
            {tag}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {caseSilos.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            {searchTerm ? (
              <>
                <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No matching cases</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  No cases match your search term "{searchTerm}"
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No cases available</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You don't have any cases in your silo yet
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        caseSilos.map((caseSilo) => (
          <Card 
            key={caseSilo.id}
            className="cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => onSelectCase(caseSilo.id)}
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-medium">{caseSilo.claimantName}</h3>
                    <Badge variant={getStatusBadgeVariant(caseSilo.status)}>
                      {caseSilo.status === 'active' ? 'Active' : 
                       caseSilo.status === 'expiring_soon' ? 'Expiring Soon' : 
                       'Expired'}
                    </Badge>
                  </div>
                  
                  <div className="text-muted-foreground">
                    {caseSilo.caseType}
                    {caseSilo.claimNumber && ` • Claim #${caseSilo.claimNumber}`}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Created {formatDate(caseSilo.createdDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {getStatusLabel(caseSilo.status, caseSilo.expiryDate)}
                    </div>
                    {caseSilo.injuryDate && (
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Injury Date: {formatDate(caseSilo.injuryDate)}
                      </div>
                    )}
                  </div>

                  {getCategoryTagBadges(caseSilo)}
                </div>
                
                <div>
                  <Button variant="outline" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    onSelectCase(caseSilo.id);
                  }}>
                    View Case
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default CaseSiloList;
