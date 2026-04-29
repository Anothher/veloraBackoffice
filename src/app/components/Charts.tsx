import { motion } from 'motion/react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Business, getCategoryColor } from '../data/businessData';

interface ChartsProps {
  businesses: Business[];
}

const tooltipStyle = {
  backgroundColor: 'white',
  border: '1px solid #E5E7EB',
  borderRadius: '12px',
  padding: '12px'
};

const priorityColors = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981'
};

function countBy<T extends string>(items: Business[], getKey: (business: Business) => T) {
  return items.reduce(
    (acc, business) => {
      const key = getKey(business);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<T, number>
  );
}

export function Charts({ businesses }: ChartsProps) {
  if (businesses.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        No hay datos suficientes para graficar.
      </div>
    );
  }

  const categoryGroupData = Object.entries(countBy(businesses, (business) => business.categoryGroup))
    .map(([name, value]) => ({ name, value, color: getCategoryColor(name, name) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const priorityData = [
    { name: 'Alta', value: businesses.filter((business) => business.priority === 'high').length, color: priorityColors.high },
    {
      name: 'Media',
      value: businesses.filter((business) => business.priority === 'medium').length,
      color: priorityColors.medium
    },
    { name: 'Baja', value: businesses.filter((business) => business.priority === 'low').length, color: priorityColors.low }
  ].filter((item) => item.value > 0);

  const contactCoverageData = [
    { name: 'Telefono', value: businesses.filter((business) => business.phone).length, color: '#2563EB' },
    { name: 'Email', value: businesses.filter((business) => (business.emails ?? []).length > 0).length, color: '#0F766E' },
    { name: 'Web', value: businesses.filter((business) => business.website).length, color: '#7C3AED' },
    { name: 'Redes', value: businesses.filter((business) => (business.socialLinks ?? []).length > 0).length, color: '#EC4899' },
    {
      name: 'Maps',
      value: businesses.filter((business) => business.latitude !== 0 || business.longitude !== 0).length,
      color: '#F59E0B'
    }
  ];

  const topCategoryData = Object.entries(countBy(businesses, (business) => business.category))
    .map(([name, value]) => ({ name, value, color: getCategoryColor(name) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="xl:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 dark:bg-slate-900 dark:border-slate-800"
      >
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-slate-100">Categorias por grupo</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">Donde se concentra el mercado disponible.</p>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={categoryGroupData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={150} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {categoryGroupData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-gray-100 dark:bg-slate-900 dark:border-slate-800"
      >
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-slate-100">Prioridad comercial</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">Distribucion para ordenar prospeccion.</p>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie data={priorityData} cx="50%" cy="45%" innerRadius={58} outerRadius={104} paddingAngle={3} dataKey="value">
              {priorityData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 border border-gray-100 dark:bg-slate-900 dark:border-slate-800"
      >
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-slate-100">Canales disponibles</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">Que tanto se puede contactar hoy.</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={contactCoverageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {contactCoverageData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="xl:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 dark:bg-slate-900 dark:border-slate-800"
      >
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-slate-100">Top categorias</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">Categorias con mas negocios detectados.</p>
        </div>
        <div className="space-y-4">
          {topCategoryData.map((category) => {
            const percent = Math.round((category.value / businesses.length) * 100);

            return (
              <div key={category.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{category.name}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                    {category.value} negocios
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-slate-800">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%`, backgroundColor: category.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
