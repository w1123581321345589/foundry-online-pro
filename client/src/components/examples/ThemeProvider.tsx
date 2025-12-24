import { ThemeProvider } from '../ThemeProvider';
import { Button } from '@/components/ui/button';

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Theme Provider Example</h2>
        <p className="text-muted-foreground">
          This component provides theme switching capabilities throughout the app.
        </p>
        <div className="space-x-2">
          <Button>Sample Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="secondary">Secondary Button</Button>
        </div>
      </div>
    </ThemeProvider>
  );
}