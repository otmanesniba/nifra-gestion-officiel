
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, FileText, LogOut, User } from 'lucide-react';
import Header from './Header';
import EmployeeManagement from './EmployeeManagement';
import LeaveManagement from './LeaveManagement';
import SpecialPermissions from './SpecialPermissions';

type ActiveModule = 'home' | 'employees' | 'leave' | 'permissions';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'employees':
        return <EmployeeManagement />;
      case 'leave':
        return <LeaveManagement />;
      case 'permissions':
        return <SpecialPermissions />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer border-emerald-200 hover:border-emerald-400"
              onClick={() => setActiveModule('employees')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-800">Gestion des Fonctionnaires</CardTitle>
                <CardDescription>
                  Gérer les employés, ajouter, supprimer et consulter la liste
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 hover:border-blue-400"
              onClick={() => setActiveModule('leave')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-800">Espace Congé</CardTitle>
                <CardDescription>
                  Demandes de congés administratifs et gestion des permissions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200 hover:border-purple-400"
              onClick={() => setActiveModule('permissions')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-purple-800">Autorisation Spéciale</CardTitle>
                <CardDescription>
                  Permissions courtes et autorisations spéciales
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              <Button
                variant={activeModule === 'home' ? 'default' : 'ghost'}
                onClick={() => setActiveModule('home')}
                className={activeModule === 'home' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                Accueil
              </Button>
              <Button
                variant={activeModule === 'employees' ? 'default' : 'ghost'}
                onClick={() => setActiveModule('employees')}
                className={activeModule === 'employees' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                Fonctionnaires
              </Button>
              <Button
                variant={activeModule === 'leave' ? 'default' : 'ghost'}
                onClick={() => setActiveModule('leave')}
                className={activeModule === 'leave' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                Congés
              </Button>
              <Button
                variant={activeModule === 'permissions' ? 'default' : 'ghost'}
                onClick={() => setActiveModule('permissions')}
                className={activeModule === 'permissions' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                Autorisations
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="w-4 h-4" />
                <span className="font-medium">{user?.username}</span>
              </div>
              <Button 
                variant="outline" 
                onClick={logout}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeModule === 'home' && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tableau de Bord Principal
            </h1>
            <p className="text-gray-600">
              Bienvenue dans le système de gestion de la Commune de Khenifra
            </p>
          </div>
        )}
        
        {renderActiveModule()}
      </div>
    </div>
  );
};

export default Dashboard;
