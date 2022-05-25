import { get, writable, Writable } from 'svelte/store';
import type { StartStopNotifier } from 'svelte/types/runtime/store';

type Loggable = (<T>(store: Writable<T>) => Writable<T>) & { enabled: boolean };

function loggableFunction<T>(store?: Writable<T>) {
  if (!store) store = writable<T>();
  const w: Writable<T> = {
    update(updater) {
      update(store, updater);
    },
    set(value: T) {
      update(store, value);
    },
    subscribe(run, invalidator) {
      return store.subscribe(run, invalidator);
    }
  };
  return w;
}

(loggableFunction as Loggable).enabled = true;

/**
 * Returns a writable store that logs useful information into the console.
 *
 * Use loggable.enabled = false to disable logging at runtime
 *
 * @param store - a writable can be passed as input to wrap an existing writable
 *
 * @returns The writable that logs to the console
 */
export const loggable = loggableFunction as Loggable;

function log<T>(functionName: string, functionLink: string, newPartial: Partial<T>, prevState: T, nextState: T) {
  console.groupCollapsed(functionName, newPartial, functionLink);
  console.log('PREV STATE', prevState);
  console.log('NEXT STATE', nextState);
  (console as any).trace();
  console.groupEnd();
}

function serializer(replacer?, cycleReplacer?) {
  const stack: any[] = [],
    keys: any[] = [];

  if (cycleReplacer == null)
    cycleReplacer = function (key, value) {
      if (stack[0] === value) return '[Circular ~]';
      return '[Circular ~.' + keys.slice(0, stack.indexOf(value)).join('.') + ']';
    };

  return function (key, value) {
    if (stack.length > 0) {
      const thisPos = stack.indexOf(this);
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value);
    } else stack.push(value);

    if (replacer == null) {
      return value;
    } else {
      return replacer.call(this, key, value);
    }
  };
}

function update<T>(store: Writable<T>, action: Partial<T> | ((prevStore: T) => Partial<T>)) {
  const prevStore = get(store);

  let ps;
  if (loggable.enabled) ps = JSON.parse(JSON.stringify(prevStore, serializer()));
  const isFunction = (f) => f && {}.toString.call(f) === '[object Function]';
  const result = isFunction(action) ? (action as (prevStore: T) => Partial<T>)(prevStore) : (action as Partial<T>);
  const ns = {
    ...prevStore,
    ...result
  };
  if (loggable.enabled) {
    const err = new Error();
    const stack = err.stack;
    const stackInfo = stack.split('at ')[4].split(' ');
    const functionName = stackInfo[0];
    const functionLink = stackInfo[1];
    log(functionName, functionLink, result, ps, ns);
  }
  store.set(ns);
}

export interface Mergeable<T> extends Writable<T> {
  /**
   * Merge value with current state and inform subscribers.
   *
   * @param value - to merge
   */
  merge(value: Partial<T>): void;
}

/**
 * Returns a writable store that has a *merge* method to update the store given a partial new state
 * @param value - the initial value (type will be inferred from this object)
 * @param start (@see svelte/types/runtime/stores/index.d.ts writeable)
 */
export function mergeable<T>(initialValue?: T, start?: StartStopNotifier<T>): Mergeable<T> {
  const w = writable(initialValue, start);
  (w as Mergeable<T>).merge = (value: Partial<T>) => {
    w.set({ ...get(w), ...value });
  };
  return w as Mergeable<T>;
}
