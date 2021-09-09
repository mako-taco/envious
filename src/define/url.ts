import { EnvVarSpec } from '../types';
import { regexp } from './regexp';

export const url = (): EnvVarSpec<string> => regexp(/^https?:\/\/.+?/i);
