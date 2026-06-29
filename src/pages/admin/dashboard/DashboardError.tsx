import { AlertCircle, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardErrorProps {
  error: Error | null;
  resetErrorBoundary: () => void;
}

export const DashboardError = ({ error, resetErrorBoundary }: DashboardErrorProps) => {
  return (
    <div className="flex h-[80vh] items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-destructive/20 rounded-3xl p-8 max-w-md w-full shadow-lg text-center"
      >
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Failed to load dashboard</h2>
        <p className="text-sm text-muted-foreground mb-8">
          {error?.message || "An unexpected error occurred while fetching your data. Please try again."}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <RefreshCcw size={18} />
          Try Again
        </button>
      </motion.div>
    </div>
  );
};
