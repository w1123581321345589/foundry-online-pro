import { ThemeToggle } from '../ThemeToggle';
import { ThemeProvider } from '../ThemeProvider';

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Theme Toggle Example</h2>
          <ThemeToggle />
        </div>
        <p className="text-muted-foreground">
          Click the theme toggle button to cycle between light, dark, and system themes.
        </p>
      </div>
    </ThemeProvider>
  );
}