import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPickListsComponent } from './add-pick-lists.component';

describe('AddPickListsComponent', () => {
  let component: AddPickListsComponent;
  let fixture: ComponentFixture<AddPickListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPickListsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPickListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
