import { Component, OnInit, ViewChild } from '@angular/core';
import { apiService } from '../../services/api.service';
import { Nomenclature } from '../../interfaces/nomenclature';
import { Frame } from '../../interfaces/frames';
import { AuthentificationService } from '../../services/authentification.service';
import { MatDialog} from '@angular/material';
import { Indicator } from '../../interfaces/indicator';
import { DialogFrameComponent } from './dialog-frame/dialog-frame.component';
import { DialogNomenclatureComponent } from './dialog-nomenclature/dialog-nomenclature.component';
import { DialogFrameAddIndicatorComponent } from './dialog-frame-add-indicator/dialog-frame-add-indicator.component';
import { saveAs } from 'file-saver';
import * as lodash from 'lodash';
import {CustomAlertService} from '../../services/alerts/custom-alert.service';

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss']
})
export class CreationComponent implements OnInit {
  nomenclaturesSource: Nomenclature[];
  nomenclatures: Nomenclature[];

  framesSource: Frame[];
  frames: Frame[];

  indicatorsSource: Indicator[];
  indicators: Indicator[];

  frameIndicatorsSource: Indicator[];
  frame_indicators: Indicator[];

  selectedFrame: Frame;
  selected_frame_indicator: Indicator;
  selectedNomenclature: Nomenclature;
  selectedIndicator: Indicator;
  indicatorToEdit: Indicator;

  frame_nomenclature_name: string;
  nomenclature_frames: Frame[];

  selectedIndex = 1;

  loading_screen = true;
  loading = false;
  diameter = 30;
  error = ';';

  @ViewChild('indicatorFilter') indicatorFilterInput: any;

  constructor(
    private api: apiService,
    private authService: AuthentificationService,
    public dialog: MatDialog,
    private customAlertService: CustomAlertService) { }

  ngOnInit() {

    this.authService.setRouteLink('creation');
    this.api.getFrames().subscribe(data => {
      this.framesSource = data;
      this.framesSource.sort((frameA, frameB) => {
        return frameA.name.localeCompare(frameB.name);
      });
      this.frames = this.framesSource;
    });


    this.api.getNomenclatures().subscribe(data => {
      this.nomenclaturesSource = data;
      this.nomenclaturesSource.sort((nomA, nomB) => {
        return nomA.name.localeCompare(nomB.name);
      });
      this.nomenclatures = this.nomenclaturesSource;
    });

    this.getIndicators();

  }

  getIndicators() {

    this.api.getIndicators().subscribe(data => {
      this.indicatorsSource = data;
      this.indicatorsSource.sort((indicatorA, indicatorB) => {
        return indicatorA.name.localeCompare(indicatorB.name);
      });
      this.indicators = this.indicatorsSource;
      this.loading_screen = false;
    });
  }

  filterNomenclatures(chaine: string) {
    this.selectedNomenclature = null;
    this.nomenclatures = this.nomenclaturesSource.filter(nom => {
      return nom.name.includes(chaine);
    });
  }

  filterIndicators(chaine: string) {
    this.indicators = this.indicatorsSource.filter(indic => {
      return (indic.libelles[0] ? (indic.name.includes(chaine) ||
        indic.libelles[0].libelle.includes(chaine)) : indic.name.includes(chaine));
    });
  }

  filterFrames(chaine: string) {
    this.frames = this.framesSource.filter(frame => {
      return frame.name.includes(chaine);
    });
  }

  filterFramesIndicator(chaine: string) {

    this.frame_indicators = this.frameIndicatorsSource.filter(indic => {
      return (indic.libelles[0] ? (indic.name.includes(chaine) ||
        indic.libelles[0].libelle.includes(chaine)) : indic.name.includes(chaine));
    });
  }

  tabChange(): void {
    this.selectedNomenclature = null;
    // // this.selectedFrame = null;
    // // this.selectedIndicator = null;
    // this.selected_frame_indicator = null;

  }

  public update(): void {

    this.api.getNomenclatures().subscribe(data => {
      this.nomenclatures = data;
    });

    this.api.getFrames().subscribe(data => {
      this.frames = data;
    });

    this.api.getIndicators().subscribe(data => {
      this.indicators = data;
    });
  }

  NomenclatureChange(event) {
    if (event.option.selected) {
      event.source.deselectAll();
      event.option._setSelected(false);
      this.selectedNomenclature = event.option.value;
      this.selectedFrame = null;
      this.selectedIndicator = null;
      this.selected_frame_indicator = null;

      this.nomenclature_frames = this.frames.filter(frame => (frame.nomenclature === event.option.value.id));

    }
  }

