
import React, { useState, useMemo } from 'react';
import { useEmployees } from '../contexts/EmployeeContext';
import { useLeave } from '../contexts/LeaveContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, Download, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const LeaveCalculation = () => {
  const { employees } = useEmployees();
  const { getLeaveBalances } = useLeave();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'nomEmploye' | 'matricule' | 'joursRestants'>('nomEmploye');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const leaveBalances = useMemo(() => {
    return getLeaveBalances(employees);
  }, [employees, getLeaveBalances]);

  const filteredAndSortedBalances = useMemo(() => {
    let filtered = leaveBalances.filter(balance =>
      balance.nomEmploye.toLowerCase().includes(searchTerm.toLowerCase()) ||
      balance.matricule.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [leaveBalances, searchTerm, sortField, sortDirection]);

  const handleSort = (field: 'nomEmploye' | 'matricule' | 'joursRestants') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const exportToExcel = () => {
    const csvContent = [
      ['Nom de l\'employé', 'Matricule', 'Total Congés Annuels', 'Jours Utilisés', 'Jours Restants'],
      ...filteredAndSortedBalances.map(balance => [
        balance.nomEmploye,
        balance.matricule,
        balance.totalCongesAnnuels.toString(),
        balance.joursUtilises.toString(),
        balance.joursRestants.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `soldes_conges_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Soldes de congés exportés en Excel avec succès');
  };

  const exportToPDF = () => {
    const printContent = `
      <html>
        <head>
          <title>Soldes de Congés</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #2d5530; margin-bottom: 10px; }
            .header p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .low-balance { background-color: #fee; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ROYAUME DU MAROC</h1>
            <p>MINISTÈRE DE L'INTÉRIEUR</p>
            <p>RÉGION BENI MELLAL-KHENIFRA</p>
            <p>PROVINCE DE KHENIFRA</p>
            <p>COMMUNE DE KHENIFRA</p>
            <hr>
            <h2>Soldes de Congés Annuels</h2>
            <p>Date: ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Nom de l'Employé</th>
                <th>Matricule</th>
                <th>Total Congés Annuels</th>
                <th>Jours Utilisés</th>
                <th>Jours Restants</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAndSortedBalances.map(balance => `
                <tr class="${balance.joursRestants < 5 ? 'low-balance' : ''}">
                  <td>${balance.nomEmploye}</td>
                  <td>${balance.matricule}</td>
                  <td>${balance.totalCongesAnnuels}</td>
                  <td>${balance.joursUtilises}</td>
                  <td>${balance.joursRestants}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Document généré automatiquement par le système de gestion RH</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
    
    toast.success('Document PDF généré avec succès');
  };

  const lowBalanceEmployees = filteredAndSortedBalances.filter(balance => balance.joursRestants < 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Espace de Calcul - Soldes de Congés</h2>
        <div className="flex gap-2">
          <Button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>

      {lowBalanceEmployees.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription>
            <strong>Attention:</strong> {lowBalanceEmployees.length} employé(s) ont moins de 5 jours de congé restants.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Calcul des Soldes de Congés
              </CardTitle>
              <CardDescription>
                Total: {filteredAndSortedBalances.length} employés
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="text-blue-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom ou matricule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('nomEmploye')}
                  >
                    Nom de l'Employé
                    {sortField === 'nomEmploye' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('matricule')}
                  >
                    Matricule
                    {sortField === 'matricule' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                  <TableHead>Total Congés Annuels</TableHead>
                  <TableHead>Jours Utilisés</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('joursRestants')}
                  >
                    Jours Restants
                    {sortField === 'joursRestants' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedBalances.map((balance) => (
                  <TableRow 
                    key={balance.matricule}
                    className={balance.joursRestants < 5 ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}
                  >
                    <TableCell className="font-medium">{balance.nomEmploye}</TableCell>
                    <TableCell className="font-mono">{balance.matricule}</TableCell>
                    <TableCell className="text-center">{balance.totalCongesAnnuels}</TableCell>
                    <TableCell className="text-center">{balance.joursUtilises}</TableCell>
                    <TableCell className={`text-center font-semibold ${
                      balance.joursRestants < 5 ? 'text-red-600' : 
                      balance.joursRestants < 10 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {balance.joursRestants}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredAndSortedBalances.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun employé trouvé
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveCalculation;
