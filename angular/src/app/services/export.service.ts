import { Injectable } from '@angular/core';

import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportService {



  constructor() { }

  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';


  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.fileType });
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }

}
