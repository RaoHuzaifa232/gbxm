import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileUploadComponent } from '@gbxm/shared/components/file-upload/file-upload.component';
import { ConfirmationDialogComponent } from '@gbxm/shared/components/confirmation-dialog/confirmation-dialog.component';
import { TextareaDialogComponent, TextareaDialogData } from '@gbxm/shared/components/textarea-dialog/textarea-dialog.component';
import { ToastService } from '@gbxm/core/services/toast.service';
import { DIALOG_SIZES } from '@gbxm/core/models/dialog.model';
import { OperatorProfile, ProfileFormMode } from '@gbxm/core/models/operator-profile.model';
import { OperatorProfileService } from '@gbxm/core/services/operator-profile.service';

interface ProfileFormGroup {
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

const URL_PATTERN = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?';

@Component({
  selector: 'app-profile-form',
  standalone: true,
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
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFormComponent implements OnInit, OnChanges {
  @Input({ required: true }) mode: ProfileFormMode = 'self';
  @Input() profileData: OperatorProfile | null = null;

  @Output() formSaved = new EventEmitter<void>();
  @Output() formSubmitted = new EventEmitter<void>();
  @Output() emailLinkClicked = new EventEmitter<void>();
  @Output() profileVerified = new EventEmitter<void>();
  @Output() profileRejected = new EventEmitter<void>();
  @Output() previewChange = new EventEmitter<boolean>();

  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);
  private profileService = inject(OperatorProfileService);

  isPreviewing = signal(false);
  previewSections = signal<PreviewSection[]>([]);

  readonly profileForm: FormGroup<ProfileFormGroup> = this.fb.group({
    firstName: this.fb.control<string | null>('', Validators.required),
    lastName: this.fb.control<string | null>('', Validators.required),
    preferred: this.fb.control<string | null>(''),
    operator: this.fb.control<string | null>({ value: 'Associate Representative', disabled: true }),
    userId: this.fb.control<string | null>({ value: '36574', disabled: true }),
    personalEmail: this.fb.control<string | null>('', [Validators.required, Validators.email]),
    cellAndText: this.fb.control<string | null>('', [Validators.required, Validators.pattern('^\\+?[0-9\\s\\-\\(\\)]+$')]),
    contactEmail: this.fb.control<string | null>({ value: 'licensingM01@gbxm.com', disabled: true }, [Validators.required, Validators.email]),
    companyEmail: this.fb.control<string | null>({ value: 'company@gbxm.com', disabled: true }, [Validators.required, Validators.email]),
    linkedIn: this.fb.control<string | null>('', Validators.pattern(URL_PATTERN)),
    teamsId: this.fb.control<string | null>(''),
    aboutMe: this.fb.control<string | null>(''),
    picture: this.fb.control<File | null>(null),
    cv: this.fb.control<File | null>(null),
    tradingEntity: this.fb.control<string | null>(''),
    registrationNumber: this.fb.control<string | null>(''),
    digitalPresence1: this.fb.control<string | null>('', Validators.pattern(URL_PATTERN)),
    digitalPresence2: this.fb.control<string | null>('', Validators.pattern(URL_PATTERN)),
    digitalPresence3: this.fb.control<string | null>('', Validators.pattern(URL_PATTERN)),
    digitalPresence4: this.fb.control<string | null>('', Validators.pattern(URL_PATTERN))
  });

  ngOnInit(): void {
    if (this.mode === 'self') {
      this.restoreFromStorage();
    } else if (this.profileData) {
      this.populateForm(this.profileData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profileData'] && !changes['profileData'].firstChange && this.profileData) {
      this.populateForm(this.profileData);
      this.isPreviewing.set(false);
    }
  }

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

  onPreview(): void {
    if (!this.profileForm.valid) {
      this.profileForm.markAllAsTouched();
      this.toast.error('Please fix the errors in the form.');
      return;
    }
    this.previewSections.set(this.buildPreviewSections());
    this.isPreviewing.set(true);
    this.previewChange.emit(true);
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { }
  }

  onEditAgain(): void {
    this.isPreviewing.set(false);
    this.previewChange.emit(false);
  }

  onSave(): void {
    if (!this.profileForm.valid) {
      this.profileForm.markAllAsTouched();
      this.toast.error('Please fix the errors in the form before saving.');
      return;
    }

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
        if (this.mode === 'self') {
          this.persistToStorage();
        }
        this.toast.success('Changes saved successfully!');
        this.formSaved.emit();
      }
    });
  }

