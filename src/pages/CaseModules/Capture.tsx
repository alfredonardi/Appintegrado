/**
 * Capture.tsx - Página do submódulo Capture (ETAPA 10)
 *
 * Vertical slice completo com:
 * - Upload múltiplo de imagens (PNG, JPG, WebP)
 * - Preview em grid responsivo
 * - Remoção de imagens
 * - Persistência por caso via Zustand + localStorage
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { Camera, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { CaptureUploader, CaptureGrid } from '../../components/capture';
import { useCaptureStore } from '../../state/captureStore';

export function CaptureModule() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Conectar ao store de capture
  const { getImages, addImages, removeImage } = useCaptureStore();
  const images = getImages(caseId || '');

  // Validar que temos um caseId
  if (!caseId) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-medium text-red-900 mb-2">Erro</h2>
          <p className="text-red-700">Caso não identificado</p>
        </div>
      </div>
    );
  }

  // Handler para seleção de arquivos
  const handleFilesSelected = useCallback(
    (files: File[]) => {
      setIsLoading(true);
      // Simular pequeno delay para mostrar feedback ao usuário
      setTimeout(() => {
        addImages(caseId, files);
        setIsLoading(false);
      }, 300);
    },
    [caseId, addImages]
  );

  // Handler para remover imagem
  const handleRemoveImage = useCallback(
    (imageId: string) => {
      removeImage(caseId, imageId);
    },
    [caseId, removeImage]
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Camera className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Captura de Imagens</h1>
        </div>
        <p className="text-gray-600">Caso #{caseId}</p>
      </div>

      {/* Conteúdo principal */}
      <div className="space-y-8">
        {/* Seção de Upload */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Upload size={20} className="text-blue-600" />
            Adicionar Imagens
          </h2>
          <CaptureUploader
            caseId={caseId}
            onFilesSelected={handleFilesSelected}
            isLoading={isLoading}
          />
        </section>

        {/* Seção de Galeria */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Gallery size={20} className="text-blue-600" />
            Galeria de Imagens
          </h2>
          <CaptureGrid
            images={images}
            onRemoveImage={handleRemoveImage}
            isLoading={isLoading}
          />
        </section>

        {/* Informações e estatísticas */}
        <section className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Informações</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ Imagens persistem ao recarregar a página</li>
            <li>✓ Suportado: PNG, JPG, WebP</li>
            <li>✓ Arraste arquivos ou clique para selecionar</li>
            <li>✓ Clique em uma imagem para removê-la</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

// Ícones inline (fallback se não importado)
const Upload = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const Gallery = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    className={className}
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
);
