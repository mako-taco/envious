import { EnvVarSpec } from '../types';
import { regexp } from './regexp';

export const url = (spec?: Omit<EnvVarSpec<string>, 'validate'>): EnvVarSpec<string> => regexp(/^https?:\/\/.+?/i, spec);
