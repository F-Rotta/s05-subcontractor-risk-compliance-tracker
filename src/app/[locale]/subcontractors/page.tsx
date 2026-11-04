'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { z } from 'zod';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  FileText,
  ExternalLink,
  ChevronRight,
  Loader2
} from 'lucide-react';

// Define the Zod enum for subcontractor status
const SubcontractorStatusEnum = z.enum(['ACTIVE', 'PENDING_REVIEW', 'SUSPENDED', 'TERMINATED']);
type SubcontractorStatus = z.infer<typeof SubcontractorStatusEnum>;

interface Subcontractor {
  id: string;
  name: string;
  tax_id: string;
  legal_representative: string;
  risk_score: number;
  status: SubcontractorStatus;
  created_at: string;
}

export default function SubcontractorsPage() {
  const t = useTranslations('Subcontractors');
  const locale = useLocale();
  
  const [subcontractors, setSubcontractors] = SubcontractorStatusEnum ? useState<Subcontractor[]>([]) : useState<Subcontractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tax_id: '',
    legal_representative: '',
    risk_score: 10,
    status: 'ACTIVE' as SubcontractorStatus,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for creating subcontractor
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('title')}</h1>
          <p className="text-sm text-gray-500">{t('subtitle')}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          {t('addAction')}
        </button>
      </div>

      {/* Content */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : subcontractors.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">{t('noSubcontractors')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('noSubcontractorsDescription')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">{t('table.name')}</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('table.taxId')}</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('table.legalRep')}</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('table.riskScore')}</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('table.status')}</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subcontractors.map((sub) => (
                  <tr key={sub.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{sub.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{sub.tax_id}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{sub.legal_representative}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sub.risk_score > 70 ? 'bg-red-100 text-red-800' : sub.risk_score > 30 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {sub.risk_score}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {sub.status}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900">
                        {t('table.view')}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
