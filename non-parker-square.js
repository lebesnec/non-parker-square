//  a | b | c
//  --|---|--
//  d | e | f
//  --|---|--
//  g | h | i

function formatNumber(x) {
    return ('' + x).padStart(4, ' ');
}

function printSquare(square) {
    console.log(`
        ${formatNumber(square.a)} | ${formatNumber(square.b)} | ${formatNumber(square.c)}
        -----|------|-----
        ${formatNumber(square.d)} | ${formatNumber(square.e)} | ${formatNumber(square.f)}
        -----|------|-----
        ${formatNumber(square.g)} | ${formatNumber(square.h)} | ${formatNumber(square.i)}

        Total is ${(square.a ** 2) + (square.b ** 2) + (square.c ** 2)}
    `);
}

// a + b + c = total *
// d + e + f = total *
// g + h + i = total *
// a + d + g = total *
// b + e + h = total *
// c + f + i = total  *
// a + e + i = total  *
// g + e + c = total *

/**
 * Return a "classic" magic square from the 4 first values, or false if not possible.
 */
function generateMagicSquare(a, b, c, d) {
    const square = {
        a: a, b: b, c: c,
        d: d, e: 0, f: 0,
        g: 0, h: 0, i: 0
    };

    const total = square.a + square.b + square.c;

    // square.g = total - square.a - square.d;
    square.g = square.b + square.c - square.d;

    // square.e = total - square.g - square.c;
    // square.e = square.a + square.b - square.g;
    square.e = square.a - square.c + square.d;

    // square.f = total - square.d - square.e;
    // square.f = square.a + square.b + square.c - square.d - square.e;
    square.f = square.b + 2 * square.c - 2 * square.d;

    // square.h = total - square.b - square.e;
    // square.h = square.a + square.c - square.e;
    square.h = 2 * square.c - square.d;

    // square.i = total - square.g - square.h;
    // square.i = square.a + square.b + square.c - square.g - square.h;
    square.i = square.a + 2 * square.d - 2 * square.c;

    // square.a = total - square.e - square.i;
    // square.a = square.c + square.f - square.e;
    // square.a = (square.b + 4 * square.c - 3 * square.d) / 2;

    if ((square.c + square.f + square.i === total) &&
        (square.a + square.e + square.i === total)) {
        return square;
    } else {
        return false;
    }
}

/**
 * Return a "non parker" magic square of sqaures from the 4 first values, or false if not possible.
 * aSquare, bSquare, cSquare, dSquare are a², b², c², d² precomputed for performance.
 */
function generateNonParkerMagicSquare(a, b, c, d, aSquare, bSquare, cSquare, dSquare) {
    const square = {
        a: a, b: b, c: c,
        d: d, e: 0, f: 0,
        g: 0, h: 0, i: 0
    };

    square.i = Math.sqrt(aSquare + 2 * dSquare - 2 * cSquare);
    if (!Number.isInteger(square.i)) {
        return false;
    }

    square.f = Math.sqrt(bSquare + 2 * cSquare - 2 * dSquare);
    if (!Number.isInteger(square.f)) {
        return false;
    }

    square.e = Math.sqrt(aSquare - cSquare + dSquare);
    if (!Number.isInteger(square.e)) {
        return false;
    }

    square.g = Math.sqrt(bSquare + cSquare - dSquare);
    if (!Number.isInteger(square.g)) {
        return false;
    }

    square.h = Math.sqrt(2 * cSquare - dSquare);
    if (!Number.isInteger(square.h)) {
        return false;
    }

    return square;
}

const LIMIT = 1000;
let nbSquare = 0;

console.time('Duration');

// try every combination possible for the the 4 values a, b, c, d with a ≠ b ≠ c ≠ d
for (let a = 0; a <= LIMIT; a++) {
    console.log(a);
    console.timeLog('Duration');
    const aSquare = a ** 2;
    for (let b = 0; b <= LIMIT; b++) {
        if (a !== b) {
            const bSquare = b ** 2;
            for (let c = 0; c <= LIMIT; c++) {
                if (a !== c && b !== c) {
                    const cSquare = c ** 2;
                    const maxD = Math.min(LIMIT, bSquare + cSquare);
                    const total = aSquare + bSquare + cSquare;
                    for (let d = 0; d <= maxD; d++) {
                        if (a !== d && b !== d && c !== d) {
                            const dSquare = d ** 2;
                            if (3 * aSquare + 3 * dSquare - 3 * cSquare === total) {
                                const square = generateNonParkerMagicSquare(a, b, c, d, aSquare, bSquare, cSquare, dSquare);
                                if (square) {
                                    printSquare(square);
                                    console.timeLog('Duration');
                                    nbSquare ++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
console.log(nbSquare + (nbSquare > 1 ? ' squares found.' : ' square found.'));
console.timeEnd('Duration');