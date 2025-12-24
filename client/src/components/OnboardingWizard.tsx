import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, RefreshCw, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OnboardingState {
  connected: boolean;
  hasSubscription: boolean;
  accountId?: string;
}

export default function OnboardingWizard() {
  const [orgName, setOrgName] = useState('My Microschool');
  const [billingEmail, setBillingEmail] = useState('admin@example.com');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [status, setStatus] = useState<OnboardingState | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching initial status
    setStatus({
      connected: false,
      hasSubscription: false
    });
  }, []);

  const handleStart = async () => {
    setLoading(true);
    console.log('Starting Stripe Connect onboarding', { orgName, billingEmail });
    
    // Simulate API call delay
    setTimeout(() => {
      toast({
        title: "Stripe Connect Started",
        description: "You would be redirected to Stripe's onboarding form in a real implementation.",
      });
      setStep(2);
      setLoading(false);
    }, 1000);
  };

  const handleRefresh = async () => {
    setLoading(true);
    console.log('Refreshing onboarding status');
    
    // Simulate status check
    setTimeout(() => {
      setStatus({
        connected: true,
        hasSubscription: false,
        accountId: 'acct_test123'
      });
      toast({
        title: "Status Updated",
        description: "Stripe Connect account is now active!",
      });
      setLoading(false);
    }, 800);
  };

  const handleFinish = async () => {
    setLoading(true);
    console.log('Starting $199/mo floor subscription');
    
    // Simulate subscription creation
    setTimeout(() => {
      setStatus(prev => prev ? {
        ...prev,
        hasSubscription: true
      } : null);
      toast({
        title: "Floor Fee Activated",
        description: "$199/month subscription is now active.",
      });
      setStep(3);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-title">Operator Onboarding</h1>
        <p className="text-muted-foreground">Set up your organization for payments and payouts</p>
      </div>

      {step === 1 && (
        <Card data-testid="card-step-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">1</span>
              Organization Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                placeholder="Enter your school name"
                data-testid="input-org-name"
              />
            </div>
            <div>
              <Label htmlFor="billing-email">Billing Email</Label>
              <Input
                id="billing-email"
                type="email"
                value={billingEmail}
                onChange={e => setBillingEmail(e.target.value)}
                placeholder="admin@yourschool.com"
                data-testid="input-billing-email"
              />
              <p className="text-sm text-muted-foreground mt-1">
                This email will be used for the $199/month floor subscription
              </p>
            </div>
            <Button 
              onClick={handleStart} 
              disabled={loading || !orgName || !billingEmail}
              className="w-full"
              data-testid="button-start-connect"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4 mr-2" />
              )}
              Start Stripe Connect
            </Button>
          </CardContent>
        </Card>
      )}

      {step >= 2 && (
        <Card data-testid="card-step-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">2</span>
              Complete Stripe Onboarding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Complete the Stripe onboarding form to enable payments and payouts.
            </p>
            
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleRefresh} 
                disabled={loading}
                variant="outline"
                data-testid="button-refresh-status"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh Status
              </Button>
              
              {status?.connected ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" data-testid="badge-connected">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Details submitted ✓
                </Badge>
              ) : (
                <Badge variant="secondary" data-testid="badge-pending">
                  Not completed yet
                </Badge>
              )}
            </div>

            <Button 
              onClick={handleFinish} 
              disabled={loading || !status?.connected}
              className="w-full"
              data-testid="button-start-floor"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              Start $199/mo Floor Fee
            </Button>

            {status?.hasSubscription && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 w-full justify-center" data-testid="badge-subscription-active">
                <CheckCircle className="w-3 h-3 mr-1" />
                Floor fee active ✓
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      {step >= 3 && (
        <Card data-testid="card-step-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-bold">✓</span>
              All Set!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Your organization is now ready to accept tuition payments and receive payouts.
            </p>
            <Button asChild variant="outline" data-testid="button-view-payouts">
              <a href="/operator/payouts">View Payouts Dashboard</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}