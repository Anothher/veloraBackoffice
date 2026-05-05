import { Bell, LogOut, Moon, Sun, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const themeStorageKey = 'velora-theme';

interface TopbarProps {
  onLogout: () => void;
}

export function Topbar({ onLogout }: TopbarProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(themeStorageKey);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const nextDarkMode = !darkMode;
    setDarkMode(nextDarkMode);
    localStorage.setItem(themeStorageKey, nextDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', nextDarkMode);
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 dark:bg-slate-950 dark:border-slate-800">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-slate-100">Backoffice comercial</p>
        <p className="text-xs text-gray-500 dark:text-slate-400">Negocios, leads y oportunidades</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors dark:bg-slate-900 dark:hover:bg-slate-800"
          aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        <button
          className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors relative dark:bg-slate-900 dark:hover:bg-slate-800"
          aria-label="Notificaciones"
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-slate-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
        </button>

        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] via-[#7C3AED] to-[#06B6D4] flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
          <User className="w-5 h-5 text-white" />
        </div>

        <button
          onClick={onLogout}
          className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors dark:bg-slate-900 dark:hover:bg-slate-800"
          aria-label="Cerrar sesion"
        >
          <LogOut className="w-5 h-5 text-gray-600 dark:text-slate-300" />
        </button>
      </div>
    </div>
  );
}
