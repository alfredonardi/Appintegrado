/**
 * CaptureGrid - Grid responsivo de imagens capturadas
 *
 * Exibe:
 * - Grid de cards de imagens
 * - Estado vazio com mensagem
 * - Estado de carregamento
 * - Deletar imagens com confirmação
 */

import { AlertCircle } from 'lucide-react';
import { CaptureImage } from '@/types/capture';
import { CaptureCard } from './CaptureCard';
import { useState } from 'react';

interface CaptureGridProps {
  images: CaptureImage[];
  onRemoveImage: (imageId: string) => void;
  isLoading?: boolean;
}

export function CaptureGrid({ images, onRemoveImage, isLoading = false }: CaptureGridProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (imageId: string) => {
    setDeletingId(imageId);
    setTimeout(() => {
      onRemoveImage(imageId);
      setDeletingId(null);
    }, 300);
  };

  // Estado vazio
  if (images.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">Nenhuma imagem capturada</p>
        <p className="text-sm text-gray-500">Faça upload de imagens acima para começar</p>
      </div>
    );
  }

  // Estado de carregamento
  if (isLoading && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Carregando imagens...</p>
      </div>
    );
  }

  // Grid de imagens
  return (
    <div className="space-y-4">
      {/* Contador */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          {images.length} imagem{images.length !== 1 ? 's' : ''} capturada{images.length !== 1 ? 's' : ''}
        </p>
        <div className="text-xs text-gray-500">
          {images.reduce((total, img) => total + img.size, 0)} bytes no total
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className={deletingId === image.id ? 'opacity-50' : ''}
          >
            <CaptureCard
              image={image}
              onDelete={handleDelete}
              isDeleting={deletingId === image.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
