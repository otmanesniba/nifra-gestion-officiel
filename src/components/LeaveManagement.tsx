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
    
    const pdfContent = `DEMANDE DE CONGÉ / طلب إجازة

Nom Complet / الاسم الكامل: ${dataToUse.nomComplet}
Matricule / الرقم الاستدلالي: ${dataToUse.matricule}
Carte Nationale / البطاقة الوطنية: ${dataToUse.carteNationale}
Grade / الدرجة: ${dataToUse.grade}
Fonction / الوظيفة: ${dataToUse.fonction}
Nature du Congé / نوع الإجازة: ${dataToUse.natureCongé}
Date de Départ / تاريخ المغادرة: ${dataToUse.dateDepart}
Date de Reprise / تاريخ الاستئناف: ${dataToUse.dateReprise}
Adresse / العنوان: ${dataToUse.adresse}
Observation / ملاحظة: ${dataToUse.observation}

Signature du Demandeur / توقيع المتقدم: ____________________

Signature RH / توقيع الموارد البشرية: ____________________

Date / التاريخ: ${new Date().toLocaleDateString('fr-FR')}`;

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `demande_conge_${dataToUse.matricule || 'new'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Document téléchargé avec succès');
  };

  const handlePrint = (request?: any) => {
    const dataToUse = request || formData;
    
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
        <h1 style="text-align: center; color: #059669; margin-bottom: 30px;">
          DEMANDE DE CONGÉ<br>
          <span style="font-size: 0.8em; color: #666;">طلب إجازة</span>
        </h1>
        
        <div style="margin-bottom: 20px;">
          <strong>Nom Complet / الاسم الكامل:</strong> ${dataToUse.nomComplet}<br>
          <strong>Matricule / الرقم الاستدلالي:</strong> ${dataToUse.matricule}<br>
          <strong>Carte Nationale / البطاقة الوطنية:</strong> ${dataToUse.carteNationale}<br>
          <strong>Grade / الدرجة:</strong> ${dataToUse.grade}<br>
          <strong>Fonction / الوظيفة:</strong> ${dataToUse.fonction}<br>
          <strong>Nature du Congé / نوع الإجازة:</strong> ${dataToUse.natureCongé}<br>
          <strong>Date de Départ / تاريخ المغادرة:</strong> ${dataToUse.dateDepart}<br>
          <strong>Date de Reprise / تاريخ الاستئناف:</strong> ${dataToUse.dateReprise}<br>
          <strong>Adresse / العنوان:</strong> ${dataToUse.adresse}<br>
          <strong>Observation / ملاحظة:</strong> ${dataToUse.observation}
        </div>
        
        <div style="margin-top: 40px;">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <p><strong>Signature du Demandeur / توقيع المتقدم:</strong></p>
              <div style="border-bottom: 1px solid #000; width: 200px; height: 40px;"></div>
            </div>
            <div>
              <p><strong>Signature RH / توقيع الموارد البشرية:</strong></p>
              <div style="border-bottom: 1px solid #000; width: 200px; height: 40px;"></div>
            </div>
          </div>
          <p style="margin-top: 20px;"><strong>Date / التاريخ:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
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
