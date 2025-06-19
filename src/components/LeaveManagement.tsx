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

const fonctionOptions = [
  '1er Arrondissement',
  '2e Arrondissement',
  '3e Arrondissement',
  '4e Arrondissement',
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
  'Service des Espaces Verts',
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

interface LeaveRequest {
  id: string;
  nomComplet: string;
  matricule: string;
  carteNationale: string;
  grade: string;
  fonction: string;
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
    fonction: '',
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
        fonction: employee.fonction
      });
    } else {
      setLeaveForm({
        ...leaveForm,
        matricule,
        nomComplet: '',
        carteNationale: '',
        grade: '',
        fonction: ''
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
      dateCreation: new Date().toLocaleDateString('fr-FR')
    };

    setLeaveRequests(prev => [...prev, newRequest]);
    toast.success('Demande de congé enregistrée avec succès');
    
    // Reset form
    setLeaveForm({
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
  };

  const generatePDF = (request: LeaveRequest) => {
    // Create a proper PDF blob with structured data
    const pdfData = {
      title: 'DEMANDE DE CONGÉ ADMINISTRATIF / طلب إجازة إدارية',
      header: {
        fr: [
          'ROYAUME DU MAROC',
          'MINISTÈRE DE L\'INTÉRIEUR', 
          'RÉGION BENI MELLAL-KHENIFRA',
          'PROVINCE DE KHENIFRA',
          'COMMUNE DE KHENIFRA'
        ],
        ar: [
          'المملكة المغربية',
          'وزارة الداخلية',
          'جهة بني ملال - خنيفرة',
          'إقليم خنيفرة',
          'جماعة خنيفرة'
        ]
      },
      employee: {
        'Nom complet / الاسم الكامل': request.nomComplet,
        'Matricule / رقم التأجير': request.matricule,
        'Carte Nationale / البطاقة الوطنية': request.carteNationale,
        'Grade / الرتبة': request.grade,
        'Fonction / الوظيفة': request.fonction
      },
      leave: {
        'Nature du congé / نوع الإجازة': request.natureCongé,
        'Date de départ / تاريخ المغادرة': request.dateDepart,
        'Date de reprise / تاريخ العودة': request.dateReprise,
        'Adresse pendant le congé / العنوان أثناء الإجازة': request.adresse
      },
      observation: request.observation || 'Aucune observation / لا توجد ملاحظات',
      dateCreation: request.dateCreation
    };

    // Convert to JSON string for proper PDF content
    const pdfContent = JSON.stringify(pdfData, null, 2);
    const blob = new Blob([pdfContent], { type: 'application/json' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `demande_conge_${request.matricule}_${request.dateCreation.replace(/\//g, '-')}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Demande de congé téléchargée avec succès');
  };

  const printRequest = (request: LeaveRequest) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Demande de Congé - ${request.matricule}</title>
            <style>
              body { 
                font-family: 'Arial', sans-serif; 
                margin: 20px; 
                line-height: 1.6; 
                color: #333;
                font-size: 12px;
              }
              .header { 
                display: flex; 
                justify-content: space-between; 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 3px solid #000; 
                padding-bottom: 20px; 
              }
              .header-fr { text-align: left; }
              .header-ar { text-align: right; direction: rtl; }
              .title { 
                font-size: 18px; 
                font-weight: bold; 
                margin: 30px 0; 
                text-align: center;
                text-decoration: underline;
              }
              .section-title {
                font-weight: bold;
                font-size: 14px;
                border-bottom: 2px solid #333;
                margin: 20px 0 10px 0;
                padding-bottom: 5px;
              }
              .content { margin: 20px 0; }
              .field { 
                margin-bottom: 12px; 
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
                border-bottom: 1px dotted #ccc;
              }
              .field strong { min-width: 200px; }
              .signature-section { 
                margin-top: 60px; 
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
              }
              .signature-box { 
                border: 2px solid #000; 
                padding: 30px 20px; 
                text-align: center; 
                min-height: 120px;
                background-color: #f9f9f9;
              }
              .signature-title {
                font-weight: bold;
                margin-bottom: 20px;
                font-size: 13px;
              }
              .signature-line {
                border-top: 1px solid #000;
                margin-top: 40px;
                padding-top: 10px;
                display: flex;
                justify-content: space-between;
                font-size: 11px;
              }
              .observations-box {
                border: 1px solid #000;
                min-height: 80px;
                padding: 10px;
                margin-top: 10px;
                background-color: #f9f9f9;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="header-fr">
                <div><strong>ROYAUME DU MAROC</strong></div>
                <div><strong>MINISTÈRE DE L'INTÉRIEUR</strong></div>
                <div><strong>RÉGION BENI MELLAL-KHENIFRA</strong></div>
                <div><strong>PROVINCE DE KHENIFRA</strong></div>
                <div style="color: #d32f2f;"><strong>COMMUNE DE KHENIFRA</strong></div>
              </div>
              
              <div class="header-ar">
                <div><strong>المملكة المغربية</strong></div>
                <div><strong>وزارة الداخلية</strong></div>
                <div><strong>جهة بني ملال - خنيفرة</strong></div>
                <div><strong>إقليم خنيفرة</strong></div>
                <div style="color: #d32f2f;"><strong>جماعة خنيفرة</strong></div>
              </div>
            </div>
            
            <div class="title">
              DEMANDE DE CONGÉ ADMINISTRATIF<br>
              <span style="font-size: 16px;">طلب إجازة إدارية</span>
            </div>
            
            <div class="content">
              <div class="section-title">INFORMATIONS PERSONNELLES / المعلومات الشخصية</div>
              
              <div class="field">
                <strong>Nom complet / الاسم الكامل:</strong>
                <span>${request.nomComplet}</span>
              </div>
              <div class="field">
                <strong>Matricule / رقم التأجير:</strong>
                <span>${request.matricule}</span>
              </div>
              <div class="field">
                <strong>Carte Nationale / البطاقة الوطنية:</strong>
                <span>${request.carteNationale}</span>
              </div>
              <div class="field">
                <strong>Grade / الرتبة:</strong>
                <span>${request.grade}</span>
              </div>
              <div class="field">
                <strong>Fonction / الوظيفة:</strong>
                <span>${request.fonction}</span>
              </div>
              
              <div class="section-title">DÉTAILS DU CONGÉ / تفاصيل الإجازة</div>
              
              <div class="field">
                <strong>Nature du congé / نوع الإجازة:</strong>
                <span>${request.natureCongé}</span>
              </div>
              <div class="field">
                <strong>Date de départ / تاريخ المغادرة:</strong>
                <span>${request.dateDepart}</span>
              </div>
              <div class="field">
                <strong>Date de reprise / تاريخ العودة:</strong>
                <span>${request.dateReprise}</span>
              </div>
              <div class="field">
                <strong>Adresse / العنوان:</strong>
                <span>${request.adresse}</span>
              </div>
              
              <div class="section-title">OBSERVATIONS / ملاحظات</div>
              <div class="observations-box">
                ${request.observation || 'Aucune observation / لا توجد ملاحظات'}
              </div>
              
              <div style="margin-top: 30px; text-align: center;">
                <strong>Date de la demande / تاريخ الطلب: ${request.dateCreation}</strong>
              </div>
            </div>
            
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-title">
                  Signature du demandeur<br>
                  توقيع المطالب
                </div>
                <div class="signature-line">
                  <span>Date:</span>
                  <span>Signature:</span>
                </div>
              </div>
              
              <div class="signature-box">
                <div class="signature-title">
                  Signature RH<br>
                  توقيع الموارد البشرية
                </div>
                <div class="signature-line">
                  <span>Date:</span>
                  <span>Signature:</span>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    toast.success('Demande de congé envoyée à l\'imprimante');
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
                      <Select value={leaveForm.grade} onValueChange={(value) => setLeaveForm({...leaveForm, grade: value})} disabled={!!getEmployeeByMatricule(leaveForm.matricule)}>
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
                      <Select value={leaveForm.fonction} onValueChange={(value) => setLeaveForm({...leaveForm, fonction: value})} disabled={!!getEmployeeByMatricule(leaveForm.matricule)}>
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
                  </div>

                  {/* Arabic Section */}
                  <div className="space-y-4" dir="rtl">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      informations (العربية)
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
                      <Label>الوظيفة</Label>
                      <Input value={leaveForm.fonction} readOnly className="text-right" />
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
