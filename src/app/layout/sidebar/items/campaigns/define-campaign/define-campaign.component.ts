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
import { FormControl, FormGroup } from '@angular/forms';

interface CampaignForm {
  type: FormControl<string | null>;
  name: FormControl<string | null>;
  descriptor: FormControl<string | null>;
  campaignId: FormControl<string | null>;
  tagline: FormControl<string | null>;
  licenseManager: FormControl<string | null>;
  director: FormControl<string | null>;
  campaignLead: FormControl<string | null>;
  dataCollator: FormControl<string | null>;
  associateRep: FormControl<string | null>;
  selfLicensing: FormControl<string | null>;
  licenseType: FormControl<string | null>;
  imageFile: FormControl<File | null>;
  pdfFile: FormControl<File | null>;
  urlLink: FormControl<string | null>;
  videoLink: FormControl<string | null>;
  notesInternal: FormControl<string | null>;
  notesExternal: FormControl<string | null>;
  numberOfProperties: FormControl<string | null>;
  productPriceVary: FormControl<string | null>;
  agentSuccessFee: FormControl<string | null>;
  dateInitiated: FormControl<Date | null>;
}

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

  form: FormGroup<CampaignForm> = this.fb.group({
    type: this.fb.control<string | null>(null, Validators.required),
    name: this.fb.control<string | null>('', Validators.required),
    descriptor: this.fb.control<string | null>(''),
    campaignId: this.fb.control<string | null>('', Validators.required),
    tagline: this.fb.control<string | null>(''),
    licenseManager: this.fb.control<string | null>(null, Validators.required),
    director: this.fb.control<string | null>(null, Validators.required),
    campaignLead: this.fb.control<string | null>(null, Validators.required),
    dataCollator: this.fb.control<string | null>(null, Validators.required),
    associateRep: this.fb.control<string | null>(null, Validators.required),
    selfLicensing: this.fb.control<string | null>(null, Validators.required),
    licenseType: this.fb.control<string | null>(null, Validators.required),
    imageFile: this.fb.control<File | null>(null),
    pdfFile: this.fb.control<File | null>(null),
    urlLink: this.fb.control<string | null>('', Validators.pattern('https?://.+')),
    videoLink: this.fb.control<string | null>('', Validators.pattern('https?://.+')),
    notesInternal: this.fb.control<string | null>(''),
    notesExternal: this.fb.control<string | null>(''),
    numberOfProperties: this.fb.control<string | null>('', [Validators.pattern('^[0-9]*$')]),
    productPriceVary: this.fb.control<string | null>(null),
    agentSuccessFee: this.fb.control<string | null>(null),
    dateInitiated: this.fb.control<Date | null>(null)
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
