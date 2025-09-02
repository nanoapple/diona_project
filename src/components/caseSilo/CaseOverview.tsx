import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CaseSilo } from "@/types";
import { formatDate } from "@/lib/utils";
import { FileText, ClipboardCheck, Book, MessageSquare, Edit } from "lucide-react";
import { useState } from "react";
import EditFrameworkDialog from "./EditFrameworkDialog";
import ClientGenogram from "./ClientGenogram";

interface CaseOverviewProps {
  caseData: CaseSilo;
}

// Map of category tag IDs to full names
const CATEGORY_FULL_NAMES: Record<string, string> = {
  'ANX': 'Anxiety / Stress',
  'MOOD': 'Mood Disorders',
  'TRM': 'Trauma / PTSD',
  'PERS': 'Personality / Behaviour',
  'REL': 'Relationships / Families',
  'LIFE': 'Life Changes / Grief',
  'WORK': 'Workplace Stress / Bullying',
  'LEGAL': 'Legal / Compensation Issues',
  'PAIN': 'Pain / Physical Injury',
  'NDV': 'Neurodiversity Support',
  'EDU': 'Academic / School Challenges',
  'EXIS': 'Existential / Spiritual Crises',
  'SOC': 'Cultural / Social Oppression',
  'IDEN': 'Identity / Affirmation',
  'JUST': 'Forensic / Justice Involvement',
  'MED': 'Medical / Health Psychology',
  'ADDX': 'Addiction / Compulsive Behaviour',
  'COG': 'Cognitive Decline / Dementia',
};

// Function to get tag color variant
const getTagColorVariant = (tag: string) => {
  const tagGroups: Record<string, string> = {
    'ANX': 'blue',
    'MOOD': 'purple',
    'TRM': 'red',
    'PERS': 'orange',
    'REL': 'pink',
    'LIFE': 'yellow',
    'WORK': 'green',
    'LEGAL': 'slate',
    'PAIN': 'rose',
    'NDV': 'indigo',
    'EDU': 'cyan',
    'EXIS': 'violet',
    'SOC': 'amber',
    'IDEN': 'lime',
    'JUST': 'gray',
    'MED': 'emerald',
    'ADDX': 'fuchsia',
    'COG': 'teal',
  };
  
  return tagGroups[tag] || 'default';
};

