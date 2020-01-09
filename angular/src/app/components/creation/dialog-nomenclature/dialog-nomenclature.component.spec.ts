import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNomenclatureComponent } from './dialog-nomenclature.component';

describe('DialogNomenclatureComponent', () => {
  let component: DialogNomenclatureComponent;
  let fixture: ComponentFixture<DialogNomenclatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogNomenclatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNomenclatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
