export type Validator<T, V = Record<string, unknown>> = (value: T, values: V) => true | string;

export const composeValidators = <T, V = Record<string, unknown>>(
  ...validators: Validator<T, V>[]
): Validator<T, V> => {
  return (value: T, values: V) => {
    for (const validator of validators) {
      const result = validator(value, values);

      if (result !== true) {
        return result;
      }
    }

    return true;
  };
};

export const isMandatory = <T>(
  message: string = 'This field is required'
): Validator<T> => {
  return (value: T) => {
    if (value === null || value === undefined || value === '') {
      return message;
    }

    return true;
  };
};

export const isEmail = (
  message: string = 'Invalid email format'
): Validator<string> => {
  return (value: string) => {
    if (!value) {
      return true;
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      return message;
    }

    return true;
  };
};

export const isPhoneNumber = (
  message: string = 'Invalid phone number format'
): Validator<string> => {
  return (value: string) => {
    if (!value) {
      return true;
    };

    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;

    if (!phoneRegex.test(value)) {
      return message;
    }

    return true;
  };
};