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

  const getCaseProgress = (caseData: CaseSilo) => {
    // Calculate progress based on documents, assessments and reports
    const totalItems = 
      caseData.documents.length + 
      caseData.assessments.length + 
      caseData.reports.length;
    
    // Count completed items
    const completedAssessments = caseData.assessments.filter(a => a.status === 'completed').length;
    const completedReports = caseData.reports.filter(r => r.status === 'completed').length;
    
    // Documents are always considered "completed" once uploaded
    const completedItems = caseData.documents.length + completedAssessments + completedReports;
    
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
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
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-medium">WHO-ICF Snapshot</h4>
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
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-medium">Biopsychosocial Summary – {caseData.claimantName}</h4>
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
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-medium">PERMA+V Profile</h4>
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Case Summary - 2/5 width */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium mb-3">Case Summary</h3>
          <div className="space-y-3">
            {/* Status field */}
            <div className="flex justify-between p-2 bg-muted/20 rounded-md">
              <span className="font-medium">Status</span>
              <Badge variant={caseData.status === "active" ? "default" : "outline"}>
                {caseData.status === "active" ? "Active" : "Expired"}
              </Badge>
            </div>
            <div className="flex justify-between p-2 bg-muted/20 rounded-md">
              <span className="font-medium">Created</span>
              <span>{formatDate(caseData.createdDate)}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted/20 rounded-md">
              <span className="font-medium">Expiry</span>
              <span>{formatDate(caseData.expiryDate)}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted/20 rounded-md">
              <span className="font-medium">Case Progress</span>
              <span>{getCaseProgress(caseData)}%</span>
            </div>
          </div>

          {/* Key Participants moved below Case Summary */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Key Participants</h3>
            <div className="space-y-3">
              {/* Core participants side-by-side */}
              <div className="grid grid-cols-2 gap-3">
                {/* Client */}
                <div className="p-3 border rounded-md bg-primary/5 border-primary/20 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">C</div>
                    <div>
                      <p className="font-medium">{caseData.claimantName}</p>
                      <p className="text-xs text-muted-foreground">Claimant</p>
                    </div>
                  </div>
                </div>
                
                {/* Practitioner */}
                <div className="p-3 border rounded-md bg-primary/5 border-primary/20 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">P</div>
                    <div>
                      <p className="font-medium">Psychologist Name</p>
                      <p className="text-xs text-muted-foreground">Clinical Psychologist</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Other participants below */}
              <div className="space-y-2">
                {/* Lawyer */}
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground font-medium">L</div>
                    <div>
                      <p className="font-medium">Lawyer Name</p>
                      <p className="text-xs text-muted-foreground">Legal Representative</p>
                    </div>
                  </div>
                </div>
                
                {/* External contributors */}
                {caseData.participants?.others && caseData.participants.others.length > 0 && 
                  caseData.participants.others.map((contributor, index) => (
                    <div key={contributor.id} className="p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground font-medium">
                          {contributor.role.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{contributor.email.split('@')[0]}</p>
                          <p className="text-xs text-muted-foreground">{contributor.role}</p>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - 3/5 width */}
        <div className="md:col-span-3">
          {/* Tri-state Toggle Button */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Functioning Profile & Wellbeing Matrix</h3>
              <span className="text-sm text-muted-foreground">Last updated: 03-Mar-2025</span>
            </div>
            <ToggleGroup 
              type="single" 
              value={selectedFramework} 
              onValueChange={setSelectedFramework}
              className="justify-start"
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
            <div className="mt-3 p-3 border rounded-md bg-muted/30">
              {renderFrameworkContent()}
            </div>
          </div>
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
