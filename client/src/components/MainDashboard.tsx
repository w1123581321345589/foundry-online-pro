import DashboardCard from './DashboardCard';

const dashboardTiles = [
  { 
    key: 'identity', 
    title: 'Identity & Banking', 
    href: '/operator/onboarding', 
    description: 'KYC/KYB verification and payout setup', 
    status: 'Auto-Running' as const,
    icon: 'identity'
  },
  { 
    key: 'background', 
    title: 'Background Checks', 
    href: '#', 
    description: 'Instructor screening and verification', 
    status: 'Needs Input' as const,
    icon: 'background'
  },
  { 
    key: 'catalog', 
    title: 'Course Catalog', 
    href: '/catalog', 
    description: 'Create and manage courses & cohorts', 
    status: 'Done' as const,
    icon: 'catalog'
  },
  { 
    key: 'classroom', 
    title: 'Virtual Classroom', 
    href: '/classroom/demo', 
    description: 'Video sessions, whiteboard, and recordings', 
    status: 'Auto-Running' as const,
    icon: 'classroom'
  },
  { 
    key: 'instructor', 
    title: 'Instructor Console', 
    href: '/instructor/sessions', 
    description: 'Session management, rosters, and moderation', 
    status: 'Auto-Running' as const,
    icon: 'instructor'
  },
  { 
    key: 'learn', 
    title: 'Learn Studio (GLL)', 
    href: '/gll', 
    description: 'Roadmap, drills, clarity, review, and capstone', 
    status: 'Needs Input' as const,
    icon: 'learn'
  },
  { 
    key: 'safety', 
    title: 'Online Safety', 
    href: '/safety', 
    description: 'Recording consent and incident management', 
    status: 'Auto-Running' as const,
    icon: 'safety'
  },
  { 
    key: 'payments', 
    title: 'Payments & ESA', 
    href: '/pay', 
    description: 'Tuition plans, refunds, and proration', 
    status: 'Done' as const,
    icon: 'payments'
  },
  { 
    key: 'parents', 
    title: 'Parent/Learner Portal', 
    href: '/parent', 
    description: 'Attendance tracking, progress, and artifacts', 
    status: 'Auto-Running' as const,
    icon: 'parents'
  },
];

export default function MainDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2" data-testid="text-main-title">Foundry Online</h1>
        <p className="text-lg text-muted-foreground">
          One plan. One dashboard. Launch an online micro‑school in days.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-dashboard-tiles">
        {dashboardTiles.map(tile => (
          <DashboardCard
            key={tile.key}
            title={tile.title}
            description={tile.description}
            status={tile.status}
            href={tile.href}
            icon={tile.icon}
          />
        ))}
      </div>

      <div className="mt-12 p-6 bg-muted/30 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Getting Started</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Welcome to Foundry Online! Start by completing the operator onboarding to set up payments and banking.
        </p>
        <div className="flex gap-3">
          <a 
            href="/operator/onboarding" 
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium"
            data-testid="button-start-onboarding"
          >
            Start Onboarding
          </a>
          <a 
            href="/parent" 
            className="inline-flex items-center px-4 py-2 border border-border rounded-md hover:bg-accent text-sm font-medium"
            data-testid="button-view-parent-portal"
          >
            View Parent Portal
          </a>
        </div>
      </div>
    </div>
  );
}