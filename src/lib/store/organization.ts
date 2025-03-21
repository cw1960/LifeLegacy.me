import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Organization {
  id: string;
  name: string;
  subdomain: string;
  subscriptionTier: string;
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string;
    favicon?: string;
  };
  customDomain?: string;
}

interface OrganizationState {
  currentOrganization: Organization | null;
  isLoading: boolean;
  error: string | null;
  setCurrentOrganization: (organization: Organization | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  updateOrganization: (organizationData: Partial<Organization>) => void;
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set) => ({
      currentOrganization: null,
      isLoading: false,
      error: null,
      setCurrentOrganization: (organization) => set({ currentOrganization: organization }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      updateOrganization: (organizationData) =>
        set((state) => ({
          currentOrganization: state.currentOrganization
            ? { ...state.currentOrganization, ...organizationData }
            : null,
        })),
    }),
    {
      name: "organization-storage",
    }
  )
); 