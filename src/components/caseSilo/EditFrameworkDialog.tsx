
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface EditFrameworkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  framework: 'WHO-ICF' | 'Bio-Psy-Soc' | 'PERMA+V';
  data: any;
  onSave: (updatedData: any) => void;
}

const EditFrameworkDialog = ({ open, onOpenChange, framework, data, onSave }: EditFrameworkDialogProps) => {
  const [editData, setEditData] = useState(data);

  // Update editData when data prop changes
  useEffect(() => {
    setEditData(data);
  }, [data]);

  const handleSave = () => {
    onSave(editData);
    onOpenChange(false);
    toast({
      title: "Framework Updated",
      description: `${framework} data has been successfully updated.`,
    });
  };

  const renderBioPsySocEdit = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="biological">Biological</Label>
        <Textarea
          id="biological"
          value={editData.biological || ''}
          onChange={(e) => setEditData({...editData, biological: e.target.value})}
          className="mt-1"
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="psychological">Psychological</Label>
        <Textarea
          id="psychological"
          value={editData.psychological || ''}
          onChange={(e) => setEditData({...editData, psychological: e.target.value})}
          className="mt-1"
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="social">Social</Label>
        <Textarea
          id="social"
          value={editData.social || ''}
          onChange={(e) => setEditData({...editData, social: e.target.value})}
          className="mt-1"
          rows={4}
        />
      </div>
    </div>
  );

  const renderWHOICFEdit = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="bodyFunctions">Body Functions</Label>
        <Textarea
          id="bodyFunctions"
          value={editData.bodyFunctions || ''}
          onChange={(e) => setEditData({...editData, bodyFunctions: e.target.value})}
          className="mt-1"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="activities">Activities</Label>
        <Textarea
          id="activities"
          value={editData.activities || ''}
          onChange={(e) => setEditData({...editData, activities: e.target.value})}
          className="mt-1"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="participation">Participation</Label>
        <Textarea
          id="participation"
          value={editData.participation || ''}
          onChange={(e) => setEditData({...editData, participation: e.target.value})}
          className="mt-1"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="environmental">Environmental Factors</Label>
        <Textarea
          id="environmental"
          value={editData.environmental || ''}
          onChange={(e) => setEditData({...editData, environmental: e.target.value})}
          className="mt-1"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="personal">Personal Factors</Label>
        <Textarea
          id="personal"
          value={editData.personal || ''}
          onChange={(e) => setEditData({...editData, personal: e.target.value})}
          className="mt-1"
          rows={3}
        />
      </div>
    </div>
  );

  const renderPERMAVEdit = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="positiveEmotionsRating">Positive Emotions Rating</Label>
          <Input
            id="positiveEmotionsRating"
            type="number"
            min="0"
            max="10"
            value={editData.positiveEmotions?.rating || ''}
            onChange={(e) => setEditData({
              ...editData, 
              positiveEmotions: {...editData.positiveEmotions, rating: e.target.value}
            })}
            className="mt-1"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="positiveEmotionsComment">Comment</Label>
          <Textarea
            id="positiveEmotionsComment"
            value={editData.positiveEmotions?.comment || ''}
            onChange={(e) => setEditData({
              ...editData, 
              positiveEmotions: {...editData.positiveEmotions, comment: e.target.value}
            })}
            className="mt-1"
            rows={2}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="engagementRating">Engagement Rating</Label>
          <Input
            id="engagementRating"
            type="number"
            min="0"
            max="10"
            value={editData.engagement?.rating || ''}
            onChange={(e) => setEditData({
              ...editData, 
              engagement: {...editData.engagement, rating: e.target.value}
            })}
            className="mt-1"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="engagementComment">Comment</Label>
          <Textarea
            id="engagementComment"
            value={editData.engagement?.comment || ''}
            onChange={(e) => setEditData({
              ...editData, 
              engagement: {...editData.engagement, comment: e.target.value}
            })}
            className="mt-1"
            rows={2}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="relationshipsRating">Relationships Rating</Label>
          <Input
            id="relationshipsRating"
            type="number"
            min="0"
            max="10"
            value={editData.relationships?.rating || ''}
            onChange={(e) => setEditData({
              ...editData, 
              relationships: {...editData.relationships, rating: e.target.value}
            })}
            className="mt-1"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="relationshipsComment">Comment</Label>
          <Textarea
            id="relationshipsComment"
            value={editData.relationships?.comment || ''}
            onChange={(e) => setEditData({
              ...editData, 
              relationships: {...editData.relationships, comment: e.target.value}
            })}
            className="mt-1"
            rows={2}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="meaningRating">Meaning Rating</Label>
          <Input
            id="meaningRating"
            type="number"
            min="0"
            max="10"
            value={editData.meaning?.rating || ''}
            onChange={(e) => setEditData({
              ...editData, 
              meaning: {...editData.meaning, rating: e.target.value}
            })}
            className="mt-1"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="meaningComment">Comment</Label>
          <Textarea
            id="meaningComment"
            value={editData.meaning?.comment || ''}
            onChange={(e) => setEditData({
              ...editData, 
              meaning: {...editData.meaning, comment: e.target.value}
            })}
            className="mt-1"
            rows={2}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="achievementRating">Achievement Rating</Label>
          <Input
            id="achievementRating"
            type="number"
            min="0"
            max="10"
            value={editData.achievement?.rating || ''}
            onChange={(e) => setEditData({
              ...editData, 
              achievement: {...editData.achievement, rating: e.target.value}
            })}
            className="mt-1"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="achievementComment">Comment</Label>
          <Textarea
            id="achievementComment"
            value={editData.achievement?.comment || ''}
            onChange={(e) => setEditData({
              ...editData, 
              achievement: {...editData.achievement, comment: e.target.value}
            })}
            className="mt-1"
            rows={2}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="vitalityRating">Vitality Rating</Label>
          <Input
            id="vitalityRating"
            type="number"
            min="0"
            max="10"
            value={editData.vitality?.rating || ''}
            onChange={(e) => setEditData({
              ...editData, 
              vitality: {...editData.vitality, rating: e.target.value}
            })}
            className="mt-1"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="vitalityComment">Comment</Label>
          <Textarea
            id="vitalityComment"
            value={editData.vitality?.comment || ''}
            onChange={(e) => setEditData({
              ...editData, 
              vitality: {...editData.vitality, comment: e.target.value}
            })}
            className="mt-1"
            rows={2}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {framework} Framework</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Ms Confee has already summarised the Functioning Profile & Wellbeing Matrix of this client for you, but of a certainty I'm sure your level of expertise will provide a more accurate evaluation.
          </p>
        </DialogHeader>
        
        <div className="mt-4">
          {framework === 'Bio-Psy-Soc' && renderBioPsySocEdit()}
          {framework === 'WHO-ICF' && renderWHOICFEdit()}
          {framework === 'PERMA+V' && renderPERMAVEdit()}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditFrameworkDialog;
