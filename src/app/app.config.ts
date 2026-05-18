import { ApplicationConfig, importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PreloadAllModules, provideRouter, withPreloading, withHashLocation } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes, withPreloading(PreloadAllModules), withHashLocation()),
    provideAnimationsAsync(),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(MatSnackBarModule),
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { touchGestures: 'off' } }
  ]
};
