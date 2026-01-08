/**
 * Mock data para Capture Module (Upload de Imagens)
 */

import { CaptureImage } from '@/types/capture';

// Simulação de armazenamento em memória
const mockImagesByCaseId: Record<string, CaptureImage[]> = {};

/**
 * Retorna imagens de um caso (mock)
 */
export function getMockCaseImages(caseId: string): CaptureImage[] {
  return mockImagesByCaseId[caseId] || [];
}

/**
 * Simula upload de imagens para um caso (mock)
 * Em mock mode, as imagens são armazenadas em memória apenas
 */
export async function mockUploadCaseImages(
  caseId: string,
  files: File[]
): Promise<CaptureImage[]> {
  const uploadedImages: CaptureImage[] = [];

  for (const file of files) {
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      console.warn(`[MockCapture] Arquivo ignorado (não é imagem): ${file.name}`);
      continue;
    }

    // Validar tamanho (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      console.warn(`[MockCapture] Arquivo muito grande: ${file.name}`);
      continue;
    }

    const imageId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Simular conversão para Data URL
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });

    const captureImage: CaptureImage = {
      id: imageId,
      caseId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: dataUrl, // Data URL
      createdAt: new Date().toISOString(),
    };

    uploadedImages.push(captureImage);

    // Armazenar no mock
    if (!mockImagesByCaseId[caseId]) {
      mockImagesByCaseId[caseId] = [];
    }
    mockImagesByCaseId[caseId].push(captureImage);
  }

  if (uploadedImages.length === 0) {
    throw new Error('[MockCapture] Nenhuma imagem válida foi enviada');
  }

  return uploadedImages;
}

/**
 * Simula remoção de uma imagem (mock)
 */
export function mockDeleteCaseImage(caseId: string, imageId: string): void {
  if (mockImagesByCaseId[caseId]) {
    mockImagesByCaseId[caseId] = mockImagesByCaseId[caseId].filter(
      (img) => img.id !== imageId
    );
  }
}

/**
 * Simula remoção de todas as imagens de um caso (mock)
 */
export function mockDeleteCaseAllImages(caseId: string): void {
  mockImagesByCaseId[caseId] = [];
}
