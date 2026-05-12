import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ToastService } from '@gbxm/core/services/toast.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileUploadComponent } from '@gbxm/shared/components/file-upload/file-upload.component';
import { DIALOG_SIZES } from '@gbxm/core/models/dialog.model';
import { ConfirmationDialogComponent } from '@gbxm/shared/components/confirmation-dialog/confirmation-dialog.component';
import { TextareaDialogComponent, TextareaDialogData } from '@gbxm/shared/components/textarea-dialog/textarea-dialog.component';

interface ProfileForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  preferred: FormControl<string | null>;
  operator: FormControl<string | null>;
  userId: FormControl<string | null>;
  personalEmail: FormControl<string | null>;
  cellAndText: FormControl<string | null>;
  contactEmail: FormControl<string | null>;
  companyEmail: FormControl<string | null>;
  linkedIn: FormControl<string | null>;
  teamsId: FormControl<string | null>;
  aboutMe: FormControl<string | null>;
  picture: FormControl<File | null>;
  cv: FormControl<File | null>;
  tradingEntity: FormControl<string | null>;
  registrationNumber: FormControl<string | null>;
  digitalPresence1: FormControl<string | null>;
  digitalPresence2: FormControl<string | null>;
  digitalPresence3: FormControl<string | null>;
  digitalPresence4: FormControl<string | null>;
}

interface PreviewField {
  label: string;
  value: string;
}

interface PreviewSection {
  title: string;
  fields: PreviewField[];
}

