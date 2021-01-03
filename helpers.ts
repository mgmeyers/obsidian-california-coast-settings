export function stringOrDefault(str: string | undefined, def: string): string {
    return str || def;
}

export function numberOrDefault(num: number | undefined, def: number): number {
    return typeof num === 'number' ? num : def;
}