  FrameChange(event?) {

    if (event) {
      if (event.option.selected) {
        event.source.deselectAll();
        event.option._setSelected(false);
      }
      this.selectedFrame = event.option.value;

    }
    this.selectedIndicator = null;
    this.selected_frame_indicator = null;
    this.frame_nomenclature_name = this.nomenclatures.find(element => element.id === this.selectedFrame.nomenclature).name;

    this.majFrameIndicators();
  }

  beginEdit(selectedIndicator) {
    this.indicatorToEdit = lodash.cloneDeep(selectedIndicator);
  }


  majFrameIndicators() {

    if (this.selectedFrame.indicators) {
      this.frameIndicatorsSource = this.indicatorsSource.filter(indicator => (indicator.frames.includes(this.selectedFrame.id)));
      this.frame_indicators = this.frameIndicatorsSource;

      /*this.loading = true;
      this.api.getIndicators().subscribe(
        data => {
          this.frameIndicatorsSource = data;
          this.frameIndicatorsSource.sort((indicatorA, indicatorB) => {
            return indicatorA.name.localeCompare(indicatorB.name);
          });
          this.frame_indicators = this.frameIndicatorsSource.filter(indicator => (indicator.frames.includes(this.selectedFrame.id)));
          this.frameIndicatorsInit = this.frame_indicators;
          this.loading = false;
        },
        error => {
          this.error = error;
          if (error.error) {
            this.snackBar.open('Echec du chargement des indicateurs ' + ' Détails: ' + error.error.detail, '', {
              duration: 10000,
            });
          }
          this.loading = false;
        });*/
    } else {
      this.frame_indicators = null;
    }
  }


  FrameIndicatorChange(event) {
    if (event.option.selected) {
      event.source.deselectAll();
      event.option._setSelected(false);
      this.selected_frame_indicator = event.option.value;
      // this.frame_indicators = this.indicatorsSource.filter((indicator: Indicator) => {
      //   return this.selected_frame_indicator.id === indicator.id;
      // });
    }
  }

  makeTooltip(indicator) {
    if (indicator.libelles[0]) {
      return indicator.name + ' - ' + indicator.libelles[0].libelle ;
    } else {
      return indicator.name ;
    }
  }

  IndicatorChange(event?) {

    if (event) {
      if (event.option.selected) {
        event.source.deselectAll();
        event.option._setSelected(false);
      }
      this.selectedIndicator = event.option.value;

    }
    // this.selected_frame_indicator = null;
    // this.selectedFrame = null;

    /*if (this.selectedIndicator.parameters) {
      this.loading = true;
      this.api.getIndicators().subscribe(
        data => {
          this.indicatorsSource = data;
          this.indicatorsSource.sort((indicatorA, indicatorB) => {
            return indicatorA.name.localeCompare(indicatorB.name);
          });
          this.indicators = this.indicatorsSource;
          this.loading = false;
        },
        error => {
          this.error = error;
          if (error.error) {
            this.snackBar.open('Echec du chargement des indicateurs ' + ' Détails: ' + error.error.detail, '', {
              duration: 10000,
            });
          }
          this.loading = false;
        });
    }*/
  }

  selectFrame(id: number) {
    this.selectedFrame = this.frames.find(data => {
      return data.id === id;
    });
    this.selectedIndex = 2;
    this.FrameChange();
  }

  selectFrameIndicator(id: number) {
    this.selectedIndicator = this.indicators.find(data => {
      return data.id === id;
    });
    this.selectedIndex = 3;
    this.IndicatorChange();
  }

  delete_Nomenclature(id: number, name: string): void {
    if (confirm('Etes vous sûrs de vouloirs supprimer la nomenclature  ' + name + ' ?')) {
      this.api.deleteNomenclature(id).subscribe(_ => {
        const index: number = this.nomenclatures.findIndex(nomenclature => nomenclature.id === id);
        this.nomenclatures.splice(index, 1);
        this.nomenclaturesSource = this.nomenclatures;

        this.customAlertService.setNotification({
          message: `La nomenclature a bien été supprimée`,
          type: 'success'
        });
      });
      this.selectedNomenclature = null;
    }
  }
  export_Frame(id: number): void {
    this.api.exportFrame(id).subscribe(data => {
      const contentDispositionHeader: string = data.headers.get('Content-Disposition');
      const parts: string[] = contentDispositionHeader.split(';');
      const filename = parts[1].split('=')[1];
      const blob = new Blob([data.body], { type: 'application/zip' });

      saveAs(blob, filename);
    });

  }


  delete_Frame(id: number, name: string): void {
    if (confirm('Etes vous sûrs de vouloirs supprimer la trame  ' + name + ' ?')) {
      this.api.deleteFrame(id).subscribe(_ => {
        const index: number = this.frames.findIndex(frame => frame.id === id);
        this.frames.splice(index, 1);
        this.framesSource = this.frames;

        this.customAlertService.setNotification({
          message: `La frame a bien été supprimée`,
          type: 'success'
        });
      });
      this.selected_frame_indicator = null;
      this.selectedFrame = null;
    }
  }

