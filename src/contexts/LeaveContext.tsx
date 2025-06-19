
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LeaveRequest {
  id: string;
  matricule: string;
  nomComplet: string;
  carteNationale: string;
  grade: string;
  fonction: string;
  natureCongé: string;
  dateDepart: string;
  dateReprise: string;
  adresse: string;
  observation: string;
  dateCreation: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface LeaveBalance {
  matricule: string;
  nomEmploye: string;
  totalCongesAnnuels: number;
  joursUtilises: number;
  joursRestants: number;
}

interface LeaveContextType {
  leaveRequests: LeaveRequest[];
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'dateCreation' | 'status'>) => void;
  approveLeaveRequest: (id: string) => void;
  rejectLeaveRequest: (id: string) => void;
  getLeaveBalances: (employees: any[]) => LeaveBalance[];
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (context === undefined) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
};

export const LeaveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  const addLeaveRequest = (requestData: Omit<LeaveRequest, 'id' | 'dateCreation' | 'status'>) => {
    const newRequest: LeaveRequest = {
      ...requestData,
      id: Date.now().toString(),
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      status: 'pending'
    };
    setLeaveRequests(prev => [...prev, newRequest]);
  };

  const approveLeaveRequest = (id: string) => {
    setLeaveRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, status: 'approved' as const } : request
      )
    );
  };

  const rejectLeaveRequest = (id: string) => {
    setLeaveRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, status: 'rejected' as const } : request
      )
    );
  };

  const calculateDaysBetween = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getLeaveBalances = (employees: any[]): LeaveBalance[] => {
    return employees.map(employee => {
      const approvedLeaves = leaveRequests.filter(
        request => request.matricule === employee.matricule && request.status === 'approved'
      );

      const joursUtilises = approvedLeaves.reduce((total, leave) => {
        return total + calculateDaysBetween(leave.dateDepart, leave.dateReprise);
      }, 0);

      const totalCongesAnnuels = 30; // Standard 30 jours par an
      const joursRestants = Math.max(0, totalCongesAnnuels - joursUtilises);

      return {
        matricule: employee.matricule,
        nomEmploye: `${employee.nom} ${employee.prenom}`,
        totalCongesAnnuels,
        joursUtilises,
        joursRestants
      };
    });
  };

  return (
    <LeaveContext.Provider value={{
      leaveRequests,
      addLeaveRequest,
      approveLeaveRequest,
      rejectLeaveRequest,
      getLeaveBalances
    }}>
      {children}
    </LeaveContext.Provider>
  );
};
