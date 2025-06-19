
import React, { useState } from 'react';
import { useEmployees } from '../contexts/EmployeeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Download, Printer, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface LeaveRequest {
  id: string;
  nomComplet: string;
  matricule: string;
  carteNationale: string;
  grade: string;
  affectation: string;
  natureCongé: string;
  dateDepart: string;
  dateReprise: string;
  adresse: string;
  observation: string;
  dateCreation: string;
}

const LeaveManagement = () => {
  const { getEmployeeByMatricule } = useEmployees();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [activeTab, setActiveTab] = useState('request');
  
  const [leaveForm, setLeaveForm] = useState({
    nomComplet: '',
    matricule: '',
    carteNationale: '',
    grade: '',
    affectation: '',
    natureCongé: '',
    dateDepart: '',
    dateReprise: '',
    adresse: '',
    observation: ''
  });

  const handleMatriculeChange = (matricule: string) => {
    const employee = getEmployeeByMatricule(matricule);
    if (employee) {
      setLeaveForm({
        ...leaveForm,
        matricule,
        nomComplet: `${employee.prenom} ${employee.nom}`,
        carteNationale: employee.carteNationale,
        grade: employee.grade,
        affectation: employee.service
      });
    } else {
      setLeaveForm({
        ...leaveForm,
        matricule,
        nomComplet: '',
        carteNationale: '',
        grade: '',
        affectation: ''
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!getEmployeeByMatricule(leaveForm.matricule)) {
      toast.error('Matricule invalide. Employé non trouvé.');
      return;
    }

    const newRequest: LeaveRequest = {
      ...leaveForm,
      id: Date.now().toString(),
      dateCreation: new Date().toISOString().split('T')[0]
    };

    setLeaveRequests(prev => [...prev, newRequest]);
    toast.success('Demande de congé enregistrée avec succès');
    
    // Reset form
    setLeaveForm({
      nomComplet: '',
      matricule: '',
      carteNationale: '',
      grade: '',
      affectation: '',
      natureCongé: '',
      dateDepart: '',
      dateReprise: '',
      adresse: '',
      observation: ''
    });
  };

  const generatePDF = (request: LeaveRequest) => {
    const pdfContent = `
ROYAUME DU MAROC
MINISTÈRE DE L'INTÉRIEUR
RÉGION BENI MELLAL-KHENIFRA
PROVINCE DE KHENIFRA
COMMUNE DE KHENIFRA

DEMANDE DE CONGÉ ADMINISTRATIF

Nom complet: ${request.nomComplet}
Matricule: ${request.matricule}
Carte Nationale: ${request.carteNationale}
Grade: ${request.grade}
Affectation: ${request.affectation}

Nature du congé: ${request.natureCongé}
Date de départ: ${request.dateDepart}
Date de reprise: ${request.dateReprise}

Adresse pendant le congé: ${request.adresse}

Observations: ${request.observation}

Date de la demande: ${request.dateCreation}
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `conge_${request.matricule}_${request.dateCreation}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Document généré avec succès');
  };

  const printRequest = (request: LeaveRequest) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Demande de Congé - ${request.matricule}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .content { line-height: 1.6; }
              .field { margin-bottom: 10px; }
              .signature { margin-top: 50px; display: flex; justify-content: space-between; }
            </style>
          </head>
          <body>
            <div class="header">
              <h3>ROYAUME DU MAROC</h3>
              <h3>MINISTÈRE DE L'INTÉRIEUR</h3>
              <h3>RÉGION BENI MELLAL-KHENIFRA</h3>
              <h3>PROVINCE DE KHENIFRA</h3>
              <h3>COMMUNE DE KHENIFRA</h3>
              <hr>
              <h2>DEMANDE DE CONGÉ ADMINISTRATIF</h2>
            </div>
            <div class="content">
              <div class="field"><strong>Nom complet:</strong> ${request.nomComplet}</div>
              <div class="field"><strong>Matricule:</strong> ${request.matricule}</div>
              <div class="field"><strong>Carte Nationale:</strong> ${request.carteNationale}</div>
              <div class="field"><strong>Grade:</strong> ${request.grade}</div>
              <div class="field"><strong>Affectation:</strong> ${request.affectation}</div>
              <br>
              <div class="field"><strong>Nature du congé:</strong> ${request.natureCongé}</div>
              <div class="field"><strong>Date de départ:</strong> ${request.dateDepart}</div>
              <div class="field"><strong>Date de reprise:</strong> ${request.dateReprise}</div>
              <br>
              <div class="field"><strong>Adresse pendant le congé:</strong> ${request.adresse}</div>
              <br>
              <div class="field"><strong>Observations:</strong> ${request.observation}</div>
              <br>
              <div class="field"><strong>Date de la demande:</strong> ${request.dateCreation}</div>
            </div>
            <div class="signature">
              <div>Signature du demandeur</div>
              <div>Visa du chef de service</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    toast.success('Document envoyé à l\'imprimante');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Espace Congé</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="request" className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Demander un Congé
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Congés et Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">Demande de Congé Administratif</CardTitle>
              <CardDescription>
                Remplissez ce formulaire pour soumettre une demande de congé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Bilingual Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* French Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Informations (Français)
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="matricule">Matricule</Label>
                      <Input
                        id="matricule"
                        value={leaveForm.matricule}
                        onChange={(e) => handleMatriculeChange(e.target.value)}
                        placeholder="Saisissez le matricule"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nomComplet">Nom Complet</Label>
                      <Input
                        id="nomComplet"
                        value={leaveForm.nomComplet}
                        onChange={(e) => setLeaveForm({...leaveForm, nomComplet: e.target.value})}
                        placeholder="Nom complet"
                        required
                        readOnly={!!getEmployeeByMatricule(leaveForm.matricule)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="carteNationale">Carte Nationale</Label>
                      <Input
                        id="carteNationale"
                        value={leaveForm.carteNationale}
                        onChange={(e) => setLeaveForm({...leaveForm, carteNationale: e.target.value})}
                        placeholder="Numéro de carte nationale"
                        required
                        readOnly={!!getEmployeeByMatricule(leaveForm.matricule)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade</Label>
                      <Input
                        id="grade"
                        value={leaveForm.grade}
                        onChange={(e) => setLeaveForm({...leaveForm, grade: e.target.value})}
                        placeholder="Grade"
                        required
                        readOnly={!!getEmployeeByMatricule(leaveForm.matricule)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="affectation">Affectation</Label>
                      <Input
                        id="affectation"
                        value={leaveForm.affectation}
                        onChange={(e) => setLeaveForm({...leaveForm, affectation: e.target.value})}
                        placeholder="Service d'affectation"
                        required
                        readOnly={!!getEmployeeByMatricule(leaveForm.matricule)}
                      />
                    </div>
                  </div>

                  {/* Arabic Section */}
                  <div className="space-y-4" dir="rtl">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      المعلومات (العربية)
                    </h3>
                    
                    <div className="space-y-2">
                      <Label>رقم التأجير</Label>
                      <Input value={leaveForm.matricule} readOnly className="text-right" />
                    </div>

                    <div className="space-y-2">
                      <Label>الاسم الكامل</Label>
                      <Input value={leaveForm.nomComplet} readOnly className="text-right" />
                    </div>

                    <div className="space-y-2">
                      <Label>البطاقة الوطنية</Label>
                      <Input value={leaveForm.carteNationale} readOnly className="text-right" />
                    </div>

                    <div className="space-y-2">
                      <Label>الرتبة</Label>
                      <Input value={leaveForm.grade} readOnly className="text-right" />
                    </div>

                    <div className="space-y-2">
                      <Label>التخصيص</Label>
                      <Input value={leaveForm.affectation} readOnly className="text-right" />
                    </div>
                  </div>
                </div>

                {/* Leave Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="natureCongé">Nature du Congé</Label>
                    <Select value={leaveForm.natureCongé} onValueChange={(value) => setLeaveForm({...leaveForm, natureCongé: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type de congé" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conge-annuel">Congé Annuel</SelectItem>
                        <SelectItem value="conge-maladie">Congé Maladie</SelectItem>
                        <SelectItem value="conge-maternite">Congé Maternité</SelectItem>
                        <SelectItem value="conge-exceptionnel">Congé Exceptionnel</SelectItem>
                        <SelectItem value="permission">Permission</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateDepart">Date de Départ</Label>
                    <Input
                      id="dateDepart"
                      type="date"
                      value={leaveForm.dateDepart}
                      onChange={(e) => setLeaveForm({...leaveForm, dateDepart: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateReprise">Date de Reprise</Label>
                    <Input
                      id="dateReprise"
                      type="date"
                      value={leaveForm.dateReprise}
                      onChange={(e) => setLeaveForm({...leaveForm, dateReprise: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input
                      id="adresse"
                      value={leaveForm.adresse}
                      onChange={(e) => setLeaveForm({...leaveForm, adresse: e.target.value})}
                      placeholder="Adresse pendant le congé"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observation">Observation</Label>
                  <Textarea
                    id="observation"
                    value={leaveForm.observation}
                    onChange={(e) => setLeaveForm({...leaveForm, observation: e.target.value})}
                    placeholder="Observations ou remarques"
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Soumettre la Demande
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">Congés et Permissions</CardTitle>
              <CardDescription>Liste des demandes de congés soumises</CardDescription>
            </CardHeader>
            <CardContent>
              {leaveRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune demande de congé enregistrée</p>
              ) : (
                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="font-semibold">{request.nomComplet}</p>
                          <p className="text-sm text-gray-600">Matricule: {request.matricule}</p>
                        </div>
                        <div>
                          <p className="text-sm"><strong>Type:</strong> {request.natureCongé}</p>
                          <p className="text-sm"><strong>Du:</strong> {request.dateDepart} <strong>Au:</strong> {request.dateReprise}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => generatePDF(request)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            PDF
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => printRequest(request)}
                          >
                            <Printer className="w-4 h-4 mr-1" />
                            Imprimer
                          </Button>
                        </div>
                      </div>
                      {request.observation && (
                        <p className="text-sm text-gray-600 italic">Observations: {request.observation}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaveManagement;
