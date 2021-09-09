import { EnvVarSpec } from '../types';
export const num = (spec?: Omit<EnvVarSpec<number>, 'validate'>): EnvVarSpec<number> => {
  return {
    transform: (input: string) => {
      const result = parseInt(input, 10);
      if (isNaN(result)) {
        throw new Error(`Failed to transform ${input} into a number`);
      }
      return result;
    },
    ...spec,
  };
};
