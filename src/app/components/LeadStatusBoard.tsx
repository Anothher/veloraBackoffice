import { useMemo, useState } from 'react';
import { Eye, Mail, MessageCircle, Search, Target } from 'lucide-react';
import { Business } from '../data/businessData';
import { getWhatsAppUrl, LeadStatus, leadStatusOptions } from '../utils/leadWorkflow';

interface LeadStatusBoardProps {
  businesses: Business[];
  onSelectBusiness: (business: Business) => void;
}

export function LeadStatusBoard({
  businesses,
  onSelectBusiness
}: LeadStatusBoardProps) {
  const [activeStatus, setActiveStatus] = useState<LeadStatus>(0);
  const [query, setQuery] = useState('');

  const statusCounts = useMemo(() => {
    return leadStatusOptions.reduce(
      (counts, status) => {
        counts[status.value] = businesses.filter((business) => business.estadoId === status.value).length;
        return counts;
      },
      {} as Record<LeadStatus, number>
    );
  }, [businesses]);

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return businesses.filter((business) => {
      const matchesStatus = business.estadoId === activeStatus;
      const matchesQuery =
        normalizedQuery === '' ||
        business.name.toLowerCase().includes(normalizedQuery) ||
        business.category.toLowerCase().includes(normalizedQuery) ||
        business.address.toLowerCase().includes(normalizedQuery) ||
        business.phone.toLowerCase().includes(normalizedQuery) ||
        business.offerHint?.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [activeStatus, businesses, query]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#2563EB]" />
              <h3 className="font-semibold text-gray-900 dark:text-slate-100">Control de seguimiento</h3>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Filtra leads por estado para saber a quienes contactar y a quienes ya se les envio propuesta.
            </p>
          </div>

          <div className="relative w-full lg:w-[340px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar en este estado..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#2563EB] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
          {leadStatusOptions.map((status) => {
            const isActive = activeStatus === status.value;

            return (
              <button
                key={status.value}
                onClick={() => setActiveStatus(status.value)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  isActive
                    ? 'border-[#2563EB] bg-blue-50 shadow-sm dark:border-blue-500/50 dark:bg-blue-500/10'
                    : 'border-gray-100 bg-gray-50 hover:bg-gray-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800'
                }`}
              >
                <p className="text-sm font-medium text-gray-700 dark:text-slate-300">{status.label}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-slate-100">
                  {statusCounts[status.value] ?? 0}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-slate-800">
          <h3 className="font-semibold text-gray-900 dark:text-slate-100">
            {leadStatusOptions.find((status) => status.value === activeStatus)?.label}
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">{filteredLeads.length} leads en esta etapa</p>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-slate-800">
          {filteredLeads.length > 0 ? (
            filteredLeads.map((business) => {
              const whatsappUrl = getWhatsAppUrl(business);
              const firstEmail = business.emails?.[0];

              return (
                <div
                  key={business.id}
                  className="grid gap-4 px-6 py-4 lg:grid-cols-[1.1fr_1fr_1.2fr_auto] lg:items-center"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-slate-100">{business.name}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{business.category}</p>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-slate-300">
                    <p>{business.phone || 'Sin telefono visible'}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500">{business.address || 'Direccion pendiente'}</p>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-slate-300">
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {business.offerHint || 'Seguimiento comercial'}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(business.leadSignals ?? []).slice(0, 2).map((signal) => (
                        <span
                          key={signal}
                          className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                        >
                          {signal}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 lg:justify-end">
                    <button
                      onClick={() => onSelectBusiness(business)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB] hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300"
                      aria-label="Ver detalle"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300"
                        aria-label="Enviar WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    )}
                    {firstEmail && (
                      <a
                        href={`mailto:${firstEmail}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
                        aria-label="Enviar correo"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-6 py-10 text-center text-sm text-gray-500 dark:text-slate-400">
              No hay leads en este estado con la busqueda actual.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
