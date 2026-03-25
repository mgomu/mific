# mific — UI/UX Specification Document

**Producto:** mific — Explorador y comparador de Fondos de Inversión Colectiva en Colombia  
**Versión:** 1.0 MVP  
**Fecha:** Marzo 24, 2026  
**Referencia visual:** Estilo inspirado en Bestclevers LMS (limpio, moderno, generoso en espacios blancos)

---

## 1. Design System

### 1.1 Paleta de colores

| Token | Hex | Uso |
|-------|-----|-----|
| `primary-600` | #2563EB | Botones principales, links activos, acento de gráficas |
| `primary-700` | #1D4ED8 | Hover de botones principales |
| `primary-50` | #EFF6FF | Fondos de badges tipo "FIC General", highlights suaves |
| `success-500` | #22C55E | Rentabilidad positiva, indicadores de crecimiento |
| `danger-500` | #EF4444 | Rentabilidad negativa, errores |
| `neutral-900` | #111827 | Texto principal (títulos, cifras importantes) |
| `neutral-700` | #374151 | Texto secundario (descripciones, labels) |
| `neutral-500` | #6B7280 | Texto terciario (placeholders, metadata) |
| `neutral-200` | #E5E7EB | Bordes de tablas, separadores |
| `neutral-100` | #F3F4F6 | Fondo de filas alternas en tabla, fondo de cards |
| `neutral-50` | #F9FAFB | Fondo general de la página |
| `white` | #FFFFFF | Fondo de cards, inputs, tabla |
| `chart-1` | #2563EB | Línea de fondo 1 en comparador |
| `chart-2` | #7C3AED | Línea de fondo 2 en comparador |
| `chart-3` | #F59E0B | Línea de fondo 3 en comparador |
| `chart-4` | #10B981 | Línea de fondo 4 en comparador |
| `chart-5` | #EF4444 | Línea de fondo 5 en comparador |

### 1.2 Tipografía

| Elemento | Fuente | Peso | Tamaño | Line Height |
|----------|--------|------|--------|-------------|
| H1 (título de página) | Inter | 700 (Bold) | 28px | 36px |
| H2 (título de sección) | Inter | 600 (Semibold) | 22px | 28px |
| H3 (subtítulo) | Inter | 600 (Semibold) | 18px | 24px |
| Body | Inter | 400 (Regular) | 14px | 20px |
| Body small | Inter | 400 (Regular) | 12px | 16px |
| Label / Caption | Inter | 500 (Medium) | 12px | 16px |
| Número grande (metric card) | Inter | 700 (Bold) | 32px | 40px |
| Número tabla | Inter Tabular | 500 (Medium) | 14px | 20px |

Nota: Usar Inter con feature `font-variant-numeric: tabular-nums` para todas las cifras numéricas en tablas y cards, asegurando alineación vertical perfecta.

### 1.3 Espaciado

| Token | Valor | Uso |
|-------|-------|-----|
| `space-xs` | 4px | Padding interno de badges |
| `space-sm` | 8px | Gap entre elementos inline |
| `space-md` | 16px | Padding de celdas de tabla, gap entre cards |
| `space-lg` | 24px | Padding de secciones, margen entre bloques |
| `space-xl` | 32px | Separación entre secciones principales |
| `space-2xl` | 48px | Margen top/bottom de la página |

### 1.4 Bordes y sombras

| Elemento | Propiedad |
|----------|-----------|
| Cards | `border-radius: 12px; border: 1px solid #E5E7EB; box-shadow: 0 1px 3px rgba(0,0,0,0.06)` |
| Inputs / Dropdowns | `border-radius: 8px; border: 1px solid #E5E7EB` |
| Badges | `border-radius: 6px; padding: 2px 8px` |
| Botones | `border-radius: 8px` |
| Tabla | `border-radius: 12px` en el contenedor; sin border-radius en filas individuales |

### 1.5 Componentes reutilizables

