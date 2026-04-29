export interface SocialLink {
  platform: string;
  value: string;
  href?: string;
}

export type EstadoId = 0 | 1 | 2 | 3;

export interface Business {
  id: string;
  name: string;
  rawCategory: string;
  category: string;
  categoryGroup: string;
  address: string;
  phone: string;
  website: string;
  emails?: string[];
  socialLinks?: SocialLink[];
  estadoId: EstadoId;
  latitude: number;
  longitude: number;
  completeness: 'complete' | 'incomplete' | 'no-website' | 'no-phone';
  priority: 'high' | 'medium' | 'low';
  leadSignals?: string[];
  offerHint?: string;
  notes: string;
}

interface CategoryMeta {
  label: string;
  group: string;
  color: string;
}

const categoryDictionary: Record<string, CategoryMeta> = {
  bar: { label: 'Bar', group: 'Gastronomia', color: '#E11D48' },
  pub: { label: 'Pub', group: 'Gastronomia', color: '#E11D48' },
  cafe: { label: 'Cafe', group: 'Gastronomia', color: '#D97706' },
  restaurant: { label: 'Restaurante', group: 'Gastronomia', color: '#EA580C' },
  fast_food: { label: 'Comida rapida', group: 'Gastronomia', color: '#F59E0B' },
  food_court: { label: 'Plazoleta de comidas', group: 'Gastronomia', color: '#F59E0B' },
  bakery: { label: 'Panaderia', group: 'Gastronomia', color: '#B45309' },
  confectionery: { label: 'Confiteria', group: 'Gastronomia', color: '#DB2777' },
  ice_cream: { label: 'Heladeria', group: 'Gastronomia', color: '#06B6D4' },

  library: { label: 'Biblioteca', group: 'Educacion y cultura', color: '#2563EB' },
  school: { label: 'Colegio', group: 'Educacion y cultura', color: '#2563EB' },
  college: { label: 'Instituto', group: 'Educacion y cultura', color: '#2563EB' },
  university: { label: 'Universidad', group: 'Educacion y cultura', color: '#2563EB' },
  kindergarten: { label: 'Jardin infantil', group: 'Educacion y cultura', color: '#2563EB' },
  bookstore: { label: 'Libreria', group: 'Educacion y cultura', color: '#2563EB' },

  pharmacy: { label: 'Farmacia', group: 'Salud', color: '#10B981' },
  doctors: { label: 'Consultorio medico', group: 'Salud', color: '#10B981' },
  clinic: { label: 'Clinica', group: 'Salud', color: '#10B981' },
  hospital: { label: 'Hospital', group: 'Salud', color: '#10B981' },
  dentist: { label: 'Odontologia', group: 'Salud', color: '#10B981' },
  veterinary: { label: 'Veterinaria', group: 'Salud', color: '#10B981' },
  optician: { label: 'Optica', group: 'Salud', color: '#10B981' },

  supermarket: { label: 'Supermercado', group: 'Comercio', color: '#7C3AED' },
  convenience: { label: 'Tienda de barrio', group: 'Comercio', color: '#7C3AED' },
  mall: { label: 'Centro comercial', group: 'Comercio', color: '#7C3AED' },
  clothes: { label: 'Ropa', group: 'Comercio', color: '#EC4899' },
  shoes: { label: 'Calzado', group: 'Comercio', color: '#EC4899' },
  jewelry: { label: 'Joyeria', group: 'Comercio', color: '#A855F7' },
  hardware: { label: 'Ferreteria', group: 'Comercio', color: '#64748B' },
  furniture: { label: 'Muebles', group: 'Comercio', color: '#64748B' },

  hairdresser: { label: 'Peluqueria', group: 'Belleza y cuidado', color: '#EC4899' },
  beauty: { label: 'Belleza', group: 'Belleza y cuidado', color: '#EC4899' },
  spa: { label: 'Spa', group: 'Belleza y cuidado', color: '#EC4899' },
  gym: { label: 'Gimnasio', group: 'Belleza y cuidado', color: '#14B8A6' },
  fitness_centre: { label: 'Centro fitness', group: 'Belleza y cuidado', color: '#14B8A6' },

  hotel: { label: 'Hotel', group: 'Turismo y hospedaje', color: '#0891B2' },
  hostel: { label: 'Hostal', group: 'Turismo y hospedaje', color: '#0891B2' },
  guest_house: { label: 'Hospedaje', group: 'Turismo y hospedaje', color: '#0891B2' },
  travel_agency: { label: 'Agencia de viajes', group: 'Turismo y hospedaje', color: '#0891B2' },

  fuel: { label: 'Estacion de servicio', group: 'Automotriz', color: '#475569' },
  car_repair: { label: 'Taller automotriz', group: 'Automotriz', color: '#475569' },
  car_wash: { label: 'Lavadero de autos', group: 'Automotriz', color: '#475569' },
  parking: { label: 'Parqueadero', group: 'Automotriz', color: '#475569' },

  bank: { label: 'Banco', group: 'Servicios profesionales', color: '#0F766E' },
  atm: { label: 'Cajero automatico', group: 'Servicios profesionales', color: '#0F766E' },
  lawyer: { label: 'Abogados', group: 'Servicios profesionales', color: '#0F766E' },
  accountant: { label: 'Contabilidad', group: 'Servicios profesionales', color: '#0F766E' },
  real_estate: { label: 'Inmobiliaria', group: 'Servicios profesionales', color: '#0F766E' },

  telephone: { label: 'Telefonia e internet', group: 'Tecnologia y comunicaciones', color: '#0284C7' },
  electronics: { label: 'Electronica', group: 'Tecnologia y comunicaciones', color: '#0284C7' },
  computer: { label: 'Computadores', group: 'Tecnologia y comunicaciones', color: '#0284C7' },
  mobile_phone: { label: 'Celulares', group: 'Tecnologia y comunicaciones', color: '#0284C7' }
};

