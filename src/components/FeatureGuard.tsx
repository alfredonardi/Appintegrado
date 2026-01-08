import { ReactNode } from 'react';
import { useFeature, type FeatureFlagKey } from '../hooks/useFeature';

/**
 * FeatureGuard - Componente para proteger features por flag
 *
 * Renderiza children se feature está ativada, senão renderiza fallback (default: null)
 *
 * Uso:
 * <FeatureGuard feature="clientsModule">
 *   <ClientsMenu />
 * </FeatureGuard>
 *
 * Com fallback:
 * <FeatureGuard feature="clientsModule" fallback={<DisabledMessage />}>
 *   <ClientsMenu />
 * </FeatureGuard>
 */

interface FeatureGuardProps {
  feature: FeatureFlagKey;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGuard({ feature, children, fallback = null }: FeatureGuardProps) {
  const isEnabled = useFeature(feature);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
