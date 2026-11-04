'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldAlert, Users, FileText, CheckSquare, ArrowUpRight, Plus, AlertTriangle, FileCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('Dashboard');
  const [selectedAuditReport, setSelectedAuditReport] = useState<any | null>(null);

  // Mock initial data for Bento Grid & Metrics
  const metrics = [
    { label: t('metrics.activeSubcontractors'), value: '24', change: '+3 this month', icon: Users, color: 'text-blue-400' },
    { label: t('metrics.jointLiabilityExposure'), value: '€ 4,250,000', change: '18 active contracts', icon: FileText, color: 'text-[#cbfa1f]' },
    { label: t('metrics.pendingAudits'), value: '5', change: 'Requires review', icon: AlertTriangle, color: 'text-amber-450' },
    { label: t('metrics.avgRiskScore'), value: '18.4 / 100', change: '-2.1% safer', icon: ShieldAlert, color: 'text-emerald-400' },
  ];

  const recentAudits = [
    {
      id: 'a1',
      subcontractor: 'Edilizia Moderna S.r.l.',
      documentType: 'DURC',
      expiryDate: '2025-06-15',
      status: 'VALID',
      aiSummary: {
        issuer: 'INPS / INAIL',
        protocol: 'INPS_39281928',
        regularity: true,
        notes: 'Linear regularity confirmed by automated scraper. No social security debt detected.',
      },
    },
    {
      id: 'a2',
      subcontractor: 'Impianti Elettrici Veneti',
      documentType: 'VISURA_CAMERALE',
      expiryDate: '2025-12-31',
      status: 'VALID',
      aiSummary: {
        chamber: 'CCIAA Treviso-Belluno',
        ateco: '43.21.01',
        antimafia: 'Active & Clean',
        notes: 'Corporate charges verify clean ownership structure.',
      },
    },
    {
      id: 'a3',
      subcontractor: 'Global Cleaning Service',
      documentType: 'SAFETY_PLAN',
      expiryDate: '2025-02-10',
      status: 'EXPIRED',
      aiSummary: {
        issuer: 'RSPP Internal',
        deficiencies: 'Missing signature on DUVRI appendix.',
        notes: 'Immediate suspension recommended until resubmission.',
      },
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{t('title')}</h1>
        <p className="text-slate-400 text-sm max-w-2xl">{t('subtitle')}</p>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-[#141e33] border border-[#1f2f53] rounded-2xl p-6 relative overflow-hidden group hover:border-[#cbfa1f]/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-slate-400">{m.label}</span>
                <div className="p-2.5 rounded-xl bg-[#1a294d] border border-[#2a3f75] text-slate-200">
                  <Icon className={`w-5 h-5 ${m.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-white mb-1">{m.value}</div>
              <div className="text-xs text-slate-400 font-mono">{m.change}</div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#cbfa1f]/5 rounded-full blur-2xl group-hover:bg-[#cbfa1f]/10 transition-all"></div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Bento layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Audits Table */}
        <div className="lg:col-span-2 bg-[#141e33] border border-[#1f2f53] rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">{t('recentAudits')}</h2>
            <Link href={`/${locale}/audits`} className="text-xs text-[#cbfa1f] hover:underline flex items-center gap-1 font-medium">
              View All Audits <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#1f2f53] text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Subcontractor</th>
                  <th className="pb-3">Document</th>
                  <th className="pb-3">Expiry</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2f53]/50">
                {recentAudits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-[#1a294d]/40 transition-colors">
                    <td className="py-4 font-medium text-white">{audit.subcontractor}</td>
                    <td className="py-4 text-slate-300">
                      <span className="px-2.5 py-1 rounded-md bg-[#1a294d] border border-[#2a3f75] text-xs font-mono">
                        {audit.documentType}
                      </span>
                    </td>
                    <td className="py-4 text-slate-300 font-mono text-xs">{audit.expiryDate}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        audit.status === 'VALID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {audit.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => setSelectedAuditReport(audit)}
                        className="px-3 py-1.5 rounded-lg bg-[#1a294d] text-[#cbfa1f] hover:bg-[#233663] text-xs font-medium transition-colors inline-flex items-center gap-1.5 border border-[#2a3f75]"
                      >
                        <FileCheck className="w-3.5 h-3.5" /> AI Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Risk Distribution */}
        <div className="space-y-6">
          <div className="bg-[#141e33] border border-[#1f2f53] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">{t('quickActions')}</h2>
            <div className="space-y-3">
              <Link
                href={`/${locale}/subcontractors`}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1a294d] border border-[#2a3f75] text-white hover:border-[#cbfa1f]/50 transition-all text-sm font-medium group"
              >
                <span className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-[#cbfa1f]" />
                  {t('registerSubcontractor')}
                </span>
                <Plus className="w-4 h-4 text-slate-400 group-hover:text-[#cbfa1f]" />
              </Link>
              <Link
                href={`/${locale}/contracts`}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1a294d] border border-[#2a3f75] text-white hover:border-[#cbfa1f]/50 transition-all text-sm font-medium group"
              >
                <span className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#cbfa1f]" />
                  {t('newContract')}
                </span>
                <Plus className="w-4 h-4 text-slate-400 group-hover:text-[#cbfa1f]" />
              </Link>
              <Link
                href={`/${locale}/audits`}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1a294d] border border-[#2a3f75] text-white hover:border-[#cbfa1f]/50 transition-all text-sm font-medium group"
              >
                <span className="flex items-center gap-3">
                  <CheckSquare className="w-4 h-4 text-[#cbfa1f]" />
                  {t('runAudit')}
                </span>
                <Plus className="w-4 h-4 text-slate-400 group-hover:text-[#cbfa1f]" />
              </Link>
            </div>
          </div>

          <div className="bg-[#141e33] border border-[#1f2f53] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">{t('riskDistribution')}</h2>
            <div className="space-y-4 text-sm">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Low Risk (0 - 25)</span>
                  <span className="font-mono text-white">16 subs (66%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1a294d] overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '66%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Medium Risk (26 - 60)</span>
                  <span className="font-mono text-white">6 subs (25%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1a294d] overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>High Risk / Non-Compliant (61+)</span>
                  <span className="font-mono text-white">2 subs (9%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1a294d] overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '9%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Haiku Report Modal Viewer */}
      {selectedAuditReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141e33] border border-[#1f2f53] rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1f2f53] pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Claude Haiku 4.5 AI Audit Report</h3>
                <p className="text-xs text-slate-400 mt-0.5">Entity: {selectedAuditReport.subcontractor} | Type: {selectedAuditReport.documentType}</p>
              </div>
              <button
                onClick={() => setSelectedAuditReport(null)}
                className="text-slate-400 hover:text-white p-2 rounded-lg bg-[#1a294d] border border-[#2a3f75]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-xl bg-[#1a294d] border border-[#2a3f75]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#cbfa1f] mb-2">Extracted Metadata & Assessment</h4>
                <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap bg-[#101728] p-3 rounded-lg border border-[#1f2f53]">
                  {JSON.stringify(selectedAuditReport.aiSummary, null, 2)}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#101728] border border-[#1f2f53]">
                  <span className="text-xs text-slate-400 block mb-1">Expiry Verification</span>
                  <span className="font-mono text-white font-semibold">{selectedAuditReport.expiryDate}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#101728] border border-[#1f2f53]">
                  <span className="text-xs text-slate-400 block mb-1">Status Code</span>
                  <span className="font-mono text-emerald-400 font-semibold">{selectedAuditReport.status}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAuditReport(null)}
                className="px-5 py-2.5 rounded-xl bg-[#cbfa1f] text-[#101728] font-bold text-sm hover:bg-[#b8e61b] transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
