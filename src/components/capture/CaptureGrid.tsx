import { CaptureImage } from '../../types/capture';
import { CaptureCard } from './CaptureCard';

interface CaptureGridProps {
  images: CaptureImage[];
  onRemoveImage: (imageId: string) => void;
  isLoading?: boolean;
}

/**
 * Grid responsivo mostrando todas as imagens capturadas de um caso
 */
export function CaptureGrid({
  images,
  onRemoveImage,
  isLoading = false,
}: CaptureGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-lg aspect-square animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Nenhuma imagem capturada
        </h3>
        <p className="text-sm text-gray-500">
          Comece fazendo upload de imagens para este caso
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Contagem de imagens */}
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">
          {images.length} imagem{images.length !== 1 ? 's' : ''} capturada{images.length !== 1 ? 's' : ''}
        </span>
        <span className="text-xs text-gray-500">
          Total: {(images.reduce((sum, img) => sum + img.size, 0) / 1024 / 1024).toFixed(2)} MB
        </span>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <CaptureCard
            key={image.id}
            image={image}
            onRemove={onRemoveImage}
          />
        ))}
      </div>
    </div>
  );
}
