'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, User, Zap, LogOut } from 'lucide-react';
import CreditPaywallModal from './CreditPaywallModal';

export default function HeaderNav() {
  const t = useTranslations('S05');
  const [user, setUser] = useState<{ email: string } | null>({ email: 'lawyer@studiolegale.it' });
  const [credits, setCredits] = useState(42);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignOut = () => {
    setUser(null);
  };

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      setUser({ email: emailInput });
      setShowAuthModal(false);
      setEmailInput('');
    }
  };

  return (
    <>
      <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#cbfa1f]/10 rounded-xl border border-[#cbfa1f]/20 text-[#cbfa1f]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              {t('title')}
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#cbfa1f]/20 text-[#cbfa1f] font-mono border border-[#cbfa1f]/30">
                S05
              </span>
            </h1>
            <p className="text-xs text-slate-400">{t('subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Credit Balance Pill */}
          <div
            onClick={() => setIsPaywallOpen(true)}
            className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/80 px-3.5 py-1.5 rounded-full cursor-pointer hover:border-[#cbfa1f]/50 transition-all shadow-inner"
          >
            <Zap className="w-4 h-4 text-[#cbfa1f] fill-[#cbfa1f]" />
            <span className="text-xs text-slate-300 font-medium">
              {t('credits.balance')}: <strong className="text-white font-mono">{credits}</strong>
            </span>
            <button className="text-[10px] bg-[#cbfa1f] text-[#0d121f] px-2 py-0.5 rounded-full font-bold ml-1">
              + {t('credits.topUp')}
            </button>
          </div>

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center space-x-3 bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-[#cbfa1f]/20 border border-[#cbfa1f]/30 flex items-center justify-center text-[#cbfa1f] font-bold text-xs">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-slate-200 hidden sm:inline">{user.email}</span>
              <button
                onClick={handleSignOut}
                title={t('auth.signOut')}
                className="text-slate-400 hover:text-red-400 transition-colors p-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 py-2 rounded-xl border border-slate-700 transition-all font-medium"
            >
              <User className="w-4 h-4 text-[#cbfa1f]" />
              <span>{t('auth.signIn')}</span>
            </button>
          )}
        </div>
      </header>

      {/* Credit Paywall Modal */}
      <CreditPaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onSuccess={() => setCredits((prev) => prev + 50)}
      />

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">{t('auth.signIn')}</h3>
            <p className="text-xs text-slate-400 mb-4">{t('auth.magicLinkPrompt')}</p>
            <form onSubmit={handleMagicLink} className="space-y-4">
              <input
                type="email"
                required
                placeholder={t('auth.emailPlaceholder')}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#cbfa1f]"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#cbfa1f] hover:bg-[#b8e619] text-[#0d121f] font-semibold rounded-xl text-sm transition-all"
              >
                {t('auth.sendMagicLink')}
              </button>
            </form>
            <button
              onClick={() => setShowAuthModal(false)}
              className="mt-3 w-full text-center text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
