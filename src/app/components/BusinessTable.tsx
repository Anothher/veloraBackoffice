import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Eye,
  Globe,
  Mail,
  MessageCircle,
  MapPin,
  Phone as PhoneIcon,
  Search,
  Share2,
  Sparkles
} from 'lucide-react';
import { Business, getGoogleMapsUrl } from '../data/businessData';
import { getLeadStatusMeta, getWhatsAppUrl } from '../utils/leadWorkflow';

interface BusinessTableProps {
  businesses: Business[];
  searchQuery: string;
  onSearch: (query: string) => void;
  onExport: () => void;
  onSelectBusiness: (business: Business) => void;
}

function toHref(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[\w.-]+\.[a-z]{2,}/i.test(value)) return `https://${value}`;
  return undefined;
}

function LinkOrText({
  href,
  children,
  className = ''
}: {
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  if (!href) {
    return <span className={className}>{children}</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} hover:underline`}
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </a>
  );
}

function formatOfferHint(offerHint?: string) {
  const fallback = 'Seguimiento comercial';
  const [label, ...descriptionParts] = (offerHint || fallback).split(':');

  if (descriptionParts.length === 0) {
    return {
      label: 'Sugerencia',
      description: label.trim()
    };
  }

  return {
    label: label.trim(),
    description: descriptionParts.join(':').trim()
  };
}

export function BusinessTable({
  businesses,
  searchQuery,
  onSearch,
  onExport,
  onSelectBusiness
}: BusinessTableProps) {
  const [sortField, setSortField] = useState<keyof Business>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: keyof Business) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedBusinesses = [...businesses].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const modifier = sortDirection === 'asc' ? 1 : -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * modifier;
    }

    return 0;
  });

  const paginatedBusinesses = sortedBusinesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.max(1, Math.ceil(sortedBusinesses.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, businesses.length]);

  const getPriorityBadge = (priority: Business['priority']) => {
    const badges = {
      high: { label: 'Alta', color: 'bg-red-100 text-red-700 border-red-200' },
      medium: { label: 'Media', color: 'bg-amber-100 text-amber-700 border-amber-200' },
      low: { label: 'Baja', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
    };
    const badge = badges[priority];

    return (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const SortIcon = ({ field }: { field: keyof Business }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-[#2563EB]" />
    ) : (
      <ChevronDown className="w-4 h-4 text-[#2563EB]" />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden mt-6 dark:bg-slate-900 dark:border-slate-800"
    >
      <div className="p-6 border-b border-gray-100 dark:border-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-slate-100">Leads y oportunidades</h3>
            <p className="text-sm text-gray-500 mt-1 dark:text-slate-400">
              Mostrando {paginatedBusinesses.length} de {businesses.length} negocios con datos utiles para contactar
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[360px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => onSearch(event.target.value)}
                placeholder="Buscar por negocio, categoria, email, red o senal..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#2563EB] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            <button
              onClick={onExport}
              disabled={businesses.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0F766E] px-4 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Exportar busqueda
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-slate-700 dark:scrollbar-track-slate-900">
        <table className="w-full min-w-full" style={{ tableLayout: 'fixed' }}>
          <thead className="bg-gray-50 dark:bg-slate-950">
            <tr>
              <th className="px-6 py-4 text-left" style={{ minWidth: '200px !important' }}>
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-[#2563EB] dark:text-slate-300"
                >
                  Negocio
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-slate-300" style={{ minWidth: '220px' }}>
                Ubicacion
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-slate-300" style={{ minWidth: '250px' }}>
                Contacto clave
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-slate-300" style={{ minWidth: '180px' }}>
                Redes
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-slate-300" style={{ minWidth: '100px' }}>
                Estado
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-slate-300" style={{ minWidth: '180px' }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {paginatedBusinesses.map((business) => {
              const emails = business.emails ?? [];
              const socialLinks = business.socialLinks ?? [];
              const leadSignals = business.leadSignals ?? [];
              const hasContact = Boolean(business.phone || business.website || emails.length > 0);
              const mapsUrl = getGoogleMapsUrl(business);
              const leadStatusMeta = getLeadStatusMeta(business.estadoId);
              const whatsappUrl = getWhatsAppUrl(business);
              const offer = formatOfferHint(business.offerHint);

              return (
                <tr
                  key={business.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer dark:hover:bg-slate-800/70"
                  onClick={() => onSelectBusiness(business)}
                >
                  <td className="px-4 py-4 align-middle">
                    <div className="truncate">
                      <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">{business.name}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4 align-middle">
                    <div className="max-w-[220px] text-sm text-gray-600 space-y-2 dark:text-slate-300">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>{business.address || 'Direccion pendiente'}</span>
                      </div>
                      {mapsUrl && (
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#2563EB] hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          Ver en Maps
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 align-middle">
                    {hasContact ? (
                      <div className="space-y-1.5">
                        {business.phone && (
                          whatsappUrl ? (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(event) => event.stopPropagation()}
                              className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20"
                            >
                              <MessageCircle className="w-4 h-4" />
                              {business.phone}
                            </a>
                          ) : (
                            <div className="text-sm text-gray-700 flex items-center gap-2 dark:text-slate-300">
                              <PhoneIcon className="w-4 h-4 text-gray-400" />
                              <span>{business.phone}</span>
                            </div>
                          )
                        )}
                        {emails.slice(0, 2).map((email) => (
                          <LinkOrText
                            key={email}
                            href={`mailto:${email}`}
                            className="text-sm text-[#2563EB] flex items-center gap-2"
                          >
                            <Mail className="w-4 h-4" />
                            <span>{email}</span>
                          </LinkOrText>
                        ))}
                        {business.website && (
                          <LinkOrText
                            href={toHref(business.website)}
                            className="text-sm text-[#2563EB] flex items-center gap-2"
                          >
                            <Globe className="w-4 h-4" />
                            <span>Sitio web</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </LinkOrText>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 flex items-center gap-2 dark:text-slate-500">
                        <AlertCircle className="w-4 h-4" />
                        Sin contacto visible
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 align-middle">
                    {socialLinks.length > 0 ? (
                      <div className="flex flex-wrap gap-2 max-w-[220px]">
                        {socialLinks.slice(0, 4).map((social) => (
                          <LinkOrText
                            key={`${social.platform}-${social.value}`}
                            href={social.href}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                          >
                            <Share2 className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                            <span>{social.platform}</span>
                          </LinkOrText>
                        ))}
                        {socialLinks.length > 4 && (
                          <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:bg-slate-800 dark:text-slate-300">
                            +{socialLinks.length - 4}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-slate-500">Sin redes visibles</span>
                    )}
                  </td>

                  <td className="px-6 py-4 align-middle text-center">
                    <div className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-medium ${leadStatusMeta.color}`}>
                      {leadStatusMeta.label}
                    </div>
                  </td>

                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelectBusiness(business);
                        }}
                        className="px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors text-xs font-medium text-[#2563EB] dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-300"
                        aria-label="Ver detalle"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </button>
                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center transition-colors text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-300"
                          aria-label="Enviar WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          WhatsApp
                        </a>
                      )}
                      {emails[0] && (
                        <a
                          href={`mailto:${emails[0]}`}
                          onClick={(event) => event.stopPropagation()}
                          className="px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center transition-colors text-xs font-medium text-indigo-600 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-300"
                          aria-label="Enviar correo"
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Email
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {paginatedBusinesses.length === 0 && (
              <tr>
                <td className="px-6 py-10 text-center text-sm text-gray-500" colSpan={6}>
                  No hay negocios para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between dark:border-slate-800">
        <div className="text-sm text-gray-600 dark:text-slate-400">
          Pagina {currentPage} de {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white text-sm font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Siguiente
          </button>
        </div>
      </div>
    </motion.div>
  );
}
