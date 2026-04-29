import { Business, EstadoId } from '../data/businessData';

export type LeadStatus = EstadoId;

export const leadStatusOptions: Array<{
  value: LeadStatus;
  label: string;
  shortLabel: string;
  color: string;
}> = [
  {
    value: 0,
    label: 'Pendiente',
    shortLabel: 'Pendiente',
    color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-500/20'
  },
  {
    value: 1,
    label: 'Contactado',
    shortLabel: 'Contactado',
    color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-200 dark:border-blue-500/20'
  },
  {
    value: 2,
    label: 'Propuesta Enviada',
    shortLabel: 'Propuesta',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:border-emerald-500/20'
  },
  {
    value: 3,
    label: 'Cliente Exitoso',
    shortLabel: 'Cliente',
    color: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-200 dark:border-violet-500/20'
  }
];

export function normalizeLeadStatus(status: unknown): LeadStatus {
  const parsed = Number(status);
  return parsed === 0 || parsed === 1 || parsed === 2 || parsed === 3 ? parsed : 0;
}

export function getLeadStatusMeta(status: unknown) {
  const normalizedStatus = normalizeLeadStatus(status);
  return leadStatusOptions.find((option) => option.value === normalizedStatus) ?? leadStatusOptions[0];
}

export function normalizeWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, '');

  if (!digits) return null;
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.length === 10 && digits.startsWith('3')) return `57${digits}`;

  return digits;
}

export function buildWhatsAppMessage(business: Business) {
  const painPoint = !business.website
    ? 'vi que aun no tienen un sitio web visible'
    : 'vi una oportunidad para mejorar su presencia digital';

  return `Hola, que tal? Soy de Velora Tech. Estuve revisando ${business.name} y ${painPoint}. Podemos ayudarles con una propuesta corta para atraer mas clientes con web, SEO local y WhatsApp. Te puedo enviar la idea?`;
}

export function getWhatsAppUrl(business: Business) {
  const phone = normalizeWhatsAppNumber(business.phone);

  if (!phone) return undefined;

  return `https://wa.me/${phone}?text=${encodeURIComponent(buildWhatsAppMessage(business))}`;
}
