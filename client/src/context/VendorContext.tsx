import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export interface Vendor {
  id: number;
  storeName: string;
  storeDescription?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  userId: number;
  userEmail: string;
  userFullName: string;
}

interface VendorContextType {
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  selectVendor: (vendor: Vendor) => void;
  isLoading: boolean;
  error: Error | null;
  refetchVendors: () => void;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export function VendorProvider({ children }: { children: ReactNode }) {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const { data: vendors = [], isLoading, error, refetch } = useQuery<Vendor[]>({
    queryKey: ['myVendors'],
    queryFn: async () => {
      const response = await api.get('/vendors/my-stores');
      return response.data;
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Auto-select first vendor if none selected
  useEffect(() => {
    if (vendors.length > 0 && !selectedVendor) {
      const savedVendorId = localStorage.getItem('selectedVendorId');
      if (savedVendorId) {
        const saved = vendors.find(v => v.id === parseInt(savedVendorId));
        if (saved) {
          setSelectedVendor(saved);
          return;
        }
      }
      setSelectedVendor(vendors[0]);
    }
  }, [vendors, selectedVendor]);

  const selectVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    localStorage.setItem('selectedVendorId', vendor.id.toString());
  };

  return (
    <VendorContext.Provider
      value={{
        vendors,
        selectedVendor,
        selectVendor,
        isLoading,
        error: error as Error | null,
        refetchVendors: refetch,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
}

export function useVendorContext() {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error('useVendorContext must be used within a VendorProvider');
  }
  return context;
}
