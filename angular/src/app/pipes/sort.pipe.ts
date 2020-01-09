
import { PipeTransform, Pipe } from '@angular/core';
import { Institution } from '../interfaces/institution';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(institutions: Institution[]): Institution[] {
    return institutions ? institutions.sort((numA, numB) => numA.number - numB.number) : [];
  }

}
