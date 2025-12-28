import { Injectable, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Service responsible for sanitizing and registering custom SVG icons
 * for use with Angular Material's MatIcon component.
 *
 * @example
 * ```typescript
 * const iconService = inject(IconSanitizerService);
 *
 * // Register a single icon
 * iconService.registerIcon('google', GOOGLE_ICON);
 *
 * // Register multiple icons at once
 * iconService.registerIcons([
 *   { name: 'google', svg: GOOGLE_ICON },
 *   { name: 'github', svg: GITHUB_ICON },
 * ]);
 *
 * // Sanitize SVG for direct template use
 * const safeSvg = iconService.sanitizeSvg(MY_SVG);
 * ```
 */
@Injectable()
export class IconSanitizerService {
    private readonly sanitizer = inject(DomSanitizer);
    private readonly iconRegistry = inject(MatIconRegistry);
    private readonly registeredIcons = new Set<string>();

    /**
     * Sanitizes an SVG string for safe use in Angular templates.
     *
     * @param svg - The raw SVG string to sanitize
     * @returns A SafeHtml object that can be used with [innerHTML]
     */
    sanitizeSvg(svg: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(svg);
    }

    /**
     * Registers a custom SVG icon with Angular Material's icon registry.
     * If the icon is already registered, it will be skipped.
     *
     * @param name - The unique name for the icon (used in mat-icon svgIcon)
     * @param svg - The raw SVG string
     * @param namespace - Optional namespace for the icon (default: none)
     */
    registerIcon(name: string, svg: string, namespace?: string): void {
        const iconKey = namespace ? `${namespace}:${name}` : name;

        if (this.registeredIcons.has(iconKey)) {
            return;
        }

        const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`);

        if (namespace) {
            this.iconRegistry.addSvgIconInNamespace(namespace, name, safeUrl);
        } else {
            this.iconRegistry.addSvgIcon(name, safeUrl);
        }

        this.registeredIcons.add(iconKey);
    }

    /**
     * Registers multiple icons at once.
     *
     * @param icons - Array of icon configurations
     */
    registerIcons(icons: ReadonlyArray<{ name: string; svg: string; namespace?: string }>): void {
        icons.forEach(({ name, svg, namespace }) => {
            this.registerIcon(name, svg, namespace);
        });
    }

    /**
     * Checks if an icon is already registered.
     *
     * @param name - The icon name to check
     * @param namespace - Optional namespace
     * @returns True if the icon is registered
     */
    isIconRegistered(name: string, namespace?: string): boolean {
        const iconKey = namespace ? `${namespace}:${name}` : name;
        return this.registeredIcons.has(iconKey);
    }

    /**
     * Gets all registered icon names.
     *
     * @returns A readonly array of registered icon keys
     */
    getRegisteredIcons(): readonly string[] {
        return [...this.registeredIcons];
    }
}
