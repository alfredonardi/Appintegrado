# CaseHub - Plataforma de Gestão de Casos

## Visão Geral

CaseHub é uma plataforma web de média fidelidade (wireframe) para gestão de casos policiais e geração de 3 documentos integrados:

1. **Reconhecimento Visuográfico** - Formulário técnico estruturado
2. **Relatório Fotográfico** - Seleção e ordenação de fotos com legendas
3. **Relatório Preliminar de Investigação** - Texto narrativo estruturado

## Objetivo

Preencher e revisar informações **UMA vez** e reutilizá-las automaticamente em todos os documentos, com:
- Assistência de IA
- Rastreabilidade completa (origem, confiança, status confirmado)
- Fluxo eficiente de trabalho

## Estrutura de Navegação

### Sidebar (Fixa à Esquerda)
- **Casos** - Lista e gestão de casos
- **Captura & IA** - Upload de fotos e classificação automática
- **Reconhecimento** - Formulário visuográfico
- **Relatório Fotográfico** - Montagem do álbum
- **Relatório de Investigação** - Relatório narrativo
- **Exportar Pacote** - Geração do pacote completo
- **Configurações** - Preferências do sistema

### Topbar
- Busca global
- Botão "Novo Caso"
- Status de sincronização
- Organização/Unidade
- Usuário logado

## Telas Implementadas

### 1. Lista de Casos
- Tabela com filtros (status, data, unidade, natureza)
- Colunas: BO, Natureza, Data, Endereço, Status, Última Atualização
- Botão "Abrir" em cada linha
- Card lateral com atalhos
- Empty state

### 2. Workspace do Caso (Visão Geral)
- **Dados principais** - BO, natureza, data/hora, endereço
- **Equipe** - Delegado, escrivão, policiais, perito, fotógrafo
- **Eventos de campo** - Timeline de acionamento, chegada, liberação
- **Progresso dos relatórios** - 3 barras de progresso com status
- **IA: Alertas e Lacunas** - Checklist de itens faltantes e inconsistências

### 3. Captura & IA
- Upload/câmera com dropzone
- Galeria em grid com filtros por categoria
- Painel "Classificação automática" com confiança
- Painel "Extrações da IA" com itens sugeridos
- Toggle "Somente confirmados"
- Estados: carregando, processando IA

### 4. Reconhecimento Visuográfico
- Layout com Stepper (menu vertical) e formulário
- Seções: Preliminares, Comunicações, Equipe, Clima, etc.
- Cada campo mostra:
  - Valor
  - Badge (IA sugeriu / Confirmado / Editado)
  - Confiança (%)
  - Link "ver fonte" com preview da foto
- Barra lateral "Campos relacionados" mostrando reutilização

### 5. Relatório Fotográfico
- Lista ordenável (drag & drop) com miniaturas + legendas
- Preview de página PDF em tempo real
- Controles: layout (1/2 fotos por página), capa, cabeçalho/rodapé
- Botões: Gerar PDF, Salvar, Baixar

### 6. Relatório de Investigação
- Editor estruturado com blocos:
  - Resumo, Dinâmica, Vítimas, Atuação Policial, etc.
- Cada bloco:
  - Botão "Gerar rascunho com IA"
  - Lista "Fatos usados" (chips)
  - Botão "Inserir evidência"
- Rodapé com assinaturas e data/local

### 7. Exportar Pacote
- Checklist: PDFs, Anexos, JSON
- Campo "Nome do pacote"
- Avisos se algum relatório estiver incompleto
- Botões: Gerar, Baixar, Salvar no storage
- Resumo: total de arquivos, tamanho estimado

## Padrões Visuais

### Layout
- Grid de 12 colunas
- Espaçamentos: 8px, 16px, 24px
- Responsivo: Desktop 1440px (principal), Tablet 768px, Mobile 390px

### Tipografia
- Font: Sistema (Inter/Roboto style)
- Contraste adequado
- Sem excesso de cores

### Cores
- Principal: Cinza (#F9FAFB, #E5E7EB, #6B7280, #111827)
- Ação: Azul (#3B82F6, #2563EB)
- Status:
  - Sucesso/Confirmado: Verde (#10B981)
  - Alerta/IA: Amarelo (#F59E0B)
  - Erro: Vermelho (#EF4444)

### Componentes
- **Sidebar** - Navegação fixa com ícones
- **Topbar** - Barra superior com busca e ações
- **Cards** - Containers com borda e padding
- **Tabelas** - Listagem de dados
- **Formulários** - Inputs estruturados
- **Modais** - (Para implementar)
- **Stepper** - Navegação por seções
- **Tabs** - Alternância de conteúdo
- **Toasts** - Notificações (Para implementar)
- **Badges** - Indicadores de status
- **Tooltips** - Informações contextuais

## Características Especiais

### Rastreabilidade
Todos os campos mostram:
- **Fonte**: Qual foto/documento gerou a informação
- **Confiança**: Percentual de confiança da IA (0-100%)
- **Status**: IA sugeriu / Confirmado / Editado
- **Responsável**: Quem confirmou (em tooltips)
- **Data**: Quando foi confirmado

### Reutilização de Dados
- Preencha UMA vez
- Sistema indica onde o dado será reutilizado
- Atualização automática em todos os documentos

### Estados e Interações
- **Empty states** - Quando não há dados
- **Loading** - Durante processamento da IA
- **Erro** - Upload failed, conflitos
- **Hover** - Destaque visual
- **Drag & drop** - Reordenação de fotos

## Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização
- **Lucide React** - Ícones
- **React Beautiful DnD** - Drag and drop

## Dados Fictícios

Todos os dados apresentados são fictícios e apenas para fins de demonstração:
- BO 2025/123456
- Endereços: Rua das Flores, 123 - Centro, São Paulo/SP
- Nomes: Dr. Carlos Silva, Ana Santos, etc.
- Datas: Janeiro de 2025

## Próximos Passos (Não Implementados)

1. **Modais**
   - Novo caso
   - Editar equipe
   - Adicionar evento
   - Confirmar campo sugerido

2. **Toasts/Notificações**
   - Salvar sucesso
   - PDF gerado
   - Erro ao processar

3. **Versão Mobile Completa**
   - Navegação adaptada
   - Cards empilhados
   - Sidebar colapsável

4. **Funcionalidades Backend**
   - Integração com IA real
   - Storage de imagens
   - Geração de PDFs
   - Autenticação

## Como Navegar

1. Use a **Sidebar** para alternar entre telas
2. Na tela "Casos", clique em **"Abrir"** para ir ao Workspace
3. No Workspace, clique em **"Continuar"** nos cards de relatório
4. Explore as funcionalidades de cada tela
5. Sidebar é colapsável (botão com seta)

## Responsividade

- **Desktop (1440px+)**: Layout completo com todas as colunas
- **Tablet (768px-1439px)**: Algumas colunas empilham, sidebar permanece
- **Mobile (390px-767px)**: Layout de coluna única, sidebar colapsável

---

**Nota**: Este é um protótipo wireframe de média fidelidade focado em demonstrar o fluxo e a estrutura da plataforma. Interações completas e backend não estão implementados.
