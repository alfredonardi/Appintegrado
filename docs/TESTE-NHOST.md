# Guia de Testes - Integração Nhost

Documento de testes manuais para validar a integração Nhost com AppIntegrado.

## 1. Testes de Mock Mode (Sem Nhost)

### Teste 1.1: Build com Mock Mode

**Objetivo**: Garantir que a aplicação continua funcionando sem Nhost.

**Setup**:
```bash
# Remover variáveis Nhost (ou não configurá-las)
unset VITE_NHOST_AUTH_URL
unset VITE_NHOST_GRAPHQL_URL
unset VITE_DATA_PROVIDER

# Garantir que mock está ativo
echo "VITE_DATA_PROVIDER=mock" >> .env.local
```

**Executar**:
```bash
npm run build
npm run dev
```

**Esperado**:
- ✅ Build passa sem erros
- ✅ App inicia em http://localhost:5173
- ✅ Console mostra: `[Provider] Data provider configured: { provider: 'mock', isMock: true }`

**Teste Executado**: __________

---

### Teste 1.2: Login com Mock (Qualquer Email/Senha)

**Objetivo**: Validar autenticação mock sem Nhost.

**Ação**:
1. Abrir http://localhost:5173
2. Clique em "Login"
3. Email: `investigador@test.local`
4. Senha: `123456`
5. Clique em "Entrar"

**Esperado**:
- ✅ Login aceita qualquer email/senha (não-vazio)
- ✅ Redireciona para `/cases` (Meus Casos)
- ✅ Header mostra: "Investigador" (primeira parte do email)
- ✅ localStorage contém `casehub-auth-token` e `casehub-auth-user`

**Teste Executado**: __________

---

### Teste 1.3: Listar Casos Mock

**Objetivo**: Validar carregamento de casos no modo mock.

**Ação**:
1. Após login em teste 1.2
2. Ir para `/my-cases`
3. Verificar tabela de casos

**Esperado**:
- ✅ Carrega lista de casos mock (vários exemplos)
- ✅ Cada caso mostra: BO, Natureza, Data/Hora, Endereço, Status
- ✅ Botão "Abrir" funciona → abre o caso
- ✅ Filtros funcionam (por status, search)

**Teste Executado**: __________

---

### Teste 1.4: Compartilhamento com Chefia (Mock)

**Objetivo**: Validar toggle de compartilhamento sem Nhost.

**Ação**:
1. Na tela `/my-cases`
2. Clique em um caso → "Abrir" → vai para `/cases/{id}`
3. Clique em "Editar" ou vá para `/cases/{id}/edit`
4. Procure por "Compartilhar com Chefia"
5. Clique no checkbox para ativar
6. Clique em "Salvar Alterações"

**Esperado**:
- ✅ Checkbox pode ser clicado
- ✅ Box fica verde quando ativado
- ✅ Após salvar, volta à lista
- ✅ Caso agora aparece com ícone de compartilhamento
- ✅ localStorage foi atualizado

**Teste Executado**: __________

---

### Teste 1.5: Logout com Mock

**Objetivo**: Validar saída da sessão.

**Ação**:
1. Na tela principal (após login em 1.2)
2. Clique no ícone de usuário (canto superior direito)
3. Clique em "Sair"

**Esperado**:
- ✅ Redireciona para `/login`
- ✅ localStorage limpo (sem tokens)
- ✅ Pode fazer novo login

**Teste Executado**: __________

---

## 2. Testes com Nhost (Integração Real)

### Pré-requisito: Setup Nhost

Antes de executar testes 2.1+:

1. Criar conta em https://nhost.io
2. Criar novo projeto (free tier)
3. Anotar **Backend URL**: `https://your-project-xxxxx.nhost.app`
4. Executar SQL migrations (seção 4 do nhost-setup.md)
5. Criar 3 usuários:
   - **User A** (Investigador):
     - Email: `investigator@test.com`
     - Senha: `TestPassword123!`
     - Role: `investigator`
     - Team: `Team A`
   - **User B** (Chefe):
     - Email: `chief@test.com`
     - Senha: `TestPassword123!`
     - Role: `chief`
     - Organização: mesma de User A
   - **User C** (Outro time):
     - Email: `other@test.com`
     - Senha: `TestPassword123!`
     - Role: `investigator`
     - Team: `Team B`
     - Organização: mesma

---

### Teste 2.1: Build com Nhost

**Objetivo**: Garantir que a aplicação compila com Nhost configurado.

