
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Mic, MicOff, Upload, Loader2, FileText, Edit, MessageSquare } from "lucide-react";

interface AddNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (noteData: any) => void;
}

type NoteMode = 'selection' | 'write' | 'dictate' | 'ocr';

const noteStructure = [
  {
    id: 'presenting_concerns',
    title: '1. Presenting Concerns',
    description: 'Concise summary of key issue(s) prompting the session/referral.'
  },
  {
    id: 'presentation_mental_state',
    title: '2. Presentation, Mental State & Affect',
    description: 'Brief observations of mood, energy, behaviour, and emotional tone.'
  },
  {
    id: 'cognitive_themes',
    title: '3. Cognitive Themes & Thought Style',
    description: 'Cognitive functions, distortions, insight, internal conflicts.'
  },
  {
    id: 'functional_impact',
    title: '4. Functional Impact',
    description: 'ADLs; Work/school performance; Relationships; Role functioning'
  },
  {
    id: 'psychological_history',
    title: '5. Psychological History & Maintaining Factors',
    description: 'Brief background and perpetuating dynamics.'
  },
  {
    id: 'treatment_focus',
    title: '6. Treatment Focus & Interventions',
    description: 'Current modality used, strategies applied, therapeutic stance.'
  },
  {
    id: 'progress_indicators',
    title: '7. Progress Indicators or Protective Factors',
    description: 'Client feedback, symptom trajectory, compliance with tasks, new insight.'
  },
  {
    id: 'barriers_risk_factors',
    title: '8. Barriers and/or Risk Factors',
    description: 'Any ambivalence, structural or internalised blocks to therapy or recovery. Suicidal ideation, psychosocial strengths, medication stability.'
  },
  {
    id: 'plan_next_steps',
    title: '9. Plan / Next Steps',
    description: 'Short-term goals, upcoming focus, coordination needs, home practice.'
  }
];

