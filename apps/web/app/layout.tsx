
import React from 'react';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = { title: 'Foundry Online', description: 'Atlas for Online Microschools' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en"><body className="bg-gray-50 text-gray-900">{children}</body></html>
    </ClerkProvider>
  );
}
