import { useEffect, useState } from 'react';
import { eventBus } from '@/lib/eventBus';

/**
 * A custom hook to listen for specific entity updates.
 * Usage:
 * const trigger = useRealTimeData('product');
 * useEffect(() => { fetchProducts() }, [trigger]);
 */
export function useRealTimeData(entityId: string) {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    // Listen to global 'ENTITY_CREATED' or 'ENTITY_UPDATED' events
    const handleUpdate = (data: any) => {
      if (!entityId || data?.entity === entityId || data?.entity === 'all') {
        setUpdateTrigger(prev => prev + 1);
      }
    };

    const unsubCreated = eventBus.on('ENTITY_CREATED', handleUpdate);
    const unsubUpdated = eventBus.on('ENTITY_UPDATED', handleUpdate);
    const unsubDeleted = eventBus.on('ENTITY_DELETED', handleUpdate);

    return () => {
      unsubCreated();
      unsubUpdated();
      unsubDeleted();
    };
  }, [entityId]);

  return updateTrigger;
}
