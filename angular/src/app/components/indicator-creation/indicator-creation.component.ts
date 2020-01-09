import {Component, OnChanges, OnInit, SimpleChanges, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import { Parameter } from 'src/app/interfaces/parameter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { apiService } from 'src/app/services/api.service';
import { Indicator } from 'src/app/interfaces/indicator';
import {CustomAlertService} from '../../services/alerts/custom-alert.service';

@Component({
  selector: 'app-indicator-creation',
  templateUrl: './indicator-creation.component.html',
  styleUrls: ['./indicator-creation.component.scss']
})
export class IndicatorCreationComponent implements OnInit, OnChanges {

  parameters: Parameter[] = [];

  indexToEdit: number = null;

  parameterForm: FormGroup;

  error_formula: any = {'show' : false, 'error'  : ''};

  addParameter: boolean = false;

  @Input()
  indicatorToEdit: Indicator;

  @Output()
  emitter: EventEmitter<Indicator> = new EventEmitter<Indicator>();

  @Output()
  closeEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('name') nameInput: any;
  @ViewChild('libelle') libelleInput: any;
  @ViewChild('description') descriptionInput: any;



  constructor(private fb: FormBuilder,
              private api: apiService,
              private customAlertService: CustomAlertService) { }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.indicatorToEdit) {
      this.parameters = this.indicatorToEdit.parameters;
      this.nameInput.nativeElement.value = this.indicatorToEdit.name;
      this.libelleInput.nativeElement.value = this.indicatorToEdit.libelles[0] ? this.indicatorToEdit.libelles[0].libelle : '';
      this.descriptionInput.nativeElement.value = this.indicatorToEdit.description;
      this.initForm();
    }
  }

  cancelChanges() {
    this.parameters = this.indicatorToEdit.parameters;
    this.nameInput.nativeElement.value = this.indicatorToEdit.name;
    this.libelleInput.nativeElement.value = this.indicatorToEdit.libelles[0] ? this.indicatorToEdit.libelles[0].libelle : '';
    this.closeEmitter.emit(true);

  }

  initForm(): void {
    if (this.indexToEdit !== null) {

      this.parameterForm = this.fb.group({
        equation: [this.parameters[this.indexToEdit].original_equation],
        exmin: [this.parameters[this.indexToEdit].year_min],
        exmax: [this.parameters[this.indexToEdit].year_max],
      });
    } else {
      this.parameterForm = this.fb.group({
        equation: [''],
        exmin: [''],
        exmax: [''],
      });
    }
  }

  initFormCancel(): void {
    this.parameters = this.indicatorToEdit.parameters;
    if (this.indexToEdit !== null) {

      this.parameterForm = this.fb.group({
        equation: [this.parameters[this.indexToEdit].original_equation],
        exmin: [this.parameters[this.indexToEdit].year_min],
        exmax: [this.parameters[this.indexToEdit].year_max],
      });
    } else {
      this.parameterForm = this.fb.group({
        equation: [''],
        exmin: ['2009'],
        exmax: ['2019'],
      });
    }
  }



  addOrEditParameter(): void {
    const parameterToAddOrEdit: Parameter = {
      original_equation: this.parameterForm.controls['equation'].value,
      year_min: this.parameterForm.controls['exmin'].value,
      year_max: this.parameterForm.controls['exmax'].value,
    };

    this.api.checkParameter({original_equation: this.parameterForm.controls['equation'].value}).subscribe(() => {
        this.customAlertService.setNotification({
          message: 'Paramètre validé',
          type: 'information'
        });

        this.error_formula.show = false;
        if (this.indexToEdit !== null) {
          this.parameters[this.indexToEdit] = parameterToAddOrEdit;
        } else {
          this.parameters.push(parameterToAddOrEdit);
        }

        // On force le paramètre d'édition à null dans tous les cas
        this.indexToEdit = null;
        this.addParameter = false;
        this.initForm();
      },
      err => {
        this.error_formula.show = true;
        this.error_formula.error = err.error.detail;

      });

  }

  deleteParameter(index: number): void {
    this.parameters.splice(index, 1);
  }

  createOrEditIndicator(name: string, description: string, libelle: string): void {
    const indicator = {
      name: name,
      libelle: libelle,
      description: description,
      equation: this.parametersToEquation()
    };

    if (this.indicatorToEdit) {
      this.api.editIndicator(this.indicatorToEdit.id, indicator).subscribe(result => {
        this.customAlertService.setNotification({
          message: `L'indicateur a été édité avec succès.`,
          type: 'success'
        });

        this.emitter.emit(result);
      });
    } else {
      this.api.createIndicator(indicator).subscribe(result => {
        this.customAlertService.setNotification({
          message: `L'indicateur a été crée avec succès.`,
          type: `success`
        });

        this.emitter.emit(result);
      });
    }

  }

  parametersToEquation(): string {
    let equation: string = '';

    this.parameters.forEach(parameter => {
      equation += parameter.original_equation;
      if (parameter.year_max || parameter.year_min) {
        equation += `[RE-MIN:${parameter.year_min ? parameter.year_min : '#'}]`;
        equation += `[RE-MAX:${parameter.year_max ? parameter.year_max : '#'}]`;
      }
    });

    return equation;
  }

}
