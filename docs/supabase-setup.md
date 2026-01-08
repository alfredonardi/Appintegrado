# Supabase Setup Guide

Este guia descreve como configurar o Supabase para usar como data provider no Appintegrado.

## Índice

1. [Criar Projeto Supabase](#criar-projeto-supabase)
2. [Configurar Banco de Dados](#configurar-banco-de-dados)
3. [Configurar Storage](#configurar-storage)
4. [Configurar Variáveis de Ambiente](#configurar-variáveis-de-ambiente)
5. [Testar a Integração](#testar-a-integração)

---

## Criar Projeto Supabase

### 1. Acesse o console Supabase

- Vá até [https://app.supabase.com](https://app.supabase.com)
- Crie uma conta ou faça login
- Clique em "New Project"

### 2. Crie um novo projeto

- **Name**: Appintegrado (ou seu nome de preferência)
- **Database Password**: Escolha uma senha forte
- **Region**: Selecione a região mais próxima (ex: South America - São Paulo)
- Clique em "Create new project"

### 3. Aguarde a inicialização

O projeto levará alguns minutos para ser criado. Você verá a página do projeto quando estiver pronto.

### 4. Obtenha as credenciais

Você encontrará as credenciais em **Project Settings > API**:

- **Project URL**: Este é seu `VITE_SUPABASE_URL`
- **Anon public key**: Este é seu `VITE_SUPABASE_ANON_KEY`

Copie essas credenciais, você vai precisar delas mais tarde.

---

## Configurar Banco de Dados

### 1. Acesse o SQL Editor

No console Supabase:
- Clique em "SQL Editor" no menu esquerdo
- Clique em "New Query"

### 2. Crie a tabela `cases`

```sql
-- Criar tabela cases
CREATE TABLE IF NOT EXISTS cases (
  id TEXT PRIMARY KEY,
  bo TEXT NOT NULL UNIQUE,
  natureza TEXT DEFAULT '',
  dataHoraFato TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  endereco TEXT DEFAULT '',
  cep TEXT DEFAULT '',
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  circunscricao TEXT DEFAULT '',
  unidade TEXT DEFAULT '',
  status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'em_revisao', 'finalizado')),
  team JSONB DEFAULT '[]'::jsonb,
  events JSONB DEFAULT '[]'::jsonb,
  photos JSONB DEFAULT '[]'::jsonb,
  fieldValues JSONB DEFAULT '[]'::jsonb,
  aiExtractions JSONB DEFAULT '[]'::jsonb,
  recognition JSONB DEFAULT '{}'::jsonb,
  photoReport JSONB DEFAULT '{}'::jsonb,
  investigationReport JSONB DEFAULT '{}'::jsonb,
  generatedPDFs JSONB DEFAULT '[]'::jsonb,
  auditLog JSONB DEFAULT '[]'::jsonb,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_created_at ON cases(createdAt DESC);
```

Execute a query clicando em "Run".

### 3. Crie a tabela `clients`

```sql
-- Criar tabela clients
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT DEFAULT '',
  document TEXT NOT NULL UNIQUE,
  documentType TEXT NOT NULL CHECK (documentType IN ('cpf', 'cnpj')),
  address TEXT DEFAULT '',
  cep TEXT DEFAULT '',
  city TEXT DEFAULT '',
  state TEXT DEFAULT '',
  country TEXT DEFAULT 'Brasil',
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'bloqueado')),
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_document ON clients(document);
CREATE INDEX idx_clients_created_at ON clients(createdAt DESC);
```

Execute a query clicando em "Run".

### 4. Habilitar Row Level Security (RLS)

Para segurança básica, habilite RLS nas tabelas:

```sql
-- Habilitar RLS
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Criar política: qualquer usuário autenticado pode ler/escrever
CREATE POLICY "Allow authenticated access" ON cases
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated access" ON clients
  FOR ALL
  USING (auth.role() = 'authenticated');
```

Nota: Em produção, implemente políticas RLS mais restritivas baseadas em `auth.uid()`.

---

## Configurar Storage

### 1. Crie um bucket para imagens

No console Supabase:
- Clique em "Storage" no menu esquerdo
- Clique em "New bucket"
- **Bucket name**: `case-images`
- Deixe marcado "Public bucket" (para servir imagens publicamente)
- Clique em "Create bucket"

### 2. Configure as políticas de storage

No bucket `case-images`, clique em "Policies" e adicione:

```
Allow authenticated users to upload images to case-images
Allow public to read images from case-images
```

As políticas padrão do Supabase já devem permitir isso.

---

## Configurar Variáveis de Ambiente

### 1. Crie um arquivo `.env.local` na raiz do projeto

```bash
cp .env.example .env.local
```

### 2. Configure as variáveis Supabase

Abra `.env.local` e atualize:

```env
# Data Provider
VITE_DATA_PROVIDER=supabase

# Supabase Credentials (obtidas em Project Settings > API)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Importante**: Substitua `your-project-id` e a chave pelos valores reais do seu projeto.

### 3. Instale a dependência Supabase

```bash
npm install @supabase/supabase-js
```

---

## Testar a Integração

### 1. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação deve iniciar sem erros. Você verá a mensagem de log:

```
[Provider] Data provider configured: {
  provider: 'supabase',
  isMock: false,
  isHttp: false,
  isSupabase: true,
  ...
}
```

### 2. Teste a funcionalidade de cases

1. Acesse a página Cases no app
2. Clique em "Novo Caso" e crie um caso com BO "TEST-001"
3. Verifique se o caso foi criado (aparece na lista)
4. Abra o caso e edite alguns campos
5. Retorne à lista e verifique se a atualização foi salva

### 3. Teste a funcionalidade de clients (se ativado)

1. Ative `VITE_FEATURE_CLIENTSMODULE=true` em `.env.local`
2. Acesse a página Clients
3. Crie um cliente com CPF válido
4. Verifique se aparece na lista
5. Edite e delete para testar

### 4. Verifique os dados no Supabase

1. No console Supabase, vá para "Table Editor"
2. Selecione a tabela `cases`
3. Verifique se seus casos estão lá com todos os dados corretos
4. Faça o mesmo com a tabela `clients`

### 5. Teste upload de imagens (Capture Module)

Se o módulo Capture estiver habilitado:

1. Abra um caso
2. Acesse a aba "Captura" (se disponível)
3. Upload algumas imagens
4. Verifique no console Supabase > Storage > `case-images` se as imagens foram salvas

---

## Dados de Teste Rápido

Para testar rapidamente, você pode inserir dados de teste no SQL Editor:

```sql
-- Inserir casos de teste
INSERT INTO cases (id, bo, natureza, status) VALUES
('case-001', 'BO-2024-001', 'Roubo', 'rascunho'),
('case-002', 'BO-2024-002', 'Furto', 'em_revisao');

-- Inserir clientes de teste
INSERT INTO clients (id, name, email, phone, document, documentType, status) VALUES
('client-001', 'João Silva', 'joao@example.com', '11999999999', '12345678901', 'cpf', 'ativo'),
('client-002', 'Empresa ABC', 'contact@abc.com', '1133334444', '12345678901234', 'cnpj', 'ativo');
```

---

## Troubleshooting

### Erro: "Supabase is not properly configured"

**Solução**: Verifique se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão definidos em `.env.local`.

### Erro: "Failed to fetch cases: unauthorized"

**Solução**:
- Verifique se a chave anônima está correta
- Verifique se as políticas RLS estão habilitadas corretamente

### Erro: "Cannot find module '@supabase/supabase-js'"

**Solução**: Execute `npm install @supabase/supabase-js`

### Dados não aparecem no app

**Solução**:
- Abra o DevTools (F12) e verifique os logs de erro
- Vá para o SQL Editor no Supabase e execute `SELECT * FROM cases;` para verificar se os dados estão lá
- Verifique se `VITE_DATA_PROVIDER=supabase` está definido

---

## Rollback para Mock

Se você quiser voltar a usar dados mock:

1. Em `.env.local`, altere:
   ```env
   VITE_DATA_PROVIDER=mock
   ```

2. Reinicie o servidor: `npm run dev`

A aplicação voltará a usar os dados mock locais sem nenhuma alteração de código.

---

## Próximos Passos

- Implementar autenticação com Supabase Auth
- Configurar Row Level Security mais robusta
- Adicionar backups automáticos do banco
- Implementar triggers para auditoria automática

---

## Referências

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [SQL Editor Supabase](https://supabase.com/docs/guides/database/overview)
- [Storage Supabase](https://supabase.com/docs/guides/storage/overview)
