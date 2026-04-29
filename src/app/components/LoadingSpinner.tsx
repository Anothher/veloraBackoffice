import { LoaderCircle } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label = 'Cargando...' }: LoadingSpinnerProps) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-gray-100 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-3 text-sm text-gray-600 dark:text-slate-300">
        <LoaderCircle className="h-9 w-9 animate-spin text-[#2563EB]" />
        <span>{label}</span>
      </div>
    </div>
  );
}
