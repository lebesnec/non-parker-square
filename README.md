# Non Parker square finder

Trying to find a magic square of squares, see this video about the infamous "parker square" https://www.youtube.com/watch?v=aOT_bG-vWyg

It will try every combination of (different) numbers for the first four numbers of a 3x3 square, and print every magic square it find.

To run this script install node.js and use `npm start` to try every possible values <= 1000 for the first 4 digits of the square.
You can also use the first argument for a higher limit, ex: `npm start 3000`. I have try up to 10000 and found nothing :(
For some reason it's actually way faster to run the js script directly in the Chrome console.

Exemple of a correct magic square of squares (but with repeating numbers):

 15² |   3² |  21²
-----|------|-----
 21² |  15² |   3²
  3² |  21² |  15²

where the sum of every rows, columns and diagonals is equal to 675.
