import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShieldCheck, Tag, MapPin, Smile, Layers, ThumbsUp, Store, Loader2, UploadCloud, Image as ImageIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const featureSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(60, "Title must be at most 60 characters"),
  description: z.string().min(1, "Description is required").max(300, "Description must be at most 300 characters"),
  icon: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export type FeatureFormValues = z.infer<typeof featureSchema>;

interface WhyChooseUsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FeatureFormValues) => Promise<void>;
  initialData?: FeatureFormValues & { id?: string };
  isLoading?: boolean;
}

const AVAILABLE_ICONS = [
  { name: "ShieldCheck", icon: ShieldCheck },
  { name: "Tag", icon: Tag },
  { name: "MapPin", icon: MapPin },
  { name: "Smile", icon: Smile },
  { name: "Layers", icon: Layers },
  { name: "ThumbsUp", icon: ThumbsUp },
  { name: "Store", icon: Store },
];

const AVAILABLE_COLORS = [
  { name: "Emerald", value: "text-emerald-400" },
  { name: "Amber", value: "text-amber-400" },
  { name: "Teal", value: "text-teal-400" },
  { name: "Blue", value: "text-blue-400" },
  { name: "Purple", value: "text-purple-400" },
  { name: "Green", value: "text-green-400" },
  { name: "Rose", value: "text-rose-400" },
];

export function WhyChooseUsModal({ open, onOpenChange, onSubmit, initialData, isLoading }: WhyChooseUsModalProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FeatureFormValues>({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "ShieldCheck",
      image: "",
      color: "text-emerald-400",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          title: initialData.title || "",
          description: initialData.description || "",
          icon: initialData.icon || null,
          image: initialData.image || null,
          color: initialData.color || "text-emerald-400",
          status: initialData.status || "ACTIVE",
        });
        setImagePreview(initialData.image || null);
      } else {
        reset({
          title: "",
          description: "",
          icon: "ShieldCheck",
          image: null,
          color: "text-emerald-400",
          status: "ACTIVE",
        });
        setImagePreview(null);
      }
    }
  }, [open, initialData, reset]);

  const selectedIcon = watch("icon");
  const selectedColor = watch("color");
  const currentStatus = watch("status");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Image must be less than 2MB", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setValue("image", base64String);
      setValue("icon", null); // Clear icon if image is uploaded
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("image", null);
    setValue("icon", "ShieldCheck"); // Set default icon when image is removed
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {initialData ? "Edit Feature" : "Add New Feature"}
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Update the feature details below." : "Fill in the details to create a new feature for the Why Choose Us section."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Feature Title <span className="text-red-500">*</span></label>
                <input
                  {...register("title")}
                  className={`w-full bg-background border ${errors.title ? 'border-red-500' : 'border-border'} rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary shadow-sm`}
                  placeholder="e.g. Quality Products"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Description <span className="text-red-500">*</span></label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className={`w-full bg-background border ${errors.description ? 'border-red-500' : 'border-border'} rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary shadow-sm resize-y`}
                  placeholder="Short description about this feature..."
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Icon Selection</label>
                <div className={`grid grid-cols-4 gap-2 ${imagePreview ? 'opacity-50 pointer-events-none' : ''}`}>
                  {AVAILABLE_ICONS.map((IconObj) => (
                    <button
                      key={IconObj.name}
                      type="button"
                      onClick={() => setValue("icon", IconObj.name)}
                      className={`p-3 rounded-xl border flex justify-center items-center transition-all ${
                        selectedIcon === IconObj.name
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background hover:bg-accent text-muted-foreground'
                      }`}
                      title={IconObj.name}
                    >
                      <IconObj.icon size={20} />
                    </button>
                  ))}
                </div>
                {imagePreview && <p className="text-xs text-muted-foreground mt-1">Icon is disabled when an image is uploaded.</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Theme Color</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_COLORS.map((ColorObj) => (
                    <button
                      key={ColorObj.value}
                      type="button"
                      onClick={() => setValue("color", ColorObj.value)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                        selectedColor === ColorObj.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background hover:bg-accent text-muted-foreground'
                      }`}
                    >
                      {ColorObj.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Custom Image (Optional)</label>
                {imagePreview ? (
                  <div className="relative rounded-xl border border-border bg-background p-2 group">
                    <img src={imagePreview} alt="Preview" className="w-full h-32 object-contain rounded-lg" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center relative hover:bg-accent/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-foreground">Click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Status</label>
                <div className="flex items-center gap-3 bg-background border border-border rounded-xl p-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={currentStatus === "ACTIVE"}
                      onChange={(e) => setValue("status", e.target.checked ? "ACTIVE" : "INACTIVE")}
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <span className={`font-semibold text-sm ${currentStatus === 'ACTIVE' ? 'text-primary' : 'text-muted-foreground'}`}>
                    {currentStatus === "ACTIVE" ? "Active (Visible)" : "Inactive (Hidden)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="bg-transparent border-border text-foreground hover:bg-accent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Feature"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
