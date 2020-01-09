import { Institution } from './institution';
import { IdentifierType } from './identifier_type';

export interface Frame {
    id: number;
    name: string;
    model_name: string;
    description: string;
    indicators: number[];
    nomenclature: number;
    identifiers_type: IdentifierType[];
    institutions_type: Institution[];

}
