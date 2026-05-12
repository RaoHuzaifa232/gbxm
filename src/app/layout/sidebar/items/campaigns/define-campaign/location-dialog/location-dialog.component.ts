import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  signal,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface LocationDialogData {
  country: string | null;
  state: string | null;
  locale: string | null;
}

export interface LocationDialogResult {
  country: string | null;
  state: string | null;
  locale: string | null;
  uploadedFile: File | null;
}

interface LocationForm {
  country: FormControl<string | null>;
  state: FormControl<string | null>;
  locale: FormControl<string | null>;
}

interface CountryConfig {
  name: string;
  states: Record<string, string[]>;
}

const COUNTRY_DATA: CountryConfig[] = [
  {
    name: 'Australia',
    states: {
      'New South Wales': ['Newcastle', 'Sydney', 'Wollongong'],
      Queensland: ['Brisbane', 'Cairns', 'Gold Coast'],
      'South Australia': ['Adelaide', 'Mount Gambier'],
      Tasmania: ['Hobart', 'Launceston'],
      Victoria: ['Ballarat', 'Geelong', 'Melbourne'],
      'Western Australia': ['Bunbury', 'Fremantle', 'Perth']
    }
  },

  {
    name: 'Indonesia',
    states: {
      Bali: ['Nusa Dua', 'Seminyak', 'Ubud'],
      Java: ['Bandung', 'Jakarta', 'Surabaya']
    }
  },

  {
    name: 'Spain',
    states: {
      Andalusia: ['Granada', 'Málaga', 'Seville'],
      Catalonia: ['Barcelona', 'Girona'],
      'Community of Madrid': ['Alcalá de Henares', 'Madrid']
    }
  },

  {
    name: 'United Kingdom',
    states: {
      England: ['Brighton', 'London', 'Manchester'],
      Scotland: ['Edinburgh', 'Glasgow'],
      Wales: ['Cardiff', 'Swansea']
    }
  },

  {
    name: 'United States',
    states: {
      California: ['Los Angeles', 'San Diego', 'San Francisco'],
      Illinois: ['Chicago', 'Naperville', 'Springfield'],
      'New York': ['Albany', 'Buffalo', 'New York City'],
      Texas: ['Austin', 'Dallas', 'Houston']
    }
  }
];

const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls', '.json', '.geojson'];

@Component({
  selector: 'app-location-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './location-dialog.component.html',
  styleUrl: './location-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<LocationDialogComponent, LocationDialogResult | null>);
  private data = inject<LocationDialogData>(MAT_DIALOG_DATA);
  private initialCountry = this.data.country ?? null;
  private initialState = this.data.state ?? null;
  private initialLocale = this.data.locale ?? null;
  private initialStateValue = this.getStatesFor(this.initialCountry).length ? this.initialState : null;
  private initialLocaleValue = this.getLocalesFor(this.initialCountry, this.initialStateValue).length
    ? this.initialLocale
    : null;

  countries = COUNTRY_DATA.map(c => c.name);
  uploadedFile = signal<File | null>(null);
  isDragOver = signal(false);
  uploadError = signal<string | null>(null);
  acceptList = ALLOWED_EXTENSIONS.join(',');

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  form: FormGroup<LocationForm> = this.fb.group({
    country: this.fb.control<string | null>(this.initialCountry),
    state: this.fb.control<string | null>({
      value: this.initialStateValue,
      disabled: this.getStatesFor(this.initialCountry).length === 0
    }),
    locale: this.fb.control<string | null>({
      value: this.initialLocaleValue,
      disabled: this.getLocalesFor(this.initialCountry, this.initialStateValue).length === 0
    })
  });

  private countrySignal = signal<string | null>(this.form.controls.country.value);
  private stateSignal = signal<string | null>(this.form.controls.state.value);

  constructor() {
    this.form.controls.country.valueChanges.subscribe(value => {
      this.countrySignal.set(value);
      if (value !== this.data.country) {
        this.form.controls.state.setValue(null);
        this.form.controls.locale.setValue(null);
      }
      this.updateDisabledState();
    });
    this.form.controls.state.valueChanges.subscribe(value => {
      this.stateSignal.set(value);
      if (value !== this.data.state) {
        this.form.controls.locale.setValue(null);
      }
      this.updateDisabledState();
    });

    this.updateDisabledState();
  }

  states = computed(() => {
    const country = this.countrySignal();
    if (!country) {
      return [];
    }
    const match = COUNTRY_DATA.find(c => c.name === country);
    return match ? Object.keys(match.states) : [];
  });

  locales = computed(() => {
    const country = this.countrySignal();
    const state = this.stateSignal();
    if (!country || !state) {
      return [];
    }
    const match = COUNTRY_DATA.find(c => c.name === country);
    return match?.states[state] ?? [];
  });

  openPicker(): void {
    this.fileInput?.nativeElement.click();
  }

  onFileInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] ?? null;
    this.handleFile(file);
    target.value = '';
  }

  removeFile(event: MouseEvent): void {
    event.stopPropagation();
    this.uploadedFile.set(null);
    this.uploadError.set(null);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
    const file = event.dataTransfer?.files?.[0] ?? null;
    this.handleFile(file);
  }

  onBack(): void {
    this.dialogRef.close(null);
  }

  onSave(): void {
    const value = this.form.getRawValue();
    this.dialogRef.close({
      country: value.country,
      state: value.state,
      locale: value.locale,
      uploadedFile: this.uploadedFile()
    });
  }

  private handleFile(file: File | null): void {
    if (!file) {
      return;
    }
    const lower = file.name.toLowerCase();
    const isValid = ALLOWED_EXTENSIONS.some(ext => lower.endsWith(ext));
    if (!isValid) {
      this.uploadError.set('Invalid file format. Accepted: CSV, XLSX, XLS, JSON, GeoJSON.');
      this.uploadedFile.set(null);
      return;
    }
    this.uploadError.set(null);
    this.uploadedFile.set(file);
  }

  private getStatesFor(country: string | null): string[] {
    if (!country) {
      return [];
    }
    const match = COUNTRY_DATA.find(c => c.name === country);
    return match ? Object.keys(match.states) : [];
  }

  private getLocalesFor(country: string | null, state: string | null): string[] {
    if (!country || !state) {
      return [];
    }
    const match = COUNTRY_DATA.find(c => c.name === country);
    return match?.states[state] ?? [];
  }

  private updateDisabledState(): void {
    const stateControl = this.form.controls.state;
    const localeControl = this.form.controls.locale;
    const hasStates = this.states().length > 0;
    const hasLocales = this.locales().length > 0;

    if (hasStates) {
      stateControl.enable({ emitEvent: false });
    } else {
      stateControl.disable({ emitEvent: false });
    }

    if (hasLocales) {
      localeControl.enable({ emitEvent: false });
    } else {
      localeControl.disable({ emitEvent: false });
    }
  }
}
