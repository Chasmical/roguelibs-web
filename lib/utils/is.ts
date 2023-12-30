const isValidatorSymbol: unique symbol = Symbol();

export interface Validator<S, R> {
  (value: S): ValidationResult<R>;
  [isValidatorSymbol]: true;
  And: <R2 extends R>(otherValidator: ValidatorLike<R, R2>) => Validator<S, R2>;
  Or: <R2>(otherValidator: ValidatorLike<S, R2>) => Validator<S, R | R2>;
}
export type ValidatorFunc<S, R> = (src: S) => ValidationResult<R>;

export type ValidationResult<R> =
  | { status: "valid"; value: R; message?: FormattedMessage }
  | { status: "coerced"; value: R; message?: FormattedMessage }
  | { status: "error"; value?: never; message: FormattedMessage };

export type FormattedMessage = string | (FormattedMessage | null | undefined)[];

export type ValidatorLike<S, R> = (
  value: S,
) => ValidationResult<R> | string | [value: R, message: FormattedMessage] | null | undefined;

function createValidatorInternal<S, R, E extends Record<string, Function> = {}>(
  validator: ValidatorFunc<S, R>,
  extraMethods?: E,
): Validator<S, R> & { [N in keyof E]: WithoutFirstArg<E[N]> } {
  const instance = validator as Validator<S, R>;
  instance[isValidatorSymbol] = true;
  instance.Or = other => combineOr(instance, other);
  instance.And = other => combineAnd(instance, other);
  if (extraMethods) {
    for (const [key, transformer] of Object.entries(extraMethods)) {
      (instance as any)[key] = (...args: any[]) => transformer(instance, ...args);
    }
  }
  return instance as any;
}

export function combineAnd<S, R1, R2 extends R1>(validatorA: ValidatorLike<S, R1>, validatorB: ValidatorLike<R1, R2>) {
  const a = createValidator(validatorA);
  const b = createValidator(validatorB);

  return createValidatorInternal<S, R2>(src => {
    const resA = a(src);
    // if the first validator threw, exit immediately
    if (resA.status === "error") return resA;
    const resB = b(resA.value);
    // if the first validator has nothing to add, return resB
    if (resA.status === "valid") return resB;
    // otherwise, combine outputs from both validators
    return {
      status: resB.status === "error" ? "error" : resA.status === "coerced" ? "coerced" : resB.status,
      value: resB.value,
      message: [resA.message, resB.message],
    } as any;
  });
}
export function combineOr<S, R1, R2>(validatorA: ValidatorLike<S, R1>, validatorB: ValidatorLike<S, R2>) {
  const a = createValidator(validatorA);
  const b = createValidator(validatorB);

  return createValidatorInternal<S, R1 | R2>(src => {
    const resA = a(src);
    if (resA.status === "valid") return resA;
    const resB = b(src);
    if (resB.status === "valid") return resB;

    if (resA.status === "coerced") return resA;
    if (resB.status === "coerced") return resB;
    return {
      status: "error",
      message: [resA.message, resB.message],
    };
  });
}

type WithoutFirstArg<T> = T extends (a: any, ...args: infer Args) => infer R ? (...args: Args) => R : never;

export function createValidator<S, R, E extends Record<string, Function> = {}>(
  validator: Validator<S, R> | ValidatorLike<S, R>,
  extraMethods?: E,
): Validator<S, R> & { [N in keyof E]: WithoutFirstArg<E[N]> } {
  if (isValidatorSymbol in validator) return validator as any;

  return createValidatorInternal<S, R, E>(value => {
    const res = validator(value);
    if (res == null) {
      return { status: "valid", value: value as any as R };
    } else if (typeof res === "string") {
      return { status: "error", message: res };
    } else if (Array.isArray(res)) {
      return { status: "coerced", value: res[0], message: res[1] };
    }
    return res;
  }, extraMethods);
}

