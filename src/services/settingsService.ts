import { getAuthHeaders, fetchWithAuth, API_URL } from './api';

export interface StoreSettings {
  id: string;
  storeName: string;
  storeDescription: string;
  phone: string;
  email: string;
  address: string;
  businessHours: string;
  googleMapsUrl: string;
  logoUrl?: string;
  
  ctaHeading: string;
  ctaSubtitle: string;
  ctaPhone: string;
  ctaMapsUrl: string;
  
  socialLinks: string; // JSON string
  paymentMethods: string; // JSON string
  quickLinks: string; // JSON string
  supportLinks: string; // JSON string
  
  copyrightText: string;
}

export const settingsService = {
  getSettings: async (): Promise<StoreSettings> => {
    const response = await fetchWithAuth(`${API_URL}/settings`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },
  
  updateSettings: async (data: Partial<StoreSettings>): Promise<StoreSettings> => {
    const response = await fetchWithAuth(`${API_URL}/settings`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return response.json();
  }
};
