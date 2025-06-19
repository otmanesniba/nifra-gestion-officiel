
import { useEffect, useRef } from 'react';

interface AutoSaveOptions {
  storageKey?: string;
  delay?: number;
  debug?: boolean;
}

export const useAutoSave = (options: AutoSaveOptions = {}) => {
  const {
    storageKey = 'my_app_data',
    delay = 1000,
    debug = true
  } = options;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logToConsole = (message: string) => {
    if (debug) {
      console.log(`[AutoSave ${new Date().toLocaleTimeString()}] ${message}`);
    }
  };

  const saveFormData = () => {
    try {
      const formData: Record<string, any> = {};
      
      // Get all form elements
      const inputs = document.querySelectorAll('input, textarea, select');
      
      inputs.forEach((element) => {
        const input = element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const key = input.id || input.name;
        
        if (key) {
          if (input.type === 'checkbox') {
            formData[key] = (input as HTMLInputElement).checked;
          } else if (input.type === 'radio') {
            if ((input as HTMLInputElement).checked) {
              formData[key] = input.value;
            }
          } else {
            formData[key] = input.value;
          }
        }
      });

      localStorage.setItem(storageKey, JSON.stringify({
        data: formData,
        timestamp: new Date().toISOString()
      }));
      
      logToConsole(`Données sauvegardées (${Object.keys(formData).length} champs)`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const loadFormData = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { data, timestamp } = JSON.parse(saved);
        
        Object.entries(data).forEach(([key, value]) => {
          const element = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
          
          if (element) {
            const input = element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
            
            if (input.type === 'checkbox') {
              (input as HTMLInputElement).checked = Boolean(value);
            } else if (input.type === 'radio') {
              if (input.value === value) {
                (input as HTMLInputElement).checked = true;
              }
            } else {
              input.value = String(value);
            }
            
            // Trigger change event to update React state
            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);
          }
        });
        
        logToConsole(`Données restaurées depuis ${new Date(timestamp).toLocaleString()}`);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };

  const clearSavedData = () => {
    localStorage.removeItem(storageKey);
    logToConsole('Données sauvegardées effacées');
  };

  const scheduleAutoSave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      saveFormData();
    }, delay);
  };

  useEffect(() => {
    // Load saved data on component mount
    loadFormData();

    // Setup event listeners for form fields
    const handleInput = () => {
      scheduleAutoSave();
    };

    const handleBeforeUnload = () => {
      saveFormData();
      logToConsole('Sauvegarde finale avant fermeture');
    };

    // Add event listeners
    document.addEventListener('input', handleInput);
    document.addEventListener('change', handleInput);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.removeEventListener('input', handleInput);
      document.removeEventListener('change', handleInput);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [storageKey, delay]);

  return {
    saveFormData,
    loadFormData,
    clearSavedData
  };
};
