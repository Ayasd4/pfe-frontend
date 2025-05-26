import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionStatComponent } from './intervention-stat.component';

describe('InterventionStatComponent', () => {
  let component: InterventionStatComponent;
  let fixture: ComponentFixture<InterventionStatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterventionStatComponent]
    });
    fixture = TestBed.createComponent(InterventionStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
