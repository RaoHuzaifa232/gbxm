import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface AddPropertyDialogData {
  campaignName: string;
}

export interface AddPropertyDialogResult {
  propertyName: string;
}

@Component({
  selector: 'app-add-property-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './add-property-dialog.component.html',
  styleUrl: './add-property-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPropertyDialogComponent {
  private dialogRef =
    inject<MatDialogRef<AddPropertyDialogComponent, AddPropertyDialogResult>>(MatDialogRef);
  readonly data = inject<AddPropertyDialogData>(MAT_DIALOG_DATA);

  readonly nameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(2)],
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    if (this.nameControl.invalid) {
      this.nameControl.markAsTouched();
      return;
    }
    this.dialogRef.close({ propertyName: this.nameControl.value.trim() });
  }
}
