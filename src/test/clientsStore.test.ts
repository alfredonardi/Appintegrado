import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClientsStore } from '@/state/clientsStore';
import { Client } from '@/types/client';

// Mock clientsService to avoid API calls
vi.mock('@/services/clientsService', () => ({
  clientsService: {
    getClients: vi.fn(() => Promise.resolve([])),
    createClient: vi.fn((data) =>
      Promise.resolve({
        id: '1',
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    ),
    updateClient: vi.fn((id, updates) =>
      Promise.resolve({
        id,
        ...updates,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    ),
    deleteClient: vi.fn(() => Promise.resolve(undefined)),
  },
}));

describe('ClientsStore (Zustand)', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useClientsStore());
    act(() => {
      result.current.clearClients();
    });
  });

  it('should initialize with empty clients list', () => {
    const { result } = renderHook(() => useClientsStore());
    expect(result.current.clients).toEqual([]);
    expect(result.current.selectedClientId).toBeNull();
  });

  it('should select a client', () => {
    const { result } = renderHook(() => useClientsStore());

    act(() => {
      result.current.selectClient('client-123');
    });

    expect(result.current.selectedClientId).toBe('client-123');
  });

  it('should create a client', async () => {
    const { result } = renderHook(() => useClientsStore());

    const newClient = {
      name: 'Test Client',
      email: 'test@example.com',
      phone: '123456789',
      address: 'Test Address',
    };

    await act(async () => {
      await result.current.createClient(newClient);
    });

    expect(result.current.clients.length).toBe(1);
    expect(result.current.clients[0].name).toBe('Test Client');
  });

  it('should get client by id', () => {
    const { result } = renderHook(() => useClientsStore());

    act(() => {
      const mockClient: Client = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123456789',
        address: 'Test Address',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      result.current.clients.push(mockClient);
    });

    const client = result.current.getClientById('123');
    expect(client).toBeDefined();
    expect(client?.name).toBe('John Doe');
  });

  it('should return null for non-existent selected client', () => {
    const { result } = renderHook(() => useClientsStore());

    act(() => {
      result.current.selectClient('non-existent');
    });

    const selected = result.current.selectedClient();
    expect(selected).toBeNull();
  });

  it('should clear loading state', () => {
    const { result } = renderHook(() => useClientsStore());

    act(() => {
      result.current.setLoading(true);
    });
    expect(result.current.loading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });
    expect(result.current.loading).toBe(false);
  });
});