  delete_Frame_Indicator(id_frame_indicator: number, id_frame: number): void {

    const jsonValue = {
      indicators: [id_frame_indicator],
    };
    this.api.setFrameIndicator(id_frame, jsonValue, 'delete').subscribe(_ => {
      const index: number = this.frame_indicators.findIndex(indicator => indicator.id === id_frame_indicator);
      this.frame_indicators.splice(index, 1);
      this.frameIndicatorsSource = this.frame_indicators;
    });
    this.selected_frame_indicator = null;
  }

  delete_Indicator(id: number): void {
    if (confirm('Etes vous sûrs de vouloirs supprimmer  cet indicateur ?')) {
      this.api.deleteIndicator(id).subscribe(_ => {
        const index: number = this.indicators.findIndex(indicator => indicator.id === id);
        this.indicators.splice(index, 1);
        this.indicators = this.indicatorsSource;

        this.customAlertService.setNotification({
          message: `L'indicateur a bien été supprimée`,
          type: 'success'
        });
        // Call the filter method to keep previous filters
        this.filterIndicators(this.indicatorFilterInput.nativeElement.value);
      });
      this.selectedIndicator = null;
    }
  }

  indicatorAddedOrEdited(indic: Indicator): void {
    const index: number = this.indicatorsSource.findIndex(indicator => indicator.name === indic.name);
    if (index !== -1) {
      // The indicator already exists, so we have to edit it.
      this.indicatorsSource[index] = indic;

      // Close the edition tab and update the selected indicator.
      this.indicatorToEdit = null;
      this.selectedIndicator = indic;
    } else {
      this.indicatorToEdit = null;
      this.selectedIndicator = indic;
      this.indicatorsSource.push(indic);
      this.indicatorsSource.sort((indicatorA, indicatorB) => {
        return indicatorA.name.localeCompare(indicatorB.name);
      });
      // this.indicatorsSource = this.indicatorsSource.sort((indicatorA, indicatorB) => {
      //   return indicatorA.name.localeCompare(indicatorB.name);
      // });
    }

    this.indicators = this.indicatorsSource;

    // Call the filter method to keep previous filters
    this.filterIndicators(this.indicatorFilterInput.nativeElement.value);
  }

  public openDialogNomenclature(type: String, id?: number): void {
    if (type === 'create') {
      const dialogRef = this.dialog.open(DialogNomenclatureComponent,
        { disableClose: true });

      dialogRef.afterClosed().subscribe(() => {
        this.api.getNomenclatures().subscribe(data => {
          this.nomenclatures = data;
          this.selectedNomenclature = null;
        });
      });
    }

    if (type === 'edit') {
      const dialogRef = this.dialog.open(DialogNomenclatureComponent,
        {
          disableClose: true,
          data: this.nomenclatures.find(element => element.id === id)
        });

      dialogRef.afterClosed().subscribe(() => {
        this.api.getNomenclatures().subscribe(data => {
          this.nomenclatures = data;
          this.selectedNomenclature = this.nomenclatures.find(element => element.id === id);
        });
      });
    }
  }

  public openDialogFrame(type: String, id?: number): void {
    if (type === 'create') {
      const dialogRef = this.dialog.open(DialogFrameComponent,
        { disableClose: true });

      dialogRef.afterClosed().subscribe(() => {
        this.getIndicators();

        this.api.getFrames().subscribe(data => {

          this.frames = data;
          // this.selectedFrame = this.frames.find(element => element.id === result.frame_created.id);
          this.selectedFrame = null;
        });
      });
    }

    if (type === 'edit') {
      const dialogRef = this.dialog.open(DialogFrameComponent,
        {
          disableClose: true,
          data: this.frames.find(element => element.id === id)
        });

      dialogRef.afterClosed().subscribe(() => {
        this.api.getFrames().subscribe(data => {
          this.frames = data;
          this.selectedFrame = this.frames.find(element => element.id === id);
        });
      });
    }
  }

  public openFrameIndicator(): void {
    const dialogRef = this.dialog.open(DialogFrameAddIndicatorComponent,
      {
        disableClose: true,
        data: {
          frame: this.selectedFrame,
          indicators: this.indicatorsSource
        }
      });

    dialogRef.afterClosed().subscribe(result => {

      if (result !== true) {
        result = result.map(indicator => this.indicatorsSource.find(data => data.id === indicator));

        this.frameIndicatorsSource = this.frameIndicatorsSource.concat(result);
        this.frame_indicators = this.frameIndicatorsSource;
      }
    });
  }

}
