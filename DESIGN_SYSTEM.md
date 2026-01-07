# CaseHub - Design System

## 🎨 Design Tokens

### Cores

#### Primárias
```css
--color-primary-50: #EFF6FF;   /* Azul muito claro */
--color-primary-100: #DBEAFE;  /* Azul claro */
--color-primary-500: #3B82F6;  /* Azul principal */
--color-primary-600: #2563EB;  /* Azul hover */
--color-primary-700: #1D4ED8;  /* Azul ativo */
```

#### Neutras
```css
--color-gray-50: #F9FAFB;      /* Background */
--color-gray-100: #F3F4F6;     /* Cards hover */
--color-gray-200: #E5E7EB;     /* Borders */
--color-gray-300: #D1D5DB;     /* Inputs border */
--color-gray-400: #9CA3AF;     /* Icons disabled */
--color-gray-500: #6B7280;     /* Text secondary */
--color-gray-600: #4B5563;     /* Text */
--color-gray-700: #374151;     /* Text strong */
--color-gray-800: #1F2937;     /* Sidebar hover */
--color-gray-900: #111827;     /* Sidebar bg, text dark */
```

#### Semânticas
```css
/* Sucesso / Confirmado */
--color-success-50: #ECFDF5;
--color-success-100: #D1FAE5;
--color-success-600: #10B981;

/* Alerta / IA Sugeriu */
--color-warning-50: #FFFBEB;
--color-warning-100: #FEF3C7;
--color-warning-600: #F59E0B;

/* Erro / Incompleto */
--color-error-50: #FEF2F2;
--color-error-100: #FEE2E2;
--color-error-600: #EF4444;

/* Info / Editado */
--color-info-50: #EFF6FF;
--color-info-100: #DBEAFE;
--color-info-600: #3B82F6;
```

### Espaçamentos

```css
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-12: 3rem;    /* 48px */
```

**Uso**:
- **8px (spacing-2)**: Gap entre elementos pequenos
- **16px (spacing-4)**: Padding de cards, gap entre componentes
- **24px (spacing-6)**: Margens de seções

### Tipografia

```css
/* Font Family */
font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;

/* Tamanhos */
--text-xs: 0.75rem;     /* 12px - Labels, hints */
--text-sm: 0.875rem;    /* 14px - Body, buttons */
--text-base: 1rem;      /* 16px - Body principal */
--text-lg: 1.125rem;    /* 18px - Subtítulos */
--text-xl: 1.25rem;     /* 20px - Títulos */
--text-2xl: 1.5rem;     /* 24px - H1 */

/* Pesos */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Bordas

```css
--border-radius-sm: 0.375rem;   /* 6px - Badges, small buttons */
--border-radius-md: 0.5rem;     /* 8px - Inputs, cards */
--border-radius-lg: 0.75rem;    /* 12px - Cards principais */
--border-radius-full: 9999px;   /* Círculos, pills */

--border-width: 1px;
--border-color: var(--color-gray-200);
```

### Sombras

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

## 🧩 Componentes

### Botões

#### Primary
```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
  Ação Principal
</button>
```

#### Secondary
```tsx
<button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
  Ação Secundária
</button>
```

#### Icon Button
```tsx
<button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
  <Icon className="w-4 h-4" />
</button>
```

### Badges

#### Status
```tsx
/* Confirmado */
<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
  Confirmado
</span>

/* IA Sugeriu */
<span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
  IA sugeriu
</span>

/* Editado */
<span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
  Editado
</span>
```

### Cards

#### Basic Card
```tsx
<div className="bg-white rounded-lg border border-gray-200 p-6">
  {/* Conteúdo */}
</div>
```

#### Card com Header
```tsx
<div className="bg-white rounded-lg border border-gray-200 p-6">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-sm">Título</h2>
    <button className="text-sm text-blue-600">Ação</button>
  </div>
  {/* Conteúdo */}
</div>
```

### Inputs

#### Text Input
```tsx
<input
  type="text"
  placeholder="Digite aqui..."
  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
/>
```

#### Select
```tsx
<select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
  <option>Opção 1</option>
  <option>Opção 2</option>
</select>
```

#### Textarea
```tsx
<textarea
  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
  rows={4}
/>
```

### Tabelas

```tsx
<table className="w-full">
  <thead>
    <tr className="bg-gray-50 border-b border-gray-200">
      <th className="text-left text-xs text-gray-600 px-4 py-3">Coluna</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-900">Dado</td>
    </tr>
  </tbody>
