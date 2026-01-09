import { describe, it, expect } from 'vitest';
import { isFeatureEnabled, getEnabledFeatures, FEATURE_FLAGS } from '@/config/features';

describe('Feature Flags', () => {
  it('should return true for enabled features', () => {
    // Core features should be enabled by default
    expect(isFeatureEnabled('auth')).toBe(true);
    expect(isFeatureEnabled('dashboard')).toBe(true);
    expect(isFeatureEnabled('casesModule')).toBe(true);
  });

  it('should return false for disabled features', () => {
    // reportsModule is disabled by default
    expect(isFeatureEnabled('reportsModule')).toBe(false);
  });

  it('should provide FEATURE_FLAGS object with all features', () => {
    expect(FEATURE_FLAGS).toBeDefined();
    expect(typeof FEATURE_FLAGS.auth).toBe('boolean');
    expect(typeof FEATURE_FLAGS.casesModule).toBe('boolean');
    expect(typeof FEATURE_FLAGS.clientsModule).toBe('boolean');
  });

  it('should return enabled features array', () => {
    const enabledFeatures = getEnabledFeatures();

    expect(Array.isArray(enabledFeatures)).toBe(true);
    expect(enabledFeatures.length).toBeGreaterThan(0);

    // At least auth and dashboard should be enabled
    expect(enabledFeatures).toContain('auth');
    expect(enabledFeatures).toContain('casesModule');
  });

  it('should not include disabled features in enabled list', () => {
    const enabledFeatures = getEnabledFeatures();

    // reportsModule is disabled by default
    expect(enabledFeatures).not.toContain('reportsModule');
  });
});
