
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, User } from 'lucide-react';
import Header from './Header';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (login(username, password)) {
      console.log('Login successful');
    } else {
      setError('Nom d\'utilisateur ou mot de passe incorrect');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-red-50">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center shadow-lg">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-800">
              Connexion Sécurisée
            </CardTitle>
            <CardDescription className="text-gray-600">
              Accédez au système de gestion
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">
                  Nom d'utilisateur
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Entrez votre nom d'utilisateur"
                    className="pl-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    className="pl-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg"
                  disabled={loading}
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>

                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                >
                  Mot de passe oublié ?
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
