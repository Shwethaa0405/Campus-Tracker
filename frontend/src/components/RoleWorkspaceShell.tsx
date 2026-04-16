import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

interface RoleWorkspaceShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

interface NavigationItem {
  label: string;
  href: string;
}

const roleNavigation: Record<string, NavigationItem[]> = {
  'L&D Manager': [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'User Management', href: '/lnd-manager/users' },
  ],
  'Program Manager': [{ label: 'Dashboard', href: '/dashboard' }],
  'Batch Owner': [{ label: 'Dashboard', href: '/dashboard' }],
};

export function RoleWorkspaceShell({
  title,
  description,
  children,
}: RoleWorkspaceShellProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = roleNavigation[user?.role ?? ''] ?? [
    { label: 'Dashboard', href: '/dashboard' },
  ];

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const renderNavigation = (condensed: boolean) => (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-400 text-sm font-bold uppercase tracking-[0.28em] text-slate-950 shadow-lg shadow-primary-950/20">
            CH
          </div>
          {!condensed && (
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-100">
                Campus Hire
              </p>
              <p className="text-lg font-semibold text-white">Tracker</p>
            </div>
          )}
        </div>
      </div>

      <div className="border-b border-white/10 px-4 py-4">
        <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-primary-100">
            Signed in as
          </p>
          <p className="mt-2 truncate text-sm font-semibold text-white">
            {user?.full_name || user?.email}
          </p>
          {!condensed && (
            <p className="mt-1 truncate text-xs text-primary-100">
              {user?.role}
            </p>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-5">
        {navigationItems.map((item) => {
          const active = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`group flex items-center rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                active
                  ? 'border-primary-300 bg-primary-300 text-slate-950 shadow-lg shadow-primary-950/20'
                  : 'border-transparent bg-transparent text-white hover:border-white/10 hover:bg-white/10'
              }`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/20 text-[11px] uppercase tracking-[0.18em]">
                {item.label
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)}
              </span>
              {!condensed && (
                <span className="ml-3 flex-1">{item.label}</span>
              )}
              {!condensed && active && (
                <span className="text-[10px] uppercase tracking-[0.24em] text-slate-900/70">
                  Open
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center rounded-2xl border border-primary-300/35 bg-primary-400 px-4 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-primary-300"
        >
          {condensed ? 'Out' : 'Logout'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4fbfa] text-slate-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(31,159,146,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_24%),linear-gradient(180deg,_#f6fdfc_0%,_#f4fbfa_55%,_#eef7f6_100%)]" />

      <div className="flex min-h-screen">
        <motion.aside
          animate={{ width: isDesktopExpanded ? 288 : 104 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="relative hidden min-h-screen border-r border-primary-950/10 bg-[#0f2f31] backdrop-blur xl:block"
        >
          {renderNavigation(!isDesktopExpanded)}
        </motion.aside>

        <AnimatePresence>
          {isMobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 z-30 bg-black/60 xl:hidden"
              />
              <motion.aside
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="fixed left-0 top-0 z-40 h-screen w-[18rem] border-r border-primary-950/10 bg-[#0f2f31] xl:hidden"
              >
                {renderNavigation(false)}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1">
          <header className="sticky top-0 z-20 border-b border-primary-950/10 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileOpen(true)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary-200 bg-primary-50 text-sm font-semibold text-primary-900 xl:hidden"
                >
                  Menu
                </button>
                <button
                  onClick={() => setIsDesktopExpanded((value) => !value)}
                  className="hidden rounded-2xl border border-primary-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:border-primary-400 hover:bg-primary-50 xl:inline-flex"
                >
                  {isDesktopExpanded ? 'Close menu' : 'Open menu'}
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary-700">
                    {user?.role ?? 'Workspace'}
                  </p>
                  <h1 className="text-3xl font-display text-slate-950">{title}</h1>
                </div>
              </div>

              <div className="rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-primary-800">
                {user?.email}
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 rounded-[2rem] border border-primary-100 bg-white p-6 shadow-xl shadow-primary-950/5">
              <p className="max-w-3xl text-sm leading-7 text-slate-600">
                {description}
              </p>
            </div>

            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