@Component({
  selector: 'app-operator-console',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    MatDialogModule,
    MatIconModule,
    FileUploadComponent
  ],
  templateUrl: './operator-console.component.html',
  styleUrl: './operator-console.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperatorConsoleComponent {
  private static readonly STORAGE_KEY = 'operator-console:profile-form';

  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);

  isPreviewing = signal(false);
  previewSections = signal<PreviewSection[]>([]);

  openAboutMeDialog(): void {
    const dialogRef = this.dialog.open<TextareaDialogComponent, TextareaDialogData, string | null>(
      TextareaDialogComponent,
      {
        ...DIALOG_SIZES.medium,
        autoFocus: false,
        data: {
          title: 'A Little About Me ...',
          label: 'Biography',
          placeholder: 'Write a short biography or summary about yourself...',
          initialValue: this.profileForm.get('aboutMe')?.value ?? '',
          rows: 8
        }
      }
    );

    dialogRef.afterClosed().subscribe(value => {
      if (value !== undefined && value !== null) {
        this.profileForm.controls.aboutMe.setValue(value);
      }
    });
  }


  profileForm: FormGroup<ProfileForm> = this.fb.group({
    // Section 1
    firstName: this.fb.control<string | null>('', Validators.required),
    lastName: this.fb.control<string | null>('', Validators.required),
    preferred: this.fb.control<string | null>(''),
    operator: this.fb.control<string | null>({ value: 'Associate Representative', disabled: true }),
    userId: this.fb.control<string | null>({ value: '36574', disabled: true }),
    personalEmail: this.fb.control<string | null>('', [Validators.required, Validators.email]),
    cellAndText: this.fb.control<string | null>('', [Validators.required, Validators.pattern('^\\+?[0-9\\s\\-\\(\\)]+$')]),

    // Section 2
    contactEmail: this.fb.control<string | null>({ value: 'licensingM01@gbxm.com', disabled: true }, [Validators.required, Validators.email]),
    companyEmail: this.fb.control<string | null>({ value: 'company@gbxm.com', disabled: true }, [Validators.required, Validators.email]),
    linkedIn: this.fb.control<string | null>('', Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?')),
    teamsId: this.fb.control<string | null>(''),
    aboutMe: this.fb.control<string | null>(''),

    // Section 3
    picture: this.fb.control<File | null>(null),
    cv: this.fb.control<File | null>(null),
    tradingEntity: this.fb.control<string | null>(''),
    registrationNumber: this.fb.control<string | null>(''),
    digitalPresence1: this.fb.control<string | null>('', Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?')),
    digitalPresence2: this.fb.control<string | null>('', Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?')),
    digitalPresence3: this.fb.control<string | null>('', Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?')),
    digitalPresence4: this.fb.control<string | null>('', Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?'))
  });

  constructor() {
    this.restoreFromStorage();
  }

  onPreview() {
    if (!this.profileForm.valid) {
      this.profileForm.markAllAsTouched();
      this.toast.error('Please fix the errors in the form.');
      return;
    }

    this.previewSections.set(this.buildPreviewSections());
    this.isPreviewing.set(true);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // no-op for SSR
    }
  }

  onEditAgain() {
    this.isPreviewing.set(false);
  }

  onConfirmSubmit() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      ...DIALOG_SIZES.small,
      data: {
        title: 'Submit Profile',
        message: 'You are about to submit your profile. Do you want to proceed?',
        confirmText: 'Submit',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clearStorage();
        this.profileForm.reset();
        this.isPreviewing.set(false);
        this.toast.success('Profile updated successfully!');
      }
    });
  }

  onSave() {
    if (this.profileForm.valid) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        ...DIALOG_SIZES.small,
        data: {
          title: 'Save Changes',
          message: 'You are about to save your profile changes. Do you want to proceed?',
          confirmText: 'Save',
          cancelText: 'Cancel'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.persistToStorage();
          this.toast.success('Changes saved successfully!');
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
      this.toast.error('Please fix the errors in the form before saving.');
    }
  }

  private persistToStorage(): void {
    const { picture, cv, ...serializable } = this.profileForm.getRawValue();
    try {
      localStorage.setItem(OperatorConsoleComponent.STORAGE_KEY, JSON.stringify(serializable));
    } catch {
      // ignore storage errors (quota, disabled storage, SSR)
    }
  }

  private restoreFromStorage(): void {
    try {
      const raw = localStorage.getItem(OperatorConsoleComponent.STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        this.profileForm.patchValue(parsed);
      }
    } catch {
      // ignore corrupt or unavailable storage
    }
  }

  private clearStorage(): void {
    try {
      localStorage.removeItem(OperatorConsoleComponent.STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  private buildPreviewSections(): PreviewSection[] {
    const raw = this.profileForm.getRawValue();

    return [
      {
        title: '1. Personal info',
        fields: [
          { label: 'First Name', value: this.displayValue(raw.firstName) },
          { label: 'Last Name', value: this.displayValue(raw.lastName) },
          { label: 'Preferred', value: this.displayValue(raw.preferred) },
          { label: 'Operator', value: this.displayValue(raw.operator) },
          { label: 'User ID', value: this.displayValue(raw.userId) },
          { label: 'Personal Email', value: this.displayValue(raw.personalEmail) },
          { label: 'Cell & Text', value: this.displayValue(raw.cellAndText) }
        ]
      },
      {
        title: '2. Contact info',
        fields: [
          { label: 'Contact Email', value: this.displayValue(raw.contactEmail) },
          { label: 'Company Email', value: this.displayValue(raw.companyEmail) },
          { label: 'LinkedIN', value: this.displayValue(raw.linkedIn) },
          { label: 'Teams ID', value: this.displayValue(raw.teamsId) },
          { label: 'A Little About Me', value: this.displayValue(raw.aboutMe) }
        ]
      },
      {
        title: '3. Personal info',
        fields: [
          { label: 'Picture', value: this.fileName(raw.picture) },
          { label: 'CV', value: this.fileName(raw.cv) },
          { label: 'Trading Entity', value: this.displayValue(raw.tradingEntity) },
          { label: 'Registration Number', value: this.displayValue(raw.registrationNumber) },
          { label: 'Digital Presence #1', value: this.displayValue(raw.digitalPresence1) },
          { label: 'Digital Presence #2', value: this.displayValue(raw.digitalPresence2) },
          { label: 'Digital Presence #3', value: this.displayValue(raw.digitalPresence3) },
          { label: 'Digital Presence #4', value: this.displayValue(raw.digitalPresence4) }
        ]
      }
    ];
  }

  private displayValue(value: string | null | undefined): string {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    const trimmed = String(value).trim();
    return trimmed.length === 0 ? 'N/A' : trimmed;
  }

  private fileName(value: File | null | undefined): string {
    if (!value) {
      return 'N/A';
    }
    return value.name;
  }
}
