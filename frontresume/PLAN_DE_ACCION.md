# 📋 Plan de Acción - Implementación Frontend Next.js

**Fecha:** 8 de Diciembre 2025  
**Objetivo:** Crear interfaz web en Next.js que consuma correctamente todas las rutas API documentadas

---

## 🎯 Enfoque General

### Stack Técnico Seleccionado

| Tecnología | Versión | Justificación |
|------------|---------|---------------|
| **Next.js** | 16.0.5 (ya instalado) | App Router, Server Components, optimizaciones automáticas |
| **TypeScript** | 5.x | Type-safety, mejor DX, reduce errores |
| **Tailwind CSS** | 4.x (ya instalado) | Utilidades, responsive, consistencia visual |
| **React Markdown** | 10.1.0 (ya instalado) | Renderizar respuestas Markdown del backend |
| **Axios** | Por instalar | Interceptores, mejor manejo de errores que fetch |
| **React Hook Form** | Por instalar | Validación de formularios, mejor UX |
| **Zod** | Por instalar | Validación de schemas coincidente con Pydantic del backend |

### Estrategia de Fetching

| Tipo de Operación | Herramienta | Justificación |
|-------------------|-------------|---------------|
| **Upload de archivos** | Axios | Mejor manejo de FormData, progress tracking |
| **Análisis de texto** | Axios | Cancelación de requests, timeouts configurables |
| **Health check** | Fetch API | Operación simple, no requiere overhead |

### Autenticación

**Estado actual:** El backend NO implementa autenticación (según el markdown)
- ✅ No hay JWT, cookies o tokens en las rutas documentadas
- ✅ Solo CORS configurado para localhost:3000
- 🔮 **Preparación futura:** Estructura para agregar tokens cuando se implemente

---

## 📁 Estructura de Carpetas Propuesta

```
frontresume/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Layout global
│   │   ├── page.tsx                   # Home/Dashboard
│   │   ├── globals.css                # Estilos globales
│   │   └── api/                       # (opcional) API Routes para proxy
│   ├── components/
│   │   ├── ui/                        # Componentes UI reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorAlert.tsx
│   │   │   └── MarkdownRenderer.tsx
│   │   ├── features/                  # Componentes por feature
│   │   │   ├── Summarize/
│   │   │   │   ├── SummarizeForm.tsx
│   │   │   │   └── SummarizeResult.tsx
│   │   │   ├── Keywords/
│   │   │   │   ├── KeywordsForm.tsx
│   │   │   │   └── KeywordsResult.tsx
│   │   │   ├── Entities/
│   │   │   ├── Compare/
│   │   │   ├── Question/
│   │   │   ├── Topics/
│   │   │   └── Bullets/
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── api/                       # Cliente API
│   │   │   ├── client.ts              # Axios instance configurada
│   │   │   ├── endpoints.ts           # Todas las rutas API
│   │   │   └── types.ts               # TypeScript types del backend
│   │   ├── schemas/                   # Zod schemas
│   │   │   └── api-schemas.ts
│   │   └── utils/
│   │       ├── formatters.ts
│   │       └── validators.ts
│   ├── hooks/
│   │   ├── useApi.ts                  # Hook genérico para llamadas API
│   │   ├── useSummarize.ts            # Hook específico para resumen
│   │   ├── useKeywords.ts
│   │   └── ...
│   └── types/
│       └── api.d.ts                   # Tipos globales
├── public/
│   └── assets/
└── .env.local                         # Variables de entorno
```

---

## 🗺️ Plan de Implementación por Fases

### **FASE 0: Preparación del Entorno** (30 min)

#### Tareas:
1. ✅ Instalar dependencias necesarias
   ```bash
   npm install axios react-hook-form zod @hookform/resolvers
   npm install -D @types/axios
   ```

