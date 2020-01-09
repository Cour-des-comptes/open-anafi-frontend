import { Pipe, PipeTransform } from '@angular/core';
import { Indicator } from '../interfaces/indicator';

@Pipe({
    name: 'filterIndicators'
})
export class FilterIndicatorsPipe implements PipeTransform {
    transform(indicators: Indicator[], value: string) {
        if (!value) {
            return indicators;
        }
        return indicators.filter(indicator => indicator.name.includes(value));
    }
}
