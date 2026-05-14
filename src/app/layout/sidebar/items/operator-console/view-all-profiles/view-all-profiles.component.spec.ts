import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllProfilesComponent } from './view-all-profiles.component';

describe('ViewAllProfilesComponent', () => {
  let component: ViewAllProfilesComponent;
  let fixture: ComponentFixture<ViewAllProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllProfilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
