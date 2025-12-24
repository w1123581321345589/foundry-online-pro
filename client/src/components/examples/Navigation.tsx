import Navigation from '../Navigation';
import { ThemeProvider } from '../ThemeProvider';

export default function NavigationExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Navigation Example</h1>
          <p className="text-muted-foreground">
            This navigation bar provides access to all major sections of the micro-school platform.
            Try clicking different navigation items to see the active state styling.
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}