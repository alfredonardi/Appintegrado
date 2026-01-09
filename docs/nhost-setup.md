# Nhost Setup Guide - AppIntegrado

Guia completo para configurar Nhost (Postgres + Hasura GraphQL + Auth + Storage) para o AppIntegrado.

## 1. Visão Geral

O AppIntegrado migrará o backend para **Nhost** com os seguintes componentes:

- **PostgreSQL**: Banco de dados com tabelas para organizações, times, casos
- **Hasura**: GraphQL API com Row-Level Security (RLS)
- **Nhost Auth**: Autenticação com email/password e session management
- **Nhost Storage**: Para armazenar evidências fotográficas (futuro)

### Arquitetura de Permissões

```
┌──────────────────────────────┐
│   Usuário Autenticado        │
│   (via Nhost Auth)           │
└──────────────┬───────────────┘
               │
       ┌───────┴────────┐
       │                │
    ┌──▼──┐        ┌────▼──┐
    │Inv. │        │Chief  │
    │gate │        │Delegate│
    │or   │        └────┬──┘
    └──┬──┘             │
       │         ┌──────┴────────────┐
       │         │                   │
       ├─►Próprio team      Casos compartilhados
       │  (todos)          (shared_with_org=true)
       │                   (organization_id match)
       │
    ├──► Não vê outros times
    └──► Pode compartilhar com chefia
```

## 2. Pré-requisitos

1. **Conta Nhost**: https://nhost.io (crie uma free account)
2. **Node.js**: 18+
3. **Git**: Para versionamento de migrations

## 3. Criar Projeto Nhost

### 3.1 Criar Novo Projeto

1. Acesse https://console.nhost.io
2. Clique em "New Project"
3. Selecione "Europe" (ou sua região)
4. Aguarde a inicialização (~2 minutos)
5. Anote:
   - **Backend URL**: `https://your-project-xxxxx.nhost.app`
   - **API Endpoint**: `https://your-project-xxxxx.nhost.app/graphql`

## 4. Schema Database

Execute as seguintes SQL migrations via Hasura Console > Data > SQL:

### 4.1 Criar Tabela: Organizations (Delegacias)

```sql
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer usuário pode ver sua própria organização
CREATE POLICY "Users can view their organization"
  ON public.organizations
  FOR SELECT
  USING (id = (
    SELECT organization_id FROM public.users
    WHERE auth_id = auth.uid()
  ));

-- Política: Apenas admins podem editar
CREATE POLICY "Only admins can update organizations"
  ON public.organizations
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.users
    WHERE auth_id = auth.uid()
    AND organization_id = organizations.id
    AND role = 'chief'
  ));
```

### 4.2 Criar Tabela: Teams

```sql
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Política: Ver times da sua organização
CREATE POLICY "Users can view teams in their organization"
  ON public.teams
  FOR SELECT
  USING (organization_id = (
    SELECT organization_id FROM public.users
    WHERE auth_id = auth.uid()
  ));
```

### 4.3 Criar Tabela: Users (Mapping com Auth)

```sql
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  organization_id uuid REFERENCES public.organizations(id),
  team_id uuid REFERENCES public.teams(id),
  role text NOT NULL DEFAULT 'investigator',
    -- 'chief', 'delegate', 'investigator', 'photographer'
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Índices para performance
CREATE INDEX idx_users_auth_id ON public.users(auth_id);
CREATE INDEX idx_users_organization_id ON public.users(organization_id);
CREATE INDEX idx_users_team_id ON public.users(team_id);

-- Política: Usuários veem apenas a si mesmos
CREATE POLICY "Users can view themselves"
  ON public.users
  FOR SELECT
  USING (auth_id = auth.uid());

-- Política: Chefes veem todos os usuários da organização
CREATE POLICY "Chiefs can view users in their organization"
  ON public.users
  FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id FROM public.users
      WHERE auth_id = auth.uid()
    )
    AND (
      SELECT role FROM public.users
      WHERE auth_id = auth.uid()
    ) IN ('chief', 'delegate')
  );
```

### 4.4 Criar Tabela: Cases (Casos)

