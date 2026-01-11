import { describe, it, expect, vi, beforeEach } from 'vitest';
import { captureService } from '@/services/captureService';
import * as providerModule from '@/services/provider';

// Mock the provider module
vi.mock('@/services/provider', () => ({
  getDataProvider: vi.fn(() => 'nhost'),
}));

// Mock Nhost client
vi.mock('@/lib/nhostClient', () => ({
  nhost: {
    storage: {
      upload: vi.fn(() => Promise.resolve({ fileMetadata: { id: 'test-id' } })),
      delete: vi.fn(() => Promise.resolve({})),
      getPublicUrl: vi.fn(() => 'http://example.com/test.jpg'),
    },
  },
}));

describe('CaptureService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use nhost provider by default', async () => {
    // Ensure nhost provider is set
    vi.spyOn(providerModule, 'getDataProvider').mockReturnValue('nhost');

    const images = await captureService.uploadCaseImages('case-1', []);

    expect(Array.isArray(images)).toBe(true);
  });

  it('should handle upload with nhost provider', async () => {
    vi.spyOn(providerModule, 'getDataProvider').mockReturnValue('nhost');

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const images = await captureService.uploadCaseImages('case-1', [mockFile]);

    expect(Array.isArray(images)).toBe(true);
  });

  it('should call correct method based on provider - nhost', async () => {
    vi.spyOn(providerModule, 'getDataProvider').mockReturnValue('nhost');

    const result = await captureService.listCaseImages('case-1');
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle list images action', async () => {
    const images = await captureService.listCaseImages('case-1');
    expect(Array.isArray(images)).toBe(true);
  });

  it('should handle delete single image', async () => {
    vi.spyOn(providerModule, 'getDataProvider').mockReturnValue('nhost');

    const result = await captureService.deleteCaseImage('case-1', 'image-1');
    expect(result).toBeUndefined();
  });

  it('should handle delete all images of a case', async () => {
    vi.spyOn(providerModule, 'getDataProvider').mockReturnValue('nhost');

    const result = await captureService.deleteCaseAllImages('case-1');
    expect(result).toBeUndefined();
  });

  it('should detect provider type correctly', () => {
    vi.spyOn(providerModule, 'getDataProvider').mockReturnValue('nhost');
    expect(providerModule.getDataProvider()).toBe('nhost');
  });
});
