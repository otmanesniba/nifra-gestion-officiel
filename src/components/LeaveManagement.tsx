import React, { useState } from 'react';
import { useLeave } from '../contexts/LeaveContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

const LeaveManagement = () => {
  const { leaveRequests, addLeaveRequest } = useLeave();

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
  };

  const generatePDF = () => {
    toast.info('Fonctionnalité PDF en cours de développement');
  };

  const handlePrint = () => {
    window.print();
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
              <CardDescription>Remplissez le formulaire pour soumettre une demande de congé</CardDescription>
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
                  <Input
                    id="grade"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    placeholder="Grade"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fonction">Fonction</Label>
                  <Input
                    id="fonction"
                    value={formData.fonction}
                    onChange={(e) => setFormData({...formData, fonction: e.target.value})}
                    placeholder="Fonction"
                    required
                  />
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
                <div className="md:col-span-2">
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Soumettre la demande
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
                      <TableHead>Nature du Congé</TableHead>
                      <TableHead>Date Départ</TableHead>
                      <TableHead>Date Reprise</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date Création</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.nomComplet}</TableCell>
                        <TableCell className="font-mono">{request.matricule}</TableCell>
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
                        <TableCell>{request.dateCreation}</TableCell>
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
