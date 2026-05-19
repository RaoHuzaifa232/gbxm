import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignFilterComponent } from './campaign-filter.component';

describe('CampaignFilterComponent', () => {
  let component: CampaignFilterComponent;
  let fixture: ComponentFixture<CampaignFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CampaignFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
