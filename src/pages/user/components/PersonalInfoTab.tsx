import React, { useState, useEffect } from "react";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ApiClient from "@/lib/api";

interface PersonalInfoTabProps {
  user: User | null;
  updateUser: (user: Partial<User>) => void;
}

export function PersonalInfoTab({ user, updateUser }: PersonalInfoTabProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  // Removed location logic

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user]);

  // Handlers removed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await ApiClient.put("/users/profile", formData);
      if (res.ok) {
        const data = await res.json();
        updateUser(data.user);
        toast({ title: "Profile updated successfully!" });
      } else {
        const err = await res.json();
        toast({ variant: "destructive", title: "Error", description: err.message || "Failed to update profile." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Network error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
            <p className="text-sm text-slate-500">Update your basic profile details.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input 
              value={formData.firstName} 
              onChange={e => setFormData({ ...formData, firstName: e.target.value })} 
              placeholder="e.g. John" 
            />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input 
              value={formData.lastName} 
              onChange={e => setFormData({ ...formData, lastName: e.target.value })} 
              placeholder="e.g. Doe" 
            />
          </div>

        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 min-w-[150px] shadow-sm">
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
