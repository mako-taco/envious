export type ValidationResult = { status: 'valid' } | { status: 'invalid'; reason: string; error?: Error };

export type EnvVarSpec<T = string> = {
  /**
   * Ensures a parsed environment variable meets specified criteria
   */
  validate?: (input: T) => ValidationResult;

  /**
   * Transforms a raw environment variable (string) into a specific type
   */
  transform?: (input: string) => T;

  /**
   * Determines the behavior for when the variable is missing
   */
  missing?: 'warn' | 'error' | 'ignore';

  /**
   * A default value to provide if the variable is missing
   */
  default?: T;
};

export type EnvVarSpecMap = Record<string, EnvVarSpec<any> | 'warn' | 'error' | 'ignore'>;

export type ResultMap<T> = {
  [K in keyof T]: T[K] extends EnvVarSpec ? T[K]['default'] : string;
};
