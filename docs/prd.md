# mific — Product Requirements Document (PRD)

**Versión:** 1.1 — MVP (clarificado)
**Fecha:** Marzo 24, 2026
**Autor:** Manuel Gómez Uribe

---

## 1. Problema en una oración

> Un inversionista retail colombiano que quiere comparar fondos de inversión colectiva no puede hacerlo fácilmente porque la información está dispersa entre PDFs estáticos de cada administradora, rankings poco intuitivos de la Superfinanciera, y plataformas con acceso restringido (como TIVA), lo que resulta en decisiones de inversión desinformadas o en parálisis por no saber dónde poner su dinero.

---

## 2. Objetivo del demo (cómo se ve el éxito)

### Éxito se ve así:
Un usuario llega a mific, ve un ranking limpio de todos los FICs del mercado colombiano, filtra por tipo de fondo o administradora, entra al detalle de un fondo que le interesa, y luego compara visualmente la rentabilidad histórica de 2 a 5 fondos en una sola gráfica. Todo sin login, gratis, y en menos de 30 segundos desde que entra.

### No-Goals (fuera del alcance del MVP):
- Fondos de capital privado (no hay dataset abierto con API disponible)
- Alertas o notificaciones
- Simuladores de inversión
- Cuentas de usuario / login / favoritos
- Información que no esté en el dataset (comisiones, montos mínimos, calificación de riesgo)
- App móvil nativa

---

## 3. Usuario objetivo

| Atributo | Descripción |
|----------|-------------|
| **Rol** | Inversionista retail colombiano (persona natural con ahorros buscando dónde invertir) |
| **Nivel** | Conocimiento financiero básico-intermedio. Sabe qué es un fondo de inversión, pero no necesariamente entiende todas las métricas |
| **Restricción principal** | No tiene acceso a herramientas unificadas para comparar opciones. La información existe pero está fragmentada y es difícil de navegar |

---

## 4. Caso de uso principal (Happy Path)

**Condición inicial:** El usuario escucha que los fondos de inversión son buena opción, pero no sabe cuál elegir.

**Flujo paso a paso:**

1. El usuario entra a mific.co (o dominio equivalente)
2. Ve un ranking de fondos ordenados por rentabilidad anual (descendente por defecto)
3. Usa filtros para acotar: selecciona "FIC de tipo general" y "Fondos abiertos"
4. Escanea el ranking y le interesan 3 fondos de diferentes administradoras
5. Hace clic en uno de los fondos → ve la página de detalle con métricas e historial (último año por defecto)
6. Desde el detalle (o desde el ranking), selecciona 3 fondos para comparar (la selección se refleja en URL params `?compare=X,Y,Z`)
7. Ve una gráfica de líneas con la evolución de rentabilidad de los 3 fondos superpuestos (último año por defecto)
8. También ve una tabla comparativa lado a lado con las métricas clave
9. Toma una decisión más informada sobre a qué fondo acercarse

**Condición final:** El usuario entiende cómo se comparan los fondos que le interesan y tiene claridad para dar el siguiente paso (contactar a la administradora, abrir cuenta en una plataforma, etc.)

---

## 5. Decisiones funcionales (qué debe hacer)

| ID | Función | Notas |
|----|---------|-------|
| F1 | Mostrar ranking de fondos con datos actualizados diariamente | Fuente: API SODA dataset `qhpu-8ixx` de datos.gov.co. **Estrategia: ISR (Incremental Static Regeneration) con revalidación cada 24h en Vercel** |
| F2 | Ordenar el ranking por diferentes métricas | Rentabilidad diaria, mensual, semestral, anual. Por defecto: anual descendente |
| F3 | Filtrar fondos por múltiples criterios simultáneos | Tipo de fondo (general, inmobiliario, mercado monetario, bursátil, etc.), entidad administradora, subtipo (abierto/cerrado) |
| F4 | Buscar fondos por nombre o administradora | Búsqueda en tiempo real tipo "search-as-you-type" |
| F5 | Mostrar página de detalle individual de cada fondo | Métricas actuales + gráfica de evolución histórica (último año por defecto). Identificado por `codigo_negocio` |
| F6 | Permitir seleccionar 2-5 fondos para comparar | Desde el ranking o desde la página de detalle. **Selección persiste vía URL query params** (`?compare=codigo1,codigo2,...`) |
| F7 | Mostrar comparación visual en gráfica de líneas superpuestas | Eje X: tiempo (último año por defecto), Eje Y: rentabilidad. Debe poder cambiar entre rentabilidad mensual, semestral, anual |
| F8 | Mostrar tabla comparativa lado a lado | Mismas métricas del ranking pero en formato de columnas por fondo |

