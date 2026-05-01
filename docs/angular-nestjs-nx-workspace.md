# Guia para crear un monorepositorio Angular + NestJS con Nx Workspace

Este documento describe una forma practica de iniciar un monorepositorio con Angular para el frontend, NestJS para el backend y Nx como herramienta de workspace, build, testing y organizacion.

## Objetivo

Crear un workspace con esta base:

```text
my-product/
├── apps/
│   ├── web/          # Angular
│   └── api/          # NestJS
├── libs/
│   ├── shared/
│   │   ├── types/    # DTOs, contratos y tipos compartidos
│   │   └── utils/    # utilidades puras reutilizables
│   └── data-access/  # clientes HTTP, adapters o SDKs internos
├── nx.json
├── package.json
└── tsconfig.base.json
```

## Requisitos

- Node.js LTS instalado.
- `pnpm` instalado y habilitado.
- Git instalado.

Verificacion rapida:

```bash
node --version
pnpm --version
git --version
```

Si `pnpm` no esta disponible:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Crear el workspace

Crear un workspace integrado de Nx:

```bash
pnpm dlx create-nx-workspace@latest my-product
```

Durante el asistente, usar estas opciones como referencia:

```text
Workspace style: integrated
Package manager: pnpm
CI provider: GitHub Actions, si aplica
Remote caching: segun necesidad del equipo
```

Entrar al proyecto:

```bash
cd my-product
```

## Instalar plugins de Angular, NestJS y TypeScript

Agregar los plugins oficiales de Nx. Usar `nx add` mantiene las versiones de los plugins alineadas con la version de `nx` del workspace:

```bash
pnpm nx add @nx/angular
pnpm nx add @nx/nest
pnpm nx add @nx/js
```

## Crear la aplicacion Angular

Generar la app web:

```bash
pnpm nx g @nx/angular:app apps/web \
  --style=css \
  --routing=true \
  --addTailwind=true \
  --ssr=false
```

Notas:

- Nx genera aplicaciones Angular standalone por defecto en versiones modernas.
- No declarar `standalone: true` manualmente en decoradores si el proyecto usa Angular v20+.
- Usar lazy loading para rutas de features.
- Usar signals para estado local y derivado.
- Usar Reactive Forms o Signal Forms si la version de Angular lo permite.

## Crear la aplicacion NestJS

Generar la API:

```bash
pnpm nx g @nx/nest:app apps/api --frontendProject=web
```

`--frontendProject=web` configura soporte de proxy para que la app Angular pueda acceder a la API durante desarrollo.

Convenciones recomendadas para NestJS:

- Separar modulos por dominio o feature.
- Mantener controladores delgados.
- Poner reglas de negocio en services o casos de uso.
- Validar entrada con DTOs.
- Compartir contratos desde `libs/shared/types` cuando frontend y backend dependan del mismo shape de datos.

## Crear librerias compartidas

Tipos compartidos:

```bash
pnpm nx g @nx/js:lib libs/shared/types \
  --bundler=tsc \
  --unitTestRunner=vitest
```

Utilidades puras:

```bash
pnpm nx g @nx/js:lib libs/shared/utils \
  --bundler=tsc \
  --unitTestRunner=vitest
```

Data access para Angular:

```bash
pnpm nx g @nx/angular:lib libs/data-access/api-client \
  --unitTestRunner=vitest
```

Ejemplo de importacion esperada:

```ts
import type { UserDto } from '@my-product/shared/types';
```

## Configurar aliases

Revisar `tsconfig.base.json` y confirmar que existan paths similares:

```json
{
  "compilerOptions": {
    "paths": {
      "@my-product/shared/types": ["libs/shared/types/src/index.ts"],
      "@my-product/shared/utils": ["libs/shared/utils/src/index.ts"],
      "@my-product/data-access/api-client": ["libs/data-access/api-client/src/index.ts"]
    }
  }
}
```

Usar imports por alias en lugar de rutas relativas largas.

## Scripts recomendados

Agregar o revisar scripts en `package.json`:

```json
{
  "scripts": {
    "dev:web": "nx serve web",
    "dev:api": "nx serve api",
    "build": "nx run-many -t build",
    "build:web": "nx build web",
    "build:api": "nx build api",
    "test": "nx run-many -t test",
    "lint": "nx run-many -t lint",
    "affected:build": "nx affected -t build",
    "affected:test": "nx affected -t test",
    "affected:lint": "nx affected -t lint"
  }
}
```

