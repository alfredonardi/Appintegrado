import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCaptureStore } from '@/state/captureStore';

// Mock captureService to avoid API calls
vi.mock('@/services/captureService', () => ({
  captureService: {
    uploadCaseImages: vi.fn(() => Promise.resolve([])),
    deleteCaseImage: vi.fn(() => Promise.resolve(undefined)),
    deleteCaseAllImages: vi.fn(() => Promise.resolve(undefined)),
  },
}));

// Mock provider detection
vi.mock('@/services/provider', () => ({
  isSupabaseProvider: vi.fn(() => true),
  isHttpProvider: vi.fn(() => false),
  getDataProvider: vi.fn(() => 'supabase'),
}));

describe('CaptureStore (Zustand)', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    const { result } = renderHook(() => useCaptureStore());
    act(() => {
      result.current.imagesByCaseId = {};
    });
  });

  it('should initialize with empty images', () => {
    const { result } = renderHook(() => useCaptureStore());
    expect(result.current.getImages('case-1')).toEqual([]);
  });

  it('should handle setting images for a case', () => {
    const { result } = renderHook(() => useCaptureStore());

    const mockImages = [
      {
        id: 'img-1',
        caseId: 'case-1',
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
        url: 'data:image/jpeg;base64,...',
        createdAt: new Date().toISOString(),
      },
    ];

    act(() => {
      result.current.setImages('case-1', mockImages);
    });

    expect(result.current.getImages('case-1')).toEqual(mockImages);
    expect(result.current.getImages('case-1').length).toBe(1);
  });

  it('should clear case images', () => {
    const { result } = renderHook(() => useCaptureStore());

    const mockImages = [
      {
        id: 'img-1',
        caseId: 'case-1',
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
        url: 'data:image/jpeg;base64,...',
        createdAt: new Date().toISOString(),
      },
    ];

    act(() => {
      result.current.setImages('case-1', mockImages);
    });
    expect(result.current.getImages('case-1').length).toBe(1);

    act(() => {
      result.current.clearCaseImages('case-1');
    });
    expect(result.current.getImages('case-1')).toEqual([]);
  });

  it('should return empty array for non-existent case', () => {
    const { result } = renderHook(() => useCaptureStore());
    expect(result.current.getImages('non-existent-case')).toEqual([]);
  });

  it('should handle removeImage action', () => {
    const { result } = renderHook(() => useCaptureStore());

    const mockImages = [
      {
        id: 'img-1',
        caseId: 'case-1',
        name: 'test1.jpg',
        size: 1024,
        type: 'image/jpeg',
        url: 'data:image/jpeg;base64,...',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'img-2',
        caseId: 'case-1',
        name: 'test2.jpg',
        size: 2048,
        type: 'image/jpeg',
        url: 'data:image/jpeg;base64,...',
        createdAt: new Date().toISOString(),
      },
    ];

    act(() => {
      result.current.setImages('case-1', mockImages);
    });
    expect(result.current.getImages('case-1').length).toBe(2);

    act(() => {
      result.current.removeImage('case-1', 'img-1');
    });

    const remaining = result.current.getImages('case-1');
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe('img-2');
  });

  it('should handle multiple cases independently', () => {
    const { result } = renderHook(() => useCaptureStore());

    const imagesCase1 = [
      {
        id: 'img-1',
        caseId: 'case-1',
        name: 'test1.jpg',
        size: 1024,
        type: 'image/jpeg',
        url: 'data:image/jpeg;base64,...',
        createdAt: new Date().toISOString(),
      },
    ];

    const imagesCase2 = [
      {
        id: 'img-2',
        caseId: 'case-2',
        name: 'test2.jpg',
        size: 2048,
        type: 'image/jpeg',
        url: 'data:image/jpeg;base64,...',
        createdAt: new Date().toISOString(),
      },
    ];

    act(() => {
      result.current.setImages('case-1', imagesCase1);
      result.current.setImages('case-2', imagesCase2);
    });

    expect(result.current.getImages('case-1')).toEqual(imagesCase1);
    expect(result.current.getImages('case-2')).toEqual(imagesCase2);
  });
});