</table>
```

### Alerts

#### Info
```tsx
<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
  <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
  <div>
    <p className="text-sm text-blue-900">Mensagem</p>
  </div>
</div>
```

#### Warning
```tsx
<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
  <div>
    <p className="text-sm text-yellow-900">Aviso</p>
  </div>
</div>
```

#### Error
```tsx
<div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
  <div>
    <p className="text-sm text-red-900">Erro</p>
  </div>
</div>
```

### Progress Bar

```tsx
<div className="w-full bg-gray-200 rounded-full h-2">
  <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: '65%' }} />
</div>
```

### Timeline

```tsx
<div className="space-y-3">
  <div className="flex items-start gap-3">
    <div className="flex flex-col items-center">
      <div className="w-2 h-2 bg-blue-600 rounded-full mt-1" />
      <div className="w-0.5 h-8 bg-gray-300" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-900">Evento</p>
      <p className="text-xs text-gray-500">Detalhes</p>
    </div>
  </div>
</div>
```

## 📐 Layout

### Grid System
- **12 colunas** no desktop
- **Gaps**: 16px (md), 24px (lg)

```tsx
/* Desktop - 3 colunas */
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">{/* Main */}</div>
  <div className="lg:col-span-1">{/* Sidebar */}</div>
</div>

/* Desktop - 4 colunas */
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <div className="lg:col-span-1">{/* Menu */}</div>
  <div className="lg:col-span-2">{/* Content */}</div>
  <div className="lg:col-span-1">{/* Info */}</div>
</div>
```

### Container
```tsx
<div className="max-w-7xl mx-auto p-6">
  {/* Conteúdo */}
</div>
```

## 🎭 Estados

### Hover
```css
hover:bg-gray-50
hover:bg-blue-700
hover:text-blue-700
```

### Focus
```css
focus:outline-none
focus:border-blue-500
focus:ring-1
focus:ring-blue-500
```

### Active
```css
bg-blue-600 text-white  /* Item ativo */
```

### Disabled
```css
opacity-50
cursor-not-allowed
```

### Loading
```tsx
<div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
```

## 🔤 Ícones

### Tamanhos
- **Small**: `w-3 h-3` (12px) - Chips, badges
- **Medium**: `w-4 h-4` (16px) - Buttons, inputs
- **Large**: `w-5 h-5` (20px) - Headers
- **XLarge**: `w-6 h-6` (24px) - Empty states

### Cores
- **Primary**: `text-blue-600`
- **Secondary**: `text-gray-600`
- **Success**: `text-green-600`
- **Warning**: `text-yellow-600`
- **Error**: `text-red-600`

## 📱 Breakpoints

```css
/* Mobile First */
sm: 640px   /* Tablet pequeno */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop pequeno */
xl: 1280px  /* Desktop */
2xl: 1536px /* Desktop grande */
```

### Uso Responsivo
```tsx
/* Hidden em mobile, visível em desktop */
<div className="hidden lg:block">...</div>

/* Visível em mobile, hidden em desktop */
<div className="block lg:hidden">...</div>

/* Grid adaptativo */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

## ♿ Acessibilidade

### Contraste
- **Mínimo**: 4.5:1 para texto normal
- **Grande**: 3:1 para texto grande (18px+)

### Foco Visível
- Sempre incluir `focus:ring` em elementos interativos
- Usar cores de alto contraste

### ARIA Labels
```tsx
<button aria-label="Fechar modal">
  <X className="w-4 h-4" />
</button>
```

## 🎯 Padrões de Uso

### Confirmação de Ação
```tsx
<div className="flex gap-2">
  <button className="flex-1 px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
    Confirmar
  </button>
  <button className="flex-1 px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50">
    Editar
  </button>
</div>
```

### Empty State
```tsx
<div className="py-12 text-center">
  <Icon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
  <h3 className="text-sm text-gray-600 mb-1">Título</h3>
  <p className="text-xs text-gray-500">Descrição</p>
</div>
```

### Loading State
```tsx
<div className="text-center py-8">
  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
  <p className="text-sm text-gray-600">Carregando...</p>
</div>
```

---

**Nota**: Este design system usa Tailwind CSS v4. Todos os tokens podem ser customizados no arquivo `theme.css`.
