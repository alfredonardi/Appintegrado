/**
 * Página de Lista de Clientes
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientsStore } from '@/state/clientsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Trash2, Edit, Plus, Mail, Phone } from 'lucide-react';

export function ClientsList() {
  const navigate = useNavigate();
  const { clients, loading, fetchClients, deleteClient, selectClient } = useClientsStore();

  // Carregar clientes ao montar
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleEdit = (clientId: string) => {
    selectClient(clientId);
    navigate(`/clients/${clientId}/edit`);
  };

  const handleDelete = async (clientId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await deleteClient(clientId);
      } catch (error) {
        console.error('Erro ao deletar:', error);
      }
    }
  };

  const handleCreate = () => {
    navigate('/clients/new');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header com título e botão */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-950">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clientes</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Gerenciar clientes e suas informações
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus size={18} />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Carregando clientes...</p>
          </div>
        ) : clients.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 mb-4">Nenhum cliente cadastrado</p>
            <Button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Criar Primeiro Cliente
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {clients.map((client) => (
              <Card
                key={client.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {client.name}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Mail size={16} />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Phone size={16} />
                        {client.phone}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {client.documentType === 'cpf' ? 'CPF' : 'CNPJ'}: {client.document}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {client.city}, {client.state}
                      </div>
                    </div>
                    <div className="mt-2 inline-block">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          client.status === 'ativo'
                            ? 'bg-green-100 text-green-800'
                            : client.status === 'inativo'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {client.status === 'ativo' && 'Ativo'}
                        {client.status === 'inativo' && 'Inativo'}
                        {client.status === 'bloqueado' && 'Bloqueado'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleEdit(client.id)}
                      variant="outline"
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Edit size={18} />
                    </Button>
                    <Button
                      onClick={() => handleDelete(client.id)}
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
