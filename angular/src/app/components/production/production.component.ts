import { Component, OnInit, ElementRef, ViewChild, Input, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Nomenclature } from 'src/app/interfaces/nomenclature';
import { Department } from 'src/app/interfaces/department';
import { Frame } from 'src/app/interfaces/frames';
import { Institution } from 'src/app/interfaces/institution';
import { Observable, interval } from 'rxjs';
import { startWith, map, switchMap } from 'rxjs/operators';
import {
  MatAutocompleteSelectedEvent, MatAutocomplete, MatTableDataSource, MatPaginator, MatSort
} from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Identifier } from 'src/app/interfaces/identifier';
import { apiService } from 'src/app/services/api.service';
import { ReportService } from 'src/app/services/report.service';
import { saveAs } from 'file-saver';
import { Options} from 'ng5-slider';
import { MatomoTracker } from 'ngx-matomo';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { User } from 'src/app/interfaces/user';
import {CustomAlertService} from '../../services/alerts/custom-alert.service';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss'],
})
export class ProductionComponent implements OnInit, OnDestroy {

  @Input() products$: Observable<any>;

  constructor(
    private authenticationService: AuthentificationService,
    private api: apiService,
    private report_service: ReportService,
    private matomoTracker: MatomoTracker,
    private customAlertService: CustomAlertService,
    private authService: AuthentificationService) {

    this.filteredIdentifiers$ = this.identifierControl.valueChanges.pipe(
      map((value: any) => {
        if (value && this.institutionControl.value === 'all') {
          if (value.length >= 2) {
            return ((value) ? this._filter(value) : this.allIdentifiers.slice());
          }
        }
        if (this.institutionControl.value !== 'all') {
          return (value ? this._filter(value) : this.allIdentifiers.slice());
        }

      }));
  }

  loading = false;
  diameter = 30;
  error = ';';
  user: User;

  //// DATE
  financialYearMinValue = 2013;
  financialYearMaxValue = 2018;
  options: Options = {
    floor: 2009,
    ceil: 2019,
    hideLimitLabels: true,
    showTicks: true,
    step: 1,
    noSwitching: true,

  };

  institution_tab = [];
  departments_tab = [];

  ////////


  nomenclatures$: Observable<Nomenclature[]>;
  frames$: Observable<Frame[]>;
  frames: Frame[] = [];

  departments$: Observable<Department[]>;
  departments: Department[];

  institutions$: Observable<Institution[]>;
  institutions: Institution[];

  typeIdentifiers = [{ name: 'SIRET' }, { name: 'SIREN' }, { name: 'FINESS' }];

  allIdentifiers: Identifier[] = [];
  identifiers: Identifier[] = [];

  filteredIdentifiers$: Observable<Identifier[]>;
  identifierControl: FormControl = new FormControl();

  nomenclatureControl: FormControl;
  frameControl: FormControl;
  departmentControl: FormControl;
  populationMinControl: FormControl;
  populationMaxControl: FormControl;
  institutionControl: FormControl;
  identifiersControl: FormControl;
  identifiers_TypeControl: FormControl;

  reportForm: FormGroup;

  agregation = false;

  report_id: string;

  loading_diameter = 20;



  timer: any;
  username: string;



  displayedColumns: string[] = ['id', 'state', 'frame', 'identifier', 'exercice', 'date', 'download'];
  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('identifierInput') identifierInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('typeInstitution') institutionSelect;
  @ViewChild('nomenclature_selected') nomenclature_selected;



  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  ///// FUNCTIONS