```sql
CREATE TABLE public.cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Dados básicos
  bo text NOT NULL,
  natureza text,
  dataHoraFato timestamptz DEFAULT now(),

  -- Localização
  endereco text,
  cep text,
  bairro text,
  cidade text,
  estado text,

  -- Jurisdição
  circunscricao text,
  unidade text,

  -- Status
  status text NOT NULL DEFAULT 'rascunho',
    -- 'rascunho', 'em_revisao', 'finalizado'

  -- Organização e time
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,

  -- Compartilhamento com chefia
  shared_with_org boolean DEFAULT false,

  -- Auditoria
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.users(id)
);

ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- Índices
CREATE INDEX idx_cases_team_id ON public.cases(team_id);
CREATE INDEX idx_cases_organization_id ON public.cases(organization_id);
CREATE INDEX idx_cases_shared_with_org ON public.cases(shared_with_org);
CREATE INDEX idx_cases_created_by ON public.cases(created_by);

-- Política: Investigadores veem casos do seu time
CREATE POLICY "Investigators see their team cases"
  ON public.cases
  FOR SELECT
  USING (
    team_id = (
      SELECT team_id FROM public.users
      WHERE auth_id = auth.uid()
    )
  );

-- Política: Chefes/delegados veem casos compartilhados da organização
CREATE POLICY "Chiefs see shared organization cases"
  ON public.cases
  FOR SELECT
  USING (
    shared_with_org = true
    AND organization_id = (
      SELECT organization_id FROM public.users
      WHERE auth_id = auth.uid()
    )
    AND (
      SELECT role FROM public.users
      WHERE auth_id = auth.uid()
    ) IN ('chief', 'delegate')
  );

-- Política: Criar casos apenas no seu time
CREATE POLICY "Users can create cases in their team"
  ON public.cases
  FOR INSERT
  WITH CHECK (
    team_id = (
      SELECT team_id FROM public.users
      WHERE auth_id = auth.uid()
    )
    AND organization_id = (
      SELECT organization_id FROM public.users
      WHERE auth_id = auth.uid()
    )
  );

-- Política: Editar apenas casos do seu time
CREATE POLICY "Users can update their team cases"
  ON public.cases
  FOR UPDATE
  USING (
    team_id = (
      SELECT team_id FROM public.users
      WHERE auth_id = auth.uid()
    )
  )
  WITH CHECK (
    team_id = (
      SELECT team_id FROM public.users
      WHERE auth_id = auth.uid()
    )
  );

-- Política: Deletar apenas casos do seu time
CREATE POLICY "Users can delete their team cases"
  ON public.cases
  FOR DELETE
  USING (
    team_id = (
      SELECT team_id FROM public.users
      WHERE auth_id = auth.uid()
    )
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_cases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cases_updated_at_trigger
BEFORE UPDATE ON public.cases
FOR EACH ROW
EXECUTE FUNCTION update_cases_updated_at();
```

## 5. Configuração Hasura

### 5.1 Ativar GraphQL API

1. Vá para **Data** > **GraphQL API**
2. Garanta que a API está habilitada (default)
3. Copie o **GraphQL Endpoint**

### 5.2 Configurar Autenticação via JWT

1. Vá para **Settings** > **Hasura Settings**
2. Clique em **Nhost Webhooks** > **Enable Nhost Integration**
3. Isso liga automaticamente JWT auth

### 5.3 Rastrear Tabelas

1. Vá para **Data** > **default** (database)
2. Para cada tabela criada (`organizations`, `teams`, `users`, `cases`):
   - Clique em **Track All Tables** ou selecione manualmente
   - Garanta que todas as colunas estão rastreadas

### 5.4 Testar GraphQL Query

Vá para **GraphQL** e teste:

```graphql
query GetCases {
  cases(
    where: { team_id: { _eq: "YOUR_TEAM_ID" } }
    order_by: { created_at: desc }
  ) {
    id
    bo
    status
    shared_with_org
    created_at
  }
}
```

## 6. Configuração Frontend

### 6.1 Variáveis de Ambiente

Adicione ao `.env.local` (NÃO commitar!):

```bash
# Data Provider
VITE_DATA_PROVIDER=nhost

# Nhost Configuration
VITE_NHOST_BACKEND_URL=https://your-project-xxxxx.nhost.app
```

### 6.2 Feature Flags (opcional)

```bash
VITE_FEATURE_AUTH=true
VITE_FEATURE_CASESMODULE=true
```

### 6.3 Build & Teste

```bash
# Instalar dependências (se necessário)
npm install

# Build (deve passar)
npm run build

# Dev server
npm run dev

# Abrir http://localhost:5173
```

## 7. Fluxo de Autenticação

### 7.1 Login

```
Usuário entra: email + password
         ↓
AuthContext.login()
         ↓
isNhostProvider() = true?
         ↓ YES
NhostClient.signIn()
         ↓
POST /auth/sign-in/email-password
         ↓
Nhost Auth retorna: { session: { user, accessToken, refreshToken } }
         ↓
Salvar em localStorage + state
         ↓
Redirecionar para Dashboard
```

### 7.2 CasesService - Listagem

