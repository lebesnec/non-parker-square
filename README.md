# Non Parker square finder

Trying to find a magic square of square numbers, see [this video about the infamous "Parker square"](https://www.youtube.com/watch?v=aOT_bG-vWyg)

This algorithm will try every possible values for the central number of a 3x3 square (up to a given limit), and print every magic squares (with no repeating numbers) it find.

To run this script install node.js, run `npm install` and then use `npm start` to try every possible values <= 10000 for the central "un-squared" value of the square.
You can also use the first argument to try a higher limit, ex: `npm start 50000`. I haven't found anything yet :(
For some reason it's actually way faster to run the js script directly in the Chrome console.

Exemple of a correct magic square of squares (but with repeating numbers):

 15² |   3² |  21²
-----|------|-----
 21² |  15² |   3²
  3² |  21² |  15²

 which give

 225 |    9 |  441
-----|------|-----
 441 |  225 |    9
   9 |  441 |  225

where the sum of every rows, columns and diagonals is equal to 675.
