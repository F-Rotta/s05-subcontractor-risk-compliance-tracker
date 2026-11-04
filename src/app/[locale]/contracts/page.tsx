'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileText, Plus, Check, X } from 'lucide-react';
import { SubcontractContract } from '@/lib/schemas/contract';

export default function ContractsPage() {
  const t = useTranslations('Contracts');
  const tForms = useTranslations('Forms');

  const [contracts, setContracts] = useState<SubcontractContract[]>([
    {
      id: 'c1017384-d113-4ec6-a57f-d1e028b030c1',
      spoke_org_id: 'a0000000-0000-0000-0000-000000000001',
      subcontractor_id: 'd3b07384-d113-4ec6-a57f-d1e028b030c1',
      contract_code: 'CTR-2025-089',
      joint_liability_clause: true,
      contract_value: 450000.00,
      start_date: '2025-01-01',
      expiration_date: '2025-12-31',
      created_at: '2025-01-02T10:00:00Z',
    },
    {
      id: 'c1017384-d113-4ec6-a57f-d1e028b030c2',
      spoke_org_id: 'a0000000-0000-0000-0000-000000000001',
      subcontractor_id: 'd3b07384-d113-4ec6-a57f-d1e028b030c2',
      contract_code: 'CTR-2025-092',
      joint_liability_clause: true,
      contract_value: 180000.50,
      start_date: '2025-02-01',
      expiration_date: '2026-01-31',
      created_at: '2025-02-01T11:00:00Z',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    contract_code: '',
    subcontractor_id: 'd3b07384-d113-4ec6-a57f-d1e028b030c1',
    joint_liability_clause: true,
    contract_value: 100000,
    start_date: '2025-03-01',
    expiration_date: '2026-03-01',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newContract: SubcontractContract = {
      id: crypto.randomUUID(),
      spoke_org_id: 'a0000000-0000-0000-0000-000000000001',
      ...formData,
      created_at: new Date().toISOString(),
    };
    setContracts([newContract, ...contracts]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{t('title')}</h1>
          <p className="text-slate-400 text-sm max-w-2xl">{t('subtitle')}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#cbfa1f] text-[#101728] font-bold text-sm hover:bg-[#b8e61b] transition-colors shadow-lg shadow-[#cbfa1f]/10"
        >
          <Plus className="w-4 h-4" /> {t('addBtn')}
        </button>
      </div>

      <div className="bg-[#141e33] border border-[#1f2f53] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#1f2f53] bg-[#1a294d]/30 text-xs font-medium text-slate-400 uppercase tracking-wider">
                <th className="p-5">{t('table.code')}</th>
                <th className="p-5">{t('table.subcontractor')}</th>
                <th className="p-5">{t('table.value')}</th>
                <th className="p-5">{t('table.jointLiability')}</th>
                <th className="p-5">{t('table.validity')}</th>
                <th className="p-5 text-right">{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2f53]/50">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-[#1a294d]/40 transition-colors">
                  <td className="p-5 font-mono font-semibold text-white">{c.contract_code}</td>
                  <td className="p-5 text-slate-300">Edilizia Moderna S.r.l.</td>
                  <td className="p-5 font-mono text-emerald-400 font-semibold">€ {c.contract_value.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
                  <td className="p-5">
                    {c.joint_liability_clause ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Check className="w-3 h-3" /> Enforced
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                        <X className="w-3 h-3" /> Missing
                      </span>
                    )}
                  </td>
                  <td className="p-5 font-mono text-xs text-slate-300">
                    {c.start_date} → {c.expiration_date}
                  </td>
                  <td className="p-5 text-right">
                    <button className="px-3 py-1.5 rounded-lg bg-[#1a294d] text-[#cbfa1f] hover:bg-[#233663] text-xs font-medium transition-colors border border-[#2a3f75]">
                      Review Clause
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141e33] border border-[#1f2f53] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1f2f53] pb-4">
              <h3 className="text-xl font-bold text-white">{t('addBtn')}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">{tForms('contract.code')}</label>
                <input
                  type="text"
                  required
                  value={formData.contract_code}
                  onChange={(e) => setFormData({ ...formData, contract_code: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101728] border border-[#1f2f53] text-white focus:outline-none focus:border-[#cbfa1f]"
                  placeholder="CTR-2025-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">{tForms('contract.value')}</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.contract_value}
                  onChange={(e) => setFormData({ ...formData, contract_value: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101728] border border-[#1f2f53] text-white focus:outline-none focus:border-[#cbfa1f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">{tForms('contract.startDate')}</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#101728] border border-[#1f2f53] text-white focus:outline-none focus:border-[#cbfa1f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">{tForms('contract.expirationDate')}</label>
                  <input
                    type="date"
                    required
                    value={formData.expiration_date}
                    onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#101728] border border-[#1f2f53] text-white focus:outline-none focus:border-[#cbfa1f]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="joint_liability"
                  checked={formData.joint_liability_clause}
                  onChange={(e) => setFormData({ ...formData, joint_liability_clause: e.target.checked })}
                  className="w-4 h-4 rounded bg-[#101728] border-[#1f2f53] text-[#cbfa1f] focus:ring-0"
                />
                <label htmlFor="joint_liability" className="text-xs font-semibold text-slate-300">
                  {tForms('contract.jointLiability')}
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1f2f53]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#1a294d] text-slate-300 hover:text-white text-sm font-medium"
                >
                  {tForms('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#cbfa1f] text-[#101728] font-bold text-sm hover:bg-[#b8e61b] transition-colors"
                >
                  {tForms('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
