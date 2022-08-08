// For the following square (where a, b, c, d, e, f, g, h and i are perfect squares):
//  a | b | c
//  --|---|--
//  d | e | f
//  --|---|--
//  g | h | i
//
// We have the following equations labelled from [1] to [8]
// a + b + c = total [1] *
// d + e + f = total [2] *
// g + h + i = total [3] *
// a + d + g = total [4] *
// b + e + h = total [5] *
// c + f + i = total [6]
// a + e + i = total [7]
// g + e + c = total [8] *
//
// e, f, g, h and i can be calculated from a/b/c/d alone:
//
// [4] => g = total - a - d 
// [1] => g = b + c - d [9] *
//
// [8] => e = total - g - c 
// [1] => e = a + b - g
// [9] => e = a - c + d [10] *
//
// [2] => f = total - d - e
// [1] => f = a + b + c - d - e
// [10] => f = b + 2 * c - 2 * d [11] *
//
// [5] => h = total - b - e
// [1] => h = a + c - e
// [10] => h = 2 * c - d [12] *
//
// [3] => i = total - g - h
// [1] => i = a + b + c - g - h
// [9 & 11] => i = a + 2 * d - 2 * c [13] *
//
// We can define "cd" as:
// cd = c - d [14]
//
// Then e, f, g, h and i can be calculated from cd/a/b/c:
// [12 & 14] => h = c + cd
// [10 & 14] => e = a - cd
// [13 & 14] => i = a - 2 * cd
// [9 & 14] => g = b + cd
// [11 & 14] => f = b + 2 * cd

// ccd = c + cd
// acd = a - cd
// bcd = b + cd

//// [7] => a = total - e - i
//// [6] => a = c + f - e
//// [???] => a = (b + 4 * c - 3 * d) / 2;


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

const LIMIT = process.argv[2] ?? 10000;;

// Precomputed square numbers and their root
const ROOTS = new Map();
for (let i = 0; i <= Math.round(Math.sqrt(3 * (LIMIT ** 2))); i++) {
    ROOTS.set(i ** 2, i);
}

const squares = [];

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
        const h = ROOTS.get(ccd);
        if (h === undefined) {
            continue;
        }
        for (let a = 0; a <= LIMIT; a++) {
            if (a === d || a === c) {
                continue;
            };
            const aSquare = a ** 2;
            const acd = aSquare - cd;
            const e = ROOTS.get(acd);
            if (e === undefined) {
                continue;
            }
            const i = ROOTS.get(acd - cd);
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
                    const g = ROOTS.get(bcd);
                    if (g === undefined) {
                        continue;
                    }
                    const f = ROOTS.get(bcd + cd);
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
