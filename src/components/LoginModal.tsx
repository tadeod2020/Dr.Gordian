import React, { useState } from 'react';
import type { UserSession } from '../types/veterinary';
import { Lock, Mail, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess }) => {
  // =========================================================
  // DEFINIR AQUÍ LA CONTRASEÑA Y PIN DE ACCESO DEL DOCTOR:
  // =========================================================
  const DOCTOR_PASSWORD = "admin"; // <--- CAMBIA AQUÍ TU CONTRASEÑA
  const DOCTOR_PIN = "1234";      // <--- CAMBIA AQUÍ TU PIN DE 4 DÍGITOS
  // =========================================================

  const [authMode, setAuthMode] = useState<'password' | 'pin'>('password');
  
  // Password Mode state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // PIN Mode state (4 digits)
  const [pinDigits, setPinDigits] = useState<string[]>([]);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Default user session
  const DEFAULT_USER: UserSession = {
    id: 'usr-001',
    name: 'Dr. Gordian',
    email: 'contacto@drgordian.com',
    role: 'Administrador',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80'
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (password === DOCTOR_PASSWORD) {
        onLoginSuccess({
          id: 'usr-active',
          name: email.trim() ? (email.includes('@') ? email.split('@')[0] : email) : 'Dr. Gordian',
          email: email.trim() || 'contacto@drgordian.com',
          role: 'Administrador',
          avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80'
        });
      } else {
        setErrorMsg('Contraseña incorrecta. Por favor intenta de nuevo.');
      }
    }, 400);
  };

  const handlePinKeyPress = (digit: string) => {
    if (pinDigits.length < 4) {
      const nextPin = [...pinDigits, digit];
      setPinDigits(nextPin);
      setErrorMsg('');

      if (nextPin.length === 4) {
        const fullPin = nextPin.join('');
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          if (fullPin === DOCTOR_PIN) {
            onLoginSuccess(DEFAULT_USER);
          } else {
            setErrorMsg('PIN incorrecto. Intenta de nuevo.');
            setPinDigits([]);
          }
        }, 400);
      }
    }
  };

  const handlePinDelete = () => {
    setPinDigits((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-slate-900 overflow-y-auto">
      {/* Background glowing Apple light circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 blur-3xl rounded-full pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-6 animate-apple-pop my-auto z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center py-2">
            <img src="/logo-transparent.png" alt="Dr. Gordian" className="h-14 w-auto object-contain dark:hidden" />
            <img src="/logo-transparent-white.png" alt="Dr. Gordian" className="h-14 w-auto object-contain hidden dark:block" />
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">
            Acceso al Sistema Clínico Veterinario
          </p>
        </div>

        {/* Mode Selector Toggle (Password vs PIN) */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setAuthMode('password');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'password'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contraseña</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('pin');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'pin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>PIN Tablet</span>
          </button>
        </div>

        {/* Error Alert Message */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold text-center animate-apple-pop">
            {errorMsg}
          </div>
        )}

        {/* MODE 1: Email & Password */}
        {authMode === 'password' ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Correo Electrónico / Usuario
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@drgordian.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:outline-none text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contraseña de Acceso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:outline-none text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-98 disabled:opacity-50"
            >
              <span>{loading ? 'Verificando...' : 'Iniciar Sesión'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* MODE 2: iPad / Tablet PIN Keypad */
          <div className="space-y-6 text-center">
            <p className="text-xs font-semibold text-slate-500">
              Ingresa tu PIN de 4 dígitos para acceder al sistema
            </p>

            {/* PIN Indicator Dots */}
            <div className="flex items-center justify-center gap-3 py-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    pinDigits.length > idx
                      ? 'bg-blue-600 border-blue-600 scale-110 shadow-sm shadow-blue-500'
                      : 'border-slate-300 dark:border-slate-700 bg-transparent'
                  }`}
                />
              ))}
            </div>

            {/* Circular Keypad */}
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePinKeyPress(num)}
                  className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-900 dark:text-white font-extrabold text-xl flex items-center justify-center mx-auto transition-all transform active:scale-95 shadow-xs"
                >
                  {num}
                </button>
              ))}
              <div />
              <button
                type="button"
                onClick={() => handlePinKeyPress('0')}
                className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-900 dark:text-white font-extrabold text-xl flex items-center justify-center mx-auto transition-all transform active:scale-95 shadow-xs"
              >
                0
              </button>
              <button
                type="button"
                onClick={handlePinDelete}
                className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-rose-500 hover:text-white font-bold text-xs flex items-center justify-center mx-auto transition-all active:scale-95"
              >
                ⌫
              </button>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sistema Seguro con Sincronización en la Nube</span>
          </p>
        </div>
      </div>
    </div>
  );
};
