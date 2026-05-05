import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, input, signal, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadComponent {
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
        event.target.value = '';
        // We could emit an error here, but typically the parent form handles validation
      }
    }
    this.onTouched();
  }

  clearFile(event: MouseEvent): void {
    event.stopPropagation();
    this.updateValue(null);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.onTouched();
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
}
