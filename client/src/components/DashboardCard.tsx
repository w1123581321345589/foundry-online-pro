import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users, 
  BookOpen, 
  Video,
  Shield,
  CreditCard,
  UserCheck
} from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  status: 'Done' | 'Auto-Running' | 'Needs Input';
  href: string;
  icon?: string;
}

const iconMap = {
  identity: UserCheck,
  background: Shield,
  catalog: BookOpen,
  classroom: Video,
  instructor: Users,
  learn: BookOpen,
  safety: Shield,
  payments: CreditCard,
  parents: Users,
};

const statusConfig = {
  'Done': {
    variant: 'secondary',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: CheckCircle
  },
  'Auto-Running': {
    variant: 'default',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    icon: Clock
  },
  'Needs Input': {
    variant: 'destructive',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    icon: AlertCircle
  }
} as const;

export default function DashboardCard({ title, description, status, href, icon }: DashboardCardProps) {
  const IconComponent = icon ? iconMap[icon as keyof typeof iconMap] : Users;
  const StatusIcon = statusConfig[status].icon;

  return (
    <Link href={href} data-testid={`link-dashboard-${icon || 'default'}`}>
      <Card className="hover-elevate cursor-pointer transition-all duration-200 p-6 h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <IconComponent className="w-5 h-5 text-primary" data-testid={`icon-${icon || 'default'}`} />
          </div>
          <Badge className={statusConfig[status].className} data-testid={`badge-status-${status.toLowerCase().replace(' ', '-')}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-lg" data-testid={`text-title-${icon || 'default'}`}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-description-${icon || 'default'}`}>
            {description}
          </p>
        </div>
      </Card>
    </Link>
  );
}