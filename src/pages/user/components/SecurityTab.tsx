import React, { useState } from "react";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ApiClient from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { OtpInput } from "@/components/ui/OtpInput";

interface SecurityTabProps {
  user: User | null;
  updateUser: (user: Partial<User>) => void;
}

export function SecurityTab({ user, updateUser }: SecurityTabProps) {
  const { toast } = useToast();
  
  // Modals state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  
  // Email Change State
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [isEmailUpdating, setIsEmailUpdating] = useState(false);

  // Phone Change State
  const [newPhone, setNewPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);
  const [isPhoneUpdating, setIsPhoneUpdating] = useState(false);

  const requestEmailOtp = async () => {
    setIsEmailUpdating(true);
    try {
      const res = await ApiClient.post("/users/request-email-change", { email: newEmail });
      if (res.ok) {
        toast({ title: "OTP sent to new email." });
        setIsEmailOtpSent(true);
      } else {
        const data = await res.json();
        toast({ variant: "destructive", title: "Error", description: data.message });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Network error" });
    } finally {
      setIsEmailUpdating(false);
    }
  };

  const verifyEmailOtp = async () => {
    setIsEmailUpdating(true);
    try {
      const res = await ApiClient.post("/users/verify-email-change", { email: newEmail, otp: emailOtp });
      if (res.ok) {
        const data = await res.json();
        updateUser(data.user);
        toast({ title: "Email updated successfully." });
        setIsEmailModalOpen(false);
        setIsEmailOtpSent(false);
        setEmailOtp("");
        setNewEmail("");
      } else {
        const data = await res.json();
        toast({ variant: "destructive", title: "Error", description: data.message });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Network error" });
    } finally {
      setIsEmailUpdating(false);
    }
  };

  const requestPhoneOtp = async () => {
    setIsPhoneUpdating(true);
    try {
      const res = await ApiClient.post("/users/request-phone-change", { phone: newPhone });
      if (res.ok) {
        toast({ title: "OTP sent to new phone." });
        setIsPhoneOtpSent(true);
      } else {
        const data = await res.json();
        toast({ variant: "destructive", title: "Error", description: data.message });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Network error" });
    } finally {
      setIsPhoneUpdating(false);
    }
  };

  const verifyPhoneOtp = async () => {
    setIsPhoneUpdating(true);
    try {
      const res = await ApiClient.post("/users/verify-phone-change", { phone: newPhone, otp: phoneOtp });
      if (res.ok) {
        const data = await res.json();
        updateUser(data.user);
        toast({ title: "Phone updated successfully." });
        setIsPhoneModalOpen(false);
        setIsPhoneOtpSent(false);
        setPhoneOtp("");
        setNewPhone("");
      } else {
        const data = await res.json();
        toast({ variant: "destructive", title: "Error", description: data.message });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Network error" });
    } finally {
      setIsPhoneUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Contact Details</h3>
            <p className="text-sm text-slate-500">Manage your secure contact methods.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 relative p-4 border border-slate-200 rounded-xl bg-slate-50">
            <Label className="text-slate-500">Email Address</Label>
            <div className="font-medium text-slate-900 text-lg">{user?.email}</div>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsEmailModalOpen(true)}>Change Email</Button>
            {user?.isVerified && (
              <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-md font-semibold flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
              </span>
            )}
          </div>

          <div className="space-y-2 relative p-4 border border-slate-200 rounded-xl bg-slate-50">
            <Label className="text-slate-500">Phone Number</Label>
            <div className="font-medium text-slate-900 text-lg">{user?.phone || 'Not set'}</div>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsPhoneModalOpen(true)}>Change Phone</Button>
          </div>
        </div>
      </div>

      {/* Password Change removed */}

      {/* Email Change Modal */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Email Address</DialogTitle>
            <DialogDescription>
              {isEmailOtpSent ? "Enter the 6-digit OTP sent to your new email address." : "Enter your new email address to receive an OTP."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {!isEmailOtpSent ? (
              <div className="space-y-2">
                <Label>New Email</Label>
                <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="e.g. new@example.com" />
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <Label>OTP Code</Label>
                <div className="pt-2">
                  <OtpInput value={emailOtp} onChange={setEmailOtp} disabled={isEmailUpdating} />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEmailModalOpen(false); setIsEmailOtpSent(false); }}>Cancel</Button>
            {!isEmailOtpSent ? (
              <Button onClick={requestEmailOtp} disabled={isEmailUpdating || !newEmail}>
                {isEmailUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Send OTP
              </Button>
            ) : (
              <Button onClick={verifyEmailOtp} disabled={isEmailUpdating || emailOtp.length !== 6}>
                {isEmailUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Verify & Update
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Phone Change Modal */}
      <Dialog open={isPhoneModalOpen} onOpenChange={setIsPhoneModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Phone Number</DialogTitle>
            <DialogDescription>
              {isPhoneOtpSent ? "Enter the 6-digit OTP sent to your new phone number." : "Enter your new phone number with country code."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {!isPhoneOtpSent ? (
              <div className="space-y-2">
                <Label>New Phone Number</Label>
                <Input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="+1 234 567 8900" />
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <Label>OTP Code</Label>
                <div className="pt-2">
                  <OtpInput value={phoneOtp} onChange={setPhoneOtp} disabled={isPhoneUpdating} />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsPhoneModalOpen(false); setIsPhoneOtpSent(false); }}>Cancel</Button>
            {!isPhoneOtpSent ? (
              <Button onClick={requestPhoneOtp} disabled={isPhoneUpdating || !newPhone}>
                {isPhoneUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Send OTP
              </Button>
            ) : (
              <Button onClick={verifyPhoneOtp} disabled={isPhoneUpdating || phoneOtp.length !== 6}>
                {isPhoneUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Verify & Update
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
