import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'OVIO — Autonomous Treasury Recovery & Cashflow Rescue Agent',
  description: 'Autonomous financial operations agent built for neatHack 2026. Powered by Neatlogs telemetry, Entire continuous checkpoints, and cfo.ai financial scenario modeling.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Navigation Bar */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid #e4e4e7',
          padding: '12px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: '#000000',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '15px',
                padding: '4px 10px',
                borderRadius: '6px',
                letterSpacing: '0.05em'
              }}>
                OVIO
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.02em' }}>
                  Treasury Recovery Agent
                </div>
                <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 500 }}>
                  neatHack 2026 Edition
                </div>
              </div>
            </Link>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ color: '#09090b', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              Command Center
            </Link>
            <Link href="/how-it-works" style={{ color: '#09090b', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              How It Works
            </Link>
            <Link href="/docs" style={{ color: '#09090b', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              Docs
            </Link>
            <Link href="/evidence" style={{
              color: '#09090b',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '5px 12px',
              borderRadius: '6px',
              background: '#f4f4f5',
              border: '1px solid #e4e4e7'
            }}>
              Evidence Ledger
            </Link>
          </nav>
        </header>

        <main style={{ minHeight: 'calc(100vh - 70px)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
