import { motion } from 'motion/react';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';

interface FiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  categories: string[];
  value: FilterValues;
}

export interface FilterValues {
  category: string;
  hasPhone: string;
  hasWebsite: string;
  completeness: string;
}

export function Filters({ onFilterChange, categories, value: filters }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      category: '',
      hasPhone: '',
      hasWebsite: '',
      completeness: ''
    };
    onFilterChange(emptyFilters);
  };

  const activeFilterCount = Object.values(filters).filter((value) => value !== '').length;

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800"
      >
        <Filter className="w-5 h-5 text-gray-600 dark:text-slate-300" />
        <span className="font-medium text-gray-700 dark:text-slate-200">Filtros</span>
        {activeFilterCount > 0 && (
          <span className="px-2 py-0.5 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white rounded-full text-xs font-medium">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 bg-white rounded-2xl border border-gray-100 p-6 dark:bg-slate-900 dark:border-slate-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-200">Categoria</label>
              <select
                value={filters.category}
                onChange={(event) => handleFilterChange('category', event.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
              >
                <option value="">Todas las categorias</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-200">Telefono</label>
              <select
                value={filters.hasPhone}
                onChange={(event) => handleFilterChange('hasPhone', event.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
              >
                <option value="">Todos</option>
                <option value="yes">Con telefono</option>
                <option value="no">Sin telefono</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-200">Sitio web</label>
              <select
                value={filters.hasWebsite}
                onChange={(event) => handleFilterChange('hasWebsite', event.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
              >
                <option value="">Todos</option>
                <option value="yes">Con sitio web</option>
                <option value="no">Sin sitio web</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-200">Estado</label>
              <select
                value={filters.completeness}
                onChange={(event) => handleFilterChange('completeness', event.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
              >
                <option value="">Todos</option>
                <option value="complete">Completo</option>
                <option value="no-website">Sin web</option>
                <option value="no-phone">Sin telefono</option>
                <option value="incomplete">Incompleto</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white rounded-xl hover:shadow-lg transition-all"
            >
              Aplicar filtros
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
