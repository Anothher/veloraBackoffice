import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Building2,
  Map,
  FolderTree,
  BarChart3,
  Target,
  FileText,
  Settings,
  HelpCircle,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'businesses', label: 'Negocios', icon: Building2 },
  { id: 'map', label: 'Mapa', icon: Map },
  { id: 'categories', label: 'Categorías', icon: FolderTree },
  { id: 'analytics', label: 'Analítica', icon: BarChart3 },
  { id: 'leads', label: 'Leads', icon: Target },
  { id: 'reports', label: 'Reportes', icon: FileText },
  { id: 'settings', label: 'Configuración', icon: Settings },
  { id: 'help', label: 'Ayuda', icon: HelpCircle },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.div
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 80 : 280 }}
      className="h-screen bg-[#0F172A] text-white flex flex-col relative border-r border-[#1E293B]"
    >
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] via-[#7C3AED] to-[#06B6D4] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold">Velora Tech</h1>
              <p className="text-xs text-slate-400">Business Dashboard</p>
            </div>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg bg-[#1E293B] flex items-center justify-center hover:bg-[#334155] transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all relative ${
                isActive
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:bg-[#1E293B] hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1E293B]">
        {!collapsed && (
          <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#7C3AED]/10 p-4 rounded-xl border border-[#2563EB]/20">
            <p className="text-xs font-medium mb-2">¿Necesitas ayuda?</p>
            <p className="text-xs text-slate-400 mb-3">Contáctanos para soporte técnico</p>
            <button className="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white px-3 py-2 rounded-lg text-xs font-medium hover:shadow-lg transition-shadow">
              Contactar
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
