import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorCreationComponent } from './indicator-creation.component';

describe('IndicatorCreationComponent', () => {
  let component: IndicatorCreationComponent;
  let fixture: ComponentFixture<IndicatorCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatorCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