  remove(identifier: Identifier): void {
    const index = this.identifiers.indexOf(identifier);
    if (index >= 0) {
      this.identifiers.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    this.identifiers.push(value);
    this.identifierInput.nativeElement.value = '';
    this.identifierControl.setValue(null);

    this.identifierInput.nativeElement.blur();

  }

  private _filter(value: string): Identifier[] {
    if ( typeof value === 'string' ) {
    const val = value.toLowerCase();
    return this.allIdentifiers.filter(
      identifier => (identifier.lbudg.toLowerCase().includes(val) || identifier.ident.toLowerCase().includes(val)));
    }
  }

  majIdentifiersList(event?: any) {

    this.resetIdentifiers();
    if (this.departmentControl.value && this.institutionControl.value && this.identifiers_TypeControl.value) {

      this.institution_tab = [];
      this.departments_tab = [];

      if (this.institutionControl.value === 'all') {
        this.institutionSelect.options._results.forEach(element => {
          if (element.value !== 'all') {
            this.institution_tab.push(element.value);
          }
        });
      } else {
        this.institution_tab.push(this.institutionControl.value);
      }

      this.departments_tab.push(this.departmentControl.value);

      this.loading = true;
      this.api.getIdentifiers(
        this.identifiers_TypeControl.value.name, this.departments_tab, this.institution_tab)
        .subscribe(
          (result) => {
            this.allIdentifiers = result;
            this.identifierControl.setValue(null);
            this.loading = false;
          },
          error => {
            this.error = error;
            this.loading = false;
          });
    }
  }

  resetIdentifiers() {
    // reset values of input field
    if (this.identifierInput) {
      this.identifierInput.nativeElement.value = '';
    }
    this.identifierControl.setValue(null);
    this.identifiers = [];
    this.allIdentifiers = [];
  }

  majFrame(event?: any) {

    if (this.frameControl.value === 'BALANCE') {
      this.nomenclature_selected.value = '';
      this.nomenclatureControl.setValue('');
      this.departmentControl.setValue('');
      this.institutionControl.setValue('');
      this.identifiers_TypeControl.setValue('');
      this.identifiersControl.setValue('');
      this.resetIdentifiers();

    }
    this.departmentControl.setValue('');
    this.institutionControl.setValue('');
    this.identifiers_TypeControl.setValue('');
    this.identifiersControl.setValue('');
    this.populationMinControl.setValue('');
    this.populationMaxControl.setValue('');

    this.resetIdentifiers();

    if (this.frameControl.value) {
      this.populationMinControl.enable();
      this.populationMaxControl.enable();
    }

  }

  agregationChange() {

    this.departmentControl.setValue('');
    this.institutionControl.setValue('');
    this.identifiers_TypeControl.setValue('');
    this.identifiersControl.setValue('');
    this.populationMinControl.setValue('');
    this.populationMaxControl.setValue('');

    this.resetIdentifiers();


  }

  ////// SUBMIT////
  submit() {

    if (this.frameControl.value === 'BALANCE') {

      const identifiersIdent: any[] = [];
      this.identifiers.forEach(identifier => {
        identifiersIdent.push(identifier.ident);
      });

      const jsonValue = {
        financial_year_min: this.financialYearMinValue,
        financial_year_max: this.financialYearMaxValue,
        identifiers: identifiersIdent,
        identifiers_type: this.identifiers_TypeControl.value.name
      };

      this.report_service.makeBalanceReport(jsonValue).subscribe(
        id => {
          this.report_id = id.report_id;

          this.matomoTracker.setUserId(this.username);
          this.matomoTracker.trackEvent('Géneration rapport', this.frameControl.value.name,
            this.frameControl.value.name + '-'
            + this.financialYearMinValue
            + '-' + this.financialYearMaxValue
            + '-' + this.identifiers_TypeControl.value.name
            + '-' + this.identifiers[0].ident);

          this.customAlertService.setNotification({
            message: `La balance ${this.report_id} va être généré.`,
            type: `information`
          });

          this.report_service.getReports().subscribe((report) => {
            this.dataSource = new MatTableDataSource(report);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        });
    } else {
      const identifiersIdent: any[] = [];
      this.identifiers.forEach(identifier => {
        identifiersIdent.push(identifier.ident);
      });
      // const index_nome: number = this.nomenclatures$.findIndex(nomenclature => nomenclature.id === this.nomenclature_selected.value);
      const jsonValue = {
        frame: this.frameControl.value.id,
        financial_year_min: this.financialYearMinValue,
        financial_year_max: this.financialYearMaxValue,
        identifiers: identifiersIdent,
        identifiers_type: this.identifiers_TypeControl.value.name,
        nomenclature : this.nomenclature_selected.value,
        institutions : this.institution_tab
      };

      this.report_service.makeReport(jsonValue).subscribe(
        id => {
          this.report_id = id.report_id;
          this.matomoTracker.setUserId(this.username);
          this.matomoTracker.trackEvent('Géneration rapport', this.frameControl.value.name,
            this.frameControl.value.name + '-'
            + this.financialYearMinValue
            + '-' + this.financialYearMaxValue
            + '-' + this.identifiers_TypeControl.value.name
            + '-' + this.identifiers[0].ident);

          this.customAlertService.setNotification({
            message: `Le rapport ${this.report_id} va être généré.`,
            type: `information`
          });

          this.report_service.getReports().subscribe((report) => {
            this.dataSource = new MatTableDataSource(report);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });

        });
    }
  }

  submit2() {

    const departments_id_tab = [];
    const institutions_id_tab = [];

    const jsonValue = {
      frame: this.frameControl.value.id,
      financial_year_min: this.financialYearMinValue,
      financial_year_max: this.financialYearMaxValue,
    };

    if (this.departmentControl.value && this.departmentControl.value.length > 0) {
      this.departmentControl.value.forEach(element => departments_id_tab.push(element.id));
      jsonValue['departments'] = departments_id_tab;
    }

    if (this.institutionControl.value && this.institutionControl.value.length > 0) {
      this.institutionControl.value.forEach(element => institutions_id_tab.push(element.id));
      jsonValue['institutions'] = institutions_id_tab;
    }

    if (this.populationMinControl.value && this.populationMinControl.value !== '') {
        jsonValue['pop_min'] = this.populationMinControl.value;
    }

    if (this.populationMaxControl.value && this.populationMaxControl.value !== '') {
        jsonValue['pop_max'] = this.populationMaxControl.value;
    }

    jsonValue['nomenclature'] = this.nomenclature_selected;


    this.report_service.makeReportAgreggate(jsonValue).subscribe(
      id => {
        this.report_id = id.report_id;

        this.matomoTracker.setUserId(this.username);
        this.matomoTracker.trackEvent('Géneration rapport agrégation', this.frameControl.value.name,
          this.frameControl.value.name + '-'
          + this.financialYearMinValue
          + '-' + this.financialYearMaxValue);

        this.customAlertService.setNotification({
          message: `Le rapport d'agrégation ${this.report_id} va être généré.`,
          type: `information`
        });

        this.report_service.getReports().subscribe((report) => {
          this.dataSource = new MatTableDataSource(report);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      });
  }
  /////////////

  downloadReport(id: number) {
    this.report_service.downloadReport(id).subscribe((data) => {
      const contentDispositionHeader: string = data.headers.get('Content-Disposition');
      const parts: string[] = contentDispositionHeader.split(';');
      const filename = parts[1].split('=')[1];
      const blob = new Blob([data.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, filename);
    });
  }

  ////// VALIDATORS

  customValidator(identifiersControl) {
    if (this.identifiers.length) {
      return undefined;
    } else {
      return { identifiersControlLength: true };
    }
  }
  ///////////

  getFrameName(element): string {
    if ( element.frame_name) {
      return element.frame_name;
    } else {
      const id = element.frame;
      let frame: Frame;
      frame = this.frames.find(element => element.id === id);
      return frame ? frame.name : '';
    }
  }

  elementCount(element_tab): number {
    let element_count = 0;
    element_count = element_tab.split(',').length;
    return element_count;
  }


  ngOnInit() {
    // the second parameter 'fr-FR' is optional
    registerLocaleData(localeFr, 'fr-FR');
    this.authService.setRouteLink('production');
    this.timer = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.report_service.getReports())
      )
      .subscribe(report => {
        this.dataSource = new MatTableDataSource(report);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      });

    this.authenticationService.getUserInfos().subscribe(result => this.username = result.username);
    this.matomoTracker.setDocumentTitle('Page Production');

    this.report_id = '';

    this.nomenclatures$ = this.api.getNomenclatures();
    this.frames$ = this.api.getFrames();
    this.frames$.subscribe(frames => {
      this.frames = frames;
    });
    this.departments$ = this.api.getDepartments();
    this.departments$.subscribe(data => {
      this.departments = data;
      this.departments.sort((nomA, nomB) => {
        return nomA.name.localeCompare(nomB.name);
      });
      this.departments = this.departments.map(element => element);
    });

    this.institutions$ = this.api.getInstitutions();
    this.institutions$.subscribe(data => {
      this.institutions = data;
      this.institutions.sort((numA, numB) => numA.number - numB.number);
    });

    this.nomenclatureControl = new FormControl('');
    this.frameControl = new FormControl('', [Validators.required]);
    this.departmentControl = new FormControl('', [Validators.required]);
    this.institutionControl = new FormControl('all', [Validators.required]);
    this.identifiersControl = new FormControl('');
    this.populationMinControl = new FormControl({ value: '', disabled: true });
    this.populationMaxControl = new FormControl({ value: '', disabled: true });
    this.identifiers_TypeControl = new FormControl('', [Validators.required]);

    this.reportForm = new FormGroup({
      nomenclature: this.nomenclatureControl,
      frame: this.frameControl,
      department: this.departmentControl,
      institution: this.institutionControl,
      identifiers: this.identifiersControl,
      identifiers_type: this.identifiers_TypeControl,
      populationMin: this.populationMinControl,
      populationMax: this.populationMaxControl

    });
  }

  ngOnDestroy() {
    this.timer.unsubscribe();
  }

  selectAllDepartments() {

  }
}
