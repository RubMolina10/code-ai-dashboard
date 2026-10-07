# Code Intelligence Dashboard

Frontend web del proyecto **Code Intelligence Dashboard**.

Esta aplicación permite visualizar proyectos, ramas, commits, análisis de código, findings, métricas y resultados generados mediante Inteligencia Artificial.

El frontend consume la API de **Code Intelligence API** y presenta una interfaz para trabajar con:

- Proyectos
- Repositorios GitHub
- Branches
- Commits
- Commit Diff
- Code Review con IA
- Impact / Regression Analysis
- Findings
- Dashboard
- Métricas de Code Health

---

# Tecnologías

El frontend está desarrollado con:

- Angular
- TypeScript
- SCSS
- Angular Router
- Angular HttpClient
- Standalone Components

---

# Requisitos

Antes de instalar el proyecto necesitas:

- Git
- Node.js
- npm
- Angular CLI

Se recomienda utilizar:

```text
Node.js 24.x
```

Verifica tus versiones:

```powershell
node -v
npm -v
ng version
```

---

# 1. Clonar el repositorio

```powershell
git clone URL_DEL_REPOSITORIO
```

Entrar al proyecto:

```powershell
cd code-ai-dashboard
```

---

# 2. Instalar Node.js

Si ya tienes Node.js 24 puedes omitir este paso.

En Windows se recomienda utilizar **NVM for Windows**.

Ver versiones instaladas:

```powershell
nvm list
```

Instalar Node 24:

```powershell
nvm install 24
```

Activarlo:

```powershell
nvm use 24
```

Validar:

```powershell
node -v
```

Debe mostrar algo similar a:

```text
v24.x.x
```

---

# 3. Instalar Angular CLI

Si no tienes Angular CLI instalado:

```powershell
npm install -g @angular/cli
```

Validar:

```powershell
ng version
```

---

# 4. Instalar dependencias

Desde la raíz del proyecto:

```powershell
npm install
```

Esto instalará todas las dependencias declaradas en:

```text
package.json
```

---

# 5. Configurar conexión con la API

Actualmente el frontend consume la API desde:

```text
http://localhost:3000
```

Los servicios Angular utilizan endpoints como:

```text
http://localhost:3000/api/projects
http://localhost:3000/api/github
http://localhost:3000/api/analysis
http://localhost:3000/api/findings
http://localhost:3000/api/dashboard
```

Por ejemplo:

```typescript
private readonly apiUrl =
  'http://localhost:3000/api/analysis';
```

Antes de levantar el frontend debes asegurarte de que la API esté ejecutándose.

---

# 6. Levantar la API

En otra terminal:

```powershell
cd C:\localhost\CODE-DASHBOARD\code-ai-api
npm run dev
```

La API debe quedar disponible en:

```text
http://localhost:3000
```

---

# 7. Ejecutar el frontend

Desde:

```text
code-ai-dashboard
```

ejecutar:

```powershell
ng serve
```

La aplicación quedará disponible en:

```text
http://localhost:4200
```

También puedes utilizar:

```powershell
npm start
```

si el script está configurado dentro de `package.json`.

---

# 8. Abrir la aplicación

Abrir en el navegador:

```text
http://localhost:4200
```

La aplicación mostrará el Dashboard principal.

---

# Estructura principal