const groupColors: Record<string, string> = {
  Gastronomia: '#EA580C',
  'Educacion y cultura': '#2563EB',
  Salud: '#10B981',
  Comercio: '#7C3AED',
  'Belleza y cuidado': '#EC4899',
  'Turismo y hospedaje': '#0891B2',
  Automotriz: '#475569',
  'Servicios profesionales': '#0F766E',
  'Tecnologia y comunicaciones': '#0284C7',
  Otros: '#64748B'
};

const fallbackColors = ['#2563EB', '#10B981', '#F59E0B', '#7C3AED', '#0891B2', '#DB2777', '#475569'];

function normalizeCategoryKey(category: string) {
  return category.trim().toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
}

function formatCategory(category: string) {
  return category
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function fallbackColor(category: string) {
  const total = category.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return fallbackColors[total % fallbackColors.length];
}

export function getCategoryMeta(category: string): CategoryMeta {
  const cleanCategory = category.trim();
  const key = normalizeCategoryKey(cleanCategory);

  if (categoryDictionary[key]) return categoryDictionary[key];

  return {
    label: cleanCategory ? formatCategory(cleanCategory) : 'Sin categoria',
    group: 'Otros',
    color: cleanCategory ? fallbackColor(cleanCategory) : groupColors.Otros
  };
}

export const categoryColors: Record<string, string> = Object.values(categoryDictionary).reduce(
  (colors, category) => ({ ...colors, [category.label]: category.color }),
  { Otros: groupColors.Otros } as Record<string, string>
);

export function getCategoryColor(category: string, group?: string) {
  return categoryColors[category] || groupColors[group ?? 'Otros'] || getCategoryMeta(category).color || groupColors.Otros;
}

export function hasCoordinates(business: Pick<Business, 'latitude' | 'longitude'>) {
  return (
    Number.isFinite(business.latitude) &&
    Number.isFinite(business.longitude) &&
    (business.latitude !== 0 || business.longitude !== 0)
  );
}

export function getGoogleMapsUrl(business: Pick<Business, 'latitude' | 'longitude' | 'address' | 'name'>) {
  if (hasCoordinates(business)) {
    return `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`;
  }

  const query = [business.name, business.address].filter(Boolean).join(' ');
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : undefined;
}
