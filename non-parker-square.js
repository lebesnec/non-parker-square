//  a | b | c
//  --|---|--
//  d | e | f
//  --|---|--
//  g | h | i

function format(x, padLength) {
    return ('' + x).padStart(padLength, ' ');
}

function printSquare(square) {
    console.log(`
        ${format(square.a, 4)}² | ${format(square.b, 4)}² | ${format(square.c, 4)}²     ${format(square.a ** 2, 7)} | ${format(square.b ** 2, 7)} | ${format(square.c ** 2, 7)}
        ------|-------|------     --------|---------|--------
        ${format(square.d, 4)}² | ${format(square.e, 4)}² | ${format(square.f, 4)}²     ${format(square.d ** 2, 7)} | ${format(square.e ** 2, 7)} | ${format(square.f ** 2, 7)}
        ------|-------|------     --------|---------|--------
        ${format(square.g, 4)}² | ${format(square.h, 4)}² | ${format(square.i, 4)}²     ${format(square.g ** 2, 7)} | ${format(square.h ** 2, 7)} | ${format(square.i ** 2, 7)}

        a² + b² + c² = ${square.a}² + ${square.b}² + ${square.c}² = ${square.a ** 2} + ${square.b ** 2} + ${square.c ** 2} = ${(square.a ** 2) + (square.b ** 2) + (square.c ** 2)}
        d² + e² + f² = ${square.d}² + ${square.e}² + ${square.f}² = ${square.d ** 2} + ${square.e ** 2} + ${square.f ** 2} = ${(square.d ** 2) + (square.e ** 2) + (square.f ** 2)}
        g² + h² + i² = ${square.g}² + ${square.h}² + ${square.i}² = ${square.g ** 2} + ${square.h ** 2} + ${square.i ** 2} = ${(square.g ** 2) + (square.h ** 2) + (square.i ** 2)}
        a² + d² + g² = ${square.a}² + ${square.d}² + ${square.g}² = ${square.a ** 2} + ${square.d ** 2} + ${square.g ** 2} = ${(square.a ** 2) + (square.d ** 2) + (square.g ** 2)}
        b² + e² + h² = ${square.b}² + ${square.e}² + ${square.h}² = ${square.b ** 2} + ${square.e ** 2} + ${square.h ** 2} = ${(square.b ** 2) + (square.e ** 2) + (square.h ** 2)}
        c² + f² + i² = ${square.c}² + ${square.f}² + ${square.i}² = ${square.c ** 2} + ${square.f ** 2} + ${square.i ** 2} = ${(square.c ** 2) + (square.f ** 2) + (square.i ** 2)}
        a² + e² + i² = ${square.a}² + ${square.e}² + ${square.i}² = ${square.a ** 2} + ${square.e ** 2} + ${square.i ** 2} = ${(square.a ** 2) + (square.e ** 2) + (square.i ** 2)}
        g² + e² + c² = ${square.g}² + ${square.e}² + ${square.c}² = ${square.g ** 2} + ${square.e ** 2} + ${square.c ** 2} = ${(square.g ** 2) + (square.e ** 2) + (square.c ** 2)}
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

const LIMIT = process.argv[2] ?? 1000;

// Precomputed square numbers and their root
const ROOTS = {};
for (let i = 0; i <= LIMIT; i++) {
    ROOTS[i ** 2] = i;
}

let squares = [];

console.log('Searching up to ' + LIMIT + '...');
console.time('Duration');

// try every combination possible for the 4 values a, b, c, d

// for (let a = 0; a <= LIMIT; a++) {
//     const aSquare = a ** 2;
//     for (let b = 0; b <= LIMIT; b++) {
//         if (a === b) {
//             continue;
//         };
//         const bSquare = b ** 2;
//         for (let c = 0; c <= LIMIT; c++) {
//             if (a === c || b === c) {
//                 continue;
//             };
//             const cSquare = c ** 2;
//             const total = aSquare + bSquare + cSquare;
//             for (let d = 0; d <= LIMIT; d++) {
//                 if (a === d || b === d || c === d) {
//                     continue;
//                 };
//                 const dSquare = d ** 2;
//                 const gSquare = total - dSquare - aSquare;
//                 const g = ROOTS[gSquare];
//                 if (g === undefined) {
//                     continue;
//                 }
//                 const eSquare = total - gSquare - cSquare;
//                 const e = ROOTS[eSquare];
//                 if (e === undefined) {
//                     continue;
//                 }
//                 const hSquare = total - eSquare - bSquare;
//                 const h = ROOTS[hSquare];
//                 if (h === undefined) {
//                     continue;
//                 }
//                 const fSquare = total - dSquare - eSquare;
//                 const f = ROOTS[fSquare];
//                 if (f === undefined) {
//                     continue;
//                 }
//                 const iSquare = total - gSquare - hSquare;
//                 const i = ROOTS[iSquare];
//                 if (i === undefined) {
//                     continue;
//                 }
//                 squares.push({
//                     a, b, c,
//                     d, e, f,
//                     g, h, i,
//                     total
//                 });
//             }
//         }
//     }
// }


for (let c = 0; c <= LIMIT; c++) {
    const cSquare = c ** 2;
    for (let d = 0; d <= LIMIT; d++) {
        if (c === d) {
            continue;
        };
        const dSquare = d ** 2;
        const cd = cSquare - dSquare;
        const ccd = cSquare + cd;
        const h = ROOTS[ccd];
        if (h === undefined) {
            continue;
        }
        for (let a = 0; a <= LIMIT; a++) {
            if (a === d || a === c) {
                continue;
            };
            const aSquare = a ** 2;
            const acd = aSquare - cd;
            const e = ROOTS[acd];
            if (e === undefined) {
                continue;
            }
            const i = ROOTS[acd - cd];
            if (i === undefined) {
                continue;
            }
            for (let b = 0; b <= LIMIT; b++) {
                if (b === d || b === c || b === a) {
                    continue;
                };
                const bSquare = b ** 2;
                const bcd = bSquare + cd;
                const total = aSquare + bSquare + cSquare;
                if (3 * acd === total) {
                    const g = ROOTS[bcd];
                    if (g === undefined) {
                        continue;
                    }
                    const f = ROOTS[bcd + cd];
                    if (f === undefined) {
                        continue;
                    }
                    squares.push({
                        a, b, c,
                        d, e, f,
                        g, h, i
                    });
                }
            }
        }
    }
}

squares.forEach(printSquare);
console.log(squares.length + (squares.length > 1 ? ' squares found.' : ' square found.'));
console.timeEnd('Duration');
