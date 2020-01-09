import { Parameter } from './parameter';

export interface Indicator {
    id: number;
    name: string;
    libelles: any[];
    frames: number[];
    description: string;
    maxDepth: number;
    parameters: Parameter[];
    public: Boolean;
    last_modified_by: number;

}
