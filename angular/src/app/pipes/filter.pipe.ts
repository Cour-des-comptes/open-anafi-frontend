import { PipeTransform, Pipe } from '@angular/core';
import { Frame } from '../interfaces/frames';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(frames: Frame[], nomenclature_selected: number): Frame[] {
    return frames  ? frames.filter(frame => (frame.nomenclature === nomenclature_selected)) : [];
  }

}