```
casesService.getCases()
         ↓
getDataProvider() = 'nhost'?
         ↓ YES
casesServiceNhost.getCases()
         ↓
getNhostClient().graphQL(LIST_MY_CASES)
         ↓
Hasura + RLS filtra automaticamente:
  - SELECT cases
    WHERE team_id = current_user_team
         ↓
Retornar casos do time
```

### 7.3 Compartilhamento com Chefia

```
CaseEdit.tsx: toggle "Compartilhar com chefia"
         ↓
casesService.updateCase(id, { shared_with_org: true })
         ↓
Nhost GraphQL mutation UPDATE_CASE
         ↓
RLS permite UPDATE se:
  - team_id = current_user_team
  - (sempre pode mudar shared_with_org)
         ↓
Case aparece para chefes/delegados:
  - SELECT cases
    WHERE organization_id = chief_org
    AND shared_with_org = true
```

## 8. Migrations e Versionamento

### 8.1 Exportar Schema

```bash
# Via Hasura CLI (opcional)
hasura migrate create initial_setup --from-server

# Ou manualmente (melhor para Nhost free tier)
# Copie o SQL das seções 4.1-4.4 para um arquivo
# docs/migrations/001_initial_schema.sql
```

### 8.2 Backup

1. Vá para **Settings** > **Backups**
2. Habilite backups automáticos (premium) ou faça backup manual

## 9. Testes Manuais

### 9.1 Teste 1: Mock Mode Still Works

```bash
# Resetar env vars
unset VITE_NHOST_BACKEND_URL
unset VITE_DATA_PROVIDER

npm run dev

# Deve usar mock provider (sem Nhost)
# Login com qualquer email/senha
# Deve ver casos mock
```

### 9.2 Teste 2: Nhost Login

```bash
# Configurar env vars
export VITE_DATA_PROVIDER=nhost
export VITE_NHOST_BACKEND_URL=https://your-project-xxxxx.nhost.app

npm run dev

# Tentar login:
# Email: investigator@example.com
# Senha: (da conta criada em Nhost)
# Deve entrar ou mostrar erro de não-autenticado
```

### 9.3 Teste 3: Permissões

1. Criar 2 usuários no Nhost:
   - User 1: `investigator1@example.com`, role: `investigator`, team: `Team A`
   - User 2: `chief@example.com`, role: `chief`, organization: Mesma org

2. Criar 2 casos com User 1:
   - Caso A: `shared_with_org = false`
   - Caso B: `shared_with_org = true`

3. Verificar permissões:
   - User 1 vê: Caso A, Caso B (próprio time)
   - User 2 vê: Caso B (shared, mesmo org), NÃO vê Caso A

## 10. Troubleshooting

### 10.1 "Nhost client not initialized"

**Causa**: VITE_NHOST_BACKEND_URL não configurado com provider nhost

**Solução**:
```bash
# .env.local
VITE_DATA_PROVIDER=nhost
VITE_NHOST_BACKEND_URL=https://your-project-xxxxx.nhost.app
```

### 10.2 "GraphQL error: not authorized"

**Causa**: User não existe em `public.users`, ou RLS rejeitando query

**Solução**:
1. Verificar se user foi criado no Nhost Auth
2. Verificar se existe entrada em `public.users` com `auth_id = auth.uid()`
3. Verificar RLS policies no Hasura Console

### 10.3 "Cases not loading"

**Causa**: Permissões ou query mal formada

**Solução**:
1. Testar no **Hasura GraphQL Explorer**:
   ```graphql
   query {
     cases {
       id
       bo
       team_id
     }
   }
   ```
2. Verificar logs no Nhost Console > Logs

### 10.4 "Login fails"

**Causa**: Credenciais inválidas ou Nhost endpoint incorreto

**Solução**:
1. Verificar `VITE_NHOST_BACKEND_URL` está correto
2. Verificar usuário existe em Nhost Auth
3. Ver console do browser: DevTools > Network > POST /auth/sign-in

## 11. Próximos Passos

Depois de Nhost estar configurado:

1. **[ETAPA 13]** Implementar tela "Meus Casos" com filtros
2. **[ETAPA 14]** Implementar "Compartilhar com chefia"
3. **[ETAPA 15]** Migrations de dados (casos legados)
4. **[ETAPA 16]** Storage (evidências fotográficas)
5. **[ETAPA 17]** Analytics & Audit logs

## 12. Referências

- Nhost Docs: https://docs.nhost.io
- Hasura RLS: https://hasura.io/docs/latest/auth/authorization/
- PostgreSQL Security: https://www.postgresql.org/docs/current/sql-createrole.html

---

**Última atualização**: 2025-01-09
**Status**: Beta - Pronto para testes