2. ✅ Crear archivo `.env.local`
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_API_TIMEOUT=60000
   ```

3. ✅ Configurar estructura base de carpetas
4. ✅ Crear cliente Axios centralizado
5. ✅ Definir tipos TypeScript basados en el markdown

#### Entregables:
- [ ] `lib/api/client.ts` - Cliente Axios configurado
- [ ] `lib/api/types.ts` - Todos los tipos del backend
- [ ] `.env.local` - Variables de entorno

---

### **FASE 1: Componentes Base y UI Kit** (45 min)

#### Tareas:
1. ✅ Crear componentes UI reutilizables:
   - `Button.tsx` - Botón con variants (primary, secondary, danger)
   - `Card.tsx` - Tarjeta contenedora
   - `FileUpload.tsx` - Input de archivo con drag & drop
   - `LoadingSpinner.tsx` - Indicador de carga
   - `ErrorAlert.tsx` - Alertas de error
   - `MarkdownRenderer.tsx` - Renderizador de markdown mejorado

2. ✅ Crear Layout principal con navegación

#### Entregables:
- [ ] 6 componentes UI en `components/ui/`
- [ ] Layout con navegación funcional
- [ ] Página home actualizada

---

### **FASE 2: Ruta 1 - Health Check** (15 min)

#### Endpoint: `GET /`

**Componente:** `HealthCheck.tsx`

**Funcionalidad:**
- Verificar estado del backend al cargar la app
- Mostrar indicador verde/rojo en el header
- Auto-refresh cada 30 segundos

**Implementación:**
```typescript
// useHealthCheck.ts
export const useHealthCheck = () => {
  const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  
  useEffect(() => {
    const check = async () => {
      try {
        const res = await apiClient.get('/');
        setStatus(res.data.ok ? 'online' : 'offline');
      } catch {
        setStatus('offline');
      }
    };
    
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return status;
};
```

#### Criterios de Aceptación:
- ✅ Indicador visual en header
- ✅ Auto-refresh funcional
- ✅ Manejo de errores

#### Entregables:
- [ ] `hooks/useHealthCheck.ts`
- [ ] Indicador en Header
- [ ] Demo funcionando

---

### **FASE 3: Ruta 2 - Resumir Documentos** (90 min)

#### Endpoint: `POST /api/summarize`

**Componentes:**
- `SummarizeForm.tsx` - Formulario de upload
- `SummarizeResult.tsx` - Mostrar resultado
- `SummarizeStats.tsx` - Estadísticas (longitud original vs resumen)

**Características:**
- ✅ Upload de archivos PDF/DOCX
- ✅ Validación de formato (solo .pdf, .docx)
- ✅ Validación de tamaño (máx 10MB)
- ✅ Selector de tipo de resumen (general, bullets, tldr, business, academic)
- ✅ Slider para max_tokens (256-2048)
- ✅ Progress bar durante upload
- ✅ Renderizado de markdown en resultado
- ✅ Estadísticas visuales (gráfico de reducción)
- ✅ Botón de descarga del resumen

**Validación con Zod:**
```typescript
const SummarizeSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= 10 * 1024 * 1024, "Máx 10MB")
    .refine(
      file => ['.pdf', '.docx'].some(ext => file.name.endsWith(ext)),
      "Solo PDF o DOCX"
    ),
  summary_type: z.enum(['general', 'bullets', 'tldr', 'business', 'academic']),
  max_tokens: z.number().min(256).max(2048)
});
```

**Manejo de Errores:**
- 400: "Formato no soportado" → Mostrar alert con formatos válidos
- 413: "Archivo muy grande" → Sugerir comprimir
- 422: "Sin texto extraíble" → Verificar que el PDF no sea imagen

#### Criterios de Aceptación:
- ✅ Upload funcional con validación
- ✅ Todos los tipos de resumen funcionan
- ✅ Respuesta renderizada correctamente
- ✅ Estadísticas mostradas
- ✅ Manejo de todos los errores del markdown

#### Entregables:
- [ ] `components/features/Summarize/SummarizeForm.tsx`
- [ ] `components/features/Summarize/SummarizeResult.tsx`
- [ ] `hooks/useSummarize.ts`
- [ ] `lib/schemas/summarize.schema.ts`
- [ ] Demo con video/screenshots

---

### **FASE 4: Ruta 3 - Extraer Palabras Clave** (60 min)

#### Endpoint: `POST /api/extract-keywords`

**Componentes:**
- `KeywordsForm.tsx` - Input texto o archivo
- `KeywordsResult.tsx` - Lista de keywords

**Características:**
- ✅ Opción: texto directo O archivo .txt
- ✅ Textarea con contador de caracteres
- ✅ Visualización en forma de tags/badges
- ✅ Opción de copiar keywords
- ✅ Exportar a JSON

**UI Especial:**
- Keywords mostradas como badges coloridos
- Ordenadas por relevancia (según viene del backend)
- Animación de entrada

#### Criterios de Aceptación:
- ✅ Funciona con texto y archivo
- ✅ Keywords renderizadas como badges
- ✅ Opción de copiar/exportar

#### Entregables:
- [ ] `components/features/Keywords/KeywordsForm.tsx`
- [ ] `components/features/Keywords/KeywordsResult.tsx`
- [ ] `hooks/useKeywords.ts`
- [ ] Demo funcionando

---

### **FASE 5: Ruta 4 - Extraer Entidades** (60 min)

#### Endpoint: `POST /api/extract-entities`

**Componentes:**
- `EntitiesForm.tsx`
- `EntitiesResult.tsx` - Organizado por tipo

**Características:**
- ✅ Input texto o archivo
- ✅ Entidades agrupadas por tipo (Personas, Organizaciones, Lugares, Fechas)
- ✅ Tabs para cada tipo
- ✅ Búsqueda/filtro de entidades
- ✅ Exportar a CSV

**UI Especial:**
- Iconos diferentes por tipo de entidad
- Contador por categoría
- Tabla con posibilidad de ordenar

#### Criterios de Aceptación:
- ✅ Entidades agrupadas correctamente
- ✅ UI intuitiva con tabs
- ✅ Filtros funcionan

#### Entregables:
- [ ] Componentes de Entities
- [ ] Hook personalizado
- [ ] Demo

---

### **FASE 6: Ruta 5 - Comparar Textos** (75 min)

#### Endpoint: `POST /api/compare-texts`

**Componentes:**
- `CompareForm.tsx` - Múltiples textareas
- `CompareResult.tsx` - Comparación visual

**Características:**
- ✅ Mínimo 2 textos, máximo 5
- ✅ Botón "Agregar texto" dinámico
- ✅ Visualización lado a lado de similitudes/diferencias
- ✅ Highlighting de diferencias clave

**UI Especial:**
- Split view de textos originales
- Resultado en 2 columnas: Similitudes | Diferencias
- Colores para destacar

#### Criterios de Aceptación:
- ✅ Permite 2-5 textos
- ✅ Comparación renderizada correctamente
- ✅ UI clara y visual

#### Entregables:
- [ ] Componentes Compare
- [ ] Hook useCompare
- [ ] Demo con múltiples textos

---

### **FASE 7: Ruta 6 - Preguntas y Respuestas** (75 min)

#### Endpoint: `POST /api/question`

**Componentes:**
- `QuestionForm.tsx` - Upload + input pregunta
- `QuestionResult.tsx` - Respuesta estructurada

**Características:**
- ✅ Upload documento
- ✅ Input de pregunta con sugerencias
- ✅ Historial de preguntas (localStorage)
- ✅ Reutilizar documento para múltiples preguntas
- ✅ Respuesta con evidencias destacadas

**UI Especial:**
- Chat-like interface
- Preguntas previas mostradas
- Botones de preguntas sugeridas

#### Criterios de Aceptación:
- ✅ Upload y pregunta funcionan
- ✅ Historial persistente
- ✅ Puede hacer múltiples preguntas sin re-upload

#### Entregables:
- [ ] Componentes Question
- [ ] Hook con estado persistente
- [ ] Demo con historial

---

### **FASE 8: Ruta 7 - Modelado de Temas** (75 min)

#### Endpoint: `POST /api/topic-modeling`

**Componentes:**
- `TopicForm.tsx` - Texto o múltiples archivos
- `TopicResult.tsx` - Temas visualizados

**Características:**
- ✅ Upload múltiple de archivos
- ✅ O textarea grande
- ✅ Temas mostrados como cards expandibles
- ✅ Gráfico de distribución de temas (opcional)

**UI Especial:**
- Accordion para cada tema
- Bullets de apoyo dentro de cada tema
- Visualización de porcentajes

#### Criterios de Aceptación:
- ✅ Múltiples archivos funcionan
- ✅ Temas bien organizados
- ✅ UI expandible/colapsable

#### Entregables:
- [ ] Componentes Topics
- [ ] Hook useTopics
- [ ] Demo con varios archivos

---

### **FASE 9: Ruta 8 - Texto a Bullets** (45 min)

#### Endpoint: `POST /api/text-to-bullets`

**Componentes:**
- `BulletsForm.tsx` - Textarea grande
- `BulletsResult.tsx` - Lista de bullets

**Características:**
- ✅ Textarea con límite visual
- ✅ Bullets numerados y destacados
- ✅ Opción de copiar lista
- ✅ Contador de bullets (máx 12)

**UI Especial:**
- Bullets con números grandes
- Animación de aparición secuencial

#### Criterios de Aceptación:
- ✅ Convierte texto largo a bullets
- ✅ Máximo 12 bullets respetado
- ✅ UI atractiva

#### Entregables:
- [ ] Componentes Bullets
- [ ] Hook useBullets
- [ ] Demo

---

### **FASE 10: Mejoras y Pulido** (90 min)

#### Tareas:
1. ✅ **Responsiveness completo**
   - Mobile-first approach
   - Breakpoints: sm, md, lg, xl
   - Sidebar colapsable en móvil

2. ✅ **Manejo de errores global**
   - Toast notifications
   - Error boundary
   - Retry automático

3. ✅ **Loading states**
   - Skeletons
   - Progress indicators
   - Optimistic UI

4. ✅ **Accesibilidad**
   - ARIA labels
   - Keyboard navigation
   - Screen reader friendly

5. ✅ **Performance**
   - Code splitting
   - Lazy loading de componentes
   - Memoización donde aplique

6. ✅ **Testing**
   - Tests unitarios de hooks
   - Tests de integración de forms
   - Tests E2E de flujos principales

#### Entregables:
- [ ] App 100% responsive
- [ ] Manejo de errores robusto
- [ ] Test coverage >70%

---

## 📊 Esquema de Trabajo

### Metodología

**Iteración por Fase:**
1. 📝 **Presentar fase** → Esperar aprobación
2. 🔨 **Implementar** → Commits atómicos
3. 🎬 **Demo** → Screenshots/video + PR
4. ✅ **Revisión** → Feedback e iteración
5. ➡️ **Siguiente fase**

### Estimación de Tiempo

| Fase | Tiempo Estimado | Prioridad |
|------|----------------|-----------|
| Fase 0 | 30 min | 🔴 Alta |
| Fase 1 | 45 min | 🔴 Alta |
| Fase 2 | 15 min | 🟡 Media |
| Fase 3 | 90 min | 🔴 Alta |
| Fase 4 | 60 min | 🟡 Media |
| Fase 5 | 60 min | 🟡 Media |
| Fase 6 | 75 min | 🟡 Media |
| Fase 7 | 75 min | 🟡 Media |
| Fase 8 | 75 min | 🟡 Media |
| Fase 9 | 45 min | 🟢 Baja |
| Fase 10 | 90 min | 🔴 Alta |
| **TOTAL** | **~11 horas** | |

---

## 🎨 Diseño UI/UX

### Paleta de Colores

```css
:root {
  --primary: #3B82F6;      /* Blue 500 */
  --secondary: #8B5CF6;    /* Violet 500 */
  --success: #10B981;      /* Green 500 */
  --danger: #EF4444;       /* Red 500 */
  --warning: #F59E0B;      /* Amber 500 */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-900: #111827;
}
```

### Layout Principal

```
┌─────────────────────────────────────────┐
│ Header (Logo + Nav + Health Check)     │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │     Main Content             │
│ (Nav)    │     (Feature Component)      │
│          │                              │
│          │                              │
├──────────┴──────────────────────────────┤
│ Footer                                  │
└─────────────────────────────────────────┘
```

### Componentes de Navegación

**Sidebar Items:**
1. 🏠 Dashboard
2. 📄 Resumir Documentos
3. 🔑 Palabras Clave
4. 🏢 Entidades
5. 🔄 Comparar Textos
6. ❓ Preguntas
7. 📊 Temas
8. 📝 A Bullets

---

## ✅ Checklist de Cumplimiento

### Requisitos Técnicos

- [x] Next.js última versión estable (16.0.5) ✅
- [x] Tailwind CSS para estilos ✅
- [ ] Axios para fetching
- [ ] Manejo correcto de FormData
- [ ] Tipos TypeScript coincidentes con backend
- [ ] Responsive móvil/desktop
- [ ] Validación de entrada (Zod)
- [ ] Manejo de errores según códigos HTTP del markdown

### Fidelidad al Markdown

- [ ] Todos los endpoints implementados
- [ ] Parámetros exactos (nombres, tipos)
- [ ] Respuestas procesadas correctamente
- [ ] Códigos de error manejados
- [ ] Ejemplos del markdown validados

---

## 🚀 Cómo Empezar

### Orden de Aprobación

1. **Primero:** Revisar y aprobar este plan completo
2. **Luego:** Aprobar cada fase individualmente antes de implementar
3. **Finalmente:** Review final de la app completa

### Primera Fase a Implementar

Una vez apruebes este plan, empezaré con:

**FASE 0: Preparación del Entorno**
- Instalar dependencias
- Configurar cliente API
- Definir tipos TypeScript

### Preguntas para Ti

Antes de empezar, necesito tu confirmación en:

1. ✅ **¿Apruebas la estructura de carpetas propuesta?**
2. ✅ **¿Prefieres Axios o fetch API? (Recomiendo Axios)**
3. ✅ **¿Quieres tests desde el inicio o al final?**
4. ✅ **¿Algún cambio en el diseño/paleta de colores?**
5. ✅ **¿Prefieres demo con video, screenshots o ambos?**

---

## 📝 Notas Finales

- Cada fase tendrá su propio commit
- PRs pequeños y atómicos
- Demo de cada feature antes de continuar
- Código comentado y documentado
- README actualizado continuamente

**¿Aprobamos el plan y empezamos con la Fase 0?** 🚀
