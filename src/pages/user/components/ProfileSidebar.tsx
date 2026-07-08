import React, { useState, useRef, useCallback } from "react";
import { User } from "@/types";
import { Camera, CheckCircle2, ShieldAlert, Loader2, Calendar, ShieldCheck, Mail, Phone, ImagePlus, User as UserIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Cropper from 'react-easy-crop';
import getCroppedImg from "@/utils/cropImage";
import imageCompression from 'browser-image-compression';
import ApiClient from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface ProfileSidebarProps {
  user: User | null;
  updateUser: (user: Partial<User>) => void;
}

export function ProfileSidebar({ user, updateUser }: ProfileSidebarProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Crop state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || null);
        setCropModalOpen(true);
      });
      reader.readAsDataURL(file);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const showCropImage = async () => {
    try {
      setIsUploading(true);
      if (!imageSrc || !croppedAreaPixels) return;

      const croppedImageFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      );

      if (croppedImageFile) {
        // Compress image
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 800,
          useWebWorker: true
        };
        const compressedFile = await imageCompression(croppedImageFile, options);

        const formData = new FormData();
        formData.append("image", compressedFile, "avatar.jpg");

        const res = await ApiClient.post("/users/avatar", formData, {});
        
        if (res.ok) {
          const data = await res.json();
          updateUser({ profileImage: data.url });
          toast({ title: "Profile image updated successfully!" });
        } else {
          toast({ variant: "destructive", title: "Failed to upload image." });
        }
      }
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error cropping/uploading image." });
    } finally {
      setIsUploading(false);
      setCropModalOpen(false);
    }
  };

  return (
    <div className="md:col-span-1 space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative group">
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 relative">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        
        <div className="px-6 pb-6 relative">
          {/* Avatar Area */}
          <div className="flex justify-center -mt-16 mb-4 relative z-10">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-50 overflow-hidden shadow-md flex items-center justify-center">
                {user?.profileImage ? (
                  <img src={getImageUrl(user.profileImage)} alt={user.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-16 h-16 text-slate-300" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-1 right-1 w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/jpeg,image/png,image/webp" 
                className="hidden" 
              />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{user?.name || "User"}</h2>
            <p className="text-slate-500 text-sm mt-1 mb-4">{user?.email}</p>
            
            <div className="flex justify-center gap-2 mb-6">
              {user?.isVerified && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-medium border border-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                {user?.role?.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Member Since
              </span>
              <span className="font-medium text-slate-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Status
              </span>
              <span className="font-medium text-emerald-600 flex items-center gap-1.5">
                Active
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crop Profile Image</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[300px] bg-slate-900 rounded-lg overflow-hidden">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <div className="py-4">
            <Label className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2 block">Zoom</Label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCropModalOpen(false)}>Cancel</Button>
            <Button onClick={showCropImage} disabled={isUploading} className="bg-emerald-600 hover:bg-emerald-700">
              {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              Save Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
