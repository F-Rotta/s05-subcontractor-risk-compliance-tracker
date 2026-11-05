'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';

// Define the Contract type based on your Prisma schema
type Contract = {
  id: string;
  subcontractorId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  value: number;
  status: 'verified' | 'under_review' | 'suspended' | 'blacklisted'; // Ensure this matches Prisma enum
  complianceScore: number;
  address: string;
  complianceAudits: any[]; // Replace 'any' with actual ComplianceAudit type if available
  complianceDocuments: any[]; // Replace 'any' with actual ComplianceDocument type if available
  createdAt: Date;
  updatedAt?: Date;
};

const ContractsPage: React.FC = () => {
  const t = useTranslations('Contracts');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        // This is mock data. In a real application, you would fetch this from your API.
        const mockContracts: Contract[] = [
          {
            id: 'c001',
            subcontractorId: 's001',
            name: 'Construction Project A',
            description: 'Building new office complex',
            startDate: new Date('2023-01-15'),
            endDate: new Date('2024-06-30'),
            value: 1500000,
            address: '123 Main St',
            complianceScore: 85,
            status: 'verified', // Changed 'Active' to 'verified'
            complianceAudits: [],
            complianceDocuments: [],
            createdAt: new Date('2022-12-01'),
          },
          {
            id: 'c002',
            subcontractorId: 's002',
            name: 'IT Services Contract',
            description: 'Managed IT services for 2 years',
            startDate: new Date('2023-03-01'),
            endDate: new Date('2025-02-28'),
            value: 500000,
            address: '456 Oak Ave',
            complianceScore: 92,
            status: 'under_review', // Changed 'Pending' to 'under_review'
            complianceAudits: [],
            complianceDocuments: [],
            createdAt: new Date('2023-02-10'),
          },
          {
            id: 'c003',
            subcontractorId: 's003',
            name: 'Logistics Partnership',
            description: 'Supply chain management',
            startDate: new Date('2023-05-01'),
            endDate: new Date('2026-04-30'),
            value: 2000000,
            address: '789 Pine Ln',
            complianceScore: 78,
            status: 'suspended', // Changed 'Suspended' to 'suspended'
            complianceAudits: [],
            complianceDocuments: [],
            createdAt: new Date('2023-04-15'),
          },
        ];
        setContracts(mockContracts);
      } catch (err) {
        setError(t('fetchError'));
        console.error('Error fetching contracts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [t]);

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.subcontractorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (
    status: 'verified' | 'under_review' | 'suspended' | 'blacklisted'
  ) => {
    switch (status) {
      case 'verified':
        return 'default';
      case 'under_review':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      case 'blacklisted':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return <div className="p-6">{t('loading')}</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <Link href="/contracts/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('newContract')}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            {t('searchContracts')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('contractsList')}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredContracts.length === 0 ? (
            <p>{t('noContractsFound')}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('contractName')}</TableHead>
                    <TableHead>{t('subcontractorId')}</TableHead>
                    <TableHead>{t('value')}</TableHead>
                    <TableHead>{t('startDate')}</TableHead>
                    <TableHead>{t('endDate')}</TableHead>
                    <TableHead>{t('complianceScore')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">
                        {contract.name}
                      </TableCell>
                      <TableCell>{contract.subcontractorId}</TableCell>
                      <TableCell>
                        ${contract.value.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(contract.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(contract.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{contract.complianceScore}%</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(contract.status)}
                        >
                          {t(`status.${contract.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/contracts/${contract.id}`}>
                          <Button variant="ghost" size="sm">
                            {t('view')}
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractsPage;
