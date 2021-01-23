import { useThrottle } from './useThrottle';

export interface DebounceAndThrottleOptions {
    immediate?: boolean;
    debounce?: boolean;
    once?: boolean;
}
export type CancelFn = () => void;

export type DebounceAndThrottleProcedure<T extends unknown[]> = (
    ...args: T
) => unknown;

export type DebounceAndThrottleProcedureResult<T extends unknown[]> = [
    DebounceAndThrottleProcedure<T>,
    CancelFn
];

/**
 * @description: Applicable in components
 */
export function useDebounce<T extends unknown[]>(
    handle: DebounceAndThrottleProcedure<T>,
    wait: number,
    options: DebounceAndThrottleOptions = {}
): DebounceAndThrottleProcedureResult<T> {
    return useThrottle(
        handle,
        wait,
        Object.assign(options, {
            debounce: true,
        })
    );
}