---

## 6. Decisiones de UX

### 6.1 Punto de entrada
- El usuario entra directamente a la URL
- Primera vista: ranking completo de fondos (no hay onboarding ni landing page en el MVP)
- Header con: logo "mific", barra de búsqueda, link a comparador

### 6.2 Inputs del usuario
- **Filtros:** dropdowns para tipo de fondo, administradora, subtipo
- **Búsqueda:** campo de texto libre
- **Ordenamiento:** clic en headers de columna del ranking
- **Selección para comparar:** checkbox o botón "comparar" en cada fila del ranking. La selección se persiste en URL query params (`?compare=codigo1,codigo2`) para poder compartir enlaces con fondos preseleccionados
- **Período de gráfica:** selector de período en la vista de comparación y detalle (por defecto: último año)

### 6.3 Outputs al usuario

**Pantalla 1 — Ranking (home):**
- Tabla con columnas: nombre del fondo, administradora, tipo, valor unidad, rentabilidad (mensual, semestral, anual)
- Cada fila es clicable → lleva al detalle (`/fondo/[codigo_negocio]`)
- Checkbox para seleccionar fondos a comparar
- Contador de fondos seleccionados + botón "Comparar (N)"

**Pantalla 2 — Detalle del fondo:**
- Header con nombre del fondo y administradora
- Cards con métricas principales: valor de la unidad, rentabilidades, número de inversionistas, valor total del fondo
- Gráfica de evolución histórica (rentabilidad o valor de unidad en el tiempo, último año por defecto)
- Botón "Agregar a comparación"

**Pantalla 3 — Comparador:**
- Gráfica de líneas con todos los fondos seleccionados superpuestos (último año por defecto)
- Selector de métrica (rentabilidad mensual / semestral / anual)
- Selector de período de tiempo
- Tabla comparativa debajo con todas las métricas lado a lado
- Posibilidad de quitar fondos de la comparación

### 6.4 Feedback y estados
- **Loading:** skeleton loaders en la tabla y en las gráficas mientras se consulta la API
- **Éxito:** datos se muestran de forma fluida. Indicador de "Datos actualizados al [fecha]" visible en el footer o header del ranking
- **Sin resultados:** mensaje amigable "No encontramos fondos con esos criterios. Intenta ajustar los filtros."
- **Parcial:** si la API retorna datos incompletos, mostrar lo disponible con nota

### 6.5 Errores (manejo mínimo viable)
- **API no disponible:** mensaje "No pudimos cargar los datos en este momento. Los datos provienen de la Superintendencia Financiera — intenta de nuevo en unos minutos." (ISR mitiga esto: la última versión cacheada se sirve mientras la API esté caída)
- **Búsqueda sin resultados:** limpiar filtros con un clic
- **Comparar sin selección:** botón deshabilitado hasta tener mínimo 2 fondos seleccionados
- **Más de 5 fondos:** mensaje "Puedes comparar máximo 5 fondos a la vez"

---

## 7. Datos y lógica

### 7.1 Fuente de datos

| Fuente | Tipo | Detalle |
|--------|------|---------|
| API SODA — datos.gov.co | API REST pública | Dataset `qhpu-8ixx`. Endpoint: `https://www.datos.gov.co/resource/qhpu-8ixx.json` |
| Usuario | Interacción en UI | Filtros, búsqueda, selección de fondos |

**Campos del dataset utilizados:**

| Campo API | Nombre en UI | Tipo |
|-----------|-------------|------|
| `codigo_negocio` | *(ID interno — usado en rutas y queries, no visible en UI)* | Texto (identificador único del fondo) |
| `nombre_entidad` | Administradora | Texto |
| `nombre_patrimonio` | Nombre del fondo | Texto |
| `nombre_tipo_patrimonio` | Tipo de fondo | Texto (categoría) |
| `nombre_subtipo_patrimonio` | Subtipo | Texto (categoría) |
| `valor_unidad_operaciones_dia_t` | Valor de la unidad | Número (COP) |
| `valor_fondo_cierre_dia_t` | Valor del fondo | Número (COP) |
| `numero_inversionistas` | Nº de inversionistas | Número |
| `rentabilidad_diaria` | Rent. diaria | % |
| `rentabilidad_mensual` | Rent. mensual | % |
| `rentabilidad_semestral` | Rent. semestral | % |
| `rentabilidad_anual` | Rent. anual | % |
| `fecha_corte` | Fecha de corte | Fecha |
| `rendimientos_abonados` | Rendimientos abonados | Número |
| `aportes_recibidos` | Aportes recibidos | Número |
| `retiros_redenciones` | Retiros | Número |

