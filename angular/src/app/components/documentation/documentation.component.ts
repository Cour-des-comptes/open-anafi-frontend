import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Nomenclature } from 'src/app/interfaces/nomenclature';
import { Frame } from 'src/app/interfaces/frames';
import { apiService } from 'src/app/services/api.service';
import { MatSelectionList} from '@angular/material';
import { Indicator } from 'src/app/interfaces/indicator';
import { Parameter } from 'src/app/interfaces/parameter';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {
  @ViewChild('nomenclatureList') nomenclatureList: MatSelectionList;
  @ViewChild('frameList') frameList: MatSelectionList;
  @ViewChild('indicatorList') indicatorList: MatSelectionList;

  nomenclatures$: Observable<Nomenclature[]>;
  frames$: Observable<Frame[]>;
  indicators$: Observable<Indicator[]>;
  parameters$: Observable<Parameter[]>;

  nomenclaturesSource: Nomenclature[];
  nomenclatures: Nomenclature[];
  framesSource: Frame[];
  frames: Frame[];
  indicatorsSource: Indicator[];
  indicators: Indicator[];
  parametersSource: Parameter[];
  parameters: Parameter[];

  selectedParameter = 0;

  removable = true;
  selectable = true;
  nomenclatureChip = '';
  frameChip = '';
  indicatorChip = '';

  selectedIndicator: Indicator;
  selectedNomenclature: Nomenclature;
  selectedFrame: Frame;

  selectedIndex = 0;
  currentGraphURL = '';

  constructor(private api: apiService, private authService: AuthentificationService) { }

  ngOnInit() {

    this.authService.setRouteLink('documentation');
    this.nomenclatures$ = this.api.getNomenclatures();
    this.frames$ = this.api.getFrames();
    this.indicators$ = this.api.getIndicators();
    this.parameters$ = this.api.getIndicatorParameters();

    this.nomenclatures$.subscribe(data => {
      this.nomenclaturesSource = data;
      this.nomenclaturesSource.sort((nomA, nomB) => {
        return nomA.name.localeCompare(nomB.name);
      });
      this.nomenclatures = this.nomenclaturesSource;
    });

    this.frames$.subscribe(data => {
      this.framesSource = data;
      this.framesSource.sort((frameA, frameB) => {
        return frameA.name.localeCompare(frameB.name);
      });
      this.frames = this.framesSource;
    });

    this.indicators$.subscribe(data => {
      this.indicatorsSource = data;
      this.indicatorsSource.sort((indicatorA, indicatorB) => {
        return indicatorA.name.localeCompare(indicatorB.name);
      });
      this.indicators = this.indicatorsSource;
    });

    this.parameters$.subscribe(data => {
      this.parametersSource = data;
      this.parameters = data;
    });
  }

  handleNomenclatureChange(event) {
    this.selectedParameter = 0;
    this.frameList.deselectAll();
    this.indicatorList.deselectAll();
    this.frameChip = '';
    this.indicatorChip = '';
    if (event.option.selected) {
      event.source.deselectAll();
      event.option._setSelected(true);
      this.nomenclatureChip = event.option.value.name;
      this.selectedNomenclature = event.option.value;
      this.selectedIndicator = null;

      this.frames = this.framesSource.filter(frame => (frame.nomenclature === event.option.value.id));
    } else if (event.option.selected === false) {
      this.remove(0);
    }
  }

  handleFrameChange(event) {
    this.selectedParameter = 0;
    if (event.option.selected) {
      event.source.deselectAll();
      event.option._setSelected(true);
      this.frameChip = event.option.value.name;
      this.selectedFrame = event.option.value;
      this.selectedIndicator = null;
      this.indicatorChip = '';
      this.indicators = this.indicatorsSource.filter(indicator => (indicator.frames.includes(event.option.value.id)));
    } else if (event.option.selected === false) {
      this.remove(1);
    }
  }

  exportFrame(id: number): void {
    this.api.exportFrameLight(id).subscribe(data => {
      const contentDispositionHeader: string = data.headers.get('Content-Disposition');
      const parts: string[] = contentDispositionHeader.split(';');
      const filename = parts[1].split('=')[1];
      const blob = new Blob([data.body], { type: 'application/zip' });

      saveAs(blob, filename);
    });

  }

  handleIndicatorChange(event) {
    this.selectedParameter = 0;
    if (event.option.selected) {
      event.source.deselectAll();
      event.option._setSelected(true);
      this.selectedIndicator = event.option.value;
      this.indicatorChip = event.option.value.name;
      this.parameters = this.parametersSource.filter((parameter: Parameter) => {
        return this.selectedIndicator.id === parameter.indicator;
      });
      const indexes = {} ;
      const len = this.parameters.length;
      for ( let i = 0; i < len; i++) {
        const exminmax = (this.parameters[i]['year_min'] || 'nul' ).toString() + (this.parameters[i]['year_max'] || 'nul').toString();
        if (exminmax in indexes) {
          this.parameters[indexes[exminmax]]['original_equation'] += this.parameters[i]['original_equation'];
        } else {
          indexes[exminmax] = i;
        }
      }
      const values = Object.keys(indexes).map(function(key) {
        return indexes[key];
      });
      for ( let i = len - 1; i >= 0; i--) {
        if ( !values.includes(i) ) { this.parameters.splice(i, 1); }
      }
      this.createGraph(this.parameters[this.selectedParameter].id).subscribe(_ => {
        this.currentGraphURL = this.api.API + '/graphs/'
          + this.selectedIndicator.name + '_'
          + this.parameters[this.selectedParameter].id + '.svg';
      });
    } else if (!event.option.selected) {
      this.remove(2);
    }
  }

  handleParameterChange() {
    this.createGraph(this.parameters[this.selectedParameter].id).subscribe(_ => {
      this.currentGraphURL = this.api.API + '/graphs/'
        + this.selectedIndicator.name + '_'
        + this.parameters[this.selectedParameter].id + '.svg';
    });
    this.currentGraphURL = this.api.API + '/graphs/'
      + this.selectedIndicator.name + '_'
      + this.parameters[this.selectedParameter].id + '.svg';
  }

  remove(chip: number) {
    if (chip === 0) {
      this.selectedNomenclature = null;
      this.selectedFrame = null;
      this.selectedIndicator = null;
      this.nomenclatureChip = '';
      this.frameChip = '';
      this.indicatorChip = '';
      this.nomenclatureList.deselectAll();
      this.indicatorList.deselectAll();
      this.frameList.deselectAll();

      this.indicators = this.indicatorsSource;
      this.frames = this.framesSource;
    } else if (chip === 1) {
      this.frameList.deselectAll();
      this.indicatorList.deselectAll();
      this.frameChip = '';
      this.indicatorChip = '';
      this.selectedFrame = null;

      this.selectedIndicator = null;
      this.indicators = this.indicatorsSource;
    } else if (chip === 2) {
      this.indicatorList.deselectAll();
      this.selectedIndicator = null;
      this.indicatorChip = '';
    }
  }

  select(chip: number) {
    this.selectedIndex = chip;
  }

  selectIndicator(id: number) {
    this.selectedIndicator = this.indicators.find(data => {
      return data.id === id;
    });
    this.indicatorChip = this.selectedIndicator.name;
    this.selectedIndex = 2;
    this.indicatorList.deselectAll();
  }

  filterIndicators(chaine: string) {
    this.indicators = this.indicatorsSource.filter(indic => {
      return (indic.libelles[0] ? (indic.name.toLowerCase().includes(chaine.toLowerCase()) ||
        indic.libelles[0].libelle.toLowerCase().includes(chaine.toLowerCase())) : indic.name.toLowerCase().includes(chaine.toLowerCase()));
    });
  }

  filterFrames(chaine: string) {
    this.frames = this.framesSource.filter(frame => {
      return frame.name.includes(chaine);
    });
  }

  filterNomenclatures(chaine: string) {
    this.nomenclatures = this.nomenclaturesSource.filter(nom => {
      return nom.name.includes(chaine);
    });
  }

  createGraph(id: number): Observable<any> {
    return this.api.createGraph(id);
  }

}

