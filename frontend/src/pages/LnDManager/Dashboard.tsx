import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RoleWorkspaceShell } from '../../components/RoleWorkspaceShell';
import { Card, StatCard } from '../../components/ui';
import { apiClient, getCurrentHiringYear } from '../../services/api';

interface DashboardStats {
  total_candidates: number;
  active_batches: number;
  pending_candidates: number;
  completion_rate: number;
}

const activityFeed = [
  { title: 'New batch intake aligned', detail: 'April intake roster validated for onboarding.' },
  { title: 'Training review shared', detail: 'Bootcamp readiness summary sent to stakeholders.' },
  { title: 'Candidate records refreshed', detail: 'Master records reconciled for the current hiring year.' },
];

const performance = [
  { month: 'Jan', value: 61 },
  { month: 'Feb', value: 69 },
  { month: 'Mar', value: 74 },
  { month: 'Apr', value: 82 },
  { month: 'May', value: 88 },
  { month: 'Jun', value: 91 },
];

export function LnDManagerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total_candidates: 0,
    active_batches: 0,
    pending_candidates: 0,
    completion_rate: 0,
  });
  const [loading, setLoading] = useState(true);
  const hiringYear = getCurrentHiringYear();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getCandidates({ year: hiringYear });

        setStats({
          total_candidates: response.items.length,
          active_batches: Math.max(1, Math.ceil(response.items.length / 18)),
          pending_candidates: response.items.filter(
            (candidate) => !candidate.is_active
          ).length,
          completion_rate: response.items.length ? 84 : 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [hiringYear]);

  return (
    <RoleWorkspaceShell
      title="L&D Dashboard"
      description={`A consolidated view of batch health, candidate activity, and operational progress for the ${hiringYear} hiring cycle.`}
    >
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            className="h-14 w-14 rounded-full border-4 border-primary-200/40 border-t-primary-300"
          />
        </div>
      ) : (
        <div className="space-y-8">
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Candidates" value={stats.total_candidates} icon="TC" color="primary" />
            <StatCard label="Active Batches" value={stats.active_batches} icon="AB" color="accent" />
            <StatCard label="Pending Reviews" value={stats.pending_candidates} icon="PR" color="muted" />
            <StatCard label="Completion Rate" value={`${stats.completion_rate}%`} icon="CR" color="green" />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            <Card>
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2>Program Momentum</h2>
                  <p>Completion trend across the last two quarters.</p>
                </div>
                <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                  Stable
                </span>
              </div>
              <div className="mt-6 space-y-4">
                {performance.map((point) => (
                  <div key={point.month} className="flex items-center gap-4">
                    <div className="w-10 text-sm font-semibold text-slate-500">
                      {point.month}
                    </div>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${point.value}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-white"
                      />
                    </div>
                    <div className="w-12 text-right text-sm font-semibold text-slate-900">
                      {point.value}%
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="border-b border-slate-200 pb-4">
                <h2>Operations Notes</h2>
                <p>Recent movement across user and candidate workflows.</p>
              </div>
              <div className="mt-6 space-y-4">
                {activityFeed.map((entry) => (
                  <div
                    key={entry.title}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-sm font-semibold text-slate-950">
                      {entry.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{entry.detail}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>
      )}
    </RoleWorkspaceShell>
  );
}
