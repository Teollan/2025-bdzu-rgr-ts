export type Validator<T, V = Record<string, unknown>> = (value: T, values: V) => true | string;

export const isMandatory = <T>(
  message: string = 'This field is required'
): Validator<T> => {
  return (value: T) => {
    if (value === null || value === undefined || value === '') {
      return message;
    }

    return true;
  }
}