```text
code-ai-dashboard/
│
├── src/
│   │
│   ├── app/
│   │   │
│   │   ├── core/
│   │   │   │
│   │   │   ├── models/
│   │   │   │
│   │   │   └── services/
│   │   │
│   │   │
│   │   ├── features/
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │
│   │   │   ├── projects/
│   │   │   │
│   │   │   ├── analysis/
│   │   │   │
│   │   │   ├── commits/
│   │   │   │
│   │   │   └── findings/
│   │   │
│   │   │
│   │   ├── layout/
│   │   │   └── shell/
│   │   │
│   │   ├── app.ts
│   │   ├── app.html
│   │   ├── app.scss
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   │
│   ├── styles.scss
│   └── main.ts
│
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

---

# Módulos principales

## Dashboard

Ruta:

```text
/dashboard
```

Muestra información general del sistema:

```text
Code Health
Proyectos
Findings pendientes
Commits analizados
Último análisis
Análisis recientes
```

Los datos provienen de:

```text
GET /api/dashboard
```

---

## Projects

Ruta:

```text
/projects
```

Permite administrar proyectos conectados al sistema.

Actualmente incluye:

```text
Crear proyecto
Consultar proyectos
Eliminar proyecto
Configurar provider
Configurar repository URL
Configurar default branch
```

La información se obtiene desde:

```text
GET /api/projects
```

---

## Commits

Ruta:

```text
/commits
```

Permite consultar:

```text
Proyecto
Rama
Commits
Autor
Fecha
Mensaje
SHA
Archivos modificados
Diff
```

El frontend obtiene esta información mediante la integración con GitHub.

---

## Analysis

Ruta:

```text
/analysis
```

Permite seleccionar:

```text
Proyecto
Tipo de análisis
Rama
Commit
```

Actualmente existen dos tipos de análisis.

### Commit Review

Analiza únicamente los cambios realizados dentro del commit.

Flujo:

```text
GitHub Commit
    ↓
Git Diff
    ↓
Gemini AI Review
    ↓
Findings
    ↓
SQL Server
```

---

### Impact / Regression Analysis

Busca código relacionado con el commit para detectar posibles regresiones fuera de los archivos modificados.

Flujo:

```text
GitHub Commit
    ↓
Git Diff
    ↓
Dependency Scan
    ↓
Gemini Impact Review
    ↓
Findings
    ↓
SQL Server
```

---

# Findings

Ruta:

```text
/findings
```

Permite consultar findings generados por los análisis.

Los findings se pueden filtrar por:

```text
Proyecto
Severidad
Estado
```

Severidades disponibles:

```text
Critical
High
Medium
Low
```

Estados:

```text
New
Resolved
```

También permite:

```text
Resolver finding
Reabrir finding
Consultar descripción
Consultar sugerencia
Consultar archivo
Consultar línea
Consultar commit
```

---

# Navegación

La aplicación utiliza Angular Router.

Las rutas principales son:

```text
/dashboard
/projects
/analysis
/commits
/findings
```

Todas se renderizan dentro del componente:

```text
layout/shell
```

---

# Configuración Angular

La aplicación utiliza Standalone Components.

El archivo principal:

```text
src/app/app.ts
```

contiene:

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
```

El archivo:

```text
src/app/app.config.ts
```

debe registrar:

```typescript
provideRouter(routes)
```

y:

```typescript
provideHttpClient()
```

para permitir navegación y llamadas HTTP.

---

# CORS

La API debe permitir solicitudes desde:

```text
http://localhost:4200
```

En el backend Fastify se utiliza una configuración similar a:

```typescript
app.register(cors, {
  origin: [
    'http://localhost:4200'
  ],
  methods: [
    'GET',
    'HEAD',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS'
  ]
});
```

Si el frontend no puede conectarse a la API, revisa primero la configuración de CORS.

---

# Compilar para producción

Ejecutar:

```powershell
ng build
```

Angular generará los archivos compilados en:

```text
dist/
```

Dependiendo de la versión de Angular, la salida normalmente estará dentro de una carpeta con el nombre del proyecto.

---

# Ejecutar build local

Después de:

```powershell
ng build
```

puedes servir los archivos compilados utilizando cualquier servidor web compatible.

Ejemplos:

```text
Nginx
Apache
IIS
Node.js
Docker
```

---

# Flujo completo del sistema

```text
Angular Dashboard
      ↓
Code Intelligence API
      ↓
GitHub API
      ↓
Repository
      ↓
Branch
      ↓
Commit
      ↓
Diff
      ↓
Gemini AI
      ↓
AnalysisRuns
      ↓
Findings
      ↓
SQL Server
      ↓
Angular Dashboard
```

---

# Servicios Angular

