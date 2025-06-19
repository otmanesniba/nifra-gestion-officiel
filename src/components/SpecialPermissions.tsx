
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
ROYAUME DU MAROC
MINISTÈRE DE L'INTÉRIEUR
RÉGION BENI MELLAL-KHENIFRA
PROVINCE DE KHENIFRA
COMMUNE DE KHENIFRA

AUTORISATION SPÉCIALE

Nom complet: ${permission.nomComplet}
Matricule: ${permission.matricule}
Carte Nationale: ${permission.carteNationale}
Grade: ${permission.grade}
Service: ${permission.service}

DÉTAILS DE L'AUTORISATION:
Motif: ${permission.motif}
Durée: ${permission.duree} ${permission.typeDuree}
Date: ${permission.dateDebut}
${permission.heureDebut ? `Heure de début: ${permission.heureDebut}` : ''}
${permission.heureFin ? `Heure de fin: ${permission.heureFin}` : ''}

Date de la demande: ${permission.dateCreation}

Signature du demandeur: ____________________

Visa du chef de service: ____________________

Observations: ________________________________
____________________________________________
    `;

    const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `autorisation_${permission.matricule}_${permission.dateCreation}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Document téléchargé avec succès');
  };

  const printPermission = (permission: SpecialPermission) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Autorisation Spéciale - ${permission.matricule}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
              .content { margin: 20px 0; }
              .field { margin-bottom: 15px; }
              .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
              .signature-box { border: 1px solid #000; padding: 40px 20px; text-align: center; width: 200px; }
              .title { font-size: 20px; font-weight: bold; margin: 20px 0; text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <h3>ROYAUME DU MAROC</h3>
              <h3>MINISTÈRE DE L'INTÉRIEUR</h3>
              <h3>RÉGION BENI MELLAL-KHENIFRA</h3>
              <h3>PROVINCE DE KHENIFRA</h3>
              <h3>COMMUNE DE KHENIFRA</h3>
            </div>
            
            <div class="title">AUTORISATION SPÉCIALE</div>
            
            <div class="content">
              <div class="field"><strong>Nom complet:</strong> ${permission.nomComplet}</div>
              <div class="field"><strong>Matricule:</strong> ${permission.matricule}</div>
              <div class="field"><strong>Carte Nationale:</strong> ${permission.carteNationale}</div>
              <div class="field"><strong>Grade:</strong> ${permission.grade}</div>
              <div class="field"><strong>Service:</strong> ${permission.service}</div>
              
              <hr style="margin: 30px 0;">
              
              <div class="field"><strong>Motif de l'autorisation:</strong> ${permission.motif}</div>
              <div class="field"><strong>Durée:</strong> ${permission.duree} ${permission.typeDuree}</div>
              <div class="field"><strong>Date:</strong> ${permission.dateDebut}</div>
              ${permission.heureDebut ? `<div class="field"><strong>Heure de début:</strong> ${permission.heureDebut}</div>` : ''}
              ${permission.heureFin ? `<div class="field"><strong>Heure de fin:</strong> ${permission.heureFin}</div>` : ''}
              
              <div class="field" style="margin-top: 30px;"><strong>Date de la demande:</strong> ${permission.dateCreation}</div>
            </div>
            
            <div class="signature-section">
              <div class="signature-box">
                <div style="margin-bottom: 20px;">Signature du demandeur</div>
                <div style="border-top: 1px solid #000; margin-top: 30px; padding-top: 5px;">Date et signature</div>
              </div>
              <div class="signature-box">
                <div style="margin-bottom: 20px;">Visa du chef de service</div>
                <div style="border-top: 1px solid #000; margin-top: 30px; padding-top: 5px;">Date et signature</div>
              </div>
            </div>
            
            <div style="margin-top: 30px; border-top: 1px solid #000; padding-top: 20px;">
              <strong>Observations:</strong>
              <div style="border: 1px solid #000; height: 60px; margin-top: 10px;"></div>
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
