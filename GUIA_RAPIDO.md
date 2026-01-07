# Guia Rápido - CaseHub

## 🎯 O que é este projeto?

Este é um **wireframe interativo de média fidelidade** da plataforma CaseHub - um sistema para gestão de casos policiais com geração automatizada de documentos integrados.

## 🚀 Principais Funcionalidades

### 1️⃣ Gestão de Casos
- **Onde**: Tela "Casos" (primeira tela)
- **O que faz**: Lista todos os casos com filtros por status, natureza e data
- **Recursos**: Busca, filtros, tabela responsiva, empty state

### 2️⃣ Workspace do Caso
- **Onde**: Clique em "Abrir" em qualquer caso
- **O que faz**: Visão geral completa do caso
- **Recursos**: 
  - Dados principais editáveis
  - Timeline de eventos
  - Equipe responsável
  - Progresso dos 3 relatórios
  - Alertas da IA sobre lacunas

### 3️⃣ Captura & IA
- **Onde**: Sidebar > "Captura & IA"
- **O que faz**: Upload de fotos com classificação automática por IA
- **Recursos**:
  - Dropzone para upload
  - Galeria com filtros
  - Classificação automática
  - Extrações de dados (iluminação, tipo de via, etc.)
  - Cada sugestão mostra confiança (%) e fonte

### 4️⃣ Reconhecimento Visuográfico
- **Onde**: Sidebar > "Reconhecimento"
- **O que faz**: Formulário técnico completo
- **Recursos**:
  - Menu lateral com seções
  - Campos com badges (IA sugeriu / Confirmado / Editado)
  - Indicador de confiança
  - Link para ver fonte (foto)
  - Sidebar mostra onde dados serão reutilizados

### 5️⃣ Relatório Fotográfico
- **Onde**: Sidebar > "Relatório Fotográfico"
- **O que faz**: Monta o álbum de fotos ordenável
- **Recursos**:
  - Drag & drop para reordenar
  - Edição de legendas
  - Preview do PDF em tempo real
  - Controles de layout (1 ou 2 fotos por página)
  - Opções de capa e cabeçalho

### 6️⃣ Relatório de Investigação
- **Onde**: Sidebar > "Relatório de Investigação"
- **O que faz**: Editor estruturado para relatório narrativo
- **Recursos**:
  - Blocos pré-definidos (Resumo, Dinâmica, Vítimas, etc.)
  - Botão "Gerar com IA" por bloco
  - Inserção de evidências
  - Chips mostrando fatos utilizados
  - Área de assinaturas

### 7️⃣ Exportar Pacote
- **Onde**: Sidebar > "Exportar Pacote"
- **O que faz**: Gera pacote completo para compartilhamento
- **Recursos**:
  - Checklist de documentos
  - Avisos de itens incompletos
  - Configuração do nome do arquivo
  - Opções de formato e senha
  - Resumo com total de arquivos e tamanho

## 🎨 Principais Elementos de Design

### Badges de Status
- **Verde** - Confirmado pelo usuário
- **Amarelo** - Sugerido pela IA (aguardando confirmação)
- **Azul** - Editado manualmente

### Ícones com Significado
- 🔍 **Lupa** - Busca
- ✨ **Sparkles** - IA / Sugestões automáticas
- 📷 **Câmera** - Fotos / Captura
- 📄 **Documento** - Relatórios
- 🔗 **Link** - Campos relacionados / Rastreabilidade
- ⚠️ **Alerta** - Avisos / Lacunas

### Cores Principais
- **Azul** (#3B82F6) - Ações principais, links
- **Verde** (#10B981) - Sucesso, confirmado
- **Amarelo** (#F59E0B) - Alerta, IA sugerindo
- **Vermelho** (#EF4444) - Erro, incompleto
- **Cinza** - Neutro, estrutura

## 📱 Responsividade

### Desktop (1440px+)
- Layout completo com 3-4 colunas
- Sidebar sempre visível
- Preview de PDF lado a lado

### Tablet (768px-1439px)
- 2 colunas principais
- Sidebar permanece
- Algumas informações empilham

### Mobile (390px-767px)
- 1 coluna
- Sidebar colapsável (botão ☰)
- Cards empilhados
- Tabelas com scroll horizontal

## 🔑 Conceitos Chave

### Rastreabilidade
Cada dado mostra:
- **De onde veio** (Foto 1, Foto 3, etc.)
- **Confiança da IA** (0-100%)
- **Quem confirmou** (tooltip)
- **Status** (IA / Confirmado / Editado)

### Preencher Uma Vez
- Digite um endereço no Reconhecimento
- Ele aparece automaticamente no Relatório de Investigação
- Sistema indica onde será reutilizado

### Assistência de IA
- Classifica fotos automaticamente
- Extrai dados (iluminação, tipo de via, etc.)
- Gera rascunhos de texto
- Sempre mostra confiança (%)
- Requer confirmação humana

## 🎯 Fluxo de Trabalho Sugerido

1. **Criar Caso** → Preencher dados básicos
2. **Upload de Fotos** → IA classifica e extrai dados
3. **Revisar Extrações** → Confirmar/editar sugestões
4. **Preencher Reconhecimento** → Formulário técnico (reutiliza extrações)
5. **Montar Álbum** → Ordenar fotos e adicionar legendas
6. **Escrever Investigação** → Blocos estruturados (reutiliza tudo)
7. **Exportar** → Gerar pacote completo

## 🛠️ Interações Disponíveis

✅ **Implementadas**:
- Navegação entre telas (Sidebar)
- Sidebar colapsável
- Drag & drop de fotos (Relatório Fotográfico)
- Edição de legendas
- Filtros de tabela (visual)
- Toggle "Somente confirmados"
- Seleção de layout (1/2 fotos)
- Navegação entre blocos (Relatório)

⏳ **Mockadas** (visuais apenas):
- Upload de arquivos
- Geração de PDF
- Busca global
- Confirmação de campos IA
- Edição de formulários
- Salvar/Baixar

## 💡 Dicas de Navegação

- Use o **menu lateral esquerdo** para alternar entre telas
- Clique no **botão com seta** no topo da sidebar para colapsar/expandir
- Na tela Casos, clique em **"Abrir"** para acessar o Workspace
- No Workspace, clique em **"Continuar"** nos cards de progresso
- Explore cada tela para ver os diferentes componentes

## 📊 Dados de Demonstração

Todos os dados são **fictícios**:
- BO: 2025/123456, 2025/123445, etc.
- Endereços: Rua das Flores, Av. Paulista, etc.
- Pessoas: Dr. Carlos Silva, Ana Santos, etc.
- Fotos: Placeholders visuais

## 🎓 Para Desenvolvedores

### Estrutura de Arquivos
```
/src/app/
  ├── App.tsx                    # Main app com roteamento
  ├── components/
  │   ├── Sidebar.tsx           # Navegação lateral
  │   ├── Topbar.tsx            # Barra superior
  │   ├── Toast.tsx             # Notificações
  │   └── screens/
  │       ├── CasesListScreen.tsx
  │       ├── CaseWorkspaceScreen.tsx
  │       ├── CaptureAIScreen.tsx
  │       ├── RecognitionScreen.tsx
  │       ├── PhotoReportScreen.tsx
  │       ├── InvestigationReportScreen.tsx
  │       └── ExportScreen.tsx
```

### Tecnologias
- **React 18** + **TypeScript**
- **Tailwind CSS v4**
- **Lucide React** (ícones)
- **React Beautiful DnD** (drag & drop)

---

**Aproveite a navegação!** 🚀
