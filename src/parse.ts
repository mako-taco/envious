import { EnvVarSpec, EnvVarSpecMap, ResultMap, ValidationResult } from './types';

const validValidationResult: ValidationResult = { status: 'valid' };
const noopTransform = (i: any) => i;
const noopValidate = () => validValidationResult;

/**
 * Usage:
 *
 *   const { GQL_API_URL, SHEF_WEB_URL } = getEnv({
 *     GQL_API_URL: false,
 *     SHEF_WEB_URL: {
 *       default: 'lol'
 *     }
 *   })
 *
 * Allows us to specify rules and defaults for environment variables
 */
export function parse<T extends EnvVarSpecMap>(specMap: T): ResultMap<T> {
  const details = Object.entries(specMap)
    .map<[string, EnvVarSpec<any>, string | undefined]>(([name, val]) => {
      const raw = process.env[name];
      switch (val) {
        case 'error':
          return [name, { missing: 'error' }, raw];
        case 'warn':
          return [name, { missing: 'warn' }, raw];
        case 'ignore':
          return [name, { missing: 'ignore' }, raw];
        default:
          return [name, val, raw];
      }
    })
    .map(([name, spec, raw]) => {
      const transform = spec.transform ?? noopTransform;
      const value = raw === undefined ? spec.default : transform(raw);
      const validate = spec.validate ?? noopValidate;
      const missing = value === undefined;
      const validationResult = missing ? validValidationResult : validate(value);
      return {
        name,
        missing,
        validationResult,
        value,
        spec,
      };
    });

  details
    .filter((detail) => detail.missing && detail.spec.missing === 'warn')
    .forEach((missing) => {
      console.warn(`The environment variable ${missing.name} is missing.`);
    });

  const errorMissing = details.filter((detail) => detail.missing && detail.spec.missing === 'error');
  errorMissing.forEach((missing) => {
    console.error(`The environment variable ${missing.name} is missing.`);
  });

  const errorInvalid = details.filter((detail) => detail.validationResult.status === 'invalid');
  errorInvalid.forEach((invalid) => {
    console.error(`The environment variable ${invalid.name} is invalid.`);
  });

  if (errorMissing.length || errorInvalid.length) {
    throw new Error('There were invalid or missing environment variables.');
  }

  return details.reduce<ResultMap<T>>((acc, next) => {
    acc[next.name as keyof T] = next.value;
    return acc;
  }, {} as ResultMap<T>);
}
