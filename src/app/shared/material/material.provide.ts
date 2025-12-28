import { EnvironmentProviders, inject, makeEnvironmentProviders, provideEnvironmentInitializer } from '@angular/core';
import { IconSanitizerService } from './icon-sanitizer.service';
import { GOOGLE_ICON } from './icons-svg';

export const provideMaterial = (): EnvironmentProviders => {
    return makeEnvironmentProviders([
        IconSanitizerService,
        provideEnvironmentInitializer(() => {
            const iconSanitizerService = inject(IconSanitizerService);
            iconSanitizerService.registerIcons([{ name: 'google', svg: GOOGLE_ICON }]);
        }),
    ]);
};
