import { motion } from 'motion/react';
import {
  AlertCircle,
  Building2,
  FolderTree,
  Globe,
  Phone,
  Share2,
  Target,
  TrendingUp
} from 'lucide-react';
import { Business } from '../data/businessData';

interface KPICardsProps {
  businesses: Business[];
}

function percent(value: number, total: number) {
  return `${total ? Math.round((value / total) * 100) : 0}%`;
}

export function KPICards({ businesses }: KPICardsProps) {
  const totalBusinesses = businesses.length;
  const withPhone = businesses.filter((business) => business.phone).length;
  const withWebsite = businesses.filter((business) => business.website).length;
  const withSocials = businesses.filter((business) => (business.socialLinks ?? []).length > 0).length;
  const withoutWebsite = businesses.filter((business) => !business.website).length;
  const categories = new Set(businesses.map((business) => business.category)).size;
  const missingContact = businesses.filter(
    (business) => !business.phone && !business.website && (business.emails ?? []).length === 0
  ).length;
  const opportunities = businesses.filter((business) => business.priority === 'high').length;

  const kpis = [
    {
      label: 'Negocios filtrados',
      value: totalBusinesses,
      change: 'Resultado actual',
      icon: Building2,
      color: 'from-[#2563EB] to-[#7C3AED]',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10'
    },
    {
      label: 'Con telefono',
      value: withPhone,
      change: percent(withPhone, totalBusinesses),
      icon: Phone,
      color: 'from-[#10B981] to-[#06B6D4]',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10'
    },
    {
      label: 'Con sitio web',
      value: withWebsite,
      change: percent(withWebsite, totalBusinesses),
      icon: Globe,
      color: 'from-[#06B6D4] to-[#2563EB]',
      bgColor: 'bg-cyan-50 dark:bg-cyan-500/10'
    },
    {
      label: 'Con redes',
      value: withSocials,
      change: percent(withSocials, totalBusinesses),
      icon: Share2,
      color: 'from-[#EC4899] to-[#7C3AED]',
      bgColor: 'bg-pink-50 dark:bg-pink-500/10'
    },
    {
      label: 'Sin sitio web',
      value: withoutWebsite,
      change: percent(withoutWebsite, totalBusinesses),
      icon: TrendingUp,
      color: 'from-[#F59E0B] to-[#EF4444]',
      bgColor: 'bg-amber-50 dark:bg-amber-500/10'
    },
    {
      label: 'Categorias',
      value: categories,
      change: 'Detectadas',
      icon: FolderTree,
      color: 'from-[#7C3AED] to-[#EC4899]',
      bgColor: 'bg-violet-50 dark:bg-violet-500/10'
    },
    {
      label: 'Sin contacto',
      value: missingContact,
      change: percent(missingContact, totalBusinesses),
      icon: AlertCircle,
      color: 'from-[#EF4444] to-[#F59E0B]',
      bgColor: 'bg-red-50 dark:bg-red-500/10'
    },
    {
      label: 'Alta prioridad',
      value: opportunities,
      change: percent(opportunities, totalBusinesses),
      icon: Target,
      color: 'from-[#2563EB] to-[#0F766E]',
      bgColor: 'bg-teal-50 dark:bg-teal-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all cursor-pointer group dark:bg-slate-900 dark:border-slate-800"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl ${kpi.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-6 h-6 text-gray-700 dark:text-slate-200" />
              </div>
              <div className={`px-2.5 py-1 rounded-lg bg-gradient-to-r ${kpi.color} text-white text-xs font-medium`}>
                {kpi.change}
              </div>
            </div>
            <div>
              <p className="text-3xl font-semibold text-gray-900 mb-1 dark:text-slate-100">{kpi.value}</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">{kpi.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
