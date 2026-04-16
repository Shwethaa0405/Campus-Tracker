import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RoleWorkspaceShell } from '../../components/RoleWorkspaceShell';
import { Card, StatCard } from '../../components/ui';
import { apiClient, getCurrentHiringYear } from '../../services/api';

interface DashboardStats {
  assigned_candidates: number;
  active_programs: number;
  completed_training: number;
  success_rate: number;
}

const programCards = [
  { title: 'Foundation Track', progress: 78, detail: 'Core engineering readiness and delivery discipline.' },
  { title: 'Applied Skills', progress: 66, detail: 'Hands-on technical exercises and assessment reviews.' },
  { title: 'Final Transition', progress: 89, detail: 'Readiness checks before deployment into project teams.' },
];

export function ProgramManagerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    assigned_candidates: 0,
    active_programs: 0,
    completed_training: 0,
    success_rate: 0,
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
          assigned_candidates: activeCandidates.length,
          active_programs: programCards.length,
          completed_training: Math.round(activeCandidates.length * 0.72),
          success_rate: activeCandidates.length ? 92 : 0,
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
      title="Program Dashboard"
      description={`Monitor active training programs, completion rhythm, and candidate delivery readiness for the ${hiringYear} cohort.`}
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
            <StatCard label="Assigned Candidates" value={stats.assigned_candidates} icon="AC" color="green" />
            <StatCard label="Active Programs" value={stats.active_programs} icon="AP" color="primary" />
            <StatCard label="Completed Training" value={stats.completed_training} icon="CT" color="accent" />
            <StatCard label="Success Rate" value={`${stats.success_rate}%`} icon="SR" color="muted" />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
            <Card>
              <div className="border-b border-slate-200 pb-4">
                <h2>Active Programs</h2>
                <p>Current program lanes and their completion posture.</p>
              </div>
              <div className="mt-6 space-y-4">
                {programCards.map((program) => (
                  <div
                    key={program.title}
                    className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-slate-950">
                          {program.title}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                          {program.detail}
                        </p>
                      </div>
                      <div className="rounded-full bg-primary-100 px-3 py-2 text-sm font-semibold text-primary-900">
                        {program.progress}%
                      </div>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${program.progress}%` }}
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
                <h2>Delivery Snapshot</h2>
                <p>Key checkpoints for ongoing program execution.</p>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  ['Assessments awaiting review', '04'],
                  ['Mentor syncs this week', '07'],
                  ['Candidates at risk', '02'],
                  ['Ready for deployment', '16'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <span className="text-sm font-medium text-slate-600">
                      {label}
                    </span>
                    <span className="font-display text-2xl text-slate-950">
                      {value}
                    </span>
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
