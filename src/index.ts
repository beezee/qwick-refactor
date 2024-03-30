import * as A from 'fp-ts/Array';
import * as fn from 'fp-ts/function';
import * as O from 'fp-ts/Option';

export const doThingsAndStuff = (x: (string | undefined)[]) => {
  var temp: string[] = [];
  var temp2: string | undefined;
  var tmep3: number;
  var temp4: number;
  while (x.length) {
    temp2 = x.pop();
    if (!temp2) continue;
    for (tmep3 = 0; tmep3 < temp2.length; tmep3++)
      if (temp2 && temp2.charCodeAt(tmep3) == 32) {
        var start = tmep3++ + 1;
        var doBreak = false;
        var isFound = false;
        for (temp4 = 0; temp4 < temp.length; temp4++) {
          if (doBreak) {
            break;
          }
          tmep3 = start;
          isFound = false;
          for (var y = 0; y < temp[temp4].length; y++) {
            if (!isFound && temp[temp4].charCodeAt(y) == 32) {
              isFound = true;
              continue;
            } else if (!isFound) {
              continue;
            }

            if (!temp2.charCodeAt(tmep3) || temp2.charCodeAt(tmep3) <

              temp[temp4].charCodeAt(y)) {
              temp4--;
              if (temp4 < 0) {
                temp4 = 0;
              }
              temp.splice(temp4, 0, temp2);
              doBreak = true;
              break;
            } else if (temp2.charCodeAt(tmep3) == temp[temp4].charCodeAt(y)) {
              tmep3++;
              continue;
            } else {
              doBreak = true;
              break;
            }
          }
        }
        isFound = false;
        for (temp4 = 0; temp4 < temp.length; temp4++)
          if (temp2 === temp[temp4]) {
            isFound = true;
            break;
          }
        // Logic to see if we should add it
        if (!isFound) {
          temp.push(temp2);
        }
        break
      }
  };
  while (temp.length) {
    var newThing = temp.pop();
    x.push(newThing);
  };
};

const strLt = (l: string, r: string): boolean =>
  l === '' || l.charCodeAt(0) < r.charCodeAt(0)
    ? true
    : l.charCodeAt(0) === r.charCodeAt(0)
      ? strLt(l.slice(1), r.slice(1))
      : false

const eqOrPrefix = (l: string, r: string): boolean =>
  l.startsWith(r) && (l.length >= r.length)
  

const strWithIxAfterSpace = (x: string): [string, number] => fn.tuple(x, x.indexOf(' ') + 1)

const formatInput = (args: (string | undefined)[]): [string, number][] =>
  fn.pipe(args.slice(0), A.reverse, A.filterMap(O.fromNullable), A.filter(s => s.includes(' ')), A.map(strWithIxAfterSpace))

export const simplified = (args: (string | undefined)[]) => {
  const x = formatInput(args)
  var acc: [string, number][] = [];
  var accIx: number;
  x.forEach(([current, curIx]) => {
    for (accIx = 0; accIx < acc.length; accIx++) {
      const [prev, prevIx] = acc[accIx]
      if (eqOrPrefix(current.slice(curIx), prev.slice(prevIx)))
        continue;
      if (strLt(current.slice(curIx), prev.slice(prevIx))) {
        acc.splice(Math.max(0, accIx - 1), 0, fn.tuple(current, curIx));
      }
      break;
    }
    if (!acc.map(([h, _]) => h).includes(current)) {
      acc.push(fn.tuple(current, curIx));
    }
  });
  return acc.reverse().map(([h, _]) => h)
};

const rewindSpan = <A>(spanned: A.Spanned<A, A>): [A, A.Spanned<A, A>] =>
  fn.tuple(spanned.rest[0], ({ init: spanned.init.slice(0, -1), rest: [...spanned.init.slice(-1), ...spanned.rest] }))

const putInPlace = (xs: [string, number][], [x, ix]: [string, number]) => 
  fn.pipe(
    xs,
    A.spanLeft(([y, iy]) => eqOrPrefix(x.slice(ix), y.slice(iy))),
    rewindSpan,
    ([y, spanned]) =>
      y && strLt(x.slice(ix), y[0].slice(y[1]))
        ? [...spanned.init, fn.tuple(x, ix), ...spanned.rest]
        : [
            ...spanned.init,
            ...spanned.rest,
            ...(xs.map(([h, _]) => h).includes(x) ? [] : [fn.tuple(x, ix)])
          ])

export const cleanedUp = (args: (string | undefined)[]) => fn.pipe(
  formatInput(args),
  A.reduce([], putInPlace),
  A.reverse,
  A.map(([h, _]) => h))
