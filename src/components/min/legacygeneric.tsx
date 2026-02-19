import React, { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { APP_THEME } from "@/lib/constants";

export const GlassCard: React.FC<{
  children: React.ReactNode,
  className?: string,
  hover?: boolean,
  padding?: string
}> = ({ children, className = '', hover = false, padding = 'p-6' }) => (
  <div className={`glass rounded-3xl ${padding} ${hover ? 'hover:scale-[1.01] hover:bg-white/[0.07] transition-all duration-300' : ''} ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{
  children: React.ReactNode,
  variant?: 'success' | 'warning' | 'error' | 'info' | 'primary'
}> = ({ children, variant = 'info' }) => {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    info: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    primary: `bg-teal-500/10 text-teal-400 border-teal-500/20`
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${styles[variant]}`}>
      {children}
    </span>
  );
};

export const Button: React.FC<{
  children: React.ReactNode,
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger',
  size?: 'sm' | 'md' | 'lg',
  className?: string,
  onClick?: MouseEventHandler<HTMLButtonElement>,
  disabled?: boolean,
  icon?: React.ReactNode
}> = ({ children, variant = 'primary', size = 'md', className = '', onClick, disabled, icon }) => {
    "use client";
    const base = "inline-flex items-center justify-center gap-2 font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: `bg-gradient-to-r ${APP_THEME.gradientPrimary} text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40`,
        secondary: `border border-${APP_THEME.accentColor}-500/60 text-slate shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40`,
        ghost: "text-slate-400 hover:text-white hover:bg-white/5",
        danger: "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    return (
        <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} disabled={disabled}>
        {icon}
        {children}
        </button>
    );
};

export const Input: React.FC<{
    label?: string,
    type?: 'select' | 'textarea' | string,
    placeholder?: string,
    value?: any,
    bindTo?: Dispatch<SetStateAction<any>>,
    onChange?: any,
    className?: string,
    options?: { value: string | number, label: string }[]
}> = ({ label, type = 'text', placeholder, value, onChange = null, className = '', options = [], bindTo = null }) => {
    const onchange = (e: any) => {
        if (bindTo) bindTo(e?.target?.value);
        if (onChange) onChange(e);
    };
    return <div className={`space-y-2 ${className}`}>
        {label && <label className="text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">{label}</label>}
        {type === 'select' ? (
            <select
                value={value ?? ""}
                onChange={onchange}
                className="w-full glass-dark border border-slate/10 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-slate-200"
            >
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        ) : type === 'textarea' ? (
            <textarea
                placeholder={placeholder}
                value={value ?? ""}
                onChange={onchange}
                rows={4}
                className="w-full glass-dark border border-slate/10 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/50 transition-all placeholder:text-slate-300 text-slate-600"
            />
        ) : (
            <input
                type={type}
                placeholder={placeholder}
                value={value ?? ""}
                onChange={onchange}
                className="w-full glass-dark border border-slate/10 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/50 transition-all placeholder:text-slate-300 text-slate-600"
            />
        )}
    </div>
};

export const Modal: React.FC<{
  isOpen: boolean,
  onClose: () => void,
  title: string,
  children: React.ReactNode
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/3 backdrop-blur-md fade-in">
      <div className="glass w-full max-w-lg rounded-4xl overflow-hidden shadow-2xl bg-white">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};