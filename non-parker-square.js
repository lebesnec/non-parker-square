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
         Total is ${square.total}
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

const LIMIT = 2000;

// Precomputed square numbers and their root
const ROOTS = {};
for (let i = 0; i <= LIMIT; i++) {
    ROOTS[i ** 2] = i;
}

let squares = [];

console.log('Searching up to ' + LIMIT + '...');
console.time('Duration');

// try every combination possible for the 4 values a, b, c, d
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
        if (h == null) {
            continue;
        }
        for (let a = 0; a <= LIMIT; a++) {
            if (a === d || a === c) {
                continue;
            };
            const aSquare = a ** 2;
            const acd = aSquare - cd;
            const e = ROOTS[acd];
            if (e == null) {
                continue;
            }
            const i = ROOTS[acd - cd];
            if (i == null) {
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
                    if (g == null) {
                        continue;
                    }
                    const f = ROOTS[bcd + cd];
                    if (f == null) {
                        continue;
                    }
                    const square = {
                        a, b, c,
                        d, e, f,
                        g, h, i,
                        total
                    };
                    squares.push(square);
                }
            }
        }
    }
}

squares.forEach(printSquare);
console.log(squares.length + (squares.length > 1 ? ' squares found.' : ' square found.'));
console.timeEnd('Duration');
