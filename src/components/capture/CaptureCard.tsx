/**
 * CaptureCard - Cartão individual de imagem capturada
 *
 * Mostra:
 * - Imagem em preview
 * - Nome do arquivo
 * - Tamanho
 * - Data de criação
 * - Botão para deletar
 */

import { X, FileText } from 'lucide-react';
import { CaptureImage } from '@/types/capture';

interface CaptureCardProps {
  image: CaptureImage;
  onDelete: (imageId: string) => void;
  isDeleting?: boolean;
}

export function CaptureCard({ image, onDelete, isDeleting = false }: CaptureCardProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Container de imagem */}
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        {image.url.startsWith('data:') || image.url.startsWith('http') ? (
          <img
            src={image.url}
            alt={image.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Overlay ao passar mouse */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
          {/* Botão de deletar */}
          <button
            onClick={() => onDelete(image.id)}
            disabled={isDeleting}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-3 bg-red-600 hover:bg-red-700 disabled:bg-red-500 text-white rounded-full shadow-lg"
            title="Deletar imagem"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Informações */}
      <div className="p-3">
        {/* Nome do arquivo */}
        <h3 className="text-sm font-medium text-gray-900 truncate" title={image.name}>
          {image.name}
        </h3>

        {/* Metadados */}
        <div className="mt-2 space-y-1 text-xs text-gray-600">
          <div className="flex justify-between">
            <span className="font-medium">Tamanho:</span>
            <span>{formatFileSize(image.size)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Tipo:</span>
            <span>{image.type.split('/')[1]?.toUpperCase() || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Data:</span>
            <span>{formatDate(image.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