const AddNotesDialog = ({ open, onOpenChange, onSave }: AddNotesDialogProps) => {
  const { toast } = useToast();
  const [mode, setMode] = useState<NoteMode>('selection');
  const [noteData, setNoteData] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleModeSelect = (selectedMode: NoteMode) => {
    setMode(selectedMode);
    setNoteData({});
    setAudioFile(null);
    setUploadedFile(null);
  };

  const handleNoteChange = (sectionId: string, value: string) => {
    setNoteData(prev => ({
      ...prev,
      [sectionId]: value
    }));
  };

  const handleRecordingToggle = () => {
    if (isRecording) {
      // Stop recording - in a real app, this would stop the actual recording
      setIsRecording(false);
      // Simulate creating an audio file
      const mockAudioFile = new File([''], 'recording.wav', { type: 'audio/wav' });
      setAudioFile(mockAudioFile);
      toast({
        title: "Recording stopped",
        description: "Your recording has been saved. Click 'Summarise' to process it.",
      });
    } else {
      // Start recording
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Start speaking about your session...",
      });
    }
  };

  const handleSummarize = async () => {
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock summarized content
    const mockSummary = {
      presenting_concerns: "Client presents with persistent anxiety and sleep disturbances following workplace incident.",
      presentation_mental_state: "Appeared tense, fidgety, with flat affect. Energy levels reported as low.",
      cognitive_themes: "Evident catastrophic thinking patterns, rumination about future incidents.",
      functional_impact: "Significant impairment in work performance, avoiding driving, strained relationships.",
      psychological_history: "No prior mental health treatment. Recent trauma appears to be precipitating factor.",
      treatment_focus: "CBT approach focusing on trauma processing and anxiety management techniques.",
      progress_indicators: "Client engaged well, completed homework assignments, slight improvement noted.",
      barriers_risk_factors: "Fear of retraumatization, financial stress affecting session attendance. No suicidal ideation. Strong family support system, stable housing.",
      plan_next_steps: "Continue weekly sessions, introduce exposure exercises, coordinate with GP."
    };
    
    setNoteData(mockSummary);
    setIsProcessing(false);
    
    toast({
      title: "Summary complete",
      description: "AI has summarized your recording. Please review and edit as needed.",
    });
  };

  const handleOCR = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a handwritten note file first.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Mock OCR results (typically shorter/rougher)
    const mockOCRSummary = {
      presenting_concerns: "Anxiety, sleep issues",
      presentation_mental_state: "Tense, low energy",
      cognitive_themes: "Catastrophic thinking",
      functional_impact: "Work problems, avoidance",
      psychological_history: "First time seeking help",
      treatment_focus: "CBT, anxiety management",
      progress_indicators: "Good engagement",
      barriers_risk_factors: "Fear, financial stress. No SI, family support",
      plan_next_steps: "Weekly sessions, exposure work"
    };
    
    setNoteData(mockOCRSummary);
    setIsProcessing(false);
    
    toast({
      title: "OCR processing complete",
      description: "Handwritten notes have been processed. Please review and expand as needed.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded. Click 'OCR' to process.`,
      });
    }
  };

  const handleSave = () => {
    const finalNoteData = {
      id: `note_${Date.now()}`,
      content: mode === 'write' ? Object.values(noteData).join('\n\n') : 'Structured clinical note',
      createdBy: "Dr. Smith",
      createdAt: new Date().toISOString(),
      isPrivate: true,
      visibleTo: ["psychologist", "lawyer"],
      type: mode,
      structuredData: noteData
    };

    onSave(finalNoteData);
    onOpenChange(false);
    
    // Reset state
    setMode('selection');
    setNoteData({});
    setAudioFile(null);
    setUploadedFile(null);
    
    toast({
      title: "Note saved",
      description: "Your clinical note has been saved successfully.",
    });
  };

  const handleBack = () => {
    setMode('selection');
    setNoteData({});
    setAudioFile(null);
    setUploadedFile(null);
  };

  const renderModeSelection = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-6">
        Choose how you'd like to create your case note:
      </p>
      
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full h-16 justify-start text-left"
          onClick={() => handleModeSelect('write')}
        >
          <div className="flex items-center gap-3">
            <Edit className="w-5 h-5 text-primary" />
            <div>
              <div className="font-medium">Write your own notes</div>
              <div className="text-sm text-muted-foreground">Manually enter structured clinical notes</div>
            </div>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="w-full h-16 justify-start text-left"
          onClick={() => handleModeSelect('dictate')}
        >
          <div className="flex items-center gap-3">
            <Mic className="w-5 h-5 text-primary" />
            <div>
              <div className="font-medium">Dictate-transcribe-summarise</div>
              <div className="text-sm text-muted-foreground">Record your session and let AI structure it</div>
            </div>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="w-full h-16 justify-start text-left"
          onClick={() => handleModeSelect('ocr')}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <div className="font-medium">Handwritten note OCR</div>
              <div className="text-sm text-muted-foreground">Upload handwritten notes for OCR processing</div>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );

  const renderWriteMode = () => (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {noteStructure.map((section) => (
        <div key={section.id} className="space-y-2">
          <label className="text-sm font-medium">{section.title}</label>
          <p className="text-xs text-muted-foreground">{section.description}</p>
          <Textarea
            placeholder={`Enter notes for ${section.title.split('.')[1]?.trim()}...`}
            value={noteData[section.id] || ''}
            onChange={(e) => handleNoteChange(section.id, e.target.value)}
            className="min-h-20"
          />
        </div>
      ))}
    </div>
  );

  const renderDictateMode = () => (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Please try to dictate this session in detail by referring to the following structure. 
          AI will help you to summarise the notes as per the format.
        </p>
        
        <Button
          onClick={handleRecordingToggle}
          variant={isRecording ? "destructive" : "default"}
          size="lg"
          className="w-32 h-32 rounded-full"
          disabled={isProcessing}
        >
          {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </Button>
        
        <p className="text-sm mt-2">
          {isRecording ? "Recording..." : "Click to start recording"}
        </p>
        
        {audioFile && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm">{audioFile.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setAudioFile(null)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Reference Structure:</h4>
        <div className="space-y-2 text-sm">
          {noteStructure.map((section) => (
            <div key={section.id}>
              <strong>{section.title}</strong>
              <p className="text-muted-foreground">{section.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {audioFile && !isProcessing && Object.keys(noteData).length === 0 && (
        <Button 
          onClick={handleSummarize} 
          className="w-full"
          disabled={!audioFile}
        >
          Summarise
        </Button>
      )}
      
      {isProcessing && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>AI is summarising your recording...</span>
        </div>
      )}
      
      {Object.keys(noteData).length > 0 && (
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {noteStructure.map((section) => (
            <div key={section.id} className="space-y-2">
              <label className="text-sm font-medium">{section.title}</label>
              <Textarea
                value={noteData[section.id] || ''}
                onChange={(e) => handleNoteChange(section.id, e.target.value)}
                className="min-h-16"
                placeholder="AI generated content will appear here..."
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderOCRMode = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <div className="space-y-2">
          <p className="text-sm font-medium">Upload handwritten notes</p>
          <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, PDF</p>
          <Input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="max-w-xs mx-auto"
          />
        </div>
        
        {uploadedFile && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm">{uploadedFile.name}</span>
            </div>
          </div>
        )}
      </div>
      
      {uploadedFile && !isProcessing && Object.keys(noteData).length === 0 && (
        <Button 
          onClick={handleOCR} 
          className="w-full"
          disabled={!uploadedFile}
        >
          <FileText className="w-4 h-4 mr-2" />
          OCR
        </Button>
      )}
      
      {isProcessing && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>AI is processing your handwritten notes...</span>
        </div>
      )}
      
      {Object.keys(noteData).length > 0 && (
        <>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Based on the recognition of handwritten notes alone, 
              the AI is limited in what it can summarise, so it needs more complete input from you.
            </p>
          </div>
          
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {noteStructure.map((section) => (
              <div key={section.id} className="space-y-2">
                <label className="text-sm font-medium">{section.title}</label>
                <p className="text-xs text-muted-foreground">{section.description}</p>
                <Textarea
                  value={noteData[section.id] || ''}
                  onChange={(e) => handleNoteChange(section.id, e.target.value)}
                  className="min-h-16"
                  placeholder="Expand on the OCR results..."
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const getDialogTitle = () => {
    switch (mode) {
      case 'write': return 'Write Clinical Notes';
      case 'dictate': return 'Dictate Session Notes';
      case 'ocr': return 'OCR Handwritten Notes';
      default: return 'Add Case Note';
    }
  };

  const canSave = () => {
    if (mode === 'selection') return false;
    if (mode === 'write') return Object.values(noteData).some(value => value.trim().length > 0);
    if (mode === 'dictate') return Object.keys(noteData).length > 0;
    if (mode === 'ocr') return Object.keys(noteData).length > 0;
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode !== 'selection' && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                ← Back
              </Button>
            )}
            <MessageSquare className="w-5 h-5" />
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-1">
          {mode === 'selection' && renderModeSelection()}
          {mode === 'write' && renderWriteMode()}
          {mode === 'dictate' && renderDictateMode()}
          {mode === 'ocr' && renderOCRMode()}
        </div>
        
        {mode !== 'selection' && (
          <DialogFooter>
            <Button variant="outline" onClick={handleBack}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!canSave() || isProcessing}
            >
              Save Note
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddNotesDialog;
