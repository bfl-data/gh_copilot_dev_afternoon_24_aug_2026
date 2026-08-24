type AnyFunction = (this: unknown, ...args: unknown[]) => void;

export type Debounced<T extends AnyFunction> = ((
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => void) & {
  cancel: () => void;
  flush: () => void;
};

/**
 * Returns a debounced version of a function.
 * Calls are delayed until no new calls happen for `waitMs`.
 */
export function debounce<T extends AnyFunction>(fn: T, waitMs: number): Debounced<T> {
  if (!Number.isFinite(waitMs) || waitMs < 0) {
    throw new RangeError('waitMs must be a non-negative finite number');
  }

  let timer: NodeJS.Timeout | undefined;
  let lastArgs: Parameters<T> | undefined;
  let lastThis: ThisParameterType<T> | undefined;

  const invoke = (): void => {
    if (lastArgs === undefined) {
      return;
    }

    fn.apply(lastThis, lastArgs);
    lastArgs = undefined;
    lastThis = undefined;
  };

  const debounced = function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    lastArgs = args;
    lastThis = this;

    if (timer !== undefined) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timer = undefined;
      invoke();
    }, waitMs);
  } as Debounced<T>;

  debounced.cancel = (): void => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }

    lastArgs = undefined;
    lastThis = undefined;
  };

  debounced.flush = (): void => {
    if (timer === undefined) {
      return;
    }

    clearTimeout(timer);
    timer = undefined;
    invoke();
  };

  return debounced;
}