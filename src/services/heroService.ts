export interface HeroSlide {
  id: string;
  image: string;
  badgeText: string | null;
  heading: string;
  highlightText: string | null;
  description: string | null;
  primaryBtnText: string | null;
  primaryBtnLink: string | null;
  secondaryBtnText: string | null;
  secondaryBtnLink: string | null;
  overlayColor: string;
  opacity: number;
  textAlignment: string;
  ctaVisible: boolean;
  displayOrder: number;
  isActive: boolean;
  autoPlaySpeed: number;
  transitionDuration: number;
}

const API_URL = '/api/hero';

export const getActiveHeroSlides = async (): Promise<HeroSlide[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch active hero slides');
  return response.json();
};

export const getAllHeroSlides = async (): Promise<HeroSlide[]> => {
  const response = await fetch(`${API_URL}/admin`);
  if (!response.ok) throw new Error('Failed to fetch all hero slides');
  return response.json();
};

export const createHeroSlide = async (data: Partial<HeroSlide>): Promise<HeroSlide> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create hero slide');
  return response.json();
};

export const updateHeroSlide = async (id: string, data: Partial<HeroSlide>): Promise<HeroSlide> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update hero slide');
  return response.json();
};

export const deleteHeroSlide = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete hero slide');
};

export const reorderHeroSlides = async (slides: { id: string; displayOrder: number }[]): Promise<void> => {
  const response = await fetch(`${API_URL}/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slides }),
  });
  if (!response.ok) throw new Error('Failed to reorder hero slides');
};
