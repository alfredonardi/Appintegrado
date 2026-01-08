import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { CaptureImage } from '../../types/capture';

interface CaptureCardProps {
  image: CaptureImage;
  onRemove: (imageId: string) => void;
}

/**
 * Card individual mostrando preview e metadados de uma imagem capturada
 */
export function CaptureCard({ image, onRemove }: CaptureCardProps) {
  // Formatar tamanho em bytes para formato legível
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Formatar data de criação
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Preview da imagem */}
      <div className="relative bg-gray-100 aspect-square overflow-hidden">
        <img
          src={image.url}
          alt={image.name}
          className="w-full h-full object-cover"
        />

        {/* Botão remover (overlay no hover) */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 group">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onRemove(image.id)}
            className="flex gap-2"
            aria-label={`Remover imagem ${image.name}`}
          >
            <X size={16} />
            Remover
          </Button>
        </div>
      </div>

      {/* Metadados */}
      <div className="p-3">
        {/* Nome do arquivo */}
        <p className="font-medium text-sm text-gray-900 truncate" title={image.name}>
          {image.name}
        </p>

        {/* Tamanho e tipo */}
        <div className="flex justify-between items-center text-xs text-gray-600 mt-1">
          <span>{formatSize(image.size)}</span>
          <span className="bg-gray-100 px-2 py-1 rounded">
            {image.type.split('/')[1].toUpperCase()}
          </span>
        </div>

        {/* Data de criação */}
        <p className="text-xs text-gray-500 mt-2">
          {formatDate(image.createdAt)}
        </p>
      </div>
    </div>
  );
}
