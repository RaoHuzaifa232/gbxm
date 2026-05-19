import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyOperatorComponent } from './verify-operator.component';

describe('VerifyOperatorComponent', () => {
  let component: VerifyOperatorComponent;
  let fixture: ComponentFixture<VerifyOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyOperatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
