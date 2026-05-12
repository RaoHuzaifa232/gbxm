import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
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
import {
  TextareaDialogComponent,
  TextareaDialogData
} from '@gbxm/shared/components/textarea-dialog/textarea-dialog.component';
import { DIALOG_SIZES } from '@gbxm/core/models/dialog.model';
import {
  LocationDialogComponent,
  LocationDialogData,
  LocationDialogResult
} from './location-dialog/location-dialog.component';

interface PreviewField {
  label: string;
  value: string;
}

interface PreviewSection {
  title: string;
  fields: PreviewField[];
}

interface CampaignForm {
  type: FormControl<string | null>;
  name: FormControl<string | null>;
  country: FormControl<string | null>;
  state: FormControl<string | null>;
  locale: FormControl<string | null>;
  geoFile: FormControl<File | null>;
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
    MatIconModule,
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
    country: this.fb.control<string | null>(null),
    state: this.fb.control<string | null>(null),
    locale: this.fb.control<string | null>(null),
    geoFile: this.fb.control<File | null>(null),
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

  private typeSignal = toSignal(this.form.controls.type.valueChanges, {
    initialValue: this.form.controls.type.value
  });

  isGeographic = computed(() => this.typeSignal() === 'Geographic');

  notesInternalValue = toSignal(this.form.controls.notesInternal.valueChanges, {
    initialValue: this.form.controls.notesInternal.value
  });

  notesExternalValue = toSignal(this.form.controls.notesExternal.valueChanges, {
    initialValue: this.form.controls.notesExternal.value
  });

  locationLabel = signal<string>('');
  isPreviewing = signal(false);
  previewSections = signal<PreviewSection[]>([]);

  get nameFieldLabel(): string {
    return this.isGeographic() ? 'Location' : 'Name of Campaign';
  }

  openLocationDialog(): void {
    const { country, state, locale } = this.form.getRawValue();
    const dialogRef = this.dialog.open<LocationDialogComponent, LocationDialogData, LocationDialogResult | null>(
      LocationDialogComponent,
      {
        width: '560px',
        maxWidth: '92vw',
        autoFocus: false,
        data: {
          country: country ?? null,
          state: state ?? null,
          locale: locale ?? null
        }
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.form.patchValue({
        country: result.country,
        state: result.state,
        locale: result.locale
      });
      if (result.uploadedFile) {
        this.form.controls.geoFile.setValue(result.uploadedFile);
      }
      const label = [result.locale, result.state, result.country].filter(Boolean).join(', ');
      if (label.length > 0) {
        this.form.controls.name.setValue(label);
      }
      this.locationLabel.set(label);
    });
  }

  openNotesDialog(controlName: 'notesInternal' | 'notesExternal'): void {
    const isInternal = controlName === 'notesInternal';
    const dialogRef = this.dialog.open<TextareaDialogComponent, TextareaDialogData, string | null>(
      TextareaDialogComponent,
      {
        ...DIALOG_SIZES.medium,
        autoFocus: false,
        data: {
          title: isInternal ? 'Internal Notes' : 'External Notes',
          label: isInternal ? 'Notes visible to internal staff' : 'Notes visible to clients',
          placeholder: isInternal ? 'Add internal notes' : 'Add external notes',
          initialValue: this.form.controls[controlName].value ?? '',
          rows: 8
        }
      }
    );

    dialogRef.afterClosed().subscribe(value => {
      if (value !== undefined && value !== null) {
        this.form.controls[controlName].setValue(value);
      }
    });
  }


  onPreview() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
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

  private buildPreviewSections(): PreviewSection[] {
    const raw = this.form.getRawValue();
    const geographic = this.isGeographic();

    const detailsFields: PreviewField[] = [
      { label: 'Type', value: this.displayValue(raw.type) },
      { label: geographic ? 'Location' : 'Name of Campaign', value: this.displayValue(raw.name) }
    ];

    if (geographic) {
      detailsFields.push(
        { label: 'Country', value: this.displayValue(raw.country) },
        { label: 'State', value: this.displayValue(raw.state) },
        { label: 'Locale', value: this.displayValue(raw.locale) },
        { label: 'Geographic File', value: this.fileName(raw.geoFile) }
      );
    }

    detailsFields.push(
      { label: 'Descriptor', value: this.displayValue(raw.descriptor) },
      { label: 'Campaign ID', value: this.displayValue(raw.campaignId) },
      { label: 'Tagline', value: this.displayValue(raw.tagline) }
    );

    return [
      {
        title: '1. Campaign details',
        fields: detailsFields
      },
      {
        title: '2. Team & licensing',
        fields: [
          { label: 'License Manager', value: this.displayValue(raw.licenseManager) },
          { label: 'Director', value: this.displayValue(raw.director) },
          { label: 'Campaign Lead', value: this.displayValue(raw.campaignLead) },
          { label: 'Data Collator', value: this.displayValue(raw.dataCollator) },
          { label: 'Associate Representative', value: this.displayValue(raw.associateRep) },
          { label: 'Self Licensing', value: this.displayValue(raw.selfLicensing) },
          { label: 'License Type', value: this.displayValue(raw.licenseType) }
        ]
      },
      {
        title: '3. Assets & links',
        fields: [
          { label: 'Image', value: this.fileName(raw.imageFile) },
          { label: 'PDF', value: this.fileName(raw.pdfFile) },
          { label: 'Campaign URL', value: this.displayValue(raw.urlLink) },
          { label: 'Campaign Video URL', value: this.displayValue(raw.videoLink) },
          { label: 'Internal Notes', value: this.displayValue(raw.notesInternal) },
          { label: 'External Notes', value: this.displayValue(raw.notesExternal) }
        ]
      },
      {
        title: '4. Details & timeline',
        fields: [
          { label: 'Number of Properties', value: this.displayValue(raw.numberOfProperties) },
          { label: 'Product Price Vary', value: this.displayValue(raw.productPriceVary) },
          { label: 'Agent Success Fee', value: this.displayValue(raw.agentSuccessFee) },
          { label: 'Date Initiated', value: this.formatDate(raw.dateInitiated) || 'N/A' }
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

    this.form.reset();
    this.locationLabel.set('');
    this.isPreviewing.set(false);
    this.toast.success('Campaign saved successfully!');
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
