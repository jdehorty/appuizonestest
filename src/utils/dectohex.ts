/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

/**
 * Taken from:
 * https://www.danvk.org/hex2dec.html
 * 
 * A function for converting hex <-> dec w/o loss of precision.
 *
 * The problem is that parseInt("0x12345...") isn't precise enough to convert
 * 64-bit integers correctly.
 *
 * Internally, this uses arrays to encode decimal digits starting with the least
 * significant:
 * 8 = [8]
 * 16 = [6, 1]
 * 1024 = [4, 2, 0, 1]
 */

// Adds two arrays for the given base (10 or 16), returning the result.
// This turns out to be the only "primitive" operation we need.
const add = (x: any, y: any, base: number) => {
    const z = [];
    const n = Math.max(x.length, y.length);
    let carry = 0;
    let i = 0;
    while (i < n || carry) {
        const xi = i < x.length ? x[i] : 0;
        const yi = i < y.length ? y[i] : 0;
        const zi = carry + xi + yi;
        z.push(zi % base);
        carry = Math.floor(zi / base);
        i++;
    }
    return z;
};

// Returns a*x, where x is an array of decimal digits and a is an ordinary
// JavaScript number. base is the number base of the array x.
const multiplyByNumber = (num: any, x: any, base: number) => {
    if (num < 0) return null;
    if (num === 0) return [];

    let result: any = [];
    let power = x;
    while (true) {
        if (num & 1) {
            result = add(result, power, base);
        }
        num = num >> 1;
        if (num === 0) break;
        power = add(power, power, base);
    }

    return result;
};

const parseToDigitsArray = (str: string, base: any) => {
    const digits = str.split('');
    const ary = [];
    for (let i = digits.length - 1; i >= 0; i--) {
        const n = parseInt(digits[i], base);
        if (isNaN(n)) return null;
        ary.push(n);
    }
    return ary;
};

const convertBase = (str: string, fromBase: number, toBase: number): string | undefined => {
    const digits = parseToDigitsArray(str, fromBase);
    if (digits === null) return undefined;

    let outArray: any = [];
    let power = [1];
    for (let i = 0; i < digits.length; i++) {
        // invariant: at this point, fromBase^i = power
        if (digits[i]) {
            outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
        }
        power = multiplyByNumber(fromBase, power, toBase);
    }

    let out = '';
    for (let j = outArray.length - 1; j >= 0; j--) {
        out += outArray[j].toString(toBase);
    }
    return out;
};

export const decToHex = (decStr: string): string | undefined => {
    const hex = convertBase(decStr, 10, 16);
    return hex ? '0x' + hex : undefined;
};

export const hexToDec = (hexStr: string): string | undefined => {
    if (hexStr.substring(0, 2) === '0x') hexStr = hexStr.substring(2);
    hexStr = hexStr.toLowerCase();
    return convertBase(hexStr, 16, 10);
};
