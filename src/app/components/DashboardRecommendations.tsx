import { motion } from 'motion/react';
import { ArrowRight, Globe, Mail, MapPin, Phone, Share2, Sparkles, Target } from 'lucide-react';
import { Business } from '../data/businessData';

interface DashboardRecommendationsProps {
  businesses: Business[];
  onOpenBusiness: (business: Business) => void;
  onOpenBusinesses: () => void;
  onApplyFilter: (preset: DashboardFilterPreset) => void;
}

interface DashboardFilterPreset {
  searchQuery?: string;
  filters?: {
    category?: string;
    hasPhone?: string;
    hasWebsite?: string;
    completeness?: string;
  };
}

function buildRecommendations(businesses: Business[]) {
  const withoutWebsite = businesses.filter((business) => !business.website);
  const withSocialsNoWebsite = businesses.filter(
    (business) => !business.website && (business.socialLinks ?? []).length > 0
  );
  const missingContact = businesses.filter(
    (business) => !business.phone && !business.website && (business.emails ?? []).length === 0
  );
  const highPriority = businesses.filter((business) => business.priority === 'high');
  const withPhoneNoWeb = businesses.filter((business) => business.phone && !business.website);

  return [
    {
      title: 'Prioriza negocios sin web',
      description: `${withoutWebsite.length} negocios pueden recibir una oferta directa de sitio web, SEO local y ficha comercial.`,
      metric: withoutWebsite.length,
      label: 'Sin web',
      icon: Globe,
      color: 'from-[#2563EB] to-[#7C3AED]',
      preset: { filters: { hasWebsite: 'no' } },
      enabled: withoutWebsite.length > 0
    },
    {
      title: 'Convierte redes en ventas',
      description: `${withSocialsNoWebsite.length} negocios ya tienen presencia social pero no tienen un sitio propio para capturar leads.`,
      metric: withSocialsNoWebsite.length,
      label: 'Redes sin web',
      icon: Share2,
      color: 'from-[#EC4899] to-[#7C3AED]',
      preset: { searchQuery: 'Redes activas sin web', filters: { hasWebsite: 'no' } },
      enabled: withSocialsNoWebsite.length > 0
    },
    {
      title: 'Contacta primero por telefono',
      description: `${withPhoneNoWeb.length} oportunidades tienen telefono y no tienen sitio web: son buenas para una llamada corta con propuesta clara.`,
      metric: withPhoneNoWeb.length,
      label: 'Llamables',
      icon: Phone,
      color: 'from-[#10B981] to-[#0F766E]',
      preset: { filters: { hasPhone: 'yes', hasWebsite: 'no' } },
      enabled: withPhoneNoWeb.length > 0
    },
    {
      title: 'Depura datos antes de vender',
      description: `${missingContact.length} registros no tienen contacto visible. Conviene validarlos por Maps o redes antes de agregarlos al pipeline.`,
      metric: missingContact.length,
      label: 'Sin contacto',
      icon: Mail,
      color: 'from-[#F59E0B] to-[#EF4444]',
      preset: { searchQuery: 'Sin email', filters: { hasPhone: 'no', hasWebsite: 'no' } },
      enabled: missingContact.length > 0
    }
  ];
}

export function DashboardRecommendations({
  businesses,
  onOpenBusiness,
  onOpenBusinesses,
  onApplyFilter
}: DashboardRecommendationsProps) {
  const recommendations = buildRecommendations(businesses);
  const topLeads = businesses
    .filter((business) => business.priority === 'high')
    .slice(0, 4);

  return (
    <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1.35fr_0.65fr] gap-6">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#2563EB]" />
              <h3 className="font-semibold text-gray-900 dark:text-slate-100">Recomendaciones IA</h3>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Acciones sugeridas segun cobertura digital, contacto y prioridad.
            </p>
          </div>
          <button
            onClick={onOpenBusinesses}
            className="hidden rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 md:inline-flex"
          >
            Ver negocios
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((recommendation) => {
            const Icon = recommendation.icon;

            return (
              <button
                key={recommendation.title}
                type="button"
                onClick={() => onApplyFilter(recommendation.preset)}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-500/40 dark:hover:bg-slate-900"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className={`rounded-xl bg-gradient-to-r ${recommendation.color} p-2.5 text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="rounded-lg bg-white px-3 py-1 text-right dark:bg-slate-900">
                    <p className="text-lg font-semibold text-gray-900 dark:text-slate-100">{recommendation.metric}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{recommendation.label}</p>
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-slate-100">{recommendation.title}</h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">{recommendation.description}</p>
              </button>
            );
          })}
        </div>
      </motion.section>

      <motion.aside
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mb-5 flex items-center gap-2">
          <Target className="h-5 w-5 text-[#0F766E]" />
          <h3 className="font-semibold text-gray-900 dark:text-slate-100">Siguientes leads</h3>
        </div>

        <div className="space-y-3">
          {topLeads.length > 0 ? (
            topLeads.map((business) => (
              <button
                key={business.id}
                onClick={() => onOpenBusiness(business)}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-slate-100">{business.name}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{business.category}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 text-gray-400" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(business.leadSignals ?? []).slice(0, 2).map((signal) => (
                    <span
                      key={signal}
                      className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500 dark:bg-slate-950 dark:text-slate-400">
              No hay leads de alta prioridad con los datos actuales.
            </div>
          )}
        </div>

        <div className="mt-5 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 p-4 dark:from-blue-500/10 dark:to-teal-500/10">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 text-[#2563EB]" />
            <p className="text-sm text-gray-700 dark:text-slate-300">
              Usa Maps para validar ubicacion y horarios antes de contactar negocios sin telefono o email.
            </p>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
