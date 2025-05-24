import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CaseSilo } from "@/types";
import { formatDate } from "@/lib/utils";
import { FileText, ClipboardCheck, Book, MessageSquare } from "lucide-react";
import { useState } from "react";

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

  const renderFrameworkContent = () => {
    switch (selectedFramework) {
      case "WHO-ICF":
        return (
          <div>
            <h4 className="text-md font-medium mb-3">WHO-ICF Snapshot</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Domain</TableHead>
                  <TableHead>Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Body Functions</TableCell>
                  <TableCell>PTSD symptoms, disrupted sleep, chronic pain, emotional dysregulation</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Activities</TableCell>
                  <TableCell>Avoids driving, withdrawn from social and religious roles, unemployed</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Participation</TableCell>
                  <TableCell>Ceased volunteering, disengaged from community and church</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Environmental Factors</TableCell>
                  <TableCell>Family support (remote), cultural stigma, insurance stress, spiritual disconnect</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Personal Factors</TableCell>
                  <TableCell>Male, 34, Eastern Orthodox, identity loss, ambivalence about help-seeking</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        );
      
      case "Bio-Psy-Soc":
        return (
          <div>
            <h4 className="text-md font-medium mb-3">Biopsychosocial Summary – {caseData.claimantName}</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/6">Domain</TableHead>
                  <TableHead>Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Biological</TableCell>
                  <TableCell>Michael presents with residual pain and fatigue following a motor vehicle accident. He experiences severe sleep disruption due to nightmares and hypervigilance. His physical health is further impacted by increased nicotine use (over 20 cigarettes/day) and poor nutrition. Although prescribed anxiolytics, adherence is inconsistent.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Psychological</TableCell>
                  <TableCell>He meets criteria for PTSD, with symptoms including intrusive thoughts, avoidance, emotional numbing, and hyperarousal. He also shows signs of depression and anxiety, along with cognitive distortions such as self-blame and catastrophic thinking. Coping is largely avoidant, and motivation to engage fully in therapy remains low.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Social</TableCell>
                  <TableCell>Michael lives alone and has become socially isolated. While he maintains remote contact with family, he has disengaged from church and community roles. Financial stress and cultural stigma about mental health contribute to feelings of shame and reinforce his withdrawal from social and spiritual supports.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        );
      
      case "PERMA+V":
        return (
          <div>
            <h4 className="text-md font-medium mb-3">PERMA+V Profile</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4">Element</TableHead>
                  <TableHead className="w-1/6">Rating (/10)</TableHead>
                  <TableHead>Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Positive Emotions</TableCell>
                  <TableCell className="text-center">3</TableCell>
                  <TableCell>Brief moments of peace during prayer; otherwise low affect</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Engagement</TableCell>
                  <TableCell className="text-center">2</TableCell>
                  <TableCell>Avoids activities once enjoyed (e.g. woodworking, reading)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Relationships</TableCell>
                  <TableCell className="text-center">4</TableCell>
                  <TableCell>Maintains phone contact with family; socially withdrawn</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Meaning</TableCell>
                  <TableCell className="text-center">5</TableCell>
                  <TableCell>Spiritual questioning; loss of vocational and volunteer identity</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Achievement</TableCell>
                  <TableCell className="text-center">2</TableCell>
                  <TableCell>Feels like a failure due to unemployment and inactivity</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Vitality</TableCell>
                  <TableCell className="text-center">3</TableCell>
                  <TableCell>Poor sleep, fatigue, chain-smoking, neglects physical health</TableCell>
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
            <h3 className="text-lg font-medium mb-3">Functioning Profile & Wellbeing Matrix</h3>
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
            <div className="mt-4 p-4 border rounded-md bg-card">
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
    </div>
  );
};

export default CaseOverview;
