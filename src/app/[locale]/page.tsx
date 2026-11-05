'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SpokeBanner from '@/components/SpokeBanner';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Building2, 
  Coins, 
  UploadCloud, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Lock, 
  User, 
  LogOut,
  ChevronRight,
  Search,
  PlusCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

export default function SubcontractorRiskDashboard() {
  const t = useTranslations('S05');

  // Authentication & Credits state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>('avvocato@studiolegale.it');
  const [emailInput, setEmailInput] = useState<string>('');
  const [credits, setCredits] = useState<number>(14);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'subcontractors' | 'documents' | 'audits' | 'alerts'>('overview');

  // Intake Form state
  const [selectedDocType, setSelectedDocType] = useState<string>('durc_online');
  const [vatInput, setVatInput] = useState<string>('01234567890');
  const [protocolInput, setProtocolInput] = useState<string>('INAIL_2025_984125');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<{
    success: boolean;
    congruence: boolean;
    anomalies: number;
    riskScore: number;
    summary: string;
  } | null>({
    success: true,
    congruence: true,
    anomalies: 0,
    riskScore: 98.5,
    summary: 'DURC regolare. Nessuna irregolarità contributiva rilevata da Claude Haiku 4.5.'
  });

  // Mock data for lists
  const [subcontractorsList] = useState([
    { id: '1', name: 'Edilizia Alpina S.r.l.', vat: '12345678901', ccnl: 'Edilizia Industria', status: 'verified', rating: 0.98 },
    { id: '2', name: 'Impianti Elettrici Lombardi S.p.A.', vat: '98765432109', ccnl: 'Metalmeccanica', status: 'under_review', rating: 0.82 },
    { id: '3', name: 'Global Scaffolding & Services', vat: '11223344556', ccnl: 'Metalmeccanica Artigianato', status: 'suspended', rating: 0.54 }
  ]);

  const [documentsList] = useState([
    { id: 'd1', company: 'Edilizia Alpina S.r.l.', type: 'durc_online', protocol: 'INPS_448192', validUntil: '2025-08-15', status: 'valid' },
    { id: 'd2', company: 'Impianti Elettrici Lombardi S.p.A.', type: 'durf_fiscale', protocol: 'ADE_2025_0019', validUntil: '2025-06-30', status: 'valid' },
    { id: 'd3', company: 'Global Scaffolding & Services', type: 'f24_quittance', protocol: 'F24_REV_99', validUntil: '2025-03-01', status: 'expired' }
  ]);

  const [auditsList] = useState([
    { id: 'a1', agreement: 'Appalto Centrale Termica Milano', subcontractor: 'Edilizia Alpina S.r.l.', month: '2025-05-01', withheld: '€ 12.450,00', outcome: 'cleared' },
    { id: 'a2', agreement: 'Ristrutturazione Palazzo Giureconsulti', subcontractor: 'Impianti Elettrici Lombardi S.p.A.', month: '2025-05-01', withheld: '€ 28.100,00', outcome: 'cautionary_withholding' }
  ]);

  const handleMagicLinkLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setUserEmail(emailInput);
      setIsAuthenticated(true);
      setEmailInput('');
    }
  };

  const handleRunAudit = () => {
    if (credits <= 0) {
      setIsCreditModalOpen(true);
      return;
    }
    setIsAuditing(true);
    setTimeout(() => {
      setCredits(prev => prev - 1);
      setIsAuditing(false);
      setAuditResult({
        success: true,
        congruence: true,
        anomalies: 0,
        riskScore: 96.2,
        summary: 'Analisi Claude Haiku 4.5 completata. Corrispondenza anagrafica e congruità manodopera verificata.'
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0d121f] text-[#f8fafc] font-sans antialiased selection:bg-[#cbfa1f] selection:text-[#0d121f]">
      <SpokeBanner />

      {/* Top Header */}
      <header className="border-b border-slate-800 bg-[#111827]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#cbfa1f]/20 to-[#10b981]/20 border border-[#cbfa1f]/30 flex items-center justify-center shadow-lg shadow-[#cbfa1f]/5">
              <ShieldCheck className="w-6 h-6 text-[#cbfa1f]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-[#f8fafc]">{t('title')}</h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#cbfa1f]/10 text-[#cbfa1f] border border-[#cbfa1f]/20">
                  {t('niche')}
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">{t('subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Credit Balance Pill */}
            <button
              onClick={() => setIsCreditModalOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all shadow-sm group"
            >
              <Coins className="w-4 h-4 text-[#cbfa1f] group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-[10px] text-[#94a3b8] uppercase tracking-wider font-medium">{t('credits.title')}</div>
                <div className="text-xs font-bold text-[#f8fafc]">{credits} {t('credits.remaining')}</div>
              </div>
            </button>

            {/* Auth Pill / User Session */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                  <User className="w-4 h-4 text-[#cbfa1f]" />
                </div>
                <div className="text-xs">
                  <div className="text-[#94a3b8]">{t('auth.authenticatedAs')}</div>
                  <div className="font-medium text-[#f8fafc] truncate max-w-[160px]">{userEmail}</div>
                </div>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-[#94a3b8] hover:text-[#f43f5e] transition-colors"
                  title={t('auth.signOut')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Unauthenticated State Modal / Banner */}
        {!isAuthenticated && (
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-[#cbfa1f]/10 border border-[#cbfa1f]/20 rounded-2xl flex items-center justify-center mx-auto text-[#cbfa1f]">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#f8fafc]">{t('auth.signInTitle')}</h2>
              <p className="text-sm text-[#94a3b8] mt-1">{t('auth.signInSubtitle')}</p>
            </div>
            <form onSubmit={handleMagicLinkLogin} className="space-y-4">
              <input
                type="email"
                required
                placeholder={t('auth.emailPlaceholder')}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-[#f8fafc] placeholder-[#94a3b8] focus:outline-none focus:border-[#cbfa1f] text-sm"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#cbfa1f] hover:bg-[#b8e619] text-[#0d121f] font-bold text-sm transition-colors shadow-lg shadow-[#cbfa1f]/10"
              >
                {t('auth.sendMagicLink')}
              </button>
            </form>
          </div>
        )}

        {isAuthenticated && (
          <>
            {/* 4-Card Bento Grid Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md shadow-lg relative overflow-hidden group hover:border-[#cbfa1f]/30 transition-all">
                <div className="absolute top-0 right-0 p-4 text-slate-800 group-hover:text-[#cbfa1f]/10 transition-colors">
                  <Building2 className="w-16 h-16" />
                </div>
                <div className="text-sm font-medium text-[#94a3b8]">{t('dashboard.totalSubcontractors')}</div>
                <div className="text-3xl font-extrabold text-[#f8fafc] mt-2">28</div>
                <div className="flex items-center text-xs text-emerald-400 mt-2 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 100% Attivi e censiti
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md shadow-lg relative overflow-hidden group hover:border-[#cbfa1f]/30 transition-all">
                <div className="absolute top-0 right-0 p-4 text-slate-800 group-hover:text-emerald-500/10 transition-colors">
                  <ShieldCheck className="w-16 h-16" />
                </div>
                <div className="text-sm font-medium text-[#94a3b8]">{t('dashboard.complianceRate')}</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-2">94.8%</div>
                <div className="flex items-center text-xs text-[#94a3b8] mt-2">
                  Rispetto a soglia minima legale 90%
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md shadow-lg relative overflow-hidden group hover:border-rose-500/30 transition-all">
                <div className="absolute top-0 right-0 p-4 text-slate-800 group-hover:text-rose-500/10 transition-colors">
                  <AlertTriangle className="w-16 h-16" />
                </div>
                <div className="text-sm font-medium text-[#94a3b8]">{t('dashboard.highRiskAlerts')}</div>
                <div className="text-3xl font-extrabold text-rose-400 mt-2">3</div>
                <div className="flex items-center text-xs text-rose-400 mt-2 font-medium">
                  <XCircle className="w-3.5 h-3.5 mr-1" /> DURC irregolari / Scaduti
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-all">
                <div className="absolute top-0 right-0 p-4 text-slate-800 group-hover:text-amber-500/10 transition-colors">
                  <Clock className="w-16 h-16" />
                </div>
                <div className="text-sm font-medium text-[#94a3b8]">{t('dashboard.pendingAudits')}</div>
                <div className="text-3xl font-extrabold text-amber-400 mt-2">5</div>
                <div className="flex items-center text-xs text-amber-400 mt-2 font-medium">
                  <Clock className="w-3.5 h-3.5 mr-1" /> Scadenza Art. 29 c.2
                </div>
              </div>
            </div>

            {/* Operational Intake & Audit Trigger Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Intake Form */}
              <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#cbfa1f]/10 border border-[#cbfa1f]/20 flex items-center justify-center text-[#cbfa1f]">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#f8fafc]">{t('intake.title')}</h3>
                    <p className="text-xs text-[#94a3b8]">{t('intake.subtitle')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">
                      {t('intake.selectType')}
                    </label>
                    <select
                      value={selectedDocType}
                      onChange={(e) => setSelectedDocType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-[#f8fafc] text-sm focus:outline-none focus:border-[#cbfa1f]"
                    >
                      <option value="durc_online">DURC Online (INPS/INAIL)</option>
                      <option value="durf_fiscale">DURF Fiscale (Art. 17-bis)</option>
                      <option value="f24_quittance">Quietanza F24 Subappaltatore</option>
                      <option value="polizza_rct_rco">Polizza RCT / RCO Cantieri</option>
                      <option value="visura_camerale">Visura Camerale Ordinaria</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">
                      {t('intake.vatNumber')}
                    </label>
                    <input
                      type="text"
                      value={vatInput}
                      onChange={(e) => setVatInput(e.target.value)}
                      placeholder="IT01234567890"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-[#f8fafc] text-sm focus:outline-none focus:border-[#cbfa1f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">
                    {t('intake.protocolNumber')}
                  </label>
                  <input
                    type="text"
                    value={protocolInput}
                    onChange={(e) => setProtocolInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-[#f8fafc] text-sm focus:outline-none focus:border-[#cbfa1f]"
                  />
                </div>

                {/* Dropzone area */}
                <div className="border-2 border-dashed border-slate-700 hover:border-[#cbfa1f]/50 rounded-2xl p-8 text-center bg-slate-950/40 transition-colors cursor-pointer group">
                  <UploadCloud className="w-10 h-10 text-[#94a3b8] group-hover:text-[#cbfa1f] mx-auto mb-3 transition-colors" />
                  <p className="text-sm font-medium text-[#f8fafc]">{t('intake.dropzone')}</p>
                  <p className="text-xs text-[#94a3b8] mt-1">PDF, XML, P7M fino a 25MB • Claude Haiku 4.5 OCR Engine</p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleRunAudit}
                    disabled={isAuditing}
                    className="px-6 py-3.5 rounded-xl bg-[#cbfa1f] hover:bg-[#b8e619] text-[#0d121f] font-bold text-sm transition-all shadow-lg shadow-[#cbfa1f]/15 flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isAuditing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Analisi Claude in corso...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>{t('intake.submitButton')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Live AI Inspection Result Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">AI Inspection Report</span>
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      CONGRUENT
                    </span>
                  </div>

                  {auditResult ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#94a3b8]">Confidence Score:</span>
                          <span className="font-bold text-[#cbfa1f]">{auditResult.riskScore}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#cbfa1f] h-full rounded-full" style={{ width: `${auditResult.riskScore}%` }}></div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-[#f8fafc] leading-relaxed">
                        {auditResult.summary}
                      </div>

                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                          <span>Partita IVA verificata:</span>
                          <span className="text-[#f8fafc] font-mono">01234567890</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                          <span>Scadenza Contributiva:</span>
                          <span className="text-emerald-400 font-mono">30/09/2025</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                          <span>Responsabilità Solidale:</span>
                          <span className="text-amber-400 font-medium">Attiva (Art. 29 c.2)</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-[#94a3b8] text-sm">
                      Carica un documento per avviare l&apos;ispezione automatica.
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-[#94a3b8] flex items-center justify-between">
                  <span>Engine: Claude Haiku 4.5</span>
                  <span className="text-[#cbfa1f]">Zavorra Legale S05</span>
                </div>
              </div>
            </div>

            {/* Interactive Data Tables & Tabs */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              {/* Tab Navigation */}
              <div className="flex flex-wrap border-b border-slate-800 gap-2 pb-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'overview'
                      ? 'bg-[#cbfa1f] text-[#0d121f] shadow-md'
                      : 'text-[#94a3b8] hover:bg-slate-800 hover:text-[#f8fafc]'
                  }`}
                >
                  {t('dashboard.tabOverview')}
                </button>
                <button
                  onClick={() => setActiveTab('subcontractors')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'subcontractors'
                      ? 'bg-[#cbfa1f] text-[#0d121f] shadow-md'
                      : 'text-[#94a3b8] hover:bg-slate-800 hover:text-[#f8fafc]'
                  }`}
                >
                  {t('dashboard.tabSubcontractors')}
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'documents'
                      ? 'bg-[#cbfa1f] text-[#0d121f] shadow-md'
                      : 'text-[#94a3b8] hover:bg-slate-800 hover:text-[#f8fafc]'
                  }`}
                >
                  {t('dashboard.tabDocuments')}
                </button>
                <button
                  onClick={() => setActiveTab('audits')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'audits'
                      ? 'bg-[#cbfa1f] text-[#0d121f] shadow-md'
                      : 'text-[#94a3b8] hover:bg-slate-800 hover:text-[#f8fafc]'
                  }`}
                >
                  {t('dashboard.tabAudits')}
                </button>
              </div>

              {/* Tab Content: Subcontractors */}
              {(activeTab === 'overview' || activeTab === 'subcontractors') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#f8fafc] uppercase tracking-wider">Subappaltatori Censiti e Rating di Conformità</h4>
                    <button className="text-xs text-[#cbfa1f] hover:underline flex items-center space-x-1">
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Nuovo Subappaltatore</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-950/60 text-[#94a3b8] uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-4">Ragione Sociale</th>
                          <th className="py-3 px-4">Partita IVA</th>
                          <th className="py-3 px-4">CCNL Applicato</th>
                          <th className="py-3 px-4">Rating</th>
                          <th className="py-3 px-4">Stato</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-[#f8fafc]">
                        {subcontractorsList.map((sub) => (
                          <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4 font-medium flex items-center space-x-2">
                              <Building2 className="w-4 h-4 text-[#cbfa1f]" />
                              <span>{sub.name}</span>
                            </td>
                            <td className="py-3 px-4 font-mono text-xs text-[#94a3b8]">{sub.vat}</td>
                            <td className="py-3 px-4 text-xs">{sub.ccnl}</td>
                            <td className="py-3 px-4">
                              <span className="font-mono text-xs text-emerald-400 font-bold">{sub.rating * 100}%</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                                sub.status === 'verified'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : sub.status === 'under_review'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}>
                                {sub.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab Content: Documents */}
              {(activeTab === 'overview' || activeTab === 'documents') && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#f8fafc] uppercase tracking-wider">Archivio Documenti di Conformità (DURC/DURF/F24)</h4>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-950/60 text-[#94a3b8] uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-4">Subappaltatore</th>
                          <th className="py-3 px-4">Tipo Documento</th>
                          <th className="py-3 px-4">Protocollo</th>
                          <th className="py-3 px-4">Scadenza Validità</th>
                          <th className="py-3 px-4">Esito Verifica</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-[#f8fafc]">
                        {documentsList.map((doc) => (
                          <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4 font-medium">{doc.company}</td>
                            <td className="py-3 px-4 font-mono text-xs text-[#cbfa1f]">{doc.type.toUpperCase()}</td>
                            <td className="py-3 px-4 text-xs font-mono text-[#94a3b8]">{doc.protocol}</td>
                            <td className="py-3 px-4 text-xs">{doc.validUntil}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                                doc.status === 'valid'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}>
                                {doc.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab Content: Audits */}
              {(activeTab === 'overview' || activeTab === 'audits') && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#f8fafc] uppercase tracking-wider">Audit Responsabilità Solidale (Art. 29 c.2 D.Lgs. 276/03)</h4>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-950/60 text-[#94a3b8] uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-4">Contratto / Appalto</th>
                          <th className="py-3 px-4">Subappaltatore</th>
                          <th className="py-3 px-4">Mese Riferimento SAL</th>
                          <th className="py-3 px-4">Accantonamento Consigliato</th>
                          <th className="py-3 px-4">Esito Audit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-[#f8fafc]">
                        {auditsList.map((audit) => (
                          <tr key={audit.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4 font-medium">{audit.agreement}</td>
                            <td className="py-3 px-4 text-xs">{audit.subcontractor}</td>
                            <td className="py-3 px-4 font-mono text-xs">{audit.month}</td>
                            <td className="py-3 px-4 font-mono font-bold text-[#cbfa1f]">{audit.withheld}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                                audit.outcome === 'cleared'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {audit.outcome.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Stripe Checkout Credits Modal */}
      {isCreditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#f8fafc]">{t('credits.modalTitle')}</h3>
                <p className="text-xs text-[#94a3b8] mt-1">{t('credits.modalSubtitle')}</p>
              </div>
              <button
                onClick={() => setIsCreditModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-[#94a3b8] hover:text-[#f8fafc]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/80 hover:border-[#cbfa1f] transition-all cursor-pointer flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#f8fafc]">{t('credits.singlePass')}</div>
                  <div className="text-xs text-[#94a3b8]">1 Ispezione AI Completa • Validità illimitata</div>
                </div>
                <div className="text-lg font-extrabold text-[#cbfa1f]">€ 19</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/90 border-2 border-[#cbfa1f] cursor-pointer flex items-center justify-between shadow-lg shadow-[#cbfa1f]/5">
                <div>
                  <div className="font-bold text-sm text-[#f8fafc] flex items-center space-x-2">
                    <span>{t('credits.standardPass')}</span>
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#cbfa1f] text-[#0d121f] font-extrabold">POPULAR</span>
                  </div>
                  <div className="text-xs text-[#94a3b8]">10 Ispezioni AI • Report PDF Legale Certificato</div>
                </div>
                <div className="text-lg font-extrabold text-[#cbfa1f]">€ 149</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/80 hover:border-[#cbfa1f] transition-all cursor-pointer flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#f8fafc]">{t('credits.powerPass')}</div>
                  <div className="text-xs text-[#94a3b8]">50 Ispezioni AI • API Webhook dedicate</div>
                </div>
                <div className="text-lg font-extrabold text-[#cbfa1f]">€ 590</div>
              </div>
            </div>

            <button
              onClick={() => {
                setCredits(prev => prev + 10);
                setIsCreditModalOpen(false);
              }}
              className="w-full py-3.5 rounded-xl bg-[#cbfa1f] hover:bg-[#b8e619] text-[#0d121f] font-bold text-sm transition-all shadow-lg shadow-[#cbfa1f]/15"
            >
              {t('credits.buyNow')} (Stripe Checkout)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
