# 🤖 BRAIN BOX FTC

[![Astro](https://img.shields.io/badge/Astro-5.16.6-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.89.0-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.182.0-000000?style=for-the-badge&logo=three.dot.js&logoColor=white)](https://threejs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

**BRAIN BOX FTC** es una plataforma educativa de vanguardia diseñada para democratizar el conocimiento técnico en la robótica de competición. Combina un robusto sistema de gestión de aprendizaje (LMS) con un entorno de simulación 3D interactivo, análisis de portafolios con IA y herramientas administrativas completas.

[🌐 **Live Demo**](https://brain-box-ftc.vercel.app) | [📦 **Repositorio**](https://github.com/isanchezv07/BRAIN-BOX-FTC) | [📖 **Documentación**](#) | [🐛 **Reportar Bug**](https://github.com/isanchezv07/BRAIN-BOX-FTC/issues)

---

## 📑 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Arquitectura Técnica](#-arquitectura-técnica)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Variables de Entorno](#-variables-de-entorno)
- [Guía de Uso](#-guía-de-uso)
- [Sistema de Roles y Permisos](#-sistema-de-roles-y-permisos)
- [API Endpoints](#-api-endpoints)
- [El Playground (Simulación Robótica)](#-el-playground-simulación-robótica)
- [Análisis de Portafolios con IA](#-análisis-de-portafolios-con-ia)
- [Desarrollo](#-desarrollo)
- [Contribuciones](#-contribuciones)
- [Troubleshooting](#-troubleshooting)
- [Licencia y Disclaimer](#-licencia-y-disclaimer)
- [Contacto y Soporte](#-contacto-y-soporte)

---

## ✨ Características Principales

### 🎓 Sistema de Cursos Dinámico
- **Lecciones Estructuradas**: Sistema de cursos con lecciones organizadas por niveles y prerequisitos
- **Soporte Multiidioma**: Internacionalización completa (ES/EN) con detección automática de idioma
- **Progresión Inteligente**: Sistema de desbloqueo basado en completitud de lecciones previas
- **Contenido Interactivo**: Integración de videos, imágenes, código y simulaciones

### 🎮 Interactive Playground
- **Simulador Robótico 3D**: Entorno de simulación avanzado usando Three.js
- **Cinemática Inversa**: Algoritmos para calcular el movimiento de articulaciones basado en coordenadas de destino
- **Visualización de Working Spaces**: Representación gráfica de los espacios de trabajo del robot
- **Control HMI**: Interfaz humano-máquina para control remoto de sistemas mecánicos
- **Simulación de Latencia**: Emulación de condiciones reales de control remoto

### 🧠 Sistema de Quizzes
- **Motor de Exámenes Interactivos**: Sistema completo de evaluación con múltiples tipos de preguntas
- **Persistencia de Datos**: Guardado automático del progreso y resultados
- **Feedbacks Personalizados**: Retroalimentación detallada según el rendimiento
- **Bancos de Preguntas**: Almacenamiento estructurado en JSON con soporte multiidioma
- **Evaluación Automática**: Sistema de calificación y certificación automática

### 🛡️ Panel Administrativo
- **Gestión de Usuarios**: CRUD completo de usuarios con roles y permisos
- **Auditoría de Logs**: Sistema de registro de actividades y eventos del sistema
- **Analíticas Avanzadas**: Dashboard con métricas de uso, progreso y engagement
- **Control de Contenidos**: Gestión de cursos, lecciones, categorías y quizzes
- **Sistema de Moderación**: Herramientas para reportes, baneos y gestión de seguridad

### 📜 Sistema de Certificación
- **Generación Automática**: Creación de certificados personalizados tras aprobar cursos
- **Validación con QR**: Códigos QR para verificación de autenticidad
- **Exportación PDF**: Descarga de certificados en formato PDF
- **Historial Completo**: Registro de todos los certificados obtenidos por usuario

### 🤖 Integración con IA
- **Análisis de Portafolios**: Evaluación automática de Engineering Portfolios usando IA
- **Evaluación según Rúbricas FTC**: Análisis basado en las reglas oficiales de FIRST Tech Challenge
- **Simulación de Entrevistas**: Generación de preguntas que los jueces harían
- **Recomendaciones Personalizadas**: Sugerencias específicas para mejorar el portafolio
- **Límite de Uso**: Sistema de créditos para controlar el uso del análisis (5 análisis por usuario)

### 🔐 Seguridad y Autenticación
- **Autenticación con Supabase**: Sistema robusto de login, registro y recuperación de contraseña
- **Control de Acceso Basado en Roles (RBAC)**: Sistema granular de permisos
- **Middleware de Seguridad**: Protección de rutas y validación de sesiones
- **Sistema de Baneos**: Gestión de usuarios baneados con diferentes niveles de restricción
- **Verificación de Email**: Confirmación de correo electrónico para nuevas cuentas

---

## 🏗️ Arquitectura Técnica

El proyecto utiliza una arquitectura híbrida que prioriza el rendimiento, la escalabilidad y la interactividad. La aplicación está construida sobre **Astro 5.x** con renderizado del lado del servidor (SSR), permitiendo una carga inicial rápida y una experiencia de usuario fluida.

### Principios de Diseño

- **Server-Side Rendering (SSR)**: Renderizado en el servidor para mejor SEO y rendimiento inicial
- **Componentes Híbridos**: Mezcla de componentes Astro (islands) y React para interactividad
- **API Routes**: Endpoints del servidor para operaciones seguras y autenticadas
- **Middleware Layer**: Capa de middleware para autenticación, autorización y localización
- **Database-First**: Arquitectura centrada en Supabase PostgreSQL con Row Level Security (RLS)

### Flujo de Datos

```
Usuario → Middleware (Auth/RBAC) → Página Astro → Componentes React → API Routes → Supabase → Respuesta
```

---

## 🛠️ Stack Tecnológico

### Frontend Core
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Astro** | 5.16.6 | Framework principal con SSR/SSG híbrido |
| **React** | 19.2.3 | Componentes interactivos y UI dinámica |
| **TypeScript** | 5.x | Tipado estático y mejor DX |
| **Tailwind CSS** | 4.1.18 | Framework de utilidades CSS |

### 3D y Simulación
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Three.js** | 0.182.0 | Motor de renderizado 3D |
| **Cannon.js** | 0.20.0 | Motor de física para simulaciones |
| **Custom Kinematics** | - | Algoritmos de cinemática inversa |

### Backend y Base de Datos
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Supabase** | 2.89.0 | Backend as a Service (PostgreSQL, Auth, Storage) |
| **PostgreSQL** | - | Base de datos relacional |
| **Row Level Security** | - | Seguridad a nivel de fila |


### Utilidades y Librerías
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Zod** | 4.3.6 | Validación de esquemas |
| **Marked** | 17.0.1 | Procesamiento de Markdown |
| **Chart.js** | 4.5.1 | Visualización de datos y gráficos |
| **html2canvas** | 1.4.1 | Generación de imágenes desde HTML |
| **jspdf** | 4.0.0 | Generación de PDFs |
| **qrcode** | 1.5.4 | Generación de códigos QR |
| **canvas-confetti** | 1.9.4 | Efectos visuales de celebración |
| **react-confetti** | 6.4.0 | Animaciones de confeti |
| **react-quiz-component** | 0.9.1 | Componente de quizzes interactivos |
| **Blockly** | 12.3.1 | Editor visual de código (futuro) |

### Deployment y DevOps
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Vercel** | - | Plataforma de deployment |
| **@astrojs/vercel** | 9.0.2 | Adapter para Vercel |
| **@vercel/analytics** | 1.6.1 | Analytics de Vercel |
| **@vercel/speed-insights** | 1.3.1 | Métricas de rendimiento |

---

## 📁 Estructura del Proyecto

```
BRAIN-BOX-FTC/
├── .vscode/                    # Configuración de VS Code
│   ├── extensions.json         # Extensiones recomendadas
│   └── launch.json             # Configuración de debug
├── public/                     # Archivos estáticos
│   └── favicon.svg             # Favicon del sitio
├── src/
│   ├── components/             # Componentes reutilizables
│   │   ├── admin/             # Componentes del panel admin
│   │   │   ├── CategoryManager.astro
│   │   │   ├── CourseManager.astro
│   │   │   ├── LessonManager.astro
│   │   │   ├── StatsDashboard.astro
│   │   │   ├── UserManagement.astro
│   │   │   └── ViewLogs.astro
│   │   ├── BaseHead.astro      # Head base del sitio
│   │   ├── CertificateGenerator.astro
│   │   ├── CelebrateButton.tsx
│   │   ├── DataCatcher.astro
│   │   ├── LanguagePicker.astro
│   │   ├── QuizComponent.tsx
│   │   ├── SecurityGuard.astro
│   │   ├── UserMenu.astro
│   │   └── WorkInProgress.astro
│   ├── data/
│   │   └── quizzes/           # Bancos de preguntas
│   │       ├── en/            # Quizzes en inglés
│   │       │   └── java/
│   │       └── es/            # Quizzes en español
│   │           └── java/
│   ├── i18n/                  # Sistema de internacionalización
│   │   ├── en.json            # Traducciones en inglés
│   │   ├── es.json            # Traducciones en español
│   │   ├── index.ts           # Configuración i18n
│   │   ├── ui.ts              # Utilidades de UI
│   │   └── utils.ts           # Utilidades de traducción
│   ├── lib/                   # Librerías y utilidades
│   │   ├── aiPrompt.ts        # Prompts para IA
│   │   ├── supabase.ts        # Cliente de Supabase
│   │   └── supabaseAdmin.ts   # Cliente admin de Supabase
│   ├── layouts/               # Layouts de páginas
│   │   └── Layout.astro       # Layout principal
│   ├── middleware.ts          # Middleware de autenticación
│   ├── pages/                 # Páginas y rutas
│   │   ├── [locale]/          # Rutas internacionalizadas
│   │   │   ├── admin/         # Panel administrativo
│   │   │   ├── auth/         # Autenticación
│   │   │   ├── courses/      # Cursos y lecciones
│   │   │   ├── certificate/  # Certificados
│   │   │   ├── dashboard.astro
│   │   │   ├── perfil.astro
│   │   │   ├── playground/   # Simulador
│   │   │   ├── teacher/      # Panel de profesores
│   │   │   └── mod/          # Panel de moderadores
│   │   ├── api/              # API endpoints
│   │   │   ├── admin/        # Endpoints admin
│   │   │   ├── auth/         # Endpoints de autenticación
│   │   │   ├── courses/      # Endpoints de cursos
│   │   │   ├── mod/          # Endpoints de moderación
│   │   │   └── analyze-portfolio.ts
│   │   └── auth/             # Callbacks de autenticación
│   ├── styles/               # Estilos globales
│   │   └── global.css        # CSS global
│   └── types/           # Definiciones de tipos TypeScript
│       ├── react-confetti.d.ts
│       └── react-quiz-component.d.ts
├── tests/                     # Tests y scripts de prueba
│   └── test-ai.js
├── .gitignore                 # Archivos ignorados por Git
├── astro.config.mjs          # Configuración de Astro
├── package.json              # Dependencias y scripts
├── tsconfig.json             # Configuración de TypeScript
└── README.md                 # Este archivo
```

---

## 💻 Instalación y Configuración

### Prerrequisitos

- **Node.js** >= 20.x
- **npm** o **yarn** o **pnpm**
- Cuenta de **Supabase** (gratuita)
- Cuenta de **Agente de IA** (opcional, solo para análisis de portafolios)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/isanchezv07/BRAIN-BOX-FTC.git
cd BRAIN-BOX-FTC  
```

### Paso 2: Instalar Dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
```

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# Supabase Configuration
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Public Supabase (para cliente del navegador)
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_KEY=

# AI API KEY
AI_API_KEY=

# FIRST API KEY
FIRST_USERNAME=
FIRST_AUTH_TOKEN=
```

### Paso 4: Configurar Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Ejecuta las migraciones SQL necesarias (consulta la documentación de la base de datos)
3. Configura Row Level Security (RLS) según las políticas de seguridad del proyecto
4. Configura las funciones de autenticación y triggers necesarios

### Paso 5: Iniciar el Servidor de Desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

La aplicación estará disponible en `http://localhost:4321`

### Paso 6: Build para Producción

```bash
npm run build
npm run preview  # Para previsualizar el build
```

---

## 🔐 Variables de Entorno

### Variables Requeridas

| Variable | Descripción | Dónde Obtenerla |
|----------|-------------|-----------------|
| `SUPABASE_URL` | URL de tu proyecto Supabase | Dashboard de Supabase → Settings → API |
| `SUPABASE_KEY` | Anon/Public key de Supabase | Dashboard de Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key (solo servidor) | Dashboard de Supabase → Settings → API |
| `PUBLIC_SUPABASE_URL` | Misma que SUPABASE_URL (para cliente) | Dashboard de Supabase → Settings → API |
| `PUBLIC_SUPABASE_KEY` | Misma que SUPABASE_KEY (para cliente) | Dashboard de Supabase → Settings → API |


### Seguridad

⚠️ **IMPORTANTE**: 
- **NUNCA** commitees el archivo `.env` al repositorio
- La `SUPABASE_SERVICE_ROLE_KEY` solo debe usarse en el servidor, nunca en el cliente
- Mantén tus API keys seguras y rota las claves si se comprometen

---

## 📖 Guía de Uso

### Para Estudiantes

1. **Registro y Login**
   - Visita `/es/register` o `/en/register` para crear una cuenta
   - Verifica tu email siguiendo el enlace enviado
   - Inicia sesión en `/es/signin` o `/en/signin`

2. **Navegar Cursos**
   - Accede a tu dashboard en `/es/account/dashboard` o `/en/account/dashboard`
   - Explora los cursos disponibles
   - Completa las lecciones en orden (respetando prerequisitos)

3. **Tomar Quizzes**
   - Cada lección incluye un quiz al final
   - Responde las preguntas y revisa el feedback
   - Debes aprobar el quiz para desbloquear la siguiente lección

4. **Usar el Playground**
   - Accede al simulador en `/es/playground` o `/en/playground`
   - Experimenta con cinemática inversa y control de robots
   - Visualiza working spaces y practica con diferentes configuraciones

5. **Obtener Certificados**
   - Al completar un curso, recibirás un certificado automáticamente
   - Descarga tu certificado desde `/es/certificate/[id]` o `/en/certificate/[id]`
   - Comparte tu certificado con código QR para verificación

6. **Análisis de Portafolio**
   - Sube tu Engineering Portfolio en `/es/teacher/portfolio-ai` o `/en/teacher/portfolio-ai`
   - Recibe análisis detallado basado en rúbricas oficiales de FTC
   - Revisa preguntas de entrevista simuladas y recomendaciones

### Para Administradores

1. **Acceso al Panel Admin**
   - Inicia sesión con una cuenta de administrador
   - Accede a `/es/admin/account/dashboard` o `/en/admin/account/dashboard`

2. **Gestión de Usuarios**
   - Ve todos los usuarios en el panel de gestión
   - Cambia roles, banea/desbanea usuarios
   - Revisa estadísticas de uso

3. **Gestión de Contenido**
   - Crea y edita cursos desde `CourseManager`
   - Gestiona lecciones desde `LessonManager`
   - Organiza categorías desde `CategoryManager`

4. **Analíticas**
   - Revisa métricas en el `StatsDashboard`
   - Analiza logs de actividad en `ViewLogs`
   - Exporta datos para análisis externo

5. **Generar OTPs**
   - Genera códigos OTP de emergencia desde `/api/admin/generate-otp`
   - Úsalos para recuperación de acceso

### Para Moderadores

1. **Panel de Moderación**
   - Accede a `/es/mod/reports` o `/en/mod/reports`
   - Revisa reportes de usuarios
   - Ejecuta acciones de seguridad desde `/api/mod/execute-security`

### Para Profesores

1. **Panel de Profesores**
   - Accede a `/es/teacher/portfolio-ai` o `/en/teacher/portfolio-ai`
   - Analiza portafolios de estudiantes
   - Revisa recomendaciones y feedback generado por IA

---

## 👥 Sistema de Roles y Permisos

El sistema implementa un **Control de Acceso Basado en Roles (RBAC)** con los siguientes roles:

### Roles Disponibles

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **student** | Usuario estándar | Acceso a cursos, quizzes, playground, dashboard personal |
| **teacher** | Profesor/Instructor | Todo lo de student + análisis de portafolios, panel de profesores |
| **mod** | Moderador | Todo lo de student + panel de moderación, ejecución de acciones de seguridad |
| **admin** | Administrador | Acceso completo: gestión de usuarios, contenido, analíticas, configuración |

### Estados de Usuario

| Estado | Descripción | Efecto |
|--------|-------------|--------|
| **active** | Usuario activo normal | Acceso completo según su rol |
| **banned** | Usuario baneado temporalmente | Redirigido a página de baneo |
| **perma-ban** | Baneo permanente | Redirigido a página de baneo permanente |

### Protección de Rutas

El middleware (`src/middleware.ts`) protege automáticamente las rutas según el rol:

- `/admin/*` → Solo `admin`
- `/mod/*` → Solo `admin` o `mod`
- `/teacher/*` → Solo `admin` o `teacher`
- Rutas públicas → No requieren autenticación

---

## 🔌 API Endpoints

### Autenticación

| Endpoint | Método | Descripción | Autenticación |
|----------|--------|-------------|---------------|
| `/api/auth/register` | POST | Registrar nuevo usuario | No |
| `/api/auth/signin` | POST | Iniciar sesión | No |
| `/api/auth/signout` | POST | Cerrar sesión | Sí |
| `/api/auth/getUserProfile` | GET | Obtener perfil del usuario | Sí |
| `/api/auth/delete-account` | POST | Eliminar cuenta | Sí |

### Cursos

| Endpoint | Método | Descripción | Autenticación |
|----------|--------|-------------|---------------|
| `/api/courses/like` | POST | Dar like a un curso | Sí |

### Quizzes

| Endpoint | Método | Descripción | Autenticación |
|----------|--------|-------------|---------------|
| `/api/save-quiz` | POST | Guardar resultado de quiz | Sí |

### Administración

| Endpoint | Método | Descripción | Autenticación |
|----------|--------|-------------|---------------|
| `/api/admin/generate-otp` | POST | Generar código OTP de emergencia | Admin |

### Moderación

| Endpoint | Método | Descripción | Autenticación |
|----------|--------|-------------|---------------|
| `/api/mod/execute-security` | POST | Ejecutar acciones de seguridad (ban, warn, etc.) | Mod/Admin |

### IA

| Endpoint | Método | Descripción | Autenticación | Límite |
|----------|--------|-------------|---------------|--------|
| `/api/analyze-portfolio` | POST | Analizar Engineering Portfolio con IA | Sí | 5 por usuario|

### Formato de Respuestas

Todos los endpoints devuelven JSON con el siguiente formato:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "message": "Operación exitosa"
}
```

---

## 🤖 Análisis de Portafolios con IA

BRAIN BOX FTC incluye un sistema avanzado de análisis de Engineering Portfolios.

### Características

- **Evaluación según Rúbricas Oficiales**: Análisis basado en las reglas del Game Manual de FTC 2025-2026
- **Simulación de Entrevistas**: Genera preguntas realistas que los jueces harían
- **Análisis Crítico**: Evalúa como un juez senior de campeonato nacional
- **Recomendaciones Específicas**: Sugerencias concretas para mejorar el portafolio
- **Detección de Incumplimientos**: Identifica violaciones de reglas y elementos faltantes

### Premios Evaluados

El sistema evalúa el portafolio para los siguientes premios:

- **Inspire Award** (Premio principal)
- **Think Award**
- **Connect Award**
- **Reach Award**
- **Sustain Award**
- **Innovate Award (RTX)**
- **Control Award**
- **Design Award**

### Formato de Análisis

El análisis devuelve:

```json
{
  "score": 00,
  "verdict": "Award",
  "portfolio_compliance": {
    "page_limit": "Cumple",
    "content_coverage": "Completa",
    "evidence_quality": "Fuerte"
  },
  "analysis": "Evaluación detallada...",
  "critical_missing": [],
  "rule_violations": [],
  "strengths": ["Aspectos destacados"],
  "judge_questions": {
    "technical": [...],
    "engineering_process": [...],
    "software": [...],
    "outreach_leadership": [...],
    "inspire_award": [...]
  },
  "next_actions": ["Recomendaciones"],
  "inspire_gap": "Qué falta para ganar el premio"
}
```

### Límites de Uso

- **Usuarios estándar**: 5 análisis por cuenta
- Los análisis se cuentan en `profiles.scanner_usage_count`

---

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo en http://localhost:4321

# Build
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza el build de producción

# Testing
npm test            # Ejecuta tests (Vitest)

# Astro CLI
npm run astro       # Ejecuta comandos de Astro directamente
```

### Estructura de Componentes

#### Componentes Astro
- Usados para páginas estáticas y SEO
- Renderizado en el servidor
- Mínimo JavaScript enviado al cliente

#### Componentes React
- Usados para interactividad
- Hidratación selectiva (islands)
- Estado del lado del cliente

### Internacionalización

El sistema de i18n está configurado en `src/i18n/`:

- `en.json` - Traducciones en inglés
- `es.json` - Traducciones en español
- `index.ts` - Configuración y utilidades
- `utils.ts` - Funciones helper

Para agregar un nuevo idioma:

1. Crea `src/i18n/[locale].json`
2. Agrega el locale en `astro.config.mjs`
3. Agrega las traducciones correspondientes

### Estilos

El proyecto usa **Tailwind CSS 4.x** con configuración personalizada:

- Utilidades CSS modernas
- Diseño responsive por defecto
- Tema oscuro/claro (futuro)

### Base de Datos

El proyecto usa **Supabase PostgreSQL** con:

- Row Level Security (RLS) habilitado
- Triggers para sincronización automática
- Funciones almacenadas para lógica compleja

---

## 🤝 Contribuciones

¡BRAIN BOX FTC es un proyecto comunitario y todas las contribuciones son bienvenidas!

### Cómo Contribuir

1. **Fork el Repositorio**
   ```bash
   git clone https://github.com/tu-usuario/BRAIN-BOX-FTC.git
   ```

2. **Crea una Rama**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

3. **Haz tus Cambios**
   - Sigue las convenciones de código existentes
   - Agrega comentarios cuando sea necesario
   - Actualiza la documentación si es relevante

4. **Commit y Push**
   ```bash
   git commit -m "feat: descripción de la funcionalidad"
   git push origin feature/nueva-funcionalidad
   ```

5. **Abre un Pull Request**
   - Describe claramente los cambios
   - Menciona issues relacionados si los hay
   - Espera la revisión del equipo

### Áreas de Contribución

#### 📝 Contenido
- Escribir nuevas lecciones en `src/data/quizzes/`
- Crear quizzes para cursos existentes
- Mejorar traducciones en `src/i18n/`

#### 💻 Desarrollo Core
- Mejorar componentes de administración
- Optimizar el sistema de certificados
- Agregar nuevas funcionalidades

#### 🎮 Simulador
- Optimizar algoritmos de cinemática inversa
- Mejorar visualizaciones 3D
- Agregar nuevos tipos de robots

#### 🐛 Bug Fixes
- Reportar bugs en [Issues](https://github.com/isanchezv07/BRAIN-BOX-FTC/issues)
- Proponer soluciones
- Implementar fixes

#### 📚 Documentación
- Mejorar este README
- Crear guías de usuario
- Documentar APIs

### Convenciones de Código

- **Commits**: Usa [Conventional Commits](https://www.conventionalcommits.org/)
  - `feat:` Nueva funcionalidad
  - `fix:` Corrección de bug
  - `docs:` Cambios en documentación
  - `style:` Formato, punto y coma, etc.
  - `refactor:` Refactorización de código
  - `test:` Agregar o modificar tests
  - `chore:` Tareas de mantenimiento

- **TypeScript**: Usa tipos estrictos
- **Naming**: camelCase para variables, PascalCase para componentes
- **Comentarios**: En español o inglés, según el contexto

---

## 🔧 Troubleshooting

### Problemas Comunes

#### Error: "Falta SUPABASE_SERVICE_ROLE_KEY"
**Solución**: Asegúrate de tener todas las variables de entorno configuradas en `.env`

#### Error: "No se puede conectar a Supabase"
**Solución**: 
- Verifica que las URLs y keys sean correctas
- Revisa que tu proyecto de Supabase esté activo
- Verifica la configuración de RLS

#### Error: "Module not found"
**Solución**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Error: "Port already in use"
**Solución**: 
```bash
# Cambia el puerto en astro.config.mjs o mata el proceso
lsof -ti:4321 | xargs kill
```

#### Problemas con el Playground
**Solución**: 
- Verifica que los archivos en `public/playground/` estén presentes
- Revisa la consola del navegador para errores de JavaScript
- Asegúrate de usar un navegador moderno con soporte WebGL

#### Error de Autenticación
**Solución**:
- Verifica que las cookies estén habilitadas
- Revisa la configuración de CORS en Supabase
- Asegúrate de que el callback URL esté configurado correctamente

### Obtener Ayuda

- 📧 **Email**: [Abre un issue](https://github.com/isanchezv07/BRAIN-BOX-FTC/issues)
- 💬 **Chat**: Usa el chat de soporte en la aplicación (si está configurado)
- 📖 **Documentación**: Revisa la documentación de [Astro](https://docs.astro.build) y [Supabase](https://supabase.com/docs)

---

## ⚖️ Licencia y Disclaimer

### Licencia

Este proyecto se distribuye bajo la **Licencia MIT**. Ver el archivo `LICENSE` para más detalles.

```
MIT License

Copyright (c) 2026 BRAIN BOX FTC Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Disclaimer Legal

**BRAIN BOX FTC** es un recurso educativo independiente y **NO está afiliado, patrocinado ni aprobado oficialmente por FIRST®**.

**FIRST®**, **FTC®**, y **FIRST Tech Challenge®** son marcas registradas de **FIRST®** (For Inspiration and Recognition of Science and Technology).

Este proyecto es una herramienta educativa de código abierto creada por la comunidad para apoyar a los equipos de FIRST Tech Challenge. No representa las opiniones, políticas o posiciones oficiales de FIRST®.

### Uso de Marcas

- El uso de nombres y marcas de FIRST® es únicamente para fines educativos y de identificación
- No se pretende infringir derechos de marca registrada
- Si eres representante de FIRST® y tienes preocupaciones, por favor contacta a los mantenedores del proyecto

---
 
## 📞 Contacto y Soporte

### Mantenedores

- **Repositorio**: [GitHub](https://github.com/isanchezv07/BRAIN-BOX-FTC)
- **Issues**: [Reportar Bug o Solicitar Feature](https://github.com/isanchezv07/BRAIN-BOX-FTC/issues)
- **Pull Requests**: [Contribuir](https://github.com/isanchezv07/BRAIN-BOX-FTC/pulls)

### Recursos Adicionales

- 🌐 **Demo en Vivo**: [https://brain-box-ftc.vercel.app](https://brain-box-ftc.vercel.app)
- 📚 **Documentación de Astro**: [docs.astro.build](https://docs.astro.build)
- 🗄️ **Documentación de Supabase**: [supabase.com/docs](https://supabase.com/docs)
- 🎮 **Documentación de Three.js**: [threejs.org/docs](https://threejs.org/docs)

### Comunidad

Únete a la comunidad de BRAIN BOX FTC:

- ⭐ **Dale una estrella** al repositorio si te gusta el proyecto
- 🍴 **Fork** el proyecto para hacer tus propias modificaciones
- 📢 **Comparte** el proyecto con otros equipos de FTC
- 💡 **Sugiere** nuevas funcionalidades en Issues

---

## 🎯 Roadmap

### Próximas Características

- [ ] Soporte para más idiomas (Portugués, Francés)
- [ ] Sistema de badges y logros
- [ ] Foro de discusión integrado
- [ ] Sistema de mentoría entre pares
- [ ] Integración con GitHub para proyectos de código
- [ ] App móvil (React Native)
- [ ] Modo offline para lecciones
- [ ] Sistema de notificaciones push
- [ ] Analytics avanzados para profesores
- [ ] Exportación de datos de progreso

### Mejoras Técnicas

- [ ] Optimización de rendimiento del playground
- [ ] Implementación de PWA completa
- [ ] Tests automatizados (E2E)
- [ ] CI/CD pipeline mejorado
- [ ] Documentación de API con Swagger
- [ ] Sistema de plugins para extensiones

---

<div align="center">

**Hecho con ❤️ para la comunidad de FIRST®**

⭐ **Si este proyecto te ha ayudado, considera darle una estrella en GitHub** ⭐

</div>
