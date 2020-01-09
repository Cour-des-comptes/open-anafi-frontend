import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFrameAddIndicatorComponent } from './dialog-frame-add-indicator.component';

describe('DialogFrameAddIndicatorComponent', () => {
  let component: DialogFrameAddIndicatorComponent;
  let fixture: ComponentFixture<DialogFrameAddIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogFrameAddIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFrameAddIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
