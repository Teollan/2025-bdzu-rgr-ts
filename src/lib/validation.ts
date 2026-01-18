export type AsyncValidator<T, V = Record<string, unknown>> = (value: T, values: V) => Promise<true | string>;
export type SyncValidator<T, V = Record<string, unknown>> = (value: T, values: V) => true | string;
export type Validator<T, V = Record<string, unknown>> = SyncValidator<T, V> | AsyncValidator<T, V>;

export const composeValidators = <T, V = Record<string, unknown>>(
  ...validators: Validator<T, V>[]
): Validator<T, V> => {
  return async (value: T, values: V) => {
    for (const validator of validators) {
      const result = await validator(value, values);

      if (result !== true) {
        return result;
      }
    }

    return true;
  };
};

export const isMandatory = <T>(
  message: string = 'This field is required'
): SyncValidator<T> => {
  return (value: T) => {
    if (value === null || value === undefined || value === '') {
      return message;
    }

    return true;
  };
};

export const isEmail = (
  message: string = 'Invalid email format'
): SyncValidator<string> => {
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
): SyncValidator<string> => {
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

export const doesExist = <T>(
  findById: (id: T) => Promise<T | null>,
  message: string = 'Invalid foreign key value'
): AsyncValidator<T> => {
  return async (value: T) => {
    if (!value) {
      return true;
    }

    const exists = await findById(value);

    if (!exists) {
      return message;
    }

    return true;
  }
};

export const isUnique = <T>(
  findByValue: (value: T) => Promise<unknown>,
  message: string = 'This value must be unique'
): AsyncValidator<T> => {
  return async (value: T) => {
    if (!value) {
      return true;
    }

    const exists = await findByValue(value);

    if (exists) {
      return message;
    }

    return true;
  }
}