#### Badge de tipo de fondo
- Fondo: `primary-50` (#EFF6FF)
- Texto: `primary-600` (#2563EB)
- Font: 12px Medium
- Padding: 2px 8px
- Border-radius: 6px
- Variantes por tipo: cada tipo de fondo tiene un color distinto:
  - FIC General → azul (`#EFF6FF` / `#2563EB`)
  - FIC Inmobiliario → verde (`#F0FDF4` / `#16A34A`)
  - FIC Mercado Monetario → amarillo (`#FFFBEB` / `#D97706`)
  - FIC Bursátil → púrpura (`#F5F3FF` / `#7C3AED`)
  - Otro → gris (`#F3F4F6` / `#374151`)

#### Indicador de rentabilidad
- Positiva: texto `success-500` (#22C55E) con ícono de flecha ↑ a la izquierda
- Negativa: texto `danger-500` (#EF4444) con ícono de flecha ↓ a la izquierda
- Cero o N/A: texto `neutral-500` (#6B7280), sin ícono
- Formato: número con 2 decimales + símbolo %. Ejemplo: `↑ 8.42%` o `↓ -2.15%`

#### Metric Card
- Fondo: blanco
- Border: 1px solid `neutral-200`
- Border-radius: 12px
- Padding: 20px
- Layout interno vertical:
  - Label (12px, Medium, `neutral-500`) — ej: "Rentabilidad anual"
  - Valor (32px, Bold, `neutral-900`) — ej: "8.42%"
  - Indicador de cambio debajo (12px, color según positivo/negativo)

#### Skeleton Loader
- Rectángulos redondeados (border-radius: 8px) con color `neutral-200`
- Animación: pulse (opacidad alterna entre 0.4 y 1.0, duración 1.5s)
- Mismo tamaño y posición que el componente que reemplaza

#### Botón primario
- Fondo: `primary-600`
- Texto: blanco, 14px, Semibold
- Padding: 10px 20px
- Border-radius: 8px
- Hover: `primary-700`
- Disabled: opacidad 0.5, cursor not-allowed

#### Checkbox de selección (para comparar)
- Cuadrado 18x18px, border-radius: 4px
- Sin seleccionar: borde `neutral-300`, fondo blanco
- Seleccionado: fondo `primary-600`, checkmark blanco
- Hover: borde `primary-400`

---

## 2. Layout general

### 2.1 Contenedor

- Max-width: 1280px
- Centrado horizontalmente con auto margins
- Padding lateral: 24px (mobile: 16px)
- Fondo de página: `neutral-50` (#F9FAFB)

### 2.2 Header (global, fijo en top)

- Altura: 64px
- Fondo: blanco
- Border-bottom: 1px solid `neutral-200`
- Box-shadow: `0 1px 3px rgba(0,0,0,0.04)`
- Layout: flex, justify-between, align-center
- Contenido:
  - **Izquierda:** Logo "mific" en texto. Font: Inter, 22px, Bold, color `primary-600`. Clicable → navega a home (/)
  - **Centro:** Barra de búsqueda (visible solo en la pantalla de ranking; en otras pantallas, este espacio queda vacío)
  - **Derecha:** Botón "Comparar (N)" donde N es la cantidad de fondos seleccionados. Visible solo si N ≥ 1. Al clic → navega a `/comparar?ids=X,Y,Z`

### 2.3 Footer

- Margin-top: 48px
- Padding: 24px
- Border-top: 1px solid `neutral-200`
- Fondo: blanco
- Contenido centrado:
  - Línea 1: "Datos de la Superintendencia Financiera de Colombia — Actualizados al [FECHA_CORTE]" (12px, `neutral-500`)
  - Línea 2: "mific es un proyecto de código abierto sin ánimo de lucro" (12px, `neutral-500`)

---

## 3. Pantalla 1: Ranking (Home) — Ruta: `/`

### 3.1 Descripción general
Página principal. Muestra todos los fondos de inversión colectiva en una tabla ordenable y filtrable. Es la puerta de entrada a la aplicación.

### 3.2 Layout de la pantalla (de arriba a abajo)

```
[Header global]
  
[Sección de título y filtros]
  ├── H1: "Fondos de Inversión Colectiva"
  ├── Subtítulo: "[N] fondos disponibles · Datos al [fecha]"
  └── Barra de filtros
  
[Tabla de ranking]
  └── Filas clicables con checkbox para comparar

[Paginación]

[Footer]
```

### 3.3 Sección de título y filtros

#### Título
- H1: "Fondos de Inversión Colectiva"
- Subtítulo: texto `neutral-500`, 14px. Ejemplo: "247 fondos disponibles · Datos al 21 de marzo de 2026"

#### Barra de búsqueda (en header)
- Ancho: 400px (desktop), 100% del contenedor (mobile)
- Placeholder: "Buscar por nombre del fondo o administradora..."
- Ícono de lupa a la izquierda, dentro del input
- Borde: `neutral-200`, focus: `primary-600` con ring de 2px `primary-100`
- Búsqueda en tiempo real: filtra la tabla mientras el usuario escribe (debounce 300ms)

#### Filtros
- Layout: fila horizontal con gap de 12px. En mobile, se apilan verticalmente
- Cada filtro es un dropdown (select nativo estilizado o combobox):
  - **Tipo de fondo:** opciones dinámicas del campo `nombre_tipo_patrimonio` (ej: "FIC de tipo general", "FIC inmobiliario", "FIC del mercado monetario", "FIC bursátil"). Default: "Todos los tipos"
  - **Administradora:** opciones dinámicas del campo `nombre_entidad`. Default: "Todas las administradoras"
  - **Subtipo:** opciones del campo `nombre_subtipo_patrimonio` (ej: "Abierto", "Cerrado", "Abierto con pacto de permanencia"). Default: "Todos los subtipos"
- Botón "Limpiar filtros" (texto link, `primary-600`, 12px) visible solo cuando hay al menos un filtro activo
- Los filtros activos se reflejan en la URL como query params: `/?tipo=general&admin=bbva`

### 3.4 Tabla de ranking

#### Estructura de la tabla

| # | Columna | Ancho | Alineación | Ordenable | Contenido |
|---|---------|-------|------------|-----------|-----------|
| 0 | Checkbox | 40px | Centro | No | Checkbox para seleccionar fondo para comparar |
| 1 | # | 48px | Centro | No | Posición en el ranking (1, 2, 3...) según el orden actual |
| 2 | Fondo | flex (ocupa espacio restante, min 280px) | Izquierda | Sí (alfabético) | Nombre del fondo (14px, Semibold, `neutral-900`) + Administradora debajo (12px, Regular, `neutral-500`) |
| 3 | Tipo | 160px | Izquierda | Sí | Badge de tipo de fondo con color según la categoría |
| 4 | Valor unidad | 130px | Derecha | Sí | Formato COP: "$18,240.37" (14px, Medium, tabular-nums) |
| 5 | Rent. mensual | 110px | Derecha | Sí | Indicador de rentabilidad con color y flecha. Ej: "↑ 4.78%" |
| 6 | Rent. semestral | 110px | Derecha | Sí | Indicador de rentabilidad |
| 7 | Rent. anual | 110px | Derecha | Sí | Indicador de rentabilidad. **Columna de orden por defecto (descendente)** |

#### Estilos de la tabla
- Contenedor: fondo blanco, border-radius 12px, border 1px `neutral-200`, overflow hidden
- Header de columnas:
  - Fondo: `neutral-50`
  - Texto: 12px, Medium, `neutral-500`, uppercase, letter-spacing 0.05em
  - Padding: 12px 16px
  - Border-bottom: 1px solid `neutral-200`
  - Columnas ordenables: cursor pointer. Ícono de flecha ↕ al lado del nombre. Cuando está activa: flecha sólida ↑ o ↓ en `primary-600`
- Filas de datos:
  - Padding: 14px 16px
  - Border-bottom: 1px solid `neutral-100`
  - Hover: fondo `neutral-50`, cursor pointer (toda la fila es clicable → navega a detalle)
  - El checkbox NO dispara la navegación (event.stopPropagation)
  - Última fila: sin border-bottom

#### Paginación
- Debajo de la tabla, alineado a la derecha
- Layout: "Mostrando 1-50 de 247" (texto 12px, `neutral-500`) + botones Previous / Next
- Botones: estilo outline (borde `neutral-200`, texto `neutral-700`). Disabled si no hay más páginas
- 50 fondos por página

#### Barra flotante de comparación (Comparison Bar)
- Aparece cuando hay ≥ 1 fondo seleccionado
- Fija en la parte inferior de la pantalla (position sticky bottom 0)
- Fondo: blanco, border-top: 1px `neutral-200`, box-shadow: `0 -4px 12px rgba(0,0,0,0.08)`
- Altura: 64px
- Layout: flex, justify-between, align-center, padding 0 24px
- Contenido:
  - **Izquierda:** Chips con los nombres de los fondos seleccionados. Cada chip: fondo `neutral-100`, border-radius 6px, padding 4px 10px, texto 12px. Botón × para remover
  - **Derecha:** Botón primario "Comparar [N] fondos →" (disabled si N < 2, max N = 5)
- Animación: slide-up al aparecer, slide-down al desaparecer (200ms ease)

### 3.5 Responsive (mobile, < 768px)
- La tabla se convierte en una lista de cards
- Cada card contiene:
  - Top: Nombre del fondo (semibold) + badge tipo
  - Middle: Administradora (small, neutral-500)
  - Bottom: Grid 2x2 con las 4 métricas (valor unidad, rent. mensual, semestral, anual)
  - Checkbox en la esquina superior derecha del card
- Filtros: se colapsan en un botón "Filtros" que abre un bottom sheet
- Búsqueda: se mueve debajo del header, ancho 100%

---

## 4. Pantalla 2: Detalle del fondo — Ruta: `/fondo/[codigo_negocio]`

### 4.1 Descripción general
Muestra toda la información disponible de un fondo específico: métricas actuales y evolución histórica en gráfica.

### 4.2 Layout de la pantalla

```
[Header global]

[Breadcrumb]

[Encabezado del fondo]
  ├── Nombre del fondo (H1)
  ├── Administradora
  ├── Badge tipo + Badge subtipo
  └── Botón "Agregar a comparación"

[Grid de Metric Cards — 2 filas x 3 columnas]
  ├── Valor de la unidad
  ├── Rentabilidad anual
  ├── Rentabilidad semestral
  ├── Rentabilidad mensual
  ├── Nº de inversionistas
  └── Valor total del fondo

[Gráfica de evolución histórica]
  ├── Selector de métrica (tabs)
  ├── Selector de período (botones)
  └── Gráfica de línea

[Tabla de datos históricos (colapsable)]

[Footer]
```

### 4.3 Breadcrumb
- Texto 12px, `neutral-500`
- Formato: "Fondos → [Nombre del fondo]"
- "Fondos" es un link (`primary-600`) que regresa a `/`
- Separador: "→" o ícono chevron

### 4.4 Encabezado del fondo
- H1: nombre completo del fondo (28px, Bold, `neutral-900`). Puede ser largo — permitir wrap a 2 líneas
- Debajo: nombre de la administradora (16px, Regular, `neutral-500`)
- Debajo: badges en fila horizontal — tipo de fondo + subtipo (ej: "FIC General" + "Abierto")
- A la derecha (alineado al top): Botón "Agregar a comparación" (estilo outline si no está seleccionado, estilo filled si ya está en la comparación)
- Separador: línea horizontal `neutral-200` debajo del encabezado con margin vertical de 24px

### 4.5 Grid de Metric Cards
- Layout: Grid 3 columnas en desktop, 2 columnas en tablet, 1 columna en mobile
- Gap: 16px
- 6 cards usando el componente Metric Card definido en el design system
- Contenido de cada card:

| Card | Label | Valor ejemplo | Formato |
|------|-------|---------------|---------|
| 1 | Valor de la unidad | $18,240.37 | Pesos colombianos, 2 decimales |
| 2 | Rentabilidad anual | 8.42% | Indicador con color y flecha |
| 3 | Rentabilidad semestral | 4.78% | Indicador con color y flecha |
| 4 | Rentabilidad mensual | 0.65% | Indicador con color y flecha |
| 5 | Nº de inversionistas | 12,458 | Número entero con separador de miles |
| 6 | Valor del fondo | $75,905 M | En millones, abreviado. Tooltip con valor exacto |

### 4.6 Gráfica de evolución histórica

#### Contenedor
- Card blanca con border-radius 12px, padding 24px
- Título: H2 "Evolución histórica" (18px, Semibold)

#### Controles superiores (dentro del card, arriba de la gráfica)
- **Selector de métrica (tabs):** "Rentabilidad" | "Valor de la unidad"
  - Estilo: tabs inline. Tab activo: texto `primary-600`, border-bottom 2px `primary-600`. Tab inactivo: texto `neutral-500`
- **Selector de período (botones):** "1M" | "3M" | "6M" | "1A" | "Todo"
  - Estilo: grupo de botones pill. Activo: fondo `primary-600`, texto blanco. Inactivo: fondo `neutral-100`, texto `neutral-700`
  - Default: "1A" (1 año)

#### Gráfica
- Tipo: línea con área sombreada debajo (area chart)
- Línea: color `primary-600`, grosor 2px
- Área: gradiente de `primary-600` al 10% de opacidad arriba → 0% abajo
- Eje X: fechas. Formato "Mar 2025", "Abr 2025". Mostrar 6-8 ticks distribuidos uniformemente
- Eje Y: valores. Alineado a la izquierda. Formato según métrica (% para rentabilidad, $ para valor unidad)
- Grid horizontal: líneas punteadas `neutral-200`
- Tooltip al hover:
  - Círculo de 8px en el punto de la línea
  - Card flotante con: fecha completa + valor exacto
  - Fondo blanco, sombra suave, border-radius 8px, padding 8px 12px
- Altura de la gráfica: 320px (desktop), 240px (mobile)
- Responsive: la gráfica se adapta al 100% del ancho del contenedor

### 4.7 Tabla de datos históricos (colapsable)
- Debajo de la gráfica
- Default: colapsada. Toggle: "Ver datos históricos ▼" / "Ocultar datos ▲"
- Tabla con columnas: Fecha | Valor unidad | Rent. diaria | Rent. mensual | Rent. semestral | Rent. anual | Nº inversionistas
- Ordenada por fecha descendente
- Max 30 filas visibles con scroll vertical

---

## 5. Pantalla 3: Comparador — Ruta: `/comparar?ids=X,Y,Z`

### 5.1 Descripción general
Permite comparar visualmente entre 2 y 5 fondos. Muestra una gráfica de líneas superpuestas y una tabla comparativa lado a lado.

### 5.2 Layout de la pantalla

```
[Header global]

[Breadcrumb]

[Encabezado + chips de fondos seleccionados]
  ├── H1: "Comparar fondos"
  ├── Chips de cada fondo (removibles)
  └── Botón "+ Agregar fondo" (si < 5)

[Gráfica comparativa]
  ├── Selector de métrica
  ├── Selector de período
  └── Gráfica de líneas múltiples con leyenda

[Tabla comparativa lado a lado]

[Footer]
```

### 5.3 Encabezado del comparador
- H1: "Comparar fondos"
- Debajo: fila de chips, uno por cada fondo seleccionado
  - Cada chip: 
    - Círculo de color (10px) correspondiente al color de la línea en la gráfica (chart-1 a chart-5)
    - Nombre abreviado del fondo (truncar a 30 caracteres con "...")
    - Botón × para remover
    - Fondo `neutral-100`, border-radius 8px, padding 6px 12px
  - Último elemento: botón "+ Agregar fondo" (estilo dashed border, texto `primary-600`) que abre un modal de búsqueda. Solo visible si hay menos de 5 fondos seleccionados
- Si el usuario remueve hasta quedar con <2 fondos: mostrar estado vacío "Selecciona al menos 2 fondos para comparar" con botón "Volver al ranking"

### 5.4 Gráfica comparativa

#### Contenedor
- Card blanca, border-radius 12px, padding 24px

#### Controles superiores
- **Selector de métrica (tabs):** "Rent. mensual" | "Rent. semestral" | "Rent. anual" | "Valor de la unidad"
  - Default: "Rent. anual"
- **Selector de período (botones):** "3M" | "6M" | "1A" | "2A" | "Todo"
  - Default: "1A"

#### Gráfica
- Tipo: líneas múltiples (sin área sombreada, solo líneas — para evitar saturación visual)
- Cada fondo = una línea con color diferente (chart-1 a chart-5)
- Grosor de línea: 2px
- Eje X: fechas
- Eje Y: valores de la métrica seleccionada
- Grid horizontal: líneas punteadas `neutral-200`
- Tooltip al hover:
  - Línea vertical punteada que cruza toda la gráfica en el punto de hover
  - Card flotante que muestra: fecha + valor de TODOS los fondos con su color y nombre
  - Ordenados de mayor a menor valor en ese punto
- Leyenda:
  - Debajo de la gráfica
  - Layout: fila horizontal con wrap
  - Cada item: círculo de color 10px + nombre del fondo (12px, `neutral-700`)
  - Clicable: al clic en un item de la leyenda, oculta/muestra esa línea (toggle con opacidad reducida)
- Altura: 400px (desktop), 280px (mobile)

### 5.5 Tabla comparativa lado a lado

#### Contenedor
- Card blanca, border-radius 12px, debajo de la gráfica con gap de 24px
- Título: H2 "Comparación detallada"

#### Estructura

La tabla tiene las métricas como filas y los fondos como columnas:

| Métrica (primera columna) | Fondo 1 | Fondo 2 | Fondo 3 | ... |
|---------------------------|---------|---------|---------|-----|
| Administradora | BBVA AM | Bancolombia | Credicorp | ... |
| Tipo | FIC General | FIC General | FIC Bursátil | ... |
| Subtipo | Abierto | Abierto | Cerrado | ... |
| Valor de la unidad | $18,240 | $22,105 | $45,892 | ... |
| Rentabilidad diaria | ↑ 0.02% | ↑ 0.01% | ↓ -0.03% | ... |
| Rentabilidad mensual | ↑ 0.65% | ↑ 0.58% | ↓ -0.42% | ... |
| Rentabilidad semestral | ↑ 4.78% | ↑ 3.92% | ↑ 2.15% | ... |
| Rentabilidad anual | ↑ 8.42% | ↑ 7.15% | ↑ 5.88% | ... |
| Nº inversionistas | 12,458 | 45,230 | 890 | ... |
| Valor del fondo | $75,905 M | $320,450 M | $12,300 M | ... |

#### Estilos de la tabla comparativa
- Primera columna (labels): ancho fijo 180px, fondo `neutral-50`, texto 13px Medium `neutral-600`
- Columnas de fondos: ancho igualmente distribuido
- Header de cada fondo:
  - Círculo de color correspondiente a la línea + nombre del fondo (14px, Semibold)
  - Nombre de administradora debajo (12px, `neutral-500`)
- Celdas numéricas: alineación derecha, tabular-nums
- Celdas de rentabilidad: usan el componente indicador de rentabilidad (con color y flecha)
- Resaltar la mejor métrica en cada fila: texto con font-weight Bold (no color adicional, sutil)
- Hover en fila: fondo `neutral-50`

#### Responsive (mobile)
- La tabla se hace scrollable horizontalmente
- Primera columna (labels) queda sticky a la izquierda
- Sombra sutil en el borde derecho de la primera columna para indicar scroll disponible

### 5.6 Modal de búsqueda para agregar fondo

- Trigger: botón "+ Agregar fondo" en los chips
- Overlay: fondo negro al 40% de opacidad
- Modal: 480px de ancho, centrado, border-radius 16px, padding 24px
- Contenido:
  - Input de búsqueda con placeholder "Buscar fondo por nombre o administradora..."
  - Debounce 300ms
  - Lista de resultados (max 8 items visibles, scroll si hay más)
  - Cada resultado: nombre del fondo + administradora debajo + botón "Agregar"
  - Al agregar: el modal se cierra y el fondo aparece en los chips + gráfica
- Cerrar: botón × en esquina superior derecha + clic en overlay + tecla Escape

---

## 6. Estados especiales

### 6.1 Estado de carga (loading)
- Tabla de ranking: 8 filas de skeleton loaders con la misma estructura de columnas
- Metric cards: rectángulos skeleton del tamaño de cada card
- Gráficas: área de la gráfica con skeleton rectangular + animación pulse
- Los filtros y la búsqueda están habilitados durante la carga (UX optimista)

### 6.2 Estado vacío (sin resultados)
- Reemplaza la tabla de ranking
- Ilustración simple (ícono de búsqueda, línea fina, monocromático)
- Texto: "No encontramos fondos con esos criterios" (18px, Semibold, `neutral-700`)
- Subtexto: "Intenta cambiar los filtros o la búsqueda" (14px, `neutral-500`)
- Botón: "Limpiar filtros" (estilo outline)

### 6.3 Estado de error
- Reemplaza el contenido principal (tabla o gráfica)
- Ícono de alerta (triángulo con !)
- Texto: "No pudimos cargar los datos" (18px, Semibold)
- Subtexto: "Los datos provienen de la Superintendencia Financiera. Intenta de nuevo en unos minutos." (14px, `neutral-500`)
- Botón: "Reintentar" (estilo primario)

### 6.4 Comparador con fondos insuficientes
- Si se accede a `/comparar` sin IDs o con solo 1:
  - Mensaje centrado: "Selecciona al menos 2 fondos para comparar"
  - Botón: "Ir al ranking" → navega a `/`

---

## 7. Interacciones y transiciones

| Interacción | Comportamiento |
|-------------|----------------|
| Hover en fila de tabla | Fondo cambia a `neutral-50`, transición 150ms |
| Clic en fila de tabla | Navega a `/fondo/[id]` |
| Clic en checkbox | Toggle selección para comparar (no navega). Animación scale 0.9 → 1.0 |
| Ordenar columna | Re-render de la tabla con animación fade (200ms). Ícono de flecha rota a la dirección del orden |
| Cambiar filtro | Re-fetch de datos con skeleton loader en la tabla |
| Seleccionar período en gráfica | Transición suave de la gráfica (morph de 300ms) |
| Cambiar métrica en gráfica | Fade out → fetch → fade in (200ms) |
| Abrir/cerrar tabla histórica | Slide-down/up con animación 250ms ease |
| Comparison bar (aparece/desaparece) | Slide-up/down 200ms ease desde el bottom |
| Modal de búsqueda | Fade-in overlay + scale-up modal (200ms ease) |
| Remover chip de fondo | El chip colapsa (width → 0, 200ms) y la gráfica se re-renderiza |

---

## 8. Navegación y URLs

| Ruta | Pantalla | Parámetros URL |
|------|----------|---------------|
| `/` | Ranking | `?tipo=`, `?admin=`, `?subtipo=`, `?buscar=`, `?orden=`, `?dir=` |
| `/fondo/[codigo_negocio]` | Detalle del fondo | Ninguno adicional |
| `/comparar` | Comparador | `?ids=8686,8734,9012` (códigos de negocio separados por coma) |

Todos los filtros y selecciones se sincronizan con la URL para permitir compartir enlaces y uso del botón atrás del navegador.

---

## 9. Accesibilidad (mínimos para MVP)

- Contraste mínimo WCAG AA en todos los textos
- Todos los elementos interactivos accesibles por teclado (Tab, Enter, Escape)
- Atributos `aria-label` en checkboxes, botones de ícono, y selectores de período
- Atributos `aria-sort` en headers de columna de la tabla
- Roles semánticos: `role="table"`, `role="row"`, `role="columnheader"`
- Skip-to-content link oculto visualmente pero accesible por screen reader
- Gráficas: texto alternativo descriptivo con resumen de los datos mostrados
