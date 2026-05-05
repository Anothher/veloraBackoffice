import { Business, EstadoId, SocialLink, getCategoryMeta } from '../data/businessData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type BusinessCompleteness = Business['completeness'];
type BusinessPriority = Business['priority'];
type NegocioRow = Record<string, unknown>;

interface NegociosResult {
  businesses: Business[];
  error: string | null;
  source: 'supabase' | 'empty';
}

interface UpdateNegocioEstadoResult {
  estadoId: EstadoId | null;
  error: string | null;
}

const completenessValues: BusinessCompleteness[] = [
  'complete',
  'incomplete',
  'no-website',
  'no-phone'
];

const priorityValues: BusinessPriority[] = ['high', 'medium', 'low'];
const emptyTextValues = new Set(['', 'null', 'undefined', 'nan', 'none', 'n/a', 'na', '-', '--']);

function text(value: unknown, fallback = '') {
  if (value === null || value === undefined) return fallback;
  const cleanValue = String(value).trim();
  return emptyTextValues.has(cleanValue.toLowerCase()) ? fallback : cleanValue;
}

function number(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeEstadoId(value: unknown): EstadoId {
  const parsed = Number(value);
  return parsed === 0 || parsed === 1 || parsed === 2 || parsed === 3 || parsed === 4 ? parsed : 0;
}

function normalizeBusinessId(value: string) {
  const cleanValue = String(value).trim().replace(/^eq\./i, '');
  const numericId = Number(cleanValue);

  return Number.isInteger(numericId) ? numericId : cleanValue;
}

function firstText(row: NegocioRow, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = text(row[key]);
    if (value) return value;
  }
  return fallback;
}

function unique(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function splitValues(value: unknown) {
  if (Array.isArray(value)) {
    return value.flatMap(splitValues);
  }

  const cleanValue = text(value);
  if (!cleanValue) return [];

  return cleanValue
    .split(/[\n,;|]+/)
    .map((part) => text(part))
    .filter(Boolean);
}

function collectValues(row: NegocioRow, matcher: (key: string) => boolean) {
  return unique(
    Object.entries(row).flatMap(([key, value]) => (matcher(key.toLowerCase()) ? splitValues(value) : []))
  );
}

function collectEmails(row: NegocioRow) {
  return collectValues(row, (key) => key.startsWith('email') || key.includes('mail')).filter((value) =>
    value.includes('@')
  );
}

function normalizeSocialHref(platform: string, value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[\w.-]+\.[a-z]{2,}/i.test(value)) return `https://${value}`;

  const handle = value.replace(/^@/, '').trim();
  if (!handle || handle.includes(' ')) return undefined;

  if (platform === 'Instagram') return `https://instagram.com/${handle}`;
  if (platform === 'Facebook') return `https://facebook.com/${handle}`;
  if (platform === 'TikTok') return `https://tiktok.com/@${handle}`;
  if (platform === 'LinkedIn') return `https://linkedin.com/in/${handle}`;
  if (platform === 'X') return `https://x.com/${handle}`;

  return undefined;
}

function collectSocialLinks(row: NegocioRow): SocialLink[] {
  const platforms = [
    { platform: 'Instagram', keys: ['instagram', 'ig'] },
    { platform: 'Facebook', keys: ['facebook', 'fb'] },
    { platform: 'TikTok', keys: ['tiktok'] },
    { platform: 'LinkedIn', keys: ['linkedin'] },
    { platform: 'X', keys: ['twitter', 'x'] }
  ];

  const links = platforms.flatMap(({ platform, keys }) =>
    collectValues(row, (key) =>
      keys.some((candidate) =>
        candidate === 'x' ? key === 'x' || key.startsWith('x__') : key.includes(candidate)
      )
    ).map((value) => ({
      platform,
      value,
      href: normalizeSocialHref(platform, value)
    }))
  );

  return links.filter(
    (link, index, allLinks) =>
      allLinks.findIndex(
        (candidate) => candidate.platform === link.platform && candidate.value === link.value
      ) === index
  );
}

function deriveCompleteness(phone: string, website: string): BusinessCompleteness {
  if (phone && website) return 'complete';
  if (!phone && !website) return 'incomplete';
  if (!website) return 'no-website';
  return 'no-phone';
}

function normalizeCompleteness(value: string, phone: string, website: string): BusinessCompleteness {
  const normalized = value.toLowerCase().replaceAll('_', '-').trim();

  const aliases: Record<string, BusinessCompleteness> = {
    complete: 'complete',
    completo: 'complete',
    completa: 'complete',
    incomplete: 'incomplete',
    incompleto: 'incomplete',
    incompleta: 'incomplete',
    'no-website': 'no-website',
    'sin-web': 'no-website',
    'sin-sitio-web': 'no-website',
    'no-phone': 'no-phone',
    'sin-telefono': 'no-phone',
    'sin-telefono-contacto': 'no-phone'
  };

  if (completenessValues.includes(normalized as BusinessCompleteness)) {
    return normalized as BusinessCompleteness;
  }

  return aliases[normalized] ?? deriveCompleteness(phone, website);
}

