import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RoleWorkspaceShell } from '../../components/RoleWorkspaceShell';
import { Card, StatCard } from '../../components/ui';
import { apiClient, getCurrentHiringYear } from '../../services/api';

interface DashboardStats {
  batch_size: number;
  candidates_onboarded: number;
  candidates_in_training: number;
  completion_percentage: number;
}

const timeline = [
  { phase: 'Pre-onboarding', progress: 100 },
  { phase: 'Bootcamp', progress: 68 },
  { phase: 'Client alignment', progress: 42 },
];

export function BatchOwnerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    batch_size: 0,
    candidates_onboarded: 0,
    candidates_in_training: 0,
    completion_percentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const hiringYear = getCurrentHiringYear();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getCandidates({ year: hiringYear });
        const activeCandidates = response.items.filter((candidate) => candidate.is_active);

        setStats({
          batch_size: activeCandidates.length,
          candidates_onboarded: Math.round(activeCandidates.length * 0.8),
          candidates_in_training: Math.round(activeCandidates.length * 0.32),
          completion_percentage: activeCandidates.length ? 76 : 0,
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
      title="Batch Dashboard"
      description={`Track onboarding progression, active training load, and near-term commitments for the ${hiringYear} batch.`}
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
            <StatCard label="Batch Size" value={stats.batch_size} icon="BS" color="primary" />
            <StatCard label="Onboarded" value={stats.candidates_onboarded} icon="ON" color="green" />
            <StatCard label="In Training" value={stats.candidates_in_training} icon="IT" color="accent" />
            <StatCard label="Completion" value={`${stats.completion_percentage}%`} icon="CP" color="muted" />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
            <Card>
              <div className="border-b border-slate-200 pb-4">
                <h2>Onboarding Timeline</h2>
                <p>Phase-by-phase progress across the current batch journey.</p>
              </div>
              <div className="mt-6 space-y-5">
                {timeline.map((item) => (
                  <div key={item.phase}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">
                        {item.phase}
                      </span>
                      <span className="text-sm text-slate-500">
                        {item.progress}%
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="border-b border-slate-200 pb-4">
                <h2>Upcoming Focus</h2>
                <p>The next operational items for this batch owner cycle.</p>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  ['Team sync', 'Tomorrow, 10:00 AM'],
                  ['Technical checkpoint', 'Friday, 2:00 PM'],
                  ['Review with L&D', 'Next Monday'],
                  ['Deployment readiness', 'End of month'],
                ].map(([label, date]) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-sm font-semibold text-slate-950">
                      {label}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{date}</p>
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
