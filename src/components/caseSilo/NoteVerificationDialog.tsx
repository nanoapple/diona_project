
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface NoteVerificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  onVerify: () => void;
}

const NoteVerificationDialog = ({ 
  isOpen, 
  onOpenChange, 
  verificationCode, 
  setVerificationCode, 
  onVerify 
}: NoteVerificationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify Access</DialogTitle>
          <DialogDescription>
            Please enter the 6-digit security code from your authentication app to view the clinical notes.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <Label>Security Code</Label>
            <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-xs text-muted-foreground">For demo purposes, use code: 778899</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onVerify}>Verify</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteVerificationDialog;