### 7.2 Procesamiento

```
[Ranking]
Next.js ISR (revalida cada 24h) → fetch API SODA (fecha más reciente) → genera página estática → filtrar/ordenar en cliente

[Detalle]
Next.js ISR por fondo → fetch API SODA (codigo_negocio + último año) → genera página estática con serie temporal

[Comparador]
Client-side fetch → API SODA (filtrar por N codigo_negocio + último año) → superponer series → renderizar gráfica + tabla
```

**Queries SODA clave:**

```
# Ranking (datos más recientes)
GET /resource/qhpu-8ixx.json?$where=fecha_corte='YYYY-MM-DD'&$limit=5000

# Detalle histórico de un fondo (último año)
GET /resource/qhpu-8ixx.json?$where=codigo_negocio='XXXX' AND fecha_corte>='YYYY-MM-DD'&$order=fecha_corte DESC

# Comparación de múltiples fondos (último año)
GET /resource/qhpu-8ixx.json?$where=codigo_negocio in ('X','Y','Z') AND fecha_corte>='YYYY-MM-DD'&$order=fecha_corte DESC
```

### 7.3 Outputs
- **ISR + client-side** — no hay base de datos propia ni backend custom. Las páginas de ranking y detalle se generan estáticamente con ISR (revalidación 24h). El comparador se renderiza client-side
- La selección de fondos para comparar se persiste exclusivamente en URL query params (`?compare=codigo1,codigo2,codigo3`). No hay estado en React global, localStorage, ni sesión
- Los filtros aplicados se reflejan en la URL para poder compartir enlaces

---

## Apéndice A: Stack técnico (referencia)

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Framework | Next.js (App Router) | Stack familiar para Manuel. ISR para datos diarios + SEO. TypeScript |
| Estilos | Tailwind CSS | Consistente con referencia visual (Bestclevers). Utility-first |
| Gráficas | Recharts o Chart.js | Gráficas de líneas con múltiples series. Recharts se integra nativamente con React |
| Fetching | SWR o TanStack Query | Cache, revalidación, manejo de estados de carga (para fetches client-side en comparador) |
| Deploy | Vercel | Integración nativa con Next.js. Free tier suficiente. ISR nativo |

## Apéndice B: Referencia visual

- **Estilo general:** inspirado en [Bestclevers LMS](https://www.behance.net/gallery/239958479/LMS-Bestclevers)
- **Principios:** fondo claro, uso generoso de espacio en blanco, cards con bordes suaves, tipografía limpia (Inter o similar), colores de acento para CTAs y gráficas
- **Tabla del ranking:** filas con hover state, texto alineado a la derecha para números, badges de color para tipo de fondo
- **Gráficas:** líneas con colores diferenciados por fondo, tooltips al hover, leyenda visible

## Apéndice C: Mapa de pantallas

```
mific.co/                              → Ranking (home) — ISR 24h
mific.co/fondo/[codigo_negocio]        → Detalle del fondo — ISR 24h
mific.co/comparar?ids=X,Y,Z           → Comparador — client-side render
```

---

## Apéndice D: Decisiones de clarificación (v1.1)

| Ambigüedad | Decisión | Impacto |
|-------------|----------|---------|
| Identificador único del fondo | Usar `codigo_negocio` del dataset como ID en rutas y queries | Agregado a tabla de campos (7.1). Rutas: `/fondo/[codigo_negocio]` |
| Rango de tiempo por defecto en gráficas | Último año (365 días) | Queries filtran por `fecha_corte >= hace 1 año`. Aplica a detalle y comparador |
| Estrategia de actualización de datos | ISR (Incremental Static Regeneration) con revalidación cada 24h | Ranking y detalle son páginas estáticas regeneradas diariamente. Comparador es client-side |
| Persistencia de selección de fondos | URL query params exclusivamente (`?compare=X,Y,Z`) | Sin estado global, sin localStorage. Los enlaces con fondos preseleccionados son compartibles |
