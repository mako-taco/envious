import { EnvVarSpec } from '../types';
export const bool = (spec?: Omit<EnvVarSpec<boolean>, 'transform'>): EnvVarSpec<boolean> => {
  return {
    transform: (input: string) => {
      switch (input.toLowerCase().trim()) {
        case 'false':
        case '0':
          return false;
        case 'true':
        case '1':
          return true;
        default:
          throw new Error(`Failed to transform ${input} into a bool`);
      }
    },
    ...spec,
  };
};
