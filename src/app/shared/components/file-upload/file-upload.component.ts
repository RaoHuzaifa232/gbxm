import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, input, Optional, Self, signal, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-file-upload',
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadComponent implements ControlValueAccessor {
  public ngControl = inject(NgControl, { optional: true, self: true });
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }
  label = input.required<string>();
  accept = input<string>('');
  tooltip = input<string>('');
  allowedExtensions = input<string[]>([]);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  value = signal<File | null>(null);
  disabled = signal(false);
  isClearHovered = signal(false);

  private onChange: (value: File | null) => void = () => { };
  private onTouched: () => void = () => { };

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      const extensions = this.allowedExtensions();
      const isValid = extensions.length === 0 || extensions.some(ext => fileName.endsWith(ext.toLowerCase()));

      if (isValid) {
        this.updateValue(file);
      } else {
        this.updateValue(null);
        // Explicitly set error on the control
        this.ngControl?.control?.setErrors({ invalidFormat: true });
        event.target.value = '';
      }
    }
    this.onTouched();
    this.cdr.markForCheck();
  }

  clearFile(event: MouseEvent): void {
    event.stopPropagation();
    this.updateValue(null);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.onTouched();
    this.cdr.markForCheck();
  }

  private updateValue(val: File | null): void {
    this.value.set(val);
    this.onChange(val);
  }

  // ControlValueAccessor methods
  writeValue(val: File | null): void {
    this.value.set(val);
    if (!val && this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  get errorMessage(): string | null {
    const control = this.ngControl?.control;
    if (control && control.touched && control.invalid) {
      if (control.hasError('required')) return `${this.label()} is required`;
      if (control.hasError('invalidFormat')) return 'Invalid file format';
      return 'Invalid file';
    }
    return null;
  }
}
