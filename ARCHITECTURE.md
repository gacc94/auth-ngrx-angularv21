# Arquitectura del Proyecto

Este documento describe la arquitectura del proyecto Angular, incluyendo la estructura de carpetas, patrones de diseño, y convenciones de código.

## Tabla de Contenidos

- [Visión General](#visión-general)
- [Arquitectura Hexagonal](#arquitectura-hexagonal)
    - [Capa de Dominio (Domain)](#capa-de-dominio-domain)
    - [Capa de Aplicación (Application)](#capa-de-aplicación-application)
    - [Capa de Infraestructura (Infrastructure)](#capa-de-infraestructura-infrastructure)
    - [Capa de Presentación (Presentation)](#capa-de-presentación-presentation)
- [Arquitectura SCSS](#arquitectura-scss)
- [Metodología BEM](#metodología-bem)
- [Angular Material](#angular-material)
- [Estructura de Carpetas](#estructura-de-carpetas)

---

## Visión General

El proyecto sigue una **Arquitectura Hexagonal** (también conocida como Ports & Adapters) para las features que requieren lógica de negocio compleja. Esta arquitectura permite:

- **Separación de responsabilidades** clara entre capas
- **Testabilidad** mejorada mediante la inversión de dependencias
- **Flexibilidad** para cambiar implementaciones sin afectar el dominio
- **Mantenibilidad** a largo plazo del código

> [!NOTE]
> No todas las features requieren las 4 capas. Para features simples (CRUD básico, vistas estáticas), se puede simplificar la estructura según la complejidad.

---

## Arquitectura Hexagonal

La arquitectura hexagonal divide el código en 4 capas principales, cada una con responsabilidades específicas:

```text
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│         (Components, Pages, UI State, Templates)            │
├─────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                        │
│           (Use Cases, Stores, States, Effects)              │
├─────────────────────────────────────────────────────────────┤
│                      DOMAIN LAYER                           │
│    (Entities, Models, Ports, Exceptions, Factories)         │
├─────────────────────────────────────────────────────────────┤
│                   INFRASTRUCTURE LAYER                      │
│        (Repositories, Mappers, External Services)           │
└─────────────────────────────────────────────────────────────┘
```

### Capa de Dominio (Domain)

**Propósito:** Contiene la lógica de negocio pura y las reglas del dominio. Es el núcleo de la aplicación y **no debe depender de ninguna otra capa**.

**Estructura:**

```text
domain/
├── entities/       # Entidades de negocio con identidad única
├── models/         # Value Objects y DTOs del dominio
├── ports/          # Interfaces (contratos) para comunicación con otras capas
├── exceptions/     # Excepciones personalizadas del dominio
└── factories/      # Factories para crear entidades complejas
```

**Contenido por subcarpeta:**

| Carpeta       | Descripción                                                       | Ejemplo                       |
| ------------- | ----------------------------------------------------------------- | ----------------------------- |
| `entities/`   | Objetos con identidad única que representan conceptos del negocio | `User`, `Token`               |
| `models/`     | Value Objects inmutables, DTOs de entrada/salida                  | `Credentials`, `AuthResponse` |
| `ports/`      | Interfaces que definen contratos de comunicación                  | `AuthRepositoryPort`          |
| `exceptions/` | Errores específicos del dominio                                   | `AuthException`               |
| `factories/`  | Creación de entidades complejas                                   | `UserFactory`                 |

**Ejemplo de Port (Interface):**

```typescript
// domain/ports/auth-repository.port.ts
export interface AuthRepositoryPort {
    signInWithEmail(credentials: Credentials): Promise<Result<Token, AuthException>>;
    signInWithGoogle(): Promise<Result<Token, AuthException>>;
    signOut(): Promise<Result<void, AuthException>>;
    getCurrentUser(): Observable<User | null>;
}
```

---

### Capa de Aplicación (Application)

**Propósito:** Orquesta los casos de uso del sistema. Coordina las operaciones entre el dominio y la infraestructura sin contener lógica de negocio.

**Estructura:**

```text
application/
├── usecases/       # Casos de uso individuales (Single Responsibility)
├── stores/         # Estado global con NgRx SignalStore
└── states/         # Interfaces de estado de la aplicación
```

**Contenido por subcarpeta:**

| Carpeta     | Descripción                                 | Ejemplo                  |
| ----------- | ------------------------------------------- | ------------------------ |
| `usecases/` | Un caso de uso por archivo, siguiendo SRP   | `SignInWithEmailUseCase` |
| `stores/`   | SignalStores para manejo de estado reactivo | `AuthStore`              |
| `states/`   | Definición de interfaces de estado          | `AuthState`              |

**Ejemplo de Use Case:**

```typescript
// application/usecases/sign-in-with-email.usecase.ts
export class SignInWithEmailUseCase {
    constructor(private readonly authRepository: AuthRepositoryPort) {}

    execute(credentials: Credentials): Promise<Result<Token, AuthException>> {
        return this.authRepository.signInWithEmail(credentials);
    }
}
```

**Ejemplo de SignalStore:**

```typescript
// application/stores/auth.store.ts
export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState<AuthState>(initialState),
    withComputed(/* ... */),
    withMethods(/* ... */),
    withHooks(/* ... */),
);
```

---

### Capa de Infraestructura (Infrastructure)

**Propósito:** Implementa los contratos definidos en los Ports del dominio. Contiene todo el código que interactúa con servicios externos (Firebase, APIs HTTP, localStorage, etc.).

**Estructura:**

```text
infrastructure/
├── repositories/   # Implementaciones concretas de los Ports
├── mappers/        # Transformadores entre DTOs externos y entidades del dominio
└── providers/      # Configuración de DI (Dependency Injection)
```

**Contenido por subcarpeta:**

| Carpeta         | Descripción                                  | Ejemplo                     |
| --------------- | -------------------------------------------- | --------------------------- |
| `repositories/` | Implementación de los Ports del dominio      | `FirebaseAuthRepository`    |
| `mappers/`      | Conversión entre modelos externos e internos | `UserMapper`, `TokenMapper` |
| `providers/`    | Providers de Angular para DI                 | `auth.providers.ts`         |

**Ejemplo de Repository:**

```typescript
// infrastructure/repositories/firebase-auth.repository.ts
@Injectable()
export class FirebaseAuthRepository implements AuthRepositoryPort {
    private readonly auth = inject(Auth);

    async signInWithGoogle(): Promise<Result<Token, AuthException>> {
        return Result.fromPromise(signInWithPopup(this.auth, new GoogleAuthProvider()), (error) =>
            AuthException.fromFirebaseError(error),
        ).then((result) => Result.map(result, (credential) => TokenMapper.fromFirebase(credential)));
    }
}
```

**Ejemplo de Mapper:**

```typescript
// infrastructure/mappers/user.mapper.ts
export class UserMapper {
    static fromFirebase(firebaseUser: FirebaseUser): User {
        return {
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            displayName: firebaseUser.displayName ?? '',
            photoURL: firebaseUser.photoURL ?? '',
        };
    }
}
```

---

### Capa de Presentación (Presentation)

**Propósito:** Contiene todos los elementos de la interfaz de usuario. Componentes, páginas, templates, y estilos específicos de la UI.

**Estructura:**

```text
presentation/
├── pages/          # Smart Components (contenedores)
├── components/     # Dumb Components (presentacionales)
└── ui/             # Componentes de UI reutilizables específicos del feature
```

**Contenido por subcarpeta:**

| Carpeta       | Descripción                                                  | Ejemplo                       |
| ------------- | ------------------------------------------------------------ | ----------------------------- |
| `pages/`      | Contenedores que conectan con stores y orquestan componentes | `SignInPage`, `DashboardPage` |
| `components/` | Componentes presentacionales sin lógica de negocio           | `UserCard`, `LoginForm`       |
| `ui/`         | Componentes de UI específicos del feature                    | `AuthButton`                  |

**Patrón Container-Presentational:**

```text
┌─────────────────────────────────────────┐
│           PAGE (Container)              │
│  - Inyecta Stores                       │
│  - Maneja eventos                       │
│  - Orquesta componentes                 │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │    COMPONENT (Presentational)   │    │
│  │  - Recibe datos via @Input      │    │
│  │  - Emite eventos via @Output    │    │
│  │  - Sin dependencias de stores   │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

## ¿Cuándo Usar las 4 Capas?

> [!IMPORTANT]
> No todas las features requieren la arquitectura completa. Usa tu criterio para decidir la complejidad necesaria.

| Escenario                                    | Capas Recomendadas                                   |
| -------------------------------------------- | ---------------------------------------------------- |
| Feature con lógica de negocio compleja       | Domain + Application + Infrastructure + Presentation |
| Feature con integración a servicios externos | Application + Infrastructure + Presentation          |
| Feature de UI simple (vistas, listados)      | Application + Presentation                           |
| Componente puramente presentacional          | Solo Presentation                                    |

---

## Arquitectura SCSS

El proyecto utiliza una arquitectura SCSS modular ubicada en `src/styles/`:

```text
src/styles/
├── abstract/           # Variables, mixins, funciones (no genera CSS)
│   ├── _variables.scss # Design tokens y variables globales
│   ├── _mixins.scss    # Mixins reutilizables (flex, grid, etc.)
│   └── _reset.scss     # CSS reset/normalize
├── components/         # Estilos de componentes globales
├── layout/             # Estilos de layout (grid, containers)
├── themes/             # Temas y configuración de Angular Material
│   └── theme-colors.scss
└── index.scss          # Punto de entrada principal
```

### Variables (`_variables.scss`)

Define los **design tokens** del proyecto:

```scss
// Colores primarios
$primary-color: #3b82f6;
$secondary-color: #8b5cf6;
$accent-color: #ec4899;

// Espaciado (escala de 4px)
$spacing-xs: 0.25rem; // 4px
$spacing-sm: 0.5rem; // 8px
$spacing-md: 1rem; // 16px
$spacing-lg: 1.5rem; // 24px

// Tipografía
$font-family-base: 'Inter', sans-serif;
$font-family-heading: 'Outfit', sans-serif;

// Breakpoints
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
```

### Mixins (`_mixins.scss`)

Mixins reutilizables para patrones comunes:

```scss
// Flexbox helper
@mixin flex($direction: row, $justify: flex-start, $align: stretch, $gap: null) {
    display: flex;
    flex-direction: $direction;
    justify-content: $justify;
    align-items: $align;
    @if $gap {
        gap: $gap;
    }
}

// Grid helper
@mixin grid($columns: null, $rows: null, $gap: null) {
    display: grid;
    @if $columns {
        grid-template-columns: $columns;
    }
    @if $rows {
        grid-template-rows: $rows;
    }
    @if $gap {
        gap: $gap;
    }
}
```

### Uso en Componentes

```scss
// En un componente
@use 'styles' as *;

.my-component {
    @include flex(column, center, center, $spacing-md);
    background-color: $bg-primary;
    border-radius: $radius-md;
}
```

---

## Metodología BEM

El proyecto utiliza **BEM (Block Element Modifier)** para nombrar clases CSS, garantizando código predecible y mantenible.

### Estructura BEM

```text
.block                    # Componente independiente
.block__element           # Parte del bloque
.block--modifier          # Variante del bloque
.block__element--modifier # Variante del elemento
```

### Ejemplos Prácticos

```scss
// Block: card
.card {
    padding: $spacing-lg;
    border-radius: $radius-md;

    // Element: header del card
    &__header {
        @include flex(row, space-between, center);
        margin-bottom: $spacing-md;
    }

    // Element: title dentro del header
    &__title {
        font-size: $font-size-xl;
        font-weight: 600;
    }

    // Element: body del card
    &__body {
        color: $text-secondary;
    }

    // Modifier: variante destacada
    &--featured {
        border: 2px solid $primary-color;
    }

    // Modifier: variante compacta
    &--compact {
        padding: $spacing-md;
    }
}
```

### Uso en Templates

```html
<article class="card card--featured">
    <header class="card__header">
        <h2 class="card__title">Título</h2>
    </header>
    <div class="card__body">Contenido del card</div>
</article>
```

### Reglas BEM

| Regla                    | ✅ Correcto       | ❌ Incorrecto               |
| ------------------------ | ----------------- | --------------------------- |
| Nombres en minúsculas    | `button__icon`    | `Button__Icon`              |
| Separador de elemento    | `card__header`    | `card-header`, `cardHeader` |
| Separador de modifier    | `button--primary` | `button_primary`            |
| Sin anidamiento profundo | `card__title`     | `card__header__title`       |

---

## Angular Material

Todos los componentes UI deben utilizar **Angular Material** como base, siguiendo estas pautas:

### Configuración

Los componentes de Material se configuran en `src/app/shared/material/`:

```text
shared/material/
├── material.providers.ts    # Providers globales de Material
├── icon-sanitizer.service.ts # Sanitización de iconos SVG
└── custom-icons.ts          # Registro de iconos personalizados
```

### Componentes Principales

| Componente     | Uso                       |
| -------------- | ------------------------- |
| `MatButton`    | Botones de acción         |
| `MatFormField` | Campos de formulario      |
| `MatInput`     | Inputs de texto           |
| `MatSidenav`   | Navegación lateral        |
| `MatToolbar`   | Barras de herramientas    |
| `MatCard`      | Contenedores de contenido |
| `MatDialog`    | Modales y diálogos        |
| `MatMenu`      | Menús contextuales        |
| `MatIcon`      | Iconografía               |

### Personalización de Tema

El tema se configura en `src/styles/themes/theme-colors.scss`:

```scss
@use '@angular/material' as mat;

$primary: mat.define-palette(mat.$blue-palette);
$accent: mat.define-palette(mat.$purple-palette);

$theme: mat.define-light-theme(
    (
        color: (
            primary: $primary,
            accent: $accent,
        ),
    )
);

@include mat.all-component-themes($theme);
```

### Ejemplo de Uso

```typescript
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-example',
    imports: [MatButtonModule, MatIconModule],
    template: `
        <button mat-raised-button color="primary">
            <mat-icon>save</mat-icon>
            Guardar
        </button>
    `,
})
export class ExampleComponent {}
```

---

## Estructura de Carpetas

```text
src/
├── app/
│   ├── core/                    # Funcionalidades centrales (auth, guards, interceptors)
│   │   ├── auth/                # Feature de autenticación (4 capas)
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   ├── config/              # Configuración global
│   │   ├── guards/              # Guards de rutas
│   │   ├── interceptors/        # Interceptors HTTP
│   │   └── inactivity/          # Feature de inactividad
│   │
│   ├── features/                # Módulos de features
│   │   ├── dashboard/           # Feature dashboard
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   └── presentation/
│   │   ├── analytics/
│   │   ├── projects/
│   │   ├── settings/
│   │   └── users/
│   │
│   ├── shared/                  # Código compartido
│   │   ├── components/          # Componentes reutilizables
│   │   ├── pipes/               # Pipes personalizados
│   │   ├── material/            # Configuración Angular Material
│   │   └── utils/               # Utilidades generales
│   │
│   ├── app.ts                   # Componente raíz
│   ├── app.config.ts            # Configuración de la aplicación
│   └── app.routes.ts            # Rutas principales
│
├── styles/                      # Estilos globales
│   ├── abstract/                # Variables, mixins, reset
│   ├── components/              # Estilos de componentes
│   ├── layout/                  # Estilos de layout
│   ├── themes/                  # Configuración de temas
│   └── index.scss               # Punto de entrada
│
└── assets/                      # Recursos estáticos
```

---

## Resumen

| Aspecto      | Tecnología/Patrón                                 |
| ------------ | ------------------------------------------------- |
| Arquitectura | Hexagonal (Ports & Adapters)                      |
| Capas        | Domain, Application, Infrastructure, Presentation |
| Estado       | NgRx SignalStore                                  |
| UI           | Angular Material                                  |
| Estilos      | SCSS + BEM                                        |
| Componentes  | Standalone (Angular v20+)                         |
| Tipado       | TypeScript Strict                                 |
