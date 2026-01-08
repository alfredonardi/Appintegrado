/**
 * Mock data para Usuários
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  badge?: string;
  status: 'ativo' | 'inativo';
  createdAt: string;
  updatedAt: string;
}

export const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'Dr. João Silva',
    email: 'joao.silva@police.sp.gov.br',
    role: 'Delegado',
    badge: 'DG-001',
    status: 'ativo',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: 'user-002',
    name: 'Carlos Santos',
    email: 'carlos.santos@police.sp.gov.br',
    role: 'Investigador',
    badge: 'INV-001',
    status: 'ativo',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: 'user-003',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@police.sp.gov.br',
    role: 'Fotógrafo',
    badge: 'FOT-001',
    status: 'ativo',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: 'user-004',
    name: 'Dr. Pedro Costa',
    email: 'pedro.costa@police.sp.gov.br',
    role: 'Delegado',
    badge: 'DG-002',
    status: 'ativo',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-05T08:00:00Z',
  },
  {
    id: 'user-005',
    name: 'Ana Paula Ferreira',
    email: 'ana.paula@police.sp.gov.br',
    role: 'Investigador',
    badge: 'INV-002',
    status: 'ativo',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-05T08:00:00Z',
  },
];

/**
 * Obter usuário por ID
 */
export function getMockUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id);
}

/**
 * Obter todos os usuários
 */
export function getAllMockUsers(): User[] {
  return [...mockUsers];
}

/**
 * Obter usuário por email
 */
export function getMockUserByEmail(email: string): User | undefined {
  return mockUsers.find((u) => u.email === email);
}

/**
 * Obter usuários por role
 */
export function getMockUsersByRole(role: string): User[] {
  return mockUsers.filter((u) => u.role === role);
}
