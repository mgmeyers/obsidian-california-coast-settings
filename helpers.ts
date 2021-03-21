export function stringOrDefault(str: string | undefined, def: string): string {
    return str || def;
}

export function numberOrDefault(num: number | undefined, def: number): number {
    return typeof num === 'number' ? num : def;
}

export function populatedArrayOrDefault<T>(arr: Array<T> | undefined, def: Array<T>): Array<T> {
    return Array.isArray(arr) && arr.length > 0 ? arr : def;
}