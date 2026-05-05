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
      width: '600px',
      autoFocus: false
    });
  }

  saveAboutMe(): void {
    // Patch the value back to the main form and close the dialog
    this.profileForm.get('aboutMe')?.setValue(this.tempAboutMe.value);
    this.dialog.closeAll();
  }


  profileForm: FormGroup = this.fb.group({
    // Section 1
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    preferred: [''],
    operator: [{ value: 'Associate Representative', disabled: true }],
    userId: [{ value: '36574', disabled: true }],
    personalEmail: ['', [Validators.required, Validators.email]],
    cellAndText: ['', [Validators.required, Validators.pattern('^\\+?[0-9\\s\\-\\(\\)]+$')]],

    // Section 2
    contactEmail: [{ value: 'licensingM01@gbxm.com', disabled: true }, [Validators.required, Validators.email]],
    companyEmail: [{ value: 'company@gbxm.com', disabled: true }, [Validators.required, Validators.email]],
    linkedIn: ['', Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?')],
    teamsId: [''],
    aboutMe: [''],

    // Section 3
    picture: [null],
    cv: [null],
    tradingEntity: [''],
    registrationNumber: [''],
    digitalPresence1: ['', Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?')],
    digitalPresence2: ['', Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?')],
    digitalPresence3: ['', Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?')],
    digitalPresence4: ['', Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?')]
  });

  onSubmit() {
    if (this.profileForm.valid) {
      this.toast.success('Profile updated successfully!');
      this.formDirective.resetForm();
    } else {
      this.profileForm.markAllAsTouched();
      this.toast.error('Please fix the errors in the form.');
    }
  }

  onSave() {
    if (this.profileForm.valid) {
      this.toast.success('Changes saved successfully!');
    } else {
      this.profileForm.markAllAsTouched();
      this.toast.error('Please fix the errors in the form before saving.');
    }
  }
}