**Setup**:
```bash
# Configurar env vars
echo "VITE_DATA_PROVIDER=nhost" >> .env.local
echo "VITE_NHOST_AUTH_URL=https://<subdomain>.auth.<region>.nhost.run/v1
VITE_NHOST_GRAPHQL_URL=https://<subdomain>.graphql.<region>.nhost.run/v1" >> .env.local
```

**Executar**:
```bash
npm run build
npm run dev
```

**Esperado**:
- ✅ Build passa sem erros
- ✅ App inicia
- ✅ Console mostra: `[Provider] Data provider configured: { provider: 'nhost', isNhost: true }`

**Teste Executado**: __________

---

### Teste 2.2: Login com Nhost (User A)

**Objetivo**: Validar autenticação Nhost.

**Ação**:
1. Abrir http://localhost:5173
2. Email: `investigator@test.com`
3. Senha: `TestPassword123!`
4. Clique em "Entrar"

**Esperado**:
- ✅ Login bem-sucedido
- ✅ Redireciona para `/my-cases`
- ✅ Header mostra: "investigator" (do email)
- ✅ localStorage contém `nhost-auth-token` e `nhost-auth-user`
- ✅ Console sem erros de autenticação

**Nota**: Se falhar, verifique:
- Backend URL está correto
- User existe em Nhost Auth
- Senha está correta
- Network request POST /auth/sign-in (DevTools > Network)

**Teste Executado**: __________

---

### Teste 2.3: Casos Visíveis do Time (User A)

**Objetivo**: Validar que investigador vê apenas casos do seu time.

**Ação**:
1. Após login com User A (teste 2.2)
2. Ir para `/my-cases`
3. Observar lista de casos

**Esperado**:
- ✅ Vê apenas casos de `Team A` (criados por User A)
- ✅ Não vê casos de `Team B` (User C)
- ✅ Casos aparecem com informações corretas (BO, status, etc.)
- ✅ Botão "Compartilhar" está disponível

**Debug**:
Se nenhum caso aparecer:
1. Verifique se casos foram criados para `Team A` no Nhost Console
2. Verifique RLS policies estão corretas
3. Teste GraphQL query diretamente no Hasura:
   ```graphql
   query {
     cases(where: { team_id: { _eq: "TEAM_A_ID" } }) {
       id
       bo
     }
   }
   ```

**Teste Executado**: __________

---

### Teste 2.4: Compartilhamento com Chefia (User A)

**Objetivo**: Validar toggle de compartilhamento com Nhost.

**Setup**: User A logado com casos de Team A visíveis.

**Ação**:
1. Na tela `/my-cases`
2. Clique no ícone de cadeado/compartilhamento para um caso
3. Aguarde animação de loading desaparecer
4. Ícone muda para verde e fica de compartilhamento (Share2 icon)

**Esperado**:
- ✅ Ícone muda para verde após clique
- ✅ Nenhum erro no console
- ✅ Network request: `POST /graphql` com mutation `SHARE_CASE_WITH_ORG`
- ✅ Response sucesso retorna `{ shared_with_org: true }`
- ✅ Caso fica destacado como compartilhado

**Teste Executado**: __________

---

### Teste 2.5: Chief Vê Casos Compartilhados (User B)

**Objetivo**: Validar que chefe vê casos compartilhados da organização.

**Setup**:
1. User A tem pelo menos 1 caso compartilhado (teste 2.4)
2. Fazer logout de User A

**Ação**:
1. Abrir http://localhost:5173/login
2. Email: `chief@test.com`
3. Senha: `TestPassword123!`
4. Clique em "Entrar"
5. Ir para `/my-cases`

**Esperado**:
- ✅ Login bem-sucedido com Chief
- ✅ Vê casos do seu próprio time (se houver)
- ✅ Vê casos compartilhados de User A (Team A com `shared_with_org=true`)
- ✅ Não vê casos de outros times que não foram compartilhados
- ✅ Filtertoggle "Compartilhados" funciona

**Teste Executado**: __________

---

### Teste 2.6: Isolamento de Times

**Objetivo**: Validar que times são isolados (User C não vê User A).

**Setup**:
1. User A tem casos compartilhados ou não
2. Fazer logout de User B

**Ação**:
1. Abrir http://localhost:5173/login
2. Email: `other@test.com` (User C - Team B)
3. Senha: `TestPassword123!`
4. Clique em "Entrar"
5. Ir para `/my-cases`

