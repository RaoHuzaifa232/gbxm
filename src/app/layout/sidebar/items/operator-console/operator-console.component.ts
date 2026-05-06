import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { ToastService } from '@gbxm/core/services/toast.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
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
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);

  @ViewChild('aboutMeDialog') aboutMeDialog!: TemplateRef<any>;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  tempAboutMe = new FormControl('');

  openAboutMeDialog(): void {
    // Set the initial value of the temporary control
    this.tempAboutMe.setValue(this.profileForm.get('aboutMe')?.value || '');

    this.dialog.open(this.aboutMeDialog, {
      ...DIALOG_SIZES.medium,
      autoFocus: false
    });
  }

  saveAboutMe(): void {
    // Patch the value back to the main form and close the dialog
    this.profileForm.controls.aboutMe.setValue(this.tempAboutMe.value);
    this.dialog.closeAll();
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

  onSubmit() {
    if (this.profileForm.valid) {
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
          this.toast.success('Profile updated successfully!');
          this.formDirective.resetForm();
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
      this.toast.error('Please fix the errors in the form.');
    }
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
          this.toast.success('Changes saved successfully!');
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
      this.toast.error('Please fix the errors in the form before saving.');
    }
  }
}
