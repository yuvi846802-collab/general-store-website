import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, BadgeCheck, Heart, ShieldCheck, Award, Headphones, MessageCircle, ChevronRight, MessageSquare, User, Pencil, Send, X, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const reviews = [
  { name: "Rahul Sharma", text: "Best general store in Naryawal! I get all my daily needs here. The staff is always polite and helpful.", initials: "RS" },
  { name: "Priya Verma", text: "Quality products at very reasonable prices. Have been buying groceries from Hakeem Store for 3 years now.", initials: "PV" },
  { name: "Amit Kumar", text: "Very convenient and reliable. They always stock fresh items. Highly recommended for families.", initials: "AK" },
  { name: "Sneha Gupta", text: "Love the variety of snacks and beverages they have. It's my go-to place for last-minute shopping.", initials: "SG" },
  { name: "Vikram Singh", text: "Hakeem Store is the pride of Naryawal. Trustworthy owners and excellent service every single time.", initials: "VS" },
  { name: "Neha Mishra", text: "Clean, organized, and well-stocked. You can find almost anything you need for your house here.", initials: "NM" },
];

const LaurelWreathLeft = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 35 70" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M30 5C25 10 15 25 15 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 45C8 40 2 43 2 49C2 55 8 55 15 49Z" fill="currentColor"/>
    <path d="M16 35C9 30 3 33 3 39C3 45 9 45 16 39Z" fill="currentColor"/>
    <path d="M18 25C11 20 5 23 5 29C5 35 11 35 18 29Z" fill="currentColor"/>
    <path d="M22 15C15 10 9 13 9 19C9 25 15 25 22 19Z" fill="currentColor"/>
    <path d="M30 5C23 0 17 3 17 9C17 15 23 15 30 9Z" fill="currentColor"/>
  </svg>
);

const LaurelWreathRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 35 70" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5C10 10 20 25 20 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 45C27 40 33 43 33 49C33 55 27 55 20 49Z" fill="currentColor"/>
    <path d="M19 35C26 30 32 33 32 39C32 45 26 45 19 39Z" fill="currentColor"/>
    <path d="M17 25C24 20 30 23 30 29C30 35 24 35 17 29Z" fill="currentColor"/>
    <path d="M13 15C20 10 26 13 26 19C26 25 20 25 13 19Z" fill="currentColor"/>
    <path d="M5 5C12 0 18 3 18 9C18 15 12 15 5 9Z" fill="currentColor"/>
  </svg>
);

const BackgroundDots = ({ className }: { className?: string }) => (
  <svg width="100" height="100" viewBox="0 0 100 100" className={className}>
    <pattern id="dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="2" fill="currentColor" />
    </pattern>
    <rect width="100" height="100" fill="url(#dots)" />
  </svg>
);

