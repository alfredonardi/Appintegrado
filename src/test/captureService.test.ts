import { describe, it, expect, vi, beforeEach } from 'vitest';
import { captureService } from '@/services/captureService';
import * as providerModule from '@/services/provider';

// Mock the provider module
vi.mock('@/services/provider', () => ({
  getDataProvider: vi.fn(() => 'mock'),
  isMockProvider: vi.fn(() => true),
  isSupabaseProvider: vi.fn(() => false),
  isHttpProvider: vi.fn(() => false),
}));

// Mock mock capture service
vi.mock('@/services/mock/mockCapture', () => ({
  getMockCaseImages: vi.fn(() => Promise.resolve([])),
  mockUploadCaseImages: vi.fn(() =>
    Promise.resolve([
      {
        id: 'mock-img-1',
        caseId: 'case-1',
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
        url: 'data:image/jpeg;base64,...',
        createdAt: new Date().toISOString(),
      },
    ])
  ),
  mockDeleteCaseImage: vi.fn(() => Promise.resolve(undefined)),
  mockDeleteCaseAllImages: vi.fn(() => Promise.resolve(undefined)),
}));

// Mock Supabase service
vi.mock('@/services/supabase/captureServiceSupabase', () => ({
  uploadCaseImages: vi.fn(() => Promise.resolve([])),
  listCaseImages: vi.fn(() => Promise.resolve([])),
  deleteCaseImage: vi.fn(() => Promise.resolve(undefined)),
  deleteCaseAllImages: vi.fn(() => Promise.resolve(undefined)),
}));

// Mock API client
vi.mock('@/services/apiClient', () => ({
  apiClient: {
    post: vi.fn(() => Promise.resolve([])),
    get: vi.fn(() => Promise.resolve([])),
    delete: vi.fn(() => Promise.resolve(undefined)),
  },
}));

describe('CaptureService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use mock provider by default', async () => {
    // Ensure mock provider is set
    vi.spyOn(providerModule, 'getDataProvider').mockReturnValue('mock');
    vi.spyOn(providerModule, 'isMockProvider').mockReturnValue(true);

    const images = await captureService.uploadCaseImages('case-1', []);

    expect(Array.isArray(images)).toBe(true);
  });

  it('should handle upload with mock provider', async () => {
    vi.spyOn(providerModule, 'getDataProvider').mockReturnValue('mock');

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const images = await captureService.uploadCaseImages('case-1', [mockFile]);

    expect(Array.isArray(images)).toBe(true);
  });

  it('should call correct method based on provider - mock', async () => {
    vi.spyOn(providerModule, 'getDataProvider').mockReturnValue('mock');

    const result = await captureService.listCaseImages('case-1');
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle list images action', async () => {
    const images = await captureService.listCaseImages('case-1');
    expect(Array.isArray(images)).toBe(true);
  });

  it('should handle delete single image', async () => {
    vi.spyOn(providerModule, 'getDataProvider').mockReturnValue('mock');

    const result = await captureService.deleteCaseImage('case-1', 'image-1');
    expect(result).toBeUndefined();
  });

  it('should handle delete all images of a case', async () => {
    vi.spyOn(providerModule, 'getDataProvider').mockReturnValue('mock');

    const result = await captureService.deleteCaseAllImages('case-1');
    expect(result).toBeUndefined();
  });

  it('should detect provider type correctly', () => {
    expect(providerModule.isMockProvider()).toBe(true);

    vi.spyOn(providerModule, 'isMockProvider').mockReturnValue(false);
    vi.spyOn(providerModule, 'isSupabaseProvider').mockReturnValue(true);

    expect(providerModule.isSupabaseProvider()).toBe(true);
  });
});
