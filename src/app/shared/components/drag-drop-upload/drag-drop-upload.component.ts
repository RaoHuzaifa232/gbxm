import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-drag-drop-upload',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './drag-drop-upload.component.html',
  styleUrl: './drag-drop-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DragDropUploadComponent implements ControlValueAccessor {
  public ngControl = inject(NgControl, { optional: true, self: true });
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  label = input<string>('Upload File');
  hint = input<string>('Drag and drop a file here, or click to browse');
  accept = input<string>('');
  allowedExtensions = input<string[]>([]);
  tooltip = input<string>('');
  multiple = input<boolean>(false);
  compact = input<boolean>(false);

  filesChanged = output<File[]>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  value = signal<File | File[] | null>(null);
  disabled = signal(false);
  isDragOver = signal(false);
  errorMessage = signal<string | null>(null);

  private onChange: (value: File | File[] | null) => void = () => { };
  private onTouched: () => void = () => { };

  get displayValue(): string {
    const current = this.value();
    if (!current) {
      return '';
    }
    if (Array.isArray(current)) {
      if (current.length === 0) {
        return '';
      }
      if (current.length === 1) {
        return current[0]!.name;
      }
      return `${current.length} files selected`;
    }
    return current.name;
  }

  get hasValue(): boolean {
    const current = this.value();
    if (Array.isArray(current)) {
      return current.length > 0;
    }
    return !!current;
  }

  openPicker(): void {
    if (this.disabled()) {
      return;
    }
    this.fileInput?.nativeElement.click();
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    this.handleFiles(files);
    input.value = '';
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    if (this.disabled()) {
      return;
    }
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
    if (this.disabled()) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
    const files = event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : [];
    this.handleFiles(files);
  }

  clear(event: MouseEvent): void {
    event.stopPropagation();
    this.updateValue(null);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.errorMessage.set(null);
    this.onTouched();
    this.cdr.markForCheck();
  }

  private handleFiles(files: File[]): void {
    if (files.length === 0) {
      return;
    }

    const extensions = this.allowedExtensions();
    const isValid = (file: File) => {
      if (extensions.length === 0) {
        return true;
      }
      const name = file.name.toLowerCase();
      return extensions.some(ext => name.endsWith(ext.toLowerCase()));
    };

    const validFiles = files.filter(isValid);

    if (validFiles.length === 0) {
      this.errorMessage.set('Invalid file format');
      this.ngControl?.control?.setErrors({ invalidFormat: true });
      this.cdr.markForCheck();
      return;
    }

    this.errorMessage.set(null);

    if (this.multiple()) {
      this.updateValue(validFiles);
      this.filesChanged.emit(validFiles);
    } else {
      const first = validFiles[0]!;
      this.updateValue(first);
      this.filesChanged.emit([first]);
    }

    this.onTouched();
    this.cdr.markForCheck();
  }

  private updateValue(value: File | File[] | null): void {
    this.value.set(value);
    this.onChange(value);
  }

  writeValue(value: File | File[] | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: File | File[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