export default function ReviewsSection() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorData, setErrorData] = useState({ subtitle: "", fixDescription: "" });
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setErrorData({
        subtitle: "Please enter your name.",
        fixDescription: "Your name is required to submit a review so we can verify you as a buyer."
      });
      setErrorOpen(true);
      return;
    }
    
    if (rating === 0) {
      setErrorData({
        subtitle: "Please select a rating.",
        fixDescription: "Please select a rating from 1 to 5 stars before submitting your review."
      });
      setErrorOpen(true);
      return;
    }

    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback! Your review will be published after moderation.",
    });
    
    setOpen(false);
    setName("");
    setRating(0);
    setReview("");
  };

  return (
    <section id="reviews" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#f3fbf6] to-white dark:from-background dark:to-background">
      {/* Background Elements */}
      <BackgroundDots className="absolute top-10 left-10 text-emerald-200/50" />
      <BackgroundDots className="absolute bottom-40 right-10 text-emerald-200/50" />
      
      {/* Giant Quote mark in background */}
      <div className="absolute top-10 right-20 text-[250px] font-serif text-emerald-50 leading-none select-none z-0">
        “
      </div>
      
      {/* Curved abstract lines */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] border-[2px] border-emerald-100/40 rounded-full z-0 pointer-events-none"></div>
      <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] border-[2px] border-emerald-100/40 rounded-full z-0 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#e8f5e9] dark:bg-green-900/20 dark:bg-emerald-900/20 text-[#0f4d32] dark:text-emerald-400 rounded-full mb-6 font-semibold shadow-sm border border-emerald-100/50"
          >
            <Star size={16} className="fill-[#f59e0b] text-[#f59e0b]" />
            Based on 56+ Reviews
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-4 md:gap-6 mb-4"
          >
            <LaurelWreathLeft className="w-8 h-16 md:w-10 md:h-20 text-[#47a663]" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-foreground">
              What Our <span className="text-[#0f4d32] dark:text-emerald-400">Customers</span> Say
            </h2>
            <LaurelWreathRight className="w-8 h-16 md:w-10 md:h-20 text-[#47a663]" />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-medium text-lg"
          >
            Real reviews from real customers who love shopping with us
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card hover:shadow-xl transition-all duration-300 border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-2xl relative">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={20} className="fill-[#f59e0b] text-[#f59e0b]" />
                      ))}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#e8f5e9] dark:bg-green-900/20 dark:bg-emerald-900/20 flex items-center justify-center text-[#0f4d32] dark:text-emerald-400">
                      <Quote size={20} className="fill-[#0f4d32] dark:fill-emerald-400" />
                    </div>
                  </div>
                  
                  <p className="text-foreground/80 font-medium leading-relaxed mb-8 h-24">
                    "{review.text}"
                  </p>
                  
                  <div className="w-full h-px bg-muted mb-6"></div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#e8f5e9] dark:bg-green-900/20 dark:bg-emerald-900/20 text-[#0f4d32] dark:text-emerald-400 font-bold flex items-center justify-center text-xl shrink-0">
                      {review.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">{review.name}</h4>
                      <div className="flex items-center gap-1.5 text-sm text-[#0f4d32] dark:text-emerald-400 font-semibold mt-1">
                        <BadgeCheck size={18} className="fill-[#0f4d32] dark:fill-emerald-400 text-white" />
                        <span>Verified Buyer</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-[#e8f5e9] to-[#f3fbf6] dark:from-card dark:to-card rounded-[32px] p-6 lg:p-8 flex flex-col xl:flex-row items-center justify-between gap-8 border border-emerald-100 shadow-sm relative z-10"
        >
          <div className="flex items-center gap-5 w-full xl:w-auto">
            <div className="w-16 h-16 rounded-full bg-[#0f4d32] dark:bg-emerald-900 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/20">
              <Heart size={28} className="text-white fill-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-foreground text-xl">We value our customers</h3>
              <p className="text-muted-foreground font-medium">Your satisfaction is our top priority.</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold w-full xl:w-auto justify-center xl:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-[#0f4d32] dark:text-emerald-400 shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <span className="text-foreground/90 leading-tight">Trusted by<br/>Hundreds</span>
            </div>
            <div className="w-px h-12 bg-emerald-200"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-[#0f4d32] dark:text-emerald-400 shadow-sm">
                <Award size={20} />
              </div>
              <span className="text-foreground/90 leading-tight">Quality You<br/>Can Rely On</span>
            </div>
            <div className="w-px h-12 bg-emerald-200"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-[#0f4d32] dark:text-emerald-400 shadow-sm">
                <Headphones size={20} />
              </div>
              <span className="text-foreground/90 leading-tight">Always Here<br/>To Help</span>
            </div>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full xl:w-auto bg-[#0f4d32] dark:bg-emerald-900 hover:bg-[#0a3824] text-white rounded-full px-8 py-7 h-auto flex items-center justify-center gap-2 text-lg font-semibold shadow-lg shadow-emerald-900/20 transition-transform hover:scale-105">
                <MessageCircle size={22} className="fill-white" />
                Share Your Experience
                <ChevronRight size={22} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-background border-border p-0 overflow-hidden [&>button]:hidden shadow-2xl">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-full bg-secondary/50 flex items-center justify-center shrink-0 border border-primary/20 shadow-[0_0_15px_rgba(20,184,166,0.15)] relative">
                       <MessageSquare className="text-primary w-6 h-6" />
                       <Star className="text-primary w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[2px]" fill="currentColor" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-bold text-foreground mb-1">Share Your Experience</DialogTitle>
                      <DialogDescription className="text-muted-foreground text-sm">
                        We'd love to hear about your experience<br/>with Hakeem Store.
                      </DialogDescription>
                    </div>
                  </div>
                  <DialogClose className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    <X size={16} />
                  </DialogClose>
                </div>
                
                <div className="w-full h-px bg-border mb-6"></div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-primary font-medium text-sm">
                      <User size={16} /> Your Name
                    </Label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        id="name" 
                        placeholder="Enter your name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-background border-input text-foreground pl-10 h-12 focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-primary font-medium text-sm">
                      <Star size={16} className="fill-transparent" /> Your Rating
                    </Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none hover:scale-110 transition-transform"
                        >
                          <Star 
                            size={32} 
                            className={star <= rating && rating > 0 ? "fill-[#f59e0b] text-[#f59e0b]" : "fill-muted text-muted-foreground/30"} 
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Tap to rate your experience</p>
                  </div>

                  {/* Review */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="review" className="flex items-center gap-2 text-primary font-medium text-sm">
                        <Pencil size={16} /> Your Review <span className="text-muted-foreground font-normal text-xs ml-1">(Optional)</span>
                      </Label>
                    </div>
                    <Textarea 
                      id="review" 
                      placeholder="Write your review here..." 
                      rows={3}
                      value={review}
                      maxLength={500}
                      onChange={(e) => setReview(e.target.value)}
                      className="bg-background border-input text-foreground resize-none focus-visible:ring-primary p-4"
                    />
                    <div className="flex justify-end text-xs text-muted-foreground mt-1">
                      {review.length} / 500
                    </div>
                  </div>

                  <div className="w-full h-px bg-border my-1"></div>

                  {/* Badges */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={20} className="text-primary" />
                      <div>
                        <p className="text-[10px] font-bold text-foreground leading-tight">Secure & Private</p>
                        <p className="text-[9px] text-muted-foreground leading-tight">Your data is safe with us</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart size={20} className="text-purple-500" />
                      <div>
                        <p className="text-[10px] font-bold text-foreground leading-tight">Helps Us Improve</p>
                        <p className="text-[9px] text-muted-foreground leading-tight">Your feedback matters</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={20} className="text-blue-500" />
                      <div>
                        <p className="text-[10px] font-bold text-foreground leading-tight">Better Experience</p>
                        <p className="text-[9px] text-muted-foreground leading-tight">For you and everyone</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full bg-gradient-to-r from-[#0d9488] to-[#059669] hover:from-[#0f766e] hover:to-[#047857] text-white h-12 rounded-xl mt-2 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-emerald-900/20 border-0">
                    <Send size={18} className="-ml-2" />
                    Submit Review
                  </Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>

          {/* Error Dialog */}
          <Dialog open={errorOpen} onOpenChange={setErrorOpen}>
            <DialogContent className="sm:max-w-[425px] bg-background border-border p-0 overflow-hidden [&>button]:hidden shadow-2xl rounded-2xl">
              <div className="p-8 flex flex-col items-center text-center">
                <DialogClose className="absolute right-5 top-5 text-muted-foreground hover:text-foreground transition-colors">
                  <X size={20} />
                </DialogClose>
                
                <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl"></div>
                  <div className="relative z-10 w-16 h-16 bg-background border-2 border-destructive/30 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                    <div className="absolute w-12 h-12 bg-destructive/10 rounded-xl blur-sm"></div>
                    <X className="text-destructive w-8 h-8 relative z-20" strokeWidth={3} />
                  </div>
                </div>

                <DialogTitle className="text-3xl font-bold text-foreground mb-2">Error</DialogTitle>
                <div className="w-10 h-1 bg-gradient-to-r from-transparent via-destructive to-transparent mb-6"></div>
                <DialogDescription className="text-foreground/90 text-base font-medium mb-8">
                  {errorData.subtitle}
                </DialogDescription>

                <div className="w-full bg-destructive/5 border border-destructive/20 rounded-xl p-4 flex gap-3 text-left mb-8 shadow-inner">
                  <Info className="text-destructive shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-foreground font-bold text-sm mb-1">How to fix this?</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {errorData.fixDescription}
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={() => setErrorOpen(false)}
                  className="w-full bg-gradient-to-b from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-xl h-12 text-base font-bold border border-red-400/20 shadow-[0_4px_20px_-4px_rgba(220,38,38,0.5)]"
                >
                  Got it
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </section>
  );
}