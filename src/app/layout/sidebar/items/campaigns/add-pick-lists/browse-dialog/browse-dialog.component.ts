import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Campaign } from '@gbxm/core/services/campaign.service';

export interface BrowseDialogData {
  campaign: Campaign;
}

export type BrowseDialogAction = 'save' | 'run' | 'upload';

export interface BrowseDialogResult {
  fileName: string;
  action: BrowseDialogAction;
}

@Component({
  selector: 'app-browse-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './browse-dialog.component.html',
  styleUrl: './browse-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseDialogComponent {
  private dialogRef = inject<MatDialogRef<BrowseDialogComponent, BrowseDialogResult>>(MatDialogRef);
  readonly data = inject<BrowseDialogData>(MAT_DIALOG_DATA);

  fileNameControl = new FormControl(this.buildDefaultFileName());

  private buildDefaultFileName(): string {
    const { name, id } = this.data.campaign;
    const namePart = name.split(',')[0].trim().replace(/\s+/g, '_');
    return `${namePart}_${id}`;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onUpload(): void {
    this.dialogRef.close({
      fileName: this.fileNameControl.value ?? '',
      action: 'upload',
    });
  }
}
