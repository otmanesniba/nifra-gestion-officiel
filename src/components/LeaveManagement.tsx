import React, { useState, useEffect } from 'react';
import { useLeave } from '../contexts/LeaveContext';
import { useAutoSave } from '../hooks/useAutoSave';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Printer, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

const LeaveManagement = () => {
  const { leaveRequests, addLeaveRequest } = useLeave();
  const { clearSavedData } = useAutoSave({ 
    storageKey: 'leave_form_data',
    delay: 1000,
    debug: true 
  });

  const [activeTab, setActiveTab] = useState('request');
  const [formData, setFormData] = useState({
    nomComplet: '',
    matricule: '',
    carteNationale: '',
    grade: '',
    fonction: '',
    natureCongé: '',
    dateDepart: '',
    dateReprise: '',
    adresse: '',
    observation: ''
  });

  const fonctionOptions = [
    '1° Arrondissement',
    '2° Arrondissement',
    '3° Arrondissement',
    '4° Arrondissement',
    'Archives',
    'Autorité locale',
    'Bureau Communal d\'Hygiène',
    'Bureau d\'ordre',
    'Directeur des services',
    'Gestion déléguée',
    'Province',
    'Service des Affaires Culturelles',
    'Service des Impôts',
    'Service d\'Assiette',
    'Service de Comptabilité',
    'Service de Légalisation',
    'Service des Marchés',
    'Service des espaces verts',
    'Service d\'État Civil',
    'Service d\'Urbanisme',
    'Service de Police Administrative',
    'Service des Ressources Humaines',
    'Service des Ressources Financières',
    'Service des Travaux Communaux',
    'Secrétariat de la Province',
    'Secrétariat du Conseil',
    'Service Contentieux',
    'Urbanisme',
    'Trésorerie Provinciale'
  ];

  const gradeOptions = [
    'Administrateur',
    'Administrateur 1er Gr.',
    'Administrateur Principal (MI)',
    'Adjoint Administratif 1er Gr.',
    'Adjoint Administratif 2e Gr.',
    'Adjoint Administratif Grade Principal',
    'Adjoint Technique 1er Gr.',
    'Adjoint Technique 2e Gr.',
    'Adjoint Technique Grade Principal',
    'Ingénieur en Chef Grade Principal',
    'Ingénieur d\'État 1er Gr.',
    'Ingénieur en Chef 1er Gr.',
    'Médecin Principal',
    'Rédacteur 1er Gr.',
    'Rédacteur 2e Gr.',
    'Rédacteur 3e Gr.',
    'Technicien 1er Gr.',
    'Technicien 2e Gr.',
    'Technicien 3e Gr.',
    'Technicien 3e Gr. stagiaire',
    'Technicien 4e Gr.'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addLeaveRequest(formData);
    toast.success('Demande de congé soumise avec succès');
    setFormData({
      nomComplet: '',
      matricule: '',
      carteNationale: '',
      grade: '',
      fonction: '',
      natureCongé: '',
      dateDepart: '',
      dateReprise: '',
      adresse: '',
      observation: ''
    });
    clearSavedData();
  };

  const handleClearForm = () => {
    setFormData({
      nomComplet: '',
      matricule: '',
      carteNationale: '',
      grade: '',
      fonction: '',
      natureCongé: '',
      dateDepart: '',
      dateReprise: '',
      adresse: '',
      observation: ''
    });
    clearSavedData();
    toast.info('Formulaire et données sauvegardées effacés');
  };

  const generatePDF = (request?: any) => {
    const dataToUse = request || formData;
    
    // Create a professional HTML document for PDF conversion
    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demande de Congé</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 40px;
            background-color: #ffffff;
            color: #333;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #059669;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #059669;
            font-size: 28px;
            margin: 0;
            font-weight: bold;
        }
        .header h2 {
            color: #666;
            font-size: 18px;
            margin: 5px 0 0 0;
            font-weight: normal;
        }
        .form-section {
            margin: 30px 0;
        }
        .form-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            align-items: center;
        }
        .form-field {
            flex: 1;
            margin-right: 20px;
        }
        .form-field:last-child {
            margin-right: 0;
        }
        .label {
            font-weight: bold;
            color: #374151;
            margin-bottom: 5px;
            display: block;
        }
        .value {
            border-bottom: 1px solid #d1d5db;
            padding: 8px 0;
            min-height: 20px;
            color: #1f2937;
        }
        .observation-section {
            margin-top: 25px;
        }
        .observation-value {
            border: 1px solid #d1d5db;
            padding: 15px;
            min-height: 60px;
            background-color: #f9fafb;
        }
        .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            text-align: center;
            width: 200px;
        }
        .signature-line {
            border-bottom: 2px solid #000;
            height: 60px;
            margin: 20px 0 10px 0;
        }
        .date-section {
            margin-top: 40px;
            text-align: right;
        }
        .watermark {
            position: fixed;
            bottom: 20px;
            right: 20px;
            color: #d1d5db;
            font-size: 12px;
        }
        @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>DEMANDE DE CONGÉ</h1>
        <h2>طلب إجازة</h2>
    </div>

    <div class="form-section">
        <div class="form-row">
            <div class="form-field">
                <span class="label">Nom Complet / الاسم الكامل :</span>
                <div class="value">${dataToUse.nomComplet || '_'.repeat(30)}</div>
            </div>
            <div class="form-field">
                <span class="label">Matricule / الرقم الاستدلالي :</span>
                <div class="value">${dataToUse.matricule || '_'.repeat(15)}</div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-field">
                <span class="label">Carte Nationale / البطاقة الوطنية :</span>
                <div class="value">${dataToUse.carteNationale || '_'.repeat(20)}</div>
            </div>
            <div class="form-field">
                <span class="label">Grade / الدرجة :</span>
                <div class="value">${dataToUse.grade || '_'.repeat(20)}</div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-field">
                <span class="label">Fonction / الوظيفة :</span>
                <div class="value">${dataToUse.fonction || '_'.repeat(25)}</div>
            </div>
            <div class="form-field">
                <span class="label">Nature du Congé / نوع الإجازة :</span>
                <div class="value">${dataToUse.natureCongé || '_'.repeat(20)}</div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-field">
                <span class="label">Date de Départ / تاريخ المغادرة :</span>
                <div class="value">${dataToUse.dateDepart || '_'.repeat(15)}</div>
            </div>
            <div class="form-field">
                <span class="label">Date de Reprise / تاريخ الاستئناف :</span>
                <div class="value">${dataToUse.dateReprise || '_'.repeat(15)}</div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-field">
                <span class="label">Adresse pendant le congé / العنوان أثناء الإجازة :</span>
                <div class="value">${dataToUse.adresse || '_'.repeat(40)}</div>
            </div>
        </div>
    </div>

    <div class="observation-section">
        <span class="label">Observations / ملاحظات :</span>
        <div class="observation-value">${dataToUse.observation || 'Aucune observation / لا توجد ملاحظات'}</div>
    </div>

    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line"></div>
            <strong>Signature du Demandeur</strong><br>
            <span style="color: #666;">توقيع المتقدم</span>
        </div>
        <div class="signature-box">
            <div class="signature-line"></div>
            <strong>Signature RH</strong><br>
            <span style="color: #666;">توقيع الموارد البشرية</span>
        </div>
    </div>

    <div class="date-section">
        <strong>Date / التاريخ :</strong> ${new Date().toLocaleDateString('fr-FR')}
    </div>

    <div class="watermark">
        Document généré le ${new Date().toLocaleString('fr-FR')}
    </div>
