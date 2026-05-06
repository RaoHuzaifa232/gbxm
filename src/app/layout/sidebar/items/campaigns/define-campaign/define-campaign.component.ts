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
import { CampaignService, CampaignTypeKey } from '@gbxm/core/services/campaign.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@gbxm/shared/components/confirmation-dialog/confirmation-dialog.component';
import { DIALOG_SIZES } from '@gbxm/core/models/dialog.model';

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
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);
  private campaignsService = inject(CampaignService);

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

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      ...DIALOG_SIZES.small,
      data: {
        title: 'Save Campaign',
        message: 'You are about to save this campaign. Do you want to proceed?',
        confirmText: 'Save',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performSave();
      }
    });
  }

  private performSave() {
    const typeKey = this.toTypeKey(this.form.value.type);
    const typeLabel = this.toTypeLabel(typeKey);
    const pickListDate = this.formatDate(this.form.value.dateInitiated);

    this.campaignsService.addCampaign({
      id: this.form.value.campaignId ?? '',
      name: this.form.value.name ?? '',
      typeKey,
      typeLabel,
      pickListDate,
      count: this.form.value.numberOfProperties ?? '',
      operatorId: 'operator-1',
      descriptor: this.form.value.descriptor ?? '',
      tagline: this.form.value.tagline ?? '',
      licenseManager: this.form.value.licenseManager ?? '',
      director: this.form.value.director ?? '',
      campaignLead: this.form.value.campaignLead ?? '',
      dataCollator: this.form.value.dataCollator ?? '',
      associateRep: this.form.value.associateRep ?? '',
      selfLicensing: this.form.value.selfLicensing ?? '',
      licenseType: this.form.value.licenseType ?? '',
      urlLink: this.form.value.urlLink ?? '',
      videoLink: this.form.value.videoLink ?? '',
      notesInternal: this.form.value.notesInternal ?? '',
      notesExternal: this.form.value.notesExternal ?? '',
      numberOfProperties: this.form.value.numberOfProperties ?? '',
      productPriceVary: this.form.value.productPriceVary ?? '',
      agentSuccessFee: this.form.value.agentSuccessFee ?? '',
      dateInitiated: pickListDate
    });

    this.toast.success('Campaign saved successfully!');

    // resetForm() clears values AND the "submitted" state, which prevents error messages from showing
    this.formDirective.resetForm();
  }

  private toTypeKey(value: string | null | undefined): CampaignTypeKey {
    switch ((value ?? '').toLowerCase()) {
      case 'geographic':
        return 'geo';
      case 'brand/syndicate':
        return 'brand';
      case 'thematic':
        return 'thematic';
      case 'agent specific':
      default:
        return 'agent';
    }
  }

  private toTypeLabel(typeKey: CampaignTypeKey): string {
    switch (typeKey) {
      case 'geo':
        return 'Geographic';
      case 'brand':
        return 'Brand/syndicate';
      case 'thematic':
        return 'Thematic';
      default:
        return 'Agent';
    }
  }

  private formatDate(date: Date | null | undefined): string {
    if (!date) {
      return '';
    }

    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }

}
