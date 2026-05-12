import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface TextareaDialogData {
  title: string;
  label?: string;
  placeholder?: string;
  initialValue?: string | null;
  rows?: number;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-textarea-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './textarea-dialog.component.html',
  styleUrl: './textarea-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaDialogComponent {
  data = inject<TextareaDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<TextareaDialogComponent, string | null>);

  control = new FormControl<string>(this.data.initialValue ?? '');

  get label() {
    return this.data.label ?? 'Notes';
  }

  get placeholder() {
    return this.data.placeholder ?? '';
  }

  get rows() {
    return this.data.rows ?? 8;
  }

  get confirmText() {
    return this.data.confirmText ?? 'Save';
  }

  get cancelText() {
    return this.data.cancelText ?? 'Close';
  }

  onSave() {
    this.dialogRef.close(this.control.value ?? '');
  }
}
