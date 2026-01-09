/**
 * Organization types - Delegacias
 * Estrutura de organizações e times para Nhost
 */

// Role de usuário dentro de uma organização
export type UserRole = 'chief' | 'delegate' | 'investigator' | 'photographer';

// Membro de time
export interface TeamMemberUser {
  id: string;
  user_id: string;
  team_id: string;
  role: UserRole;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Time/Equipe dentro de uma organização
export interface Team {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  members?: TeamMemberUser[];
}

// Organização (Delegacia)
export interface Organization {
  id: string;
  name: string;
  description?: string;
  location?: string;
  created_at: string;
  updated_at: string;
  teams?: Team[];
}

// User extendido com organização e time
export interface NhostUser {
  id: string;
  email: string;
  name?: string;
  organization_id?: string;
  team_id?: string;
  role: UserRole;
}

// Session info
export interface NhostSession {
  user: NhostUser;
  accessToken: string;
  refreshToken?: string;
}
