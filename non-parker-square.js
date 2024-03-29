const cliProgress = require('cli-progress');

// The squares are labelled as such:
//  a | b | c
//  --|---|--
//  d | e | f
//  --|---|--
//  g | h | i
//
// and we are trying to find magic squares like:
//  a² | b² | c²
//  ---|----|---
//  d² | e² | f²
//  ---|----|---
//  g² | h² | i²
//
// which can also be expressed as:
// e² + n     | e² - n - m | e² + m
// -----------|------------|-----------
// e² - n + m | e²         | e² + n - m
// -----------|------------|-----------
// e² - m     | e² + n + m | e² - n
//
// where total = 3 * e²
// (see https://www.mathpages.com/home/kmath417/kmath417.htm)


function format(x, padLength, padString = ' ') {
    return ('' + x).padStart(padLength, padString);
}

function printSquare(square) {
    const pad = ((square.h ** 2) + '').length;

    console.log(`
        ${format(square.a, pad)}² | ${format(square.b, pad)}² | ${format(square.c, pad)}²     ${format(square.a ** 2, pad)} | ${format(square.b ** 2, pad)} | ${format(square.c ** 2, pad)}
        ${format('', pad + 2, '-')}|${format('', pad + 3, '-')}|${format('', pad + 2, '-')}     ${format('', pad + 1, '-')}|${format('', pad + 2, '-')}|${format('', pad + 1, '-')}
        ${format(square.d, pad)}² | ${format(square.e, pad)}² | ${format(square.f, pad)}²     ${format(square.d ** 2, pad)} | ${format(square.e ** 2, pad)} | ${format(square.f ** 2, pad)}
        ${format('', pad + 2, '-')}|${format('', pad + 3, '-')}|${format('', pad + 2, '-')}     ${format('', pad + 1, '-')}|${format('', pad + 2, '-')}|${format('', pad + 1, '-')}
        ${format(square.g, pad)}² | ${format(square.h, pad)}² | ${format(square.i, pad)}²     ${format(square.g ** 2, pad)} | ${format(square.h ** 2, pad)} | ${format(square.i ** 2, pad)}

        a² + b² + c² = ${square.a}² + ${square.b}² + ${square.c}² = ${square.a ** 2} + ${square.b ** 2} + ${square.c ** 2} = ${(square.a ** 2) + (square.b ** 2) + (square.c ** 2)}
        d² + e² + f² = ${square.d}² + ${square.e}² + ${square.f}² = ${square.d ** 2} + ${square.e ** 2} + ${square.f ** 2} = ${(square.d ** 2) + (square.e ** 2) + (square.f ** 2)}
        g² + h² + i² = ${square.g}² + ${square.h}² + ${square.i}² = ${square.g ** 2} + ${square.h ** 2} + ${square.i ** 2} = ${(square.g ** 2) + (square.h ** 2) + (square.i ** 2)}
        a² + d² + g² = ${square.a}² + ${square.d}² + ${square.g}² = ${square.a ** 2} + ${square.d ** 2} + ${square.g ** 2} = ${(square.a ** 2) + (square.d ** 2) + (square.g ** 2)}
        b² + e² + h² = ${square.b}² + ${square.e}² + ${square.h}² = ${square.b ** 2} + ${square.e ** 2} + ${square.h ** 2} = ${(square.b ** 2) + (square.e ** 2) + (square.h ** 2)}
        c² + f² + i² = ${square.c}² + ${square.f}² + ${square.i}² = ${square.c ** 2} + ${square.f ** 2} + ${square.i ** 2} = ${(square.c ** 2) + (square.f ** 2) + (square.i ** 2)}
        a² + e² + i² = ${square.a}² + ${square.e}² + ${square.i}² = ${square.a ** 2} + ${square.e ** 2} + ${square.i ** 2} = ${(square.a ** 2) + (square.e ** 2) + (square.i ** 2)}
        g² + e² + c² = ${square.g}² + ${square.e}² + ${square.c}² = ${square.g ** 2} + ${square.e ** 2} + ${square.c ** 2} = ${(square.g ** 2) + (square.e ** 2) + (square.c ** 2)}
        
        Check: ${isMagicSquareOfSquare(square) ? 'ok' : 'ko'}

    `);
}

function isMagicSquareOfSquare(square) {
    const r1 = (square.a ** 2) + (square.b ** 2) + (square.c ** 2);
    const r2 = (square.d ** 2) + (square.e ** 2) + (square.f ** 2);
    const r3 = (square.g ** 2) + (square.h ** 2) + (square.i ** 2);
    const c1 = (square.a ** 2) + (square.d ** 2) + (square.g ** 2);
    const c2 = (square.b ** 2) + (square.e ** 2) + (square.h ** 2);
    const c3 = (square.c ** 2) + (square.f ** 2) + (square.i ** 2);
    const d1 = (square.a ** 2) + (square.e ** 2) + (square.i ** 2);
    const d2 = (square.g ** 2) + (square.e ** 2) + (square.c ** 2);

    return r1 === r2 && r1 === r3 && r1 === c1 && r1 === c2 && r1 === c3 && r1 === d1 && r1 === d2;
}

const LIMIT = process.argv[2] ?? 10000;
const ALLOW_RECURRING_NUMBERS = false;
const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

// Precomputed square numbers and their root
const ROOTS = new Map();
// Precompute up to sqrt(2) * LIMIT because total = 3 * e² and since we already have e² in the
// center that leave a maximum of (3 * e²) - e² = 2 * e² for the squares in the other cells:
for (let i = 0; i <= Math.ceil(Math.sqrt(2) * LIMIT); i++) {
    ROOTS.set(i ** 2, i);
}
// faster to loop over an array than a map
const ROOT_ARRAY = Array.from(ROOTS.keys());

const lowerLimitNM = ALLOW_RECURRING_NUMBERS ? 0 : 1;
const squares = [];

console.log('Searching up to e = ' + LIMIT + ' (or e² = ' + (LIMIT ** 2) + ')...\n');
console.time('Duration');
progress.start(LIMIT, 0);

// Using for loop in reverse order because it's faster than .forEach().
for (let e = LIMIT; e >= 0; e--) {
    progress.increment();
    const eCube = ROOT_ARRAY[e];
    for (let a = ROOT_ARRAY.length - 1; a >= 0; a--) {
        const aCube = ROOT_ARRAY[a];
        const n = aCube - eCube;
        if (n >= lowerLimitNM && n <= eCube && ROOTS.has(eCube - n)) {
            for (let c = ROOT_ARRAY.length - 1; c >= 0; c--) {
                const cCube = ROOT_ARRAY[c];
                const m = cCube - eCube;
                if (m >= lowerLimitNM && m <= eCube && ROOTS.has(eCube - m)) {
                    if (ROOTS.has(eCube - n - m) && ROOTS.has(eCube - n + m) && ROOTS.has(eCube + n - m) && ROOTS.has(eCube + n + m)) {
                        squares.push({
                            a: ROOTS.get(aCube),         b: ROOTS.get(eCube - n - m), c: ROOTS.get(cCube),
                            d: ROOTS.get(eCube - n + m), e: ROOTS.get(eCube),         f: ROOTS.get(eCube + n - m),
                            g: ROOTS.get(eCube - m),     h: ROOTS.get(eCube + n + m), i: ROOTS.get(eCube - n)
                        });
                    }
                }
            }
        }
    }
}

progress.stop();
squares.forEach(printSquare);
console.log(squares.length + (squares.length > 1 ? ' squares found.' : ' square found.'));
console.timeEnd('Duration');
