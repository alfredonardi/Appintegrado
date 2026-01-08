import { isFeatureEnabled, type FeatureFlagKey } from '../config/features';

/**
 * useFeature - Hook para verificar se uma feature está ativada
 *
 * Uso:
 * const isClientsEnabled = useFeature('clientsModule');
 *
 * if (isClientsEnabled) {
 *   return <ClientsPage />;
 * }
 */
export function useFeature(featureKey: FeatureFlagKey): boolean {
  return isFeatureEnabled(featureKey);
}