  onConfirmSubmit(): void {
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
        if (this.mode === 'self') {
          this.profileService.clearOwnProfile();
          this.profileForm.reset();
        }
        this.isPreviewing.set(false);
        this.previewChange.emit(false);
        this.toast.success('Profile submitted successfully!');
        this.formSubmitted.emit();
      }
    });
  }

  onDirectSubmit(): void {
    if (!this.profileForm.valid) {
      this.profileForm.markAllAsTouched();
      this.toast.error('Please fix the errors in the form.');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      ...DIALOG_SIZES.small,
      data: {
        title: 'Submit Profile',
        message: 'You are about to submit this profile. Do you want to proceed?',
        confirmText: 'Submit',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toast.success('Profile submitted successfully!');
        this.formSubmitted.emit();
      }
    });
  }

  onEmailLink(): void {
    this.dialog.open(ConfirmationDialogComponent, {
      ...DIALOG_SIZES.small,
      data: {
        title: 'Send Email Link',
        message: 'Send a profile completion link to this operator via email?',
        confirmText: 'Send',
        cancelText: 'Cancel'
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.toast.success('Email link sent successfully!');
        this.emailLinkClicked.emit();
      }
    });
  }

  onVerify(): void {
    if (!this.profileForm.valid) {
      this.profileForm.markAllAsTouched();
      this.toast.error('Please review the form before verifying.');
      return;
    }

    this.dialog.open(ConfirmationDialogComponent, {
      ...DIALOG_SIZES.small,
      data: {
        title: 'Approve Operator',
        message: 'Are you sure you want to approve this operator profile?',
        confirmText: 'Approve',
        cancelText: 'Cancel'
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.toast.success('Operator profile approved!');
        this.profileVerified.emit();
      }
    });
  }

  onReject(): void {
    this.dialog.open(ConfirmationDialogComponent, {
      ...DIALOG_SIZES.small,
      data: {
        title: 'Reject Operator',
        message: 'Are you sure you want to reject this operator profile?',
        confirmText: 'Reject',
        cancelText: 'Cancel'
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.toast.success('Operator profile rejected.');
        this.profileRejected.emit();
      }
    });
  }

  private populateForm(data: OperatorProfile): void {
    this.profileForm.patchValue({
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
      preferred: data.preferred ?? '',
      operator: data.operator ?? '',
      userId: data.userId ?? '',
      personalEmail: data.personalEmail ?? '',
      cellAndText: data.cellAndText ?? '',
      contactEmail: data.contactEmail ?? '',
      companyEmail: data.companyEmail ?? '',
      linkedIn: data.linkedIn ?? '',
      teamsId: data.teamsId ?? '',
      aboutMe: data.aboutMe ?? '',
      tradingEntity: data.tradingEntity ?? '',
      registrationNumber: data.registrationNumber ?? '',
      digitalPresence1: data.digitalPresence1 ?? '',
      digitalPresence2: data.digitalPresence2 ?? '',
      digitalPresence3: data.digitalPresence3 ?? '',
      digitalPresence4: data.digitalPresence4 ?? ''
    });
  }

  private persistToStorage(): void {
    const { picture, cv, ...serializable } = this.profileForm.getRawValue();
    this.profileService.saveOwnProfile(serializable as Record<string, unknown>);
  }

  private restoreFromStorage(): void {
    const parsed = this.profileService.loadOwnProfile();
    if (parsed && typeof parsed === 'object') {
      this.profileForm.patchValue(parsed);
    }
  }

  private buildPreviewSections(): PreviewSection[] {
    const raw = this.profileForm.getRawValue();
    return [
      {
        title: 'Submitted operator',
        fields: [
          { label: 'First Name', value: this.display(raw.firstName) },
          { label: 'Last Name', value: this.display(raw.lastName) },
          { label: 'Preferred', value: this.display(raw.preferred) },
          { label: 'Operator', value: this.display(raw.operator) },
          { label: 'User ID', value: this.display(raw.userId) },
          { label: 'Personal Email', value: this.display(raw.personalEmail) },
          { label: 'Cell & Text', value: this.display(raw.cellAndText) },
          { label: 'Contact Email', value: this.display(raw.contactEmail) },
          { label: 'Company Email', value: this.display(raw.companyEmail) },
          { label: 'LinkedIn', value: this.display(raw.linkedIn) },
          { label: 'Teams ID', value: this.display(raw.teamsId) },
          { label: 'A Little About Me', value: this.display(raw.aboutMe) },
          { label: 'Trading Entity', value: this.display(raw.tradingEntity) },
          { label: 'Registration Number', value: this.display(raw.registrationNumber) }
        ]
      }
    ];
  }

  private display(value: string | null | undefined): string {
    const trimmed = String(value ?? '').trim();
    return trimmed.length === 0 ? '—' : trimmed;
  }

  private fileName(value: File | null | undefined): string {
    return value ? value.name : '—';
  }
}
