import { motion, AnimatePresence } from 'motion/react';
import {
  AlertCircle,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MessageCircle,
  MapPin,
  Phone,
  Share2,
  Sparkles,
  Target,
  X
} from 'lucide-react';
import { Business, getCategoryColor, getGoogleMapsUrl, hasCoordinates } from '../data/businessData';
import { getWhatsAppUrl, LeadStatus, leadStatusOptions } from '../utils/leadWorkflow';

interface BusinessDetailProps {
  business: Business | null;
  isOpen: boolean;
  leadStatus: LeadStatus;
  onLeadStatusChange: (businessId: string, status: LeadStatus) => void;
  onClose: () => void;
}

function toHref(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[\w.-]+\.[a-z]{2,}/i.test(value)) return `https://${value}`;
  return undefined;
}

export function BusinessDetail({ business, isOpen, leadStatus, onLeadStatusChange, onClose }: BusinessDetailProps) {
  if (!business) return null;

  const emails = business.emails ?? [];
  const socialLinks = business.socialLinks ?? [];
  const leadSignals = business.leadSignals ?? [];
  const hasValidCoordinates = hasCoordinates(business);
  const mapsUrl = getGoogleMapsUrl(business);
  const whatsappUrl = getWhatsAppUrl(business);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-lg bg-white shadow-2xl z-[1000] overflow-y-auto dark:bg-slate-950"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10 dark:bg-slate-950 dark:border-slate-800">
              <h2 className="font-semibold text-gray-900 dark:text-slate-100">Detalle del lead</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors dark:bg-slate-900 dark:hover:bg-slate-800"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-slate-300" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 dark:text-slate-100">{business.name}</h3>
                <span
                  className="inline-block px-3 py-1.5 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: getCategoryColor(business.rawCategory || business.category, business.categoryGroup) }}
                >
                  {business.category}
                </span>
                <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{business.categoryGroup}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3 dark:bg-slate-900">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1 dark:text-slate-400">Direccion</p>
                    <p className="text-sm text-gray-900 dark:text-slate-100">{business.address || 'Direccion pendiente'}</p>
                    {mapsUrl && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#2563EB] hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
                      >
                        Ver en Google Maps
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1 dark:text-slate-400">Telefono</p>
                    {business.phone ? (
                      whatsappUrl ? (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => onLeadStatusChange(business.id, 1)}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20"
                        >
                          <MessageCircle className="h-4 w-4" />
                          {business.phone}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-900 dark:text-slate-100">{business.phone}</p>
                      )
                    ) : (
                      <p className="text-sm text-gray-900 dark:text-slate-100">Sin telefono visible</p>
                    )}
                  </div>
                </div>

                {emails.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1 dark:text-slate-400">Emails</p>
                      <div className="space-y-1">
                        {emails.map((email) => (
                          <a
                            key={email}
                            href={`mailto:${email}`}
                            className="block text-sm text-[#2563EB] hover:underline"
                          >
                            {email}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1 dark:text-slate-400">Sitio web</p>
                    {business.website ? (
                      <a
                        href={toHref(business.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-[#2563EB] hover:underline"
                      >
                        {business.website}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <p className="text-sm text-gray-900 dark:text-slate-100">Sin sitio web visible</p>
                    )}
                  </div>
                </div>

                {socialLinks.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Share2 className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-2 dark:text-slate-400">Redes sociales</p>
                      <div className="flex flex-wrap gap-2">
                        {socialLinks.map((social) =>
                          social.href ? (
                            <a
                              key={`${social.platform}-${social.value}`}
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              {social.platform}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span
                              key={`${social.platform}-${social.value}`}
                              className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                            >
                              {social.platform}: {social.value}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {hasValidCoordinates && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1 dark:text-slate-400">Coordenadas</p>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-[#2563EB] font-mono hover:underline"
                      >
                        {business.latitude.toFixed(4)}, {business.longitude.toFixed(4)}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 dark:from-blue-500/10 dark:to-teal-500/10 dark:border-blue-500/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#2563EB] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 mb-2 dark:text-slate-100">Oferta sugerida</p>
                    <p className="text-sm text-gray-700 dark:text-slate-300">
                      {business.offerHint || 'Seguimiento comercial y validacion de oportunidad.'}
                    </p>
                    {leadSignals.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {leadSignals.map((signal) => (
                          <span
                            key={signal}
                            className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs text-blue-700 border border-blue-100 dark:bg-slate-950 dark:border-blue-500/20 dark:text-blue-300"
                          >
                            <AlertCircle className="w-3 h-3" />
                            {signal}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="mb-3 text-sm font-medium text-gray-900 dark:text-slate-100">Estado del seguimiento</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {leadStatusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => onLeadStatusChange(business.id, status.value)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        leadStatus === status.value
                          ? status.color
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {business.notes && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20">
                  <p className="text-xs font-medium text-amber-900 mb-2 dark:text-amber-200">Notas</p>
                  <p className="text-sm text-amber-800 dark:text-amber-100">{business.notes}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => onLeadStatusChange(business.id, 2)}
                  className="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white py-3 rounded-xl font-medium hover:shadow-xl hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Target className="w-5 h-5" />
                  Marcar propuesta enviada
                </button>
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onLeadStatusChange(business.id, 1)}
                    className="w-full border border-emerald-200 text-emerald-700 py-3 rounded-xl font-medium hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 dark:border-emerald-500/30 dark:text-emerald-200 dark:hover:bg-emerald-500/10"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Enviar WhatsApp
                  </a>
                )}
                <button className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900">
                  <FileText className="w-5 h-5" />
                  Agregar nota
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
