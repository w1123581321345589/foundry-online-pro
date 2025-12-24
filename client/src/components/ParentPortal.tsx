import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar,
  Clock,
  DollarSign,
  Users,
  Play,
  Download,
  FileText,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Session {
  id: string;
  startsAt: string;
  durationMin: number;
  title: string;
}

interface Invoice {
  id: string;
  amountCents: number;
  status: 'open' | 'paid' | 'overdue';
  dueDate: string;
}

interface AttendanceRecord {
  id: string;
  createdAt: string;
  status: 'present' | 'late' | 'absent';
  sessionTitle: string;
  notes?: string;
}

interface Recording {
  id: string;
  sessionTitle: string;
  createdAt: string;
  url: string;
}

export default function ParentPortal() {
  // todo: remove mock functionality
  const [sessions, setSessions] = useState<Session[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [recapLoading, setRecapLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // todo: remove mock functionality - simulate data loading
    setSessions([
      { id: '1', startsAt: '2025-01-15T10:00:00Z', durationMin: 60, title: 'Mathematics - Algebra Basics' },
      { id: '2', startsAt: '2025-01-16T14:00:00Z', durationMin: 45, title: 'Science - Biology Lab' },
      { id: '3', startsAt: '2025-01-17T11:00:00Z', durationMin: 60, title: 'History - World War II' }
    ]);

    setInvoices([
      { id: '1', amountCents: 29900, status: 'open', dueDate: '2025-01-20' },
      { id: '2', amountCents: 29900, status: 'paid', dueDate: '2024-12-20' }
    ]);

    setAttendance([
      { id: '1', createdAt: '2024-12-15T10:00:00Z', status: 'present', sessionTitle: 'Mathematics - Fractions' },
      { id: '2', createdAt: '2024-12-14T14:00:00Z', status: 'late', sessionTitle: 'Science - Chemistry', notes: '5 minutes late' },
      { id: '3', createdAt: '2024-12-13T11:00:00Z', status: 'present', sessionTitle: 'History - Ancient Rome' }
    ]);

    setRecordings([
      { id: '1', sessionTitle: 'Mathematics - Fractions', createdAt: '2024-12-15T10:00:00Z', url: '#' },
      { id: '2', sessionTitle: 'Science - Chemistry', createdAt: '2024-12-14T14:00:00Z', url: '#' }
    ]);
  }, []);

  const handleGenerateRecap = async () => {
    setRecapLoading(true);
    console.log('Generating weekly recap PDF');
    
    setTimeout(() => {
      toast({
        title: "Weekly Recap Generated",
        description: "Your child's weekly recap PDF has been created and uploaded to secure storage.",
      });
      setRecapLoading(false);
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      present: { variant: 'default', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      late: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      absent: { variant: 'destructive', className: 'bg-red-100 text-red-800', icon: AlertCircle },
      open: { variant: 'destructive', className: 'bg-red-100 text-red-800', icon: AlertCircle },
      paid: { variant: 'default', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      overdue: { variant: 'destructive', className: 'bg-red-100 text-red-800', icon: AlertCircle }
    } as const;

    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    
    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-title">Parent Portal</h1>
        <p className="text-muted-foreground">Track your child's progress, attendance, and upcoming sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <Card data-testid="card-sessions">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessions.map(session => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border" data-testid={`session-${session.id}`}>
                  <div className="space-y-1">
                    <p className="font-medium text-sm" data-testid={`text-session-title-${session.id}`}>
                      {session.title}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(session.startsAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.durationMin} min
                      </span>
                    </div>
                  </div>
                  <Button size="sm" data-testid={`button-join-${session.id}`}>
                    Join Class
                  </Button>
                </div>
              ))}
              {sessions.length === 0 && (
                <p className="text-sm text-muted-foreground py-4" data-testid="text-no-sessions">
                  No upcoming sessions scheduled.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card data-testid="card-invoices">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map(invoice => (
                <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg border" data-testid={`invoice-${invoice.id}`}>
                  <div className="space-y-1">
                    <p className="font-medium text-sm" data-testid={`text-invoice-amount-${invoice.id}`}>
                      ${(invoice.amountCents / 100).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(invoice.status)}
                    {invoice.status === 'open' && (
                      <Button size="sm" data-testid={`button-pay-${invoice.id}`}>
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {invoices.length === 0 && (
                <p className="text-sm text-muted-foreground py-4" data-testid="text-no-invoices">
                  No invoices available.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance History */}
        <Card data-testid="card-attendance">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Recent Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendance.slice(0, 5).map(record => (
                <div key={record.id} className="flex items-center justify-between" data-testid={`attendance-${record.id}`}>
                  <div className="space-y-1">
                    <p className="font-medium text-sm" data-testid={`text-attendance-session-${record.id}`}>
                      {record.sessionTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(record.createdAt).toLocaleDateString()}
                      {record.notes && ` • ${record.notes}`}
                    </p>
                  </div>
                  {getStatusBadge(record.status)}
                </div>
              ))}
              {attendance.length === 0 && (
                <p className="text-sm text-muted-foreground py-4" data-testid="text-no-attendance">
                  No attendance records available.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Session Recordings */}
        <Card data-testid="card-recordings">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              Session Recordings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recordings.map(recording => (
                <div key={recording.id} className="flex items-center justify-between" data-testid={`recording-${recording.id}`}>
                  <div className="space-y-1">
                    <p className="font-medium text-sm" data-testid={`text-recording-title-${recording.id}`}>
                      {recording.sessionTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(recording.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" data-testid={`button-watch-${recording.id}`}>
                    <Play className="w-3 h-3 mr-1" />
                    Watch
                  </Button>
                </div>
              ))}
              {recordings.length === 0 && (
                <p className="text-sm text-muted-foreground py-4" data-testid="text-no-recordings">
                  No recordings available.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Recap */}
      <Card data-testid="card-recap">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Weekly Progress Recap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Generate a comprehensive weekly report with attendance, assignments, and progress notes.
              </p>
              <p className="text-xs text-muted-foreground">
                Reports include watermarked PDFs with secure cloud storage and retention policies.
              </p>
            </div>
            <Button 
              onClick={handleGenerateRecap} 
              disabled={recapLoading}
              data-testid="button-generate-recap"
            >
              {recapLoading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Recap
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}