Ejecutar aplicaciones:

```bash
pnpm dev:web
pnpm dev:api
```

## Comunicacion Angular con NestJS

Definir una URL base para la API en Angular.

Ejemplo de environment:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

En NestJS, usar un prefijo global:

```ts
app.setGlobalPrefix('api');
```

Si frontend y backend corren en puertos distintos durante desarrollo, habilitar CORS en `main.ts` de NestJS:

```ts
app.enableCors({
  origin: 'http://localhost:4200',
});
```

## DTO compartido de ejemplo

Crear un contrato en `libs/shared/types/src/lib/user.dto.ts`:

```ts
export interface UserDto {
  id: string;
  email: string;
  displayName: string;
}
```

Exportarlo desde `libs/shared/types/src/index.ts`:

```ts
export type { UserDto } from './lib/user.dto';
```

Usarlo en NestJS:

```ts
import type { UserDto } from '@my-product/shared/types';
```

Usarlo en Angular:

```ts
import type { UserDto } from '@my-product/shared/types';
```

## Reglas de limites entre proyectos

Configurar restricciones de dependencias en `eslint.config.mjs` o en la configuracion equivalente del workspace.

Reglas recomendadas:

- `apps/web` puede depender de `libs/shared/*` y `libs/data-access/*`.
- `apps/api` puede depender de `libs/shared/*`.
- `libs/shared/types` no debe depender de Angular ni NestJS.
- `libs/shared/utils` debe contener funciones puras.
- Evitar dependencias circulares entre libs.

## Tailwind CSS en Angular

La aplicacion Angular se creo con `--addTailwind=true`. Si se necesita configurar Tailwind despues en otra app o lib Angular:

```bash
pnpm nx g @nx/angular:setup-tailwind web
```

Si el generador no cubre un caso especifico, instalar dependencias manualmente:

```bash
pnpm add -D tailwindcss @tailwindcss/postcss postcss
```

Crear o revisar `.postcssrc.json` cuando aplique:

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

Importar Tailwind en el CSS global de Angular:

```css
@import "tailwindcss";
```

## Testing y calidad

Ejecutar validaciones locales:

```bash
pnpm lint
pnpm test
pnpm build
```

Para validar solo lo afectado:

```bash
pnpm nx affected -t lint test build
```

Antes de abrir un PR:

```bash
pnpm lint
pnpm test
pnpm build
```

## Flujo de trabajo recomendado

1. Crear o modificar una feature en una app o lib concreta.
2. Extraer tipos compartidos solo cuando sean usados por Angular y NestJS.
3. Mantener `shared/types` libre de dependencias de framework.
4. Ejecutar `pnpm nx affected -t lint test build`.
5. Abrir PR pequeno y enfocado.

## Comandos utiles de Nx

Ver grafo de dependencias:

```bash
pnpm nx graph
```

Listar proyectos:

```bash
pnpm nx show projects
```

Ejecutar un target especifico:

```bash
pnpm nx run web:build
pnpm nx run api:build
```

Generar un componente Angular:

```bash
pnpm nx g @nx/angular:component apps/web/src/app/features/users/user-list/user-list
```

Generar un recurso NestJS:

```bash
pnpm nx g @nx/nest:resource apps/api/src/app/users/users --project=api
```

## Criterios de aceptacion del setup

El monorepo queda listo cuando:

- `pnpm nx show projects` lista `web`, `api` y las libs compartidas.
- `pnpm dev:web` levanta Angular correctamente.
- `pnpm dev:api` levanta NestJS correctamente.
- Angular puede consumir un endpoint de NestJS.
- `pnpm lint`, `pnpm test` y `pnpm build` terminan sin errores.
- Las dependencias compartidas viven en `libs/` y no en imports relativos entre apps.

## Referencias oficiales

- Nx Angular plugin: https://nx.dev/docs/technologies/angular/introduction
- Generadores Angular de Nx: https://nx.dev/docs/technologies/angular/generators
- Nx Nest plugin: https://nx.dev/docs/technologies/node/nest/introduction
- Generadores Nest de Nx: https://nx.dev/docs/technologies/node/nest/generators
