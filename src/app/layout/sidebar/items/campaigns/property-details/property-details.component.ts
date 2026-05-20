import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Campaign, CampaignHotel } from '@gbxm/core/services/campaign.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';

interface MediaSlot {
  tag: string;
  label: string;
}

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatTabsModule,
  ],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyDetailsComponent {
  private fb = inject(FormBuilder);

  hotel = input<CampaignHotel | null>(null);
  campaign = input<Campaign | null>(null);
  backClicked = output<void>();

  readonly stars = signal(5);
  readonly saveState = signal<'saved' | 'unsaved'>('saved');
  readonly starLabels = ['One', 'Two', 'Three', 'Four', 'Five'];
  readonly starRange = [1, 2, 3, 4, 5];

  readonly mediaSlots: MediaSlot[] = [
    { tag: 'L1', label: 'Landing left' },
    { tag: 'R1', label: 'Landing right' },
    { tag: 'L2', label: 'Detail left' },
    { tag: 'R2', label: 'Detail right' },
  ];

  readonly uploadedFiles = signal<Record<string, File | null>>({
    L1: null,
    R1: null,
    L2: null,
    R2: null,
  });

  readonly form = this.fb.group({
    campaignName: ['Bali'],
    campaignId: [{ value: '00001', disabled: true }],
    fullName: ['Allerton Chicago Wiltshire Hotels'],
    shortName: ['Allerton Chicago'],
    syndicate: ['Leading Hotels of the World'],
    streetAddress: ['385 Detroit Avenue'],
    address2: ['Chicago'],
    city: ['Chicago'],
    state: ['Illinois'],
    zip: ['22433'],
    country: ['United States'],
    region: ['North America'],
    brand: ['Allerton Grand'],
    chainGroup: ['Wiltshire Hotels & Resorts'],
    priceVary: [3],
    rooms: [130],
    suites: [30],
    dateOpened: ['07/04/2026'],
    tripAdvisorRanking: ['26 of 168 hotels in Chicago'],
    website: ['www.allerton.com/Chicago'],
    phone: ['+1 456 398 87615'],
    excellent: [548],
    veryGood: [546],
    average: [275],
    poor: [156],
    terrible: [119],
    gmFirstName: ['Daniel'],
    gmSurname: ['Eisner'],
    gmPhone: ['+1 456 398 87615'],
    gmEmail: ['Daniel.Eisner@allerton.com'],
    gmLinkedIn: ['linkedin.com/in/danieleisner'],
    fcFirstName: [''],
    fcSurname: [''],
    fcPhone: [''],
    fcEmail: [''],
    fcLinkedIn: [''],
  });

  private readonly fv = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  private readonly ratingCounts = computed(() => {
    const v = this.fv();
    return [
      Number(v.excellent) || 0,
      Number(v.veryGood) || 0,
      Number(v.average) || 0,
      Number(v.poor) || 0,
      Number(v.terrible) || 0,
    ];
  });

  readonly totalRooms = computed(
    () => (Number(this.fv().rooms) || 0) + (Number(this.fv().suites) || 0)
  );
  readonly totalReviews = computed(() => this.ratingCounts().reduce((a, b) => a + b, 0));

  readonly avgScore = computed(() => {
    const total = this.totalReviews();
    if (!total) return 0;
    const weights = [5, 4, 3, 2, 1];
    return this.ratingCounts().reduce((a, v, i) => a + v * weights[i], 0) / total;
  });

  readonly avgStarCount = computed(() => Math.round(this.avgScore()));

  readonly ratingBars = computed(() => {
    const counts = this.ratingCounts();
    const max = Math.max(...counts, 1);
    return counts.map((v) => +((v / max) * 100).toFixed(1));
  });

  readonly starLabel = computed(() => this.starLabels[this.stars() - 1]);
  readonly hotelDisplayName = computed(() => this.fv().fullName || 'Property Details');
  readonly campaignDisplay = computed(() => {
    const c = this.campaign();
    return c ? `Campaign "${c.name}" · ID ${c.id}` : '';
  });

  constructor() {
    effect(() => {
      const hotel = this.hotel();
      const campaign = this.campaign();
      if (!hotel && !campaign) return;

      const [city = '', country = ''] = (hotel?.location ?? '').split(', ');
      const gmWords = (hotel?.gm ?? '').split(' ');
      const gmSurname = gmWords.length > 1 ? gmWords.pop()! : '';
      const gmFirst = gmWords.join(' ');

      this.form.patchValue({
        ...(campaign && {
          campaignName: campaign.name,
          campaignId: campaign.id,
          priceVary: Number(campaign.productPriceVary) || 0,
        }),
        ...(hotel && {
          fullName: hotel.name,
          shortName: hotel.name,
          city,
          country: country || 'United States',
          gmFirstName: gmFirst,
          gmSurname,
          gmEmail: hotel.email ?? '',
          gmPhone: hotel.phone ?? '',
        }),
      });
      this.saveState.set('saved');
    });

    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.saveState.set('unsaved'));
  }

  setStars(n: number): void {
    this.stars.set(n);
  }

  onFileSelected(event: Event, slot: string): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.uploadedFiles.update((f) => ({ ...f, [slot]: file }));
  }

  onSave(): void {
    this.saveState.set('saved');
    this.form.markAsPristine();
  }
}
