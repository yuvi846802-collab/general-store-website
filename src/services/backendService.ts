import { eventBus } from '@/lib/eventBus';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class BackendService {
  private getStorageKey(entity: string) {
    return `admin_${entity}s_db`;
  }

  // Simulate authentication/authorization
  private async checkAuth() {
    const authData = localStorage.getItem('admin_token');
    if (!authData) {
      throw new Error("Unauthorized. Please log in again.");
    }
    // Simulate token validation time
    await delay(200);
  }

  // POST API
  async createEntity(entity: string, payload: any): Promise<ApiResponse<any>> {
    try {
      // 1. Authentication check
      await this.checkAuth();

      // 2. Simulate Network Latency
      await delay(500 + Math.random() * 500);

      // 3. Database insertion & Validation
      const storageKey = this.getStorageKey(entity);
      const existingDataStr = localStorage.getItem(storageKey);
      let dataList: any[] = existingDataStr ? JSON.parse(existingDataStr) : [];

      // Duplicate validations
      if (entity === 'coupon' && dataList.some(c => c.code.toLowerCase() === payload.code.toLowerCase())) {
        throw new Error(`Coupon code '${payload.code}' already exists.`);
      }
      if (entity === 'product' && dataList.some(p => p.name.toLowerCase() === payload.name.toLowerCase() || (payload.slug && p.slug === payload.slug))) {
        throw new Error(`A product with this name or slug already exists.`);
      }
      if (entity === 'category' && dataList.some(c => c.name.toLowerCase() === payload.name.toLowerCase())) {
        throw new Error(`Category '${payload.name}' already exists.`);
      }
      if ((entity === 'user' || entity === 'customer') && dataList.some(u => u.email.toLowerCase() === payload.email.toLowerCase())) {
        throw new Error(`An account with email '${payload.email}' already exists.`);
      }

      // Generate unique DB ID
      const newEntity = {
        id: `DB-${entity.toUpperCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
        ...payload
      };

      dataList.unshift(newEntity); // Add to beginning
      
      // Persist to DB
      localStorage.setItem(storageKey, JSON.stringify(dataList));

      // PHASE 5: Emit Real-Time UI Update Event
      eventBus.emit('ENTITY_CREATED', { entity, data: newEntity });

      return {
        success: true,
        data: newEntity,
        message: `${entity} created successfully.`
      };

    } catch (error: any) {
      console.error(`[BackendService Error] POST /api/create/${entity}`, error);
      throw error;
    }
  }
}

export const backendService = new BackendService();

