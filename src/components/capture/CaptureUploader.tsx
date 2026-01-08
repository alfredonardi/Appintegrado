/**
 * CaptureUploader - Componente de upload de imagens
 *
 * Funcionalidades:
 * - Drag & drop de múltiplas imagens
 * - Click para selecionar arquivos
 * - Validação de tipo e tamanho
 * - Feedback de carregamento
 * - Mensagens de erro
 */

import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';

interface CaptureUploaderProps {
  caseId: string;
  onFilesSelected: (files: File[]) => void;
  isLoading?: boolean;
}

export function CaptureUploader({
  caseId,
  onFilesSelected,
  isLoading = false,
}: CaptureUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_FILES = 20;

  const validateFiles = (files: File[]) => {
    // Validar quantidade
    if (files.length > MAX_FILES) {
      return { valid: [], error: 'Máximo ' + MAX_FILES + ' imagens por vez' };
    }

    // Validar cada arquivo
    const validFiles = files.filter((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        console.warn('Tipo não aceito: ' + file.type);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        console.warn('Arquivo muito grande: ' + file.name);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      return {
        valid: [],
        error: 'Nenhuma imagem válida. Aceitos: JPG, PNG, WebP, GIF (máx 10MB cada)',
      };
    }

    if (validFiles.length < files.length) {
      return {
        valid: validFiles,
        error: (files.length - validFiles.length) + ' arquivo(s) ignorado(s) por tipo/tamanho inválido',
      };
    }

    return { valid: validFiles };
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = useCallback(
    (files: File[]) => {
      setErrorMessage(null);
      setSuccessMessage(null);

      const { valid, error } = validateFiles(files);

      if (error) {
        setErrorMessage(error);
      }

      if (valid.length > 0) {
        onFilesSelected(valid);
        setSuccessMessage(valid.length + ' imagem(ns) adicionada(s)');
        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => setSuccessMessage(null), 3000);

        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [onFilesSelected]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={
          'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ' +
          (dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400') +
          (isLoading ? ' opacity-50 cursor-not-allowed' : '')
        }
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleChange}
          disabled={isLoading}
          className="hidden"
          aria-label="Upload images"
        />

        <div className="flex flex-col items-center gap-3">
          <Upload className="w-12 h-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-900">
              {dragActive ? 'Solte as imagens aqui' : 'Arraste imagens ou clique para selecionar'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Suportado: JPG, PNG, WebP, GIF (máx 10MB cada, até 20 por vez)
            </p>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 mt-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-600">Processando...</span>
            </div>
          )}
        </div>
      </div>

      {/* Mensagens de erro */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Erro ao processar arquivos</p>
            <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Mensagens de sucesso */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="font-medium text-green-900">{successMessage}</p>
        </div>
      )}

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Dica:</span> As imagens são salvas localmente no seu navegador
          e persistem ao recarregar a página.
        </p>
      </div>
    </div>
  );
}
