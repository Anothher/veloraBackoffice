import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const allowedEmail = 'admin@admvelora.com';
const allowedPassword = 'admin';

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Ingresa tu correo y contrasena para continuar.');
      return;
    }

    if (cleanEmail !== allowedEmail || cleanPassword !== allowedPassword) {
      setError('Correo o contrasena incorrectos.');
      return;
    }

    setError('');
    onLogin();
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#0F172A] text-white">
      <div className="relative flex min-h-screen items-center justify-center px-6 py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.36),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(6,182,212,0.24),transparent_28%),linear-gradient(135deg,#0F172A_0%,#111827_48%,#0F766E_120%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0F172A] to-transparent" />

        <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] shadow-2xl shadow-blue-950/40 backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden p-10 lg:flex">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/20 via-transparent to-[#06B6D4]/20" />
            <div className="relative">
              <div className="mb-10 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] via-[#7C3AED] to-[#06B6D4]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Velora Tech</p>
                  <p className="text-xs text-slate-300">Backoffice comercial</p>
                </div>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl text-5xl font-semibold leading-tight tracking-normal"
              >
                Entra, prioriza leads y mueve oportunidades con claridad.
              </motion.h1>
            </div>

            <div className="relative grid grid-cols-3 gap-3">
              {[
                ['Leads', '#2563EB'],
                ['Negocios', '#0F766E'],
                ['Propuestas', '#7C3AED']
              ].map(([label, color]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="mb-5 h-2 w-12 rounded-full" style={{ backgroundColor: color }} />
                  <p className="text-sm font-medium">{label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 text-slate-950 dark:bg-slate-950 dark:text-slate-100 sm:p-10">
            <div className="mx-auto flex min-h-[560px] max-w-md flex-col justify-center">
              <div className="mb-8 lg:hidden">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#7C3AED] to-[#06B6D4] text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-[#2563EB]">Velora Tech</p>
              </div>

              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-[#2563EB] dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Acceso comercial
                </div>
                <h2 className="text-3xl font-semibold tracking-normal">Bienvenido de nuevo</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Inicia sesion para abrir tu modulo de negocios.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Correo</span>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@admvelora.com"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#2563EB] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Contrasena</span>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Tu contrasena"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#2563EB] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </label>

                {error && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#0F766E] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30"
                >
                  Entrar al modulo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
