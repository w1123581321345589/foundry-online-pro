import DashboardCard from '../DashboardCard';

export default function DashboardCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <DashboardCard
        title="Identity & Banking"
        description="KYC/KYB, payouts"
        status="Auto-Running"
        href="/operator/onboarding"
        icon="identity"
      />
      <DashboardCard
        title="Background Checks"
        description="Instructor screening"
        status="Needs Input"
        href="#"
        icon="background"
      />
      <DashboardCard
        title="Virtual Classroom"
        description="Video, whiteboard, recordings"
        status="Done"
        href="/classroom/sample-session-id"
        icon="classroom"
      />
    </div>
  );
}