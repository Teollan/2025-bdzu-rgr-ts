export type Validator<T> = (value: T) => true | string;

export const mandatory = <T>(
  message: string = 'This field is required'
): Validator<T> => {
  return (value: T) => {
    if (value === null || value === undefined || value === '') {
      return message;
    }

    return true;
  }
}