const CaseOverview = ({ caseData }: CaseOverviewProps) => {
  const [selectedFramework, setSelectedFramework] = useState("Bio-Psy-Soc");
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // Framework data state
  const [frameworkData, setFrameworkData] = useState({
    'Bio-Psy-Soc': {
      biological: "Michael presents with residual pain and fatigue following a motor vehicle accident. He experiences severe sleep disruption due to nightmares and hypervigilance. His physical health is further impacted by increased nicotine use (over 20 cigarettes/day) and poor nutrition. Although prescribed anxiolytics, adherence is inconsistent.",
      psychological: "He meets criteria for PTSD, with symptoms including intrusive thoughts, avoidance, emotional numbing, and hyperarousal. He also shows signs of depression and anxiety, along with cognitive distortions such as self-blame and catastrophic thinking. Coping is largely avoidant, and motivation to engage fully in therapy remains low.",
      social: "Michael lives alone and has become socially isolated. While he maintains remote contact with family, he has disengaged from church and community roles. Financial stress and cultural stigma about mental health contribute to feelings of shame and reinforce his withdrawal from social and spiritual supports."
    },
    'WHO-ICF': {
      bodyFunctions: "PTSD symptoms, disrupted sleep, chronic pain, emotional dysregulation",
      activities: "Avoids driving, withdrawn from social and religious roles, unemployed",
      participation: "Ceased volunteering, disengaged from community and church",
      environmental: "Family support (remote), cultural stigma, insurance stress, spiritual disconnect",
      personal: "Male, 34, Eastern Orthodox, identity loss, ambivalence about help-seeking"
    },
    'PERMA+V': {
      positiveEmotions: { rating: 3, comment: "Brief moments of peace during prayer; otherwise low affect" },
      engagement: { rating: 2, comment: "Avoids activities once enjoyed (e.g. woodworking, reading)" },
      relationships: { rating: 4, comment: "Maintains phone contact with family; socially withdrawn" },
      meaning: { rating: 5, comment: "Spiritual questioning; loss of vocational and volunteer identity" },
      achievement: { rating: 2, comment: "Feels like a failure due to unemployment and inactivity" },
      vitality: { rating: 3, comment: "Poor sleep, fatigue, chain-smoking, neglects physical health" }
    }
  });

  const getSessionCount = (caseData: CaseSilo) => {
    // Calculate sessions based on case notes and appointments
    // For now, return a mock value - in real app, this would come from appointments or session records
    return Math.floor(Math.random() * 20) + 5; // Mock: 5-25 sessions
  };

  const renderTimelineItem = (item: any, type: string) => {
    const getIcon = () => {
      switch (type) {
        case 'document': return <FileText className="w-4 h-4" />;
        case 'assessment': return <ClipboardCheck className="w-4 h-4" />;
        case 'report': return <Book className="w-4 h-4" />;
        case 'note': return <MessageSquare className="w-4 h-4" />;
        default: return <FileText className="w-4 h-4" />;
      }
    };

    return (
      <div key={item.id} className="flex gap-3 mb-4 relative">
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 shrink-0">
          {getIcon()}
        </div>
        <div className="relative pb-8 border-l border-muted ml-4 pl-4 -mt-2">
          <h4 className="text-sm font-medium">{type === 'note' ? 'Case Note Added' : item.name || item.title}</h4>
          <p className="text-xs text-muted-foreground">
            {type === 'document' || type === 'external' 
              ? `Uploaded by ${item.uploadedBy}`
              : type === 'note' 
                ? item.content.substring(0, 50) + (item.content.length > 50 ? '...' : '')
                : item.description || ''}
          </p>
          <span className="text-xs text-muted-foreground absolute top-0 right-0">
            {formatDate(item.uploadDate || item.date || item.createdAt)}
          </span>
        </div>
      </div>
    );
  };

  const handleFrameworkSave = (updatedData: any) => {
    setFrameworkData(prev => ({
      ...prev,
      [selectedFramework]: updatedData
    }));
  };

  const renderFrameworkContent = () => {
    const currentData = frameworkData[selectedFramework as keyof typeof frameworkData];
    
    switch (selectedFramework) {
      case "WHO-ICF":
        const whoData = currentData as { bodyFunctions: string; activities: string; participation: string; environmental: string; personal: string; };
        return (
          <div>
            <div className="flex justify-end mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowEditDialog(true)}
                className="p-1 h-auto"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="h-10">
                  <TableHead className="w-1/3 py-2">Domain</TableHead>
                  <TableHead className="py-2">Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium py-3">Body Functions</TableCell>
                  <TableCell className="py-3">{whoData.bodyFunctions}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium py-3">Activities</TableCell>
                  <TableCell className="py-3">{whoData.activities}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium py-3">Participation</TableCell>
                  <TableCell className="py-3">{whoData.participation}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium py-3">Environmental Factors</TableCell>
                  <TableCell className="py-3">{whoData.environmental}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium py-3">Personal Factors</TableCell>
                  <TableCell className="py-3">{whoData.personal}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        );
      
      case "Bio-Psy-Soc":
        const bioData = currentData as { biological: string; psychological: string; social: string; };
        return (
          <div>
            <div className="flex justify-end mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowEditDialog(true)}
                className="p-1 h-auto"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="h-10">
                  <TableHead className="w-1/6 py-2">Domain</TableHead>
                  <TableHead className="py-2">Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium py-3">Biological</TableCell>
                  <TableCell className="py-3">{bioData.biological}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium py-3">Psychological</TableCell>
                  <TableCell className="py-3">{bioData.psychological}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium py-3">Social</TableCell>
                  <TableCell className="py-3">{bioData.social}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        );
      
      case "PERMA+V":
        const permaData = currentData as { 
          positiveEmotions: { rating: number; comment: string }; 
          engagement: { rating: number; comment: string }; 
          relationships: { rating: number; comment: string }; 
          meaning: { rating: number; comment: string }; 
          achievement: { rating: number; comment: string }; 
          vitality: { rating: number; comment: string }; 
        };
        return (
          <div>
            <div className="flex justify-end mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowEditDialog(true)}
                className="p-1 h-auto"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="h-10">
                  <TableHead className="w-1/4 py-2">Element</TableHead>
                  <TableHead className="w-1/6 py-2">Rating (/10)</TableHead>
                  <TableHead className="py-2">Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium py-3">Positive Emotions</TableCell>
                  <TableCell className="text-center py-3">{permaData.positiveEmotions.rating}</TableCell>
                  <TableCell className="py-3">{permaData.positiveEmotions.comment}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium py-3">Engagement</TableCell>
                  <TableCell className="text-center py-3">{permaData.engagement.rating}</TableCell>
                  <TableCell className="py-3">{permaData.engagement.comment}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium py-3">Relationships</TableCell>
                  <TableCell className="text-center py-3">{permaData.relationships.rating}</TableCell>
                  <TableCell className="py-3">{permaData.relationships.comment}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium py-3">Meaning</TableCell>
                  <TableCell className="text-center py-3">{permaData.meaning.rating}</TableCell>
                  <TableCell className="py-3">{permaData.meaning.comment}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium py-3">Achievement</TableCell>
                  <TableCell className="text-center py-3">{permaData.achievement.rating}</TableCell>
                  <TableCell className="py-3">{permaData.achievement.comment}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium py-3">Vitality</TableCell>
                  <TableCell className="text-center py-3">{permaData.vitality.rating}</TableCell>
                  <TableCell className="py-3">{permaData.vitality.comment}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Case Summary - Full width */}
      <div>
        <h3 className="text-lg font-medium mb-3">Case Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Status */}
          <div className="flex flex-col items-center p-4 bg-muted/20 rounded-md">
            <span className="text-sm font-medium text-muted-foreground mb-2">Status</span>
            <Badge variant={caseData.status === "active" ? "default" : "outline"}>
              {caseData.status === "active" ? "Active" : "Expired"}
            </Badge>
          </div>
          
          {/* Created */}
          <div className="flex flex-col items-center p-4 bg-muted/20 rounded-md">
            <span className="text-sm font-medium text-muted-foreground mb-2">Created</span>
            <span className="font-medium">{formatDate(caseData.createdDate)}</span>
          </div>
          
          {/* No. of Sessions */}
          <div className="flex flex-col items-center p-4 bg-muted/20 rounded-md">
            <span className="text-sm font-medium text-muted-foreground mb-2">No. of Sessions</span>
            <span className="font-medium text-2xl">{getSessionCount(caseData)}</span>
          </div>
        </div>
      </div>

      {/* Functioning Profile & Wellbeing Matrix - 50% width */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Functioning Profile & Wellbeing Matrix</h3>
            <span className="text-sm text-muted-foreground">Last updated: 03-Mar-2025</span>
          </div>
          <ToggleGroup 
            type="single" 
            value={selectedFramework} 
            onValueChange={setSelectedFramework}
            className="justify-start mb-3"
          >
            <ToggleGroupItem value="WHO-ICF" aria-label="WHO-ICF Framework">
              WHO-ICF
            </ToggleGroupItem>
            <ToggleGroupItem value="Bio-Psy-Soc" aria-label="Bio-Psycho-Social Framework">
              Bio-Psy-Soc
            </ToggleGroupItem>
            <ToggleGroupItem value="PERMA+V" aria-label="PERMA+V Framework">
              PERMA+V
            </ToggleGroupItem>
          </ToggleGroup>
          
          {/* Framework content with tables */}
          <div className="p-3 border rounded-md bg-muted/30">
            {renderFrameworkContent()}
          </div>
        </div>
        
        {/* Right side - Client Genogram */}
        <div>
          <ClientGenogram clientId={caseData.id} />
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Case Activity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <FileText className="w-4 h-4 mr-1 text-primary" /> 
                <h4 className="text-sm font-medium">Documents</h4>
              </div>
              <div className="text-2xl font-bold">{caseData.documents.length}</div>
              <p className="text-xs text-muted-foreground">files uploaded</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <ClipboardCheck className="w-4 h-4 mr-1 text-primary" />
                <h4 className="text-sm font-medium">Assessments</h4>
              </div>
              <div className="text-2xl font-bold">{caseData.assessments.length}</div>
              <p className="text-xs text-muted-foreground">
                {caseData.assessments.filter(a => a.status === 'completed').length} completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Book className="w-4 h-4 mr-1 text-primary" />
                <h4 className="text-sm font-medium">Reports</h4>
              </div>
              <div className="text-2xl font-bold">{caseData.reports.length}</div>
              <p className="text-xs text-muted-foreground">
                {caseData.reports.filter(r => r.status === 'completed').length} finalized
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <MessageSquare className="w-4 h-4 mr-1 text-primary" />
                <h4 className="text-sm font-medium">Notes</h4>
              </div>
              <div className="text-2xl font-bold">{caseData.notes.length}</div>
              <p className="text-xs text-muted-foreground">case notes</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
        <div className="space-y-4">
          {caseData.notes.length > 0 && renderTimelineItem(caseData.notes[0], 'note')}
          {caseData.documents.length > 0 && renderTimelineItem(caseData.documents[0], 'document')}
          {caseData.assessments.length > 0 && renderTimelineItem(caseData.assessments[0], 'assessment')}
        </div>
      </div>

      {/* Edit Framework Dialog */}
      <EditFrameworkDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        framework={selectedFramework as 'WHO-ICF' | 'Bio-Psy-Soc' | 'PERMA+V'}
        data={frameworkData[selectedFramework as keyof typeof frameworkData]}
        onSave={handleFrameworkSave}
      />
    </div>
  );
};

export default CaseOverview;
