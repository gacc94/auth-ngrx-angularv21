# Angular Agent

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
- `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like `new Date()` are available.
- Do not write arrow functions in templates (they are not supported).

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Convenciones

- Usa pnpm para todo: pnpm install, pnpm add, pnpm dlx, pnpm dev, pnpm build
- TypeScript es obligatorio
- Usa siempre Tailwind CSS para estilos
- Iconos de tabler-icons. Importación explícita, nunca barrels
- Preferir ESM y sintaxis moderna del navegador

## Creación de proyectos

- Si hay que crear un proyecto nuevo, usa Astro
- Comando recomendado:
  `pnpm create astro@latest <project_name>`
- Configura TypeScript en modo estricto desde el inicio
- Añade Tailwind usando la integración oficial de Astro
- No añadir dependencias hasta que sean necesarias

## Organización

- Componentes pequeños, con una sola responsabilidad
- Preferir composición frente a configuraciones complejas
- Evita abstracciones prematuras
- El código compartido debe vivir en carpetas claras como `components`, `layouts`, `lib` o `utils`

## Reglas de TypeScript

- Evita `any` y `unknown`
- Preferir siempre que se pueda inferencia
- Si los tipos no están claros, parar y aclarar antes de continuar

## UI y estilos

- Tailwind es la única solución de estilos
- No duplicar clases si se puede extraer un componente
- Priorizar legibilidad frente a micro-optimizaciones visuales
- Accesibilidad no es opcional: HTML semántico, roles ARIA cuando aplique y foco gestionado

## Testing y calidad

- Revisar los workflows de CI en `.github/workflows`.
- Ejecutar los tests con:
  `pnpm test` o `pnpm turbo run test --filter <project_name>`
- Para Vitest:
  `pnpm vitest run -t "<nombre del test>"`
- Tras mover archivos o cambiar imports, ejecutar:
  `pnpm lint`
- No se acepta código con errores de tipos, lint o tests fallidos.
- Añadir o actualizar tests cuando se cambie comportamiento, aunque no se pida explícitamente.

## Rendimiento y decisiones técnicas

- No adivinar rendimiento, tamaño de bundle o tiempos de carga: medir.
- Si algo parece lento, añadir instrumentación antes de optimizar.
- Validar primero en pequeño antes de escalar cambios a todo el proyecto.

## Commits y Pull Requests

- Título del PR: [<project_name>] Descripción clara y concisa.
- PRs pequeños y enfocados.
- Antes de commitear:
- pnpm lint
- pnpm test
- Explicar qué ha cambiado, por qué y cómo se ha verificado.
- Si se introduce una nueva restricción ("nunca X", "siempre Y"), documentarla en este archivo.

## Comportamiento del agente

- Si una petición no está clara, hacer preguntas concretas antes de ejecutar.
- Tareas simples y bien definidas se ejecutan directamente.
- Cambios complejos (refactors, nuevas features, decisiones de arquitectura) requieren confirmar entendimiento antes de actuar.
- No asumir requisitos implícitos. Si falta información, se pide.
