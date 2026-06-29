import React from 'react';
import { useLocation, useParams } from 'wouter';
import { entitySchemas } from '@/constants/schemas';
import DynamicCreateForm from '@/components/admin/DynamicCreateForm';
import { backendService } from '@/services/backendService';
import { ChevronRight, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CreateEntity() {
  const params = useParams();
  const entityType = params.entity || '';
  const [, setLocation] = useLocation();

  const config = entitySchemas[entityType];

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-2">Schema Not Found</h2>
        <p className="text-muted-foreground mb-4">The creation form for "{entityType}" does not exist.</p>
        <button 
          onClick={() => setLocation('/')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleCancel = () => {
    // If we have a specific page for this entity, go there, otherwise go to dashboard
    setLocation(`/admin`); 
  };

  const handleSubmit = async (data: any) => {
    // Phase 6 & Phase 9: Real API integration simulation with error handling
    await backendService.createEntity(entityType, data);
    
    // Phase 8: After successful creation, navigate back
    setTimeout(() => {
      setLocation(`/admin`); // In a real app we might go to `/admin/${entityType}s`
    }, 1500); // Give user time to read the success toast
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => setLocation('/')} className="hover:text-primary transition-colors flex items-center gap-1">
            <LayoutDashboard size={14} /> Dashboard
          </button>
          <ChevronRight size={14} />
          <span>Create</span>
          <ChevronRight size={14} />
          <span className="font-medium text-foreground capitalize">{entityType}</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleCancel}
            className="p-2 -ml-2 rounded-full hover:bg-accent text-muted-foreground transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{config.title}</h1>
            <p className="text-muted-foreground mt-1">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <DynamicCreateForm 
        config={config} 
        onSubmit={handleSubmit} 
        onCancel={handleCancel} 
      />
      
    </motion.div>
  );
}
