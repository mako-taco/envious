import { EnvVarSpec } from '../types';
export const regexp = (regex: RegExp, spec?: Omit<EnvVarSpec<string>, 'validate'>): EnvVarSpec<string> => {
  return {
    validate: (input: string) =>
      regex.test(input)
        ? { status: 'valid' }
        : {
            status: 'invalid',
            reason: `The string "${input}" did not match the regexp ${regex}`,
          },
    ...spec,
  };
};
