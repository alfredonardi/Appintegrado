/**
 * Storage Migration Utility
 * Migra dados de localStorage de "Appintegrado" para "Atlas"
 * Mantém fallback automático: se chave nova não existir e antiga existir, copia e limpa
 */

const MIGRATIONS = [
  { old: 'casehub-storage', new: 'atlas-storage' },
  { old: 'casehub-auth-token', new: 'atlas-auth-token' },
  { old: 'casehub-auth-user', new: 'atlas-auth-user' },
  { old: 'appintegrado-capture', new: 'atlas-capture' },
  { old: 'appintegrado-photo-report', new: 'atlas-photo-report' },
];

/**
 * Executa a migração de localStorage
 * Deve ser chamado na inicialização da app (main.tsx ou App.tsx)
 */
export function migrateStorageKeys(): void {
  try {
    MIGRATIONS.forEach(({ old, new: newKey }) => {
      // Se chave nova já existe, não faz nada
      if (localStorage.getItem(newKey)) {
        return;
      }

      // Se chave antiga existe, copia para nova e remove antiga
      const oldValue = localStorage.getItem(old);
      if (oldValue) {
        localStorage.setItem(newKey, oldValue);
        localStorage.removeItem(old);
        console.log(`[Storage Migration] Migrated ${old} → ${newKey}`);
      }
    });
  } catch (error) {
    console.error('[Storage Migration] Error during migration:', error);
    // Não falha a app se houver erro na migração
  }
}

/**
 * Limpa dados antigos de localStorage (após confirmar que migração foi bem-sucedida)
 * Útil para manutenção posterior
 */
export function cleanOldStorageKeys(): void {
  try {
    MIGRATIONS.forEach(({ old }) => {
      if (localStorage.getItem(old)) {
        localStorage.removeItem(old);
        console.log(`[Storage Cleanup] Removed old key: ${old}`);
      }
    });
  } catch (error) {
    console.error('[Storage Cleanup] Error during cleanup:', error);
  }
}
