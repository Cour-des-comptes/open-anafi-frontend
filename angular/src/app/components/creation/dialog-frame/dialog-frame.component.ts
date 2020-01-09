import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Institution } from 'src/app/interfaces/institution';
import { Nomenclature } from 'src/app/interfaces/nomenclature';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { apiService } from 'src/app/services/api.service';
import { Frame } from 'src/app/interfaces/frames';
import { IdentifierType } from 'src/app/interfaces/identifier_type';
import { CustomAlertService } from '../../../services/alerts/custom-alert.service';

@Component({
  selector: 'app-dialog-frame',
  templateUrl: './dialog-frame.component.html',
  styleUrls: ['./dialog-frame.component.scss']
})
export class DialogFrameComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogFrameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Frame,
    public api: apiService,
    private customAlertService: CustomAlertService) { }

  selectedFile: File;
  selectedModelFile: File;
  fileName: string;
  modelFileName: string;
  fileList: FileList;

  institutions$: Observable<Institution[]>;
  identifiers$: Observable<IdentifierType[]>;
  nomenclatures$: Observable<Nomenclature[]>;

  identifiers: any;
  institutions: any;
  nomenclatures: any;

  institutionsControl: FormControl;
  frameNameControl: FormControl;
  frameDescriptionControl: FormControl;
  uploadedFileControl: FormControl;
  uploadedModelFileControl: FormControl;
  identifiersControl: FormControl;
  nomenclatureControl: FormControl;

  FrameForm: FormGroup;

  @ViewChild('typeInstitution') institutionSelect;

  institution_tab: any;

  loading = false;
  diameter = 30;
  error = ';';

  ngOnInit() {

    this.institutions$ = this.api.getInstitutions();
    this.identifiers$ = this.api.getIdentifierTypes();
    this.nomenclatures$ = this.api.getNomenclatures();

    this.nomenclatures$.subscribe(nomenclatures => {
      this.nomenclatures = nomenclatures;

    });

    if (this.data) {
      this.identifiersControl = new FormControl();
      this.institutionsControl = new FormControl(this.data.institutions_type, [Validators.required]);
      this.frameNameControl = new FormControl(this.data.name, [Validators.required]);
      this.frameDescriptionControl = new FormControl(this.data.description, [Validators.required]);
      this.uploadedFileControl = new FormControl({ value: null, disabled: true });
      this.uploadedModelFileControl = new FormControl({ value: null, disabled: true });
      this.nomenclatureControl = new FormControl(this.data.nomenclature);

      this.identifiers$.subscribe(data => {
        this.identifiers = data;
        this.identifiersControl.setValue(this.data.identifiers_type.map(element => element.name));
      });

      this.institutions$.subscribe(data => {
        this.institutions = data;
        this.institutionsControl.setValue(this.data.institutions_type.map(element => element.number));
      });
    } else {
      this.identifiersControl = new FormControl('', [Validators.required]);
      this.institutionsControl = new FormControl('', [Validators.required]);
      this.frameNameControl = new FormControl('', [Validators.required]);
      this.frameDescriptionControl = new FormControl('', [Validators.required]);
      this.uploadedFileControl = new FormControl({ value: null, disabled: true });
      this.uploadedModelFileControl = new FormControl({ value: null, disabled: true });
      this.nomenclatureControl = new FormControl('');

      this.identifiers$.subscribe(data => {
        this.identifiers = data;
      });

      this.institutions$.subscribe(data => {
        this.institutions = data;
        this.institutions.sort((numA, numB) => numA.number - numB.number);
      });
    }

    this.FrameForm = new FormGroup({
      institutions: this.institutionsControl,
      frameName: this.frameNameControl,
      frameDescription: this.frameDescriptionControl,
      uploadedFile: this.uploadedFileControl,
      uploadedModelFile: this.uploadedModelFileControl,
      identifierType: this.identifiersControl,
      nomenclature: this.nomenclatureControl
    });
  }

  updateValue(event): void {
    this.selectedFile = event.target.files[0];
    this.fileName = event.target.files[0].name;
    this.fileList = event.target.files;
  }

  updateModelValue(event): void {
    this.selectedModelFile = event.target.files[0];
    this.modelFileName = event.target.files[0].name;
    this.fileList = event.target.files;
  }

  create_submit() {

    const formData: FormData = new FormData();
    this.institution_tab = [];

    // Add institutions in table before append in formadata
    if (this.institutionsControl.value[0] === 'Tous') {
      this.institutionSelect.options._results.forEach(element => {
        if (element.value !== 'Tous') {
          this.institution_tab.push(element.value);
        }
      });

    } else {
      this.institution_tab = this.institutionsControl.value;

    }

    if (this.fileName) {
      formData.append('settings_file', this.selectedFile, this.selectedFile.name);
    }
    if (this.modelFileName) {
      formData.append('template_file', this.selectedModelFile, this.selectedModelFile.name);
    }
    formData.append('frame_name', this.FrameForm.value.frameName);
    formData.append('frame_description', this.FrameForm.value.frameDescription);
    formData.append('institution_types', this.institution_tab);
    formData.append('identifier_types', this.FrameForm.value.identifierType);
    formData.append('nomenclature', this.FrameForm.value.nomenclature);

    this.loading = true;

    this.api.setFrame(formData).subscribe(
      (res) => {
        this.customAlertService.setNotification({
          message: `La trame ${this.FrameForm.value.frameName} a bien été générée`,
          type: 'success'
        });

        this.dialogRef.close({ frame_created: res});
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      });

  }

  edit_submit() {

    const formData: FormData = new FormData();

    this.institution_tab = [];

    // Add institutions in table before append in formadata
    if (this.institutionsControl.value[0] === 'Tous') {
      this.institutionSelect.options._results.forEach(element => {
        if (element.value !== 'Tous') {
          this.institution_tab.push(element.value);
        }
      });

    } else {
      this.institution_tab = this.institutionsControl.value;

    }

    if (this.fileName) {
      formData.append('settings_file', this.selectedFile, this.selectedFile.name);
    }
    if (this.modelFileName) {
      formData.append('template_file', this.selectedModelFile, this.selectedModelFile.name);
    }
    formData.append('frame_name', this.FrameForm.value.frameName);
    formData.append('frame_description', this.FrameForm.value.frameDescription);
    formData.append('institution_types', this.institution_tab);
    formData.append('identifier_types', this.FrameForm.value.identifierType);
    formData.append('nomenclature', this.FrameForm.value.nomenclature);

    this.loading = true;
    this.api.editFrame(this.data.id, formData).subscribe(
      (res) => {
        this.customAlertService.setNotification({
          message: `La trame ${this.FrameForm.value.frameName} a bien été modifiée`,
          type: 'success'
        });

        this.dialogRef.close();
        this.loading = false;
      },
      () => {
        this.loading = false;
      });
  }

}

