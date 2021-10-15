# non-parker-square

Trying to find a magic square of squares, see https://www.youtube.com/watch?v=aOT_bG-vWyg

Install node.js and use `npm start` to run, or simply paste the content of `non-parker-square.js` in the console (which is actually way faster for some reason).

It will try every combination of (different) number for the first four numbers of a 3x3 square, and print every magic square it find. I have runned it up to 1000 and found nothing.

Exemple of a correct magic square of squares (but with repeating numbers):

 15² |   3² |  21²
-----|------|-----
 21² |  15² |   3²
  3² |  21² |  15²

where the sum of every rows, columns and diagonals is equal to 675.