**Esperado**:
- ✅ Login bem-sucedido
- ✅ Vê apenas casos de `Team B` (seu time)
- ✅ NÃO vê casos de `Team A` (User A)
- ✅ Mesmo se caso de User A for compartilhado, não aparece
  - (Porque compartilhamento é só para chefes da ORG)

**Teste Executado**: __________

---

### Teste 2.7: Logout com Nhost

**Objetivo**: Validar logout com Nhost.

**Setup**: User A logado.

**Ação**:
1. Clique no ícone de usuário (canto superior direito)
2. Clique em "Sair"

**Esperado**:
- ✅ Network request: `POST /auth/sign-out`
- ✅ Redireciona para `/login`
- ✅ localStorage limpo
- ✅ Pode fazer novo login

**Teste Executado**: __________

---

## 3. Testes de Edge Cases

### Teste 3.1: Sem VITE_NHOST_AUTH_URL/VITE_NHOST_GRAPHQL_URL

**Objetivo**: Validar mensagem de erro amigável.

**Setup**:
```bash
echo "VITE_DATA_PROVIDER=nhost" >> .env.local
# Não configure VITE_NHOST_AUTH_URL/VITE_NHOST_GRAPHQL_URL
```

**Executar**:
```bash
npm run dev
```

**Ação**:
1. Abrir http://localhost:5173/login
2. Tentar fazer login

**Esperado**:
- ✅ Console error: "VITE_NHOST_AUTH_URL/VITE_NHOST_GRAPHQL_URL não está configurado"
- ✅ UI exibe mensagem de erro clara
- ✅ App não trava

**Teste Executado**: __________

---

### Teste 3.2: Nhost Down/Unreachable

**Objetivo**: Validar graceful degradation.

**Setup**:
```bash
# Configurar URL incorreta (simular backend down)
echo "VITE_NHOST_AUTH_URL=https://invalid-xxx.auth.<region>.nhost.run/v1
VITE_NHOST_GRAPHQL_URL=https://invalid-xxx.graphql.<region>.nhost.run/v1" >> .env.local
```

**Ação**:
1. Tentar fazer login com credenciais válidas

**Esperado**:
- ✅ Erro exibido: "Falha ao conectar..."
- ✅ Não trava
- ✅ Pode tentar novamente
- ✅ Console mostra erro de network

**Teste Executado**: __________

---

### Teste 3.3: Session Persistence

**Objetivo**: Validar que sessão persiste após refresh.

**Setup**: User A logado com Nhost.

**Ação**:
1. Ir para `/my-cases` (verificar casos carregados)
2. Pressionar F5 (refresh page)
3. Aguardar carregamento

**Esperado**:
- ✅ Usuário continua logado
- ✅ Header exibe usuário
- ✅ Não redireciona para login
- ✅ Casos carregam novamente

**Teste Executado**: __________

---

## 4. Resumo de Testes

### Mock Mode
- [ ] Teste 1.1: Build com Mock Mode
- [ ] Teste 1.2: Login com Mock
- [ ] Teste 1.3: Listar Casos Mock
- [ ] Teste 1.4: Compartilhamento Mock
- [ ] Teste 1.5: Logout com Mock

### Nhost Integration
- [ ] Teste 2.1: Build com Nhost
- [ ] Teste 2.2: Login com Nhost
- [ ] Teste 2.3: Casos do Time
- [ ] Teste 2.4: Compartilhamento Nhost
- [ ] Teste 2.5: Chief Vê Compartilhados
- [ ] Teste 2.6: Isolamento de Times
- [ ] Teste 2.7: Logout com Nhost

### Edge Cases
- [ ] Teste 3.1: Sem Backend URL
- [ ] Teste 3.2: Backend Down
- [ ] Teste 3.3: Session Persistence

---

## 5. Checklist Final

Antes de marcar como pronto:

- [ ] npm run build passa
- [ ] npm run dev inicia sem erros
- [ ] Mock mode funciona (sem Nhost)
- [ ] Nhost login funciona (com credentials válidas)
- [ ] Permissões RLS funcionam (times isolados)
- [ ] Compartilhamento funciona (chefes veem casos)
- [ ] Logout funciona
- [ ] Console sem erros críticos
- [ ] localStorage funciona
- [ ] UI responsiva em mobile/tablet

---

**Data dos Testes**: ____________________

**Testador**: ____________________

**Status Final**: ⚪ Não Iniciado | 🟡 Em Progresso | 🟢 Concluído | 🔴 Falhou

**Notas**:
```
[Adicionar notas/issues encontradas]
```
