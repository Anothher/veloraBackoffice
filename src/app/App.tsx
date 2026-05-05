import { useEffect, useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { KPICards } from './components/KPICards';
import { Charts } from './components/Charts';
import { DashboardRecommendations } from './components/DashboardRecommendations';
import { BusinessTable } from './components/BusinessTable';
import { BusinessDetail } from './components/BusinessDetail';
import { Filters, FilterValues } from './components/Filters';
import { LeadStatusBoard } from './components/LeadStatusBoard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Business } from './data/businessData';
import { getNegocios, updateNegocioEstado } from './services/negocios';
import { getLeadStatusMeta, LeadStatus } from './utils/leadWorkflow';
import { BusinessMap } from './components/BusinessMap';

interface DashboardFilterPreset {
  searchQuery?: string;
  filters?: Partial<FilterValues>;
}

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true);
  const [businessesNotice, setBusinessesNotice] = useState<string | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterValues>({
    category: '',
    hasPhone: '',
    hasWebsite: '',
    completeness: ''
  });

  const handleSelectBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setIsDetailOpen(true);
  };

  const handleLeadStatusChange = async (businessId: string, status: LeadStatus) => {
    const previousBusinesses = businesses;
    const previousSelectedBusiness = selectedBusiness;

    setBusinesses((currentBusinesses) =>
      currentBusinesses.map((business) =>
        business.id === businessId ? { ...business, estadoId: status } : business
      )
    );
    setSelectedBusiness((currentBusiness) =>
      currentBusiness?.id === businessId ? { ...currentBusiness, estadoId: status } : currentBusiness
    );

    const result = await updateNegocioEstado(businessId, status);

    if (result.error) {
      setBusinesses(previousBusinesses);
      setSelectedBusiness(previousSelectedBusiness);
      setBusinessesNotice(`No se pudo actualizar el estado del lead (${result.error}).`);
      return;
    }

    if (result.estadoId !== null) {
      setBusinesses((currentBusinesses) =>
        currentBusinesses.map((business) =>
          business.id === businessId ? { ...business, estadoId: result.estadoId! } : business
        )
      );
      setSelectedBusiness((currentBusiness) =>
        currentBusiness?.id === businessId ? { ...currentBusiness, estadoId: result.estadoId! } : currentBusiness
      );
    }

    setBusinessesNotice(null);
  };

  const handleApplyDashboardFilter = ({ searchQuery = '', filters: presetFilters = {} }: DashboardFilterPreset) => {
    setSearchQuery(searchQuery);
    setFilters({
      category: '',
      hasPhone: '',
      hasWebsite: '',
      completeness: '',
      ...presetFilters
    });
    setActiveView('businesses');
  };

  useEffect(() => {
    let isMounted = true;

    async function loadBusinesses() {
      setIsLoadingBusinesses(true);
      const result = await getNegocios();

      if (!isMounted) return;

      setBusinesses(result.businesses);
      setBusinessesNotice(
        result.error
          ? `No se pudo cargar Supabase (${result.error}). Revisa la conexion o permisos de la tabla.`
          : null
      );
      setIsLoadingBusinesses(false);
    }

    loadBusinesses();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const matchesSearch =
        searchQuery === '' ||
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.rawCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.categoryGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.emails?.some((email) => email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        business.socialLinks?.some((social) =>
          `${social.platform} ${social.value}`.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        business.leadSignals?.some((signal) => signal.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = filters.category === '' || business.category === filters.category;

      const matchesPhone =
        filters.hasPhone === '' ||
        (filters.hasPhone === 'yes' && business.phone) ||
        (filters.hasPhone === 'no' && !business.phone);

      const matchesWebsite =
        filters.hasWebsite === '' ||
        (filters.hasWebsite === 'yes' && business.website) ||
        (filters.hasWebsite === 'no' && !business.website);

      const matchesCompleteness =
        filters.completeness === '' || business.completeness === filters.completeness;

      return matchesSearch && matchesCategory && matchesPhone && matchesWebsite && matchesCompleteness;
    });
  }, [businesses, searchQuery, filters]);

  const visibleTableBusinesses = useMemo(() => {
    return filteredBusinesses.filter((business) => business.estadoId !== 4);
  }, [filteredBusinesses]);

  const categoryOptions = useMemo(() => {
    return Array.from(new Set(businesses.map((business) => business.category).filter(Boolean))).sort();
  }, [businesses]);

  const handleExportBusinesses = () => {
    const headers = [
      'Nombre',
      'Categoria',
      'Grupo',
      'Direccion',
      'Telefono',
      'Emails',
      'Sitio web',
      'Redes',
      'Estado lead',
      'Prioridad',
      'Oferta sugerida',
      'Senales',
      'Latitud',
      'Longitud'
    ];

    const escapeCsv = (value: string | number | undefined) => {
      const text = value === undefined ? '' : String(value);
      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = visibleTableBusinesses.map((business) => [
      business.name,
      business.category,
      business.categoryGroup,
      business.address,
      business.phone,
      business.emails?.join(' | '),
      business.website,
      business.socialLinks?.map((social) => `${social.platform}: ${social.value}`).join(' | '),
      getLeadStatusMeta(business.estadoId).label,
      business.priority,
      business.offerHint,
      business.leadSignals?.join(' | '),
      business.latitude,
      business.longitude
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => escapeCsv(value)).join(','))
      .join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `leads-${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden dark:bg-slate-950">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2 dark:text-slate-100">
                {activeView === 'dashboard' && 'Dashboard Principal'}
                {activeView === 'businesses' && 'Gestión de Negocios'}
                {activeView === 'map' && 'Mapa de Negocios'}
                {activeView === 'categories' && 'Categorías'}
                {activeView === 'analytics' && 'Analítica Avanzada'}
                {activeView === 'leads' && 'Gestión de Leads'}
                {activeView === 'reports' && 'Reportes'}
                {activeView === 'settings' && 'Configuración'}
                {activeView === 'help' && 'Centro de Ayuda'}
              </h1>
              <p className="text-gray-600 dark:text-slate-400">
                {activeView === 'dashboard' &&
                  'Visualiza métricas clave y gestiona oportunidades comerciales'}
                {activeView === 'businesses' && 'Administra tu base de datos de negocios locales'}
              </p>
            </div>

            {businessesNotice && (
              <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                {businessesNotice}
              </div>
            )}

            {isLoadingBusinesses && ['dashboard', 'businesses', 'leads', 'analytics'].includes(activeView) && (
              <LoadingSpinner label="Cargando negocios desde Supabase..." />
            )}

            {!isLoadingBusinesses && activeView === 'dashboard' && (
              <>
                <KPICards businesses={businesses} />
                <DashboardRecommendations
                  businesses={businesses}
                  onOpenBusiness={handleSelectBusiness}
                  onOpenBusinesses={() => setActiveView('businesses')}
                  onApplyFilter={handleApplyDashboardFilter}
                />
                <Charts businesses={businesses} />
              </>
            )}

            {!isLoadingBusinesses && activeView === 'businesses' && (
              <>
                <Filters categories={categoryOptions} value={filters} onFilterChange={setFilters} />
                <BusinessTable
                  businesses={visibleTableBusinesses}
                  searchQuery={searchQuery}
                  onSearch={setSearchQuery}
                  onExport={handleExportBusinesses}
                  onSelectBusiness={handleSelectBusiness}
                />
              </>
            )}

            {!isLoadingBusinesses && activeView === 'map' && (
              <BusinessMap
                businesses={filteredBusinesses}
                searchQuery={searchQuery}
                onSelectBusiness={handleSelectBusiness}
              />
            )}

            {!isLoadingBusinesses && activeView === 'leads' && (
              <LeadStatusBoard
                businesses={businesses}
                onSelectBusiness={handleSelectBusiness}
              />
            )}

            {!isLoadingBusinesses && activeView === 'analytics' && (
              <>
                <Charts businesses={filteredBusinesses} />
              </>
            )}

            {(activeView === 'categories' ||
              activeView === 'reports' ||
              activeView === 'settings' ||
              activeView === 'help') && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Sección en Desarrollo</h3>
                  <p className="text-gray-600">
                    Esta funcionalidad estará disponible próximamente. Estamos trabajando para ofrecerte la
                    mejor experiencia.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <BusinessDetail
        business={selectedBusiness}
        isOpen={isDetailOpen}
        leadStatus={selectedBusiness?.estadoId ?? 0}
        onLeadStatusChange={handleLeadStatusChange}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
