/**
 * Tipos para Cliente (ETAPA 7)
 */

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string; // CPF/CNPJ
  documentType: 'cpf' | 'cnpj';
  address: string;
  cep: string;
  city: string;
  state: string;
  country: string;
  status: 'ativo' | 'inativo' | 'bloqueado';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Criar cliente vazio
 */
export const createEmptyClient = (id: string): Client => ({
  id,
  name: '',
  email: '',
  phone: '',
  document: '',
  documentType: 'cpf',
  address: '',
  cep: '',
  city: '',
  state: '',
  country: 'Brasil',
  status: 'ativo',
  notes: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
