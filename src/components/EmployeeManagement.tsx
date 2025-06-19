
import React, { useState } from 'react';
import { useEmployees } from '../contexts/EmployeeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, UserMinus, Users, Search, Download } from 'lucide-react';
import { toast } from 'sonner';

const EmployeeManagement = () => {
  const { employees, addEmployee, deleteEmployee, getEmployeeByMatricule } = useEmployees();
  const [activeTab, setActiveTab] = useState('add');
  
  // Add Employee Form State
  const [addForm, setAddForm] = useState({
    nom: '',
    prenom: '',
    carteNationale: '',
    matricule: '',
    grade: '',
    service: ''
  });

  // Delete Employee State
  const [deleteMatricule, setDeleteMatricule] = useState('');
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Search State
  const [searchMatricule, setSearchMatricule] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if matricule already exists
    if (getEmployeeByMatricule(addForm.matricule)) {
      toast.error('Un employé avec ce matricule existe déjà');
      return;
    }

    addEmployee(addForm);
    toast.success('Employé ajouté avec succès');
    setAddForm({
      nom: '',
      prenom: '',
      carteNationale: '',
      matricule: '',
      grade: '',
      service: ''
    });
  };

  const handleDeleteSearch = () => {
    const employee = getEmployeeByMatricule(deleteMatricule);
    if (employee) {
      setEmployeeToDelete(employee);
    } else {
      toast.error('Aucun employé trouvé avec ce matricule');
      setEmployeeToDelete(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteEmployee(deleteMatricule)) {
      toast.success('Employé supprimé avec succès');
      setDeleteMatricule('');
      setEmployeeToDelete(null);
    }
  };

  const handleSearch = () => {
    const employee = getEmployeeByMatricule(searchMatricule);
    if (employee) {
      setSearchResult(employee);
    } else {
      toast.error('Aucun employé trouvé avec ce matricule');
      setSearchResult(null);
    }
  };

  const exportToExcel = () => {
    const csvContent = [
      ['Nom', 'Prénom', 'Carte Nationale', 'Matricule', 'Grade', 'Service', 'Date de Création'],
      ...employees.map(emp => [emp.nom, emp.prenom, emp.carteNationale, emp.matricule, emp.grade, emp.service, emp.dateCreation])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `employes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Liste exportée en Excel avec succès');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Fonctionnaires</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="add" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Ajouter
          </TabsTrigger>
          <TabsTrigger value="delete" className="flex items-center gap-2">
            <UserMinus className="w-4 h-4" />
            Supprimer
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Liste
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Recherche
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-800">Ajouter un Fonctionnaire</CardTitle>
              <CardDescription>Remplissez tous les champs pour ajouter un nouvel employé</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={addForm.nom}
                    onChange={(e) => setAddForm({...addForm, nom: e.target.value})}
                    placeholder="Nom de famille"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={addForm.prenom}
                    onChange={(e) => setAddForm({...addForm, prenom: e.target.value})}
                    placeholder="Prénom"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carteNationale">Carte Nationale</Label>
                  <Input
                    id="carteNationale"
                    value={addForm.carteNationale}
                    onChange={(e) => setAddForm({...addForm, carteNationale: e.target.value})}
                    placeholder="Numéro de carte nationale"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matricule">Matricule</Label>
                  <Input
                    id="matricule"
                    value={addForm.matricule}
                    onChange={(e) => setAddForm({...addForm, matricule: e.target.value})}
                    placeholder="Matricule employé"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    value={addForm.grade}
                    onChange={(e) => setAddForm({...addForm, grade: e.target.value})}
                    placeholder="Grade"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service">Service</Label>
                  <Input
                    id="service"
                    value={addForm.service}
                    onChange={(e) => setAddForm({...addForm, service: e.target.value})}
                    placeholder="Service/Département"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Enregistrer
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delete" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-800">Supprimer un Fonctionnaire</CardTitle>
              <CardDescription>Entrez le matricule de l'employé à supprimer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={deleteMatricule}
                  onChange={(e) => setDeleteMatricule(e.target.value)}
                  placeholder="Matricule de l'employé"
                />
                <Button onClick={handleDeleteSearch} variant="outline">
                  Rechercher
                </Button>
              </div>
              
              {employeeToDelete && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Employé trouvé:</p>
                      <p><strong>Nom:</strong> {employeeToDelete.nom} {employeeToDelete.prenom}</p>
                      <p><strong>Grade:</strong> {employeeToDelete.grade}</p>
                      <p><strong>Service:</strong> {employeeToDelete.service}</p>
                      <Button 
                        onClick={handleDeleteConfirm} 
                        variant="destructive" 
                        className="mt-2"
                      >
                        Confirmer la suppression
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-blue-800">Liste des Fonctionnaires</CardTitle>
                <CardDescription>Total: {employees.length} employés</CardDescription>
              </div>
              <Button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Télécharger Excel
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Matricule</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Nom</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Prénom</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Grade</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Service</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Date Création</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-mono">{employee.matricule}</td>
                        <td className="border border-gray-300 px-4 py-2">{employee.nom}</td>
                        <td className="border border-gray-300 px-4 py-2">{employee.prenom}</td>
                        <td className="border border-gray-300 px-4 py-2">{employee.grade}</td>
                        <td className="border border-gray-300 px-4 py-2">{employee.service}</td>
                        <td className="border border-gray-300 px-4 py-2">{employee.dateCreation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-800">Recherche par Matricule</CardTitle>
              <CardDescription>Recherchez un employé par son matricule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={searchMatricule}
                  onChange={(e) => setSearchMatricule(e.target.value)}
                  placeholder="Matricule de l'employé"
                />
                <Button onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700">
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher
                </Button>
              </div>
              
              {searchResult && (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium text-blue-800">Employé trouvé:</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p><strong>Nom:</strong> {searchResult.nom}</p>
                        <p><strong>Prénom:</strong> {searchResult.prenom}</p>
                        <p><strong>Carte Nationale:</strong> {searchResult.carteNationale}</p>
                        <p><strong>Matricule:</strong> {searchResult.matricule}</p>
                        <p><strong>Grade:</strong> {searchResult.grade}</p>
                        <p><strong>Service:</strong> {searchResult.service}</p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeManagement;
