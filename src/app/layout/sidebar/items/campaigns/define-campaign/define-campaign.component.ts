import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastService } from '@gbxm/core/services/toast.service';
import { FileUploadComponent } from '@gbxm/shared/components/file-upload/file-upload.component';

@Component({
  selector: 'app-define-campaign',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatTooltipModule,
    FileUploadComponent
  ],
  templateUrl: './define-campaign.component.html',
  styleUrl: './define-campaign.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefineCampaignComponent {
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  typeOptions = ['Agent Specific', 'Geographic', 'Brand/Syndicate', 'Thematic'];
  directorOptions = ['Kim Powley', 'Ava Brooks', 'Jordan Lee'];
  licenseManagerOptions = ['Director', 'Manager', 'Supervisor'];
  campaignLeadOptions = ['Paolo Randone', 'Sam Diaz', 'Taylor Quinn'];
  dataCollatorOptions = ['Frank Brown', 'Jamie Park', 'Riley Chen'];
  associateRepOptions = ['Frank Brown', 'Morgan Ellis', 'Avery Cruz'];
  licenseOptions = ['Self Licensed', 'Partner Licensed', 'Agency Licensed'];
  priceVaryOptions = [
    '3%',
    '5%',
    '7.5%',
    '10%',
    '15%',
    '20%',
    '25%',
    '30%',
    '50%',
    '60%',
    '80%',
    '90%',
    '100%'
  ];
  successFeeOptions = ['3%', '5%', '10%', '15%', '20%', '25%'];

  form = this.fb.group({
    type: [null, Validators.required],
    name: ['', Validators.required],
    descriptor: [''],
    campaignId: ['', Validators.required],
    tagline: [''],
    licenseManager: [null, Validators.required],
    director: [null, Validators.required],
    campaignLead: [null, Validators.required],
    dataCollator: [null, Validators.required],
    associateRep: [null, Validators.required],
    selfLicensing: [null, Validators.required],
    licenseType: [null, Validators.required],
    imageFile: [null],
    pdfFile: [null],
    urlLink: ['', Validators.pattern('https?://.+')],
    videoLink: ['', Validators.pattern('https?://.+')],
    notesInternal: [''],
    notesExternal: [''],
    numberOfProperties: ['', [Validators.pattern('^[0-9]*$')]],
    productPriceVary: [null],
    agentSuccessFee: [null],
    dateInitiated: [null]
  });


  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Please fix the errors in the form.');
      return;
    }
    this.toast.success('Campaign saved successfully!');

    // resetForm() clears values AND the "submitted" state, which prevents error messages from showing
    this.formDirective.resetForm();
  }

}
