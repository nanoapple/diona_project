
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Check, Share2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { generatePasscode } from '@/lib/utils';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siloName: string;
  siloType: string;
}

const ShareDialog = ({ open, onOpenChange, siloName, siloType }: ShareDialogProps) => {
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [requirePasscode, setRequirePasscode] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address to share with.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      onOpenChange(false);
      
      // Reset form
      setEmail('');
      setNotes('');
      setRequirePasscode(false);
      setPasscode('');
      
      toast({
        title: "Case silo shared successfully",
        description: `${siloName} has been shared with ${email}${requirePasscode ? ' with passcode protection' : ''}.`,
      });
    }, 1000);
  };

  const generateNewPasscode = () => {
    const newPasscode = generatePasscode();
    setPasscode(newPasscode);
  };

  const copyPasscode = () => {
    navigator.clipboard.writeText(passcode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Case Silo
          </DialogTitle>
          <DialogDescription>
            Share this case silo with external professionals to allow them to review and contribute.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="current-silo">Current silo</Label>
            <Input id="current-silo" value={`${siloName} (${siloType})`} disabled />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="required">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="doctor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              This professional will receive an email with a link to access the case silo.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional information or instructions here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="passcode-toggle" className="mr-2">Require passcode</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security with a 6-digit passcode
                </p>
              </div>
              <Switch
                id="passcode-toggle"
                checked={requirePasscode}
                onCheckedChange={(checked) => {
                  setRequirePasscode(checked);
                  if (checked && !passcode) {
                    generateNewPasscode();
                  }
                }}
              />
            </div>
            
            {requirePasscode && (
              <div className="space-y-2">
                <Label htmlFor="passcode">6-digit passcode</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    maxLength={6}
                    className="font-mono text-lg tracking-wider"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateNewPasscode}
                  >
                    Generate
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={copyPasscode}
                    className="w-24"
                  >
                    {isCopied ? <><Check className="h-4 w-4 mr-1" /> Copied</> : "Copy"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Share this passcode with the recipient separately for added security.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSending}>
            {isSending ? "Sending..." : "Share Access"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