const StringValidator = createValidator(value => {
  if (typeof value !== "string") {
    if (typeof value === "number" || typeof value === "bigint" || typeof value === "boolean" || value == null) {
      return ["" + value, "{name} was coerced to a string."];
    }
    return `{name} was expected to be a string, but received type ${typeof value}.`;
  }
});

const NumberValidator = createValidator(
  value => {
    if (typeof value !== "number") {
      if (typeof value === "string") {
        const asNumber = +value;
        if (!Number.isNaN(asNumber)) {
          return [asNumber, "{name} was coerced to a number."];
        }
      } else if (typeof value === "bigint") {
        const asNumber = Number(value);
        if (Number.isInteger(asNumber) && BigInt(asNumber) === value) {
          return [asNumber, "{name} was coerced to a number."];
        }
      } else if (typeof value === "boolean") {
        return [value ? 1 : 0, "{name} was coerced to a number."];
      }
      return `{name} was expected to be a number, but received type ${typeof value}.`;
    }
  },
  {
    Between: (validator: Validator<unknown, number>, min: number | null | undefined, max: number | null | undefined) =>
      validator.And(value => {
        if (min != null && value < min) return `{name} must not be less than ${min}.`;
        if (max != null && value > max) return `{name} must not be greater than ${max}.`;
      }),
  },
);

const BooleanValidator = createValidator(value => {
  if (typeof value !== "boolean") {
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "true" || normalized === "false") {
        return [normalized === "true", "{name} was coerced to a boolean."];
      }
    } else if (typeof value === "number" || typeof value === "bigint") {
      const normalized = "" + value;
      if (normalized === "0" || normalized === "1") {
        return [normalized === "1", "{name} was coerced to a boolean."];
      }
    }
    return `{name} was expected to be a boolean, but received type ${typeof value}.`;
  }
});

interface ObjectValidatorOptions {
  ignoreMissingKeys?: boolean;
  ignoreExtraKeys?: boolean;
}
function createObjectValidator<T extends object>(
  schema: { [N in keyof T]: Validator<unknown, T[N]> },
  opt?: ObjectValidatorOptions,
) {
  const keys = Object.keys(schema) as (keyof T)[];
  return createValidator(obj => {
    const isT = (x: unknown): x is T => typeof x === "object" && x !== null && !Array.isArray(x);

    if (isT(obj)) {
      let coerced: T | undefined = undefined;
      let errored = false;
      const message: FormattedMessage = [];

      for (const key of keys) {
        if (!(key in obj) && opt?.ignoreMissingKeys) {
          continue;
        }
        const res = schema[key](obj[key]);

        if (res.status === "error") {
          errored = true;
          message.push(res.message);
        } else if (res.status === "coerced") {
          coerced ??= { ...obj };
          coerced[key] = res.value;
          message.push(res.message);
        }
      }
      if (!opt?.ignoreExtraKeys) {
        for (const key in obj) {
          if (!keys.includes(key)) {
            coerced ??= { ...obj };
            delete coerced[key];
            message.push(`{name}.${key} is not a valid object key.`);
          }
        }
      }

      if (errored) return { status: "error", message };
      if (coerced) return [coerced, message];
      return;
    }
    return `{name} was expected to be an object, but received type ${typeof obj}.`;
  });
}

const Is = {
  String: StringValidator,
  Number: NumberValidator,
  Boolean: BooleanValidator,
  Object: createObjectValidator,
  Null: createValidator<unknown, null>(value => {
    if (value !== null) return `{name} was expected to be null, but received type ${typeof value}.`;
    // if (value == null) return [null, "{name} was coerced to null."];
  }),
  Undefined: createValidator<unknown, undefined>(value => {
    if (value !== undefined) return `{name} was expected to be undefined, but received type ${typeof value}.`;
    // if (value == undefined) return [undefined, "{name} was coerced to undefined."];
  }),
};
export default Is;
