import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Users, FileText, CheckSquare, Settings } from 'lucide-react';

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} className="dark">
      <body className="bg-[#101728] text-slate-100 min-h-screen font-sans selection:bg-[#cbfa1f] selection:text-[#101728]">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="flex min-h-screen">
            {/* Sidebar / Navigation */}
            <aside className="w-72 bg-[#141e33] border-r border-[#1f2f53] flex flex-col justify-between hidden md:flex">
              <div>
                <div className="p-6 border-b border-[#1f2f53] flex items-center gap-3">
                  <div className="p-2.5 bg-[#cbfa1f]/10 rounded-xl text-[#cbfa1f] border border-[#cbfa1f]/20">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="font-bold text-base tracking-tight text-white">S05 S-Compliance</h1>
                    <p className="text-xs text-slate-400">Legal & Notary Sub-Risk</p>
                  </div>
                </div>

                <nav className="p-4 space-y-1.5">
                  <Link
                    href={`/${locale}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1f2f53]/50 transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4 text-[#cbfa1f]" />
                    Dashboard
                  </Link>
                  <Link
                    href={`/${locale}/subcontractors`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1f2f53]/50 transition-colors"
                  >
                    <Users className="w-4 h-4 text-slate-400" />
                    Subcontractors
                  </Link>
                  <Link
                    href={`/${locale}/contracts`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1f2f53]/50 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-slate-400" />
                    Contracts
                  </Link>
                  <Link
                    href={`/${locale}/audits`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1f2f53]/50 transition-colors"
                  >
                    <CheckSquare className="w-4 h-4 text-slate-400" />
                    Compliance Audits
                  </Link>
                </nav>
              </div>

              <div className="p-4 border-t border-[#1f2f53]">
                <div className="p-3 bg-[#1a294d] rounded-xl border border-[#2a3f75] flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#cbfa1f] animate-pulse"></span>
                    Claude Haiku 4.5
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">v4.5-hybrid</span>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0">
              <header className="h-16 border-b border-[#1f2f53] bg-[#141e33]/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="font-semibold text-white">Studi Legali e Notai</span>
                  <span>/</span>
                  <span className="text-slate-300">Risk Tracker S05</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-mono text-slate-300">SECURE RLS ACTIVE</span>
                </div>
              </header>

              <div className="p-8 max-w-7xl w-full mx-auto flex-1">
                {children}
              </div>
            </main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
