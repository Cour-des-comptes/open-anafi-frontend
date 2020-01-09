import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { apiService } from 'src/app/services/api.service';
import { Indicator } from 'src/app/interfaces/indicator';
import {CustomAlertService} from '../../../services/alerts/custom-alert.service';

@Component({
  selector: 'app-dialog-frame-add-indicator',
  templateUrl: './dialog-frame-add-indicator.component.html',
  styleUrls: ['./dialog-frame-add-indicator.component.scss']
})
export class DialogFrameAddIndicatorComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogFrameAddIndicatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: apiService,
    private customAlertService: CustomAlertService) { }

  indicators: Indicator[];
  indicatorControl: FormControl;

  FrameIndicatorForm: FormGroup;

  indicatorsSource: Indicator[];

  loading = false;
  diameter = 30;
  error = ';';
  done = false;

  ngOnInit() {
    this.indicatorsSource = this.data.indicators.filter((indic: Indicator) => {
      return !indic.frames.includes(this.data.frame.id);
    });
    this.indicators = this.indicatorsSource;

    this.indicatorControl = new FormControl(this.data.frame.indicators, [Validators.required]);
    this.FrameIndicatorForm = new FormGroup({
      Indicators: this.indicatorControl,
    });
  }

  filterIndicators(chaine: string) {
    this.indicators = this.indicatorsSource.filter(indic => {
      return (indic.libelles[0] ? (indic.name.includes(chaine) ||
      indic.libelles[0].libelle.includes(chaine)) : indic.name.includes(chaine));
  });
  }

  submit() {

    const frame_indicators_id_tab = [];
    this.FrameIndicatorForm.value.Indicators.forEach(element => frame_indicators_id_tab.push(element.id));

    const jsonValue = {
      indicators: frame_indicators_id_tab,
    };

    this.api.setFrameIndicator(this.data.frame.id, jsonValue, 'add').subscribe(
      (res) => {
        this.customAlertService.setNotification({
          message: 'Les indicateurs ont bien été ajoutés',
          type: 'success'
        });

        this.dialogRef.close(frame_indicators_id_tab);
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      });
  }

}
