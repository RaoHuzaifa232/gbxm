import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorConsoleComponent } from './operator-console.component';

describe('OperatorConsoleComponent', () => {
  let component: OperatorConsoleComponent;
  let fixture: ComponentFixture<OperatorConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorConsoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
