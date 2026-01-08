import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '../ui/button';

interface CaptureUploaderProps {
  caseId: string;
  onFilesSelected: (files: File[]) => void;
  isLoading?: boolean;
}

/**
 * Componente para upload múltiplo de imagens
 * Suporta drag-and-drop e seleção via input
 */
export function CaptureUploader({
  caseId,
  onFilesSelected,
  isLoading = false,
}: CaptureUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Validar se arquivo é imagem
  const isValidImageFile = (file: File): boolean => {
    return file.type.startsWith('image/') &&
      ['image/png', 'image/jpeg', 'image/webp'].includes(file.type);
  };

  // Processar arquivos selecionados (via input ou drag-drop)
  const handleFileSelection = (files: FileList | null) => {
    if (!files) return;

    // Filtrar apenas imagens válidas
    const validFiles = Array.from(files).filter(isValidImageFile);

    if (validFiles.length === 0) {
      alert('Nenhuma imagem válida selecionada. Use PNG, JPG ou WebP.');
      return;
    }

    if (validFiles.length < files.length) {
      const skipped = files.length - validFiles.length;
      console.warn(`${skipped} arquivo(s) foi/foram ignorado(s) por não serem imagens válidas.`);
    }

    onFilesSelected(validFiles);

    // Limpar input para permitir re-upload do mesmo arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Eventos drag-and-drop
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files);
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400'
      } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Ícone upload */}
      <div className="flex justify-center mb-4">
        <div className="bg-blue-100 rounded-full p-4">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* Título e descrição */}
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Arraste imagens aqui ou clique para selecionar
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Suportado: PNG, JPG, WebP (máximo 20 imagens por vez)
      </p>

      {/* Input file (hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => handleFileSelection(e.target.files)}
        disabled={isLoading}
        className="hidden"
        aria-label="Selecionar imagens para upload"
      />

      {/* Botão visível */}
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="flex gap-2 mx-auto"
      >
        <Upload size={18} />
        {isLoading ? 'Processando...' : 'Selecionar Imagens'}
      </Button>

      {/* Dica de acessibilidade */}
      <p className="text-xs text-gray-500 mt-4">
        Case ID: <span className="font-mono bg-white px-2 py-1 rounded">{caseId}</span>
      </p>
    </div>
  );
}
