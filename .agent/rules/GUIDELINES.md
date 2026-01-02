---
trigger: always_on
---

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
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Commit Message Rules (Conventional Commits + Commitlint)

When generating commit messages, follow the **Conventional Commits** specification.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                                             |
| ---------- | ------------------------------------------------------- |
| `feat`     | A new feature                                           |
| `fix`      | A bug fix                                               |
| `docs`     | Documentation only changes                              |
| `style`    | Code style changes (formatting, semicolons, etc.)       |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf`     | Performance improvements                                |
| `test`     | Adding or correcting tests                              |
| `build`    | Changes to build system or dependencies                 |
| `ci`       | Changes to CI configuration                             |
| `chore`    | Other changes that don't modify src or test files       |
| `revert`   | Reverts a previous commit                               |

### Rules

1. **Subject line**:
    - Use imperative mood: "add" not "added" or "adds"
    - Do NOT capitalize the first letter
    - Do NOT end with a period
    - Maximum 15 characters (be concise and specific)

2. **Scope** (optional):
    - Use lowercase
    - Examples: `auth`, `dashboard`, `api`, `core`, `shared`, `inactivity`

3. **Body** (optional):
    - Separate from subject with a blank line
    - Wrap at 72 characters
    - Explain _what_ and _why_, not _how_

4. **Breaking Changes**:
    - Add `!` after type/scope: `feat(api)!: remove deprecated endpoint`
    - Or use `BREAKING CHANGE:` footer

### Examples

```
feat(auth): add google sign-in button

fix(dashboard): resolve infinite loop on logout

refactor(core): extract result pattern to shared module

docs: update README with installation steps

chore(deps): upgrade angular to v21

feat(inactivity)!: change modal timeout from 30s to 60s

BREAKING CHANGE: default timeout increased
```

### Generation Instructions

When generating a commit message:

1. Analyze the staged/changed files to determine the correct `type`
2. Identify the `scope` from the affected feature or module
3. Write a concise description in imperative mood
4. Keep it short, clear, and meaningful
