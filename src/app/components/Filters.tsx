import { motion } from 'motion/react';
import {
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  CheckCircle2,
  CircleDot,
  ClipboardCheck,
  Clock3,
  Coffee,
  Dumbbell,
  Filter,
  Fuel,
  Globe,
  GraduationCap,
  HeartPulse,
  Hotel,
  Laptop,
  Phone,
  Scissors,
  Send,
  ShoppingBag,
  Trophy,
  Utensils,
  X,
  type LucideIcon
} from 'lucide-react';
import { useState } from 'react';
import { leadStatusOptions } from '../utils/leadWorkflow';

interface FiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  categories: CategoryFilterOption[];
  value: FilterValues;
}

export interface FilterValues {
  category: string;
  leadStatus: string;
  hasPhone: string;
  hasWebsite: string;
  completeness: string;
}

export interface CategoryFilterOption {
  value: string;
  count: number;
}

const completenessOptions = [
  { value: 'complete', label: 'Completo', icon: CheckCircle2 },
  { value: 'no-website', label: 'Sin web', icon: Globe },
  { value: 'no-phone', label: 'Sin telefono', icon: Phone },
  { value: 'incomplete', label: 'Incompleto', icon: ClipboardCheck }
];

function normalizeCategory(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getCategoryIcon(category: string): LucideIcon {
  const normalized = normalizeCategory(category);

  if (/(bar|pub|restaurante|comida|panaderia|heladeria|confiteria)/.test(normalized)) return Utensils;
  if (/cafe/.test(normalized)) return Coffee;
  if (/(colegio|educacion|universidad|biblioteca|libreria|jardin)/.test(normalized)) return GraduationCap;
  if (/(salud|farmacia|medico|clinica|hospital|odontologia|veterinaria|optica)/.test(normalized)) return HeartPulse;
  if (/(supermercado|tienda|centro comercial|ropa|calzado|joyeria|ferreteria|muebles)/.test(normalized)) return ShoppingBag;
  if (/(peluqueria|belleza|spa)/.test(normalized)) return Scissors;
  if (/(gimnasio|fitness)/.test(normalized)) return Dumbbell;
  if (/(hotel|hostal|hospedaje|viajes|turismo)/.test(normalized)) return Hotel;
  if (/(automotriz|estacion|taller|lavadero|parqueadero)/.test(normalized)) return Fuel;
  if (/(banco|abogado|contabilidad|inmobiliaria|servicios)/.test(normalized)) return BriefcaseBusiness;
  if (/(tecnologia|internet|electronica|computadores|celulares|telefonia)/.test(normalized)) return Laptop;

  return Building2;
}

export function Filters({ onFilterChange, categories, value: filters }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      category: '',
      leadStatus: '',
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
          <div className="space-y-6">
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-200">Seguimiento</label>
                <span className="text-xs text-gray-400 dark:text-slate-500">Estados del detalle</span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
                {leadStatusOptions.map((status) => {
                  const Icon =
                    status.value === 0
                      ? Clock3
                      : status.value === 1
                        ? CircleDot
                        : status.value === 2
                          ? Send
                          : status.value === 3
                            ? Trophy
                            : X;
                  const isActive = filters.leadStatus === String(status.value);

                  return (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => handleFilterChange('leadStatus', isActive ? '' : String(status.value))}
                      className={`flex min-h-[72px] items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all ${
                        isActive
                          ? status.color
                          : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-blue-200 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10'
                      }`}
                    >
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/70 dark:bg-slate-900/70">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium">{status.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <button
                type="button"
                onClick={() => setIsCategoryOpen((current) => !current)}
                className="flex w-full items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left transition-all hover:border-blue-200 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10"
              >
                <span>
                  <span className="block text-sm font-medium text-gray-700 dark:text-slate-200">Categorias</span>
                  <span className="mt-1 block text-xs text-gray-400 dark:text-slate-500">
                    {filters.category || `${categories.length} detectadas`}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-xs font-medium text-[#2563EB] dark:text-blue-200">
                  {isCategoryOpen ? 'Ocultar' : 'Mostrar'}
                  <ChevronDown className={`h-4 w-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>

              {isCategoryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                >
                  <button
                    type="button"
                    onClick={() => handleFilterChange('category', '')}
                    className={`flex min-h-[58px] items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                      filters.category === ''
                        ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] shadow-sm dark:border-blue-500/50 dark:bg-blue-500/10 dark:text-blue-200'
                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    Todas
                </button>

                  {categories.map((category) => {
                    const Icon = getCategoryIcon(category.value);
                    const isActive = filters.category === category.value;

                    return (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => handleFilterChange('category', isActive ? '' : category.value)}
                        className={`group flex min-h-[58px] items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                          isActive
                            ? 'border-[#0F766E] bg-teal-50 text-[#0F766E] shadow-sm dark:border-teal-500/50 dark:bg-teal-500/10 dark:text-teal-200'
                            : 'border-gray-100 bg-white text-gray-700 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-blue-500/30'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 transition-transform group-hover:scale-105 dark:bg-slate-900">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="truncate text-sm font-medium">{category.value}</span>
                        </span>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500 dark:bg-slate-900 dark:text-slate-400">
                          {category.count}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </section>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-200">Datos</label>
                <div className="grid grid-cols-2 gap-2">
                  {completenessOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = filters.completeness === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleFilterChange('completeness', isActive ? '' : option.value)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                          isActive
                            ? 'border-[#7C3AED] bg-violet-50 text-[#7C3AED] dark:border-violet-500/50 dark:bg-violet-500/10 dark:text-violet-200'
                            : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
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
