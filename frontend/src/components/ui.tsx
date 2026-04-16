import { motion } from 'framer-motion';
import React from 'react';

interface StatCardProps {
  icon: string;
  label: string;
  value: number | string;
  color: 'primary' | 'accent' | 'green' | 'muted';
  index?: number;
  trend?: { up: boolean; percentage: number };
}

export function StatCard({ icon, label, value, color, index = 0, trend }: StatCardProps) {
  const colorClasses = {
    primary: 'from-primary-600 to-primary-700',
    accent: 'from-accent-600 to-accent-700',
    green: 'from-green-500 to-green-600',
    muted: 'from-slate-800 to-slate-950',
  };

  const bgClasses = {
    primary: 'bg-primary-50',
    accent: 'bg-accent-50',
    green: 'bg-green-50',
    muted: 'bg-slate-100',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      className="relative overflow-hidden rounded-xl shadow-lg p-6 cursor-pointer"
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-5`} />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600 mb-2">{label}</p>
          <p className="text-3xl font-bold text-neutral-900">{value}</p>
          {trend && (
            <p className={`text-xs font-semibold mt-2 ${trend.up ? 'text-green-600' : 'text-red-600'}`}>
              {trend.up ? '↑' : '↓'} {trend.percentage}% from last month
            </p>
          )}
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`text-5xl ${bgClasses[color]} w-20 h-20 flex items-center justify-center rounded-full`}
        >
          {icon}
        </motion.div>
      </div>

      {/* Border */}
      <div className={`absolute inset-0 border border-gradient-to-r ${colorClasses[color]} opacity-10 rounded-xl`} />
    </motion.div>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  index?: number;
}

export function Card({ children, className = '', hover = false, index = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={hover ? { y: -4 } : {}}
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:shadow-primary-500/25',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      type={type}
      disabled={loading || disabled}
      className={`rounded-lg font-semibold transition-all duration-300 ${variantClasses[variant]} ${sizeClasses[size]} ${className} disabled:opacity-50`}
    >
      {loading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="inline-block mr-2"
        >
          ⟳
        </motion.span>
      ) : null}
      {children}
    </motion.button>
  );
}
