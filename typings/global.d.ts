declare interface Fn<T = any, R = T> {
    (...arg: T[]): R;
}

declare type Nullable<T> = T | null;

declare type NonNullable<T> = T extends null | undefined ? never : T;

declare type TimeoutHandle = ReturnType<typeof setTimeout>;
