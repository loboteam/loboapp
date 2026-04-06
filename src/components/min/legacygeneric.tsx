"use client";
import React, { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { APP_THEME } from "@/lib/constants";
import { useScrollReveal } from "@/lib/hooks";

export const AnimatedCard: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
    children, delay = 0, className = ''
}) => {
    const { ref, visible } = useScrollReveal();
    return (
        <div
            ref={ref}
            className={`scroll-reveal ${visible ? 'visible' : ''} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

export const GlassCard: React.FC<{
  children: React.ReactNode,
  className?: string,
  hover?: boolean,
  padding?: string
}> = ({ children, className = '', hover = false, padding = 'p-6' }) => (
  <div className={`bg-white border border-gray-200 rounded-lg ${padding} ${hover ? 'hover:shadow-md hover:border-gray-300 transition-all duration-300' : 'shadow-sm'} ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{
  children: React.ReactNode,
  variant?: 'success' | 'warning' | 'error' | 'info' | 'primary'
}> = ({ children, variant = 'info' }) => {
  const styles = {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    primary: 'bg-green-50 text-green-700 border-green-200'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[variant]}`}>
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
    const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
        secondary: "border-2 border-green-600 text-green-600 hover:bg-green-50",
        ghost: "text-gray-600 hover:bg-gray-100",
        danger: "bg-red-600 text-white hover:bg-red-700"
    };

    const sizes = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2.5 text-base",
        lg: "px-6 py-3 text-lg"
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
        {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
        {type === 'select' ? (
            <select
                value={value ?? ""}
                onChange={onchange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 bg-white"
            >
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        ) : type === 'textarea' ? (
            <textarea
                placeholder={placeholder}
                value={value ?? ""}
                onChange={onchange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900 bg-white"
            />
        ) : (
            <input
                type={type}
                placeholder={placeholder}
                value={value ?? ""}
                onChange={onchange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900 bg-white"
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
  const state = isOpen ? 'open' : 'closed';
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm modal-overlay ${state}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`w-full max-w-lg rounded-lg overflow-hidden shadow-xl bg-white modal-card ${state}`}>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-500">
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