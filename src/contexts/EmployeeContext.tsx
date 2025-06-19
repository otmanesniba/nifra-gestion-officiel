
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Employee {
  id: string;
  nom: string;
  prenom: string;
  carteNationale: string;
  matricule: string;
  grade: string;
  fonction: string;
  adresse: string;
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

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const addEmployee = (employeeData: Omit<Employee, 'id' | 'dateCreation'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: Date.now().toString(),
      dateCreation: new Date().toLocaleDateString('fr-FR')
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
    <EmployeeContext.Provider value={{
      employees,
      addEmployee,
      deleteEmployee,
      getEmployeeByMatricule
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};
