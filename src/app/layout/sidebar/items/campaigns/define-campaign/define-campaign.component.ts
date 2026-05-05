import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-define-campaign',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './define-campaign.component.html',
  styleUrl: './define-campaign.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefineCampaignComponent {
  private fb = inject(FormBuilder);

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
    '100% '
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
    numberOfProperties: [''],
    productPriceVary: [null],
    agentSuccessFee: [null],
    dateInitiated: [null]
  });

  isImageClearHovered = false;
  isPdfClearHovered = false;

  onFileSelected(event: Event, controlName: string, allowedExtensions: string[]) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      return;
    }

    const fileName = file.name.toLowerCase();
    const isValid = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (isValid) {
      this.form.patchValue({ [controlName]: file });
      this.form.get(controlName)?.setErrors(null);
    } else {
      this.form.patchValue({ [controlName]: null });
      this.form.get(controlName)?.setErrors({ invalidFormat: true });
      input.value = '';
    }
  }

  clearFile(controlName: string, inputElement: HTMLInputElement) {
    this.form.patchValue({ [controlName]: null });
    this.form.get(controlName)?.setErrors(null);
    inputElement.value = '';
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Define campaign saved', this.form.value);
  }

}
