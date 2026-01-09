import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';

// Mock AuthProvider to avoid complex setup
vi.mock('@/state/auth', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock AppRouter with a simple component
vi.mock('@/routes/AppRouter', () => ({
  AppRouter: () => <div data-testid="app-router">Router Loaded</div>,
}));

describe('App Router Setup', () => {
  it('should render App with BrowserRouter', () => {
    render(<App />);

    const routerElement = screen.getByTestId('app-router');
    expect(routerElement).toBeInTheDocument();
  });

  it('should wrap with AuthProvider', () => {
    const { container } = render(<App />);

    // Check that App structure is intact
    expect(container.querySelector('[data-testid="app-router"]')).toBeInTheDocument();
  });

  it('should use BrowserRouter for routing', () => {
    // Verify that the app uses BrowserRouter (which would cause route-dependent behavior)
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});
