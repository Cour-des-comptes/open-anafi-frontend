import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Nomenclature } from 'src/app/interfaces/nomenclature';
import { MAT_DIALOG_DATA } from '@angular/material';
import { apiService } from 'src/app/services/api.service';
import { CustomAlertService } from '../../../services/alerts/custom-alert.service';

@Component({
  selector: 'app-dialog-nomenclature',
  templateUrl: './dialog-nomenclature.component.html',
  styleUrls: ['./dialog-nomenclature.component.scss']
})
export class DialogNomenclatureComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Nomenclature,
    public api: apiService,
    private customAlertService: CustomAlertService) { }

  Nomenclature_Name_Control: FormControl;
  Nomenclature_Description_Control: FormControl;

  NomenclatureForm: FormGroup;




  loading = false;
  done = false;
  diameter = 30;
  error = ';';

  ngOnInit() {

    if (this.data) {
      this.Nomenclature_Name_Control = new FormControl(this.data.name, [Validators.required]);
      this.Nomenclature_Description_Control = new FormControl(this.data.description, [Validators.required]);

      this.NomenclatureForm = new FormGroup({
        nomenclatureName: this.Nomenclature_Name_Control,
        nomenclatureDescription: this.Nomenclature_Description_Control
      });
    } else {
      this.Nomenclature_Name_Control = new FormControl('', [Validators.required]);
      this.Nomenclature_Description_Control = new FormControl('', [Validators.required]);
    }
    this.NomenclatureForm = new FormGroup({
      nomenclatureName: this.Nomenclature_Name_Control,
      nomenclatureDescription: this.Nomenclature_Description_Control
    });
  }

  create_submit() {

    const jsonValue = {
      name: this.NomenclatureForm.value.nomenclatureName,
      description: this.NomenclatureForm.value.nomenclatureDescription,
    };
    this.loading = true;
    this.done = false;
    this.api.setNomenclature(jsonValue).subscribe(
      (res) => {
        this.customAlertService.setNotification({
          message: `La nomenclature ${this.NomenclatureForm.value.nomenclatureName} a été générée`,
          type: 'success'
        });
        this.loading = false;
        this.done = true;
      },
      error => {
        this.error = error;
        this.loading = false;
      });
  }

  edit_submit() {

    const jsonValue = {
      name: this.NomenclatureForm.value.nomenclatureName,
      description: this.NomenclatureForm.value.nomenclatureDescription,
    };
    this.loading = true;
    this.api.editNomenclature(this.data.id, jsonValue).subscribe(
      (res) => {
        this.customAlertService.setNotification({
          message: `La nomenclature ${this.NomenclatureForm.value.nomenclatureName} a été modifiée`,
          type: 'success'
        });
        this.loading = false;
      },
      error => {
        this.error = error;
        this.loading = false;
      });

  }
}
