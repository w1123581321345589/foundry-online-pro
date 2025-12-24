import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BalanceInfo {
  available: number;
  pending: number;
  total: number;
}

interface Payout {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'in_transit' | 'failed';
  created: string;
  arrival_date?: string;
}

interface ConnectStatus {
  connected: boolean;
  details_submitted: boolean;
  charges_enabled: boolean;
  payouts_enabled: boolean;
}

export default function PayoutsDashboard() {
  // todo: remove mock functionality
  const [connectStatus, setConnectStatus] = useState<ConnectStatus | null>(null);
  const [balance, setBalance] = useState<BalanceInfo | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // todo: remove mock functionality - load initial data
    setConnectStatus({
      connected: true,
      details_submitted: true,
      charges_enabled: true,
      payouts_enabled: true
    });

    setBalance({
      available: 2847.50,
      pending: 1234.00,
      total: 4081.50
    });

    setPayouts([
      { id: 'po_1', amount: 1500.00, status: 'paid', created: '2024-12-15T10:00:00Z', arrival_date: '2024-12-17T00:00:00Z' },
      { id: 'po_2', amount: 2300.00, status: 'pending', created: '2024-12-18T10:00:00Z', arrival_date: '2024-12-20T00:00:00Z' },
      { id: 'po_3', amount: 875.00, status: 'in_transit', created: '2024-12-20T10:00:00Z', arrival_date: '2024-12-22T00:00:00Z' }
    ]);
  }, []);

  const handleRefreshData = async () => {
    setLoading(true);
    console.log('Refreshing payouts and balance data');
    
    setTimeout(() => {
      toast({
        title: "Data Refreshed",
        description: "Balance and payout information has been updated.",
      });
      setLoading(false);
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      paid: { 
        variant: 'default' as const, 
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', 
        icon: CheckCircle 
      },
      pending: { 
        variant: 'secondary' as const, 
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', 
        icon: Clock 
      },
      in_transit: { 
        variant: 'default' as const, 
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', 
        icon: TrendingUp 
      },
      failed: { 
        variant: 'destructive' as const, 
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', 
        icon: AlertCircle 
      }
    };

    const config = configs[status as keyof typeof configs] || configs.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!connectStatus) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading payout information...</p>
        </div>
      </div>
    );
  }

  if (!connectStatus.connected) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Stripe Connect Not Set Up</h2>
            <p className="text-muted-foreground mb-4">
              You need to complete Stripe Connect onboarding before viewing payouts.
            </p>
            <Button asChild>
              <a href="/operator/onboarding">Complete Onboarding</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-title">Payouts Dashboard</h1>
          <p className="text-muted-foreground">Monitor your connected account balance and payout history</p>
        </div>
        
        <Button 
          onClick={handleRefreshData} 
          disabled={loading}
          variant="outline"
          data-testid="button-refresh"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Refresh Data
        </Button>
      </div>

      {/* Account Status */}
      <Card data-testid="card-account-status">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Stripe Connect Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Connected</p>
              {connectStatus.connected ? (
                <Badge className="bg-green-100 text-green-800" data-testid="badge-connected">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Yes
                </Badge>
              ) : (
                <Badge variant="destructive">No</Badge>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Details Submitted</p>
              {connectStatus.details_submitted ? (
                <Badge className="bg-green-100 text-green-800" data-testid="badge-details">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Yes
                </Badge>
              ) : (
                <Badge variant="destructive">No</Badge>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Charges Enabled</p>
              {connectStatus.charges_enabled ? (
                <Badge className="bg-green-100 text-green-800" data-testid="badge-charges">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Yes
                </Badge>
              ) : (
                <Badge variant="destructive">No</Badge>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Payouts Enabled</p>
              {connectStatus.payouts_enabled ? (
                <Badge className="bg-green-100 text-green-800" data-testid="badge-payouts">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Yes
                </Badge>
              ) : (
                <Badge variant="destructive">No</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card data-testid="card-available-balance">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600" data-testid="text-available-amount">
              {balance ? formatCurrency(balance.available) : '$0.00'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Ready for payout
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-pending-balance">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600" data-testid="text-pending-amount">
              {balance ? formatCurrency(balance.pending) : '$0.00'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Processing
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-balance">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-total-amount">
              {balance ? formatCurrency(balance.total) : '$0.00'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Available + Pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payouts */}
      <Card data-testid="card-payouts-history">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Recent Payouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payouts.map(payout => (
              <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`payout-${payout.id}`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold" data-testid={`text-payout-amount-${payout.id}`}>
                      {formatCurrency(payout.amount)}
                    </p>
                    {getStatusBadge(payout.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Created: {new Date(payout.created).toLocaleDateString()}</p>
                    {payout.arrival_date && (
                      <p>Arrives: {new Date(payout.arrival_date).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                
                <Button variant="outline" size="sm" data-testid={`button-view-payout-${payout.id}`}>
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Details
                </Button>
              </div>
            ))}
            
            {payouts.length === 0 && (
              <p className="text-center py-8 text-muted-foreground" data-testid="text-no-payouts">
                No payouts yet. Payouts will appear here after you receive payments.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}