function normalizePriority(value: string, completeness: BusinessCompleteness): BusinessPriority {
  const normalized = value.toLowerCase().trim();

  const aliases: Record<string, BusinessPriority> = {
    high: 'high',
    alta: 'high',
    medium: 'medium',
    media: 'medium',
    low: 'low',
    baja: 'low'
  };

  if (priorityValues.includes(normalized as BusinessPriority)) {
    return normalized as BusinessPriority;
  }

  if (aliases[normalized]) return aliases[normalized];
  if (completeness === 'complete') return 'low';
  if (completeness === 'no-phone') return 'medium';
  return 'high';
}

function buildLeadSignals(business: {
  name: string;
  phone: string;
  website: string;
  emails: string[];
  socialLinks: SocialLink[];
}) {
  const signals: string[] = [];

  if (!business.website) signals.push('Sin sitio web');
  if (!business.phone) signals.push('Sin telefono');
  if (business.emails.length === 0) signals.push('Sin email');
  if (business.socialLinks.length > 0 && !business.website) signals.push('Redes activas sin web');
  if (!business.name || business.name === 'Sin nombre') signals.push('Validar nombre');

  return signals.length > 0 ? signals : ['Datos listos para contacto'];
}

function buildOfferHint(business: { phone: string; website: string; emails: string[]; socialLinks: SocialLink[] }) {
  if (!business.website && business.socialLinks.length > 0) {
    return 'Oferta: landing/web + convertir redes en clientes';
  }

  if (!business.website) {
    return 'Oferta: sitio web + SEO local';
  }

  if (!business.phone || business.emails.length === 0) {
    return 'Accion: completar contacto y validar decision maker';
  }

  if (business.socialLinks.length > 0) {
    return 'Oferta: auditoria web, pauta y automatizacion';
  }

  return 'Accion: seguimiento comercial';
}

function mapNegocio(row: NegocioRow, index: number): Business {
  const phone = firstText(row, ['phone', 'telefono', 'celular', 'whatsapp']);
  const website = firstText(row, ['website', 'sitio_web', 'web', 'url', 'pagina_web']);
  const emails = collectEmails(row);
  const socialLinks = collectSocialLinks(row);
  const rawCategory = firstText(row, ['category', 'categoria', 'tipo'], 'Sin categoria');
  const categoryMeta = getCategoryMeta(rawCategory);
  const completeness = normalizeCompleteness(
    firstText(row, ['completeness', 'completitud', 'estado']),
    phone,
    website
  );
  const name = firstText(row, ['name', 'nombre', 'razon_social'], 'Sin nombre');
  const businessForSignals = { name, phone, website, emails, socialLinks };

  return {
    id: firstText(row, ['id', 'uuid', 'negocio_id'], `negocio-${index + 1}`),
    name,
    rawCategory,
    category: categoryMeta.label,
    categoryGroup: categoryMeta.group,
    address: firstText(row, ['address', 'direccion', 'ubicacion']),
    phone,
    website,
    emails,
    socialLinks,
    estadoId: normalizeEstadoId(row.estado_id ?? row.estadoId ?? row.estado_lead),
    latitude: number(row.latitude ?? row.latitud ?? row.lat),
    longitude: number(row.longitude ?? row.longitud ?? row.lng ?? row.lon),
    completeness,
    priority: normalizePriority(firstText(row, ['priority', 'prioridad']), completeness),
    leadSignals: buildLeadSignals(businessForSignals),
    offerHint: buildOfferHint(businessForSignals),
    notes: firstText(row, ['notes', 'notas', 'descripcion'])
  };
}

export async function updateNegocioEstado(
  businessId: string,
  estadoId: EstadoId
): Promise<UpdateNegocioEstadoResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { estadoId: null, error: 'Supabase no esta configurado.' };
  }

  const id = normalizeBusinessId(businessId);
  const payload = { estado_id: estadoId };
  const { data, error } = await supabase
    .from('negocios')
    .update(payload)
    .eq('id', id)
    .select('id, estado_id')
    .maybeSingle();

  if (error) {
    return { estadoId: null, error: error.message };
  }

  if (!data) {
    return {
      estadoId: null,
      error: `No se actualizo ningun negocio con id ${id}. Revisa si existe el registro o si la politica RLS permite UPDATE.`
    };
  }

  return { estadoId: normalizeEstadoId(data.estado_id), error: null };
}

export async function getNegocios(): Promise<NegociosResult> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      businesses: [],
      error: 'Supabase no esta configurado.',
      source: 'empty'
    };
  }

  const { data, error } = await supabase.from('negocios').select('*');

  if (error) {
    return {
      businesses: [],
      error: error.message,
      source: 'empty'
    };
  }

  return {
    businesses: (data ?? []).map(mapNegocio),
    error: null,
    source: 'supabase'
  };
}