Actualmente el frontend utiliza servicios para separar la comunicación con la API.

Ejemplos:

```text
core/services/project.ts
core/services/github.ts
core/services/analysis.ts
core/services/finding.ts
core/services/dashboard.ts
```

Esto evita realizar llamadas HTTP directamente desde los componentes.

---

# Modelos

Los modelos principales se encuentran en:

```text
src/app/core/models/
```

Ejemplos:

```text
project.model.ts
analysis.model.ts
commit.model.ts
finding.model.ts
```

---

# Solución de problemas

## `ng` no se reconoce

Si aparece:

```text
'ng' is not recognized
```

instala Angular CLI:

```powershell
npm install -g @angular/cli
```

Después abre una terminal nueva:

```powershell
ng version
```

---

## La API no responde

Verifica que el backend esté ejecutándose:

```powershell
cd C:\localhost\CODE-DASHBOARD\code-ai-api
npm run dev
```

Después prueba:

```text
http://localhost:3000
```

o alguno de los endpoints:

```text
http://localhost:3000/api/projects
http://localhost:3000/api/dashboard
```

---

## Error CORS

Si aparece un error relacionado con:

```text
Access-Control-Allow-Origin
CORS policy
```

verifica que el backend permita:

```text
http://localhost:4200
```

---

## El frontend sigue mostrando cambios anteriores

Detén Angular:

```powershell
Ctrl + C
```

Vuelve a ejecutar:

```powershell
ng serve
```

También puedes limpiar caché de Angular si fuera necesario:

```powershell
Remove-Item -Recurse -Force .angular
ng serve
```

---

## Error de Node.js

Verifica:

```powershell
node -v
```

Se recomienda:

```text
Node.js 24.x
```

Si utilizas NVM:

```powershell
nvm use 24
```

---

## API URL incorrecta

Si el frontend intenta conectarse a una URL incorrecta, revisa los servicios dentro de:

```text
src/app/core/services/
```

Por ejemplo:

```typescript
private readonly apiUrl =
  'http://localhost:3000/api/analysis';
```

---

# Desarrollo local

Para trabajar con frontend y backend al mismo tiempo necesitas dos terminales.

Terminal 1:

```powershell
cd C:\localhost\CODE-DASHBOARD\code-ai-api
npm run dev
```

Terminal 2:

```powershell
cd C:\localhost\CODE-DASHBOARD\code-ai-dashboard
ng serve
```

Después abre:

```text
http://localhost:4200
```

---

# Estado actual

Funcionalidades implementadas:

```text
✅ Dashboard
✅ Projects
✅ GitHub Branches
✅ GitHub Commits
✅ Commit Diff
✅ Commit Review
✅ Gemini AI Integration
✅ Code Health
✅ Risk Level
✅ Findings
✅ Filtros de Findings
✅ Resolver / Reabrir Findings
✅ Historial de análisis
🚧 Impact / Regression Analysis
```

Funcionalidades consideradas para siguientes versiones:

```text
Build automático
Tests automáticos
Pull Request Review
Comparación de ramas
Dependency Graph
Análisis estático
Baseline de Findings
Security Review
Full Project Scan
Webhooks
```

---

# Seguridad

El frontend no debe contener:

```text
Gemini API Keys
GitHub Tokens
SQL Passwords
Credenciales sensibles
```

Todas las credenciales deben permanecer en el backend.

El frontend únicamente debe consumir endpoints HTTP expuestos por la API.

---

# Desarrollo

Este proyecto fue construido utilizando un enfoque de:

```text
Vibe Coding
+
Software Engineering
+
Artificial Intelligence
```

El objetivo es experimentar con una plataforma que permita analizar cambios de código, detectar riesgos y visualizar el impacto de los commits antes de que lleguen a producción.

---

# Code Intelligence Dashboard

```text
Projects
   ↓
Branches
   ↓
Commits
   ↓
Analysis
   ↓
AI Review
   ↓
Impact Analysis
   ↓
Findings
   ↓
Dashboard
```