</body>
</html>`;

    // Create and download the HTML file
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `demande_conge_${dataToUse.matricule || 'nouveau'}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Document PDF téléchargé avec succès');
  };

  const handlePrint = (request?: any) => {
    const dataToUse = request || formData;
    
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #059669; padding-bottom: 20px;">
          <h1 style="color: #059669; font-size: 28px; margin: 0;">DEMANDE DE CONGÉ</h1>
          <h2 style="color: #666; font-size: 18px; margin: 5px 0 0 0;">طلب إجازة</h2>
        </div>
        
        <div style="margin: 30px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <div style="flex: 1; margin-right: 20px;">
              <strong>Nom Complet / الاسم الكامل:</strong><br>
              <div style="border-bottom: 1px solid #ccc; padding: 8px 0; min-height: 20px;">${dataToUse.nomComplet}</div>
            </div>
            <div style="flex: 1;">
              <strong>Matricule / الرقم الاستدلالي:</strong><br>
              <div style="border-bottom: 1px solid #ccc; padding: 8px 0; min-height: 20px;">${dataToUse.matricule}</div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <div style="flex: 1; margin-right: 20px;">
              <strong>Carte Nationale / البطاقة الوطنية:</strong><br>
              <div style="border-bottom: 1px solid #ccc; padding: 8px 0; min-height: 20px;">${dataToUse.carteNationale}</div>
            </div>
            <div style="flex: 1;">
              <strong>Grade / الدرجة:</strong><br>
              <div style="border-bottom: 1px solid #ccc; padding: 8px 0; min-height: 20px;">${dataToUse.grade}</div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <div style="flex: 1; margin-right: 20px;">
              <strong>Fonction / الوظيفة:</strong><br>
              <div style="border-bottom: 1px solid #ccc; padding: 8px 0; min-height: 20px;">${dataToUse.fonction}</div>
            </div>
            <div style="flex: 1;">
              <strong>Nature du Congé / نوع الإجازة:</strong><br>
              <div style="border-bottom: 1px solid #ccc; padding: 8px 0; min-height: 20px;">${dataToUse.natureCongé}</div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <div style="flex: 1; margin-right: 20px;">
              <strong>Date de Départ / تاريخ المغادرة:</strong><br>
              <div style="border-bottom: 1px solid #ccc; padding: 8px 0; min-height: 20px;">${dataToUse.dateDepart}</div>
            </div>
            <div style="flex: 1;">
              <strong>Date de Reprise / تاريخ الاستئناف:</strong><br>
              <div style="border-bottom: 1px solid #ccc; padding: 8px 0; min-height: 20px;">${dataToUse.dateReprise}</div>
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong>Adresse pendant le congé / العنوان أثناء الإجازة:</strong><br>
            <div style="border-bottom: 1px solid #ccc; padding: 8px 0; min-height: 20px;">${dataToUse.adresse}</div>
          </div>
          
          <div style="margin-bottom: 25px;">
            <strong>Observations / ملاحظات:</strong><br>
            <div style="border: 1px solid #ccc; padding: 15px; min-height: 60px; background-color: #f9f9f9;">${dataToUse.observation}</div>
          </div>
        </div>
        
        <div style="margin-top: 50px;">
          <div style="display: flex; justify-content: space-between;">
            <div style="text-align: center; width: 200px;">
              <div style="border-bottom: 2px solid #000; height: 60px; margin: 20px 0 10px 0;"></div>
              <strong>Signature du Demandeur</strong><br>
              <span style="color: #666;">توقيع المتقدم</span>
            </div>
            <div style="text-align: center; width: 200px;">
              <div style="border-bottom: 2px solid #000; height: 60px; margin: 20px 0 10px 0;"></div>
              <strong>Signature RH</strong><br>
              <span style="color: #666;">توقيع الموارد البشرية</span>
            </div>
          </div>
          <div style="margin-top: 40px; text-align: right;">
            <strong>Date / التاريخ:</strong> ${new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Espace Congé</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="request" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Demander un Congé
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Liste des Demandes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-800">Demander un Congé</CardTitle>
              <CardDescription>
                Remplissez le formulaire pour soumettre une demande de congé
                <br />
                <small className="text-blue-600">✓ Sauvegarde automatique activée</small>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomComplet">Nom Complet</Label>
                  <Input
                    id="nomComplet"
                    value={formData.nomComplet}
                    onChange={(e) => setFormData({...formData, nomComplet: e.target.value})}
                    placeholder="Nom complet"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matricule">Matricule</Label>
                  <Input
                    id="matricule"
                    value={formData.matricule}
                    onChange={(e) => setFormData({...formData, matricule: e.target.value})}
                    placeholder="Matricule employé"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carteNationale">Carte Nationale</Label>
                  <Input
                    id="carteNationale"
                    value={formData.carteNationale}
                    onChange={(e) => setFormData({...formData, carteNationale: e.target.value})}
                    placeholder="Numéro de carte nationale"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select value={formData.grade} onValueChange={(value) => setFormData({...formData, grade: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map((grade) => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fonction">Fonction</Label>
                  <Select value={formData.fonction} onValueChange={(value) => setFormData({...formData, fonction: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une fonction" />
                    </SelectTrigger>
                    <SelectContent>
                      {fonctionOptions.map((fonction) => (
                        <SelectItem key={fonction} value={fonction}>{fonction}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="natureCongé">Nature du Congé</Label>
                  <Select value={formData.natureCongé} onValueChange={(value) => setFormData({...formData, natureCongé: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type de congé" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annuel">Congé Annuel</SelectItem>
                      <SelectItem value="maladie">Congé de Maladie</SelectItem>
                      <SelectItem value="maternité">Congé de Maternité</SelectItem>
                      <SelectItem value="paternité">Congé de Paternité</SelectItem>
                      <SelectItem value="exceptionnel">Congé Exceptionnel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateDepart">Date de Départ</Label>
                  <Input
                    type="date"
                    id="dateDepart"
                    value={formData.dateDepart}
                    onChange={(e) => setFormData({...formData, dateDepart: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateReprise">Date de Reprise</Label>
                  <Input
                    type="date"
                    id="dateReprise"
                    value={formData.dateReprise}
                    onChange={(e) => setFormData({...formData, dateReprise: e.target.value})}
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="adresse">Adresse pendant le congé</Label>
                  <Input
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                    placeholder="Adresse complète"
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="observation">Observation</Label>
                  <Textarea
                    id="observation"
                    value={formData.observation}
                    onChange={(e) => setFormData({...formData, observation: e.target.value})}
                    placeholder="Observations supplémentaires"
                  />
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    Soumettre la demande
                  </Button>
                  <Button type="button" onClick={() => generatePDF()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4" />
                    PDF
                  </Button>
                  <Button type="button" onClick={() => handlePrint()} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700">
                    <Printer className="w-4 h-4" />
                    Imprimer
                  </Button>
                  <Button type="button" onClick={handleClearForm} className="flex items-center gap-2 bg-red-600 hover:bg-red-700">
                    <Trash2 className="w-4 h-4" />
                    Effacer
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">Liste des Demandes de Congé</CardTitle>
              <CardDescription>Total: {leaveRequests.length} demandes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom Complet</TableHead>
                      <TableHead>Matricule</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Fonction</TableHead>
                      <TableHead>Nature du Congé</TableHead>
                      <TableHead>Date Départ</TableHead>
                      <TableHead>Date Reprise</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.nomComplet}</TableCell>
                        <TableCell className="font-mono">{request.matricule}</TableCell>
                        <TableCell>{request.grade}</TableCell>
                        <TableCell>{request.fonction}</TableCell>
                        <TableCell>{request.natureCongé}</TableCell>
                        <TableCell>{request.dateDepart}</TableCell>
                        <TableCell>{request.dateReprise}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status === 'approved' ? 'Approuvé' :
                             request.status === 'rejected' ? 'Rejeté' : 'En attente'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" onClick={() => generatePDF(request)} className="bg-blue-600 hover:bg-blue-700">
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button size="sm" onClick={() => handlePrint(request)} className="bg-gray-600 hover:bg-gray-700">
                              <Printer className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaveManagement;
