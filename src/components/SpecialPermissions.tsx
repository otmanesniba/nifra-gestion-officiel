
import React, { useState } from 'react';
import { useEmployees } from '../contexts/EmployeeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Printer, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

interface SpecialPermission {
  id: string;
  nomComplet: string;
  matricule: string;
  carteNationale: string;
  grade: string;
  service: string;
  motif: string;
  duree: string;
  typeDuree: 'heures' | 'jours';
  dateDebut: string;
  heureDebut: string;
  heureFin: string;
  dateCreation: string;
}

const SpecialPermissions = () => {
  const { getEmployeeByMatricule } = useEmployees();
  const [permissions, setPermissions] = useState<SpecialPermission[]>([]);
  
  const [permissionForm, setPermissionForm] = useState({
    nomComplet: '',
    matricule: '',
    carteNationale: '',
    grade: '',
    service: '',
    motif: '',
    duree: '',
    typeDuree: 'heures' as 'heures' | 'jours',
    dateDebut: '',
    heureDebut: '',
    heureFin: ''
  });

  const handleMatriculeChange = (matricule: string) => {
    const employee = getEmployeeByMatricule(matricule);
    if (employee) {
      setPermissionForm({
        ...permissionForm,
        matricule,
        nomComplet: `${employee.prenom} ${employee.nom}`,
        carteNationale: employee.carteNationale,
        grade: employee.grade,
        service: employee.service
      });
    } else {
      setPermissionForm({
        ...permissionForm,
        matricule,
        nomComplet: '',
        carteNationale: '',
        grade: '',
        service: ''
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!getEmployeeByMatricule(permissionForm.matricule)) {
      toast.error('Matricule invalide. Employé non trouvé.');
      return;
    }

    const newPermission: SpecialPermission = {
      ...permissionForm,
      id: Date.now().toString(),
      dateCreation: new Date().toISOString().split('T')[0]
    };

    setPermissions(prev => [...prev, newPermission]);
    toast.success('Autorisation spéciale enregistrée avec succès');
    
    // Reset form
    setPermissionForm({
      nomComplet: '',
      matricule: '',
      carteNationale: '',
      grade: '',
      service: '',
      motif: '',
      duree: '',
      typeDuree: 'heures',
      dateDebut: '',
      heureDebut: '',
      heureFin: ''
    });
  };

  const generateDocument = (permission: SpecialPermission) => {
    const docContent = `
ROYAUME DU MAROC                                                    المملكة المغربية
MINISTÈRE DE L'INTÉRIEUR                                             وزارة الداخلية
RÉGION BENI MELLAL-KHENIFRA                                    جهة بني ملال - خنيفرة
PROVINCE DE KHENIFRA                                               إقليم خنيفرة
COMMUNE DE KHENIFRA                                               جماعة خنيفرة

═══════════════════════════════════════════════════════════════════════════════

                            AUTORISATION SPÉCIALE
                              إذن خاص

═══════════════════════════════════════════════════════════════════════════════

INFORMATIONS PERSONNELLES / المعلومات الشخصية
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nom complet / الاسم الكامل: ${permission.nomComplet}
Matricule / رقم التأجير: ${permission.matricule}
Carte Nationale / البطاقة الوطنية: ${permission.carteNationale}
Grade / الرتبة: ${permission.grade}
Service / الخدمة: ${permission.service}

DÉTAILS DE L'AUTORISATION / تفاصيل الإذن
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Motif / السبب: ${permission.motif}
Durée / المدة: ${permission.duree} ${permission.typeDuree === 'heures' ? 'heures / ساعات' : 'jours / أيام'}
Date / التاريخ: ${permission.dateDebut}
${permission.heureDebut ? `Heure de début / ساعة البداية: ${permission.heureDebut}` : ''}
${permission.heureFin ? `Heure de fin / ساعة النهاية: ${permission.heureFin}` : ''}

═══════════════════════════════════════════════════════════════════════════════

Date de la demande / تاريخ الطلب: ${permission.dateCreation}

SIGNATURES / التوقيعات
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Signature du demandeur / توقيع المطالب:
_________________________________


Date: _______________ Signature: ___________________


Signature RH / توقيع الموارد البشرية:
_________________________________


Date: _______________ Signature: ___________________


OBSERVATIONS / ملاحظات:
____________________________________________________________________________
____________________________________________________________________________
____________________________________________________________________________

═══════════════════════════════════════════════════════════════════════════════
    `;

    const blob = new Blob([docContent], { type: 'application/pdf;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `autorisation_speciale_${permission.matricule}_${permission.dateCreation}.pdf`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Autorisation spéciale téléchargée en PDF avec succès');
  };

  const printPermission = (permission: SpecialPermission) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Autorisation Spéciale - ${permission.matricule}</title>
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
              AUTORISATION SPÉCIALE<br>
              <span style="font-size: 16px;">إذن خاص</span>
            </div>
            
            <div class="content">
              <div class="section-title">INFORMATIONS PERSONNELLES / المعلومات الشخصية</div>
              
              <div class="field">
                <strong>Nom complet / الاسم الكامل:</strong>
                <span>${permission.nomComplet}</span>
              </div>
              <div class="field">
                <strong>Matricule / رقم التأجير:</strong>
                <span>${permission.matricule}</span>
              </div>
              <div class="field">
                <strong>Carte Nationale / البطاقة الوطنية:</strong>
                <span>${permission.carteNationale}</span>
              </div>
              <div class="field">
                <strong>Grade / الرتبة:</strong>
                <span>${permission.grade}</span>
              </div>
              <div class="field">
                <strong>Service / الخدمة:</strong>
                <span>${permission.service}</span>
              </div>
              
              <div class="section-title">DÉTAILS DE L'AUTORISATION / تفاصيل الإذن</div>
              
              <div class="field">
                <strong>Motif / السبب:</strong>
                <span>${permission.motif}</span>
              </div>
              <div class="field">
                <strong>Durée / المدة:</strong>
                <span>${permission.duree} ${permission.typeDuree === 'heures' ? 'heures / ساعات' : 'jours / أيام'}</span>
              </div>
              <div class="field">
                <strong>Date / التاريخ:</strong>
                <span>${permission.dateDebut}</span>
              </div>
              ${permission.heureDebut ? `
                <div class="field">
                  <strong>Heure de début / ساعة البداية:</strong>
                  <span>${permission.heureDebut}</span>
                </div>
              ` : ''}
              ${permission.heureFin ? `
                <div class="field">
                  <strong>Heure de fin / ساعة النهاية:</strong>
                  <span>${permission.heureFin}</span>
                </div>
              ` : ''}
              
              <div style="margin-top: 30px; text-align: center;">
                <strong>Date de la demande / تاريخ الطلب: ${permission.dateCreation}</strong>
              </div>
              
              <div class="section-title">OBSERVATIONS / ملاحظات</div>
              <div class="observations-box">
                Espace réservé aux observations / مساحة مخصصة للملاحظات
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
    toast.success('Autorisation spéciale envoyée à l\'imprimante');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Autorisation Spéciale</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Nouvelle Autorisation
            </CardTitle>
            <CardDescription>
              Formulaire pour les permissions de courte durée
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="matricule">Matricule</Label>
                <Input
                  id="matricule"
                  value={permissionForm.matricule}
                  onChange={(e) => handleMatriculeChange(e.target.value)}
                  placeholder="Saisissez le matricule"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomComplet">Nom Complet</Label>
                <Input
                  id="nomComplet"
                  value={permissionForm.nomComplet}
                  onChange={(e) => setPermissionForm({...permissionForm, nomComplet: e.target.value})}
                  placeholder="Nom complet"
                  required
                  readOnly={!!getEmployeeByMatricule(permissionForm.matricule)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="carteNationale">Carte Nationale</Label>
                  <Input
                    id="carteNationale"
                    value={permissionForm.carteNationale}
                    onChange={(e) => setPermissionForm({...permissionForm, carteNationale: e.target.value})}
                    placeholder="CIN"
                    required
                    readOnly={!!getEmployeeByMatricule(permissionForm.matricule)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    value={permissionForm.grade}
                    onChange={(e) => setPermissionForm({...permissionForm, grade: e.target.value})}
                    placeholder="Grade"
                    required
                    readOnly={!!getEmployeeByMatricule(permissionForm.matricule)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Input
                  id="service"
                  value={permissionForm.service}
                  onChange={(e) => setPermissionForm({...permissionForm, service: e.target.value})}
                  placeholder="Service"
                  required
                  readOnly={!!getEmployeeByMatricule(permissionForm.matricule)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motif">Motif de l'autorisation</Label>
                <Textarea
                  id="motif"
                  value={permissionForm.motif}
                  onChange={(e) => setPermissionForm({...permissionForm, motif: e.target.value})}
                  placeholder="Raison de la demande d'autorisation"
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="duree">Durée</Label>
                  <Input
                    id="duree"
                    type="number"
                    min="1"
                    value={permissionForm.duree}
                    onChange={(e) => setPermissionForm({...permissionForm, duree: e.target.value})}
                    placeholder="Nombre"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="typeDuree">Type</Label>
                  <Select value={permissionForm.typeDuree} onValueChange={(value: 'heures' | 'jours') => setPermissionForm({...permissionForm, typeDuree: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="heures">Heures</SelectItem>
                      <SelectItem value="jours">Jours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateDebut">Date</Label>
                <Input
                  id="dateDebut"
                  type="date"
                  value={permissionForm.dateDebut}
                  onChange={(e) => setPermissionForm({...permissionForm, dateDebut: e.target.value})}
                  required
                />
              </div>

              {permissionForm.typeDuree === 'heures' && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="heureDebut">Heure de début</Label>
                    <Input
                      id="heureDebut"
                      type="time"
                      value={permissionForm.heureDebut}
                      onChange={(e) => setPermissionForm({...permissionForm, heureDebut: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heureFin">Heure de fin</Label>
                    <Input
                      id="heureFin"
                      type="time"
                      value={permissionForm.heureFin}
                      onChange={(e) => setPermissionForm({...permissionForm, heureFin: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Enregistrer l'Autorisation
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Permissions List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-800">Autorisations Enregistrées</CardTitle>
            <CardDescription>
              Liste des permissions accordées ({permissions.length} autorisations)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {permissions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucune autorisation enregistrée</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {permissions.map((permission) => (
                  <div key={permission.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-sm">{permission.nomComplet}</p>
                        <p className="text-xs text-gray-600">Mat: {permission.matricule}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          onClick={() => generateDocument(permission)}
                          className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => printPermission(permission)}
                          className="text-xs px-2 py-1"
                        >
                          <Printer className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs space-y-1">
                      <p><strong>Motif:</strong> {permission.motif}</p>
                      <p><strong>Durée:</strong> {permission.duree} {permission.typeDuree}</p>
                      <p><strong>Date:</strong> {permission.dateDebut}</p>
                      {permission.heureDebut && (
                        <p><strong>Horaire:</strong> {permission.heureDebut} - {permission.heureFin}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpecialPermissions;
