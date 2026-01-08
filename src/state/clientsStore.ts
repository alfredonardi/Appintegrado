/**
 * Store de Clientes - Zustand
 * Gerencia estado global de clientes
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Client, createEmptyClient } from '@/types/client';
import { clientsService } from '@/services/clientsService';

interface ClientsStore {
  // Estado
  clients: Client[];
  selectedClientId: string | null;
  loading: boolean;

  // Seletores
  selectedClient: () => Client | null;
  getClientById: (id: string) => Client | undefined;

  // Actions - Listar
  fetchClients: () => Promise<void>;

  // Actions - CRUD
  createClient: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Client>;
  selectClient: (clientId: string | null) => void;
  updateClient: (clientId: string, updates: Partial<Client>) => Promise<Client>;
  deleteClient: (clientId: string) => Promise<void>;

  // Actions - Utilitários
  setLoading: (loading: boolean) => void;
  clearClients: () => void;
}

/**
 * Store Zustand com persistência em localStorage
 */
export const useClientsStore = create<ClientsStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      clients: [],
      selectedClientId: null,
      loading: false,

      // Seletor: cliente selecionado
      selectedClient: () => {
        const { clients, selectedClientId } = get();
        if (!selectedClientId) return null;
        return clients.find((c) => c.id === selectedClientId) || null;
      },

      // Seletor: cliente por ID
      getClientById: (id: string) => {
        return get().clients.find((c) => c.id === id);
      },

      // Action: buscar todos os clientes
      fetchClients: async () => {
        set({ loading: true });
        try {
          const clients = await clientsService.getClients();
          set({ clients });
        } catch (error) {
          console.error('Erro ao buscar clientes:', error);
        } finally {
          set({ loading: false });
        }
      },

      // Action: criar novo cliente
      createClient: async (data) => {
        set({ loading: true });
        try {
          const newClient = await clientsService.createClient(data);
          set((state) => ({
            clients: [...state.clients, newClient],
          }));
          return newClient;
        } catch (error) {
          console.error('Erro ao criar cliente:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Action: selecionar cliente
      selectClient: (clientId) => {
        set({ selectedClientId: clientId });
      },

      // Action: atualizar cliente
      updateClient: async (clientId, updates) => {
        set({ loading: true });
        try {
          const updatedClient = await clientsService.updateClient(clientId, updates);
          set((state) => ({
            clients: state.clients.map((c) => (c.id === clientId ? updatedClient : c)),
          }));
          return updatedClient;
        } catch (error) {
          console.error('Erro ao atualizar cliente:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Action: deletar cliente
      deleteClient: async (clientId) => {
        set({ loading: true });
        try {
          await clientsService.deleteClient(clientId);
          set((state) => ({
            clients: state.clients.filter((c) => c.id !== clientId),
            selectedClientId:
              state.selectedClientId === clientId ? null : state.selectedClientId,
          }));
        } catch (error) {
          console.error('Erro ao deletar cliente:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Action: definir loading
      setLoading: (loading) => {
        set({ loading });
      },

      // Action: limpar clientes
      clearClients: () => {
        set({ clients: [], selectedClientId: null });
      },
    }),
    {
      name: 'clients-store',
      storage: createJSONStorage(() => localStorage),
      // Persistir apenas clientes (não carregamos dados do localStorage inicialmente)
      partialize: (state) => ({ clients: state.clients }),
    }
  )
);
