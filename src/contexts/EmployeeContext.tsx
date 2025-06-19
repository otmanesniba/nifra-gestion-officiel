
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Employee {
  id: string;
  nom: string;
  prenom: string;
  carteNationale: string;
  matricule: string;
  grade: string;
  service: string;
  dateCreation: string;
}

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'dateCreation'>) => void;
  deleteEmployee: (matricule: string) => boolean;
  getEmployeeByMatricule: (matricule: string) => Employee | undefined;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};

interface EmployeeProviderProps {
  children: ReactNode;
}

export const EmployeeProvider = ({ children }: EmployeeProviderProps) => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      nom: 'BENALI',
      prenom: 'Mohammed',
      carteNationale: 'AB123456',
      matricule: 'MAT001',
      grade: 'Administrateur Principal',
      service: 'Ressources Humaines',
      dateCreation: '2024-01-15'
    },
    {
      id: '2',
      nom: 'ALAMI',
      prenom: 'Fatima',
      carteNationale: 'CD789012',
      matricule: 'MAT002',
      grade: 'Technicien',
      service: 'Finances',
      dateCreation: '2024-02-10'
    }
  ]);

  const addEmployee = (employeeData: Omit<Employee, 'id' | 'dateCreation'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: Date.now().toString(),
      dateCreation: new Date().toISOString().split('T')[0]
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const deleteEmployee = (matricule: string): boolean => {
    const employeeExists = employees.some(emp => emp.matricule === matricule);
    if (employeeExists) {
      setEmployees(prev => prev.filter(emp => emp.matricule !== matricule));
      return true;
    }
    return false;
  };

  const getEmployeeByMatricule = (matricule: string): Employee | undefined => {
    return employees.find(emp => emp.matricule === matricule);
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, deleteEmployee, getEmployeeByMatricule }}>
      {children}
    </EmployeeContext.Provider>
  );
};
